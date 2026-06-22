// ─── Existing Types (kept) ─────────────────────────────────────────────────

export type ApplicationStatus =
  | 'Interested'
  | 'Applied'
  | 'Assessment'
  | 'Shortlisted'
  | 'Technical Interview'
  | 'Managerial Interview'
  | 'HR Interview'
  | 'Offer Received'
  | 'Offer Accepted'
  | 'Offer Rejected'
  | 'Rejected';

export interface Application {
  id: string;
  companyName: string;
  role: string;
  ctc?: string;
  location?: string;
  workMode?: 'Remote' | 'Hybrid' | 'On-site';
  applicationDate: string;
  lastUpdated?: string;
  status: ApplicationStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type SortField = 'companyName' | 'role' | 'applicationDate' | 'status' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface FilterConfig {
  status: ApplicationStatus | 'All';
  search: string;
}

export interface DashboardStats {
  total: number;
  selected: number;
  rejected: number;
  pending: number;
  offered: number;
  interviewing: number;
}

export interface MonthlyData {
  month: string;
  applications: number;
  offered: number;
  rejected: number;
}

export interface StatusDistribution {
  status: ApplicationStatus;
  count: number;
  percentage: number;
}

// ─── New Types ──────────────────────────────────────────────────────────────

export type InterviewStatus = 'Scheduled' | 'Completed' | 'Cleared' | 'Rejected';
export type InterviewType = 'Technical' | 'HR' | 'Managerial' | 'Group Discussion' | 'Aptitude' | 'Coding' | 'System Design';

export interface Interview {
  id: string;
  companyName: string;
  interviewType: InterviewType;
  interviewDate: string;
  interviewTime: string;
  round: string;
  interviewerName?: string;
  notes?: string;
  feedback?: string;
  result?: string;
  status: InterviewStatus;
  createdAt: string;
  updatedAt: string;
}

export type DriveType = 'Campus' | 'Off-Campus' | 'Referral' | 'Walk-in';

export interface JobDrive {
  id: string;
  companyName: string;
  driveType: DriveType;
  registrationDeadline: string;
  eligibility?: string;
  minCGPA?: number;
  ctc?: string;
  location?: string;
  driveDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type OfferStatus = 'Received' | 'Accepted' | 'Rejected';

export interface Offer {
  id: string;
  companyName: string;
  role: string;
  package: string;
  baseSalary?: string;
  bonus?: string;
  joiningDate?: string;
  offerExpiry?: string;
  status: OfferStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  website?: string;
  linkedin?: string;
  interviewExperiences?: string;
  salaryNotes?: string;
  preparationResources?: string;
  personalNotes?: string;
  bookmarked: boolean;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType = 'interview' | 'assessment' | 'drive' | 'offer' | 'profile' | 'general';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface UserProfile {
  // Personal
  fullName: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  // Academic
  college?: string;
  university?: string;
  degree?: string;
  branch?: string;
  currentYear?: string;
  cgpa?: string;
  activeBacklogs?: number;
  graduationYear?: string;
  // Career
  linkedin?: string;
  github?: string;
  portfolio?: string;
  preferredRole?: string;
  skills: string[];
  certifications: string[];
  // Readiness
  aptitudeScore?: number;
  codingScore?: number;
  communicationScore?: number;
  mockInterviewScore?: number;
  resumeUploaded?: boolean;
  resumeName?: string;
  // Meta
  onboardingComplete?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReadinessScore {
  total: number;
  breakdown: {
    cgpa: number;
    skills: number;
    certifications: number;
    resume: number;
    aptitude: number;
    coding: number;
    communication: number;
    mockInterview: number;
  };
  strengths: string[];
  improvements: string[];
  suggestions: string[];
}

export interface ConnectedAccount {
  platform: 'LinkedIn' | 'Naukri' | 'Indeed' | 'Internshala' | 'Wellfound' | 'Unstop';
  connected: boolean;
  username?: string;
  lastSynced?: string;
}

export interface SyncLog {
  id: string;
  platform: string;
  syncTime: string;
  importedCount: number;
  failedCount: number;
  status: 'Success' | 'Failed';
}

export interface MockInterviewSession {
  id: string;
  role: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  date: string;
  durationSeconds: number;
  overallScore: number;
  scores: {
    technical: number;
    communication: number;
    confidence: number;
    problemSolving: number;
  };
  metrics?: {
    speakingSpeedWpm: number;
    fillerWordsCount: number;
    clarityScore: number;
    confidenceScore: number;
  };
  feedback: {
    strengths: string[];
    weaknesses: string[];
    improvements: string[];
  };
  chatHistory: {
    sender: 'interviewer' | 'candidate';
    text: string;
    timestamp: string;
  }[];
}
