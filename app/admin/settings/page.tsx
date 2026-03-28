'use client';

import { useState } from 'react';
import { Save, Key, Globe, Paintbrush, Database } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    appName: 'PersonaAI',
    theme: 'dark',
    maxChatLimit: 100,
    openaiKey: 'sk-proj-********************************',
    stripeKey: 'sk_test_********************************',
    razorpayKey: 'rzp_test_********************************',
    geminiKey: 'AIzaSy********************************',
  });

  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('System settings updated successfully.');
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Settings</h1>
          <p className="text-sm text-slate-400 mt-1">Core platform configuration and API keys</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* General Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/30 flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">General Configuration</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Application Name</label>
                <input 
                  type="text" 
                  value={settings.appName}
                  onChange={(e) => setSettings({...settings, appName: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Default Theme</label>
                <select 
                  value={settings.theme}
                  onChange={(e) => setSettings({...settings, theme: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="dark">Dark Mode</option>
                  <option value="light">Light Mode</option>
                  <option value="system">System Default</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Max Chats Per User (Free Tier)</label>
                <input 
                  type="number" 
                  value={settings.maxChatLimit}
                  onChange={(e) => setSettings({...settings, maxChatLimit: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/30 flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-white">API Integrations</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-300">OpenAI API Key (Primary Model)</label>
                  <button type="button" onClick={() => alert('Testing OpenAI connection...')} className="text-xs text-indigo-400 hover:text-indigo-300">Test Connection</button>
                </div>
                <input 
                  type="password" 
                  value={settings.openaiKey}
                  onChange={(e) => setSettings({...settings, openaiKey: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-400 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-300">Google Gemini API Key (Fallback)</label>
                  <button type="button" onClick={() => alert('Testing Gemini connection...')} className="text-xs text-indigo-400 hover:text-indigo-300">Test Connection</button>
                </div>
                <input 
                  type="password" 
                  value={settings.geminiKey}
                  onChange={(e) => setSettings({...settings, geminiKey: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-400 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-300">Stripe Secret Key (Global)</label>
                    <button type="button" onClick={() => alert('Testing Stripe connection...')} className="text-xs text-indigo-400 hover:text-indigo-300">Test Connection</button>
                  </div>
                  <input 
                    type="password" 
                    value={settings.stripeKey}
                    onChange={(e) => setSettings({...settings, stripeKey: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-400 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-300">Razorpay Key Secret (India)</label>
                    <button type="button" onClick={() => alert('Testing Razorpay connection...')} className="text-xs text-indigo-400 hover:text-indigo-300">Test Connection</button>
                  </div>
                  <input 
                    type="password" 
                    value={settings.razorpayKey}
                    onChange={(e) => setSettings({...settings, razorpayKey: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-400 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
          >
            {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? 'Saving Changes...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
