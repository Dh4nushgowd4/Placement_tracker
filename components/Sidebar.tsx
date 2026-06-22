'use client';

import {
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
  RefreshCw,
  Menu,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export type DashboardTab =
  | 'dashboard'
  | 'applications'
  | 'interviews'
  | 'mock-interview'
  | 'drives'
  | 'offers'
  | 'analytics'
  | 'readiness'
  | 'resume'
  | 'ai-assistant'
  | 'companies'
  | 'import'
  | 'probability'
  | 'skill-gap'
  | 'recruiter-simulator'
  | 'settings';

interface SidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  totalCount: number;
  userName?: string;
  userEmail?: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({
  activeTab,
  onTabChange,
  totalCount,
  userName = 'Dhanush Gowda G',
  userEmail = 'dh4nushgowd4@gmail.com',
  isCollapsed,
  onToggleCollapse
}: SidebarProps) {

  const navItems = [
    { id: 'dashboard' as DashboardTab, label: 'Overview', icon: LayoutDashboard, desc: 'SaaS metrics & feed' },
    { id: 'applications' as DashboardTab, label: 'Applications', icon: Briefcase, desc: 'Track job pipeline', badge: totalCount },
    { id: 'import' as DashboardTab, label: 'Smart Import', icon: RefreshCw, desc: 'Sync external portals' },
    { id: 'interviews' as DashboardTab, label: 'Interviews', icon: Calendar, desc: 'Schedule & feedback' },
    { id: 'mock-interview' as DashboardTab, label: 'AI Mock Interview', icon: Mic, desc: 'Simulated voice practice' },
    { id: 'drives' as DashboardTab, label: 'Job Drives', icon: Building2, desc: 'Registration deadlines' },
    { id: 'offers' as DashboardTab, label: 'Offer Manager', icon: Award, desc: 'Accept/reject & package' },
    { id: 'analytics' as DashboardTab, label: 'Analytics', icon: BarChart2, desc: 'Success rate stats' },
    { id: 'readiness' as DashboardTab, label: 'Readiness Engine', icon: Target, desc: 'Placement score card' },
    { id: 'resume' as DashboardTab, label: 'Resume ATS', icon: FileText, desc: 'Format & keyword check' },
    { id: 'ai-assistant' as DashboardTab, label: 'AI Assistant', icon: Brain, desc: 'Roadmap & prep advice' },
    { id: 'probability' as DashboardTab, label: 'AI Predictor', icon: TrendingUp, desc: 'Placement probability' },
    { id: 'skill-gap' as DashboardTab, label: 'Skill Gap Analyst', icon: Sliders, desc: 'Ideal vs current skills' },
    { id: 'recruiter-simulator' as DashboardTab, label: 'AI Recruiter Sim', icon: Users, desc: '4-Round mock screening' },
    { id: 'companies' as DashboardTab, label: 'Company Hub', icon: Building, desc: 'Bookmarks & salary notes' },
    { id: 'settings' as DashboardTab, label: 'Settings & Profile', icon: Settings, desc: 'Export & data backups' },
  ];

  return (
    <aside
      className="flex-shrink-0 flex flex-col h-full bg-[#0B1120] border-r border-white/5 relative transition-all duration-200 select-none overflow-x-hidden"
      style={{ width: isCollapsed ? '80px' : '280px' }}
    >
      {/* Logo Segment & Hamburger Toggle */}
      <div className={`p-5 border-b border-white/5 flex items-center justify-between gap-3 ${isCollapsed ? 'flex-col justify-center' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/10 flex-shrink-0">
            <Zap size={14} className="text-white" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <span className="text-[13px] font-black text-white block tracking-tight leading-none">
                Placement
              </span>
              <span className="text-[12px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-550 to-indigo-400 block mt-0.5 leading-none">
                Tracker Pro
              </span>
            </div>
          )}
        </div>
        
        {/* Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-zinc-800/50 transition-all flex-shrink-0"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Navigation list */}
      <nav className={`p-3 space-y-1 flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        {!isCollapsed && (
          <p className="text-[9px] font-extrabold text-slate-550 uppercase tracking-widest px-3 mb-3">
            Workspace
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full rounded-xl flex items-center gap-3.5 transition-all group relative border ${
                isCollapsed ? 'justify-center p-3 w-11 h-11' : 'py-2 px-3'
              } ${
                isActive 
                  ? 'bg-purple-600/10 border-purple-500/20 text-purple-400 font-semibold shadow-inner shadow-purple-500/5' 
                  : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-zinc-900/30'
              }`}
            >
              <Icon size={15} className={`flex-shrink-0 transition-colors ${isActive ? 'text-purple-400' : 'text-slate-400 group-hover:text-purple-400'}`} />
              
              {/* Expanded items */}
              {!isCollapsed && (
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] block truncate transition-colors">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="text-[8px] bg-purple-500/15 text-purple-400 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className={`text-[8px] truncate mt-0.5 transition-colors ${isActive ? 'text-purple-450' : 'text-slate-500'}`}>{item.desc}</p>
                </div>
              )}

              {/* Collapsed hover tooltips */}
              {isCollapsed && (
                <span className="absolute left-16 bg-[#111827] border border-white/5 px-2.5 py-1.5 rounded-lg text-[9px] font-bold text-white shadow-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap ml-1">
                  {item.label} {item.badge !== undefined && item.badge > 0 ? `(${item.badge})` : ''}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User profile & footer indicators */}
      <div className={`p-4 border-t border-white/5 space-y-3 flex flex-col ${isCollapsed ? 'items-center' : ''}`}>
        
        {/* User Card */}
        <div className={`p-2 w-full rounded-xl border border-white/5 bg-zinc-950/20 relative group ${isCollapsed ? 'flex justify-center p-1 w-11 h-11 cursor-pointer' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-purple-500/10 flex-shrink-0">
              {userName.substring(0, 2).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 text-left">
                <p className="text-[10px] font-bold text-white truncate">{userName}</p>
                <p className="text-[8px] text-slate-550 truncate mt-0.5">{userEmail}</p>
              </div>
            )}
          </div>

          {/* User profile hover details for collapsed mode */}
          {isCollapsed && (
            <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-[#111827] border border-white/5 p-2.5 rounded-lg text-[9px] font-bold text-white shadow-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap ml-1 flex flex-col gap-0.5">
              <span>{userName}</span>
              <span className="text-[8px] text-slate-500 font-medium">{userEmail}</span>
            </div>
          )}
        </div>

        {/* Digital Heroes Link */}
        <a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 rounded-xl text-xs font-bold w-full transition-all border ${
            isCollapsed 
              ? 'w-11 h-11 p-0 flex items-center justify-center bg-transparent border-transparent hover:bg-zinc-900/30 text-slate-400 hover:text-white' 
              : 'py-2 px-3 bg-zinc-950/40 border-white/5 text-slate-300 hover:text-white hover:bg-zinc-900/20'
          } group relative`}
          id="sidebar-digital-heroes-btn"
        >
          <Zap size={13} className="text-purple-500 shrink-0" />
          {!isCollapsed && <span className="text-[9px] uppercase tracking-wider">Digital Heroes</span>}

          {/* Collapsed Tooltip */}
          {isCollapsed && (
            <span className="absolute left-16 bg-[#111827] border border-white/5 px-2.5 py-1.5 rounded-lg text-[9px] font-bold text-white shadow-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap ml-1">
              Built for Digital Heroes
            </span>
          )}
        </a>
      </div>
    </aside>
  );
}
