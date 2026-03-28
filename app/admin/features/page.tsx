'use client';

import { useState } from 'react';
import { Mic, Video, ShieldAlert, CreditCard, MessageSquare, Power, Settings2, Save } from 'lucide-react';

export default function AdminFeatures() {
  const [features, setFeatures] = useState([
    { id: 'voice_ai', name: 'Voice AI', description: 'Enable text-to-speech and voice input across the platform.', icon: Mic, enabled: true, category: 'core' },
    { id: 'video_ai', name: 'Video AI', description: 'Enable AI-generated video avatars and lip-syncing.', icon: Video, enabled: false, category: 'premium' },
    { id: 'nsfw_filter', name: 'NSFW Content', description: 'Allow creation and interaction with NSFW personas.', icon: ShieldAlert, enabled: false, category: 'moderation' },
    { id: 'payments', name: 'Payment System', description: 'Enable Stripe/Razorpay integration for monetization.', icon: CreditCard, enabled: true, category: 'core' },
    { id: 'chat_system', name: 'Global Chat System', description: 'Master switch for all chat functionality.', icon: MessageSquare, enabled: true, category: 'core' },
    { id: 'auto_mod', name: 'AI Auto Moderator', description: 'Self-learning AI to flag abuse and spam automatically.', icon: Settings2, enabled: true, category: 'moderation' },
  ]);

  const [saving, setSaving] = useState(false);

  const toggleFeature = (id: string) => {
    setFeatures(features.map(f => {
      if (f.id === id) {
        return { ...f, enabled: !f.enabled };
      }
      return f;
    }));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('System configuration updated successfully. Changes are now live.');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Feature Toggle System</h1>
          <p className="text-sm text-slate-400 mt-1">Live system control without code deployment</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div 
            key={feature.id} 
            className={`bg-slate-900 border rounded-xl p-6 transition-all duration-300 ${
              feature.enabled ? 'border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'border-slate-800 opacity-80'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${feature.enabled ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <button 
                onClick={() => toggleFeature(feature.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${feature.enabled ? 'bg-indigo-500' : 'bg-slate-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${feature.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-white">{feature.name}</h3>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                  feature.category === 'core' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                  feature.category === 'premium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {feature.category}
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">ID: {feature.id}</span>
              <span className={`text-xs font-medium flex items-center gap-1 ${feature.enabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                <Power className="w-3 h-3" /> {feature.enabled ? 'Live' : 'Offline'}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Emergency Kill Switch */}
      <div className="mt-12 bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" /> Emergency System Shutdown
          </h3>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Instantly disables all AI models, chat systems, and payments. Use only in case of severe security breach or critical API failure.
          </p>
        </div>
        <button 
          onClick={() => {
            if(confirm('CRITICAL WARNING: This will take the entire platform offline immediately. Are you absolutely sure?')) {
              alert('System shutdown initiated. All services offline.');
              setFeatures(features.map(f => ({ ...f, enabled: false })));
            }
          }}
          className="shrink-0 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all transform hover:scale-105"
        >
          INITIATE LOCKDOWN
        </button>
      </div>
    </div>
  );
}
