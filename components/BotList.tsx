'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Mic } from 'lucide-react';
import { Bot } from '@/lib/db';

export default function BotList({ initialBots }: { initialBots: Bot[] }) {
  const [activeTag, setActiveTag] = useState('All');
  
  const tags = ['All', 'Engineering', 'Product', 'Design'];

  const filteredBots = initialBots.filter((bot) => {
    if (activeTag === 'All') return true;
    // Check if any of the bot's expertise matches the active tag (case-insensitive partial match)
    return bot.expertise.some(exp => exp.toLowerCase().includes(activeTag.toLowerCase()));
  });

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Featured Experts</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {tags.map((tag) => (
            <button 
              key={tag} 
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTag === tag 
                  ? 'bg-indigo-600 text-white border-transparent' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBots.map((bot) => (
          <div key={bot.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="p-6 flex-1">
              <div className="flex items-center gap-4 mb-4">
                <img src={bot.avatarUrl} alt={bot.name} className="w-16 h-16 rounded-full border-2 border-white shadow-sm object-cover" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{bot.name}</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {bot.expertise.slice(0, 2).map((exp) => (
                      <span key={exp} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-600 line-clamp-3">{bot.bio}</p>
            </div>
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex gap-3">
              <Link href={`/chat/${bot.id}`} className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
                <MessageSquare className="w-4 h-4" />
                Chat
              </Link>
              <Link href={`/chat/${bot.id}?mode=voice`} className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                <Mic className="w-4 h-4" />
                Voice
              </Link>
            </div>
          </div>
        ))}
        
        {filteredBots.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
            <p className="text-slate-500">No bots found for this category.</p>
          </div>
        )}
      </div>
    </>
  );
}
