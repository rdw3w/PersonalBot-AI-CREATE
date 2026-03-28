'use client';

import { useState } from 'react';
import { Search, Ban, Trash2, Key, DollarSign, ShieldAlert, MoreVertical, X } from 'lucide-react';

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [walletAmount, setWalletAmount] = useState('');
  const [walletAction, setWalletAction] = useState<'add' | 'remove'>('add');

  // Mock Users Data
  const [users, setUsers] = useState([
    { id: 'usr_1', name: 'Alex Johnson', email: 'alex@example.com', status: 'active', balance: 150.00, chats: 1240, personas: 3, flagged: false },
    { id: 'usr_2', name: 'Sarah Williams', email: 'sarah.w@example.com', status: 'active', balance: 45.50, chats: 890, personas: 1, flagged: false },
    { id: 'usr_3', name: 'Mike Chen', email: 'mike.chen@example.com', status: 'banned', balance: 0.00, chats: 45, personas: 0, flagged: true },
    { id: 'usr_4', name: 'Emily Davis', email: 'emily.d@example.com', status: 'active', balance: 320.75, chats: 5400, personas: 5, flagged: false },
    { id: 'usr_5', name: 'Spam Bot 99', email: 'spam99@example.com', status: 'active', balance: 0.00, chats: 12000, personas: 0, flagged: true },
  ]);

  const toggleBan = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'active' ? 'banned' : 'active' };
      }
      return u;
    }));
  };

  const deleteUser = (id: string) => {
    if (confirm('Delete this user account permanently?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const resetPassword = (id: string) => {
    if (confirm('Send password reset email to this user?')) {
      alert('Password reset email sent.');
    }
  };

  const openWalletModal = (user: any) => {
    setSelectedUser(user);
    setWalletAmount('');
    setWalletAction('add');
    setWalletModalOpen(true);
  };

  const handleWalletUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(walletAmount);
    if (isNaN(amount) || amount <= 0) return;

    setUsers(users.map(u => {
      if (u.id === selectedUser.id) {
        const newBalance = walletAction === 'add' ? u.balance + amount : Math.max(0, u.balance - amount);
        return { ...u, balance: newBalance };
      }
      return u;
    }));
    setWalletModalOpen(false);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">User Management</h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search users..." 
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
                <th scope="col" className="px-6 py-4 font-medium">User</th>
                <th scope="col" className="px-6 py-4 font-medium">Status</th>
                <th scope="col" className="px-6 py-4 font-medium">Wallet</th>
                <th scope="col" className="px-6 py-4 font-medium">Activity</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Controls</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-slate-700">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-white flex items-center gap-2">
                            {user.name}
                            {user.flagged && <span title="Suspicious Activity Flagged"><ShieldAlert className="w-3 h-3 text-amber-500" /></span>}
                          </div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                          <div className="text-[10px] text-slate-600 font-mono mt-0.5">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        user.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {user.status === 'active' ? 'Active' : 'Banned'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">${user.balance.toFixed(2)}</div>
                      <button 
                        onClick={() => openWalletModal(user)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 mt-1 flex items-center gap-1"
                      >
                        <DollarSign className="w-3 h-3" /> Add/Remove
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-300">{user.chats.toLocaleString()} chats</div>
                      <div className="text-xs text-slate-500">{user.personas} personas created</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => resetPassword(user.id)} className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors" title="Reset Password">
                          <Key className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => toggleBan(user.id)} 
                          className={`p-1.5 rounded-lg transition-colors ${
                            user.status === 'active' 
                              ? 'text-slate-400 hover:text-amber-400 hover:bg-amber-400/10' 
                              : 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20'
                          }`} 
                          title={user.status === 'active' ? 'Ban User' : 'Unban User'}
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteUser(user.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete Account">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="More Options">
                          <MoreVertical className="w-4 h-4" />
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

      {/* Wallet Modal */}
      {walletModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white">Manage Wallet</h3>
              <button onClick={() => setWalletModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleWalletUpdate} className="p-6 space-y-6">
              <div>
                <p className="text-sm text-slate-400 mb-1">User</p>
                <p className="font-medium text-white">{selectedUser.name} ({selectedUser.email})</p>
                <p className="text-sm text-slate-400 mt-2">Current Balance: <span className="text-emerald-400 font-bold">${selectedUser.balance.toFixed(2)}</span></p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Action</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="walletAction" 
                        value="add" 
                        checked={walletAction === 'add'} 
                        onChange={() => setWalletAction('add')}
                        className="text-indigo-500 focus:ring-indigo-500 bg-slate-800 border-slate-700"
                      />
                      <span className="text-white">Add Funds</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="walletAction" 
                        value="remove" 
                        checked={walletAction === 'remove'} 
                        onChange={() => setWalletAction('remove')}
                        className="text-indigo-500 focus:ring-indigo-500 bg-slate-800 border-slate-700"
                      />
                      <span className="text-white">Remove Funds</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Amount ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                      type="number" 
                      min="0.01"
                      step="0.01"
                      required
                      value={walletAmount}
                      onChange={(e) => setWalletAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setWalletModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Confirm Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
