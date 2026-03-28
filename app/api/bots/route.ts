import { NextResponse } from 'next/server';
import { getBots, saveBot, Bot } from '@/lib/db';
import { processKnowledgeBase } from '@/lib/rag';

export async function GET() {
  const bots = await getBots();
  return NextResponse.json(bots);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Process knowledge into chunks and embeddings
    const chunks = await processKnowledgeBase(body.knowledge || '');

    const newBot: Bot = {
      id: crypto.randomUUID(),
      name: body.name || 'New Bot',
      bio: body.bio || '',
      expertise: body.expertise || [],
      tone: body.tone || 'Friendly',
      responseStyle: body.responseStyle || 'Detailed',
      systemPrompt: body.systemPrompt || 'You are a helpful assistant.',
      avatarUrl: body.avatarUrl || `https://picsum.photos/seed/${Math.random()}/200/200`,
      knowledge: body.knowledge || '',
      colorScheme: body.colorScheme || 'indigo',
      chunks,
      user_id: body.user_id,
    };
    await saveBot(newBot);
    return NextResponse.json(newBot, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Failed to fetch' || error.message?.includes('fetch failed')) {
      return NextResponse.json({ error: 'Network error. Please check your connection or ensure the API is reachable.' }, { status: 503 });
    }
    console.error('Error creating bot:', error);
    return NextResponse.json({ error: 'Failed to create bot' }, { status: 500 });
  }
}
