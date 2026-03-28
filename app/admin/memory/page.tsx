'use client';

import { useState } from 'react';
import { Brain, Trash2, Search, Database, RefreshCw } from 'lucide-react';

export default function AdminMemory() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Memory Data
  const [memories, setMemories] = useState([
    { id: 'mem_1', persona: 'Elon Musk Clone', user: 'Alex Johnson', facts: 12, size: '2.4 KB', lastUpdated: '2 hours ago' },
    { id: 'mem_2', persona: 'Fitness Coach', user: 'Sarah Williams', facts: 45, size: '8.1 KB', lastUpdated: '1 day ago' },
    { id: 'mem_3', persona: 'Therapist AI', user: 'Emily Davis', facts: 120, size: '24.5 KB', lastUpdated: 'Just now' },
    { id: 'mem_4', persona: 'Chef Gordon', user: 'Mike Chen', facts: 3, size: '0.8 KB', lastUpdated: '5 days ago' },
  ]);

  const deleteMemory = (id: string) => {
    if (confirm('Are you sure you want to delete this memory context? The AI will forget everything about this user.')) {
      setMemories(memories.filter(m => m.id !== id));
    }
  };

  const resetLearning = () => {
    if (confirm('WARNING: This will reset the global learning weights for all personas. Proceed?')) {
      alert('Global learning weights reset.');
    }
  };

  const filteredMemories = memories.filter(m => 
    m.persona.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Memory System Control</h1>
          <p className="text-sm text-slate-400 mt-1">Manage long-term context and persona learning</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={resetLearning}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 text-sm font-medium rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Reset Global Learning
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Stats */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-center">
          <div className="p-3 bg-indigo-500/10 rounded-lg w-fit mb-4">
            <Database className="w-6 h-6 text-indigo-400" />
          </div>
          <h3 className="text-sm font-medium text-slate-400 mb-1">Total Vector Storage</h3>
          <div className="text-3xl font-bold text-white">45.2 GB</div>
          <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> 82% Capacity Remaining
          </div>
        </div>

        {/* Memory Logs */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/30">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" /> Persona Memory Logs
            </h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search user or persona..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="text-xs text-slate-500 uppercase bg-slate-800/50 border-b border-slate-800">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">Persona ↔ User</th>
                  <th scope="col" className="px-6 py-3 font-medium">Stored Facts</th>
                  <th scope="col" className="px-6 py-3 font-medium">Context Size</th>
                  <th scope="col" className="px-6 py-3 font-medium">Last Updated</th>
                  <th scope="col" className="px-6 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMemories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No memory logs found.</td>
                  </tr>
                ) : (
                  filteredMemories.map((mem) => (
                    <tr key={mem.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{mem.persona}</div>
                        <div className="text-xs text-slate-500">User: {mem.user}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {mem.facts} facts
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300 font-mono text-xs">{mem.size}</td>
                      <td className="px-6 py-4 text-slate-500 text-xs">{mem.lastUpdated}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => deleteMemory(mem.id)} 
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" 
                          title="Wipe Memory Context"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
