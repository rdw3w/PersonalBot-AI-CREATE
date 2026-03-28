'use client';

import { useState } from 'react';
import { Activity, Terminal, AlertCircle, CheckCircle2, Search, Filter } from 'lucide-react';

export default function AdminLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Mock Logs Data
  const [logs, setLogs] = useState([
    { id: 'log_1', type: 'info', message: 'User usr_123 logged in successfully.', source: 'AuthService', time: '10:45:12 AM' },
    { id: 'log_2', type: 'warning', message: 'High API latency detected on OpenAI endpoint (1200ms).', source: 'AIModelController', time: '10:42:05 AM' },
    { id: 'log_3', type: 'error', message: 'Failed to process payment for user usr_456. Insufficient funds.', source: 'PaymentGateway', time: '10:30:00 AM' },
    { id: 'log_4', type: 'info', message: 'New persona "Crypto Advisor" created by user usr_789.', source: 'PersonaService', time: '10:15:22 AM' },
    { id: 'log_5', type: 'error', message: 'Database connection timeout. Retrying...', source: 'DatabasePool', time: '09:55:10 AM' },
    { id: 'log_6', type: 'info', message: 'Admin SA updated system configuration.', source: 'AdminPanel', time: '09:00:00 AM' },
  ]);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) || log.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || log.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Logs & Activity Tracking</h1>
          <p className="text-sm text-slate-400 mt-1">Real-time system events and error monitoring</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <span className="text-sm font-medium text-slate-300">Debug Mode</span>
            <button 
              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors bg-slate-700"
            >
              <span className="inline-block h-3 w-3 transform rounded-full bg-white transition-transform translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col flex-1 min-h-[500px]">
        <div className="p-4 border-b border-slate-800 bg-slate-800/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-400" /> System Logs
          </h2>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search logs..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Levels</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1 p-4 font-mono text-sm bg-[#0d1117]">
          {filteredLogs.length === 0 ? (
            <div className="text-center text-slate-500 py-8">No logs match your criteria.</div>
          ) : (
            <div className="space-y-2">
              {filteredLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-2 hover:bg-white/5 rounded transition-colors group">
                  <div className="shrink-0 mt-0.5">
                    {log.type === 'info' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                    {log.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400" />}
                    {log.type === 'error' && <Activity className="w-4 h-4 text-red-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-slate-500 text-xs shrink-0">[{log.time}]</span>
                      <span className={`text-xs font-bold uppercase tracking-wider ${
                        log.type === 'info' ? 'text-blue-400' :
                        log.type === 'warning' ? 'text-amber-400' :
                        'text-red-400'
                      }`}>
                        {log.type}
                      </span>
                      <span className="text-purple-400 text-xs shrink-0">[{log.source}]</span>
                    </div>
                    <div className={`mt-1 break-words ${
                      log.type === 'error' ? 'text-red-300' : 'text-slate-300'
                    }`}>
                      {log.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
