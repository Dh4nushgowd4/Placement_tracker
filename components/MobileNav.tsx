'use client';

import { useState } from 'react';
import {
  Menu,
  X,
  Zap,
  ExternalLink,
  LayoutDashboard,
  Briefcase,
  Calendar,
  Mic,
  Building2,
  Award,
  BarChart2,
  Target,
  FileText,
  Brain,
  TrendingUp,
  Sliders,
  Users,
  Building,
  Settings,
  RefreshCw
} from 'lucide-react';
import { DashboardTab } from './Sidebar';

interface MobileNavProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  totalCount: number;
  userName?: string;
  userEmail?: string;
}

export function MobileNav({ activeTab, onTabChange, totalCount, userName = 'Dhanush Gowda G', userEmail = 'dh4nushgowd4@gmail.com' }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'dashboard' as DashboardTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'applications' as DashboardTab, label: 'Applications', icon: Briefcase, badge: totalCount },
    { id: 'import' as DashboardTab, label: 'Smart Import', icon: RefreshCw },
    { id: 'interviews' as DashboardTab, label: 'Interviews', icon: Calendar },
    { id: 'mock-interview' as DashboardTab, label: 'AI Mock Interview', icon: Mic },
    { id: 'drives' as DashboardTab, label: 'Job Drives', icon: Building2 },
    { id: 'offers' as DashboardTab, label: 'Offers', icon: Award },
    { id: 'analytics' as DashboardTab, label: 'Analytics', icon: BarChart2 },
    { id: 'readiness' as DashboardTab, label: 'Readiness', icon: Target },
    { id: 'resume' as DashboardTab, label: 'Resume ATS', icon: FileText },
    { id: 'ai-assistant' as DashboardTab, label: 'AI Assistant', icon: Brain },
    { id: 'probability' as DashboardTab, label: 'AI Predictor', icon: TrendingUp },
    { id: 'skill-gap' as DashboardTab, label: 'Skill Gap Analyst', icon: Sliders },
    { id: 'recruiter-simulator' as DashboardTab, label: 'AI Recruiter Sim', icon: Users },
    { id: 'companies' as DashboardTab, label: 'Company Hub', icon: Building },
    { id: 'settings' as DashboardTab, label: 'Settings', icon: Settings },
  ];

  const handleTabChange = (tab: DashboardTab) => {
    onTabChange(tab);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden glass border-b border-white/5 px-4 py-2.5 flex items-center justify-between bg-[#050816]/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <div>
            <div className="flex items-center">
              <span className="text-xs font-black text-white">Placement</span>
              <span className="text-xs font-extrabold text-purple-500 ml-1">Tracker Pro</span>
            </div>
            <p className="text-[8px] text-slate-400 font-semibold mt-0.5 leading-none">
              Dev: Dhanush Gowda G · <a href="mailto:dh4nushgowd4@gmail.com" className="underline text-purple-400">dh4nushgowd4@gmail.com</a>
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-zinc-800/40 transition-all"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#0B1120] border-r border-white/5 flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                  <Zap size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-black text-white">Placement Tracker Pro</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-zinc-850/50">
                <X size={16} />
              </button>
            </div>

            {/* Nav */}
            <nav className="p-4 space-y-1 flex-1 overflow-y-auto scrollbar-thin">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full text-left py-2.5 px-3.5 rounded-xl flex items-center gap-3 transition-all border ${
                      isActive 
                        ? 'bg-purple-600/10 border-purple-500/20 text-purple-400 font-semibold' 
                        : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-zinc-900/30'
                    }`}
                  >
                    <Icon size={15} className={isActive ? 'text-purple-400' : 'text-slate-450'} />
                    <span className="flex-1 text-[11px] font-semibold">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="text-[8px] bg-purple-550/15 text-purple-400 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* User + Button */}
            <div className="p-4 border-t border-white/5 space-y-3">
              <div className="p-3 bg-zinc-950/20 border border-white/5 rounded-xl">
                <p className="text-[10px] font-bold text-white">{userName}</p>
                <p className="text-[8px] text-slate-500 mt-0.5">{userEmail}</p>
              </div>
              <a
                href="https://digitalheroesco.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-badge w-full justify-center text-[10px]"
              >
                <Zap size={12} />
                Built for Digital Heroes
                <ExternalLink size={10} className="opacity-70" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav (Mobile - show quick 4 tabs) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/5 px-2 py-1.5 flex justify-around bg-[#050816]/95 backdrop-blur-md">
        {[
          { id: 'dashboard' as DashboardTab, label: 'Overview', icon: LayoutDashboard },
          { id: 'applications' as DashboardTab, label: 'Apps', icon: Briefcase },
          { id: 'interviews' as DashboardTab, label: 'Interviews', icon: Calendar },
          { id: 'settings' as DashboardTab, label: 'Settings', icon: Settings },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
                isActive
                  ? 'text-purple-450 bg-purple-600/10'
                  : 'text-slate-505 hover:text-slate-300'
              }`}
            >
              <Icon size={15} />
              <span className="text-[9px] font-bold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
