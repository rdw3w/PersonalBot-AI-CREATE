'use client';

import { useState, useEffect } from 'react';
import { Bot } from '@/lib/db';
import { Search, Edit, Trash2, CheckCircle, XCircle, Settings, ShieldAlert } from 'lucide-react';

export default function AdminPersonas() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/bots')
      .then(res => res.json())
      .then(data => {
        setBots(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this persona? This action cannot be undone.')) return;
    
    try {
      const res = await fetch(`/api/bots/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBots(bots.filter(b => b.id !== id));
      } else {
        alert('Failed to delete bot');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting bot');
    }
  };

  const filteredBots = bots.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">AI Persona Control</h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search personas..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="text-xs text-slate-500 uppercase bg-slate-800/50 border-b border-slate-800">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Persona</th>
                <th scope="col" className="px-6 py-4 font-medium">Creator</th>
                <th scope="col" className="px-6 py-4 font-medium">Stats</th>
                <th scope="col" className="px-6 py-4 font-medium">Status</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading personas...</td>
                </tr>
              ) : filteredBots.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No personas found.</td>
                </tr>
              ) : (
                filteredBots.map((bot) => (
                  <tr key={bot.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={bot.avatarUrl} alt={bot.name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                        <div>
                          <div className="font-medium text-white">{bot.name}</div>
                          <div className="text-xs text-slate-500 truncate max-w-[200px]">{bot.expertise.join(', ')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">Admin</div>
                      <div className="text-xs text-slate-500">admin@persona.ai</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">{(Math.random() * 10000).toFixed(0)} chats</div>
                      <div className="text-xs text-emerald-400">${(Math.random() * 500).toFixed(2)} earned</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Active
                        </span>
                        {Math.random() > 0.8 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20" title="NSFW Flagged">
                            <ShieldAlert className="w-3 h-3 mr-1" /> NSFW
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors" title="Edit Personality">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors" title="Approve">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors" title="Disable Monetization">
                          <Settings className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(bot.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete Persona">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
