'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Bot } from '@/lib/db';
import { Save, Upload, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditBot() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === 'new';

  const [bot, setBot] = useState<Partial<Bot>>({
    name: '',
    bio: '',
    expertise: [],
    tone: 'Professional',
    responseStyle: 'Detailed',
    systemPrompt: 'You are a helpful assistant.',
    avatarUrl: `https://picsum.photos/seed/${Math.random()}/200/200`,
    knowledge: '',
    colorScheme: 'indigo',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!isNew);
  const [generatingAvatar, setGeneratingAvatar] = useState(false);

  const handleGenerateAvatar = async () => {
    if (!bot.name && !bot.bio) {
      alert('Please enter a name or bio first to generate an avatar.');
      return;
    }
    
    setGeneratingAvatar(true);
    try {
      const prompt = `${bot.name || 'AI Assistant'}. ${bot.bio || ''}`;
      const res = await fetch('/api/generate-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to generate avatar');
      }
      
      const data = await res.json();
      if (data.imageUrl) {
        setBot({ ...bot, avatarUrl: data.imageUrl });
      }
    } catch (error) {
      console.error(error);
      alert('Error generating avatar. Please try again.');
    } finally {
      setGeneratingAvatar(false);
    }
  };

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/bots/${params.id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch bot');
          return res.json();
        })
        .then((data) => {
          setBot(data);
          setFetching(false);
        })
        .catch((err) => {
          if (err.message === 'Failed to fetch' || err.message?.includes('fetch failed')) {
            alert('Network error. Please check your connection or ensure the API is reachable.');
          } else {
            console.error(err);
          }
          setFetching(false);
        });
    }
  }, [isNew, params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = isNew ? '/api/bots' : `/api/bots/${params.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const payload = { ...bot };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        alert('Failed to save bot');
      }
    } catch (error: any) {
      if (error.message === 'Failed to fetch' || error.message?.includes('fetch failed')) {
        alert('Network error. Please check your connection or ensure the API is reachable.');
      } else {
        console.error(error);
        alert('Error saving bot');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">{isNew ? 'Create New Bot' : 'Edit Bot'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-900 border-b pb-2">Basic Info</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Bot Name</label>
              <input
                type="text"
                required
                value={bot.name}
                onChange={(e) => setBot({ ...bot, name: e.target.value })}
                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                placeholder="e.g. Sarah Jenkins"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Avatar URL</label>
              <div className="mt-1 flex gap-2">
                <input
                  type="url"
                  value={bot.avatarUrl}
                  onChange={(e) => setBot({ ...bot, avatarUrl: e.target.value })}
                  className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                  placeholder="https://..."
                />
                <button
                  type="button"
                  onClick={handleGenerateAvatar}
                  disabled={generatingAvatar}
                  className="flex-shrink-0 px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-xl text-sm font-medium hover:bg-indigo-100 disabled:opacity-50 transition-colors"
                >
                  {generatingAvatar ? 'Generating...' : '✨ AI Avatar'}
                </button>
              </div>
              {bot.avatarUrl && (
                <div className="mt-3 flex items-center gap-4">
                  <img src={bot.avatarUrl} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-slate-200" />
                  <span className="text-xs text-slate-500">Avatar Preview</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Short Bio</label>
            <input
              type="text"
              required
              value={bot.bio}
              onChange={(e) => setBot({ ...bot, bio: e.target.value })}
              className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
              placeholder="e.g. Ex-FAANG Product Manager helping you land your dream job."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Expertise Tags (comma separated)</label>
            <input
              type="text"
              value={bot.expertise?.join(', ')}
              onChange={(e) => setBot({ ...bot, expertise: e.target.value.split(',').map((s) => s.trim()) })}
              className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
              placeholder="e.g. Product Management, Career Coaching"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Theme Color</label>
            <div className="flex gap-3">
              {[
                { name: 'indigo', class: 'bg-indigo-500' },
                { name: 'emerald', class: 'bg-emerald-500' },
                { name: 'rose', class: 'bg-rose-500' },
                { name: 'amber', class: 'bg-amber-500' },
                { name: 'purple', class: 'bg-purple-500' },
                { name: 'sky', class: 'bg-sky-500' }
              ].map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setBot({ ...bot, colorScheme: color.name })}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    bot.colorScheme === color.name ? 'border-slate-900 scale-110' : 'border-transparent hover:scale-105'
                  } ${color.class}`}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-6 border-t border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 border-b pb-2">Personality Configuration</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Tone</label>
              <select
                value={bot.tone}
                onChange={(e) => setBot({ ...bot, tone: e.target.value })}
                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border bg-white"
              >
                <option>Professional</option>
                <option>Friendly</option>
                <option>Witty</option>
                <option>Mentor-like</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Response Style</label>
              <select
                value={bot.responseStyle}
                onChange={(e) => setBot({ ...bot, responseStyle: e.target.value })}
                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border bg-white"
              >
                <option>Concise</option>
                <option>Detailed</option>
                <option>Conversational</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">System Prompt</label>
            <p className="text-xs text-slate-500 mb-2">Define the core identity and rules for your AI clone.</p>
            <textarea
              rows={4}
              required
              value={bot.systemPrompt}
              onChange={(e) => setBot({ ...bot, systemPrompt: e.target.value })}
              className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
              placeholder="You are a career coach who focuses on tech startups..."
            />
          </div>
        </div>

        <div className="space-y-6 pt-6 border-t border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 border-b pb-2">Knowledge Base</h2>
          <p className="text-sm text-slate-500">
            Paste your documents, notes, or resume text here. The bot will use this to answer questions.
            (In a full version, this would be a file upload zone).
          </p>
          
          <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-slate-400" />
              <div className="flex text-sm text-slate-600 justify-center">
                <span className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                  Upload a file
                </span>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-slate-500">PDF, DOCX, TXT up to 10MB</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Raw Knowledge Text</label>
            <textarea
              rows={8}
              value={bot.knowledge}
              onChange={(e) => setBot({ ...bot, knowledge: e.target.value })}
              className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border font-mono text-xs"
              placeholder="Paste your knowledge base content here..."
            />
          </div>
        </div>

        <div className="pt-6 flex justify-end gap-4 border-t border-slate-200">
          <Link
            href="/dashboard"
            className="px-6 py-3 border border-slate-300 rounded-xl shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Bot
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
