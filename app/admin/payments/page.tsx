'use client';

import { useState } from 'react';
import { DollarSign, TrendingUp, CreditCard, CheckCircle, XCircle, ArrowRightLeft, Search, Filter } from 'lucide-react';

export default function AdminPayments() {
  const [commission, setCommission] = useState(15);
  const [activeTab, setActiveTab] = useState<'withdrawals' | 'logs'>('withdrawals');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Withdrawals Data
  const [withdrawals, setWithdrawals] = useState([
    { id: 'wd_1', user: 'Alex Johnson', amount: 120.00, method: 'Stripe', status: 'pending', date: '2 hours ago' },
    { id: 'wd_2', user: 'Sarah Williams', amount: 45.50, method: 'PayPal', status: 'pending', date: '5 hours ago' },
    { id: 'wd_3', user: 'Emily Davis', amount: 320.75, method: 'UPI', status: 'approved', date: '1 day ago' },
    { id: 'wd_4', user: 'Mike Chen', amount: 80.00, method: 'Bank Transfer', status: 'rejected', date: '2 days ago' },
  ]);

  // Mock Payment Logs
  const [paymentLogs] = useState([
    { id: 'tx_1', user: 'Alex Johnson', type: 'deposit', amount: 50.00, status: 'success', date: '2023-10-27 14:30' },
    { id: 'tx_2', user: 'Sarah Williams', type: 'subscription', amount: 15.00, status: 'success', date: '2023-10-27 12:15' },
    { id: 'tx_3', user: 'Mike Chen', type: 'deposit', amount: 100.00, status: 'failed', date: '2023-10-26 09:45' },
    { id: 'tx_4', user: 'Emily Davis', type: 'withdrawal', amount: 320.75, status: 'success', date: '2023-10-25 16:20' },
    { id: 'tx_5', user: 'Spam Bot 99', type: 'deposit', amount: 10.00, status: 'refunded', date: '2023-10-24 11:10' },
  ]);

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    setWithdrawals(withdrawals.map(w => {
      if (w.id === id) {
        return { ...w, status: action === 'approve' ? 'approved' : 'rejected' };
      }
      return w;
    }));
  };

  const filteredLogs = paymentLogs.filter(log => 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Payment & Revenue Control</h1>
          <p className="text-sm text-slate-400 mt-1">Manage earnings, payouts, and platform fees</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-emerald-500/10">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-400 mb-1">Total Earnings (All Time)</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">$124,500</h3>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-indigo-500/10">
              <TrendingUp className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-400 mb-1">Platform Revenue (15%)</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">$18,675</h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-amber-500/10">
              <ArrowRightLeft className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-400 mb-1">Pending Payouts</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">$1,450</h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-center">
          <label className="text-sm font-medium text-slate-400 mb-2">Platform Commission (%)</label>
          <div className="flex items-center gap-4">
            <input 
              type="range" 
              min="0" max="50" step="1" 
              value={commission}
              onChange={(e) => setCommission(parseInt(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <span className="text-xl font-bold text-indigo-400 font-mono">{commission}%</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'withdrawals' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          Withdrawal Requests
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'logs' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          Detailed Payment Logs
        </button>
      </div>

      {activeTab === 'withdrawals' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-800 bg-slate-800/30 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-400" /> Pending Withdrawals
            </h2>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="text-xs text-slate-500 uppercase bg-slate-800/50 border-b border-slate-800">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">User</th>
                  <th scope="col" className="px-6 py-3 font-medium">Amount</th>
                  <th scope="col" className="px-6 py-3 font-medium">Method</th>
                  <th scope="col" className="px-6 py-3 font-medium">Status</th>
                  <th scope="col" className="px-6 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No withdrawal requests.</td>
                  </tr>
                ) : (
                  withdrawals.map((req) => (
                    <tr key={req.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{req.user}</div>
                        <div className="text-xs text-slate-500">{req.date}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-emerald-400">${req.amount.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-300">{req.method}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          req.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {req.status === 'pending' && (
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleAction(req.id, 'approve')} 
                              className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors" 
                              title="Approve Payout"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleAction(req.id, 'reject')} 
                              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" 
                              title="Reject Payout"
                            >
                              <XCircle className="w-5 h-5" />
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
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-800 bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-indigo-400" /> Transaction Logs
            </h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search user or TX ID..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64"
                />
              </div>
              <button className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="text-xs text-slate-500 uppercase bg-slate-800/50 border-b border-slate-800">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">Transaction ID</th>
                  <th scope="col" className="px-6 py-3 font-medium">User</th>
                  <th scope="col" className="px-6 py-3 font-medium">Type</th>
                  <th scope="col" className="px-6 py-3 font-medium">Amount</th>
                  <th scope="col" className="px-6 py-3 font-medium">Date</th>
                  <th scope="col" className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No transactions found.</td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{log.id}</td>
                      <td className="px-6 py-4 font-medium text-white">{log.user}</td>
                      <td className="px-6 py-4 capitalize">{log.type}</td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${log.type === 'withdrawal' || log.type === 'refunded' ? 'text-red-400' : 'text-emerald-400'}`}>
                          {log.type === 'withdrawal' || log.type === 'refunded' ? '-' : '+'}${log.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs">{log.date}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          log.status === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          log.status === 'failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
