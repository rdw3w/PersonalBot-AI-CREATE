'use client';

import { Users, Bot, MessageSquare, DollarSign, Activity, Zap } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { name: 'Total Users', value: '12,450', change: '+12%', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { name: 'Active Users (Now)', value: '1,204', change: '+5%', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { name: 'Total Personas', value: '3,890', change: '+18%', icon: Bot, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { name: 'Chats Today', value: '45,210', change: '+24%', icon: MessageSquare, color: 'text-pink-400', bg: 'bg-pink-400/10' },
    { name: 'Revenue Today', value: '$4,250', change: '+8%', icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { name: 'API Usage (Tokens)', value: '12.4M', change: '+15%', icon: Zap, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs font-medium bg-slate-800 text-slate-300 rounded-md hover:bg-slate-700 transition-colors">Today</button>
          <button className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">7 Days</button>
          <button className="px-3 py-1.5 text-xs font-medium bg-slate-800 text-slate-300 rounded-md hover:bg-slate-700 transition-colors">30 Days</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-sm font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">{stat.name}</p>
              <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Area (Mocked) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Revenue Growth</h3>
          <div className="h-64 flex items-end gap-2">
            {/* Mock Bar Chart */}
            {[40, 60, 45, 80, 65, 90, 100].map((height, i) => (
              <div key={i} className="flex-1 bg-indigo-500/20 rounded-t-md relative group hover:bg-indigo-500/40 transition-colors" style={{ height: `${height}%` }}>
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  ${height * 100}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-slate-500 font-medium">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Chat Activity</h3>
          <div className="h-64 flex items-end gap-2">
            {/* Mock Bar Chart */}
            {[30, 40, 35, 50, 80, 60, 75].map((height, i) => (
              <div key={i} className="flex-1 bg-pink-500/20 rounded-t-md relative group hover:bg-pink-500/40 transition-colors" style={{ height: `${height}%` }}>
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {height * 500} msgs
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-slate-500 font-medium">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>
      </div>
    </div>
  );
}
