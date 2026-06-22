import {
  Application, ApplicationStatus, DashboardStats, MonthlyData, StatusDistribution,
  Interview, JobDrive, Offer, Company, Notification, UserProfile, ReadinessScore,
  ConnectedAccount, SyncLog, MockInterviewSession
} from '@/types';

// ─── Generic helpers ─────────────────────────────────────────────────────────

function getItem<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(key) ?? '[]'); } catch { return []; }
}
function setItem<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}
function getSingle<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : null; } catch { return null; }
}
function setSingle<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

// ─── APPLICATIONS ────────────────────────────────────────────────────────────

const APP_KEY = 'ptp_applications';

export function getApplications(): Application[] { return getItem<Application>(APP_KEY); }
export function saveApplications(applications: Application[]): void { setItem(APP_KEY, applications); }

export function addApplication(app: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>): Application {
  const applications = getApplications();
  const newApp: Application = { ...app, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  applications.push(newApp);
  saveApplications(applications);
  return newApp;
}

export function updateApplication(id: string, updates: Partial<Omit<Application, 'id' | 'createdAt'>>): Application | null {
  const applications = getApplications();
  const index = applications.findIndex(a => a.id === id);
  if (index === -1) return null;
  applications[index] = { ...applications[index], ...updates, updatedAt: new Date().toISOString() };
  saveApplications(applications);
  return applications[index];
}

export function deleteApplication(id: string): boolean {
  const apps = getApplications();
  const filtered = apps.filter(a => a.id !== id);
  if (filtered.length === apps.length) return false;
  saveApplications(filtered);
  return true;
}

// ─── INTERVIEWS ──────────────────────────────────────────────────────────────

const INT_KEY = 'ptp_interviews';

export function getInterviews(): Interview[] { return getItem<Interview>(INT_KEY); }
export function saveInterviews(interviews: Interview[]): void { setItem(INT_KEY, interviews); }

export function addInterview(interview: Omit<Interview, 'id' | 'createdAt' | 'updatedAt'>): Interview {
  const list = getInterviews();
  const newItem: Interview = { ...interview, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  list.push(newItem);
  saveInterviews(list);
  return newItem;
}

export function updateInterview(id: string, updates: Partial<Omit<Interview, 'id' | 'createdAt'>>): Interview | null {
  const list = getInterviews();
  const index = list.findIndex(i => i.id === id);
  if (index === -1) return null;
  list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
  saveInterviews(list);
  return list[index];
}

export function deleteInterview(id: string): boolean {
  const list = getInterviews();
  const filtered = list.filter(i => i.id !== id);
  if (filtered.length === list.length) return false;
  saveInterviews(filtered);
  return true;
}

// ─── JOB DRIVES ──────────────────────────────────────────────────────────────

const DRIVE_KEY = 'ptp_drives';

export function getDrives(): JobDrive[] { return getItem<JobDrive>(DRIVE_KEY); }
export function saveDrives(drives: JobDrive[]): void { setItem(DRIVE_KEY, drives); }

export function addDrive(drive: Omit<JobDrive, 'id' | 'createdAt' | 'updatedAt'>): JobDrive {
  const list = getDrives();
  const newItem: JobDrive = { ...drive, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  list.push(newItem);
  saveDrives(list);
  return newItem;
}

export function updateDrive(id: string, updates: Partial<Omit<JobDrive, 'id' | 'createdAt'>>): JobDrive | null {
  const list = getDrives();
  const index = list.findIndex(d => d.id === id);
  if (index === -1) return null;
  list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
  saveDrives(list);
  return list[index];
}

export function deleteDrive(id: string): boolean {
  const list = getDrives();
  const filtered = list.filter(d => d.id !== id);
  if (filtered.length === list.length) return false;
  saveDrives(filtered);
  return true;
}

// ─── OFFERS ──────────────────────────────────────────────────────────────────

const OFFER_KEY = 'ptp_offers';

export function getOffers(): Offer[] { return getItem<Offer>(OFFER_KEY); }
export function saveOffers(offers: Offer[]): void { setItem(OFFER_KEY, offers); }

export function addOffer(offer: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>): Offer {
  const list = getOffers();
  const newItem: Offer = { ...offer, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  list.push(newItem);
  saveOffers(list);
  return newItem;
}

export function updateOffer(id: string, updates: Partial<Omit<Offer, 'id' | 'createdAt'>>): Offer | null {
  const list = getOffers();
  const index = list.findIndex(o => o.id === id);
  if (index === -1) return null;
  list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
  saveOffers(list);
  return list[index];
}

export function deleteOffer(id: string): boolean {
  const list = getOffers();
  const filtered = list.filter(o => o.id !== id);
  if (filtered.length === list.length) return false;
  saveOffers(filtered);
  return true;
}

// ─── COMPANIES ────────────────────────────────────────────────────────────────

const CO_KEY = 'ptp_companies';

export function getCompanies(): Company[] { return getItem<Company>(CO_KEY); }
export function saveCompanies(companies: Company[]): void { setItem(CO_KEY, companies); }

export function addCompany(company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Company {
  const list = getCompanies();
  const newItem: Company = { ...company, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  list.push(newItem);
  saveCompanies(list);
  return newItem;
}

export function updateCompany(id: string, updates: Partial<Omit<Company, 'id' | 'createdAt'>>): Company | null {
  const list = getCompanies();
  const index = list.findIndex(c => c.id === id);
  if (index === -1) return null;
  list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
  saveCompanies(list);
  return list[index];
}

export function deleteCompany(id: string): boolean {
  const list = getCompanies();
  const filtered = list.filter(c => c.id !== id);
  if (filtered.length === list.length) return false;
  saveCompanies(filtered);
  return true;
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

const NOTIF_KEY = 'ptp_notifications';

export function getNotifications(): Notification[] { return getItem<Notification>(NOTIF_KEY); }
export function saveNotifications(notifs: Notification[]): void { setItem(NOTIF_KEY, notifs); }

export function addNotification(notif: Omit<Notification, 'id' | 'createdAt'>): Notification {
  const list = getNotifications();
  const newItem: Notification = { ...notif, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  list.unshift(newItem);
  saveNotifications(list.slice(0, 50)); // keep last 50
  return newItem;
}

export function markNotificationRead(id: string): void {
  const list = getNotifications();
  const index = list.findIndex(n => n.id === id);
  if (index !== -1) { list[index].read = true; saveNotifications(list); }
}

export function markAllNotificationsRead(): void {
  const list = getNotifications().map(n => ({ ...n, read: true }));
  saveNotifications(list);
}

// ─── USER PROFILE ─────────────────────────────────────────────────────────────

const PROFILE_KEY = 'ptp_profile';

export function getUserProfile(): UserProfile | null { return getSingle<UserProfile>(PROFILE_KEY); }

export function saveUserProfile(profile: UserProfile): void { setSingle(PROFILE_KEY, profile); }

export function getDefaultProfile(): UserProfile {
  return {
    fullName: 'Dhanush Gowda G',
    email: 'dh4nushgowd4@gmail.com',
    skills: [],
    certifications: [],
    onboardingComplete: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ─── READINESS SCORE ──────────────────────────────────────────────────────────

export function computeReadinessScore(profile: UserProfile | null): ReadinessScore {
  if (!profile) return { total: 0, breakdown: { cgpa: 0, skills: 0, certifications: 0, resume: 0, aptitude: 0, coding: 0, communication: 0, mockInterview: 0 }, strengths: [], improvements: [], suggestions: [] };

  const cgpa = Math.min(((parseFloat(profile.cgpa ?? '0') / 10) * 15), 15);
  const skills = Math.min((profile.skills.length / 10) * 20, 20);
  const certifications = Math.min((profile.certifications.length / 5) * 10, 10);
  const resume = profile.resumeUploaded ? 10 : 0;
  const aptitude = ((profile.aptitudeScore ?? 0) / 100) * 10;
  const coding = ((profile.codingScore ?? 0) / 100) * 15;
  const communication = ((profile.communicationScore ?? 0) / 100) * 10;
  const mockInterview = ((profile.mockInterviewScore ?? 0) / 100) * 10;

  const breakdown = { cgpa: Math.round(cgpa), skills: Math.round(skills), certifications: Math.round(certifications), resume: Math.round(resume), aptitude: Math.round(aptitude), coding: Math.round(coding), communication: Math.round(communication), mockInterview: Math.round(mockInterview) };
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

  const strengths: string[] = [];
  const improvements: string[] = [];
  const suggestions: string[] = [];

  if (cgpa >= 12) strengths.push('Strong Academic Performance');
  else { improvements.push('CGPA'); suggestions.push('Focus on improving your CGPA'); }

  if (skills >= 15) strengths.push('Excellent Skill Set');
  else { improvements.push('Skills Count'); suggestions.push(`Add ${10 - profile.skills.length} more relevant skills`); }

  if (certifications >= 8) strengths.push('Well Certified');
  else { improvements.push('Certifications'); suggestions.push('Complete at least 2-3 industry certifications'); }

  if (resume) strengths.push('Resume Ready');
  else { improvements.push('Resume'); suggestions.push('Upload your resume to improve ATS visibility'); }

  if (coding >= 12) strengths.push('Strong Coding Skills');
  else { improvements.push('Coding Score'); suggestions.push('Practice DSA and system design problems daily'); }

  if (communication >= 8) strengths.push('Good Communication');
  else { improvements.push('Communication'); suggestions.push('Take mock interviews to improve communication'); }

  return { total, breakdown, strengths, improvements, suggestions };
}

// ─── ANALYTICS (existing, kept) ──────────────────────────────────────────────

export function getDashboardStats(applications: Application[]): DashboardStats {
  return {
    total: applications.length,
    selected: applications.filter(a => ['Offer Received', 'Offer Accepted'].includes(a.status)).length,
    rejected: applications.filter(a => a.status === 'Rejected').length,
    pending: applications.filter(a => !['Offer Received', 'Offer Accepted', 'Rejected'].includes(a.status)).length,
    offered: applications.filter(a => ['Offer Received', 'Offer Accepted'].includes(a.status)).length,
    interviewing: applications.filter(a => ['Technical Interview', 'Managerial Interview', 'HR Interview', 'Shortlisted'].includes(a.status)).length,
  };
}

export function getMonthlyData(applications: Application[]): MonthlyData[] {
  const months: Record<string, MonthlyData> = {};
  applications.forEach(app => {
    const date = new Date(app.applicationDate);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    if (!months[key]) months[key] = { month: label, applications: 0, offered: 0, rejected: 0 };
    months[key].applications++;
    if (['Offer Received', 'Offer Accepted'].includes(app.status)) months[key].offered++;
    if (app.status === 'Rejected') months[key].rejected++;
  });
  return Object.entries(months).sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v).slice(-12);
}

export function getStatusDistribution(applications: Application[]): StatusDistribution[] {
  const statuses: ApplicationStatus[] = ['Interested', 'Applied', 'Assessment', 'Shortlisted', 'Technical Interview', 'Managerial Interview', 'HR Interview', 'Offer Received', 'Offer Accepted', 'Offer Rejected', 'Rejected'];
  const total = applications.length || 1;
  return statuses.map(status => ({
    status,
    count: applications.filter(a => a.status === status).length,
    percentage: Math.round((applications.filter(a => a.status === status).length / total) * 100),
  })).filter(s => s.count > 0);
}

export function getSuccessRate(applications: Application[]): number {
  if (applications.length === 0) return 0;
  const offered = applications.filter(a => ['Offer Received', 'Offer Accepted'].includes(a.status)).length;
  return Math.round((offered / applications.length) * 100);
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────

export function exportToCSV(data: Record<string, unknown>[], filename: string): void {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csv = [headers.join(','), ...data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export function exportToJSON(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export function backupAllData(): void {
  const backup = {
    applications: getApplications(),
    interviews: getInterviews(),
    drives: getDrives(),
    offers: getOffers(),
    companies: getCompanies(),
    notifications: getNotifications(),
    profile: getUserProfile(),
    exportedAt: new Date().toISOString(),
  };
  exportToJSON(backup, `ptp-backup-${new Date().toISOString().split('T')[0]}.json`);
}

export function restoreFromBackup(json: string): boolean {
  try {
    const data = JSON.parse(json);
    if (data.applications) saveApplications(data.applications);
    if (data.interviews) saveInterviews(data.interviews);
    if (data.drives) saveDrives(data.drives);
    if (data.offers) saveOffers(data.offers);
    if (data.companies) saveCompanies(data.companies);
    if (data.notifications) saveNotifications(data.notifications);
    if (data.profile) saveUserProfile(data.profile);
    return true;
  } catch { return false; }
}

// ─── SMART ACCOUNT IMPORTS ───────────────────────────────────────────────────

const ACCTS_KEY = 'ptp_connected_accounts';
const SYNC_LOGS_KEY = 'ptp_sync_logs';

const MOCK_PLATFORM_JOBS: Record<string, Omit<Application, 'id' | 'createdAt' | 'updatedAt'>[]> = {
  LinkedIn: [
    { companyName: 'Google', role: 'Software Engineer', location: 'Bangalore', workMode: 'Hybrid', ctc: '24 LPA', status: 'Technical Interview', notes: 'Imported via LinkedIn Easy Apply. Technical rounds scheduled.', applicationDate: new Date().toISOString().split('T')[0] },
    { companyName: 'Microsoft', role: 'Cloud Consultant', location: 'Hyderabad', workMode: 'On-site', ctc: '20 LPA', status: 'Offer Received', notes: 'Imported via LinkedIn. Offer letter received.', applicationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
  ],
  Naukri: [
    { companyName: 'Tata Consultancy Services', role: 'Systems Engineer', location: 'Chennai', workMode: 'On-site', ctc: '7.5 LPA', status: 'Applied', notes: 'Imported from Naukri profile tracker.', applicationDate: new Date().toISOString().split('T')[0] },
    { companyName: 'Infosys', role: 'Associate Software Developer', location: 'Bangalore', workMode: 'Hybrid', ctc: '6.2 LPA', status: 'Assessment', notes: 'Imported from Naukri. Coding assessment pending.', applicationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
  ],
  Indeed: [
    { companyName: 'Amazon', role: 'SDE-1', location: 'Bangalore', workMode: 'On-site', ctc: '28 LPA', status: 'Assessment', notes: 'Imported from Indeed. Online Hackerrank assessment link received.', applicationDate: new Date().toISOString().split('T')[0] }
  ],
  Internshala: [
    { companyName: 'Razorpay', role: 'Frontend Intern', location: 'Remote', workMode: 'Remote', ctc: '4.8 LPA', status: 'HR Interview', notes: 'Imported from Internshala tracker. Completed manager round.', applicationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
  ],
  Wellfound: [
    { companyName: 'Postman', role: 'Developer Associate', location: 'Bangalore', workMode: 'Hybrid', ctc: '18 LPA', status: 'Applied', notes: 'Imported from Wellfound (AngelList). Applied via founder contact.', applicationDate: new Date().toISOString().split('T')[0] }
  ],
  Unstop: [
    { companyName: 'Flipkart', role: 'SDE Intern (Runway)', location: 'Bangalore', workMode: 'On-site', ctc: '15 LPA', status: 'Rejected', notes: 'Imported from Unstop competition track. Assessment score was below cut-off.', applicationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
  ]
};

export function getConnectedAccounts(): ConnectedAccount[] {
  const list = getSingle<ConnectedAccount[]>(ACCTS_KEY);
  if (list) return list;
  // Default list
  const defaults: ConnectedAccount[] = [
    { platform: 'LinkedIn', connected: false },
    { platform: 'Naukri', connected: false },
    { platform: 'Indeed', connected: false },
    { platform: 'Internshala', connected: false },
    { platform: 'Wellfound', connected: false },
    { platform: 'Unstop', connected: false }
  ];
  setSingle(ACCTS_KEY, defaults);
  return defaults;
}

export function saveConnectedAccounts(accounts: ConnectedAccount[]): void {
  setSingle(ACCTS_KEY, accounts);
}

export function getSyncLogs(): SyncLog[] {
  return getItem<SyncLog>(SYNC_LOGS_KEY);
}

export function saveSyncLogs(logs: SyncLog[]): void {
  setItem(SYNC_LOGS_KEY, logs);
}

export function triggerPlatformSync(platform: string): { imported: number; failed: number } {
  const currentApps = getApplications();
  const mockJobs = MOCK_PLATFORM_JOBS[platform] || [];
  
  let importedCount = 0;
  let failedCount = 0;

  mockJobs.forEach(job => {
    // Prevent duplicate: check if company + role already exists
    const exists = currentApps.some(a => 
      a.companyName.toLowerCase() === job.companyName.toLowerCase() &&
      a.role.toLowerCase() === job.role.toLowerCase()
    );

    if (!exists) {
      addApplication(job);
      importedCount++;
    } else {
      failedCount++; // consider duplicates as skipped/failed for stats visibility
    }
  });

  // Append Sync Log
  const newLog: SyncLog = {
    id: crypto.randomUUID(),
    platform,
    syncTime: new Date().toISOString(),
    importedCount,
    failedCount,
    status: 'Success'
  };

  const logs = getSyncLogs();
  logs.unshift(newLog);
  saveSyncLogs(logs.slice(0, 50)); // keep last 50 logs

  // Update Connected Account Sync Time
  const accts = getConnectedAccounts().map(a => 
    a.platform === platform ? { ...a, lastSynced: new Date().toISOString() } : a
  );
  saveConnectedAccounts(accts);

  return { imported: importedCount, failed: failedCount };
}

const MOCK_INTERVIEWS_KEY = 'ptp_mock_interviews';

export function getMockInterviews(): MockInterviewSession[] {
  return getItem<MockInterviewSession>(MOCK_INTERVIEWS_KEY);
}

export function saveMockInterviews(sessions: MockInterviewSession[]): void {
  setItem(MOCK_INTERVIEWS_KEY, sessions);
}

export function addMockInterview(session: MockInterviewSession): void {
  const sessions = getMockInterviews();
  sessions.unshift(session);
  saveMockInterviews(sessions);
}

export function deleteMockInterview(id: string): void {
  const sessions = getMockInterviews();
  saveMockInterviews(sessions.filter(s => s.id !== id));
}

export interface ScrapedJobData {
  companyName: string;
  role: string;
  location: string;
  ctc: string;
  requiredSkills: string[];
  deadline: string;
}

export function extractJobMetadataFromUrl(url: string): ScrapedJobData {
  const urlLower = url.toLowerCase();
  
  // Extract domain name as fallback company name
  let fallbackCompany = 'Acme Corp';
  try {
    const domain = new URL(url).hostname;
    const parts = domain.replace(/^(www\.|careers\.|jobs\.|talent\.)/, '').split('.');
    if (parts.length > 0) {
      fallbackCompany = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    }
  } catch (e) {
    const match = urlLower.match(/(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)?([a-zA-Z0-9-]+)\.[a-zA-Z]{2,}/);
    if (match && match[1]) {
      fallbackCompany = match[1].charAt(0).toUpperCase() + match[1].slice(1);
    }
  }

  let companyName = fallbackCompany;
  if (urlLower.includes('google')) companyName = 'Google';
  else if (urlLower.includes('microsoft')) companyName = 'Microsoft';
  else if (urlLower.includes('netflix')) companyName = 'Netflix';
  else if (urlLower.includes('amazon')) companyName = 'Amazon';
  else if (urlLower.includes('meta') || urlLower.includes('facebook')) companyName = 'Meta';
  else if (urlLower.includes('apple')) companyName = 'Apple';
  else if (urlLower.includes('stripe')) companyName = 'Stripe';
  else if (urlLower.includes('airbnb')) companyName = 'Airbnb';
  else if (urlLower.includes('linkedin')) companyName = 'LinkedIn';
  else if (urlLower.includes('uber')) companyName = 'Uber';
  else if (urlLower.includes('spotify')) companyName = 'Spotify';
  else if (urlLower.includes('slack')) companyName = 'Slack';
  else if (urlLower.includes('atlassian')) companyName = 'Atlassian';
  else if (urlLower.includes('adobe')) companyName = 'Adobe';
  else if (urlLower.includes('nvidia')) companyName = 'NVIDIA';

  let role = 'Software Engineer';
  let skills = ['Git', 'Problem Solving', 'Data Structures'];
  
  if (urlLower.includes('frontend') || urlLower.includes('ui') || urlLower.includes('react')) {
    role = 'Frontend Developer';
    skills = ['React', 'JavaScript', 'HTML/CSS', 'Tailwind CSS', 'Redux'];
  } else if (urlLower.includes('backend') || urlLower.includes('node') || urlLower.includes('server')) {
    role = 'Backend Developer';
    skills = ['Node.js', 'Express', 'SQL', 'MongoDB', 'REST APIs', 'System Design'];
  } else if (urlLower.includes('fullstack') || urlLower.includes('full-stack') || urlLower.includes('web')) {
    role = 'Full Stack Developer';
    skills = ['React', 'Node.js', 'SQL', 'Express', 'Web APIs', 'Git'];
  } else if (urlLower.includes('data-scientist') || urlLower.includes('data-science') || urlLower.includes('scientist')) {
    role = 'Data Scientist';
    skills = ['Python', 'Pandas', 'NumPy', 'Machine Learning', 'SQL', 'Statistics'];
  } else if (urlLower.includes('ai') || urlLower.includes('ml') || urlLower.includes('machine-learning') || urlLower.includes('deep-learning')) {
    role = 'AI Engineer';
    skills = ['Python', 'PyTorch', 'TensorFlow', 'LLMs', 'GenAI', 'Linear Algebra'];
  } else if (urlLower.includes('devops') || urlLower.includes('sre') || urlLower.includes('cloud')) {
    role = 'DevOps Engineer';
    skills = ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Terraform'];
  } else if (urlLower.includes('product') || urlLower.includes('pm')) {
    role = 'Product Manager';
    skills = ['Product Strategy', 'Roadmapping', 'Agile', 'A/B Testing', 'User Analytics'];
  }

  let location = 'Hybrid (Seattle, WA)';
  if (urlLower.includes('remote')) {
    location = 'Remote';
  } else if (urlLower.includes('bangalore') || urlLower.includes('india') || urlLower.includes('bengaluru')) {
    location = 'On-site (Bangalore, India)';
  } else if (urlLower.includes('sf') || urlLower.includes('san-francisco') || urlLower.includes('california')) {
    location = 'Hybrid (San Francisco, CA)';
  } else if (urlLower.includes('london') || urlLower.includes('uk')) {
    location = 'On-site (London, UK)';
  } else if (urlLower.includes('new-york') || urlLower.includes('ny')) {
    location = 'Hybrid (New York, NY)';
  }

  let ctc = '$120,000 - $160,000';
  const tier1Companies = ['Google', 'Microsoft', 'Netflix', 'Amazon', 'Meta', 'Apple', 'Stripe', 'NVIDIA'];
  const isTier1 = tier1Companies.includes(companyName);
  
  if (role === 'Frontend Developer' || role === 'Backend Developer') {
    ctc = isTier1 ? '$150,000 - $195,000' : '$95,000 - $130,000';
  } else if (role === 'Full Stack Developer') {
    ctc = isTier1 ? '$160,000 - $210,000' : '$105,000 - $145,000';
  } else if (role === 'Data Scientist' || role === 'AI Engineer') {
    ctc = isTier1 ? '$185,000 - $240,000' : '$125,000 - $175,000';
  } else if (role === 'DevOps Engineer') {
    ctc = isTier1 ? '$155,000 - $205,000' : '$100,000 - $140,000';
  }

  if (location.includes('India') || location.includes('Bangalore')) {
    if (isTier1) {
      ctc = '₹28,00,000 - ₹42,00,000';
    } else {
      ctc = '₹12,00,000 - ₹18,00,000';
    }
  }

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 14);
  const deadline = targetDate.toISOString().split('T')[0];

  return {
    companyName,
    role,
    location,
    ctc,
    requiredSkills: skills,
    deadline
  };
}
