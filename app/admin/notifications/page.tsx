'use client';

import { useState } from 'react';
import { Bell, Send, Mail, Smartphone, Globe } from 'lucide-react';

export default function AdminNotifications() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('global');
  const [sending, setSending] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      alert('Notification sent successfully!');
      setTitle('');
      setMessage('');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Notification Control</h1>
          <p className="text-sm text-slate-400 mt-1">Send global messages, push notifications, and emails</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/30 flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-semibold text-white">Compose Broadcast</h2>
        </div>
        
        <form onSubmit={handleSend} className="p-6 space-y-6">
          {/* Delivery Method */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Delivery Method</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                type === 'global' ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600'
              }`}>
                <input type="radio" name="type" value="global" checked={type === 'global'} onChange={() => setType('global')} className="hidden" />
                <Globe className="w-5 h-5" />
                <div className="font-medium">Global Banner</div>
              </label>
              
              <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                type === 'push' ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600'
              }`}>
                <input type="radio" name="type" value="push" checked={type === 'push'} onChange={() => setType('push')} className="hidden" />
                <Smartphone className="w-5 h-5" />
                <div className="font-medium">Push Notification</div>
              </label>
              
              <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                type === 'email' ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600'
              }`}>
                <input type="radio" name="type" value="email" checked={type === 'email'} onChange={() => setType('email')} className="hidden" />
                <Mail className="w-5 h-5" />
                <div className="font-medium">Email Campaign</div>
              </label>
            </div>
          </div>

          {/* Message Content */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Notification Title</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., New Feature Launched 🚀"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Message Body</label>
              <textarea 
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Type your message here..."
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex justify-end">
            <button 
              type="submit"
              disabled={sending || !title || !message}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
            >
              {sending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
              {sending ? 'Broadcasting...' : 'Send Broadcast'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
