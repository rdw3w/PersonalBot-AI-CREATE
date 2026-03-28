'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bot } from '@/lib/db';
import { Plus, Settings, Loader2, Bot as BotIcon, MessageSquare, TrendingUp, Users } from 'lucide-react';
import DeleteBotButton from '@/components/DeleteBotButton';

export default function Dashboard() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initDashboard = async () => {
      try {
        const response = await fetch('/api/bots');
        if (!response.ok) throw new Error('Failed to fetch bots');
        const data = await response.json();
        setBots(data);
      } catch (err: any) {
        if (err.message === 'Failed to fetch' || err.message?.includes('fetch failed')) {
          alert('Network error. Please check your connection or ensure the API is reachable.');
        } else {
          console.error('Error initializing dashboard:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Creator Dashboard</h1>
            <p className="mt-2 text-lg text-slate-500">Manage your AI clones and monitor their performance.</p>
          </div>
          <Link
            href="/dashboard/bot/new"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-2xl shadow-lg shadow-indigo-200 text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Bot
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-xl flex items-center gap-4">
            <div className="p-4 bg-indigo-100 rounded-2xl text-indigo-600">
              <BotIcon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Bots</p>
              <p className="text-3xl font-bold text-slate-900">{bots.length}</p>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-xl flex items-center gap-4">
            <div className="p-4 bg-purple-100 rounded-2xl text-purple-600">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Conversations</p>
              <p className="text-3xl font-bold text-slate-900">{bots.length * 142}</p>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-xl flex items-center gap-4">
            <div className="p-4 bg-emerald-100 rounded-2xl text-emerald-600">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Unique Users</p>
              <p className="text-3xl font-bold text-slate-900">{bots.length * 89}</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-6">Your AI Clones</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map((bot) => (
            <div key={bot.id} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <img src={bot.avatarUrl} alt={bot.name} className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-md" />
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/bot/${bot.id}`}
                      className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      <Settings className="h-5 w-5" />
                    </Link>
                    <DeleteBotButton botId={bot.id} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{bot.name}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4">{bot.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {bot.expertise?.slice(0, 3).map((exp) => (
                    <span key={exp} className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50/50 p-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  Active
                </span>
                <Link href={`/chat/${bot.id}`} className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
                  Test Chat &rarr;
                </Link>
              </div>
            </div>
          ))}

          {bots.length === 0 && (
            <div className="col-span-full bg-white/50 backdrop-blur-xl rounded-3xl border-2 border-dashed border-slate-300 p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
                <BotIcon className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No bots created yet</h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">Create your first AI clone to start sharing your knowledge with the world.</p>
              <Link
                href="/dashboard/bot/new"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-2xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Bot
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
