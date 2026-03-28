'use client';

import { BarChart3, TrendingUp, Users, Clock, ArrowUpRight, ArrowDownRight, Brain, Activity, Zap } from 'lucide-react';

export default function AdminAnalytics() {
  const topPersonas = [
    { name: 'Elon Musk Clone', earnings: '$1,240', chats: '12.4k', trend: '+15%' },
    { name: 'Fitness Coach', earnings: '$890', chats: '8.2k', trend: '+5%' },
    { name: 'Therapist AI', earnings: '$650', chats: '15.1k', trend: '-2%' },
    { name: 'Chef Gordon', earnings: '$420', chats: '4.5k', trend: '+22%' },
  ];

  const predictions = [
    {
      title: 'Predicted Viral Persona',
      value: '"Crypto Advisor Pro"',
      insight: 'Trending up 45% in last 24h',
      icon: <TrendingUp className="w-4 h-4 text-emerald-400" />
    },
    {
      title: 'High-Value User Segment',
      value: 'Users aged 25-34',
      insight: 'Highest LTV predicted',
      icon: <Users className="w-4 h-4 text-indigo-400" />
    },
    {
      title: 'Churn Risk Alert',
      value: 'Free Tier Users (>30 days)',
      insight: '15% likely to churn this week',
      icon: <Activity className="w-4 h-4 text-rose-400" />
    },
    {
      title: 'Resource Optimization',
      value: 'Scale down GPU instances',
      insight: 'Low traffic expected 02:00-06:00 UTC',
      icon: <Zap className="w-4 h-4 text-amber-400" />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Analytics Panel</h1>
          <p className="text-sm text-slate-400 mt-1">Deep dive into platform metrics and AI predictions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Earning Personas */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" /> Top Earning Personas
            </h3>
            <button className="text-sm text-indigo-400 hover:text-indigo-300">View All</button>
          </div>
          <div className="space-y-4">
            {topPersonas.map((persona, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">
                    #{i + 1}
                  </div>
                  <div>
                    <div className="font-medium text-white">{persona.name}</div>
                    <div className="text-xs text-slate-400">{persona.chats} total chats</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-400">{persona.earnings}</div>
                  <div className={`text-xs flex items-center justify-end gap-1 ${persona.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                    {persona.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {persona.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Predictions */}
        <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
          <h3 className="text-lg font-semibold text-indigo-300 mb-6 flex items-center gap-2 relative z-10">
            <Brain className="w-5 h-5" /> AI Insights & Predictions
          </h3>
          
          <div className="space-y-4 relative z-10">
            {predictions.map((pred, i) => (
              <div key={i} className="bg-slate-900/50 border border-indigo-500/20 p-4 rounded-lg hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-2 text-sm text-indigo-200/70 mb-2">
                  {pred.icon}
                  {pred.title}
                </div>
                <div className="font-medium text-white">
                  {pred.value}
                </div>
                <div className="text-xs text-indigo-300/80 mt-1">{pred.insight}</div>
              </div>
            ))}

            <div className="pt-4 border-t border-indigo-500/20">
              <div className="text-sm text-indigo-200/70 mb-1">Engagement Forecast</div>
              <div className="flex items-end gap-2 h-16 mt-2">
                {[30, 40, 45, 60, 80, 100].map((h, i) => (
                  <div key={i} className="flex-1 bg-indigo-400/40 rounded-t-sm hover:bg-indigo-400/60 transition-colors cursor-pointer" style={{ height: `${h}%` }} title={`Expected: ${h}k users`}></div>
                ))}
              </div>
              <div className="text-xs text-indigo-300 mt-2 text-center">Expected 20% growth this weekend</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
