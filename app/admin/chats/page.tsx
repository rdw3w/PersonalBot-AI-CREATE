'use client';

import { useState } from 'react';
import { Search, ShieldAlert, Trash2, Eye, Ban, MessageSquareOff } from 'lucide-react';

export default function AdminChats() {
  const [searchTerm, setSearchTerm] = useState('');
  const [autoMod, setAutoMod] = useState(true);

  // Mock Live Chats Data
  const [chats, setChats] = useState([
    { id: 'chat_1', user: 'Alex Johnson', persona: 'Elon Musk Clone', lastMessage: 'How do I build a rocket?', time: 'Just now', flagged: false, status: 'active' },
    { id: 'chat_2', user: 'Sarah Williams', persona: 'Fitness Coach', lastMessage: 'What should I eat after a workout?', time: '2 mins ago', flagged: false, status: 'active' },
    { id: 'chat_3', user: 'Spam Bot 99', persona: 'Customer Support', lastMessage: 'CLICK HERE FOR FREE MONEY http://spam.com', time: '5 mins ago', flagged: true, flagReason: 'spam', status: 'blocked' },
    { id: 'chat_4', user: 'Angry User', persona: 'Therapist AI', lastMessage: 'I hate everything you are saying you stupid bot!', time: '12 mins ago', flagged: true, flagReason: 'abuse', status: 'active' },
    { id: 'chat_5', user: 'Emily Davis', persona: 'Chef Gordon', lastMessage: 'Is this chicken raw?', time: '1 hour ago', flagged: false, status: 'active' },
  ]);

  const toggleBlock = (id: string) => {
    setChats(chats.map(c => {
      if (c.id === id) {
        return { ...c, status: c.status === 'active' ? 'blocked' : 'active' };
      }
      return c;
    }));
  };

  const deleteChat = (id: string) => {
    if (confirm('Delete this chat history permanently?')) {
      setChats(chats.filter(c => c.id !== id));
    }
  };

  const filteredChats = chats.filter(c => 
    c.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.persona.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Chat Monitoring System</h1>
          <p className="text-sm text-slate-400 mt-1">Real-time surveillance and moderation</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <span className="text-sm font-medium text-slate-300">Auto Moderation</span>
            <button 
              onClick={() => setAutoMod(!autoMod)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${autoMod ? 'bg-emerald-500' : 'bg-slate-700'}`}
            >
              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${autoMod ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="text-xs text-slate-500 uppercase bg-slate-800/50 border-b border-slate-800">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Participants</th>
                <th scope="col" className="px-6 py-4 font-medium">Last Message snippet</th>
                <th scope="col" className="px-6 py-4 font-medium">Status / Flags</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Controls</th>
              </tr>
            </thead>
            <tbody>
              {filteredChats.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No active chats found.</td>
                </tr>
              ) : (
                filteredChats.map((chat) => (
                  <tr key={chat.id} className={`border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors ${chat.flagged ? 'bg-red-500/5' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="font-medium text-white flex items-center gap-2">
                          <span className="text-indigo-400">User:</span> {chat.user}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-2">
                          <span className="text-purple-400">AI:</span> {chat.persona}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-300 truncate max-w-xs italic">"{chat.lastMessage}"</div>
                      <div className="text-[10px] text-slate-500 mt-1">{chat.time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2 items-start">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider ${
                          chat.status === 'active' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {chat.status}
                        </span>
                        {chat.flagged && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wider" title="AI Flagged Content">
                            <ShieldAlert className="w-3 h-3 mr-1" /> {chat.flagReason}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors" title="View Full Chat Log">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => toggleBlock(chat.id)} 
                          className={`p-1.5 rounded-lg transition-colors ${
                            chat.status === 'active' 
                              ? 'text-slate-400 hover:text-amber-400 hover:bg-amber-400/10' 
                              : 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20'
                          }`} 
                          title={chat.status === 'active' ? 'Block Conversation' : 'Unblock Conversation'}
                        >
                          <MessageSquareOff className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteChat(chat.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete Messages">
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
