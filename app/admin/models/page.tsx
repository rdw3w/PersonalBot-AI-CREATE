'use client';

import { useState } from 'react';
import { Cpu, Zap, Activity, ShieldAlert, Settings2, RefreshCw } from 'lucide-react';

export default function AdminModels() {
  const [activeModel, setActiveModel] = useState('gpt-4-turbo');
  const [fallbackModel, setFallbackModel] = useState('gemini-pro');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);

  const models = [
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', cost: 'High', speed: 'Medium', status: 'active' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', cost: 'Low', speed: 'Fast', status: 'standby' },
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', cost: 'Medium', speed: 'Fast', status: 'standby' },
    { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', cost: 'High', speed: 'Medium', status: 'standby' },
    { id: 'llama-3-70b', name: 'LLaMA 3 70B', provider: 'Meta (Hosted)', cost: 'Low', speed: 'Very Fast', status: 'standby' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Model Control</h1>
          <p className="text-sm text-slate-400 mt-1">Manage LLMs, costs, and performance</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" /> Sync APIs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Model Selection */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" /> Model Selection
          </h3>
          
          <div className="space-y-4">
            {models.map((model) => (
              <div 
                key={model.id} 
                onClick={() => setActiveModel(model.id)}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  activeModel === model.id 
                    ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
                    : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    activeModel === model.id ? 'border-indigo-500' : 'border-slate-600'
                  }`}>
                    {activeModel === model.id && <div className="w-2 h-2 bg-indigo-500 rounded-full" />}
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      {model.name}
                      {activeModel === model.id && <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">Active</span>}
                    </div>
                    <div className="text-xs text-slate-400">{model.provider}</div>
                  </div>
                </div>
                <div className="flex gap-4 text-xs">
                  <div className="flex flex-col items-end">
                    <span className="text-slate-500">Cost</span>
                    <span className={model.cost === 'High' ? 'text-amber-400' : 'text-emerald-400'}>{model.cost}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-slate-500">Speed</span>
                    <span className="text-blue-400">{model.speed}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800">
            <label className="block text-sm font-medium text-slate-300 mb-2">Fallback Model (If Primary Fails)</label>
            <select 
              value={fallbackModel}
              onChange={(e) => setFallbackModel(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {models.filter(m => m.id !== activeModel).map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.provider})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Model Parameters & Emergency */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-slate-400" /> Global Parameters
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-300">Temperature (Creativity)</label>
                  <span className="text-sm text-indigo-400 font-mono">{temperature}</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="2" step="0.1" 
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-300">Max Tokens per Response</label>
                  <span className="text-sm text-indigo-400 font-mono">{maxTokens}</span>
                </div>
                <input 
                  type="range" 
                  min="256" max="8192" step="256" 
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" /> API Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <span className="text-sm text-slate-300">OpenAI</span>
                <span className="text-xs font-medium text-emerald-400 flex items-center gap-1"><div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> Operational</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <span className="text-sm text-slate-300">Google</span>
                <span className="text-xs font-medium text-emerald-400 flex items-center gap-1"><div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
