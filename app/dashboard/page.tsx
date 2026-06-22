'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, LayoutDashboard, Table, BarChart2, Sparkles, Zap, ExternalLink,
  User, Mail, Calendar, Clock, Building2, Package, Target, FileText,
  Settings, Bell, Search, LogOut, Download, Upload, ShieldAlert,
  HelpCircle, CheckCircle2, ChevronRight, X, Trash2, RefreshCw
} from 'lucide-react';

import {
  getApplications, addApplication, updateApplication, deleteApplication,
  getDashboardStats, getMonthlyData, getStatusDistribution, getSuccessRate,
  getUserProfile, getDefaultProfile, saveUserProfile, computeReadinessScore,
  getInterviews, getDrives, getOffers, getNotifications, saveNotifications,
  markNotificationRead, markAllNotificationsRead, addNotification,
  backupAllData, restoreFromBackup, getSyncLogs
} from '@/lib/storage';

import { Application, FilterConfig, SortConfig, Interview, JobDrive, Offer, Notification, UserProfile } from '@/types';
import { Sidebar, DashboardTab } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { DashboardCards } from '@/components/DashboardCards';
import { ApplicationTable } from '@/components/ApplicationTable';
import { ApplicationModal } from '@/components/ApplicationModal';
import { AnalyticsCharts } from '@/components/AnalyticsCharts';
import { InterviewTracker, JobDriveTracker, OfferManager } from '@/components/Trackers';
import { ReadinessEngine, ResumeManager, AIAssistant, CompanyHub, CommandPalette, SmartImportSystem, AIMockInterview, AIPlacementProbabilityPredictor, SkillGapEngine, AIRecruiterSimulator } from '@/components/AdditionalFeatures';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // App workspace states
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [drives, setDrives] = useState<JobDrive[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Navigation
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Application CRUD states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editApp, setEditApp] = useState<Application | null>(null);
  const [filter, setFilter] = useState<FilterConfig>({ status: 'All', search: '' });
  const [sort, setSort] = useState<SortConfig>({ field: 'applicationDate', direction: 'desc' });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Settings / Backup states
  const [restoreJson, setRestoreJson] = useState('');
  const [restoreStatus, setRestoreStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Load state and redirect if guest
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('ptp_logged_in') === 'true';
    if (!isLoggedIn) {
      router.push('/');
      return;
    }

    const p = getUserProfile();
    if (!p) {
      router.push('/onboarding');
      return;
    }

    setProfile(p);
    setApplications(getApplications());
    setInterviews(getInterviews());
    setDrives(getDrives());
    setOffers(getOffers());

    // Load sidebar state
    const savedWidth = localStorage.getItem('ptp_sidebar_width');
    if (savedWidth) setSidebarWidth(parseInt(savedWidth));
    const savedCollapsed = localStorage.getItem('ptp_sidebar_collapsed') === 'true';
    setIsSidebarCollapsed(savedCollapsed);

    // Notification populate
    let notifs = getNotifications();
    if (notifs.length === 0) {
      const defaultNotifs = [
        { type: 'general' as const, title: 'Welcome to Placement Tracker Pro', message: 'Hi Dhanush, setup your profile details to get your Placement Readiness score.', read: false },
        { type: 'interview' as const, title: 'Mock Interview Prep', message: 'You have a mock coding interview scheduled. Click AI Assistant for coding questions.', read: false }
      ];
      defaultNotifs.forEach(n => addNotification(n));
      notifs = getNotifications();
    }
    setNotifications(notifs);

    setIsLoaded(true);
  }, [router]);

  // Listen for Ctrl+K/Cmd+K to toggle Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleWidthChange = (w: number) => {
    setSidebarWidth(w);
    localStorage.setItem('ptp_sidebar_width', w.toString());
  };

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('ptp_sidebar_collapsed', next.toString());
      return next;
    });
  };

  // Sync state helpers
  const refreshProfile = () => {
    setProfile(getUserProfile());
  };

  const handleLogout = () => {
    localStorage.removeItem('ptp_logged_in');
    router.push('/');
  };

  // Computed applications calculations
  const stats = useMemo(() => getDashboardStats(applications), [applications]);
  const monthlyData = useMemo(() => getMonthlyData(applications), [applications]);
  const statusDistribution = useMemo(() => getStatusDistribution(applications), [applications]);
  const successRate = useMemo(() => getSuccessRate(applications), [applications]);

  const importedAutomaticallyCount = useMemo(() => {
    const logs = getSyncLogs();
    return logs.reduce((sum, log) => sum + log.importedCount, 0);
  }, [applications]);

  // Filtered & sorted applications
  const filteredApps = useMemo(() => {
    let result = [...applications];
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        a =>
          a.companyName.toLowerCase().includes(q) ||
          a.role.toLowerCase().includes(q) ||
          a.notes.toLowerCase().includes(q)
      );
    }
    if (filter.status !== 'All') {
      result = result.filter(a => a.status === filter.status);
    }
    result.sort((a, b) => {
      const field = sort.field;
      const aVal = a[field] ?? '';
      const bVal = b[field] ?? '';
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sort.direction === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [applications, filter, sort]);

  // CRUD handlers
  const handleAddApp = (data: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editApp) {
      const updated = updateApplication(editApp.id, data);
      if (updated) {
        setApplications(prev => prev.map(a => (a.id === editApp.id ? updated : a)));
      }
      setEditApp(null);
    } else {
      const newApp = addApplication(data);
      setApplications(prev => [...prev, newApp]);
    }
    setIsModalOpen(false);
  };

  const handleEditApp = (app: Application) => {
    setEditApp(app);
    setIsModalOpen(true);
  };

  const handleDeleteApp = (id: string) => {
    setDeleteId(id);
  };

  const confirmDeleteApp = () => {
    if (deleteId) {
      deleteApplication(deleteId);
      setApplications(prev => prev.filter(a => a.id !== deleteId));
      setDeleteId(null);
    }
  };

  // Notification actions
  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    setNotifications(getNotifications());
  };

  const handleRestore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restoreJson.trim()) return;
    const ok = restoreFromBackup(restoreJson);
    if (ok) {
      setRestoreStatus('success');
      setApplications(getApplications());
      setInterviews(getInterviews());
      setDrives(getDrives());
      setOffers(getOffers());
      refreshProfile();
      setTimeout(() => setRestoreStatus('idle'), 2000);
    } else {
      setRestoreStatus('error');
      setTimeout(() => setRestoreStatus('idle'), 2000);
    }
  };

  const unreadNotifCount = notifications.filter(n => !n.read).length;
  const readiness = profile ? computeReadinessScore(profile) : { total: 0 };

  if (!isLoaded || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center animate-pulse shadow-2xl">
            <Zap size={22} className="text-white" />
          </div>
          <p className="text-slate-400 text-xs font-semibold">Decrypting Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-[#050816] text-white">
      {/* Mobile navigation header */}
      <MobileNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        totalCount={applications.length}
        userName={profile.fullName}
        userEmail={profile.email}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div 
          className="hidden lg:flex lg:flex-col fixed left-0 top-0 bottom-0 z-30 transition-all duration-200"
          style={{ width: isSidebarCollapsed ? '80px' : '280px' }}
        >
          <Sidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            totalCount={applications.length}
            userName={profile.fullName}
            userEmail={profile.email}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={handleToggleCollapse}
          />
        </div>

        {/* Main Content Pane */}
        <main 
          className="flex-1 min-h-screen overflow-auto relative transition-all duration-200"
          style={{ marginLeft: isSidebarCollapsed ? '80px' : '280px' }}
        >
          {/* Dashboard Header Bar */}
          <header className="sticky top-0 z-20 glass border-b border-white/5 py-4 px-6 sm:px-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => setIsCommandPaletteOpen(true)}
                className="hidden sm:flex items-center gap-3 bg-white/3 border border-white/5 hover:border-white/10 rounded-xl px-4 py-2 text-slate-400 text-xs w-64 text-left transition-all"
              >
                <Search size={14} />
                <span>Search dashboard...</span>
                <span className="ml-auto font-mono text-[9px] bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-slate-500">⌘K</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="p-2.5 rounded-xl bg-white/3 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 relative transition-all"
                >
                  <Bell size={16} />
                  {unreadNotifCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full border border-[#0a0a14] animate-pulse" />
                  )}
                </button>

                {/* Notifications Drawer */}
                {isNotifOpen && (
                  <div className="absolute right-0 mt-3 w-80 card p-4 z-50 border border-white/10 shadow-2xl bg-[#0B1120]/95 backdrop-blur-xl">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-3">
                      <h4 className="text-xs font-bold text-white">Notifications</h4>
                      <button onClick={handleMarkAllRead} className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold">Mark all read</button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <p className="text-[10px] text-slate-500 text-center py-4">No notifications yet.</p>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className="p-2.5 bg-white/3 rounded-xl border border-white/5 text-left text-[11px]">
                            <p className="font-bold text-slate-200">{n.title}</p>
                            <p className="text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl bg-white/3 border border-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </header>

          <div className="p-6 sm:p-8 max-w-[1400px] mx-auto pb-24 lg:pb-8 space-y-6">

            {/* TAB: Overview/Dashboard */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fade-in">
                {/* Welcome Hero Banner */}
                <div className="relative card p-6 sm:p-8 overflow-hidden border border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-transparent pointer-events-none" />
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-indigo-500/5 to-transparent pointer-events-none" />

                  <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30 flex-shrink-0">
                        <Sparkles size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white mb-0.5">Placement Tracker Pro</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-slate-400">
                          <span className="font-medium text-slate-300">Welcome, {profile.fullName}</span>
                          <span className="hidden sm:inline text-slate-600">•</span>
                          <span>College: {profile.college || 'RVCE, Bangalore'}</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href="https://digitalheroesco.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hero-badge flex-shrink-0 text-xs py-2 px-3.5"
                      id="hero-digital-heroes-btn"
                    >
                      <Zap size={14} />
                      Built for Digital Heroes
                      <ExternalLink size={12} className="opacity-70" />
                    </a>
                  </div>
                </div>

                {/* Readiness Score Gauge & Quick metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                  {/* Gauge summary */}
                  <div className="card p-5 flex items-center gap-4">
                    <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r="34" className="stroke-white/5 fill-transparent" strokeWidth="5" />
                        <circle cx="40" cy="40" r="34" className="stroke-indigo-500 fill-transparent" strokeWidth="5" strokeDasharray={213} strokeDashoffset={213 - (213 * readiness.total) / 100} strokeLinecap="round" />
                      </svg>
                      <span className="absolute text-base font-bold text-white">{readiness.total}%</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-300">Readiness score</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Based on academic CGPA, certificates and mock scores.</p>
                      <button onClick={() => setActiveTab('readiness')} className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold mt-1.5 flex items-center gap-1">Improve Score <ChevronRight size={10} /></button>
                    </div>
                  </div>

                  {/* Profile info Summary */}
                  <div className="card p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 flex-shrink-0">
                      <User size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-300">Profile Completeness</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{profile.skills?.length || 0} core skills added · CGPA {profile.cgpa || '8.5'}</p>
                      <button onClick={() => setActiveTab('settings')} className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold mt-1.5 flex items-center gap-1">View profile details <ChevronRight size={10} /></button>
                    </div>
                  </div>

                  {/* Applications Imported Automatically */}
                  <div className="card p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                      <RefreshCw size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-300">Auto Imports</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5"><span className="text-emerald-400 font-bold">{importedAutomaticallyCount}</span> applications synced via API.</p>
                      <button onClick={() => setActiveTab('import')} className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold mt-1.5 flex items-center gap-1">Manage Sync <ChevronRight size={10} /></button>
                    </div>
                  </div>

                  {/* Quick Action buttons */}
                  <div className="card p-5 flex flex-col justify-center gap-2">
                    <button
                      onClick={() => { setEditApp(null); setIsModalOpen(true); }}
                      className="btn-primary py-2 text-xs flex items-center justify-center gap-2"
                    >
                      <Plus size={14} /> Add Application
                    </button>
                  </div>
                </div>

                {/* Stat Cards */}
                <DashboardCards stats={stats} successRate={successRate} />

                {/* Bottom row: Recent Applications table & Upcoming Interviews list */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Recent Applications table */}
                  <div className="xl:col-span-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-200">Recent Job applications</h3>
                      <button onClick={() => setActiveTab('applications')} className="text-xs text-indigo-400 hover:text-indigo-300 font-bold">View all</button>
                    </div>
                    {applications.length === 0 ? (
                      <div className="card p-8 text-center text-xs text-slate-500">No applications tracked yet. Click Add Application to start.</div>
                    ) : (
                    <ApplicationTable
                      applications={filteredApps.slice(0, 5)}
                      filter={filter}
                      onFilterChange={setFilter}
                      sort={sort}
                      onSortChange={setSort}
                      onEdit={handleEditApp}
                      onDelete={handleDeleteApp}
                    />
                    )}
                  </div>

                  {/* Upcoming Interviews list widget */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-200">Upcoming Interviews</h3>
                      <button onClick={() => setActiveTab('interviews')} className="text-xs text-indigo-400 hover:text-indigo-300 font-bold">Manage</button>
                    </div>
                    {interviews.length === 0 ? (
                      <div className="card p-8 text-center text-xs text-slate-500">No scheduled interviews. Schedule one inside the tracker tab.</div>
                    ) : (
                      <div className="space-y-2">
                        {interviews.slice(0, 4).map(i => (
                          <div key={i.id} className="card p-3.5 flex items-center justify-between gap-3 bg-white/3 border-white/5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400"><Calendar size={14} /></div>
                              <div>
                                <h4 className="text-xs font-bold text-white">{i.companyName}</h4>
                                <p className="text-[10px] text-slate-500 mt-0.5">{i.interviewType} · Round {i.round} · {i.interviewDate}</p>
                              </div>
                            </div>
                            <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-bold">{i.status}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Applications tracker */}
            {activeTab === 'applications' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-white">Application Pipeline</h2>
                    <p className="text-slate-400 text-sm">Sort, search and filter your targeted applications</p>
                  </div>
                  <button onClick={() => { setEditApp(null); setIsModalOpen(true); }} className="btn-primary py-2 text-xs flex items-center gap-2"><Plus size={14} /> Add Application</button>
                </div>
                <ApplicationTable
                  applications={filteredApps}
                  filter={filter}
                  onFilterChange={setFilter}
                  sort={sort}
                  onSortChange={setSort}
                  onEdit={handleEditApp}
                  onDelete={handleDeleteApp}
                />
              </div>
            )}

            {/* TAB: Smart Import */}
            {activeTab === 'import' && (
              <div className="animate-fade-in">
                <SmartImportSystem onSyncComplete={() => setApplications(getApplications())} />
              </div>
            )}

            {/* TAB: AI Mock Interview */}
            {activeTab === 'mock-interview' && (
              <div className="animate-fade-in">
                <AIMockInterview />
              </div>
            )}

            {/* TAB: Interviews tracker */}
            {activeTab === 'interviews' && (
              <div className="animate-fade-in">
                <InterviewTracker />
              </div>
            )}

            {/* TAB: Job Drives */}
            {activeTab === 'drives' && (
              <div className="animate-fade-in">
                <JobDriveTracker />
              </div>
            )}

            {/* TAB: Offers */}
            {activeTab === 'offers' && (
              <div className="animate-fade-in">
                <OfferManager />
              </div>
            )}

            {/* TAB: Analytics */}
            {activeTab === 'analytics' && (
              <div className="animate-fade-in">
                <AnalyticsCharts
                  monthlyData={monthlyData}
                  statusDistribution={statusDistribution}
                  successRate={successRate}
                  totalApplications={applications.length}
                />
              </div>
            )}

            {/* TAB: Readiness Engine */}
            {activeTab === 'readiness' && (
              <div className="animate-fade-in">
                <ReadinessEngine onProfileUpdate={refreshProfile} />
              </div>
            )}

            {/* TAB: Resume */}
            {activeTab === 'resume' && (
              <div className="animate-fade-in">
                <ResumeManager />
              </div>
            )}

            {/* TAB: AI Assistant */}
            {activeTab === 'ai-assistant' && (
              <div className="animate-fade-in">
                <AIAssistant />
              </div>
            )}

            {/* TAB: AI Predictor */}
            {activeTab === 'probability' && (
              <div className="animate-fade-in">
                <AIPlacementProbabilityPredictor />
              </div>
            )}

            {/* TAB: Skill Gap Analyst */}
            {activeTab === 'skill-gap' && (
              <div className="animate-fade-in">
                <SkillGapEngine />
              </div>
            )}

            {/* TAB: AI Recruiter Simulator */}
            {activeTab === 'recruiter-simulator' && (
              <div className="animate-fade-in">
                <AIRecruiterSimulator />
              </div>
            )}

            {/* TAB: Companies */}
            {activeTab === 'companies' && (
              <div className="animate-fade-in">
                <CompanyHub />
              </div>
            )}

            {/* TAB: Settings & Profile */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-black text-white">Settings & Profile</h2>
                  <p className="text-slate-400 text-sm">Update profile credentials, export tracking tables and backup data</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Profile Edit Card */}
                  <div className="card p-6 space-y-4">
                    <h3 className="text-sm font-bold text-white">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1.5">Full Name</label>
                        <input
                          type="text"
                          className="input-field py-2 text-xs"
                          value={profile.fullName}
                          onChange={e => {
                            const updated = { ...profile, fullName: e.target.value };
                            saveUserProfile(updated);
                            setProfile(updated);
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1.5">Email Address</label>
                        <input
                          type="email"
                          className="input-field py-2 text-xs"
                          value={profile.email}
                          onChange={e => {
                            const updated = { ...profile, email: e.target.value };
                            saveUserProfile(updated);
                            setProfile(updated);
                          }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1.5">Phone Number</label>
                        <input
                          type="text"
                          className="input-field py-2 text-xs"
                          value={profile.phone || ''}
                          onChange={e => {
                            const updated = { ...profile, phone: e.target.value };
                            saveUserProfile(updated);
                            setProfile(updated);
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1.5">College Name</label>
                        <input
                          type="text"
                          className="input-field py-2 text-xs"
                          value={profile.college || ''}
                          onChange={e => {
                            const updated = { ...profile, college: e.target.value };
                            saveUserProfile(updated);
                            setProfile(updated);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Backup & Restore Card */}
                  <div className="card p-6 space-y-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white mb-2">Workspace Backup</h3>
                      <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                        Download your complete workspace backup file (JSON) to save application history, notes, and scores.
                      </p>
                      <button
                        onClick={backupAllData}
                        className="btn-ghost py-2 text-xs flex items-center justify-center gap-2 w-full mb-4"
                      >
                        <Download size={14} /> Download Backup (JSON)
                      </button>

                      <div className="h-px bg-white/5 mb-4" />

                      <form onSubmit={handleRestore} className="space-y-3">
                        <label className="text-xs font-semibold text-slate-300 block">Restore from Backup (Paste JSON)</label>
                        <textarea
                          rows={2}
                          className="input-field text-[10px] font-mono resize-none"
                          placeholder='{"applications": [...], "profile": {...}}'
                          value={restoreJson}
                          onChange={e => setRestoreJson(e.target.value)}
                        />
                        <button type="submit" className="btn-primary py-2 text-xs w-full flex items-center justify-center gap-2">
                          <Upload size={14} /> Restore Workspace
                        </button>
                        {restoreStatus === 'success' && <p className="text-[10px] text-emerald-400 font-bold text-center">Restored successfully!</p>}
                        {restoreStatus === 'error' && <p className="text-[10px] text-red-400 font-bold text-center">Invalid JSON payload.</p>}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Command Palette component (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onTabChange={setActiveTab}
      />

      {/* Application Form Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditApp(null); }}
        onSubmit={handleAddApp}
        editData={editApp}
      />

      {/* Delete Confirmation Overlay */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-content max-w-sm">
            <div className="p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-red-500">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Delete Application?</h3>
              <p className="text-xs text-slate-400 mb-6">This action will permanently delete the application. It cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="btn-ghost flex-1 py-2 text-xs">Cancel</button>
                <button onClick={confirmDeleteApp} className="btn-primary bg-red-600 border-red-500/20 text-white flex-1 py-2 text-xs">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
