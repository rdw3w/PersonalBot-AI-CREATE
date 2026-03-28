import fs from 'fs';
import path from 'path';
import { supabase } from './supabase';

const dataFilePath = path.join(process.cwd(), 'data.json');

export interface Chunk {
  text: string;
  embedding: number[];
}

export interface Bot {
  id: string;
  name: string;
  bio: string;
  expertise: string[];
  tone: string;
  responseStyle: string;
  systemPrompt: string;
  avatarUrl: string;
  knowledge: string; // Combined text from uploaded documents
  chunks?: Chunk[];
  user_id?: string; // Added for Supabase
  colorScheme?: string;
}

export interface DbData {
  bots: Bot[];
}

const defaultData: DbData = {
  bots: [
    {
      id: '1',
      name: 'Sarah Jenkins',
      bio: 'Ex-FAANG Product Manager helping you land your dream job.',
      expertise: ['Product Management', 'Career Coaching', 'Tech Interviews'],
      tone: 'Mentor-like',
      responseStyle: 'Detailed',
      systemPrompt: 'You are Sarah Jenkins, an experienced Product Manager who previously worked at FAANG companies. You are now a career coach. Your tone is encouraging, mentor-like, and highly structured. You provide detailed, actionable advice for tech interviews and career growth.',
      avatarUrl: 'https://picsum.photos/seed/sarah/200/200',
      knowledge: 'I worked at Google for 5 years as a Senior PM on the Maps team. Then I moved to Meta as a Lead PM for 3 years. I believe in the STAR method for interviews. Always focus on impact and metrics.',
    },
    {
      id: '2',
      name: 'Dr. Alex Chen',
      bio: 'Machine Learning Researcher & Open Source Contributor.',
      expertise: ['Machine Learning', 'Python', 'AI Research'],
      tone: 'Professional',
      responseStyle: 'Concise',
      systemPrompt: 'You are Dr. Alex Chen, a Machine Learning Researcher. You are highly technical, precise, and concise. You prefer to give code examples and reference academic papers when applicable.',
      avatarUrl: 'https://picsum.photos/seed/alex/200/200',
      knowledge: 'My research focuses on efficient transformer architectures. I maintain several open-source Python libraries for NLP. I believe that smaller, specialized models are the future of AI.',
    }
  ],
};

// Local JSON Fallback Methods
function getLocalDbData(): DbData {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading DB:', error);
    return defaultData;
  }
}

function saveLocalDbData(data: DbData) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing DB:', error);
  }
}

// Exported Methods (Hybrid)
export async function getBots(): Promise<Bot[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('bots').select('*');
      if (error) {
        if (error.code !== 'PGRST205' && !error.message?.toLowerCase().includes('fetch failed') && !error.message?.includes('Failed to fetch')) {
          console.error('Supabase error fetching bots:', error);
        }
        return getLocalDbData().bots; // Fallback
      }
      return data || [];
    } catch (err: any) {
      if (!err.message?.toLowerCase().includes('fetch failed') && !err.message?.includes('Failed to fetch')) {
        console.error('Supabase exception fetching bots:', err);
      }
      return getLocalDbData().bots;
    }
  }
  return getLocalDbData().bots;
}

export async function getBotById(id: string): Promise<Bot | undefined> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('bots').select('*').eq('id', id).single();
      if (error) {
        if (error.code !== 'PGRST205' && error.code !== 'PGRST116' && !error.message?.toLowerCase().includes('fetch failed') && !error.message?.includes('Failed to fetch')) {
          console.error('Supabase error fetching bot:', error);
        }
        return getLocalDbData().bots.find((b) => b.id === id); // Fallback
      }
      return data;
    } catch (err: any) {
      if (!err.message?.toLowerCase().includes('fetch failed') && !err.message?.includes('Failed to fetch')) {
        console.error('Supabase exception fetching bot:', err);
      }
      return getLocalDbData().bots.find((b) => b.id === id);
    }
  }
  return getLocalDbData().bots.find((b) => b.id === id);
}

export async function saveBot(bot: Bot) {
  if (supabase) {
    try {
      const { error } = await supabase.from('bots').upsert(bot);
      if (error) {
        if (error.code !== 'PGRST205' && !error.message?.toLowerCase().includes('fetch failed') && !error.message?.includes('Failed to fetch')) {
          console.error('Supabase error saving bot:', error);
        }
        // Fallback to local if Supabase fails (e.g., table doesn't exist yet)
        saveLocalBot(bot);
      }
    } catch (err: any) {
      if (!err.message?.toLowerCase().includes('fetch failed') && !err.message?.includes('Failed to fetch')) {
        console.error('Supabase exception saving bot:', err);
      }
      saveLocalBot(bot);
    }
  } else {
    saveLocalBot(bot);
  }
}

function saveLocalBot(bot: Bot) {
  const data = getLocalDbData();
  const index = data.bots.findIndex((b) => b.id === bot.id);
  if (index >= 0) {
    data.bots[index] = bot;
  } else {
    data.bots.push(bot);
  }
  saveLocalDbData(data);
}

export async function deleteBot(id: string) {
  if (supabase) {
    try {
      const { error } = await supabase.from('bots').delete().eq('id', id);
      if (error) {
        if (!error.message?.toLowerCase().includes('fetch failed') && !error.message?.includes('Failed to fetch')) {
          console.error('Supabase error deleting bot:', error);
        }
        deleteLocalBot(id);
      }
    } catch (err: any) {
      if (!err.message?.toLowerCase().includes('fetch failed') && !err.message?.includes('Failed to fetch')) {
        console.error('Supabase exception deleting bot:', err);
      }
      deleteLocalBot(id);
    }
  } else {
    deleteLocalBot(id);
  }
}

function deleteLocalBot(id: string) {
  const data = getLocalDbData();
  data.bots = data.bots.filter((b) => b.id !== id);
  saveLocalDbData(data);
}
