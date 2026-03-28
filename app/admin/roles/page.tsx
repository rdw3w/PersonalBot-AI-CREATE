'use client';

import { useState } from 'react';
import { Key, Shield, UserCheck, Settings, Plus } from 'lucide-react';

export default function AdminRoles() {
  const [roles, setRoles] = useState([
    { id: 'role_1', name: 'Super Admin', users: 2, permissions: ['all'], color: 'text-red-400', bg: 'bg-red-500/10' },
    { id: 'role_2', name: 'Moderator', users: 5, permissions: ['users', 'chats', 'security'], color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { id: 'role_3', name: 'Support Agent', users: 12, permissions: ['chats', 'users_read'], color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Roles System</h1>
          <p className="text-sm text-slate-400 mt-1">Manage team access and permissions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Create Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${role.bg}`}>
                  <Shield className={`w-5 h-5 ${role.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-white">{role.name}</h3>
              </div>
              <button className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Assigned Users</div>
                <div className="flex items-center gap-2 text-slate-300">
                  <UserCheck className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">{role.users}</span> team members
                </div>
              </div>
              
              <div>
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Permissions</div>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((perm) => (
                    <span key={perm} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      <Key className="w-3 h-3 mr-1 text-indigo-400" />
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-800">
              <button className="w-full py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Manage Members
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
