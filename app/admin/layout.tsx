'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, Users, Bot, MessageSquare, DollarSign, 
  BarChart3, Cpu, Brain, ShieldAlert, Bell, ToggleLeft, 
  Settings, Activity, Key, LogOut, Menu, X
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Check for the simple admin cookie
    const cookies = document.cookie.split(';');
    const hasAdminCookie = cookies.some(c => c.trim().startsWith('admin_auth=true'));
    
    if (!hasAdminCookie) {
      router.push('/admin');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized && pathname !== '/admin') {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Verifying access...</div>;
  }

  // If on login page, don't show layout
  if (pathname === '/admin') {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'AI Persona Control', href: '/admin/personas', icon: Bot },
    { name: 'Chat Monitoring', href: '/admin/chats', icon: MessageSquare },
    { name: 'Payment & Revenue', href: '/admin/payments', icon: DollarSign },
    { name: 'Analytics Panel', href: '/admin/analytics', icon: BarChart3 },
    { name: 'AI Model Control', href: '/admin/models', icon: Cpu },
    { name: 'Memory System', href: '/admin/memory', icon: Brain },
    { name: 'Security & Moderation', href: '/admin/security', icon: ShieldAlert },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell },
    { name: 'Feature Toggles', href: '/admin/features', icon: ToggleLeft },
    { name: 'System Settings', href: '/admin/settings', icon: Settings },
    { name: 'Logs & Activity', href: '/admin/logs', icon: Activity },
    { name: 'Admin Roles', href: '/admin/roles', icon: Key },
  ];

  const handleLogout = () => {
    document.cookie = "admin_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 flex overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 flex flex-col`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-indigo-500" />
            <span className="font-bold text-white tracking-tight">Admin<span className="text-indigo-500">Pro</span></span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                {item.name}
              </Link>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Secure Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md z-40">
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-emerald-400">System Online</span>
            </div>
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-slate-800 shadow-lg">
              SA
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
