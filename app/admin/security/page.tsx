'use client';

import { useState } from 'react';
import { ShieldAlert, AlertTriangle, Ban, Eye, Lock, ServerCrash } from 'lucide-react';

export default function AdminSecurity() {
  const [bannedWords, setBannedWords] = useState('abuse, illegal, spam, hate, violence');
  const [autoBan, setAutoBan] = useState(true);

  // Mock Reports Data
  const [reports, setReports] = useState([
    { id: 'rep_1', user: 'Spam Bot 99', type: 'Spam', severity: 'High', status: 'pending', date: '10 mins ago' },
    { id: 'rep_2', user: 'Angry User', type: 'Abuse', severity: 'Medium', status: 'reviewed', date: '1 hour ago' },
    { id: 'rep_3', user: 'Hacker123', type: 'Suspicious Login', severity: 'Critical', status: 'pending', date: '2 hours ago' },
  ]);

  const handleAction = (id: string, action: 'ban' | 'dismiss') => {
    setReports(reports.map(r => {
      if (r.id === id) {
        return { ...r, status: action === 'ban' ? 'resolved (banned)' : 'dismissed' };
      }
      return r;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Security & Moderation</h1>
          <p className="text-sm text-slate-400 mt-1">Manage abuse reports, banned words, and platform safety</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <span className="text-sm font-medium text-slate-300">Auto-Ban System</span>
            <button 
              onClick={() => setAutoBan(!autoBan)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${autoBan ? 'bg-red-500' : 'bg-slate-700'}`}
            >
              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${autoBan ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Banned Words & Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" /> Content Filters
          </h3>
          <div className="space-y-4 flex-1">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Banned Words List (comma separated)</label>
              <textarea 
                value={bannedWords}
                onChange={(e) => setBannedWords(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>
            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-sm font-medium text-slate-300 mb-2">Active Protections</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> AI Content Moderation</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> Anti-Bot Protection (Cloudflare)</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> IP Rate Limiting</li>
              </ul>
            </div>
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
            Update Filters
          </button>
        </div>

        {/* Abuse Reports */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-800 bg-slate-800/30">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400" /> Active Incident Reports
            </h2>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="text-xs text-slate-500 uppercase bg-slate-800/50 border-b border-slate-800">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">User / Entity</th>
                  <th scope="col" className="px-6 py-3 font-medium">Violation Type</th>
                  <th scope="col" className="px-6 py-3 font-medium">Severity</th>
                  <th scope="col" className="px-6 py-3 font-medium">Status</th>
                  <th scope="col" className="px-6 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No active reports.</td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr key={report.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{report.user}</div>
                        <div className="text-xs text-slate-500">{report.date}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          <span className="text-slate-300">{report.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          report.severity === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          report.severity === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {report.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium ${
                          report.status === 'pending' ? 'text-amber-400' : 
                          report.status.includes('banned') ? 'text-red-400' : 'text-slate-500'
                        }`}>
                          {report.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {report.status === 'pending' && (
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleAction(report.id, 'dismiss')} 
                              className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors" 
                              title="Dismiss Report"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleAction(report.id, 'ban')} 
                              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" 
                              title="Ban User/IP"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          </div>
                        )}
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
