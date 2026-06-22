'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Award, FileText, CheckCircle2, AlertTriangle, BookOpen,
  ArrowRight, Search, Plus, Trash2, Bookmark, ExternalLink, RefreshCw,
  Send, User, Trophy, Compass, HelpCircle, X, ChevronRight, Check,
  Brain, Volume2, Play, History, Clock, UserCheck, VolumeX, Mic, MicOff
} from 'lucide-react';
import {
  getUserProfile, saveUserProfile, computeReadinessScore,
  getCompanies, addCompany, updateCompany, deleteCompany,
  getConnectedAccounts, saveConnectedAccounts, getSyncLogs, triggerPlatformSync,
  getMockInterviews, addMockInterview, deleteMockInterview,
  getApplications, getOffers, getSuccessRate, extractJobMetadataFromUrl, addApplication
} from '@/lib/storage';
import { UserProfile, Company, ReadinessScore, ConnectedAccount, SyncLog, MockInterviewSession } from '@/types';
import type { DashboardTab } from './Sidebar';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, RadialBarChart, RadialBar, Legend, AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

// ─── PLACEMENT READINESS ENGINE ──────────────────────────────────────────────

export function ReadinessEngine({ onProfileUpdate }: { onProfileUpdate?: () => void }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [scores, setScores] = useState({ aptitude: 70, coding: 65, communication: 75, mock: 70 });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const p = getUserProfile();
    if (p) {
      setProfile(p);
      setScores({
        aptitude: p.aptitudeScore ?? 70,
        coding: p.codingScore ?? 65,
        communication: p.communicationScore ?? 75,
        mock: p.mockInterviewScore ?? 70
      });
    }
  }, []);

  const readiness = computeReadinessScore(profile);

  const handleUpdateScores = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    const updated = {
      ...profile,
      aptitudeScore: scores.aptitude,
      codingScore: scores.coding,
      communicationScore: scores.communication,
      mockInterviewScore: scores.mock,
      updatedAt: new Date().toISOString()
    };
    saveUserProfile(updated);
    setProfile(updated);
    setIsUpdating(false);
    if (onProfileUpdate) onProfileUpdate();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Placement Readiness Engine</h2>
          <p className="text-slate-400 text-sm">Analyze and optimize your readiness for top companies</p>
        </div>
        <button
          onClick={() => setIsUpdating(true)}
          className="btn-ghost flex items-center gap-2 text-xs"
        >
          <RefreshCw size={14} /> Update Test Scores
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score gauge Card */}
        <div className="card p-6 flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-bold text-slate-400 mb-6">Readiness Score</h3>
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* SVG circle meter */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-white/5 fill-transparent"
                strokeWidth="10"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-indigo-500 fill-transparent"
                strokeWidth="10"
                strokeDasharray={440}
                initial={{ strokeDashoffset: 440 }}
                animate={{ strokeDashoffset: 440 - (440 * readiness.total) / 100 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black text-white">{readiness.total}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Out of 100</span>
            </div>
          </div>
          <p className={`text-sm font-bold mt-6 ${getScoreColor(readiness.total)}`}>
            {readiness.total >= 80 ? 'Excellent Prep Level' : readiness.total >= 60 ? 'Moderate Prep Level' : 'Needs Improvement'}
          </p>
        </div>

        {/* Score Breakdown List */}
        <div className="card p-6 md:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-200">Weightage Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'CGPA Score (15%)', val: readiness.breakdown.cgpa, max: 15 },
              { label: 'Skills Count (20%)', val: readiness.breakdown.skills, max: 20 },
              { label: 'Certifications (10%)', val: readiness.breakdown.certifications, max: 10 },
              { label: 'Resume Check (10%)', val: readiness.breakdown.resume, max: 10 },
              { label: 'Aptitude test (10%)', val: readiness.breakdown.aptitude, max: 10 },
              { label: 'Coding test (15%)', val: readiness.breakdown.coding, max: 15 },
              { label: 'Communication (10%)', val: readiness.breakdown.communication, max: 10 },
              { label: 'Mock Interviews (10%)', val: readiness.breakdown.mockInterview, max: 10 },
            ].map(item => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="font-semibold text-white">{item.val} / {item.max}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${(item.val / item.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Strengths & Improvements */}
        <div className="card p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Trophy size={16} className="text-emerald-400" /> Strengths
          </h3>
          {readiness.strengths.length === 0 ? (
            <p className="text-xs text-slate-500">No major strengths identified yet.</p>
          ) : (
            <ul className="space-y-2">
              {readiness.strengths.map((s, i) => (
                <li key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-400" /> Areas of Focus
          </h3>
          {readiness.improvements.length === 0 ? (
            <p className="text-xs text-slate-500">All parameters are in good shape!</p>
          ) : (
            <ul className="space-y-2">
              {readiness.improvements.map((s, i) => (
                <li key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div className="card p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Compass size={16} className="text-indigo-400" /> Actionable Recommendations
        </h3>
        {readiness.suggestions.length === 0 ? (
          <p className="text-xs text-slate-500">Your profile is highly optimized. Start applying!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {readiness.suggestions.map((s, i) => (
              <div key={i} className="p-3 bg-white/3 border border-white/5 rounded-xl flex gap-3 items-start">
                <div className="w-5 h-5 rounded-lg bg-indigo-500/10 flex items-center justify-center text-[10px] font-bold text-indigo-300 mt-0.5">{i+1}</div>
                <p className="text-xs text-slate-300 leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Test Scores Modal */}
      {isUpdating && (
        <div className="modal-overlay">
          <div className="modal-content max-w-sm">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">Update Test Scores</h3>
              <button onClick={() => setIsUpdating(false)} className="p-1 text-slate-400 hover:text-white rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleUpdateScores} className="p-5 space-y-4">
              {([
                { label: 'Aptitude Score (%)', key: 'aptitude' },
                { label: 'Coding Score (%)', key: 'coding' },
                { label: 'Communication Score (%)', key: 'communication' },
                { label: 'Mock Interview Score (%)', key: 'mock' },
              ] as const).map(item => (
                <div key={item.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-slate-300">{item.label}</label>
                    <span className="text-xs font-bold text-indigo-400">{scores[item.key]}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    className="w-full accent-indigo-500"
                    value={scores[item.key]}
                    onChange={e => setScores(s => ({ ...s, [item.key]: parseInt(e.target.value) }))}
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsUpdating(false)} className="btn-ghost flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── RESUME MANAGER & ATS ANALYZER ───────────────────────────────────────────

const ROLE_KEYWORDS: Record<string, string[]> = {
  'Software Engineer': ['java', 'python', 'javascript', 'typescript', 'dsa', 'data structures', 'algorithms', 'database', 'sql', 'git', 'system design', 'rest api', 'testing', 'aws', 'docker'],
  'Frontend Developer': ['javascript', 'typescript', 'react', 'html', 'css', 'tailwind', 'next.js', 'frontend', 'dom', 'redux', 'ui/ux', 'web design', 'responsiveness', 'css3', 'sass'],
  'Data Scientist': ['python', 'pandas', 'numpy', 'sql', 'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn', 'data visualization', 'statistics', 'regression', 'r'],
  'Product Manager': ['roadmap', 'agile', 'scrum', 'user stories', 'jira', 'analytics', 'sql', 'wireframing', 'metrics', 'kpi', 'product lifecycle', 'market research'],
  'DevOps Engineer': ['docker', 'kubernetes', 'jenkins', 'ci/cd', 'aws', 'terraform', 'ansible', 'linux', 'monitoring', 'prometheus', 'git', 'cloud', 'nginx', 'bash']
};

const SECTION_PATTERNS = {
  contactInfo: ['email', 'phone', 'contact', 'address', 'mobile'],
  education: ['education', 'university', 'college', 'degree', 'cgpa', 'school', 'academics', 'b.e', 'b.tech', 'm.tech', 'grade'],
  experience: ['experience', 'work', 'employment', 'internship', 'job', 'professional', 'worked at'],
  projects: ['projects', 'project', 'key projects', 'personal projects'],
  skills: ['skills', 'technologies', 'technical skills', 'languages', 'core competencies'],
  certifications: ['certifications', 'certification', 'certificates', 'certified'],
  linkedin: ['linkedin.com'],
  github: ['github.com']
};

export function ResumeManager() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [isUploading, setIsUploading] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');
  const [showTextArea, setShowTextArea] = useState(false);

  // Analysis result states
  const [completeness, setCompleteness] = useState(0);
  const [atsScore, setAtsScore] = useState(0);
  const [foundKeywords, setFoundKeywords] = useState<string[]>([]);
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
  const [sectionsOk, setSectionsOk] = useState<Record<string, boolean>>({
    contactInfo: false,
    education: false,
    experience: false,
    projects: false,
    skills: false,
    certifications: false,
    linkedin: false,
    github: false
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const p = getUserProfile();
    if (p) {
      setProfile(p);
      // Pre-fill if name exists
      if (p.resumeUploaded && p.resumeName) {
        setFileName(p.resumeName);
      }
    }
  }, []);

  // Run ATS analysis live on text change or target role change
  useEffect(() => {
    if (!resumeText.trim()) {
      setCompleteness(0);
      setAtsScore(0);
      setFoundKeywords([]);
      setMissingKeywords(ROLE_KEYWORDS[targetRole] || []);
      setSectionsOk({
        contactInfo: false,
        education: false,
        experience: false,
        projects: false,
        skills: false,
        certifications: false,
        linkedin: false,
        github: false
      });
      setSuggestions([
        "Paste your resume text below or upload a file to start the live ATS evaluation.",
        `Include target keywords like: ${ROLE_KEYWORDS[targetRole].slice(0, 4).join(', ')}.`
      ]);
      return;
    }

    const textLower = resumeText.toLowerCase();

    // 1. Analyze Sections
    const analyzedSections: Record<string, boolean> = {};
    let foundSectionsCount = 0;
    let computedCompleteness = 0;

    Object.entries(SECTION_PATTERNS).forEach(([section, keywords]) => {
      const isFound = keywords.some(kw => textLower.includes(kw));
      analyzedSections[section] = isFound;
      
      // Calculate completeness weightage
      if (isFound) {
        foundSectionsCount++;
        if (['education', 'experience', 'projects', 'skills'].includes(section)) {
          computedCompleteness += 15;
        } else {
          computedCompleteness += 10;
        }
      }
    });

    setCompleteness(computedCompleteness);
    setSectionsOk(analyzedSections);

    // 2. Analyze Keywords
    const targetKeywords = ROLE_KEYWORDS[targetRole] || [];
    const found: string[] = [];
    const missing: string[] = [];

    targetKeywords.forEach(kw => {
      // Regex check for word bounds or substring matches
      if (textLower.includes(kw)) {
        found.push(kw);
      } else {
        missing.push(kw);
      }
    });

    setFoundKeywords(found);
    setMissingKeywords(missing);

    // 3. Check for Quantifiable Achievements (e.g., numbers, percentages, metrics)
    const hasMetrics = /\b\d+\s*(%|lpa|k|m|users|percent|million|speedup)\b/i.test(textLower) || /\b(reduced|increased|improved|optimized|saved)\b.*?\b\d+\b/i.test(textLower);

    // 4. Compute ATS Compatibility Score
    const keywordDensityScore = targetKeywords.length > 0 ? (found.length / targetKeywords.length) * 100 : 0;
    // Combine 40% section completeness and 60% keyword match
    let finalATS = Math.round((computedCompleteness * 0.4) + (keywordDensityScore * 0.6));
    if (hasMetrics) finalATS = Math.min(finalATS + 5, 100); // Bonus for metrics
    setAtsScore(finalATS);

    // 5. Generate Live Actionable suggestions
    const newSuggestions: string[] = [];
    if (!analyzedSections.education) newSuggestions.push("Include a clear 'Education' section with your university details and current CGPA.");
    if (!analyzedSections.projects) newSuggestions.push("Add a 'Projects' section featuring 2-3 technical projects with links to source code.");
    if (!analyzedSections.experience) newSuggestions.push("Add a 'Work Experience' or 'Internships' section to showcase practical knowledge.");
    if (!analyzedSections.linkedin || !analyzedSections.github) newSuggestions.push("Include links to your active LinkedIn and GitHub profiles in the contact header.");
    if (!hasMetrics) newSuggestions.push("Quantify your project results! Use metrics (e.g. 'improved API response latency by 20%', 'served 500+ users').");
    if (missing.length > 0) {
      newSuggestions.push(`Inject missing target keywords: ${missing.slice(0, 3).map(m => `'${m}'`).join(', ')} to boost compatibility.`);
    }

    setSuggestions(newSuggestions);

  }, [resumeText, targetRole]);

  // Handle uploaded files
  const handleUploadLive = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const file = e.target.files[0];
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setResumeText(text || '');
        setIsUploading(false);

        // Update profile in storage
        if (profile) {
          const updated: UserProfile = {
            ...profile,
            resumeUploaded: true,
            resumeName: file.name,
            updatedAt: new Date().toISOString()
          };
          saveUserProfile(updated);
          setProfile(updated);
        }
      };

      reader.onerror = () => {
        setIsUploading(false);
      };

      // Try reading as text (works for TXT, markdown, and simple PDF/DOCX string dumps)
      reader.readAsText(file);
    }
  };

  const getATSColor = (s: number) => {
    if (s >= 80) return 'text-emerald-400';
    if (s >= 55) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Live ATS Resume Optimizer</h2>
          <p className="text-slate-400 text-sm">Upload or paste your resume for real-time ATS keyword matching and parsing completeness</p>
        </div>
        <button
          onClick={() => setShowTextArea(!showTextArea)}
          className="btn-ghost flex items-center gap-2 text-xs py-2 px-3"
        >
          {showTextArea ? "Show File Upload" : "Paste Resume Text"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* File dropzone / Text area Input */}
        <div className="card p-6 md:col-span-2 flex flex-col justify-between min-h-[220px] space-y-4">
          {!showTextArea ? (
            <div>
              <h3 className="text-sm font-bold text-slate-400 mb-4">Resume File (.pdf, .docx, .txt)</h3>
              <div className="border-2 border-dashed border-white/10 hover:border-indigo-500/50 rounded-2xl p-6 text-center transition-all bg-black/20 relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.md"
                  onChange={handleUploadLive}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-200">
                      {fileName ? fileName : 'Drag & drop your resume file'}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">Accepts PDF, DOCX, TXT, MD</p>
                  </div>
                </div>
              </div>
              {fileName && (
                <div className="mt-3 text-xs text-slate-400 flex items-center justify-between bg-white/3 border border-white/5 rounded-lg px-3 py-1.5">
                  <span className="truncate max-w-[80%]">📄 {fileName}</span>
                  <button 
                    onClick={() => { setFileName(''); setResumeText(''); }}
                    className="text-red-400 hover:text-red-300 font-bold"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h3 className="text-sm font-bold text-slate-400 mb-2">Paste Resume Text</h3>
              <textarea
                className="input-field text-xs resize-y min-h-[140px] font-mono leading-relaxed"
                placeholder="Paste the full text of your resume here to run the live ATS parser..."
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
              />
            </div>
          )}
          {isUploading && (
            <div className="text-xs text-indigo-400 flex items-center gap-2">
              <RefreshCw size={14} className="animate-spin" /> Reading and extracting resume text...
            </div>
          )}
        </div>

        {/* Dynamic ATS Score & Target Selector */}
        <div className="card p-6 flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-bold text-slate-400 mb-2">ATS Compatibility</h3>
          <div className="flex items-center gap-2 mb-3">
            <select
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              className="bg-white/5 text-xs text-indigo-400 font-bold border border-white/10 rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500/50"
            >
              <option className="bg-[#0f0f1a]" value="Software Engineer">Software Engineer</option>
              <option className="bg-[#0f0f1a]" value="Frontend Developer">Frontend Developer</option>
              <option className="bg-[#0f0f1a]" value="Data Scientist">Data Scientist</option>
              <option className="bg-[#0f0f1a]" value="Product Manager">Product Manager</option>
              <option className="bg-[#0f0f1a]" value="DevOps Engineer">DevOps Engineer</option>
            </select>
          </div>
          <span className={`text-6xl font-black ${getATSColor(atsScore)}`}>{atsScore}%</span>
          <p className="text-[10px] text-slate-500 mt-2 font-medium">Estimated pass rate for {targetRole}</p>
        </div>
      </div>

      {/* Checklist and keyword metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Section Checklist */}
        <div className="card p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400" /> Section Checklist
          </h3>
          <div className="space-y-2">
            {[
              { id: 'contactInfo', label: 'Contact Details' },
              { id: 'education', label: 'Education Segment' },
              { id: 'experience', label: 'Work Experience' },
              { id: 'projects', label: 'Projects Showcase' },
              { id: 'skills', label: 'Core Technical Skills' },
              { id: 'certifications', label: 'Certifications' },
              { id: 'linkedin', label: 'LinkedIn Profile Link' },
              { id: 'github', label: 'GitHub Link' },
            ].map(item => {
              const ok = sectionsOk[item.id];
              return (
                <div key={item.id} className="flex items-center justify-between text-xs p-1">
                  <span className={ok ? 'text-slate-300' : 'text-slate-500 font-medium'}>{item.label}</span>
                  {ok ? (
                    <Check size={14} className="text-emerald-400" />
                  ) : (
                    <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 rounded">Missing</span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="pt-2 border-t border-white/5 flex justify-between text-xs text-slate-400">
            <span>Completeness Score</span>
            <span className="font-bold text-white">{completeness}/100</span>
          </div>
        </div>

        {/* Found Keywords */}
        <div className="card p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Trophy size={16} className="text-emerald-400" /> Keywords Found ({foundKeywords.length})
          </h3>
          {foundKeywords.length === 0 ? (
            <p className="text-xs text-slate-500">No matching role keywords found yet.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
              {foundKeywords.map(kw => (
                <span key={kw} className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg px-2 py-1 font-semibold uppercase">
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Missing Keywords */}
        <div className="card p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-400" /> Keywords Missing ({missingKeywords.length})
          </h3>
          {missingKeywords.length === 0 ? (
            <p className="text-xs text-slate-500 font-medium">All role keywords are satisfied!</p>
          ) : (
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
              {missingKeywords.map(kw => (
                <span key={kw} className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-2 py-1 font-semibold uppercase">
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recommendations recommendations */}
      <div className="card p-6 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles size={16} className="text-indigo-400" /> Actionable Suggestions to Improve Score
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestions.map((s, idx) => (
            <div key={idx} className="p-3 bg-white/3 border border-white/5 rounded-xl flex gap-3 items-start">
              <div className="w-5 h-5 rounded-lg bg-indigo-500/10 flex items-center justify-center text-[10px] font-bold text-indigo-300 mt-0.5">{idx + 1}</div>
              <p className="text-xs text-slate-300 leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── AI CAREER ASSISTANT ─────────────────────────────────────────────────────

interface CoachPlan {
  roadmap: {
    week: string;
    title: string;
    description: string;
    focus: string;
    milestone: string;
  }[];
  missingSkills: string[];
  certifications: {
    name: string;
    provider: string;
    description: string;
  }[];
  resources: {
    name: string;
    category: string;
    desc: string;
    url: string;
  }[];
  interviewPrep: {
    dsa: string[];
    systemDesign: string[];
    behavioral: string[];
  };
  weeklyActions: {
    id: string;
    text: string;
    completed: boolean;
  }[];
  readinessCategory: 'low' | 'medium' | 'high';
  readinessAdvice: string;
}

export function AIAssistant() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [cgpa, setCgpa] = useState('8.0');
  const [skillsInput, setSkillsInput] = useState('');
  const [coachPlan, setCoachPlan] = useState<CoachPlan | null>(null);
  const [activeCoachTab, setActiveCoachTab] = useState<'roadmap' | 'gap' | 'resources' | 'prep' | 'actions'>('roadmap');
  const [generating, setGenerating] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string; date: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [weeklyActions, setWeeklyActions] = useState<{ id: string; text: string; completed: boolean }[]>([]);

  const generateCoachPlan = (
    role: string,
    cgpaVal: number,
    skillsStr: string,
    readinessTotal: number
  ): CoachPlan => {
    const userSkills = skillsStr
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);

    const roleSkillsMap: Record<string, string[]> = {
      'Software Engineer': ['dsa', 'oops', 'dbms', 'operating systems', 'java', 'c++', 'system design', 'git'],
      'Frontend Developer': ['html', 'css', 'javascript', 'react', 'tailwind', 'typescript', 'webpack', 'testing'],
      'Backend Developer': ['node.js', 'sql', 'databases', 'rest apis', 'express', 'docker', 'redis', 'system design', 'jwt'],
      'Full Stack Developer': ['react', 'node.js', 'databases', 'express', 'rest apis', 'typescript', 'git', 'devops'],
      'Data Analyst': ['excel', 'sql', 'tableau', 'powerbi', 'python', 'data cleaning', 'reporting'],
      'Data Scientist': ['python', 'sql', 'statistics', 'pandas', 'machine learning', 'eda', 'r', 'tableau'],
      'AI Engineer': ['python', 'machine learning', 'deep learning', 'pytorch', 'llms', 'nlp', 'prompt engineering'],
      'DevOps Engineer': ['linux', 'docker', 'kubernetes', 'ci/cd', 'terraform', 'aws', 'bash', 'monitoring'],
    };

    const targetSkills = roleSkillsMap[role] || roleSkillsMap['Software Engineer'];
    const missing = targetSkills.filter(ts => !userSkills.some(us => us.includes(ts) || ts.includes(us)));

    if (cgpaVal < 7.5) {
      missing.push('Off-campus outreach strategy');
      missing.push('Portfolio website & GitHub optimization');
    }

    let roadmap: CoachPlan['roadmap'] = [];
    if (role === 'Frontend Developer') {
      roadmap = [
        { week: 'Week 1', title: 'Advanced CSS & Modern Workflows', description: 'Master flexbox, CSS Grid, responsive design, and CSS variables. Build 3 pixel-perfect UI challenges.', focus: 'HTML/CSS Layouts & Responsive Design', milestone: 'Responsive Portfolio Page live on GitHub' },
        { week: 'Week 2', title: 'Asynchronous JavaScript & APIs', description: 'Deep dive into event loop, promises, async/await, and REST API integrations. Practice ES6 syntax.', focus: 'JS ES6+ & Fetch API', milestone: 'Dynamic Dashboard fetching weather/stocks API' },
        { week: 'Week 3', title: 'React Core & State Management', description: 'Learn hook lifecycle (useEffect, useMemo), state management (Zustand or Redux Toolkit), and React Router.', focus: 'React, Hooks, & State Management', milestone: 'E-commerce Cart application with localized state' },
        { week: 'Week 4', title: 'Optimization & Frameworks', description: 'Optimize performance using Lighthouse. Learn Next.js basics and SEO tags.', focus: 'Performance & Production Deployment', milestone: 'Next.js application fully optimized, achieving 90+ Lighthouse score' }
      ];
    } else if (role === 'Backend Developer') {
      roadmap = [
        { week: 'Week 1', title: 'Language Foundations & Runtime Environment', description: 'Master asynchronous processes, event loops, and core modules in Node.js or Python.', focus: 'Server Environments & Async Logic', milestone: 'Multi-threaded background task processor utility' },
        { week: 'Week 2', title: 'Database Schema Design & Query Tuning', description: 'Build relationships, write complex SQL aggregations, add indexes, and profile query speeds.', focus: 'Relational Database Design (PostgreSQL)', milestone: 'Optimized schema database for a social platform with 10k mock rows' },
        { week: 'Week 3', title: 'RESTful API Engineering & Authentication', description: 'Implement middleware, JWT tokens, secure cookies, and route validation schema.', focus: 'Secure Web API Architecture', milestone: 'Full auth backend service deployed to Render/AWS' },
        { week: 'Week 4', title: 'Containerization & Caching', description: 'Dockerize your backend service. Integrate Redis for API endpoint caching and throttle requests.', focus: 'Redis Caching & Docker Deployments', milestone: 'Dockerized microservice running Redis caching layer with local load tests' }
      ];
    } else if (role === 'DevOps Engineer') {
      roadmap = [
        { week: 'Week 1', title: 'Linux Administration & Bash Scripting', description: 'Deep dive into process management, system permissions, file processing, and automated shell scripting.', focus: 'Linux Systems & Automation', milestone: 'A bash utility that aggregates system logs and alerts via webhook' },
        { week: 'Week 2', title: 'Containerization & local registries', description: 'Write multi-stage Dockerfiles. Understand network bridging and volume mounts.', focus: 'Docker Container Networking', milestone: 'Multi-container web app orchestrated using Docker Compose' },
        { week: 'Week 3', title: 'Continuous Integration & Delivery Pipelines', description: 'Write automated test workflows, code coverage audits, and build notifications using GitHub Actions.', focus: 'CI/CD Pipeline Automation', milestone: 'Fully automated testing and auto-deployment pipeline triggers' },
        { week: 'Week 4', title: 'Infrastructure as Code (IaC) & Cloud', description: 'Learn Terraform configs, providers, and state files. Deploy simple VMs or serverless instances in AWS/GCP.', focus: 'Terraform & Cloud provisioning', milestone: 'Provisioned VPC and compute instances in AWS using pure Terraform' }
      ];
    } else if (role === 'AI Engineer') {
      roadmap = [
        { week: 'Week 1', title: 'Python for Scientific Computing & EDA', description: 'Leverage NumPy vectorization and Pandas data manipulation. Master data cleaning and plotting patterns.', focus: 'Data Engineering & Wrangling', milestone: 'Exploratory analysis report of a complex 100k-row CSV dataset' },
        { week: 'Week 2', title: 'Machine Learning Pipeline Foundations', description: 'Configure feature scaling, model training, cross-validation, and hyperparameter tuning with Scikit-learn.', focus: 'Supervised Learning Algorithms', milestone: 'End-to-end predictive pipeline achieving 85%+ accuracy' },
        { week: 'Week 3', title: 'Deep Learning & Neural Network tuning', description: 'Build feedforward and convolutional neural networks in PyTorch. Debug backprop and loss convergence.', focus: 'PyTorch/Tensorflow Foundations', milestone: 'Image Classifier trained from scratch showing training/validation curves' },
        { week: 'Week 4', title: 'LLM APIs, Prompts, & RAG Frameworks', description: 'Learn Prompt Engineering protocols, connect semantic Vector databases (ChromaDB), and build a retrieval app.', focus: 'Generative AI & LLM Pipelines', milestone: 'Interactive Retrieval-Augmented Generation (RAG) agent chatbot' }
      ];
    } else if (role === 'Data Scientist') {
      roadmap = [
        { week: 'Week 1', title: 'Mathematical foundations & Probability', description: 'Study descriptive statistics, hypothesis testing (t-tests, ANOVA), probability distributions, and A/B test mathematics.', focus: 'Statistical Analysis & Testing', milestone: 'Rigorous A/B test experiment proposal and mathematical calculator' },
        { week: 'Week 2', title: 'Data Cleaning & Feature Engineering', description: 'Handle missing values, encode categories, scale numeric parameters, and perform Dimensionality Reduction (PCA).', focus: 'Data Preprocessing Pipelines', milestone: 'Feature engineering script processing raw web logs for ML modeling' },
        { week: 'Week 3', title: 'Predictive Modeling & Evaluation', description: 'Train Random Forests, XGBoost, and Logistic Regressions. Evaluate using ROC-AUC, precision-recall curve.', focus: 'Classifier & Regressor Pipelines', milestone: 'Customer churn predictive model with robust evaluation metrics report' },
        { week: 'Week 4', title: 'Advanced SQL & Data Presentation', description: 'Master window functions, common table expressions (CTEs), and connect data to BI dashboards.', focus: 'Data Analytics & Visualization', milestone: 'Interactive Tableau/PowerBI dashboard connected to optimized SQL reports' }
      ];
    } else if (role === 'Data Analyst') {
      roadmap = [
        { week: 'Week 1', title: 'Spreadsheet Modeling & Advanced Excel', description: 'Master pivot tables, index-match, conditional formulas, and layout best practices.', focus: 'Excel Analytical Modeling', milestone: 'Financial planning sheet summarizing marketing campaign metrics' },
        { week: 'Week 2', title: 'Structured Query Language (SQL)', description: 'Master SELECT, JOIN, GROUP BY, HAVING, and aggregate math across relational tables.', focus: 'SQL Database Querying', milestone: 'Set of 10 complex query scripts extracting sales trends from standard DB' },
        { week: 'Week 3', title: 'Business Intelligence Dashboards', description: 'Import data models into PowerBI/Tableau, build calculated fields, and establish dashboard hierarchy.', focus: 'Data Reporting & Dashboards', milestone: 'Executive Business Performance Dashboard with filters and KPIs' },
        { week: 'Week 4', title: 'Python Analytics Essentials', description: 'Learn basics of Jupyter, Pandas, and Matplotlib. Learn how to script data workflows.', focus: 'Python Data Operations', milestone: 'Automated monthly PDF report generator using Python' }
      ];
    } else if (role === 'Full Stack Developer') {
      roadmap = [
        { week: 'Week 1', title: 'Modern Frontend Application Layout', description: 'Build component trees in React, style using Tailwind CSS, and handle complex form states.', focus: 'React & Responsive Styling', milestone: 'Interactive Task Dashboard with custom components' },
        { week: 'Week 2', title: 'REST API & Web Server Logic', description: 'Build Express routes, wire up request validators, handle CORS and error logging middlewares.', focus: 'Node.js Express Server Design', milestone: 'Secure REST API backend with CRUD routes for resources' },
        { week: 'Week 3', title: 'Database Integration & ORMs', description: 'Connect database tables/collections, manage connections safely, write migrations using Prisma.', focus: 'Relational or Document Storage', milestone: 'Fully integrated app with live database connection pools' },
        { week: 'Week 4', title: 'Security, Hosting & DevOps CI/CD', description: 'Implement JWT validation, protect route endpoints, and deploy to Vercel/Render.', focus: 'Authentication & Cloud Deployment', milestone: 'Complete authenticated SaaS web application live in production' }
      ];
    } else {
      roadmap = [
        { week: 'Week 1', title: 'Data Structures Foundations', description: 'Review Time Complexity. Practice Arrays, Strings, HashMaps, Linked Lists, and Two Pointers on LeetCode.', focus: 'Linear Data Structures', milestone: '50 LeetCode problems solved with optimal time complexity' },
        { week: 'Week 2', title: 'Advanced Algorithms & Tree Recursion', description: 'Master BFS, DFS, Binary Trees, and Recursion. Focus on recursion tree space complexity.', focus: 'Non-Linear Structures & Graph Traversals', milestone: 'Solved all binary tree patterns and basic graph search questions' },
        { week: 'Week 3', title: 'Object-Oriented Design & System Architecture', description: 'Study SOLID design principles, write clean modular code, draw block system diagrams for tiny apps.', focus: 'OOPs & Low-Level Design', milestone: 'UML diagram and code implementation of a parking lot system' },
        { week: 'Week 4', title: 'Database Fundamentals & Mock Prep', description: 'Study indexing, transactions, ACID properties. Conduct mock technical reviews with friends.', focus: 'Relational DBMS & Mock Interviews', milestone: 'Complete simulated technical coding interview successfully' }
      ];
    }

    const certsMap: Record<string, { name: string; provider: string; description: string }[]> = {
      'Frontend Developer': [
        { name: 'Meta Front-End Developer Professional Cert', provider: 'Coursera / Meta', description: 'Covers JavaScript, React, Version Control, and UI/UX design essentials.' },
        { name: 'W3C Frontend Web Developer Credential', provider: 'edX / W3C', description: 'Validates semantic CSS layout techniques, accessibility standard compliance, and web performance optimization.' }
      ],
      'Backend Developer': [
        { name: 'AWS Certified Developer - Associate', provider: 'Amazon Web Services', description: 'Validates expertise in deploying and maintaining backend web applications on the AWS cloud.' },
        { name: 'Node.js Application Development (LFW211)', provider: 'The Linux Foundation', description: 'Demonstrates deep competency in building secure, performant REST APIs with Node.js.' }
      ],
      'DevOps Engineer': [
        { name: 'HashiCorp Certified: Terraform Associate', provider: 'HashiCorp', description: 'Certifies competency in provisioning cloud environments through Infrastructure as Code (IaC).' },
        { name: 'Docker Certified Associate', provider: 'Docker / Mirantis', description: 'Demonstrates deep knowledge of containerizing legacy platforms, Swarm orchestration, and container networking.' }
      ],
      'AI Engineer': [
        { name: 'TensorFlow Developer Professional Certificate', provider: 'Coursera / DeepLearning.AI', description: 'Validates hands-on deep learning model creation, NLP text processing, and image classification.' },
        { name: 'AWS Certified Machine Learning - Specialty', provider: 'AWS', description: 'Demonstrates ability to architect and deploy machine learning models on AWS SageMaker.' }
      ],
      'Data Scientist': [
        { name: 'IBM Data Science Professional Certificate', provider: 'Coursera / IBM', description: 'Covers Python, SQL, data analysis, feature engineering, and basic machine learning modeling.' },
        { name: 'Google Advanced Data Analytics Certificate', provider: 'Coursera / Google', description: 'Validates statistical testing, regression modeling, and machine learning pipelines.' }
      ],
      'Data Analyst': [
        { name: 'Google Data Analytics Professional Certificate', provider: 'Coursera / Google', description: 'Comprehensive training in spreadsheet analysis, SQL querying, and Tableau data visualization.' },
        { name: 'Microsoft Certified: Power BI Data Analyst Associate', provider: 'Microsoft', description: 'Demonstrates expertise in modeling, visualizing, and sharing business reports inside PowerBI.' }
      ],
      'Full Stack Developer': [
        { name: 'Meta Full-Stack Developer Professional Cert', provider: 'Coursera / Meta', description: 'Covers frontend React, backend Node.js, databases, cloud server deployment, and security basics.' }
      ]
    };

    const defaultCerts = [
      { name: 'AWS Certified Cloud Practitioner', provider: 'Amazon Web Services', description: 'Validates foundational knowledge of cloud services and overall AWS ecosystem.' },
      { name: 'Google Project Management Professional Certificate', provider: 'Coursera / Google', description: 'Covers Agile methodology, scrum structures, and project lifecycle management.' }
    ];
    const certifications = certsMap[role] || defaultCerts;

    const resourcesMap: Record<string, { name: string; category: string; desc: string; url: string }[]> = {
      'Frontend Developer': [
        { name: 'Frontend Masters', category: 'Premium Courses', desc: 'In-depth courses on JavaScript, React, CSS Architecture, and TypeScript.', url: 'https://frontendmasters.com' },
        { name: 'freeCodeCamp - React Roadmap', category: 'Interactive Coding', desc: 'Free interactive frontend curriculum covering HTML, CSS, JavaScript, and React.', url: 'https://www.freecodecamp.org' },
        { name: 'Beta React Documentation', category: 'Official Documentation', desc: 'The new official interactive guide for modern functional React hooks and components.', url: 'https://react.dev' }
      ],
      'Backend Developer': [
        { name: 'Backend Engineering by Hussein Nasser', category: 'Video Course', desc: 'Detailed masterclass on TCP/IP, HTTP, gRPC, database scaling, caching, and proxies.', url: 'https://www.youtube.com/@hnasr' },
        { name: 'Node.js Best Practices GitHub', category: 'Documentation', desc: 'The largest compiled list of production guidelines, security checks, and structure rules for backend servers.', url: 'https://github.com/goldbergyoni/nodebestpractices' },
        { name: 'NeetCode System Design', category: 'System Design', desc: 'Introductory design tutorials on vertical scaling, load balancers, and distributed data systems.', url: 'https://neetcode.io' }
      ],
      'AI Engineer': [
        { name: 'DeepLearning.AI Short Courses', category: 'Generative AI', desc: 'Fascinating short courses covering LangChain, Prompt Engineering, RAG systems, and AI agent creation.', url: 'https://www.deeplearning.ai' },
        { name: 'PyTorch Tutorials', category: 'Deep Learning', desc: 'Hands-on notebooks showing tensor arithmetic, autograd math, and neural network training loops.', url: 'https://pytorch.org/tutorials' }
      ],
      'Data Scientist': [
        { name: 'StatQuest with Josh Starmer', category: 'Statistics & ML', desc: 'Incredibly visual, bite-sized tutorials explaining ML algorithms, linear regressions, and statistical concepts.', url: 'https://youtube.com/@statquest' },
        { name: 'Kaggle Learn', category: 'Hands-on Code', desc: 'Interactive micro-courses for machine learning, data cleaning, pandas, and feature engineering.', url: 'https://www.kaggle.com/learn' }
      ]
    };

    const defaultResources = [
      { name: 'LeetCode DSA Tracker', category: 'Coding Interview', desc: 'Practice top 150 interview problems categorized by topics (Two pointers, Graphs, Heap).', url: 'https://leetcode.com' },
      { name: 'System Design Primer', category: 'Architecture', desc: 'Open-source guide on scalability, horizontal scaling, sharding, and CDN caching patterns.', url: 'https://github.com/donnemartin/system-design-primer' },
      { name: 'Tech Interview Handbook', category: 'Preparation guide', desc: 'Curated resource covering coding prep, resume tips, and behavioral question frameworks.', url: 'https://www.techinterviewhandbook.org' }
    ];
    const resources = resourcesMap[role] || defaultResources;

    let dsa: string[] = [];
    let systemDesign: string[] = [];
    let behavioral: string[] = [];

    if (role === 'Frontend Developer') {
      dsa = [
        'DOM Tree Traversal (Implement custom querySelector or getElementById)',
        'Array Manipulations & Flattening nested arrays/objects',
        'Event loop & Debounce / Throttle functions',
        'String matching & regex operations'
      ];
      systemDesign = [
        'Frontend System Design: Design a high-performance Image Carousel',
        'Component Architecture: Modular state design for Infinite Scroll feeds',
        'State synchronization: LocalStorage, Cookies, and React context storage structures',
        'Web Core Vitals: Optimizing LCP, FID, and CLS scores'
      ];
      behavioral = [
        'Explain a time you had to optimize page load speeds and how it affected conversion rates.',
        'How do you collaborate with UX Designers when a component is difficult to implement?'
      ];
    } else if (role === 'Backend Developer' || role === 'Full Stack Developer') {
      dsa = [
        'Dynamic Programming: Knapsack problem, Coin Change, Grid Traversals',
        'Graph Traversals: BFS, DFS, Dijkstra’s shortest path algorithm',
        'HashMaps: Design an LRU Cache with O(1) fetch times',
        'Database querying efficiency: Index-based lookup algorithms'
      ];
      systemDesign = [
        'System Architecture: Design a scalable URL Shortening service (like Bitly)',
        'Distributed Caching: Redis cluster architecture, cache invalidation strategies',
        'Load Balancing: Round Robin, Least Connections, and CDN caching layers',
        'Relational Scaling: Database replication, read-replicas, and horizontal sharding'
      ];
      behavioral = [
        'Describe a time you resolved a major production database bottleneck or server outage.',
        'How do you handle API version deprecation with active enterprise clients?'
      ];
    } else if (role === 'AI Engineer' || role === 'Data Scientist') {
      dsa = [
        'Matrix Transposition & Vector algebra functions from scratch',
        'Binary Search algorithms on sorted feature lists',
        'Graph algorithms for parsing neural network DAGs',
        'Dynamic Programming for string similarity (Levenshtein Distance)'
      ];
      systemDesign = [
        'ML System Design: Architect a real-time Product Recommendation Feed (like Netflix)',
        'Model Deployment: Scaling batch inference versus real-time API scoring containers',
        'Data Pipelines: Architecting an ETL pipeline feeding a feature store (like Feast)',
        'Vector Search Scaling: HNSW algorithms for million-scale embedding searches'
      ];
      behavioral = [
        'Explain a time your model performed poorly in production and how you troubleshot it.',
        'How do you explain complex machine learning tradeoffs (e.g. bias vs variance) to non-technical stakeholders?'
      ];
    } else {
      dsa = [
        'Binary Search: Search in a Rotated Sorted Array',
        'Graphs: Number of Islands, Topological Sort',
        'Heaps: Merge k Sorted Lists, Top K Frequent Elements',
        'Trees: Lowest Common Ancestor, Binary Tree Maximum Path Sum'
      ];
      systemDesign = [
        'Design a Chat Application (like WhatsApp) with read receipts and active/inactive status',
        'Design a Rate Limiter to protect public SDE APIs from brute-force attacks',
        'Consistent Hashing: How to distribute traffic evenly across storage nodes',
        'Database locking: Optimistic vs Pessimistic concurrency control'
      ];
      behavioral = [
        'Describe a time you had a technical disagreement with a team lead. How did you align?',
        'Tell me about a challenging technical bug you solved. What was your process?'
      ];
    }

    const weeklyActions = [
      { id: 'act-1', text: `Practice 5 coding problems related to ${role === 'Frontend Developer' ? 'JS/CSS layouts' : 'DSA core patterns'}`, completed: false },
      { id: 'act-2', text: `Design system architecture block diagram for a typical ${role} platform`, completed: false },
      { id: 'act-3', text: 'Upload latest resume copy to Resume Parser and optimize for SDE keyword tags', completed: false },
      { id: 'act-4', text: 'Conduct 1 mock behavioral session focusing on the STAR response method', completed: false },
      { id: 'act-5', text: 'Review Week 1 milestones and record progress logs in GitHub profile README', completed: false },
    ];

    if (cgpaVal < 7.5) {
      weeklyActions.push({ id: 'act-gpa-1', text: 'Apply to 5 off-campus startup roles on Wellfound / LinkedIn', completed: false });
      weeklyActions.push({ id: 'act-gpa-2', text: 'Clean up public GitHub portfolio and write detailed READMEs', completed: false });
    }

    let readinessCategory: CoachPlan['readinessCategory'] = 'medium';
    let readinessAdvice = 'You are in the average zone. Focus on filling intermediate skill gaps and practicing medium-level questions.';

    if (readinessTotal < 60) {
      readinessCategory = 'low';
      readinessAdvice = 'Placement readiness is low. Prioritize base resume parser adjustments, core data structures (Arrays, Trees), and foundational aptitude logic. Start with LeetCode Easy.';
    } else if (readinessTotal >= 85) {
      readinessCategory = 'high';
      readinessAdvice = 'Excellent readiness score! Focus on advanced competitive programming (LeetCode Hard), complex system design scaling, and fine-tuning communication speed/filler words.';
    }

    return {
      roadmap,
      missingSkills: missing,
      certifications,
      resources,
      interviewPrep: { dsa, systemDesign, behavioral },
      weeklyActions,
      readinessCategory,
      readinessAdvice
    };
  };

  useEffect(() => {
    const p = getUserProfile();
    if (p) {
      setProfile(p);
      const roleVal = p.preferredRole || 'Software Engineer';
      const cgpaVal = p.cgpa || '8.0';
      const skillsVal = p.skills && p.skills.length > 0 ? p.skills.join(', ') : 'React, SQL, Python';
      setTargetRole(roleVal);
      setCgpa(cgpaVal);
      setSkillsInput(skillsVal);

      const score = computeReadinessScore(p);
      const plan = generateCoachPlan(roleVal, parseFloat(cgpaVal) || 0, skillsVal, score.total);
      setCoachPlan(plan);
      setWeeklyActions(plan.weeklyActions);
    } else {
      const plan = generateCoachPlan('Software Engineer', 8.0, 'React, SQL, Python', 70);
      setCoachPlan(plan);
      setWeeklyActions(plan.weeklyActions);
    }
  }, []);

  const handleGeneratePlan = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setGenerating(true);

    let updatedProfile: UserProfile;
    if (profile) {
      updatedProfile = {
        ...profile,
        preferredRole: targetRole,
        cgpa: cgpa,
        skills: skillsInput.split(',').map(s => s.trim()).filter(Boolean),
        updatedAt: new Date().toISOString()
      };
    } else {
      updatedProfile = {
        fullName: 'Dhanush Gowda G',
        email: 'dh4nushgowd4@gmail.com',
        preferredRole: targetRole,
        cgpa: cgpa,
        skills: skillsInput.split(',').map(s => s.trim()).filter(Boolean),
        certifications: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    saveUserProfile(updatedProfile);
    setProfile(updatedProfile);

    const score = computeReadinessScore(updatedProfile);

    setTimeout(() => {
      const plan = generateCoachPlan(targetRole, parseFloat(cgpa) || 0, skillsInput, score.total);
      setCoachPlan(plan);
      setWeeklyActions(plan.weeklyActions);
      setGenerating(false);

      const dateStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setMessages([
        {
          sender: 'ai',
          text: `Hello Dhanush! I have successfully generated your personalized preparation plan for **${targetRole}**.\n\n* **CGPA**: ${cgpa} ${parseFloat(cgpa) < 7.5 ? '⚠️ (Low CGPA advice applied)' : ''}\n* **Placement Readiness Score**: ${score.total}/100 (${plan.readinessCategory.toUpperCase()} readiness)\n\nI recommend starting with **Week 1** in the Roadmap tab. Let me know if you have any questions!`,
          date: dateStr
        }
      ]);
    }, 1000);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    const msg = userInput;
    setMessages(prev => [
      ...prev,
      { sender: 'user', text: msg, date: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setUserInput('');

    setGenerating(true);
    setTimeout(() => {
      let reply = '';
      const lower = msg.toLowerCase();
      
      if (lower.includes('week 1') || lower.includes('roadmap')) {
        reply = `For Week 1, focus entirely on the fundamentals. If you're targeting **${targetRole}**, dedicate 2 hours daily to core data structures or layout structures, and build one small repository demonstrating clean commits.`;
      } else if (lower.includes('week 2')) {
        reply = `In Week 2, we raise the complexity. Focus on intermediate topics like asynchronous routines, query performance tuning, or database schema relationships. Don't skip the mock tasks!`;
      } else if (lower.includes('week 3') || lower.includes('week 4')) {
        reply = `For Weeks 3 & 4, it's all about architecture and deployment. Try to containerize your app with Docker and deploy to a cloud server. This adds massive weight to your resume.`;
      } else if (lower.includes('gpa') || lower.includes('cgpa') || lower.includes('academic')) {
        if (parseFloat(cgpa) < 7.5) {
          reply = `With a CGPA of ${cgpa}, you need to build a standout personal brand. Focus on GitHub repositories, publish technical blogs on Medium or dev.to, and target startups on Wellfound that prioritize skills over grades.`;
        } else {
          reply = `Your CGPA of ${cgpa} is solid! This puts you past most initial filters. Just focus on SDE skills, DSA practice, and mock interviews to secure the job offer.`;
        }
      } else if (lower.includes('dsa') || lower.includes('coding') || lower.includes('leetcode')) {
        reply = `DSA prep is key. Try to follow a structured roadmap (like NeetCode 150) rather than random questions. Solve at least one Easy and one Medium problem daily, emphasizing time/space complexities.`;
      } else if (lower.includes('resume') || lower.includes('ats')) {
        reply = `Make sure your resume lists **${skillsInput}** clearly. Use simple single-column PDF templates, format items using the action-verb + impact format, and ensure key tools are listed.`;
      } else if (lower.includes('interview') || lower.includes('behavioral')) {
        reply = `For behavioral rounds, prep 3-4 stories based on the STAR method (Situation, Task, Action, Result) showcasing leadership, resolving conflict, and technical scaling.`;
      } else {
        reply = `That's an excellent question regarding your prep for **${targetRole}**. Beyond the core roadmap, make sure you consistently revise database queries and take mock communication reviews to keep your confidence score high!`;
      }

      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: reply, date: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }
      ]);
      setGenerating(false);
    }, 800);
  };

  const toggleAction = (id: string) => {
    setWeeklyActions(prev =>
      prev.map(act => act.id === id ? { ...act, completed: !act.completed } : act)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">AI Career Coach</h2>
        <p className="text-slate-400 text-sm">Personalized preparation roadmaps, gap analysis, and interactive checklists</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Input parameters */}
        <div className="card p-5 space-y-5 h-fit">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2.5">
            <Sparkles size={16} className="text-indigo-400" /> Plan Parameters
          </h3>
          
          <form onSubmit={handleGeneratePlan} className="space-y-4">
            {/* Target Role */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Role</label>
              <select
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="input-field py-2 px-3 text-xs w-full bg-slate-900 border-white/10 text-slate-200 focus:border-indigo-500"
              >
                <option value="Software Engineer">Software Engineer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="AI Engineer">AI Engineer</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
              </select>
            </div>

            {/* CGPA */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current CGPA</label>
                {parseFloat(cgpa) < 7.5 && (
                  <span className="text-[9px] bg-amber-500/10 text-amber-400 font-bold px-1.5 py-0.2 rounded">Low</span>
                )}
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={cgpa}
                onChange={e => setCgpa(e.target.value)}
                className="input-field py-2 px-3 text-xs w-full"
                placeholder="e.g. 8.5"
              />
            </div>

            {/* Current Skills */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Skills (comma separated)</label>
              <textarea
                value={skillsInput}
                onChange={e => setSkillsInput(e.target.value)}
                className="input-field py-2 px-3 text-xs w-full h-20 resize-none leading-relaxed"
                placeholder="e.g. React, SQL, Python"
              />
            </div>

            {/* Profile Readiness score display */}
            {profile && (
              <div className="p-3 bg-white/3 border border-white/5 rounded-xl space-y-1 text-center">
                <span className="text-[9px] text-slate-500 uppercase font-semibold">Placement Readiness Score</span>
                <div className="text-xl font-black text-indigo-400">
                  {computeReadinessScore(profile).total}/100
                </div>
              </div>
            )}

            {/* Action button */}
            <button
              type="submit"
              disabled={generating}
              className="w-full btn-primary py-2.5 flex items-center justify-center gap-2 font-semibold text-xs animate-none"
            >
              <RefreshCw size={14} className={generating ? 'animate-spin' : ''} />
              {generating ? 'Analyzing Prep Path...' : 'Recalculate Coach Plan'}
            </button>
          </form>
        </div>

        {/* Right: Plan details and Chat Console */}
        <div className="lg:col-span-3 space-y-6">
          {/* Plan Content Panel */}
          <div className="card p-5 space-y-6">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-white/5 pb-3">
              {[
                { id: 'roadmap', label: 'Roadmap', icon: Compass },
                { id: 'gap', label: 'Gap Analysis', icon: AlertTriangle },
                { id: 'resources', label: 'Resources', icon: BookOpen },
                { id: 'prep', label: 'Interview Prep', icon: Brain },
                { id: 'actions', label: `Weekly Actions (${weeklyActions.filter(a => a.completed).length}/${weeklyActions.length})`, icon: CheckCircle2 }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCoachTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      activeCoachTab === tab.id
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                        : 'bg-white/3 hover:bg-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Panels */}
            <div className="min-h-[280px]">
              {generating ? (
                <div className="h-[280px] flex flex-col items-center justify-center text-slate-500">
                  <RefreshCw size={32} className="text-indigo-400 animate-spin mb-3" />
                  <p className="text-xs font-medium">Re-calculating customized preparation metrics...</p>
                </div>
              ) : coachPlan ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCoachTab}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                  >
                    {activeCoachTab === 'roadmap' && (
                      <div className="space-y-6 relative pl-6 border-l border-l-white/10 ml-3 py-2">
                        {coachPlan.roadmap.map((week, idx) => (
                          <div key={idx} className="relative group">
                            <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-indigo-500 group-hover:border-purple-400 transition-all flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:bg-purple-400" />
                            </div>
                            <div className="bg-white/3 hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-xl p-4 transition-all">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="bg-indigo-500/10 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full">{week.week}</span>
                                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{week.title}</h4>
                                </div>
                              </div>
                              <p className="text-xs text-slate-400 leading-relaxed mb-3">{week.description}</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5 text-[11px]">
                                <div>
                                  <span className="text-slate-500 block mb-0.5">Focus Highlight</span>
                                  <span className="text-slate-300 font-medium">{week.focus}</span>
                                </div>
                                <div>
                                  <span className="text-slate-500 block mb-0.5">Weekly Deliverable</span>
                                  <span className="text-emerald-400 font-medium">{week.milestone}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeCoachTab === 'gap' && (
                      <div className="space-y-6">
                        {parseFloat(cgpa) < 7.5 && (
                          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 p-4 rounded-xl flex gap-3 items-start">
                            <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
                            <div className="text-xs space-y-1">
                              <span className="font-bold text-white">CGPA Warning (Score: {cgpa})</span>
                              <p className="text-slate-300 leading-relaxed">
                                Your CGPA is below 7.5. Many campus recruiters enforce strict cutoff rules. 
                                <strong> Strategy:</strong> Prioritize off-campus recruiting, construct an outstanding personal portfolio site, upload contributions to open source, and send direct LinkedIn connection requests to hiring managers to bypass auto-cutoffs.
                              </p>
                            </div>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="card p-5 space-y-4">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                              <AlertTriangle size={14} className="text-rose-400" /> Missing Skills for {targetRole}
                            </h4>
                            <p className="text-slate-500 text-[11px]">
                              Competencies not found in your profile skill tag list.
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {coachPlan.missingSkills.length === 0 ? (
                                <div className="flex items-center gap-2 text-emerald-400 text-xs py-2">
                                  <Check size={14} /> You match all standard role competencies!
                                </div>
                              ) : (
                                coachPlan.missingSkills.map((skill, idx) => (
                                  <span key={idx} className="bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                                    {skill}
                                  </span>
                                ))
                              )}
                            </div>
                          </div>

                          <div className="card p-5 space-y-4">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                              <Award size={14} className="text-indigo-400" /> Recommended Certifications
                            </h4>
                            <p className="text-slate-500 text-[11px]">
                              Credentials to boost your credibility on resumes and platforms.
                            </p>
                            <div className="space-y-3">
                              {coachPlan.certifications.map((cert, idx) => (
                                <div key={idx} className="p-3 bg-white/3 border border-white/5 rounded-lg space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-white">{cert.name}</span>
                                    <span className="text-[9px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-full">{cert.provider}</span>
                                  </div>
                                  <p className="text-[10px] text-slate-400 leading-relaxed">{cert.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeCoachTab === 'resources' && (
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <BookOpen size={14} className="text-purple-400" /> Study Guides & Resource Links
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {coachPlan.resources.map((res, idx) => (
                            <div key={idx} className="card p-4 hover:border-indigo-500/30 hover:bg-white/5 transition-all flex flex-col justify-between h-36">
                              <div className="space-y-1.5">
                                <span className="text-[9px] bg-purple-500/10 text-purple-300 font-bold px-2 py-0.5 rounded-full self-start w-fit block">{res.category}</span>
                                <h5 className="text-xs font-bold text-white">{res.name}</h5>
                                <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">{res.desc}</p>
                              </div>
                              <a
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-2 self-start"
                              >
                                Explore Course <ExternalLink size={10} />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeCoachTab === 'prep' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="card p-5 space-y-4">
                          <div className="flex items-center gap-2 text-indigo-400">
                            <Brain size={16} />
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Coding & DSA Focus</h4>
                          </div>
                          <ul className="space-y-2.5">
                            {coachPlan.interviewPrep.dsa.map((item, idx) => (
                              <li key={idx} className="text-xs text-slate-300 flex gap-2 items-start">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                                <span className="leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="card p-5 space-y-4">
                          <div className="flex items-center gap-2 text-purple-400">
                            <Compass size={16} />
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">System Design & LLD</h4>
                          </div>
                          <ul className="space-y-2.5">
                            {coachPlan.interviewPrep.systemDesign.map((item, idx) => (
                              <li key={idx} className="text-xs text-slate-300 flex gap-2 items-start">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                                <span className="leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="card p-5 space-y-4">
                          <div className="flex items-center gap-2 text-pink-400">
                            <UserCheck size={16} />
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Behavioral & HR Prep</h4>
                          </div>
                          <ul className="space-y-2.5">
                            {coachPlan.interviewPrep.behavioral.map((item, idx) => (
                              <li key={idx} className="text-xs text-slate-300 flex gap-2 items-start">
                                <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                                <span className="leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {activeCoachTab === 'actions' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                              <CheckCircle2 size={14} className="text-emerald-400" /> Interactive Prep Tasks
                            </h4>
                            <p className="text-slate-500 text-[11px] mt-0.5">
                              Complete these tasks to practice and document your weekly readiness milestones.
                            </p>
                          </div>
                          <span className="text-xs font-bold text-indigo-400">
                            {weeklyActions.filter(a => a.completed).length} / {weeklyActions.length} Completed
                          </span>
                        </div>

                        <div className="space-y-2">
                          {weeklyActions.map((act) => (
                            <div
                              key={act.id}
                              onClick={() => toggleAction(act.id)}
                              className={`p-3.5 bg-white/3 border rounded-xl flex items-center justify-between cursor-pointer transition-all hover:bg-white/5 select-none ${
                                act.completed ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-white/5 hover:border-white/10'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                  act.completed 
                                    ? 'bg-emerald-500 border-emerald-500 text-slate-900' 
                                    : 'border-white/20 text-transparent'
                                }`}>
                                  <Check size={12} className="stroke-[3]" />
                                </div>
                                <span className={`text-xs transition-all ${
                                  act.completed ? 'text-slate-500 line-through' : 'text-slate-200'
                                }`}>
                                  {act.text}
                                </span>
                              </div>
                              {act.completed && (
                                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                                  Done
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="h-[280px] flex flex-col items-center justify-center text-slate-500 text-center">
                  <Sparkles size={28} className="text-indigo-400/50 mb-3 animate-pulse" />
                  <p className="text-xs font-medium">Please enter your profile details on the left and click Generate.</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Drawer/Follow-up box */}
          <div className="card p-5 flex flex-col h-[350px]">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-300">Coach Assistant Chat Console</span>
              </div>
              <span className="text-[10px] text-slate-500">Offline interactive agent</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 scrollbar-thin">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-6">
                  <Sparkles size={22} className="text-indigo-400/50 mb-2 animate-pulse" />
                  <p className="text-xs font-medium max-w-xs leading-relaxed">
                    Ask follow-up questions to your AI Coach about roadmap strategies, interview structures, or resume adjustments.
                  </p>
                </div>
              )}
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    m.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white/3 border border-white/5 text-slate-300 rounded-tl-none whitespace-pre-line'
                  }`}>
                    {m.text}
                    <span className="block text-[8px] text-slate-500 mt-2 text-right">{m.date}</span>
                  </div>
                </div>
              ))}
              {generating && (
                <div className="flex justify-start">
                  <div className="bg-white/3 border border-white/5 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input form */}
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                placeholder="Ask a follow-up question (e.g. 'How do I optimize my CGPA?' or 'Tell me about Week 1')..."
                className="input-field py-2.5 text-xs flex-1"
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                disabled={generating}
              />
              <button
                type="submit"
                disabled={generating || !userInput.trim()}
                className="btn-primary p-2.5 aspect-square flex items-center justify-center disabled:opacity-40"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── COMPANY RESEARCH HUB ────────────────────────────────────────────────────

export function CompanyHub() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState<Omit<Company, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '', website: '', linkedin: '', interviewExperiences: '',
    salaryNotes: '', preparationResources: '', personalNotes: '', bookmarked: true
  });

  useEffect(() => {
    setCompanies(getCompanies());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      const u = updateCompany(editing.id, form);
      if (u) setCompanies(prev => prev.map(c => c.id === editing.id ? u : c));
    } else {
      const n = addCompany(form);
      setCompanies(prev => [...prev, n]);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ name: '', website: '', linkedin: '', interviewExperiences: '', salaryNotes: '', preparationResources: '', personalNotes: '', bookmarked: true });
  };

  const handleEdit = (c: Company) => {
    setEditing(c);
    setForm({
      name: c.name, website: c.website ?? '', linkedin: c.linkedin ?? '',
      interviewExperiences: c.interviewExperiences ?? '', salaryNotes: c.salaryNotes ?? '',
      preparationResources: c.preparationResources ?? '', personalNotes: c.personalNotes ?? '',
      bookmarked: c.bookmarked
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteCompany(id);
    setCompanies(prev => prev.filter(c => c.id !== id));
  };

  const toggleBookmark = (c: Company) => {
    const u = updateCompany(c.id, { bookmarked: !c.bookmarked });
    if (u) setCompanies(prev => prev.map(item => item.id === c.id ? u : item));
  };

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Company Research Hub</h2>
          <p className="text-slate-400 text-sm">Save resources, interview experiences and package guidelines for target companies</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={15} /> Bookmark Company
        </button>
      </div>

      {/* Search and stats bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            className="input-field pl-10 py-2.5 text-xs"
            placeholder="Search bookmarked companies..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Bookmark size={36} className="text-indigo-400/40 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-300 mb-2">No companies bookmarked</h3>
          <p className="text-slate-500 text-sm">Add target companies to compile your research docs in one place.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => (
            <div key={c.id} className="card p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">{c.name}</h4>
                    <div className="flex gap-2 mt-1">
                      {c.website && (
                        <a href={c.website.startsWith('http') ? c.website : `https://${c.website}`} target="_blank" rel="noopener" className="text-[10px] text-slate-500 hover:text-indigo-400 flex items-center gap-1">
                          <ExternalLink size={10} /> Site
                        </a>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleBookmark(c)}
                    className="p-1 text-slate-400 hover:text-indigo-400"
                  >
                    <Bookmark size={14} className={c.bookmarked ? 'fill-indigo-500 text-indigo-500' : ''} />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  {c.salaryNotes && (
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Salary Guidelines</span>
                      <p className="text-slate-300 truncate mt-0.5">{c.salaryNotes}</p>
                    </div>
                  )}
                  {c.interviewExperiences && (
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Interview Prep experiences</span>
                      <p className="text-slate-400 line-clamp-2 mt-0.5">{c.interviewExperiences}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-white/5 mt-4">
                <button
                  onClick={() => handleEdit(c)}
                  className="btn-ghost flex-1 py-1.5 text-[10px]"
                >
                  Edit Details
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal-content">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">{editing ? 'Edit' : 'Bookmark'} Company</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">Company Name*</label>
                <input className="input-field" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-1.5 block">Website URL</label>
                  <input className="input-field" placeholder="google.com" value={form.website ?? ''} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-1.5 block">LinkedIn URL</label>
                  <input className="input-field" placeholder="linkedin.com/company/google" value={form.linkedin ?? ''} onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">Salary Structure & Info</label>
                <input className="input-field" placeholder="e.g. 18 Base + 2 Joining Bonus = 20 LPA" value={form.salaryNotes ?? ''} onChange={e => setForm(f => ({ ...f, salaryNotes: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">Interview Experiences / Prep Logs</label>
                <textarea className="input-field resize-none" rows={3} placeholder="Describe hiring rounds, questions asked, etc." value={form.interviewExperiences ?? ''} onChange={e => setForm(f => ({ ...f, interviewExperiences: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">Study & Mock Resources</label>
                <input className="input-field" placeholder="e.g. LeetCode Google Interview list" value={form.preparationResources ?? ''} onChange={e => setForm(f => ({ ...f, preparationResources: e.target.value }))} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── COMMAND PALETTE (CTRL+K / CMD+K) ────────────────────────────────────────

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onTabChange: (tab: DashboardTab) => void;
}

export function CommandPalette({ isOpen, onClose, onTabChange }: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const items = [
    { label: 'Go to Dashboard', shortcut: 'G + D', action: () => { onTabChange('dashboard'); onClose(); } },
    { label: 'Go to Applications Tracker', shortcut: 'G + A', action: () => { onTabChange('applications'); onClose(); } },
    { label: 'Go to Smart Import Portal', shortcut: 'G + SI', action: () => { onTabChange('import'); onClose(); } },
    { label: 'Go to Interview Tracker', shortcut: 'G + I', action: () => { onTabChange('interviews'); onClose(); } },
    { label: 'Go to AI Mock Interview', shortcut: 'G + M', action: () => { onTabChange('mock-interview'); onClose(); } },
    { label: 'Go to Job Drives', shortcut: 'G + J', action: () => { onTabChange('drives'); onClose(); } },
    { label: 'Go to Offer Manager', shortcut: 'G + O', action: () => { onTabChange('offers'); onClose(); } },
    { label: 'Go to Analytics Dashboard', shortcut: 'G + AN', action: () => { onTabChange('analytics'); onClose(); } },
    { label: 'Go to Readiness Engine', shortcut: 'G + R', action: () => { onTabChange('readiness'); onClose(); } },
    { label: 'Go to ATS Resume Manager', shortcut: 'G + RE', action: () => { onTabChange('resume'); onClose(); } },
    { label: 'Go to AI Assistant Console', shortcut: 'G + AI', action: () => { onTabChange('ai-assistant'); onClose(); } },
    { label: 'Go to AI Placement Predictor', shortcut: 'G + P', action: () => { onTabChange('probability'); onClose(); } },
    { label: 'Go to Skill Gap Analyst', shortcut: 'G + SG', action: () => { onTabChange('skill-gap'); onClose(); } },
    { label: 'Go to AI Recruiter Simulator', shortcut: 'G + RS', action: () => { onTabChange('recruiter-simulator'); onClose(); } },
    { label: 'Go to Company Research Hub', shortcut: 'G + C', action: () => { onTabChange('companies'); onClose(); } },
    { label: 'Go to Settings & Profile', shortcut: 'G + S', action: () => { onTabChange('settings'); onClose(); } },
  ];

  const filtered = items.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="modal-overlay z-[100]" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="modal-content max-w-lg overflow-hidden bg-[#0a0a14]/95 border border-white/10 backdrop-blur-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 flex items-center gap-3 border-b border-white/5">
          <Search size={16} className="text-slate-500" />
          <input
            type="text"
            className="bg-transparent text-sm text-white focus:outline-none w-full placeholder-slate-500"
            placeholder="Type a command or search tabs..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          <span className="text-[10px] bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-slate-500">ESC</span>
        </div>

        <div className="p-2 max-h-[300px] overflow-y-auto space-y-1">
          {filtered.length === 0 ? (
            <p className="text-xs text-slate-500 p-4 text-center">No commands found.</p>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={idx}
                onClick={item.action}
                className="w-full text-left p-3 hover:bg-white/5 rounded-xl flex items-center justify-between text-xs text-slate-300 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <ChevronRight size={14} className="text-slate-600 group-hover:text-indigo-400" />
                  <span className="group-hover:text-white font-medium">{item.label}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{item.shortcut}</span>
              </button>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── SMART APPLICATION IMPORT SYSTEM ─────────────────────────────────────────

export function SmartImportSystem({ onSyncComplete }: { onSyncComplete?: () => void }) {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState('');
  const [activeSyncPlatform, setActiveSyncPlatform] = useState('');
  
  // OAuth modal states
  const [oauthPlatform, setOauthPlatform] = useState<string | null>(null);
  const [oauthEmail, setOauthEmail] = useState('');
  const [oauthToken, setOauthToken] = useState('');
  const [oauthLoading, setOauthLoading] = useState(false);

  // URL Auto Tracker states
  const [urlInput, setUrlInput] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapingProgress, setScrapingProgress] = useState('');
  const [scrapedData, setScrapedData] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [scrapingError, setScrapingError] = useState<string | null>(null);

  const handleScanUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    if (!urlInput.startsWith('http://') && !urlInput.startsWith('https://')) {
      setScrapingError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setScrapingError(null);
    setIsScraping(true);
    setScrapedData(null);
    setShowPreview(false);

    setScrapingProgress('Establishing proxy handshake...');
    await new Promise(r => setTimeout(r, 600));
    setScrapingProgress('Initiating headless browser context...');
    await new Promise(r => setTimeout(r, 600));
    setScrapingProgress('Parsing page DOM elements...');
    await new Promise(r => setTimeout(r, 600));
    setScrapingProgress('Analyzing structure metadata with AI models...');
    await new Promise(r => setTimeout(r, 600));
    setScrapingProgress('Formatting payload schemas...');
    await new Promise(r => setTimeout(r, 400));

    try {
      const data = extractJobMetadataFromUrl(urlInput);
      setScrapedData(data);
      setShowPreview(true);
    } catch (err) {
      setScrapingError('Failed to parse URL metadata. Make sure the link is accessible.');
    } finally {
      setIsScraping(false);
      setScrapingProgress('');
    }
  };

  const handleConfirmImport = () => {
    if (!scrapedData) return;

    addApplication({
      companyName: scrapedData.companyName,
      role: scrapedData.role,
      location: scrapedData.location,
      ctc: scrapedData.ctc,
      status: 'Interested',
      applicationDate: new Date().toISOString().split('T')[0],
      notes: `Automatically imported via Smart Auto Tracker from link: ${urlInput}\n\nRequired Skills: ${scrapedData.requiredSkills.join(', ')}`
    });

    const syncLogs = getSyncLogs();
    const newLog: SyncLog = {
      id: Math.random().toString(36).substring(2, 9),
      platform: 'Auto Tracker',
      syncTime: new Date().toISOString(),
      importedCount: 1,
      failedCount: 0,
      status: 'Success'
    };
    const updatedLogs = [newLog, ...syncLogs];
    localStorage.setItem('ptp_sync_logs', JSON.stringify(updatedLogs.slice(0, 50)));
    setLogs(updatedLogs);

    if (onSyncComplete) onSyncComplete();

    setUrlInput('');
    setScrapedData(null);
    setShowPreview(false);
  };

  useEffect(() => {
    setAccounts(getConnectedAccounts());
    setLogs(getSyncLogs());
  }, []);

  const handleConnectClick = (platform: string) => {
    setOauthPlatform(platform);
    setOauthEmail('');
    setOauthToken('');
  };

  const handleConfirmConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oauthPlatform) return;
    setOauthLoading(true);
    await new Promise(r => setTimeout(r, 1000)); // Simulate OAuth handshake

    const updatedAccts = accounts.map(a =>
      a.platform === oauthPlatform ? { ...a, connected: true, username: oauthEmail || 'dhanush_gowda' } : a
    );
    saveConnectedAccounts(updatedAccts);
    setAccounts(updatedAccts);

    setOauthLoading(false);
    setOauthPlatform(null);
  };

  const handleDisconnect = (platform: string) => {
    const updatedAccts = accounts.map(a =>
      a.platform === platform ? { ...a, connected: false, username: undefined, lastSynced: undefined } : a
    );
    saveConnectedAccounts(updatedAccts);
    setAccounts(updatedAccts);
  };

  const handleSyncNow = async (platform: string) => {
    setIsSyncing(true);
    setActiveSyncPlatform(platform);
    
    // Simulate parsing timeline
    setSyncProgress('Initializing secure OAuth handshake...');
    await new Promise(r => setTimeout(r, 600));
    setSyncProgress('Fetching job confirmation headers...');
    await new Promise(r => setTimeout(r, 600));
    setSyncProgress('Parsing metadata (role, salaries, locations)...');
    await new Promise(r => setTimeout(r, 600));
    setSyncProgress('Finalizing local database sync...');
    await new Promise(r => setTimeout(r, 400));

    const result = triggerPlatformSync(platform);
    
    // Refresh states
    setAccounts(getConnectedAccounts());
    setLogs(getSyncLogs());
    setIsSyncing(false);
    setActiveSyncPlatform('');
    setSyncProgress('');

    if (onSyncComplete) onSyncComplete();
  };

  const getPlatformIcon = (platform: string) => {
    return {
      LinkedIn: '💼',
      Naukri: '🏢',
      Indeed: '📋',
      Internshala: '🎓',
      Wellfound: '✌️',
      Unstop: '🏆'
    }[platform] || '🔌';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">Smart Application Import</h2>
        <p className="text-slate-400 text-sm">Automatically sync and import applications from target job boards & portals</p>
      </div>

      {/* Sync Status Banner when running */}
      {isSyncing && (
        <div className="card p-5 border border-indigo-500/30 bg-indigo-500/5 flex items-center gap-4 animate-pulse">
          <RefreshCw size={20} className="text-indigo-400 animate-spin flex-shrink-0" />
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Syncing {activeSyncPlatform}...</h4>
            <p className="text-[10px] text-indigo-300 mt-1 font-mono">{syncProgress}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: URL Auto Tracker Input & Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card p-5 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="text-indigo-400">🔗</span> Smart Link Auto-Tracker
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Paste a job posting URL to automatically extract details and add it to your pipeline.</p>
            </div>

            <form onSubmit={handleScanUrl} className="space-y-3">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1">Job Post / LinkedIn / Career URL</label>
                <input
                  type="text"
                  className="input-field py-2 text-xs"
                  placeholder="Paste URL (e.g. https://linkedin.com/jobs/view/...)"
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  disabled={isScraping}
                  required
                />
              </div>

              {scrapingError && (
                <p className="text-[10px] text-red-400 font-medium flex items-center gap-1.5">
                  <AlertTriangle size={12} className="shrink-0" /> {scrapingError}
                </p>
              )}

              <button
                type="submit"
                disabled={isScraping || !urlInput.trim()}
                className="btn-primary w-full py-2 text-xs flex items-center justify-center gap-2"
              >
                {isScraping ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> Scanning Page...
                  </>
                ) : (
                  <>
                    <span>⚡</span> Scan & Auto-Track
                  </>
                )}
              </button>
            </form>

            {/* Scraping Simulation Loading */}
            {isScraping && (
              <div className="p-3 bg-white/2 border border-white/5 rounded-xl flex items-center gap-3 animate-pulse">
                <RefreshCw size={14} className="text-indigo-400 animate-spin shrink-0" />
                <div className="min-w-0">
                  <span className="text-[9px] font-bold text-slate-400 block uppercase">Scraper Status</span>
                  <span className="text-[10px] text-indigo-300 font-mono block truncate">{scrapingProgress}</span>
                </div>
              </div>
            )}

            {/* Scraped Job Preview Card */}
            {showPreview && scrapedData && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-indigo-500/5 border border-indigo-500/25 rounded-2xl space-y-4"
              >
                <div className="border-b border-white/5 pb-2">
                  <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block">Scraped Job Details</span>
                  <h4 className="text-sm font-black text-white mt-1 leading-tight">{scrapedData.role}</h4>
                  <span className="text-xs font-extrabold text-slate-300">{scrapedData.companyName}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[10px]">
                  <div>
                    <span className="text-slate-500 block">Location</span>
                    <span className="text-white font-semibold">{scrapedData.location}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Est. Salary / CTC</span>
                    <span className="text-emerald-400 font-extrabold">{scrapedData.ctc}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Apply Deadline</span>
                    <span className="text-slate-300 font-semibold">{scrapedData.deadline}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Scrape Match</span>
                    <span className="text-emerald-400 font-extrabold">98% Accuracy</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-slate-500 text-[10px] block">Extracted Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {scrapedData.requiredSkills.map((sk: string) => (
                      <span key={sk} className="bg-white/5 border border-white/10 text-[9px] font-semibold text-slate-300 px-2 py-0.5 rounded-lg">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => { setShowPreview(false); setScrapedData(null); }}
                    className="btn-ghost flex-1 py-1.5 text-[10px] text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmImport}
                    className="btn-primary flex-1 py-1.5 text-[10px] bg-emerald-600 border-emerald-500 text-white font-bold"
                  >
                    Confirm & Track
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Side: Account Integrations Grid */}
        <div className="lg:col-span-7 space-y-4">
          <div className="card p-5 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">OAuth Platform Integrations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {accounts.map(acct => (
                <div key={acct.platform} className={`card p-4 space-y-3 flex flex-col justify-between bg-[#0e0e1e]/20 border border-white/5 ${acct.connected ? 'border-indigo-500/20 bg-indigo-500/2' : ''}`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getPlatformIcon(acct.platform)}</span>
                        <div>
                          <h4 className="font-bold text-white text-xs leading-none">{acct.platform}</h4>
                          <span className="text-[8px] text-slate-500 font-medium">Automatic sync</span>
                        </div>
                      </div>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                        acct.connected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-slate-500 border border-white/5'
                      }`}>
                        {acct.connected ? 'Connected' : 'Offline'}
                      </span>
                    </div>

                    {acct.connected && (
                      <div className="text-[9px] space-y-0.5 bg-white/3 p-2 rounded-lg border border-white/5 text-slate-400 leading-relaxed font-mono">
                        <div>Account: <span className="text-slate-300">{acct.username}</span></div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-1.5 pt-1 border-t border-white/5">
                    {!acct.connected ? (
                      <button
                        onClick={() => handleConnectClick(acct.platform)}
                        className="btn-primary w-full py-1 text-[9px]"
                      >
                        Connect
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleSyncNow(acct.platform)}
                          disabled={isSyncing}
                          className="btn-primary flex-1 py-1 text-[9px] flex items-center justify-center gap-1"
                        >
                          <RefreshCw size={8} className={isSyncing && activeSyncPlatform === acct.platform ? 'animate-spin' : ''} />
                          Sync
                        </button>
                        <button
                          onClick={() => handleDisconnect(acct.platform)}
                          className="btn-ghost py-1 text-[9px] text-red-400 hover:text-red-300"
                        >
                          Disconnect
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sync Log History */}
      <div className="card p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <BookOpen size={16} className="text-indigo-400" /> Synchronization Logs
        </h3>
        {logs.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6 border border-dashed border-white/10 rounded-xl">No synchronization history found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] uppercase font-bold text-slate-500">
                  <th className="pb-2">Platform</th>
                  <th className="pb-2">Timestamp</th>
                  <th className="pb-2">Imported</th>
                  <th className="pb-2">Duplicates (Skipped)</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-white/2 transition-colors">
                    <td className="py-2.5 font-bold text-white flex items-center gap-2">
                      <span className="text-sm">{getPlatformIcon(log.platform)}</span>
                      {log.platform}
                    </td>
                    <td className="py-2.5 text-slate-400">{new Date(log.syncTime).toLocaleString()}</td>
                    <td className="py-2.5 text-emerald-400 font-bold">+{log.importedCount} jobs</td>
                    <td className="py-2.5 text-slate-500 font-medium">{log.failedCount} skipped</td>
                    <td className="py-2.5 text-right font-bold">
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mock OAuth Modal */}
      {oauthPlatform && (
        <div className="modal-overlay z-[60]" onClick={() => !oauthLoading && setOauthPlatform(null)}>
          <div className="modal-content max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="text-base font-bold text-white">Connect {oauthPlatform}</h3>
              <button onClick={() => !oauthLoading && setOauthPlatform(null)} className="p-1 text-slate-400 hover:text-white rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleConfirmConnection} className="p-5 space-y-4">
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3.5 flex items-start gap-2.5 text-[11px] text-indigo-300">
                <Sparkles size={16} className="mt-0.5 flex-shrink-0" />
                <p className="leading-relaxed">Placement Tracker Pro utilizes secure OAuth 2.0. This simulation will verify credentials and link application hooks.</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Email Address / Username</label>
                <input
                  type="text"
                  className="input-field py-2 text-xs"
                  placeholder="e.g. dhanushgowdag"
                  required
                  value={oauthEmail}
                  onChange={e => setOauthEmail(e.target.value)}
                  disabled={oauthLoading}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">OAuth Access Token / Password</label>
                <input
                  type="password"
                  className="input-field py-2 text-xs"
                  placeholder="••••••••••••••••"
                  required
                  value={oauthToken}
                  onChange={e => setOauthToken(e.target.value)}
                  disabled={oauthLoading}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setOauthPlatform(null)} disabled={oauthLoading} className="btn-ghost flex-1 py-2 text-xs">Cancel</button>
                <button type="submit" disabled={oauthLoading} className="btn-primary flex-1 py-2 text-xs flex items-center justify-center gap-1.5">
                  {oauthLoading ? (
                    <RefreshCw size={12} className="animate-spin" />
                  ) : (
                    "Authorize"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AI MOCK INTERVIEW SIMULATOR ─────────────────────────────────────────────

const MOCK_QUESTION_BANK: Record<string, Record<'Beginner' | 'Intermediate' | 'Advanced', {
  technical: string[];
  hr: string[];
  scenario: string[];
  behavioral: string[];
  project: string[];
}>> = {
  'Software Engineer': {
    'Beginner': {
      technical: [
        "Explain the difference between an Array and a Linked List. When is one better than the other?",
        "What is time complexity, and how do you calculate O(N) vs O(log N)?",
        "Describe the difference between recursion and iteration."
      ],
      hr: [
        "Why do you want to pursue software engineering? What drives your interest?",
        "What is your greatest technical strength, and how has it helped you solve problems?",
        "How do you handle working on a task when you don't have clear requirements?"
      ],
      scenario: [
        "If you discover a bug in production at 5:00 PM on Friday, what steps do you take?",
        "Your team uses a library with a known security vulnerability. How do you address it?",
        "You realize a teammate has pushed code that breaks your local environment. What is your reaction?"
      ],
      behavioral: [
        "Describe a time you had to learn a new programming language quickly. What was your method?",
        "Tell me about a time you disagreed with a peer on a coding approach. How was it resolved?",
        "Talk about a project goal you failed to achieve. What did you learn?"
      ],
      project: [
        "Walk me through a project you are proud of. What was the tech stack and why did you choose it?",
        "What was the most challenging bug you solved in your latest project, and how did you trace it?",
        "How did you test your latest project to ensure it works correctly under edge cases?"
      ]
    },
    'Intermediate': {
      technical: [
        "Explain how a hash map works under the hood. What is collision resolution?",
        "Explain the difference between a process and a thread, and how threads share memory.",
        "What is memory management in language runtimes, and what is garbage collection?"
      ],
      hr: [
        "How do you handle work stress or tight sprint deadlines?",
        "Describe your ideal engineering culture and collaborative workspace.",
        "Why are you interested in joining our company specifically?"
      ],
      scenario: [
        "Your API is experiencing sudden latency spikes due to a traffic surge. How do you diagnose and mitigate it?",
        "A core feature you released breaks another module. What is your roll-back and recovery plan?",
        "A database backup fails silently for three days. How do you design systems to prevent this?"
      ],
      behavioral: [
        "Describe a time you proactively refactored code to improve reliability or speed.",
        "Tell me about a time you failed to meet a deadline. How did you manage stakeholder communication?",
        "Describe a time you took on a task that was outside your comfort zone. How did you handle it?"
      ],
      project: [
        "Explain your project's database schema design. How did you optimize queries?",
        "Walk me through how you integrated third-party APIs in a project. How did you handle failures?",
        "How did you implement caching or session management in your last full-stack project?"
      ]
    },
    'Advanced': {
      technical: [
        "Explain REST vs gRPC vs GraphQL. What are the trade-offs of each approach?",
        "How does garbage collection work in V8? Explain garbage collection thrashing and memory leaks.",
        "What are database transactions? Explain ACID properties and database isolation levels."
      ],
      hr: [
        "How do you promote high code quality and mentor junior engineers in your team?",
        "How do you balance product delivery speed against accumulating technical debt?",
        "Describe a time you had to align engineering solutions with business requirements under budget constraints."
      ],
      scenario: [
        "You are migrating a legacy system database to a new cloud setup without downtime. How do you design this?",
        "A business-critical service is failing silently without logging errors. How do you troubleshoot?",
        "Your cluster is running out of disk space due to excessive logs. How do you implement robust log rotation and routing?"
      ],
      behavioral: [
        "Describe a time you made an architectural decision that turned out to be wrong. How did you pivot?",
        "Tell me about a major production incident you led the resolution for. What was the outcome?",
        "Describe a time you had to resolve a severe technical deadlock between two senior engineers."
      ],
      project: [
        "Walk me through the scaling architecture of one of your projects. How did you handle state?",
        "How did you configure your CI/CD pipeline? What optimizations did you make to cut build times?",
        "Explain your system monitoring, metrics collection, and alerting setup on your last deployment."
      ]
    }
  },
  'Frontend Developer': {
    'Beginner': {
      technical: [
        "What is the DOM, and what is the difference between Virtual DOM and Real DOM?",
        "Explain the CSS box model and the difference between absolute, relative, and fixed positioning.",
        "What is semantic HTML and why is it important for accessibility?"
      ],
      hr: [
        "Why do you specialize in Frontend Development over Backend?",
        "How do you stay updated with the rapidly changing frontend ecosystem?",
        "What does 'great user experience' mean to you as a developer?"
      ],
      scenario: [
        "Your layout looks broken on Safari but works on Chrome. What is your troubleshooting strategy?",
        "A user reports that a button on the UI is unresponsive. How do you debug it?",
        "You need to make a website load faster on slow mobile connections. What do you optimize first?"
      ],
      behavioral: [
        "Tell me about a time you translated a design file (e.g., Figma) into functional code.",
        "Describe a time you worked with a backend developer to design an API contract. How did you collaborate?",
        "Tell me about a UI feature you built that you found visually satisfying."
      ],
      project: [
        "Walk me through a web project you built. What library/framework did you use and why?",
        "What frontend optimization techniques did you implement in your latest web project?",
        "How did you implement responsive design in your latest project?"
      ]
    },
    'Intermediate': {
      technical: [
        "Explain React Server Components vs Client Components. When should you use which?",
        "What is client-side routing, and how do single page applications (SPAs) manage history and state?",
        "Explain the event loop in JavaScript and how asynchronous operations run."
      ],
      hr: [
        "How do you approach accessibility (a11y) and SEO in your frontend projects?",
        "What are your core guidelines for writing clean, reusable UI components?",
        "How do you deal with code review feedback that asks for major architectural changes?"
      ],
      scenario: [
        "An image-heavy page takes over 5 seconds to load. How do you optimize its performance?",
        "You need to render a list of 10,000 items without lagging the UI. What techniques do you use?",
        "An API payload structure changed unexpectedly, breaking your frontend components. How do you make them more resilient?"
      ],
      behavioral: [
        "Describe a time you pushed back against a design decision for UX or performance reasons.",
        "Tell me about a time you refactored a legacy state management setup (like Redux or Context).",
        "Describe a time you had to fix a complex visual bug that only appeared in specific screen sizes."
      ],
      project: [
        "Walk me through your global state management design in a past project.",
        "How did you implement form validation and error handling in your latest frontend app?",
        "Explain the folder structure and build configuration of your last React/Next.js project."
      ]
    },
    'Advanced': {
      technical: [
        "Explain how Webpack/Vite bundlers work. What is tree shaking and code splitting?",
        "How does browser rendering work? Explain reflow and repaint and how to avoid them.",
        "Compare different styling methodologies like CSS Modules, CSS-in-JS, and TailwindCSS in large-scale projects."
      ],
      hr: [
        "How do you establish a design system or component library for a large team?",
        "How do you manage frontend security risks like XSS, CSRF, and clickjacking?",
        "How do you lead frontend architecture alignment across multiple separate feature teams?"
      ],
      scenario: [
        "Your web application has a memory leak causing browsers to freeze after 15 minutes of use. How do you debug it?",
        "You need to micro-frontend an existing large codebase. How do you structure the modular build?",
        "Your application needs to support fully offline offline capabilities. How do you set up Service Workers and caching?"
      ],
      behavioral: [
        "Tell me about a time you led the migration of a large frontend codebase from JS to TS or React to Next.js.",
        "Describe how you resolved a major rendering performance deadlock in a production web app.",
        "Tell me about a time you mentored developers on modern CSS and HTML semantics."
      ],
      project: [
        "Walk me through the build pipeline and caching strategy of a high-traffic web application you built.",
        "How did you manage responsive UI layouts and dark/light modes across a multi-tenant platform?",
        "Explain the testing strategy (Unit, Integration, E2E) you set up for your last production application."
      ]
    }
  },
  'Backend Developer': {
    'Beginner': {
      technical: [
        "What is an API, and what is the difference between HTTP GET and POST requests?",
        "Explain what database normalization is and why we do it.",
        "What are relational vs non-relational databases?"
      ],
      hr: [
        "Why did you choose backend engineering? What aspects of server-side programming excite you?",
        "How do you ensure your code is readable and maintainable by others?",
        "How do you approach debugging code when you don't know where the error is?"
      ],
      scenario: [
        "You are getting a 'Connection Timeout' error from your database. What are the first three things you check?",
        "A client reports getting a 500 Internal Server Error. How do you locate the error logs?",
        "You notice that database queries are slowing down as data grows. How do you begin to optimize?"
      ],
      behavioral: [
        "Tell me about a time you had to write a script to automate a repetitive backend task.",
        "Describe a team project where you had to coordinate API structures with a frontend developer.",
        "Describe a time you had to fix code written by someone else."
      ],
      project: [
        "Walk me through a backend application you built. What database did you select and why?",
        "How did you structure your API endpoints and routing in your latest server project?",
        "Explain the data modeling schema of your last API database."
      ]
    },
    'Intermediate': {
      technical: [
        "Explain the difference between SQL and NoSQL databases. When is MongoDB preferred over PostgreSQL?",
        "What is caching? Explain redis caching strategies like write-through vs cache-aside.",
        "Explain how database indexes work. What are the downsides of indexing?"
      ],
      hr: [
        "How do you handle backend security practices like password hashing, JWT, and CORS?",
        "Describe your testing strategy for backend services (unit vs integration vs load testing).",
        "What do you do when a feature takes twice as long as you estimated?"
      ],
      scenario: [
        "Your backend service is running out of memory under heavy load. How do you debug and resolve it?",
        "You need to schedule a background cron job to process millions of records daily. How do you design it?",
        "Your server needs to consume a webhook but the sender retries aggressively on failure. How do you ensure idempotency?"
      ],
      behavioral: [
        "Tell me about a time you optimized a slow SQL query. What was the bottleneck and how did you fix it?",
        "Describe a time you had to deal with an unstable third-party API. How did you make your service resilient?",
        "Tell me about a time you refactored API routes to speed up payload delivery."
      ],
      project: [
        "Walk me through the authentication and authorization flow of a past backend project.",
        "How did you handle file uploads, storage, and processing in a backend system you built?",
        "Describe the deployment and containerization of your last server API."
      ]
    },
    'Advanced': {
      technical: [
        "Explain database transaction isolation levels. What is dirty read, non-repeatable read, and phantom read?",
        "How do message queues (like Kafka or RabbitMQ) work? What is event-driven architecture?",
        "Compare SQL scaling (sharding/replication) vs NoSQL document embedding for read/write workloads."
      ],
      hr: [
        "How do you design a highly available backend system? What are active-active vs active-passive setups?",
        "How do you manage database scaling techniques like sharding, replication, and read/write splitting?",
        "How do you advocate for clean architecture and testing protocols in a fast-paced business environment?"
      ],
      scenario: [
        "A microservice is blocking execution threads due to slow downstream network calls. How do you implement a circuit breaker?",
        "You need to enforce strict rate limits across a cluster of API servers. How do you design it?",
        "You need to migrate data between two database architectures in production with zero downtime. How do you design the sync?"
      ],
      behavioral: [
        "Describe a time you migrated a backend system from a monolith to microservices. What went wrong?",
        "Tell me about a time you had to recover lost data or debug a database deadlock in production.",
        "Explain how you resolved a major thread locking or race condition issue in a high-concurrency app."
      ],
      project: [
        "Walk me through the horizontal scaling and session clustering architecture of a high-throughput backend system.",
        "Explain how you monitored, logged, and set up alerts for a backend deployment (e.g., Prometheus, Grafana, ELK).",
        "Describe a complex data pipeline you built to sync transaction logs to a warehouse."
      ]
    }
  }
};

const DEFAULT_QUESTIONS = {
  technical: [
    "Explain the core components of your target technology stack and how they interact.",
    "How do you ensure code scalability, readability, and performance in your coding tasks?",
    "Describe the difference between time and space complexity in algorithms."
  ],
  hr: [
    "Tell me about yourself. What are your core career goals?",
    "Why are you interested in this role? What makes you a strong fit?",
    "How do you handle critical feedback from peers or team leaders?"
  ],
  scenario: [
    "If your application crashed in production, what is your step-by-step debug flow?",
    "How do you handle a situation where business requirements change mid-development?",
    "Your project deadline is cut in half. How do you adjust your scope and engineering design?"
  ],
  behavioral: [
    "Describe a time you worked on a team and had to resolve a technical conflict.",
    "Tell me about a time you had to learn a new framework or technology quickly.",
    "Describe a project challenge you faced and how you overcame it."
  ],
  project: [
    "Walk me through a project you built. What was the core architecture and why did you choose it?",
    "What was the most challenging technical hurdle in your last project?",
    "Explain how you validated and tested your code before declaring a project complete."
  ]
};

interface ISpeechRecognitionError {
  error: string;
  message?: string;
}

interface ISpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onerror: ((event: ISpeechRecognitionError) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface WindowSpeechRecognition {
  SpeechRecognition?: new () => ISpeechRecognition;
  webkitSpeechRecognition?: new () => ISpeechRecognition;
}

export function AIMockInterview() {
  const [view, setView] = useState<'setup' | 'interview' | 'evaluation' | 'history'>('setup');
  
  // Setup parameters
  const [role, setRole] = useState<string>('Software Engineer');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [skills, setSkills] = useState<string>('');

  // Active interview variables
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [currentQuestionType, setCurrentQuestionType] = useState<'primary' | 'followup'>('primary');
  const [chatHistory, setChatHistory] = useState<{ sender: 'interviewer' | 'candidate'; text: string; timestamp: string; }[]>([]);
  const [timer, setTimer] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [interviewerState, setInterviewerState] = useState<'idle' | 'thinking' | 'speaking' | 'evaluating'>('idle');
  const [userInput, setUserInput] = useState<string>('');
  const [interimInput, setInterimInput] = useState<string>('');
  
  // Evaluation output
  const [evaluation, setEvaluation] = useState<MockInterviewSession | null>(null);
  const [pastSessions, setPastSessions] = useState<MockInterviewSession[]>([]);

  // Speech variables
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  // Refs to avoid stale closures in Speech Recognition callbacks
  const userInputRef = useRef<string>('');
  const viewRef = useRef<'setup' | 'interview' | 'evaluation' | 'history'>('setup');
  const isMutedRef = useRef<boolean>(false);
  const isRecordingRef = useRef<boolean>(false);
  const interviewerStateRef = useRef<'idle' | 'thinking' | 'speaking' | 'evaluating'>('idle');
  
  const currentQuestionTypeRef = useRef<'primary' | 'followup'>('primary');
  const questionsRef = useRef<string[]>([]);
  const currentQuestionIdxRef = useRef<number>(0);
  const chatHistoryRef = useRef<{ sender: 'interviewer' | 'candidate'; text: string; timestamp: string; }[]>([]);

  useEffect(() => {
    userInputRef.current = userInput;
  }, [userInput]);

  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  useEffect(() => {
    interviewerStateRef.current = interviewerState;
  }, [interviewerState]);

  useEffect(() => {
    currentQuestionTypeRef.current = currentQuestionType;
  }, [currentQuestionType]);

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  useEffect(() => {
    currentQuestionIdxRef.current = currentQuestionIdx;
  }, [currentQuestionIdx]);

  useEffect(() => {
    chatHistoryRef.current = chatHistory;
  }, [chatHistory]);

  // Load profile data and past mock sessions
  useEffect(() => {
    const p = getUserProfile();
    if (p) {
      setSkills(p.skills?.join(', ') || '');
    }
    setPastSessions(getMockInterviews());
  }, []);

  // Timer runner
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (view === 'interview') {
      interval = setInterval(() => {
        setTimer(t => t + 1);
        setTotalDuration(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [view]);

  // 1. EVALUATION CORE (performEvaluation)
  const performEvaluation = (): MockInterviewSession => {
    const candidateAnswers = chatHistoryRef.current.filter(c => c.sender === 'candidate').map(c => c.text);
    const totalLength = candidateAnswers.reduce((sum, a) => sum + a.length, 0);
    const avgLength = totalLength / (candidateAnswers.length || 1);

    // Count candidate words
    const totalCandidateWords = candidateAnswers.reduce((sum, a) => {
      const words = a.trim().split(/\s+/).filter(Boolean);
      return sum + words.length;
    }, 0);

    // Calculate Speaking Speed WPM
    const durationMinutes = (totalDuration || 1) / 60;
    let speakingSpeedWpm = Math.round(totalCandidateWords / durationMinutes);
    // Clamp to realistic values if user spoke quickly or idle time bloated duration
    if (speakingSpeedWpm < 60 && totalCandidateWords > 5) {
      speakingSpeedWpm = 115 + Math.floor(Math.random() * 15);
    } else if (speakingSpeedWpm > 180) {
      speakingSpeedWpm = 145 + Math.floor(Math.random() * 15);
    } else if (totalCandidateWords === 0) {
      speakingSpeedWpm = 0;
    }

    // Filler words calculation
    const fillerWordsList = ["like", "uh", "um", "ah", "eh", "you know", "basically", "actually", "so"];
    let fillerWordsCount = 0;
    candidateAnswers.forEach(ans => {
      const words = ans.toLowerCase().split(/\s+/);
      words.forEach(w => {
        const cleanWord = w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").trim();
        if (fillerWordsList.includes(cleanWord)) fillerWordsCount++;
      });
      const youKnowMatches = (ans.toLowerCase().match(/you know/g) || []).length;
      fillerWordsCount += youKnowMatches;
    });

    // Clarity Score (%)
    let clarityScore = 82 + Math.min(10, Math.floor(avgLength / 50));
    clarityScore = Math.max(55, clarityScore - Math.min(15, fillerWordsCount * 2));

    // Confidence Score (%)
    let confidenceScore = 84 + (avgLength > 120 ? 4 : 0);
    if (speakingSpeedWpm > 0 && (speakingSpeedWpm < 100 || speakingSpeedWpm > 165)) {
      confidenceScore -= 8;
    }
    confidenceScore -= Math.min(18, fillerWordsCount * 3);
    confidenceScore = Math.max(50, confidenceScore);

    const keywords = ['database', 'api', 'react', 'git', 'deploy', 'model', 'scale', 'architecture', 'testing', 'security', 'caching', 'concurrency', 'optimization', 'index'];
    let keywordCount = 0;
    candidateAnswers.forEach(ans => {
      keywords.forEach(kw => {
        if (ans.toLowerCase().includes(kw)) keywordCount++;
      });
    });

    let base = 70;
    if (level === 'Intermediate') base = 78;
    if (level === 'Advanced') base = 83;

    const lengthMod = Math.min(10, Math.floor(avgLength / 55));
    const keywordMod = Math.min(8, keywordCount);

    const technical = Math.min(98, base + lengthMod + keywordMod + Math.floor(Math.random() * 4));
    const communication = Math.min(97, base - 2 + Math.floor(avgLength / 45) + Math.floor(Math.random() * 5));
    const confidence = Math.min(98, base + 2 + (avgLength > 120 ? 4 : 0) + Math.floor(Math.random() * 5));
    const problemSolving = Math.min(99, base - 1 + Math.floor(keywordCount / 2) + Math.floor(Math.random() * 6));

    const overallScore = Math.round((technical + communication + confidence + problemSolving) / 4);

    const strengths = [
      `Demonstrated solid logical structure matching the ${role} requirements.`,
      avgLength > 120 ? "Provided detailed answers showing deep engineering intuition." : "Addressed scenario questions directly with concise communication.",
      keywordCount > 3 ? "Utilized relevant technical keywords like scaling, caching, and deployment mechanisms." : "Maintained clean conceptual reasoning in system analysis."
    ];

    const weaknesses = [
      avgLength < 80 ? "Answers were slightly brief. Try expanding on architecture decisions and testing." : "Trade-off details could be expanded further.",
      keywordCount < 3 ? "Could introduce more platform terminology like index structures, rate limiters, or state syncing." : "STAR methodology could be applied more clearly in behavioral answers."
    ];

    if (fillerWordsCount > 5) {
      weaknesses.push(`Used filler words (${fillerWordsCount} times) like 'like', 'um', or 'you know'. Try reducing hesitation to sound more polished.`);
    } else if (fillerWordsCount <= 2 && totalCandidateWords > 20) {
      strengths.push("Excellent vocal control with minimal filler words, keeping explanation fluent.");
    }

    if (speakingSpeedWpm > 0 && speakingSpeedWpm >= 110 && speakingSpeedWpm <= 150) {
      strengths.push(`Spoke at an ideal pace of ${speakingSpeedWpm} words per minute, conveying ideas clearly.`);
    }

    const improvements = [
      `Review target system design concepts related to ${role} infrastructures.`,
      "Practice structured communication using STAR (Situation, Task, Action, Result) to emphasize project impacts.",
      "Work on clarifying trade-offs between algorithmic options (time/space complexity)."
    ];

    return {
      id: crypto.randomUUID(),
      role,
      level,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      durationSeconds: totalDuration,
      overallScore,
      scores: { technical, communication, confidence, problemSolving },
      metrics: {
        speakingSpeedWpm,
        fillerWordsCount,
        clarityScore,
        confidenceScore
      },
      feedback: { strengths, weaknesses, improvements },
      chatHistory: chatHistoryRef.current
    };
  };

  // 2. CONTEXTUAL ANSWER ANALYZER (NLP Simulation)
  const analyzeCandidateAnswer = (question: string, answer: string) => {
    const ansLower = answer.toLowerCase().trim();
    
    const ignorantPhrases = [
      "don't know", "dont know", "no idea", "not sure", "pass", "skip", 
      "no answer", "cannot answer", "can't answer", "don't have an answer", 
      "dont have an answer", "skip this", "i am not sure", "i'm not sure", 
      "sorry", "nonsense"
    ];
    
    const isIgnorant = ignorantPhrases.some(phrase => ansLower.includes(phrase));
    const isTooShort = ansLower.length < 15;
    
    if (isIgnorant || isTooShort) {
      return {
        isIgnorantOrTooShort: true,
        matchedKeywords: [],
        missingKeywords: [],
        interactivityComment: "I see. Since you weren't fully sure about that or kept the response very brief, let's keep going. In a live session, remember to walk through any partial reasoning."
      };
    }

    const keywordMap: { patterns: string[]; keywords: string[]; topic: string; }[] = [
      {
        patterns: ["array", "linked list"],
        keywords: ["array", "list", "index", "memory", "pointer", "contiguous", "node", "sequential", "search", "insert"],
        topic: "arrays and linked list structure"
      },
      {
        patterns: ["time complexity", "o(n)"],
        keywords: ["complexity", "time", "space", "notation", "big o", "operation", "loop", "divide", "logarithmic", "linear", "quadratic"],
        topic: "algorithmic time complexity"
      },
      {
        patterns: ["process", "thread"],
        keywords: ["thread", "process", "memory", "share", "cpu", "concurrency", "execution", "lightweight", "overhead", "isolation"],
        topic: "concurrency models and process boundaries"
      },
      {
        patterns: ["hash map"],
        keywords: ["hash", "map", "collision", "key", "value", "index", "bucket", "chaining", "addressing", "load factor"],
        topic: "hash maps and key indexing"
      },
      {
        patterns: ["rest", "grpc", "graphql"],
        keywords: ["rest", "grpc", "graphql", "http", "protobuf", "query", "payload", "schema", "endpoint", "over-fetching"],
        topic: "API architectures and transport layers"
      },
      {
        patterns: ["garbage collection", "v8"],
        keywords: ["garbage", "memory", "leak", "collector", "heap", "v8", "generation", "clean", "reference"],
        topic: "garbage collection and memory heap management"
      },
      {
        patterns: ["acid", "transaction"],
        keywords: ["acid", "transaction", "isolation", "consistency", "durability", "atomicity", "db", "database", "commit", "rollback"],
        topic: "database transactions and ACID principles"
      },
      {
        patterns: ["caching", "session"],
        keywords: ["cache", "session", "redis", "memory", "state", "expire", "in-memory", "cookie", "storage", "performance"],
        topic: "caching and state sessions"
      },
      {
        patterns: ["schema", "optimize"],
        keywords: ["schema", "index", "query", "optimize", "join", "relation", "normalization", "primary key", "foreign key"],
        topic: "schema optimization and indexing"
      },
      {
        patterns: ["third-party api"],
        keywords: ["api", "integration", "timeout", "retry", "endpoint", "fail", "fallback", "error", "http"],
        topic: "third-party API resilience"
      },
      {
        patterns: ["production", "bug"],
        keywords: ["bug", "production", "log", "rollback", "fix", "test", "reproduce", "hotfix", "git"],
        topic: "production incident response and hotfixes"
      },
      {
        patterns: ["security vulnerability"],
        keywords: ["security", "vulnerability", "patch", "update", "audit", "npm", "dependency", "library"],
        topic: "dependency security and vulnerability scanning"
      },
      {
        patterns: ["latency spikes", "surge"],
        keywords: ["latency", "traffic", "scale", "cpu", "ram", "load balancer", "diagnose", "metric", "profile", "log"],
        topic: "performance diagnostics and server scaling"
      },
      {
        patterns: ["roll-back", "breaks"],
        keywords: ["rollback", "git", "version", "deploy", "pipeline", "revert", "test", "canary"],
        topic: "deployment pipelines and canary rollbacks"
      },
      {
        patterns: ["backup"],
        keywords: ["backup", "restore", "fail", "alert", "monitor", "database", "schedule", "cron", "s3", "storage"],
        topic: "backup validation and storage monitoring"
      }
    ];

    const qLower = question.toLowerCase();
    let selectedMap = keywordMap.find(item => 
      item.patterns.some(pat => qLower.includes(pat))
    );

    if (!selectedMap) {
      selectedMap = {
        patterns: [],
        keywords: ["experience", "project", "architecture", "solve", "design", "challenge", "learn", "skill", "team", "code"],
        topic: "your project background and behavioral reasoning"
      };
    }

    const matched = selectedMap.keywords.filter(kw => ansLower.includes(kw));

    if (matched.length >= 2) {
      const kwList = matched.slice(0, 2).join(" and ");
      return {
        isIgnorantOrTooShort: false,
        matchedKeywords: matched,
        missingKeywords: [],
        interactivityComment: `Excellent. Your explanation correctly touches upon ${kwList}, which is key when analyzing ${selectedMap.topic}.`
      };
    } else if (matched.length === 1) {
      return {
        isIgnorantOrTooShort: false,
        matchedKeywords: matched,
        missingKeywords: [],
        interactivityComment: `Got it. You highlighted the role of ${matched[0]}. It's also worth thinking about other aspects of ${selectedMap.topic}.`
      };
    } else {
      const missingSuggest = selectedMap.keywords.slice(0, 2).join(" or ");
      return {
        isIgnorantOrTooShort: false,
        matchedKeywords: [],
        missingKeywords: selectedMap.keywords.slice(0, 2),
        interactivityComment: `Interesting response. However, to make it stronger, a recruiter would expect you to elaborate on concepts like ${missingSuggest} for ${selectedMap.topic}.`
      };
    }
  };

  // 3. DYNAMIC FOLLOW-UP QUESTION GENERATOR
  const generateFollowUpQuestion = (ans: string): string => {
    const ansLower = ans.toLowerCase().trim();
    const ignorantPhrases = [
      "don't know", "dont know", "no idea", "not sure", "pass", "skip", 
      "no answer", "cannot answer", "can't answer", "don't have an answer", 
      "dont have an answer", "skip this", "i am not sure", "i'm not sure", 
      "sorry", "nonsense"
    ];
    const isIgnorant = ignorantPhrases.some(phrase => ansLower.includes(phrase)) || ansLower.length < 15;

    if (isIgnorant) {
      return "Since that concept was a bit challenging, could you instead describe a time you faced a difficult coding bug and how you debugged it step-by-step?";
    }

    if (ansLower.includes('database') || ansLower.includes('sql') || ansLower.includes('query') || ansLower.includes('index')) {
      return "Regarding database performance, how do you balance caching with read/write database scaling? Explain how you'd handle high write concurrency.";
    }
    if (ansLower.includes('react') || ansLower.includes('dom') || ansLower.includes('ui') || ansLower.includes('component')) {
      return "For UI performance, how do you handle state synchronization across multiple independent widgets without causing excessive re-renders?";
    }
    if (ansLower.includes('api') || ansLower.includes('endpoint') || ansLower.includes('server') || ansLower.includes('backend')) {
      return "With APIs, what security practices (rate limiting, token authorization, sanitization) do you introduce to protect these routes?";
    }
    if (ansLower.includes('docker') || ansLower.includes('deploy') || ansLower.includes('ci/cd') || ansLower.includes('git')) {
      return "You mentioned automated deployments. How do you design pipelines to rollback seamlessly if verification checks fail post-deployment?";
    }
    if (ansLower.includes('model') || ansLower.includes('machine learning') || ansLower.includes('data') || ansLower.includes('python')) {
      return "When building these models, how do you diagnose data leakage or ensure training sets remain clean and unbiased?";
    }
    return "That makes sense. What are the key technical trade-offs of this specific approach, and are there scenarios where it would fail?";
  };

  // 4. SPEECH SYNTHESIS (speakText)
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isMuted) {
      setInterviewerState('idle');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en-') && v.name.toLowerCase().includes('female')) ||
                         voices.find(v => v.lang.startsWith('en-')) ||
                         voices[0];
                         
    if (englishVoice) utterance.voice = englishVoice;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setInterviewerState('speaking');
    utterance.onend = () => {
      setInterviewerState('idle');
      // Automatically trigger recording when Sophia finishes speaking, if not muted
      if (!isMutedRef.current && recognitionRef.current && !isRecordingRef.current) {
        try {
          recognitionRef.current.start();
        } catch (err) {
          console.error("Auto-start speech recognition failed", err);
        }
      }
    };
    utterance.onerror = () => setInterviewerState('idle');
    
    window.speechSynthesis.speak(utterance);
  };

  // 5. STANDALONE ANSWER SUBMISSION
  const submitCandidateAnswer = (answer: string) => {
    if (!answer.trim()) return;

    if (isRecordingRef.current && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error(err);
      }
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setChatHistory(prev => [...prev, { sender: 'candidate', text: answer, timestamp }]);
    setUserInput('');
    setInterviewerState('thinking');

    // Retrieve active question text
    let activeQuestion = '';
    if (currentQuestionTypeRef.current === 'followup') {
      const lastInterviewerMsg = [...chatHistoryRef.current].reverse().find(c => c.sender === 'interviewer');
      activeQuestion = lastInterviewerMsg ? lastInterviewerMsg.text : '';
    } else {
      activeQuestion = questionsRef.current[currentQuestionIdxRef.current] || '';
    }
    
    setTimeout(() => {
      // Analyze response words and generate dynamic feedback
      const analysis = analyzeCandidateAnswer(activeQuestion, answer);

      if (currentQuestionTypeRef.current === 'primary') {
        const followUp = generateFollowUpQuestion(answer);
        setCurrentQuestionType('followup');
        const nextPrompt = `${analysis.interactivityComment} Let's expand on that: ${followUp}`;
        setChatHistory(prev => [...prev, { sender: 'interviewer', text: nextPrompt, timestamp }]);
        speakText(nextPrompt);
      } else {
        const nextIdx = currentQuestionIdxRef.current + 1;
        if (nextIdx < questionsRef.current.length) {
          setCurrentQuestionIdx(nextIdx);
          setCurrentQuestionType('primary');
          const nextQuestion = questionsRef.current[nextIdx];
          const intro = `${analysis.interactivityComment} Let's move on to the next question:`;
          setChatHistory(prev => [...prev, { sender: 'interviewer', text: intro, timestamp }]);
          setTimeout(() => {
            setChatHistory(prev => [...prev, { sender: 'interviewer', text: nextQuestion, timestamp }]);
            speakText(`${intro} ${nextQuestion}`);
          }, 800);
        } else {
          setInterviewerState('evaluating');
          const finalRemarks = `${analysis.interactivityComment} Thank you. I am evaluating your overall responses and generating your scorecard now.`;
          speakText(finalRemarks);
          setTimeout(() => {
            const report = performEvaluation();
            setEvaluation(report);
            setView('evaluation');
          }, 2000);
        }
      }
      setTimer(0);
    }, 1200);
  };

  // 6. INITIALIZE SPEECH RECOGNITION
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const win = window as unknown as WindowSpeechRecognition;
      const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';

        rec.onstart = () => {
          setIsRecording(true);
          setInterviewerState('idle'); // Sophia is listening
        };

        rec.onresult = (event: ISpeechRecognitionEvent) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          if (finalTranscript) {
            setUserInput(prev => {
              const cleanedPrev = prev.trim();
              return cleanedPrev ? `${cleanedPrev} ${finalTranscript.trim()}` : finalTranscript.trim();
            });
            setInterimInput('');
          } else {
            setInterimInput(interimTranscript);
          }
        };

        rec.onerror = (event: ISpeechRecognitionError) => {
          console.error('Speech recognition error', event);
          setIsRecording(false);
        };

        rec.onend = () => {
          setIsRecording(false);
          setInterimInput('');
          // Auto-submit response on silence if candidate spoke something
          if (
            viewRef.current === 'interview' &&
            userInputRef.current.trim().length >= 15 &&
            interviewerStateRef.current === 'idle'
          ) {
            submitCandidateAnswer(userInputRef.current);
          }
        };

        recognitionRef.current = rec;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      if (next) {
        window.speechSynthesis.cancel();
        if (interviewerState === 'speaking') setInterviewerState('idle');
      } else {
        const lastRec = chatHistoryRef.current.filter(c => c.sender === 'interviewer').slice(-1)[0];
        if (lastRec) {
          setTimeout(() => {
            speakText(lastRec.text);
          }, 50);
        }
      }
      return next;
    });
  };

  const handleToggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech Recognition API is not supported in this browser. Please use Chrome, Safari or Edge.");
      return;
    }

    if (isRecordingRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error(err);
      }
    } else {
      window.speechSynthesis.cancel();
      setInterviewerState('idle');
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleStartInterview = () => {
    const bank = MOCK_QUESTION_BANK[role]?.[level] || MOCK_QUESTION_BANK['Software Engineer']?.[level] || DEFAULT_QUESTIONS;
    const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    
    const generated = [
      getRandom(bank.technical),
      getRandom(bank.hr),
      getRandom(bank.scenario),
      getRandom(bank.behavioral),
      getRandom(bank.project)
    ];

    setQuestions(generated);
    setCurrentQuestionIdx(0);
    setCurrentQuestionType('primary');
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatHistory([
      { sender: 'interviewer', text: `Welcome to your AI Mock Interview. I am Sophia, your AI Recruiter today. I will evaluate your skills for the ${role} position (${level} level). Let's start with our first question:`, timestamp },
      { sender: 'interviewer', text: generated[0], timestamp }
    ]);
    
    setTimer(0);
    setTotalDuration(0);
    setView('interview');
    
    speakText(`Welcome to your AI Mock Interview. I am Sophia, your AI Recruiter today. I will evaluate your skills for the ${role} position. Let's start with our first question: ${generated[0]}`);
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitCandidateAnswer(userInput);
  };

  const handleSaveSession = () => {
    if (!evaluation) return;
    addMockInterview(evaluation);
    setPastSessions(getMockInterviews());
    setView('setup');
    setEvaluation(null);
  };

  const handleAbort = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setView('setup');
    setChatHistory([]);
  };

  const handleViewReport = (session: MockInterviewSession) => {
    setEvaluation(session);
    setView('evaluation');
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMockInterview(id);
    setPastSessions(getMockInterviews());
  };

  return (
    <div className="space-y-6">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.08); opacity: 0.45; }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes sound-wave-anim {
          0%, 100% { transform: scaleY(0.2); }
          50% { transform: scaleY(1); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2.5s infinite ease-in-out;
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .animate-sound-wave-1 { animation: sound-wave-anim 0.8s infinite ease-in-out; }
        .animate-sound-wave-2 { animation: sound-wave-anim 1.1s infinite ease-in-out; }
        .animate-sound-wave-3 { animation: sound-wave-anim 0.9s infinite ease-in-out; }
        .animate-sound-wave-4 { animation: sound-wave-anim 1.2s infinite ease-in-out; }
        .animate-sound-wave-5 { animation: sound-wave-anim 1.0s infinite ease-in-out; }
      `}} />

      {/* VIEW: Setup Screen */}
      {view === 'setup' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="lg:col-span-2 card p-6 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">Configure Session</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Target Role</label>
                <select
                  className="input-field py-2 text-xs w-full bg-[#0d0d1e]"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                >
                  <option>Software Engineer</option>
                  <option>Frontend Developer</option>
                  <option>Backend Developer</option>
                  <option>Full Stack Developer</option>
                  <option>Data Analyst</option>
                  <option>Data Scientist</option>
                  <option>AI Engineer</option>
                  <option>DevOps Engineer</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Interview Level</label>
                <div className="flex gap-2 bg-[#0d0d1e] p-1 border border-white/5 rounded-xl">
                  {['Beginner', 'Intermediate', 'Advanced'].map(l => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLevel(l as 'Beginner' | 'Intermediate' | 'Advanced')}
                      className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                        level === l ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Focus Skills / Keywords</label>
              <input
                type="text"
                className="input-field py-2 text-xs w-full"
                placeholder="e.g. React, Node.js, SQL, Algorithms"
                value={skills}
                onChange={e => setSkills(e.target.value)}
              />
              <p className="text-[10px] text-slate-500 mt-1">Pre-filled from your profile data. Sophia will adapt questions around these tags.</p>
            </div>

            <button
              onClick={handleStartInterview}
              className="btn-primary py-3 w-full text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <Play size={14} className="fill-white" /> Start AI Mock Interview
            </button>
          </div>

          {/* Past Sessions History */}
          <div className="card p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
              <History size={14} className="text-indigo-400" /> Past Evaluations
            </h3>

            {pastSessions.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center text-slate-500">
                <Brain size={24} className="text-slate-600 mb-2 animate-pulse" />
                <p className="text-xs">No mock evaluations logged yet.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                {pastSessions.map(session => (
                  <div
                    key={session.id}
                    onClick={() => handleViewReport(session)}
                    className="p-3 bg-white/3 border border-white/5 hover:border-indigo-500/20 rounded-xl flex items-center justify-between gap-3 cursor-pointer group transition-all"
                  >
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">{session.role}</p>
                      <p className="text-[9px] text-slate-500 mt-0.5">{session.level} · {session.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/10">{session.overallScore}%</span>
                      <button
                        onClick={(e) => handleDeleteSession(session.id, e)}
                        className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                        title="Delete Session"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW: Active Interview Console */}
      {view === 'interview' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in">
          
          {/* Avatar Panel */}
          <div className="card p-6 flex flex-col items-center justify-center text-center space-y-4 lg:col-span-1 min-h-[300px]">
            <div className="relative flex items-center justify-center">
              {/* Outer Pulsing Glow */}
              <div className="absolute w-28 h-28 rounded-full bg-indigo-500/10 border border-indigo-500/30 animate-pulse-glow" />
              
              {/* Inner Rotating Orbital */}
              {interviewerState === 'thinking' && (
                <div className="absolute w-24 h-24 rounded-full border-2 border-dashed border-indigo-500 animate-spin-slow" />
              )}
              
              {/* Profile Avatar Sphere */}
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 flex items-center justify-center shadow-xl shadow-indigo-600/30 border border-white/10">
                <Brain size={32} className="text-white" />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white">Sophia (AI Recruiter)</h4>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-1">
                {interviewerState === 'idle' && 'Listening...'}
                {interviewerState === 'speaking' && 'Speaking...'}
                {interviewerState === 'thinking' && 'Processing answer...'}
                {interviewerState === 'evaluating' && 'Generating feedback...'}
              </p>
            </div>

            <button
              onClick={handleToggleMute}
              className={`p-2 rounded-xl border transition-all text-[10px] font-bold flex items-center gap-1.5 ${
                isMuted
                  ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/25'
                  : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/25'
              }`}
              title={isMuted ? "Unmute Sophia's Voice" : "Mute Sophia's Voice"}
            >
              {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
              <span>{isMuted ? 'Muted' : 'Voice Active'}</span>
            </button>

            {/* Sound Wave Animation if Speaking */}
            {interviewerState === 'speaking' && (
              <div className="flex items-center gap-1 h-6">
                {[1, 2, 3, 4, 5].map(idx => (
                  <span
                    key={idx}
                    className={`w-1 bg-indigo-400 rounded-full origin-bottom ${
                      idx === 1 ? 'animate-sound-wave-1' :
                      idx === 2 ? 'animate-sound-wave-2' :
                      idx === 3 ? 'animate-sound-wave-3' :
                      idx === 4 ? 'animate-sound-wave-4' : 'animate-sound-wave-5'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Chat Panel */}
          <div className="lg:col-span-3 card p-5 flex flex-col h-[500px]">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{role} Interview</span>
                <span className="text-[9px] bg-indigo-600 px-2 py-0.5 rounded-full font-bold uppercase">{level}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><Clock size={12} className="text-indigo-400" /> Timer: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
                <span>Question: {currentQuestionIdx + 1}/5</span>
              </div>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 scrollbar-thin">
              {chatHistory.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'candidate' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                    m.sender === 'candidate'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white/3 border border-white/5 text-slate-300 rounded-tl-none whitespace-pre-line'
                  }`}>
                    {m.text}
                    <span className="block text-[8px] text-slate-500 mt-2 text-right">{m.timestamp}</span>
                  </div>
                </div>
              ))}
              
              {interviewerState === 'thinking' && (
                <div className="flex justify-start">
                  <div className="bg-white/3 border border-white/5 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Answer Input */}
            <form onSubmit={handleAnswerSubmit} className="space-y-2 text-left">
              <textarea
                placeholder={isRecording ? "Listening... Speak your answer now. (Will auto-submit on silence)" : "Type your response here..."}
                rows={3}
                className={`input-field py-2.5 px-3.5 text-xs w-full resize-none font-sans transition-all ${
                  isRecording ? 'border-red-500/40 bg-red-500/2 text-white' : ''
                }`}
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                disabled={interviewerState === 'thinking' || interviewerState === 'evaluating'}
                required
              />

              {isRecording && interimInput && (
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300 animate-pulse flex items-start gap-2 text-left">
                  <span className="flex-shrink-0 w-2 h-2 rounded-full bg-red-500 mt-1.5 animate-ping" />
                  <div>
                    <span className="font-bold block text-[10px] text-indigo-400 uppercase tracking-wider mb-0.5">Live Transcript (Speaking...)</span>
                    <span className="italic">"{interimInput}"</span>
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-500">Character count: {userInput.length} (minimum 20 recommended)</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleToggleRecording}
                    className={`p-2 rounded-xl border flex items-center justify-center transition-all ${
                      isRecording
                        ? 'bg-red-600 text-white border-red-500 animate-pulse'
                        : 'bg-[#0d0d1e] border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                    title={isRecording ? "Stop Recording" : "Record Answer (Speech-to-Text)"}
                    disabled={interviewerState === 'thinking' || interviewerState === 'evaluating'}
                  >
                    {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
                  </button>
                  <button
                    type="button"
                    onClick={handleAbort}
                    className="btn-ghost py-2 px-4 text-xs"
                  >
                    Abort
                  </button>
                  <button
                    type="submit"
                    disabled={userInput.length < 5 || interviewerState === 'thinking' || interviewerState === 'evaluating'}
                    className="btn-primary py-2 px-5 text-xs font-bold"
                  >
                    Submit Response
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW: Evaluation Report Dashboard */}
      {view === 'evaluation' && evaluation && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Overall Score Radial Gauge */}
            <div className="card p-6 flex flex-col items-center justify-center text-center space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Evaluation Result</h3>
              
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="62" className="stroke-white/5 fill-transparent" strokeWidth="8" />
                  <circle cx="72" cy="72" r="62" className="stroke-emerald-400 fill-transparent" strokeWidth="8" strokeDasharray={390} strokeDashoffset={390 - (390 * evaluation.overallScore) / 100} strokeLinecap="round" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-black text-white">{evaluation.overallScore}%</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">Overall score</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 mt-2">Role: <span className="text-white font-bold">{evaluation.role}</span></p>
                <p className="text-xs text-slate-400">Duration: <span className="text-white font-bold">{Math.floor(evaluation.durationSeconds / 60)}m {evaluation.durationSeconds % 60}s</span></p>
              </div>
            </div>

            {/* Right Column: Score Metrics breakdowns */}
            <div className="lg:col-span-2 card p-6 space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">Core Parameter Metrics</h3>
              
              <div className="space-y-4">
                {[
                  { label: 'Technical Accuracy & Knowledge', score: evaluation.scores.technical, desc: 'Understanding of DSA, patterns, frameworks, and architecture principles.' },
                  { label: 'Communication & Delivery', score: evaluation.scores.communication, desc: 'Pace, structural alignment, explanation style.' },
                  { label: 'Confidence & Assertiveness', score: evaluation.scores.confidence, desc: 'Response detail, answer consistency, and presence.' },
                  { label: 'Problem Solving & Scenarios', score: evaluation.scores.problemSolving, desc: 'STAR format logic and handling edge cases.' }
                ].map(metric => (
                  <div key={metric.label} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-200">{metric.label}</span>
                      <span className="font-black text-indigo-400">{metric.score}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full transition-all text-left" style={{ width: `${metric.score}%` }} />
                    </div>
                    <p className="text-[9px] text-slate-500 text-left">{metric.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Speech & Fluency Performance Dashboard (New Panel) */}
          {evaluation.metrics && (
            <div className="card p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
                <Mic size={14} className="text-indigo-400" /> Speech & Fluency Performance (Voice Analytics)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-white/3 border border-white/5 rounded-xl text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Speaking Speed</span>
                  <span className="text-2xl font-black text-white">{evaluation.metrics.speakingSpeedWpm} <span className="text-xs font-normal text-slate-500">WPM</span></span>
                  <span className="text-[9px] text-slate-500 block">Ideal: 110 - 150 WPM</span>
                </div>
                <div className="p-4 bg-white/3 border border-white/5 rounded-xl text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Filler Words Used</span>
                  <span className={`text-2xl font-black ${evaluation.metrics.fillerWordsCount > 4 ? 'text-amber-400' : 'text-white'}`}>{evaluation.metrics.fillerWordsCount} <span className="text-xs font-normal text-slate-500">times</span></span>
                  <span className="text-[9px] text-slate-500 block font-sans">uh, um, like, you know</span>
                </div>
                <div className="p-4 bg-white/3 border border-white/5 rounded-xl text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clarity Score</span>
                  <span className="text-2xl font-black text-emerald-400">{evaluation.metrics.clarityScore}%</span>
                  <span className="text-[9px] text-slate-500 block font-sans">Diction & correctness</span>
                </div>
                <div className="p-4 bg-white/3 border border-white/5 rounded-xl text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Confidence Rating</span>
                  <span className="text-2xl font-black text-indigo-400">{evaluation.metrics.confidenceScore}%</span>
                  <span className="text-[9px] text-slate-500 block font-sans">Pacing & stability</span>
                </div>
              </div>
            </div>
          )}

          {/* Feedback Lists: Strengths, Weaknesses, Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Strengths */}
            <div className="card p-5 space-y-3 border border-emerald-500/10 bg-emerald-500/2 text-left">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 size={14} /> Strengths
              </h4>
              <ul className="space-y-2">
                {evaluation.feedback.strengths.map((s, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span className="leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="card p-5 space-y-3 border border-red-500/10 bg-red-500/2 text-left">
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle size={14} /> Areas to Improve
              </h4>
              <ul className="space-y-2">
                {evaluation.feedback.weaknesses.map((w, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span className="leading-relaxed">{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvement Tips */}
            <div className="card p-5 space-y-3 border border-indigo-500/10 bg-indigo-500/2 text-left">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                <Brain size={14} /> Recommendations
              </h4>
              <ul className="space-y-2">
                {evaluation.feedback.improvements.map((t, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span className="leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 justify-end">
            <button
              onClick={() => {
                setView('setup');
                setEvaluation(null);
              }}
              className="btn-ghost py-2.5 px-6 text-xs"
            >
              Close Without Saving
            </button>
            <button
              onClick={handleSaveSession}
              className="btn-primary py-2.5 px-8 text-xs font-bold flex items-center gap-1.5"
            >
              <UserCheck size={14} /> Save Session & Return
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

// ─── AI PLACEMENT PROBABILITY PREDICTOR ───────────────────────────────────────

import { Sliders, TrendingUp, BarChart2, Target } from 'lucide-react';

interface PredictorMetrics {
  probability: number;
  readinessLevel: 'Beginner' | 'Developing' | 'Industry Ready' | 'Highly Competitive';
  confidenceLevel: 'Low' | 'Medium' | 'High';
  breakdown: {
    cgpa: number;
    skills: number;
    certifications: number;
    resume: number;
    interview: number;
    applications: number;
  };
}

export function AIPlacementProbabilityPredictor() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [successRate, setSuccessRate] = useState(25);
  const [conversionRate, setConversionRate] = useState(15);

  // Simulator inputs
  const [simCgpa, setSimCgpa] = useState(8.0);
  const [simResumeScore, setSimResumeScore] = useState(75);
  const [simMockScore, setSimMockScore] = useState(72);
  const [simCertsCount, setSimCertsCount] = useState(1);
  const [simBacklogs, setSimBacklogs] = useState(0);

  // Simulated certs achievements (checks)
  const [simCompletedAWS, setSimCompletedAWS] = useState(false);
  const [simCompletedAzure, setSimCompletedAzure] = useState(false);
  const [simCompletedGCP, setSimCompletedGCP] = useState(false);
  const [simCompletedMeta, setSimCompletedMeta] = useState(false);

  // Active Tab
  const [activePredictorTab, setActivePredictorTab] = useState<'overview' | 'gap' | 'certs' | 'factors'>('overview');
  const [selectedRole, setSelectedRole] = useState('Software Engineer');

  useEffect(() => {
    const p = getUserProfile();
    if (p) {
      setProfile(p);
      const cgpaVal = parseFloat(p.cgpa ?? '8.0') || 8.0;
      setSimCgpa(cgpaVal);

      const certsCount = p.certifications?.length || 0;
      setSimCertsCount(certsCount);
      setSimBacklogs(p.activeBacklogs || 0);

      const resumeScoreVal = p.resumeUploaded ? 82 : 55;
      setSimResumeScore(resumeScoreVal);

      const mockSessions = getMockInterviews();
      if (mockSessions && mockSessions.length > 0) {
        const avgMock = Math.round(mockSessions.reduce((acc, s) => acc + s.overallScore, 0) / mockSessions.length);
        setSimMockScore(avgMock);
      } else {
        setSimMockScore(p.mockInterviewScore || 72);
      }

      if (p.preferredRole) {
        setSelectedRole(p.preferredRole);
      }
    }

    const apps = getApplications();
    setApplicationsCount(apps.length);
    if (apps.length > 0) {
      const sRate = getSuccessRate(apps);
      setSuccessRate(sRate);

      const offers = getOffers();
      const convRate = Math.round((offers.length / apps.length) * 100);
      setConversionRate(convRate || 10);
    }
  }, []);

  const computeProbabilityMetrics = (
    cgpaVal: number,
    backlogsVal: number,
    skillsCount: number,
    certsCount: number,
    atsScore: number,
    mockScore: number,
    successRateVal: number,
    conversionRateVal: number
  ): PredictorMetrics => {
    // 15% Academic
    let acadScore = 0;
    if (cgpaVal >= 8.5) acadScore = 15;
    else if (cgpaVal >= 7.5) acadScore = 12;
    else if (cgpaVal >= 6.5) acadScore = 8;
    else acadScore = 4;
    acadScore = Math.max(0, acadScore - (backlogsVal * 8));

    // 20% Skills
    let skillScore = 0;
    if (skillsCount >= 10) skillScore = 20;
    else if (skillsCount >= 6) skillScore = 15;
    else if (skillsCount >= 3) skillScore = 10;
    else skillScore = 5;

    // 10% Certifications
    let certScore = 0;
    if (certsCount >= 3) certScore = 10;
    else if (certsCount === 2) certScore = 8;
    else if (certsCount === 1) certScore = 5;
    else certScore = 2;

    // 15% Resume ATS
    const resumeScore = Math.round((atsScore / 100) * 15);

    // 15% Mock interview
    const interviewScore = Math.round((mockScore / 100) * 15);

    // 25% Application performance (clamped based on success/conversion)
    const appScore = Math.round(((successRateVal / 100) * 12.5) + ((conversionRateVal / 100) * 12.5));

    const totalRaw = acadScore + skillScore + certScore + resumeScore + interviewScore + appScore;
    const probability = Math.min(98, Math.max(10, totalRaw));

    let readinessLevel: PredictorMetrics['readinessLevel'] = 'Developing';
    if (probability >= 85) readinessLevel = 'Highly Competitive';
    else if (probability >= 70) readinessLevel = 'Industry Ready';
    else if (probability >= 50) readinessLevel = 'Developing';
    else readinessLevel = 'Beginner';

    let confidenceLevel: PredictorMetrics['confidenceLevel'] = 'Medium';
    if (mockScore >= 80 && atsScore >= 80 && cgpaVal >= 8.0) confidenceLevel = 'High';
    else if (mockScore < 60 || atsScore < 60 || cgpaVal < 7.0) confidenceLevel = 'Low';

    return {
      probability,
      readinessLevel,
      confidenceLevel,
      breakdown: {
        cgpa: Math.round((acadScore / 15) * 100),
        skills: Math.round((skillScore / 20) * 100),
        certifications: Math.round((certScore / 10) * 100),
        resume: Math.round((resumeScore / 15) * 100),
        interview: Math.round((interviewScore / 15) * 100),
        applications: Math.round((appScore / 25) * 100),
      }
    };
  };

  // Base profile details
  const profileCgpa = profile ? parseFloat(profile.cgpa ?? '8.0') || 8.0 : 8.0;
  const profileBacklogs = profile?.activeBacklogs || 0;
  const profileSkillsCount = profile?.skills?.length || 3;
  const profileCertsCount = profile?.certifications?.length || 1;
  const profileAtsScore = profile?.resumeUploaded ? 82 : 55;

  const mockSessions = getMockInterviews();
  const profileMockScore = mockSessions.length > 0
    ? Math.round(mockSessions.reduce((acc, s) => acc + s.overallScore, 0) / mockSessions.length)
    : profile?.mockInterviewScore || 72;

  // Real Calculated placement metrics
  const currentMetrics = computeProbabilityMetrics(
    profileCgpa,
    profileBacklogs,
    profileSkillsCount,
    profileCertsCount,
    profileAtsScore,
    profileMockScore,
    successRate,
    conversionRate
  );

  // Certs diversity simulator addition
  const certsSimAddition =
    (simCompletedAWS ? 1 : 0) +
    (simCompletedAzure ? 1 : 0) +
    (simCompletedGCP ? 1 : 0) +
    (simCompletedMeta ? 1 : 0);

  // Simulated metrics
  const simulatedMetrics = computeProbabilityMetrics(
    simCgpa,
    simBacklogs,
    profileSkillsCount,
    simCertsCount + certsSimAddition,
    simResumeScore,
    simMockScore,
    successRate,
    conversionRate
  );

  // Categorize skills for Pie Chart
  const skillsList = profile?.skills || ['React', 'SQL', 'Python'];
  const getSkillsCategorization = (skills: string[]) => {
    let frontend = 0;
    let backend = 0;
    let db = 0;
    let cloud = 0;
    let devops = 0;
    let programming = 0;
    let soft = 0;

    skills.forEach(s => {
      const lower = s.toLowerCase();
      if (['react', 'html', 'css', 'javascript', 'typescript', 'tailwind', 'next.js', 'vue', 'angular', 'webpack', 'sass', 'frontend'].some(kw => lower.includes(kw))) {
        frontend++;
      } else if (['node.js', 'express', 'django', 'flask', 'spring', 'nest.js', 'apis', 'jwt', 'microservices', 'graphql', 'backend'].some(kw => lower.includes(kw))) {
        backend++;
      } else if (['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'oracle', 'sqlite', 'prisma', 'mongoose', 'database', 'db'].some(kw => lower.includes(kw))) {
        db++;
      } else if (['aws', 'azure', 'gcp', 'cloud', 'lambda', 's3', 'ec2'].some(kw => lower.includes(kw))) {
        cloud++;
      } else if (['docker', 'kubernetes', 'jenkins', 'ci/cd', 'terraform', 'ansible', 'git', 'github', 'devops'].some(kw => lower.includes(kw))) {
        devops++;
      } else if (['communication', 'teamwork', 'leadership', 'adaptability', 'problem solving', 'presentation'].some(kw => lower.includes(kw))) {
        soft++;
      } else {
        programming++;
      }
    });

    const total = frontend + backend + db + cloud + devops + programming + soft;
    if (total === 0) {
      return [
        { name: 'Frontend', value: 30, color: '#6366f1' },
        { name: 'Backend', value: 20, color: '#a855f7' },
        { name: 'Programming', value: 20, color: '#3b82f6' },
        { name: 'Database', value: 10, color: '#10b981' },
        { name: 'Cloud', value: 5, color: '#06b6d4' },
        { name: 'DevOps', value: 5, color: '#f59e0b' },
        { name: 'Soft Skills', value: 10, color: '#ec4899' },
      ];
    }

    return [
      { name: 'Frontend', value: Math.round((frontend / total) * 100), color: '#6366f1' },
      { name: 'Backend', value: Math.round((backend / total) * 100), color: '#a855f7' },
      { name: 'Programming', value: Math.round((programming / total) * 100), color: '#3b82f6' },
      { name: 'Database', value: Math.round((db / total) * 100), color: '#10b981' },
      { name: 'Cloud', value: Math.round((cloud / total) * 100), color: '#06b6d4' },
      { name: 'DevOps', value: Math.round((devops / total) * 100), color: '#f59e0b' },
      { name: 'Soft Skills', value: Math.round((soft / total) * 100), color: '#ec4899' },
    ].filter(d => d.value > 0);
  };

  const skillsChartData = getSkillsCategorization(skillsList);

  // Line Chart: Trend Over Time
  const trendData = [
    { name: 'Jan', probability: Math.round(currentMetrics.probability * 0.75) },
    { name: 'Feb', probability: Math.round(currentMetrics.probability * 0.85) },
    { name: 'Mar', probability: Math.round(currentMetrics.probability * 0.92) },
    { name: 'Apr (Current)', probability: currentMetrics.probability },
  ];

  // Doughnut Chart: Placement Readiness Breakdown
  const readinessBreakdownData = [
    { name: 'CGPA', value: currentMetrics.breakdown.cgpa, color: '#3b82f6' },
    { name: 'Skills', value: currentMetrics.breakdown.skills, color: '#6366f1' },
    { name: 'Certifications', value: currentMetrics.breakdown.certifications, color: '#a855f7' },
    { name: 'Resume', value: currentMetrics.breakdown.resume, color: '#ec4899' },
    { name: 'Interview', value: currentMetrics.breakdown.interview, color: '#06b6d4' },
  ];

  // Bar Chart: Interview Performance Metrics
  const interviewPerformanceData = [
    { name: 'Technical', score: profileMockScore },
    { name: 'Communication', score: profile?.communicationScore || 75 },
    { name: 'Problem Solving', score: profileMockScore + 2 > 100 ? 100 : profileMockScore + 2 },
    { name: 'Behavioral', score: 72 },
    { name: 'HR', score: 78 }
  ];

  // Skill Gap Analysis mapping
  const roleSkillsMap: Record<string, string[]> = {
    'Software Engineer': ['dsa', 'oops', 'dbms', 'operating systems', 'java', 'c++', 'system design', 'git'],
    'Frontend Developer': ['html', 'css', 'javascript', 'react', 'tailwind css', 'typescript', 'next.js', 'redux', 'jest'],
    'Backend Developer': ['node.js', 'sql', 'databases', 'rest apis', 'express', 'docker', 'redis', 'system design', 'jwt'],
    'Full Stack Developer': ['react', 'node.js', 'databases', 'express', 'rest apis', 'typescript', 'git', 'devops'],
    'Data Analyst': ['excel', 'sql', 'tableau', 'powerbi', 'python', 'data cleaning', 'reporting'],
    'Data Scientist': ['python', 'sql', 'statistics', 'pandas', 'machine learning', 'eda', 'r', 'tableau'],
    'AI Engineer': ['python', 'machine learning', 'deep learning', 'pytorch', 'llms', 'nlp', 'prompt engineering'],
    'DevOps Engineer': ['linux', 'docker', 'kubernetes', 'ci/cd', 'terraform', 'aws', 'bash', 'monitoring'],
  };

  const getSkillGapDetails = (role: string, userSkills: string[]) => {
    const target = roleSkillsMap[role] || roleSkillsMap['Software Engineer'];
    const present = target.filter(ts => userSkills.some(us => us.toLowerCase().includes(ts.toLowerCase()) || ts.toLowerCase().includes(us.toLowerCase())));
    const missing = target.filter(ts => !present.includes(ts));
    const recommended = missing.slice(0, 3);
    const matchPercentage = Math.round((present.length / target.length) * 100);

    return { present, missing, recommended, matchPercentage };
  };

  const skillGap = getSkillGapDetails(selectedRole, skillsList);

  const getMeterColor = (prob: number) => {
    if (prob >= 71) return '#10b981'; // emerald-500
    if (prob >= 41) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const getMeterTextClass = (prob: number) => {
    if (prob >= 71) return 'text-emerald-400';
    if (prob >= 41) return 'text-amber-400';
    return 'text-red-400';
  };

  const CustomChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#10101e] border border-white/10 rounded-xl p-3 shadow-2xl text-[11px]">
          <p className="font-bold text-white mb-1">{payload[0].name}</p>
          <p className="text-slate-400">Value: <span className="text-indigo-400 font-bold">{payload[0].value}%</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black text-white">AI Placement Probability Predictor</h2>
        <p className="text-slate-400 text-sm">Professional visual analytics and simulation models targeting core roles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left column: Meter & Simulator */}
        <div className="space-y-6 lg:col-span-1">
          {/* Radial Meter Card */}
          <div className="card p-6 flex flex-col items-center text-center space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Placement Probability</h3>
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Circular Gauge */}
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="88" cy="88" r="76" className="stroke-white/5 fill-transparent" strokeWidth="10" />
                <circle
                  cx="88"
                  cy="88"
                  r="76"
                  className="fill-transparent transition-all duration-500"
                  stroke={getMeterColor(currentMetrics.probability)}
                  strokeWidth="10"
                  strokeDasharray={477}
                  strokeDashoffset={477 - (477 * currentMetrics.probability) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className={`text-4xl font-black ${getMeterTextClass(currentMetrics.probability)}`}>{currentMetrics.probability}%</span>
                <span className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">{currentMetrics.readinessLevel}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-white/5 text-xs text-left">
              <div>
                <span className="text-slate-500 block mb-0.5">Confidence</span>
                <span className="text-white font-bold">{currentMetrics.confidenceLevel}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Readiness</span>
                <span className="text-white font-bold">{currentMetrics.readinessLevel}</span>
              </div>
            </div>
          </div>

          {/* Sliders Future Simulator */}
          <div className="card p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
              <Sliders size={16} className="text-indigo-400" /> Future Simulator
            </h3>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Adjust sliders to simulate how profile changes affect your placement probability.
            </p>

            <div className="space-y-3.5">
              {/* CGPA */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-300 font-semibold">Simulated CGPA</span>
                  <span className="text-indigo-400 font-bold">{simCgpa.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="5.0"
                  max="10.0"
                  step="0.1"
                  value={simCgpa}
                  onChange={e => setSimCgpa(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Resume Score */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-300 font-semibold">Simulated Resume ATS</span>
                  <span className="text-indigo-400 font-bold">{simResumeScore}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="1"
                  value={simResumeScore}
                  onChange={e => setSimResumeScore(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Mock Score */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-300 font-semibold">Simulated Interview performance</span>
                  <span className="text-indigo-400 font-bold">{simMockScore}%</span>
                </div>
                <input
                  type="range"
                  min="45"
                  max="100"
                  step="1"
                  value={simMockScore}
                  onChange={e => setSimMockScore(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Certs Count */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-300 font-semibold">Simulated Certifications</span>
                  <span className="text-indigo-400 font-bold">{simCertsCount}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={simCertsCount}
                  onChange={e => setSimCertsCount(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>

            {/* Simulated Probability Output */}
            <div className="p-3.5 bg-white/3 border border-white/5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Simulated Result</span>
                <div className="text-2xl font-black text-white">{simulatedMetrics.probability}%</div>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-slate-500 block">Variance</span>
                {simulatedMetrics.probability - currentMetrics.probability >= 0 ? (
                  <span className="text-emerald-400 text-xs font-bold font-sans">
                    +{simulatedMetrics.probability - currentMetrics.probability}% ↑
                  </span>
                ) : (
                  <span className="text-red-400 text-xs font-bold font-sans">
                    {simulatedMetrics.probability - currentMetrics.probability}% ↓
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Analytics, tab panels and recommendations */}
        <div className="lg:col-span-3 space-y-6">
          {/* Main Dashboard tabs */}
          <div className="card p-5 space-y-6">
            <div className="flex flex-wrap gap-2 border-b border-white/5 pb-3">
              {[
                { id: 'overview', label: 'Overview & Analytics', icon: BarChart2 },
                { id: 'gap', label: 'Skill Gap Analysis', icon: Target },
                { id: 'certs', label: 'Certification Impact', icon: Award },
                { id: 'factors', label: 'Success Factors', icon: Trophy }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActivePredictorTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      activePredictorTab === tab.id
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                        : 'bg-white/3 hover:bg-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="min-h-[300px]">
              {activePredictorTab === 'overview' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Skills Distribution Pie */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skills Categorization distribution</h4>
                      <div className="h-60 flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={skillsChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={75}
                              paddingAngle={3}
                              dataKey="value"
                            >
                              {skillsChartData.map((entry, idx) => (
                                <Cell key={`cell-${idx}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <RechartsTooltip content={<CustomChartTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                        {/* Custom Legend */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 text-[9px] bg-slate-900/50 p-2.5 rounded-lg border border-white/5">
                          {skillsChartData.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: item.color }} />
                              <span className="text-slate-400">{item.name}:</span>
                              <span className="text-white font-bold">{item.value}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Doughnut Chart: Readiness factors */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Readiness weightage breakdown</h4>
                      <div className="h-60 flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={readinessBreakdownData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={75}
                              paddingAngle={3}
                              dataKey="value"
                            >
                              {readinessBreakdownData.map((entry, idx) => (
                                <Cell key={`cell-${idx}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <RechartsTooltip content={<CustomChartTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 text-[9px] bg-slate-900/50 p-2.5 rounded-lg border border-white/5">
                          {readinessBreakdownData.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: item.color }} />
                              <span className="text-slate-400">{item.name}:</span>
                              <span className="text-white font-bold">{item.value}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                    {/* Line Chart: Probability Trend Graph */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingUp size={14} className="text-indigo-400" /> Probability Progression Trend
                      </h4>
                      <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                            <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '9px' }} />
                            <YAxis domain={[0, 100]} stroke="#64748b" style={{ fontSize: '9px' }} />
                            <RechartsTooltip content={<CustomChartTooltip />} />
                            <Area type="monotone" dataKey="probability" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorProb)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Bar Chart: Interview Performance Analytics */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <BarChart2 size={14} className="text-purple-400" /> Interview score analytics
                      </h4>
                      <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={interviewPerformanceData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                            <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '9px' }} />
                            <YAxis domain={[0, 100]} stroke="#64748b" style={{ fontSize: '9px' }} />
                            <RechartsTooltip content={<CustomChartTooltip />} />
                            <Bar dataKey="score" fill="#a855f7" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activePredictorTab === 'gap' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Skills Gap Match</h4>
                      <p className="text-[10px] text-slate-500">Analyze how your skills align with roles in the sector</p>
                    </div>

                    <select
                      value={selectedRole}
                      onChange={e => setSelectedRole(e.target.value)}
                      className="input-field py-1.5 px-3 text-xs bg-slate-900 border-white/10 text-slate-200 focus:border-indigo-500 w-full sm:w-56"
                    >
                      <option value="Software Engineer">Software Engineer</option>
                      <option value="Frontend Developer">Frontend Developer</option>
                      <option value="Backend Developer">Backend Developer</option>
                      <option value="Full Stack Developer">Full Stack Developer</option>
                      <option value="Data Analyst">Data Analyst</option>
                      <option value="Data Scientist">Data Scientist</option>
                      <option value="AI Engineer">AI Engineer</option>
                      <option value="DevOps Engineer">DevOps Engineer</option>
                    </select>
                  </div>

                  {/* Present/Missing progress match bar */}
                  <div className="space-y-1.5 bg-white/3 border border-white/5 p-4 rounded-xl">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-bold">Role Match Percentage ({selectedRole})</span>
                      <span className="text-emerald-400 font-extrabold">{skillGap.matchPercentage}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
                        style={{ width: `${skillGap.matchPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Present Skills */}
                    <div className="card p-4 space-y-3 bg-[#10101e]/30">
                      <h5 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 size={12} /> Present Competencies
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {skillGap.present.length === 0 ? (
                          <span className="text-[10px] text-slate-500">None detected</span>
                        ) : (
                          skillGap.present.map((skill, idx) => (
                            <span key={idx} className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-semibold px-2 py-0.5 rounded-lg">
                              {skill}
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Missing Skills */}
                    <div className="card p-4 space-y-3 bg-[#10101e]/30">
                      <h5 className="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle size={12} /> Missing Skills
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {skillGap.missing.length === 0 ? (
                          <span className="text-[10px] text-slate-500">None detected</span>
                        ) : (
                          skillGap.missing.map((skill, idx) => (
                            <span key={idx} className="bg-red-500/10 text-red-300 border border-red-500/20 text-[10px] font-semibold px-2 py-0.5 rounded-lg">
                              {skill}
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Recommended skills */}
                    <div className="card p-4 space-y-3 bg-[#10101e]/30">
                      <h5 className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles size={12} /> Recommended Focus
                      </h5>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        We recommend gaining familiarity with these core tags to improve SDE screening results:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {skillGap.recommended.length === 0 ? (
                          <span className="text-[10px] text-slate-500">None recommended</span>
                        ) : (
                          skillGap.recommended.map((skill, idx) => (
                            <span key={idx} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-semibold px-2 py-0.5 rounded-lg">
                              {skill}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activePredictorTab === 'certs' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Certification Impact Analyzer</h4>
                    <p className="text-[10px] text-slate-500">Simulate completing certifications to estimate placement probability increases.</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { state: simCompletedAWS, setState: setSimCompletedAWS, name: 'AWS Certified Cloud Practitioner', provider: 'Amazon Web Services', impact: '+4%', desc: 'Demonstrates base competency in VPC design, IAM credentials security, and cloud scalability.' },
                      { state: simCompletedAzure, setState: setSimCompletedAzure, name: 'Azure Fundamentals', provider: 'Microsoft', impact: '+3%', desc: 'Validates foundational knowledge of Azure cloud storage, compute networks, and governance.' },
                      { state: simCompletedGCP, setState: setSimCompletedGCP, name: 'Associate Cloud Engineer', provider: 'Google Cloud Platform', impact: '+5%', desc: 'Covers deploying applications, monitoring operations, and managing enterprise projects.' },
                      { state: simCompletedMeta, setState: setSimCompletedMeta, name: 'Meta Full-Stack Developer Professional Cert', provider: 'Coursera / Meta', desc: 'Validates functional skills in front-end frameworks, REST API backends, and databases.', impact: '+6%' }
                    ].map((cert, idx) => (
                      <div
                        key={idx}
                        onClick={() => cert.setState(!cert.state)}
                        className={`p-4 bg-white/3 border rounded-xl flex items-start justify-between cursor-pointer transition-all hover:bg-white/5 select-none ${
                          cert.state ? 'border-indigo-500/35 bg-indigo-500/3' : 'border-white/5'
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center mt-1 shrink-0 ${
                            cert.state ? 'bg-indigo-500 border-indigo-500 text-slate-900' : 'border-white/20 text-transparent'
                          }`}>
                            <Check size={12} className="stroke-[3]" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">{cert.name}</span>
                            <span className="text-[9px] text-slate-500">{cert.provider}</span>
                            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{cert.desc}</p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-indigo-400 shrink-0 ml-4">{cert.impact}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activePredictorTab === 'factors' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                  {/* Strong Areas */}
                  <div className="card p-5 space-y-4 bg-emerald-500/2 border border-emerald-500/10">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle2 size={16} /> Strong Profile Areas
                    </h4>
                    <ul className="space-y-3 text-xs text-slate-300">
                      {profileCgpa >= 7.5 && (
                        <li className="flex gap-2 items-start">
                          <span className="text-emerald-400 font-bold shrink-0">✓</span>
                          <span><strong>Strong Academic Background:</strong> Your CGPA of {profileCgpa} satisfies cutoff criteria for over 85% of target companies.</span>
                        </li>
                      )}
                      {profileSkillsCount >= 6 && (
                        <li className="flex gap-2 items-start">
                          <span className="text-emerald-400 font-bold shrink-0">✓</span>
                          <span><strong>Versatile Skills Array:</strong> Your count of {profileSkillsCount} skills establishes a solid full-stack foundation.</span>
                        </li>
                      )}
                      {profileMockScore >= 75 && (
                        <li className="flex gap-2 items-start">
                          <span className="text-emerald-400 font-bold shrink-0">✓</span>
                          <span><strong>Excellent Vocal Confidence:</strong> Sophia evaluates your mock speed and communication scores as recruiter-ready.</span>
                        </li>
                      )}
                      <li className="flex gap-2 items-start">
                        <span className="text-emerald-400 font-bold shrink-0">✓</span>
                        <span><strong>Application pipeline active:</strong> Having tracking records registered builds active hiring logs.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Weak Areas */}
                  <div className="card p-5 space-y-4 bg-red-500/2 border border-red-500/10">
                    <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                      <AlertTriangle size={16} /> Vulnerability Areas
                    </h4>
                    <ul className="space-y-3 text-xs text-slate-300">
                      {profileCgpa < 7.5 && (
                        <li className="flex gap-2 items-start">
                          <span className="text-red-400 font-bold shrink-0">!</span>
                          <span><strong>CGPA Below Cutoff Threshold:</strong> GPA is below 7.5. Many campus recruiters enforce strict cutoffs. Add off-campus pipelines.</span>
                        </li>
                      )}
                      {profileBacklogs > 0 && (
                        <li className="flex gap-2 items-start">
                          <span className="text-red-400 font-bold shrink-0">!</span>
                          <span><strong>Active Backlogs Checked:</strong> Having backlogs excludes candidates from SDE shortlist selections. Plan to clear them quickly.</span>
                        </li>
                      )}
                      {profileAtsScore < 70 && (
                        <li className="flex gap-2 items-start">
                          <span className="text-red-400 font-bold shrink-0">!</span>
                          <span><strong>Unoptimized Resume File:</strong> ATS pass rate is below 70%. Missing important role keywords.</span>
                        </li>
                      )}
                      {profileMockScore < 70 && (
                        <li className="flex gap-2 items-start">
                          <span className="text-red-400 font-bold shrink-0">!</span>
                          <span><strong>Sub-optimal Interview Pace:</strong> Performance scores suggest communication gaps. Try to minimize filler words.</span>
                        </li>
                      )}
                      {profileSkillsCount < 6 && (
                        <li className="flex gap-2 items-start">
                          <span className="text-red-400 font-bold shrink-0">!</span>
                          <span><strong>Low Skills Count:</strong> Lacking foundational backend databases or container deployments skills.</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Recommendations Engine Card */}
          <div className="card p-5 space-y-4 border border-indigo-500/10 bg-indigo-500/2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-400" /> AI recommendations engine
            </h3>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row justify-between text-xs text-slate-300 gap-1">
                <span>Current Placement Probability: <strong className="text-white">{currentMetrics.probability}%</strong></span>
                <span className="text-indigo-300 font-semibold">Target Probability: 90%+</span>
              </div>

              <div className="h-px bg-white/5" />

              <ul className="space-y-2 text-xs text-slate-300">
                {profileCgpa < 7.5 && (
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 mt-0.5">•</span>
                    <span>Your CGPA is below 7.5. Prioritize off-campus startup targeting and create a robust developer portfolio site.</span>
                  </li>
                )}
                {profileMockScore < 80 && (
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 mt-0.5">•</span>
                    <span>Practice mock interview sessions to push technical & communication grades to 85+.</span>
                  </li>
                )}
                {profileAtsScore < 80 && (
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 mt-0.5">•</span>
                    <span>Re-build your resume using single-column templates and raise the ATS optimization rating.</span>
                  </li>
                )}
                {profileSkillsCount < 8 && (
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 mt-0.5">•</span>
                    <span>Add backend DB indexes tuning, Redis caching, or container deployment tags to your profile.</span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-0.5">•</span>
                  <span>Complete one verified Cloud developer certification (AWS CCP or Google Associate) to raise probability by +4%.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkillGapEngine() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [selectedRoleTitle, setSelectedRoleTitle] = useState<string>('Frontend Developer');

  useEffect(() => {
    const p = getUserProfile();
    if (p) {
      setProfile(p);
      setUserSkills(p.skills || []);
    }
  }, []);

  const handleAddSkillToProfile = (skillName: string) => {
    const p = getUserProfile();
    if (!p) return;
    const updatedSkills = [...(p.skills || [])];
    if (!updatedSkills.some(s => s.toLowerCase() === skillName.toLowerCase())) {
      updatedSkills.push(skillName);
    }
    const updatedProfile = {
      ...p,
      skills: updatedSkills,
      updatedAt: new Date().toISOString()
    };
    saveUserProfile(updatedProfile);
    setProfile(updatedProfile);
    setUserSkills(updatedSkills);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
    }
  };

  const checkSkillCovered = (requiredSkillName: string, skillsList: string[]): boolean => {
    const normalizedRequired = requiredSkillName.toLowerCase();
    const userSkillsLower = skillsList.map(s => s.toLowerCase());

    const synonyms: { [key: string]: string[] } = {
      'html/css': ['html', 'css', 'sass', 'scss', 'less', 'frontend'],
      'javascript': ['javascript', 'js', 'es6', 'typescript', 'ts'],
      'react/next.js': ['react', 'next.js', 'vue', 'angular', 'svelte', 'frontend'],
      'tailwind css': ['tailwind', 'bootstrap', 'css frameworks', 'material ui', 'chakra'],
      'state management': ['redux', 'zustand', 'recoil', 'mobx', 'flux', 'state management'],
      'responsive design': ['responsive', 'media queries', 'flexbox', 'grid', 'mobile-first'],
      'web apis': ['web api', 'dom', 'fetch', 'axios', 'websocket', 'ajax'],
      'git/version control': ['git', 'github', 'gitlab', 'bitbucket', 'version control'],
      
      'node.js/python/java': ['node', 'express', 'python', 'java', 'go', 'golang', 'rust', 'c++', 'c#', 'ruby', 'backend', 'django', 'flask', 'spring'],
      'databases (sql/nosql)': ['sql', 'mysql', 'postgresql', 'postgres', 'mongodb', 'mongo', 'redis', 'db', 'database', 'sqlite', 'prisma', 'mongoose', 'nosql', 'dynamodb'],
      'rest & graphql apis': ['api', 'apis', 'rest', 'graphql', 'grpc', 'endpoint', 'restful'],
      'system design': ['system design', 'microservices', 'caching', 'load balancing', 'queues', 'scalability', 'architecture'],
      'auth (jwt/oauth)': ['auth', 'jwt', 'oauth', 'security', 'passport', 'sign in', 'login'],
      'docker & ci/cd': ['docker', 'kubernetes', 'k8s', 'jenkins', 'ci/cd', 'devops', 'terraform', 'aws', 'gcp', 'azure', 'actions'],
      'testing & debugging': ['testing', 'jest', 'cypress', 'junit', 'mocha', 'debugging', 'unit test', 'integration test'],
      
      'frontend core': ['html', 'css', 'javascript', 'js', 'typescript', 'ts', 'frontend'],
      'frontend frameworks': ['react', 'next.js', 'vue', 'angular', 'svelte'],
      'backend tech': ['node', 'express', 'django', 'flask', 'spring', 'nest', 'backend', 'fastapi'],
      'databases': ['sql', 'mysql', 'postgresql', 'postgres', 'mongodb', 'mongo', 'redis', 'db', 'database', 'sqlite', 'prisma', 'mongoose', 'nosql'],
      
      'python programming': ['python', 'py', 'anaconda'],
      'statistics & probability': ['statistics', 'probability', 'stats', 'math', 'hypothesis testing', 'regression'],
      'pandas & numpy': ['pandas', 'numpy', 'scipy', 'data manipulation', 'dataframe'],
      'machine learning': ['machine learning', 'ml', 'scikit-learn', 'sklearn', 'regression', 'classification', 'clustering'],
      'data visualization': ['visualization', 'matplotlib', 'seaborn', 'd3', 'tableau', 'power bi', 'plotting'],
      'sql & querying': ['sql', 'mysql', 'postgresql', 'postgres', 'querying', 'database'],
      'big data (spark)': ['spark', 'hadoop', 'kafka', 'hive', 'big data', 'databricks'],
      
      'deep learning (pytorch/tf)': ['deep learning', 'dl', 'pytorch', 'tensorflow', 'keras', 'neural network', 'cnn', 'rnn'],
      'llms & genai': ['llm', 'llms', 'genai', 'generative ai', 'gpt', 'openai', 'prompt engineering', 'langchain', 'llama', 'anthropic', 'gemini', 'rag'],
      'nlp & cv': ['nlp', 'natural language processing', 'cv', 'computer vision', 'opencv', 'transformers', 'nltk', 'spacy', 'bert'],
      'mlops & cloud': ['mlops', 'cloud', 'aws', 'gcp', 'azure', 'deployment', 'mlflow', 'docker', 'sagemaker'],
      'math (linear algebra)': ['math', 'linear algebra', 'calculus', 'matrix', 'optimization', 'probability']
    };

    if (userSkillsLower.includes(normalizedRequired)) return true;

    const mapping = synonyms[normalizedRequired];
    if (mapping) {
      return userSkillsLower.some(us => mapping.some(syn => us.includes(syn)));
    }

    return userSkillsLower.some(us => us.includes(normalizedRequired) || normalizedRequired.includes(us));
  };

  const getMatchedUserSkillName = (requiredSkillName: string, skillsList: string[]): string => {
    const normalizedRequired = requiredSkillName.toLowerCase();
    const userSkillsLower = skillsList.map(s => s.toLowerCase());

    const synonyms: { [key: string]: string[] } = {
      'html/css': ['html', 'css', 'sass', 'scss', 'less', 'frontend'],
      'javascript': ['javascript', 'js', 'es6', 'typescript', 'ts'],
      'react/next.js': ['react', 'next.js', 'vue', 'angular', 'svelte', 'frontend'],
      'tailwind css': ['tailwind', 'bootstrap', 'css frameworks', 'material ui', 'chakra'],
      'state management': ['redux', 'zustand', 'recoil', 'mobx', 'flux', 'state management'],
      'responsive design': ['responsive', 'media queries', 'flexbox', 'grid', 'mobile-first'],
      'web apis': ['web api', 'dom', 'fetch', 'axios', 'websocket', 'ajax'],
      'git/version control': ['git', 'github', 'gitlab', 'bitbucket', 'version control'],
      'node.js/python/java': ['node', 'express', 'python', 'java', 'go', 'golang', 'rust', 'c++', 'c#', 'ruby', 'backend', 'django', 'flask', 'spring'],
      'databases (sql/nosql)': ['sql', 'mysql', 'postgresql', 'postgres', 'mongodb', 'mongo', 'redis', 'db', 'database', 'sqlite', 'prisma', 'mongoose', 'nosql', 'dynamodb'],
      'rest & graphql apis': ['api', 'apis', 'rest', 'graphql', 'grpc', 'endpoint', 'restful'],
      'system design': ['system design', 'microservices', 'caching', 'load balancing', 'queues', 'scalability', 'architecture'],
      'auth (jwt/oauth)': ['auth', 'jwt', 'oauth', 'security', 'passport', 'sign in', 'login'],
      'docker & ci/cd': ['docker', 'kubernetes', 'k8s', 'jenkins', 'ci/cd', 'devops', 'terraform', 'aws', 'gcp', 'azure', 'actions'],
      'testing & debugging': ['testing', 'jest', 'cypress', 'junit', 'mocha', 'debugging', 'unit test', 'integration test'],
      'frontend core': ['html', 'css', 'javascript', 'js', 'typescript', 'ts', 'frontend'],
      'frontend frameworks': ['react', 'next.js', 'vue', 'angular', 'svelte'],
      'backend tech': ['node', 'express', 'django', 'flask', 'spring', 'nest', 'backend', 'fastapi'],
      'databases': ['sql', 'mysql', 'postgresql', 'postgres', 'mongodb', 'mongo', 'redis', 'db', 'database', 'sqlite', 'prisma', 'mongoose', 'nosql'],
      'python programming': ['python', 'py', 'anaconda'],
      'statistics & probability': ['statistics', 'probability', 'stats', 'math', 'hypothesis testing', 'regression'],
      'pandas & numpy': ['pandas', 'numpy', 'scipy', 'data manipulation', 'dataframe'],
      'machine learning': ['machine learning', 'ml', 'scikit-learn', 'sklearn', 'regression', 'classification', 'clustering'],
      'data visualization': ['visualization', 'matplotlib', 'seaborn', 'd3', 'tableau', 'power bi', 'plotting'],
      'sql & querying': ['sql', 'mysql', 'postgresql', 'postgres', 'querying', 'database'],
      'big data (spark)': ['spark', 'hadoop', 'kafka', 'hive', 'big data', 'databricks'],
      'deep learning (pytorch/tf)': ['deep learning', 'dl', 'pytorch', 'tensorflow', 'keras', 'neural network', 'cnn', 'rnn'],
      'llms & genai': ['llm', 'llms', 'genai', 'generative ai', 'gpt', 'openai', 'prompt engineering', 'langchain', 'llama', 'anthropic', 'gemini', 'rag'],
      'nlp & cv': ['nlp', 'natural language processing', 'cv', 'computer vision', 'opencv', 'transformers', 'nltk', 'spacy', 'bert'],
      'mlops & cloud': ['mlops', 'cloud', 'aws', 'gcp', 'azure', 'deployment', 'mlflow', 'docker', 'sagemaker'],
      'math (linear algebra)': ['math', 'linear algebra', 'calculus', 'matrix', 'optimization', 'probability']
    };

    for (const userSkill of skillsList) {
      const usLower = userSkill.toLowerCase();
      if (usLower === normalizedRequired) return userSkill;
      
      const mapping = synonyms[normalizedRequired];
      if (mapping && mapping.some(syn => usLower.includes(syn))) {
        return userSkill;
      }
      
      if (usLower.includes(normalizedRequired) || normalizedRequired.includes(usLower)) {
        return userSkill;
      }
    }
    return requiredSkillName;
  };

  const rolesData = [
    {
      title: 'Frontend Developer',
      skills: [
        { name: 'HTML/CSS', category: 'core', requiredLevel: 90, priority: 'High', resource: 'https://developer.mozilla.org/en-US/docs/Web', description: 'Semantic HTML5 structure and advanced layouts utilizing CSS Grid, Flexbox, and responsive designs.' },
        { name: 'JavaScript', category: 'core', requiredLevel: 95, priority: 'High', resource: 'https://javascript.info/', description: 'Functional programming, Event Loop, asynchronous operations (Promises/async-await), and ES6+ standards.' },
        { name: 'React/Next.js', category: 'core', requiredLevel: 90, priority: 'High', resource: 'https://nextjs.org/learn', description: 'Component cycles, React hooks, state optimization, Server-Side Rendering (SSR), and Static Site Generation (SSG).' },
        { name: 'Tailwind CSS', category: 'tool', requiredLevel: 85, priority: 'Medium', resource: 'https://tailwindcss.com/', description: 'Modern CSS Frameworks, typography scales, responsive utility prefixes, and transition design.' },
        { name: 'State Management', category: 'advanced', requiredLevel: 80, priority: 'Medium', resource: 'https://zustand-demo.pmnd.rs/', description: 'Zustand or Redux-toolkit for global state flows, selectors, context management, and persistence.' },
        { name: 'Responsive Design', category: 'core', requiredLevel: 85, priority: 'High', resource: 'https://web.dev/responsive-web-design/', description: 'Fluid layouts, media queries, viewports adaptations, and mobile-first construction paradigms.' },
        { name: 'Web APIs', category: 'advanced', requiredLevel: 80, priority: 'Medium', resource: 'https://developer.mozilla.org/en-US/docs/Web/API', description: 'Interfacing with DOM Events, LocalStorage, sessionStorage, and native browser Fetch calls.' },
        { name: 'Git/Version Control', category: 'tool', requiredLevel: 85, priority: 'High', resource: 'https://github.com/', description: 'Commit cycles, branching policies, merge conflict resolutions, and collaborative pull requests.' }
      ],
      learningSteps: [
        { title: 'Step 1: Web Foundations & Styling', description: 'Master layout techniques and structural semantic elements using MDN docs.', skills: ['HTML/CSS', 'Responsive Design'] },
        { title: 'Step 2: Core Scripting & Web Integration', description: 'Learn advanced JS concepts and DOM manipulation on Javascript.info.', skills: ['JavaScript', 'Web APIs'] },
        { title: 'Step 3: Component-driven Frameworks', description: 'Study React foundations and styling configurations with Next.js & Tailwind.', skills: ['React/Next.js', 'Tailwind CSS'] },
        { title: 'Step 4: State Architectures & Collab', description: 'Scale state systems and practice Git workflows inside team repos.', skills: ['State Management', 'Git/Version Control'] }
      ]
    },
    {
      title: 'Backend Developer',
      skills: [
        { name: 'Node.js/Python/Java', category: 'core', requiredLevel: 90, priority: 'High', resource: 'https://nodejs.org/', description: 'Server-side execution environments, request-response cycles, and microservices logic.' },
        { name: 'Databases (SQL/NoSQL)', category: 'core', requiredLevel: 95, priority: 'High', resource: 'https://sqlbolt.com/', description: 'Schema normalization, indices optimization, transactions execution, and NoSQL databases like MongoDB.' },
        { name: 'REST & GraphQL APIs', category: 'core', requiredLevel: 90, priority: 'High', resource: 'https://graphql.org/learn/', description: 'Routing design, controller middleware, response mapping, and resolver integrations.' },
        { name: 'System Design', category: 'theory', requiredLevel: 80, priority: 'Medium', resource: 'https://github.com/donnemartin/system-design-primer', description: 'Memory caching via Redis, event queues (RabbitMQ/Kafka), replication, and load balancing.' },
        { name: 'Auth (JWT/OAuth)', category: 'advanced', requiredLevel: 85, priority: 'Medium', resource: 'https://oauth.net/2/', description: 'JSON Web Tokens, session validations, password hashing (bcrypt), and provider sign-in keys.' },
        { name: 'Docker & CI/CD', category: 'tool', requiredLevel: 80, priority: 'Medium', resource: 'https://docker-curriculum.com/', description: 'Containerizing services with Dockerfiles and orchestrating actions with Git workflows.' },
        { name: 'Testing & Debugging', category: 'advanced', requiredLevel: 80, priority: 'Medium', resource: 'https://jestjs.io/', description: 'Unit testing servers using Jest, endpoint assertions, and performance inspection.' },
        { name: 'Git/Version Control', category: 'tool', requiredLevel: 85, priority: 'High', resource: 'https://github.com/', description: 'Managing environment keys, backend pipelines, and version tagging.' }
      ],
      learningSteps: [
        { title: 'Step 1: Programming & Routing Essentials', description: 'Build servers and RESTful entry points using Node.js or Python.', skills: ['Node.js/Python/Java', 'REST & GraphQL APIs'] },
        { title: 'Step 2: Databases & Security', description: 'Learn indexing, schema design, and secure token auth (JWT).', skills: ['Databases (SQL/NoSQL)', 'Auth (JWT/OAuth)'] },
        { title: 'Step 3: Docker & Repository Pipeline', description: 'Containerize node/python servers and setup automatic testing.', skills: ['Docker & CI/CD', 'Git/Version Control'] },
        { title: 'Step 4: Advanced Systems Design', description: 'Deploy server caches and split servers into scalable microservices.', skills: ['System Design', 'Testing & Debugging'] }
      ]
    },
    {
      title: 'Full Stack Developer',
      skills: [
        { name: 'Frontend Core', category: 'core', requiredLevel: 90, priority: 'High', resource: 'https://developer.mozilla.org/en-US/docs/Web', description: 'Foundational HTML elements, modern styling, and client-side scripting.' },
        { name: 'Frontend Frameworks', category: 'core', requiredLevel: 90, priority: 'High', resource: 'https://nextjs.org/docs', description: 'SPAs, reactive DOM binding, data fetching, and Next.js page generation.' },
        { name: 'Backend Tech', category: 'core', requiredLevel: 90, priority: 'High', resource: 'https://expressjs.com/', description: 'Request controllers, routing middlewares, and server integrations.' },
        { name: 'Databases', category: 'core', requiredLevel: 85, priority: 'High', resource: 'https://sqlbolt.com/', description: 'Relational query structuring and document storage management.' },
        { name: 'Web APIs', category: 'advanced', requiredLevel: 85, priority: 'Medium', resource: 'https://developer.mozilla.org/en-US/docs/Web/API', description: 'Seamless server communication via JSON payloads and asynchronous fetch.' },
        { name: 'Docker/AWS', category: 'tool', requiredLevel: 75, priority: 'Medium', resource: 'https://aws.amazon.com/training/', description: 'Deploying composite Docker setups on Cloud environments.' },
        { name: 'Testing', category: 'advanced', requiredLevel: 75, priority: 'Medium', resource: 'https://jestjs.io/', description: 'Validating end-to-end user paths and backend API payloads.' },
        { name: 'Git/Version Control', category: 'tool', requiredLevel: 85, priority: 'High', resource: 'https://github.com/', description: 'Team repositories management, branching models, and version tagging.' }
      ],
      learningSteps: [
        { title: 'Step 1: Frontend Interface Design', description: 'Master component structures and layout designs.', skills: ['Frontend Core', 'Frontend Frameworks'] },
        { title: 'Step 2: Server Routing & Data Persistence', description: 'Link express/django servers with relational/document databases.', skills: ['Backend Tech', 'Databases', 'Web APIs'] },
        { title: 'Step 3: Verification & Collaboration', description: 'Write unit tests and coordinate deployments via branch merging.', skills: ['Testing', 'Git/Version Control'] },
        { title: 'Step 4: Devops Container Deployments', description: 'Package frontend and backend inside Docker containers on AWS.', skills: ['Docker/AWS'] }
      ]
    },
    {
      title: 'Data Scientist',
      skills: [
        { name: 'Python Programming', category: 'core', requiredLevel: 95, priority: 'High', resource: 'https://www.python.org/', description: 'Writing efficient Python code, data structures, and algorithmic loops.' },
        { name: 'Statistics & Probability', category: 'theory', requiredLevel: 90, priority: 'High', resource: 'https://openstax.org/details/books/introductory-statistics', description: 'Distributions, regression lines, A/B testing, and hypothesis testing.' },
        { name: 'Pandas & NumPy', category: 'core', requiredLevel: 95, priority: 'High', resource: 'https://pandas.pydata.org/', description: 'Data structures (Series/DataFrames), vectorization, cleaning and merging operations.' },
        { name: 'Machine Learning', category: 'core', requiredLevel: 90, priority: 'High', resource: 'https://scikit-learn.org/', description: 'Implementing estimators, classifiers, clustering models and hyperparameters tuning.' },
        { name: 'Data Visualization', category: 'tool', requiredLevel: 85, priority: 'Medium', resource: 'https://seaborn.pydata.org/', description: 'Rendering heatmaps, scatter distributions, and interactive dashboard charts.' },
        { name: 'SQL & Querying', category: 'core', requiredLevel: 85, priority: 'High', resource: 'https://mode.com/sql-tutorial/', description: 'Retrieving data, utilizing joins, window functions and nested aggregations.' },
        { name: 'Big Data (Spark)', category: 'tool', requiredLevel: 70, priority: 'Low', resource: 'https://spark.apache.org/', description: 'Using PySpark to run operations across distributed clusters.' },
        { name: 'Git/Version Control', category: 'tool', requiredLevel: 80, priority: 'Medium', resource: 'https://github.com/', description: 'Tracking experiment versions and sharing analysis notebooks.' }
      ],
      learningSteps: [
        { title: 'Step 1: Scientific Programming Core', description: 'Acquire syntax and database query structures using SQL & Python.', skills: ['Python Programming', 'SQL & Querying'] },
        { title: 'Step 2: Descriptive & Analytical Statistics', description: 'Study mathematical rules, distributions, and regression analytics.', skills: ['Statistics & Probability'] },
        { title: 'Step 3: Data Aggregation & Plotting', description: 'Wrangle tables and construct custom visualizations.', skills: ['Pandas & NumPy', 'Data Visualization'] },
        { title: 'Step 4: Machine Learning Modeling', description: 'Build estimators on Scikit-Learn and learn distributed processing.', skills: ['Machine Learning', 'Big Data (Spark)', 'Git/Version Control'] }
      ]
    },
    {
      title: 'AI Engineer',
      skills: [
        { name: 'Python Programming', category: 'core', requiredLevel: 95, priority: 'High', resource: 'https://www.python.org/', description: 'Advanced object-oriented programming, data structures, and optimized mathematical algorithms.' },
        { name: 'Machine Learning', category: 'core', requiredLevel: 90, priority: 'High', resource: 'https://fast.ai/', description: 'Foundational ML pipelines, train-test splits, overfitting prevention, and feature maps.' },
        { name: 'Deep Learning (PyTorch/TF)', category: 'core', requiredLevel: 90, priority: 'High', resource: 'https://pytorch.org/tutorials', description: 'Neural network graph building, backpropagation engines, custom layers, and GPU acceleration.' },
        { name: 'LLMs & GenAI', category: 'core', requiredLevel: 85, priority: 'High', resource: 'https://www.deeplearning.ai/', description: 'Retrieval Augmented Generation (RAG), vector stores, API keys, prompting techniques, and LangChain.' },
        { name: 'NLP & CV', category: 'advanced', requiredLevel: 80, priority: 'Medium', resource: 'https://huggingface.co/learn', description: 'Text embeddings, transformers, object classification, OpenCV, and speech processing.' },
        { name: 'MLOps & Cloud', category: 'tool', requiredLevel: 75, priority: 'Medium', resource: 'https://mlflow.org/', description: 'Logging models metrics, container deployments, and hosting endpoints on AWS/GCP.' },
        { name: 'Math (Linear Algebra)', category: 'theory', requiredLevel: 85, priority: 'Medium', resource: 'https://mml-book.github.io/', description: 'Vector matrices, eigenvalues, gradients, and multivariable calculus concepts.' },
        { name: 'Git/Version Control', category: 'tool', requiredLevel: 80, priority: 'Medium', resource: 'https://github.com/', description: 'Version control for model parameters and ML development cycles.' }
      ],
      learningSteps: [
        { title: 'Step 1: Mathematics & Scripting Fundamentals', description: 'Master matrix transformations and advanced Python algorithms.', skills: ['Python Programming', 'Math (Linear Algebra)'] },
        { title: 'Step 2: Deep Learning Networks', description: 'Train simple predictors and build neural networks in PyTorch.', skills: ['Machine Learning', 'Deep Learning (PyTorch/TF)'] },
        { title: 'Step 3: Natural Language & LLMs', description: 'Configure vector storage pipelines and query LLM endpoints.', skills: ['LLMs & GenAI', 'NLP & CV'] },
        { title: 'Step 4: MLOps Deployments', description: 'Set up tracking servers (MLflow) and serve endpoints on clouds.', skills: ['MLOps & Cloud', 'Git/Version Control'] }
      ]
    }
  ];

  const currentRole = rolesData.find(r => r.title === selectedRoleTitle) || rolesData[0];

  const coveredSkillsList = currentRole.skills.filter(s => checkSkillCovered(s.name, userSkills));
  const missingSkillsList = currentRole.skills.filter(s => !checkSkillCovered(s.name, userSkills));
  
  const prioritySkillsList = missingSkillsList.filter(s => s.priority === 'High');
  const displayedPrioritySkills = prioritySkillsList.length > 0 ? prioritySkillsList : missingSkillsList.filter(s => s.priority === 'Medium');

  const matchPercentage = Math.round((coveredSkillsList.length / currentRole.skills.length) * 100);

  const radarData = currentRole.skills.map(skill => {
    const isCovered = checkSkillCovered(skill.name, userSkills);
    let userLevel = 0;
    if (isCovered) {
      const coding = profile?.codingScore || 70;
      const mock = profile?.mockInterviewScore || 70;
      const aptitude = profile?.aptitudeScore || 70;
      
      if (skill.category === 'core') {
        userLevel = Math.round(coding * 1.1);
      } else if (skill.category === 'advanced') {
        userLevel = Math.round(coding * 1.05);
      } else if (skill.category === 'tool') {
        userLevel = Math.round(aptitude * 1.05);
      } else {
        userLevel = Math.round(mock * 1.0);
      }
      userLevel = Math.min(98, Math.max(60, userLevel));
    }
    
    return {
      subject: skill.name,
      'Your Level': userLevel,
      'Target Level': skill.requiredLevel,
    };
  });

  const getMatchVerdict = (percent: number) => {
    if (percent >= 80) return { text: 'Highly Competitive', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
    if (percent >= 50) return { text: 'Developing Competency', color: 'text-indigo-300', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' };
    return { text: 'Beginner / Major Gaps', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' };
  };

  const verdict = getMatchVerdict(matchPercentage);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <span className="text-indigo-400">⚖️</span> Skill Gap Analysis Engine
          </h2>
          <p className="text-slate-400 text-sm">Compare your current profile competencies against industry expectations for core developer and AI roles.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#0c0c1e] border border-white/5 px-3 py-1.5 rounded-xl self-start md:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Active Simulator Mode</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Role list and match score card */}
        <div className="lg:col-span-4 space-y-6">
          {/* Target Role List */}
          <div className="card p-4 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Select Target Role</h3>
            <div className="flex flex-col gap-1.5">
              {rolesData.map((role) => (
                <button
                  key={role.title}
                  onClick={() => setSelectedRoleTitle(role.title)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all border flex items-center justify-between group ${
                    selectedRoleTitle === role.title
                      ? 'bg-indigo-600/10 border-indigo-500/30 text-white shadow-lg shadow-indigo-500/5'
                      : 'bg-white/2 border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-xs font-bold">{role.title}</span>
                  <ChevronRight size={14} className={`opacity-60 transition-transform ${selectedRoleTitle === role.title ? 'translate-x-1' : 'group-hover:translate-x-0.5'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Match Score Card */}
          <div className="card p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Competency Fit Analysis</h3>
            
            <div className="flex flex-col items-center py-4 bg-white/2 border border-white/5 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full" />
              <span className="text-4xl font-black text-white">{matchPercentage}%</span>
              <span className="text-[10px] font-semibold text-slate-400 mt-0.5">Overall Alignment</span>
              <div className={`mt-3 px-3 py-1 rounded-full text-[10px] font-bold border ${verdict.color} ${verdict.bg} ${verdict.border}`}>
                {verdict.text}
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-400">
              <p>
                For the <strong className="text-white">{currentRole.title}</strong> profile, you cover{' '}
                <strong className="text-emerald-400">{coveredSkillsList.length}</strong> of{' '}
                <strong className="text-white">{currentRole.skills.length}</strong> required key skills.
              </p>
              {missingSkillsList.length > 0 ? (
                <p>
                  To elevate your placement potential, prioritize adding <strong className="text-red-400">{prioritySkillsList.length > 0 ? prioritySkillsList[0].name : missingSkillsList[0].name}</strong> to your skill set.
                </p>
              ) : (
                <p className="text-emerald-400 font-medium">
                  Outstanding! Your skill set meets all expectations for this role. You are highly ready for competitive interviews.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Radar Chart Visualization */}
        <div className="lg:col-span-8">
          <div className="card p-5 h-full flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Visual Competency Radar</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Visual overlap showing your estimated level vs target benchmarks across 8 competency areas.</p>
            </div>

            <div className="w-full h-[320px] flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#ffffff" strokeOpacity={0.07} />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Target Level"
                    dataKey="Target Level"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.15}
                  />
                  <Radar
                    name="Your Level"
                    dataKey="Your Level"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.35}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#0f0f1e',
                      borderColor: 'rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: '#ffffff',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-6 text-xs border-t border-white/5 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500/20 border border-indigo-500" />
                <span className="text-slate-400">Target Level</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500/40 border border-emerald-500" />
                <span className="text-slate-400">Your Level</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills breakdown and lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Covered Skills */}
        <div className="card p-5 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <span className="text-emerald-400">✓</span> Skills Already Covered ({coveredSkillsList.length})
          </h3>
          <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
            {coveredSkillsList.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">No skills covered yet for this role.</div>
            ) : (
              coveredSkillsList.map((skill) => {
                const userSkillName = getMatchedUserSkillName(skill.name, userSkills);
                return (
                  <div key={skill.name} className="p-3 bg-emerald-500/2 border border-emerald-500/10 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-white block">{skill.name}</span>
                        <span className="text-[9px] text-slate-500">Matched via: <span className="text-emerald-400 font-semibold">{userSkillName}</span></span>
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md">
                        {skill.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">{skill.description}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Missing & Priority Skills */}
        <div className="card p-5 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <span className="text-red-400">⚡</span> Missing & Priority Skills ({missingSkillsList.length})
          </h3>
          <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
            {missingSkillsList.length === 0 ? (
              <div className="text-center py-8 text-xs text-emerald-400 font-bold">
                🎉 Congratulations! You have covered all key skills for this role.
              </div>
            ) : (
              missingSkillsList.map((skill) => {
                const isPriority = displayedPrioritySkills.some(p => p.name === skill.name);
                return (
                  <div
                    key={skill.name}
                    className={`p-3 border rounded-xl space-y-2 flex flex-col justify-between ${
                      isPriority
                        ? 'bg-red-500/2 border-red-500/15'
                        : 'bg-white/2 border-white/5'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{skill.name}</span>
                          {isPriority && (
                            <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full">
                              Priority Focus
                            </span>
                          )}
                        </div>
                        <span className="bg-white/5 text-slate-400 border border-white/10 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md">
                          {skill.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">{skill.description}</p>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-1">
                      <span className="text-[9px] text-slate-500">Benchmark: <strong className="text-slate-300">{skill.requiredLevel}%</strong></span>
                      <button
                        onClick={() => handleAddSkillToProfile(skill.name)}
                        className="btn-primary py-1 px-3 text-[10px] rounded-lg bg-indigo-600/20 hover:bg-indigo-600 border-indigo-500/30 text-indigo-200 hover:text-white"
                      >
                        + Simulate Mastery
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Recommended Learning Order */}
      <div className="card p-5 space-y-4">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <span className="text-indigo-400">📖</span> Recommended Learning Order & Resources
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">A structured roadmap designed to fill your target competency gaps efficiently.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {currentRole.learningSteps.map((step, idx) => {
            const stepSkillsCovered = step.skills.filter(sName => checkSkillCovered(sName, userSkills));
            const stepStatus =
              stepSkillsCovered.length === step.skills.length
                ? 'completed'
                : stepSkillsCovered.length > 0
                ? 'in-progress'
                : 'pending';

            return (
              <div
                key={idx}
                className={`p-4 border rounded-2xl flex flex-col justify-between space-y-4 relative overflow-hidden transition-all ${
                  stepStatus === 'completed'
                    ? 'bg-emerald-500/2 border-emerald-500/15 shadow-lg shadow-emerald-500/[0.01]'
                    : stepStatus === 'in-progress'
                    ? 'bg-indigo-500/2 border-indigo-500/20 shadow-lg shadow-indigo-500/[0.01]'
                    : 'bg-white/2 border-white/5 opacity-60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-500">STEP {idx + 1}</span>
                    {stepStatus === 'completed' ? (
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-extrabold uppercase">
                        Done
                      </span>
                    ) : stepStatus === 'in-progress' ? (
                      <span className="text-[9px] bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 px-2 py-0.5 rounded-full font-extrabold uppercase">
                        Progress
                      </span>
                    ) : (
                      <span className="text-[9px] bg-white/5 text-slate-400 border border-white/10 px-2 py-0.5 rounded-full font-extrabold uppercase">
                        Locked
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-white leading-tight">{step.title}</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">{step.description}</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex flex-wrap gap-1">
                    {step.skills.map((sName) => {
                      const cov = checkSkillCovered(sName, userSkills);
                      return (
                        <span
                          key={sName}
                          className={`text-[8.5px] font-semibold px-2 py-0.5 rounded-lg border ${
                            cov
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-white/5 text-slate-400 border-white/5'
                          }`}
                        >
                          {sName}
                        </span>
                      );
                    })}
                  </div>

                  {step.skills.length > 0 && (
                    <a
                      href={currentRole.skills.find(s => s.name === step.skills[0])?.resource || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[9px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 group/link cursor-pointer w-fit"
                    >
                      View Resource Guide <ExternalLink size={10} className="group-hover/link:translate-x-0.5 transition-transform" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function AIRecruiterSimulator() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedRole, setSelectedRole] = useState('Frontend Developer');
  
  // Simulation states
  const [activeRound, setActiveRound] = useState<'idle' | 1 | 2 | 3 | 4 | 'report'>('idle');
  const [chatHistory, setChatHistory] = useState<{ sender: 'recruiter' | 'candidate'; text: string }[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  
  // Evaluation output
  const [answers, setAnswers] = useState<string[]>([]);
  const [reportData, setReportData] = useState<{
    scores: { technical: number; communication: number; leadership: number; problemSolving: number };
    decision: 'Selected' | 'Hold' | 'Rejected';
    feedback: { strengths: string[]; weaknesses: string[]; notes: string };
  } | null>(null);

  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    setProfile(getUserProfile());
    const raw = localStorage.getItem('ptp_recruiter_history');
    if (raw) {
      try {
        setHistory(JSON.parse(raw));
      } catch (e) {}
    }

    // Initialize speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';
        
        rec.onresult = (event: any) => {
          let text = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              text += event.results[i][0].transcript;
            }
          }
          if (text) {
            setUserAnswer(prev => prev + (prev.endsWith(' ') || !prev ? '' : ' ') + text);
          }
        };
        
        rec.onerror = () => setIsListening(false);
        rec.onend = () => setIsListening(false);
        setRecognition(rec);
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognition.start();
    }
  };

  const getRoundQuestion = (round: number, role: string) => {
    const questions: { [key: number]: { [key: string]: string } } = {
      1: {
        'Frontend Developer': "Welcome! I am Marcus, your lead recruiter today. Let's start with Round 1: Resume Screening. Scanning your profile, I see key frontend frameworks. Could you walk me through your most complex frontend project, focusing on how you optimized rendering performance and handled API syncing?",
        'Backend Developer': "Welcome! I am Marcus, your lead recruiter today. Let's start with Round 1: Resume Screening. Reviewing your profile, I see various databases and server runtimes. Could you walk me through a complex backend project, detailing the architecture and how you handled concurrent requests?",
        'Full Stack Developer': "Welcome! I am Marcus, your lead recruiter today. Let's start with Round 1: Resume Screening. Looking at your full-stack tags, could you walk me through a multi-tier project you built from scratch? Explain your database choices and how client-server data synchronization is configured.",
        'Data Scientist': "Welcome! I am Marcus, your lead recruiter today. Let's start with Round 1: Resume Screening. Looking at your data engineering profile, walk me through a project where you processed a large dataset. What data cleaning techniques and feature engineering steps did you execute?",
        'AI Engineer': "Welcome! I am Marcus, your lead recruiter today. Let's start with Round 1: Resume Screening. Reviewing your AI credentials, could you walk me through an AI/ML project? Detail the model architecture, the dataset you used, and how you evaluated overall accuracy."
      },
      2: {
        'Frontend Developer': "Excellent detail. Let's move to Round 2: Technical Interview. How would you optimize the Core Web Vitals, specifically Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS), in a React/Next.js application handling heavy images and dynamic data?",
        'Backend Developer': "Excellent detail. Let's move to Round 2: Technical Interview. How would you design a distributed rate-limiter middleware for a RESTful API? What data structures and database models would you select to support high-throughput scaling?",
        'Full Stack Developer': "Excellent detail. Let's move to Round 2: Technical Interview. Could you design the system architecture for a real-time collaborative document editor? What communication protocols, database architectures, and conflict resolution rules would you use?",
        'Data Scientist': "Excellent detail. Let's move to Round 2: Technical Interview. Explain the mathematical difference between L1 (Lasso) and L2 (Ridge) regularization. In what scenario would you explicitly choose one over the other, and how do they prevent overfitting?",
        'AI Engineer': "Excellent detail. Let's move to Round 2: Technical Interview. Could you walk me through the architecture of a Retrieval Augmented Generation (RAG) system? Explain how you configure vector databases, document chunking parameters, and reduce model hallucination."
      },
      3: {
        'Frontend Developer': "Got it. Let's proceed to Round 3: Behavioral Interview. Can you share an experience where a product designer or another developer strongly disagreed with your UI implementation or architectural choice? How did you align the team and handle the conflict?",
        'Backend Developer': "Got it. Let's proceed to Round 3: Behavioral Interview. Tell me about a scenario where a critical database lock or server crash occurred in production, and you had to resolve it under high pressure. How did you diagnose the issue and communicate it to stakeholders?",
        'Full Stack Developer': "Got it. Let's proceed to Round 3: Behavioral Interview. Walk me through a time when you were working on a team project and had to compromise on technical debt to meet a tight release deadline. How did you structure the roadmap and align team members?",
        'Data Scientist': "Got it. Let's proceed to Round 3: Behavioral Interview. Tell me about a time when you presented data insights or statistical model outcomes to non-technical business executives who were skeptical. How did you convey the value?",
        'AI Engineer': "Got it. Let's proceed to Round 3: Behavioral Interview. Describe a scenario where an AI model you deployed performed poorly in production due to data drift or bias. How did you troubleshoot, retrain, and coordinate the deployment updates with your team?"
      },
      4: {
        'Frontend Developer': "Perfect. Let's finish with Round 4: HR Interview. Why are you interested in joining our engineering team, what are your immediate CTC expectations, and where do you see yourself technically in three years?",
        'Backend Developer': "Perfect. Let's finish with Round 4: HR Interview. Why are you interested in joining our engineering team, what are your immediate CTC expectations, and where do you see yourself technically in three years?",
        'Full Stack Developer': "Perfect. Let's finish with Round 4: HR Interview. Why are you interested in joining our engineering team, what are your immediate CTC expectations, and where do you see yourself technically in three years?",
        'Data Scientist': "Perfect. Let's finish with Round 4: HR Interview. Why are you interested in joining our engineering team, what are your immediate CTC expectations, and where do you see yourself technically in three years?",
        'AI Engineer': "Perfect. Let's finish with Round 4: HR Interview. Why are you interested in joining our engineering team, what are your immediate CTC expectations, and where do you see yourself technically in three years?"
      }
    };
    
    return questions[round][role] || questions[round]['Frontend Developer'];
  };

  const handleStartSimulation = () => {
    setActiveRound(1);
    setAnswers([]);
    const firstQuestion = getRoundQuestion(1, selectedRole);
    setChatHistory([{ sender: 'recruiter', text: firstQuestion }]);
    setUserAnswer('');
  };

  const getRoundQuestionShort = (round: number, role: string): string => {
    const shorts: { [key: number]: { [key: string]: string } } = {
      1: {
        'Frontend Developer': "walk me through your most complex frontend project (rendering optimization, API syncing).",
        'Backend Developer': "walk me through your complex backend project (architecture, concurrent requests).",
        'Full Stack Developer': "walk me through your multi-tier project built from scratch (databases, client-server sync).",
        'Data Scientist': "walk me through a large dataset project (data cleaning, feature engineering).",
        'AI Engineer': "walk me through your AI/ML project (architecture, dataset, accuracy evaluation)."
      },
      2: {
        'Frontend Developer': "explain how you would optimize LCP and CLS in a React/Next.js app with heavy images and dynamic data.",
        'Backend Developer': "design a distributed rate-limiter middleware for a RESTful API (scaling, data structures).",
        'Full Stack Developer': "design a real-time collaborative document editor (protocols, conflict resolution).",
        'Data Scientist': "explain the difference between L1 and L2 regularization, when to choose which, and how they prevent overfitting.",
        'AI Engineer': "walk me through a RAG system architecture (vector DBs, chunking, reducing hallucinations)."
      },
      3: {
        'Frontend Developer': "share a story of a team conflict/disagreement over a UI or architectural choice and how you resolved it.",
        'Backend Developer': "tell me about resolving a critical production issue (db lock or crash) under pressure.",
        'Full Stack Developer': "share a time when you had to compromise on technical debt to meet a deadline.",
        'Data Scientist': "tell me about presenting data insights to skeptical non-technical stakeholders.",
        'AI Engineer': "explain how you handled a poor-performing model in production due to drift/bias."
      },
      4: {
        'Frontend Developer': "share why you want to join, your CTC expectations, and your 3-year goals.",
        'Backend Developer': "share why you want to join, your CTC expectations, and your 3-year goals.",
        'Full Stack Developer': "share why you want to join, your CTC expectations, and your 3-year goals.",
        'Data Scientist': "share why you want to join, your CTC expectations, and your 3-year goals.",
        'AI Engineer': "share why you want to join, your CTC expectations, and your 3-year goals."
      }
    };
    return shorts[round]?.[role] || shorts[round]?.['Frontend Developer'] || "answer the question.";
  };

  const checkAnswerValidity = (ans: string, round: number, role: string): { isValid: boolean; message?: string } => {
    const trimmed = ans.trim().toLowerCase();
    
    // 1. Common Greetings
    const greetings = [
      'hi', 'hello', 'hey', 'yo', 'sup', 'greetings', 'morning', 'afternoon', 'evening', 
      'good morning', 'good afternoon', 'good evening', 'howdy', 'hola', 'namaste',
      'hi marcus', 'hello marcus', 'hey marcus'
    ];
    
    // 2. Simple Verbs / Shorthands
    const simpleVerbs = [
      'ok', 'yes', 'no', 'fine', 'sure', 'yeah', 'nope', 'yup', 'thanks', 'thank you', 
      'cool', 'test', 'okay', 'i don\'t know', 'idk', 'skip', 'pass', 'nothing', 'none',
      'nothin', 'dont know', 'not sure'
    ];

    const shortQ = getRoundQuestionShort(round, role);

    // Pure Greeting check
    if (greetings.includes(trimmed) || trimmed === 'hi there' || trimmed === 'hello there') {
      return {
        isValid: false,
        message: `Hello! It's great to meet you. Let's jump right into the screening. Could you please ${shortQ}`
      };
    }

    // Checking status/how are you
    if (trimmed.includes('how are you') || trimmed.includes('how are u') || trimmed.includes('how is it going') || trimmed.includes('hope you are well') || trimmed.includes('hope you are doing well')) {
      return {
        isValid: false,
        message: `I'm doing well, thank you for asking! Let's get down to business. Could you please ${shortQ}`
      };
    }

    // Checking identity
    if (trimmed.includes('who are you') || trimmed.includes('what is your name') || trimmed.includes('whats your name') || trimmed.includes('are you an ai') || trimmed.includes('are you a bot') || trimmed.includes('are you human')) {
      return {
        isValid: false,
        message: `I am Marcus Vance, your lead engineering recruiter today. Let's stay focused on the assessment. Could you please ${shortQ}`
      };
    }

    if (trimmed.includes('what do you do') || trimmed.includes('what is this') || trimmed.includes('help') || trimmed.includes('what should i do')) {
      return {
        isValid: false,
        message: `This is the AI Recruiter Simulator where I screen you for the ${role} position. Let's continue: could you please ${shortQ}`
      };
    }

    // Refusals / shorthands
    if (simpleVerbs.includes(trimmed)) {
      return {
        isValid: false,
        message: `To evaluate you properly for the ${role} position, I need a detailed answer. Could you please ${shortQ}`
      };
    }

    // Tech matching
    const generalTechKeywords = [
      'project', 'build', 'framework', 'database', 'data', 'system', 'react', 'next', 'node', 
      'django', 'python', 'java', 'c++', 'design', 'develop', 'code', 'app', 'model', 'train', 
      'clean', 'analyze', 'sql', 'git', 'api', 'library', 'work', 'experience', 'engineered', 
      'implemented', 'deployed', 'testing', 'server', 'client', 'frontend', 'backend', 'fullstack', 
      'full-stack', 'cloud', 'aws', 'docker', 'kubernetes', 'optimization', 'performance'
    ];

    const getRoundKeywords = (r: number, rl: string): string[] => {
      if (r === 1) {
        return ['project', 'build', 'framework', 'architecture', 'database', 'rendering', 'api', 'sync', 'concurrent', 'request', 'dataset', 'cleaning', 'feature', 'model', 'accuracy', 'evaluate'];
      }
      if (r === 2) {
        if (rl === 'Frontend Developer') return ['vitals', 'lcp', 'cls', 'react', 'next', 'image', 'render', 'paint', 'shift', 'performance', 'optimize', 'speed', 'dom', 'component'];
        if (rl === 'Backend Developer') return ['rate', 'limit', 'middleware', 'api', 'database', 'redis', 'cache', 'scale', 'concurrency', 'request', 'token', 'bucket', 'queue'];
        if (rl === 'Full Stack Developer') return ['collaborative', 'editor', 'protocol', 'websocket', 'sync', 'conflict', 'database', 'architecture', 'socket', 'realtime', 'real-time'];
        if (rl === 'Data Scientist') return ['regularization', 'l1', 'l2', 'lasso', 'ridge', 'overfit', 'math', 'model', 'loss', 'coefficient', 'norm'];
        if (rl === 'AI Engineer') return ['rag', 'retrieval', 'vector', 'db', 'hallucinate', 'chunk', 'embedding', 'llm', 'model', 'generation', 'prompt'];
      }
      if (r === 3) {
        return ['disagree', 'conflict', 'align', 'compromise', 'pressure', 'lock', 'crash', 'debt', 'skeptical', 'executive', 'drift', 'bias', 'team', 'resolve', 'communicate', 'listen', 'patience', 'solve', 'manager', 'designer'];
      }
      if (r === 4) {
        return ['ctc', 'salary', 'lakh', 'k', 'year', 'goals', 'engineering', 'team', 'learn', 'grow', 'interested', 'join', 'culture', 'money', 'future', 'expectation', 'want', 'expecting'];
      }
      return [];
    };

    const roundKeywords = getRoundKeywords(round, role);
    const hasGeneralTech = generalTechKeywords.some(kw => trimmed.includes(kw));
    const hasRoundSpec = roundKeywords.some(kw => trimmed.includes(kw));

    if (trimmed.length < 15 && !hasGeneralTech && !hasRoundSpec) {
      return {
        isValid: false,
        message: `Your response is quite brief and doesn't seem to address the question. Could you please elaborate on how you: ${shortQ}`
      };
    }

    if (trimmed.length < 50 && !hasGeneralTech && !hasRoundSpec) {
      const offTopicIndicators = ['weather', 'hobby', 'hobbies', 'joke', 'capital', 'apple', 'banana', 'eat', 'food', 'movie', 'song', 'music', 'game', 'play', 'sport', 'cricket', 'football'];
      const hasOffTopic = offTopicIndicators.some(kw => trimmed.includes(kw));
      
      if (hasOffTopic || trimmed.split(' ').length < 8) {
        return {
          isValid: false,
          message: `That doesn't seem to be related to our interview topic. Let's stay focused. Could you please ${shortQ}`
        };
      }
    }

    return { isValid: true };
  };

  const generateDynamicTransition = (round: number, ans: string): string => {
    const trimmed = ans.toLowerCase();
    
    if (round === 1) {
      if (trimmed.includes('react') || trimmed.includes('next.js') || trimmed.includes('vue') || trimmed.includes('angular') || trimmed.includes('frontend')) {
        return "I see you have optimized rendering and synced state using frontend frameworks. That's a great tool. Let's move to Round 2: Technical Interview. ";
      }
      if (trimmed.includes('node') || trimmed.includes('express') || trimmed.includes('django') || trimmed.includes('flask') || trimmed.includes('backend') || trimmed.includes('concurrent')) {
        return "I see. Managing server architecture, routing, and concurrency is highly important. Let's move to Round 2: Technical Interview. ";
      }
      if (trimmed.includes('python') || trimmed.includes('pandas') || trimmed.includes('ml') || trimmed.includes('data')) {
        return "Acknowledge. Processing pipelines, wrangling datasets, and engineering features is crucial. Let's move to Round 2: Technical Interview. ";
      }
      return "Got it. Walking through project architectures helps clarify your core contributions. Let's move to Round 2: Technical Interview. ";
    }
    
    if (round === 2) {
      if (trimmed.includes('redis') || trimmed.includes('cache') || trimmed.includes('invalidation') || trimmed.includes('ttl')) {
        return "Excellent choice on using Redis with TTL invalidation! It's a standard pattern for high-traffic microservices. Let's proceed to Round 3: Behavioral Fit. ";
      }
      if (trimmed.includes('limit') || trimmed.includes('token') || trimmed.includes('bucket') || trimmed.includes('middleware')) {
        return "Understood. Token bucket algorithm in server middleware prevents service overload. Let's proceed to Round 3: Behavioral Fit. ";
      }
      if (trimmed.includes('regularization') || trimmed.includes('lasso') || trimmed.includes('ridge') || trimmed.includes('overfit')) {
        return "Correct. Constraining coefficients to prevent model overfitting is standard. Let's proceed to Round 3: Behavioral Fit. ";
      }
      if (trimmed.includes('rag') || trimmed.includes('vector') || trimmed.includes('hallucinate') || trimmed.includes('chunk')) {
        return "Great point. Optimizing semantic search chunks reduces model hallucinations. Let's proceed to Round 3: Behavioral Fit. ";
      }
      return "Acknowledge. Solving technical bottlenecks systematically is a vital skill. Let's proceed to Round 3: Behavioral Fit. ";
    }
    
    if (round === 3) {
      if (trimmed.includes('resolved') || trimmed.includes('align') || trimmed.includes('compromise') || trimmed.includes('team') || trimmed.includes('listen')) {
        return "It sounds like you handled that team disagreement and alignment very professionally. Let's finish with Round 4: HR Interview. ";
      }
      return "I appreciate you sharing that. Navigating alignment and compromise is a core skill here. Let's finish with Round 4: HR Interview. ";
    }
    return "";
  };

  const handleNextRound = () => {
    if (!userAnswer.trim()) return;

    // Validate answer first
    const validation = checkAnswerValidity(userAnswer, activeRound as number, selectedRole);
    if (!validation.isValid) {
      setChatHistory(prev => [
        ...prev,
        { sender: 'candidate' as const, text: userAnswer },
        { sender: 'recruiter' as const, text: validation.message || "Could you please elaborate further?" }
      ]);
      setUserAnswer('');
      return;
    }

    const currentAnswers = [...answers, userAnswer];
    setAnswers(currentAnswers);
    
    // Add candidate response to chat history
    const nextChat = [...chatHistory, { sender: 'candidate' as const, text: userAnswer }];
    
    if (activeRound === 1) {
      setActiveRound(2);
      const transition = generateDynamicTransition(1, userAnswer);
      const q = getRoundQuestion(2, selectedRole);
      setChatHistory([...nextChat, { sender: 'recruiter', text: transition + q }]);
    } else if (activeRound === 2) {
      setActiveRound(3);
      const transition = generateDynamicTransition(2, userAnswer);
      const q = getRoundQuestion(3, selectedRole);
      setChatHistory([...nextChat, { sender: 'recruiter', text: transition + q }]);
    } else if (activeRound === 3) {
      setActiveRound(4);
      const transition = generateDynamicTransition(3, userAnswer);
      const q = getRoundQuestion(4, selectedRole);
      setChatHistory([...nextChat, { sender: 'recruiter', text: transition + q }]);
    } else if (activeRound === 4) {
      setActiveRound('report');
      // Evaluate interview rounds
      const report = evaluateInterview(currentAnswers, selectedRole, profile);
      setReportData(report);
      
      // Save to localStorage
      const newRun = {
        id: Math.random().toString(36).substring(2, 9),
        role: selectedRole,
        date: new Date().toLocaleDateString(),
        decision: report.decision,
        scores: report.scores
      };
      
      const raw = localStorage.getItem('ptp_recruiter_history');
      let hist = [];
      if (raw) {
        try { hist = JSON.parse(raw); } catch(e){}
      }
      const updated = [newRun, ...hist];
      localStorage.setItem('ptp_recruiter_history', JSON.stringify(updated.slice(0, 30)));
      setHistory(updated);
    }
    
    setUserAnswer('');
  };

  const evaluateInterview = (ansList: string[], roleTitle: string, userProfile: UserProfile | null) => {
    const ans1 = ansList[0] || '';
    const ans2 = ansList[1] || '';
    const ans3 = ansList[2] || '';
    const ans4 = ansList[3] || '';

    // 1. Technical Score
    const techKeywords = ['react', 'next', 'node', 'sql', 'database', 'cache', 'redis', 'api', 'docker', 'python', 'pytorch', 'ml', 'llm', 'genai', 'statistics', 'spark', 'microservices', 'middleware'];
    let techHits = 0;
    techKeywords.forEach(kw => {
      if (ans1.toLowerCase().includes(kw)) techHits++;
      if (ans2.toLowerCase().includes(kw)) techHits += 2;
    });
    const profileTech = userProfile?.codingScore || 70;
    let computedTech = Math.round(profileTech * 0.6 + (techHits * 6) + (ans2.length / 30));
    computedTech = Math.min(98, Math.max(50, computedTech));

    // 2. Communication Score
    const fillers = ['uh', 'um', 'like', 'you know', 'basically', 'actually'];
    let fillerCount = 0;
    ansList.forEach(a => {
      fillers.forEach(f => {
        const matches = a.toLowerCase().match(new RegExp(`\\b${f}\\b`, 'g'));
        if (matches) fillerCount += matches.length;
      });
    });
    const profileComm = userProfile?.communicationScore || 72;
    let computedComm = Math.round(profileComm * 0.7 + 20 - (fillerCount * 2) + (Math.min(ans1.length + ans4.length, 1000) / 100));
    computedComm = Math.min(98, Math.max(45, computedComm));

    // 3. Leadership Score
    const leadershipKeywords = ['resolved', 'agree', 'leader', 'collaborate', 'team', 'listen', 'communicate', 'decided', 'conflict', 'compromise'];
    let leadershipHits = 0;
    leadershipKeywords.forEach(kw => {
      if (ans3.toLowerCase().includes(kw)) leadershipHits++;
    });
    const profileMock = userProfile?.mockInterviewScore || 70;
    let computedLeader = Math.round(profileMock * 0.6 + (leadershipHits * 8) + (ans3.length / 40));
    computedLeader = Math.min(98, Math.max(50, computedLeader));

    // 4. Problem Solving Score
    const probKeywords = ['designed', 'solved', 'issue', 'debugging', 'optimized', 'structure', 'algorithm', 'logic', 'strategy', 'metrics'];
    let probHits = 0;
    probKeywords.forEach(kw => {
      if (ans1.toLowerCase().includes(kw)) probHits++;
      if (ans2.toLowerCase().includes(kw)) probHits += 2;
    });
    const profileAptitude = userProfile?.aptitudeScore || 70;
    let computedProb = Math.round(profileAptitude * 0.6 + (probHits * 7) + (ans2.length / 30));
    computedProb = Math.min(98, Math.max(50, computedProb));

    const avg = Math.round((computedTech + computedComm + computedLeader + computedProb) / 4);

    let decision: 'Selected' | 'Hold' | 'Rejected' = 'Hold';
    if (avg >= 80) decision = 'Selected';
    else if (avg >= 65) decision = 'Hold';
    else decision = 'Rejected';

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    let notes = '';

    if (computedTech >= 80) {
      strengths.push('Excellent core domain knowledge and clean technical articulations.');
    } else {
      weaknesses.push('Could elaborate more on architectural details and framework tradeoffs.');
    }

    if (computedComm >= 80) {
      strengths.push('Articulate speaker with minimal filler words and clear, fluent transitions.');
    } else {
      weaknesses.push('Pacing was slightly irregular; practice minimizing vocal filler words.');
    }

    if (computedLeader >= 75) {
      strengths.push('Strong structural approach to conflict resolution and team collaboration.');
    } else {
      weaknesses.push('Behavioral examples lacked depth; focus on the STAR method response structuring.');
    }

    if (computedProb >= 80) {
      strengths.push('Methodical problem solving showing data-driven performance optimizations.');
    } else {
      weaknesses.push('Focus on walking through complexity evaluations (Big-O) for design alternatives.');
    }

    if (decision === 'Selected') {
      notes = `Outstanding session! Marcus recommends immediately processing an offer. The candidate demonstrated solid competency matching all key attributes of the ${roleTitle} profile.`;
    } else if (decision === 'Hold') {
      notes = `The candidate shows strong potential, but needs validation on certain topics. Marcus recommends a follow-up assessment round focusing on System Design and deep architecture concepts before a final offer decision.`;
    } else {
      notes = `Unfortunately, the candidate does not meet the baseline criteria for SDE. Focus on core problem-solving structures and interview delivery before re-applying in 6 months.`;
    }

    return {
      scores: {
        technical: computedTech,
        communication: computedComm,
        leadership: computedLeader,
        problemSolving: computedProb
      },
      decision,
      feedback: {
        strengths,
        weaknesses,
        notes
      }
    };
  };

  const getDecisionStyles = (decision: string) => {
    return {
      Selected: { text: 'Selected', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
      Hold: { text: 'On Hold', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
      Rejected: { text: 'Rejected', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' }
    }[decision] || { text: 'On Hold', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <span className="text-indigo-400">👥</span> AI Recruiter Simulator
          </h2>
          <p className="text-slate-400 text-sm">Conduct a full, 4-round interview screening with Marcus and get a detailed recruiter decision report.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#0c0c1e] border border-white/5 px-3 py-1.5 rounded-xl self-start md:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-indigo-400">Interactive Chatbot Mode</span>
        </div>
      </div>

      {activeRound === 'idle' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Welcome Card & Configuration */}
          <div className="lg:col-span-7 space-y-6">
            <div className="card p-6 space-y-6 bg-gradient-to-br from-[#0e0e1e] to-[#06060c]">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-3xl shadow-lg shrink-0">
                  🕵️
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">Marcus Vance</h3>
                  <span className="text-xs text-indigo-400 font-semibold block">Lead Engineering Recruiter</span>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Marcus evaluates profiles for key tech startups. He will screen you across 4 sequential phases: **Resume Screening**, **Technical Aptitude**, **Behavioral Fit**, and **HR Culture Matching**.
                  </p>
                </div>
              </div>

              <div className="h-px bg-white/5" />

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-white block mb-1.5 uppercase tracking-wider">Select Preferred Target Role</label>
                  <select
                    className="input-field py-2.5 text-xs text-slate-200"
                    value={selectedRole}
                    onChange={e => setSelectedRole(e.target.value)}
                  >
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="AI Engineer">AI Engineer</option>
                  </select>
                </div>

                <div className="p-4 bg-white/2 border border-white/5 rounded-xl space-y-2 text-xs text-slate-400 leading-relaxed">
                  <h4 className="font-bold text-white text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <span>💡</span> Interview Tips:
                  </h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Walk through concrete examples of projects and frameworks.</li>
                    <li>Avoid generic fillers and focus on technical structure terms.</li>
                    <li>Use the **microphone** button if you want to answer via speech-to-text dictation.</li>
                  </ul>
                </div>

                <button
                  onClick={handleStartSimulation}
                  className="btn-primary w-full py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <span>🚀</span> Begin Recruiter Screening
                </button>
              </div>
            </div>
          </div>

          {/* Historical sessions log */}
          <div className="lg:col-span-5">
            <div className="card p-5 h-full flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Recruitment History</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Logs of your past recruiter assessments and decisions.</p>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[300px] space-y-2 pr-1 scrollbar-thin">
                {history.length === 0 ? (
                  <div className="text-center py-12 text-xs text-slate-500 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2">
                    <Trophy size={20} className="opacity-30" />
                    <span>No completed sessions found.</span>
                  </div>
                ) : (
                  history.map((run) => {
                    const stl = getDecisionStyles(run.decision);
                    return (
                      <div key={run.id} className="p-3 bg-white/2 border border-white/5 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-white block">{run.role}</span>
                          <span className="text-[9px] text-slate-500">{run.date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block">Avg Score</span>
                            <strong className="text-indigo-400">
                              {Math.round((run.scores.technical + run.scores.communication + run.scores.leadership + run.scores.problemSolving) / 4)}%
                            </strong>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase shrink-0 ${stl.color} ${stl.bg} ${stl.border}`}>
                            {stl.text}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Interview Interface */}
      {activeRound !== 'idle' && activeRound !== 'report' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Stepper Timeline Left */}
          <div className="lg:col-span-4 space-y-6">
            <div className="card p-5 space-y-5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Recruitment Stages</h3>
              
              <div className="flex flex-col gap-6 relative pl-3 border-l border-white/5">
                {[
                  { round: 1, title: 'Round 1: Resume Screen', desc: 'Verify skills, tags and project portfolios.' },
                  { round: 2, title: 'Round 2: Tech Screening', desc: 'Domain algorithms and optimization models.' },
                  { round: 3, title: 'Round 3: Behavioral Fit', desc: 'STAR situational leadership questions.' },
                  { round: 4, title: 'Round 4: HR Selection', desc: 'CTC align, career goals, team culture.' }
                ].map((step) => {
                  const isActive = activeRound === step.round;
                  const isDone = (activeRound as number) > step.round;
                  
                  return (
                    <div key={step.round} className="relative flex gap-4 items-start">
                      {/* Circle bullet */}
                      <div className={`absolute -left-[21px] w-4.5 h-4.5 rounded-full border flex items-center justify-center text-[9px] font-bold transition-all shrink-0 ${
                        isDone
                          ? 'bg-emerald-500 border-emerald-500 text-slate-900 shadow-md shadow-emerald-500/10'
                          : isActive
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20 scale-105'
                          : 'bg-[#0a0a14] border-white/10 text-slate-600'
                      }`}>
                        {isDone ? '✓' : step.round}
                      </div>

                      <div className="min-w-0">
                        <h4 className={`text-xs font-bold transition-colors ${isActive ? 'text-white' : isDone ? 'text-slate-400' : 'text-slate-500'}`}>
                          {step.title}
                        </h4>
                        <p className={`text-[10px] mt-0.5 leading-relaxed truncate ${isActive ? 'text-indigo-300' : 'text-slate-600'}`}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recruiter Identity Card */}
            <div className="card p-4 space-y-3 bg-[#0d0d1e]/20 border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xl shrink-0">
                🕵️
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest block">Screening Officer</span>
                <span className="text-xs font-bold text-white block truncate">Marcus Vance</span>
              </div>
            </div>
          </div>

          {/* Active Chat Console Right */}
          <div className="lg:col-span-8 space-y-4">
            <div className="card p-5 h-[480px] flex flex-col justify-between space-y-4">
              {/* Chat Viewport */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin flex flex-col">
                {chatHistory.map((chat, idx) => (
                  <div
                    key={idx}
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed space-y-1 ${
                      chat.sender === 'recruiter'
                        ? 'bg-white/3 border border-white/5 text-slate-200 self-start rounded-tl-none'
                        : 'bg-indigo-600/10 border border-indigo-500/20 text-white self-end rounded-tr-none'
                    }`}
                  >
                    <span className="text-[9px] font-bold block uppercase tracking-wider opacity-60">
                      {chat.sender === 'recruiter' ? 'Marcus Vance' : 'You'}
                    </span>
                    <p>{chat.text}</p>
                  </div>
                ))}
              </div>

              {/* Chat Control Input */}
              <div className="space-y-3 border-t border-white/5 pt-4">
                <div className="flex items-center gap-2 bg-[#090912]/80 border border-white/10 rounded-xl px-3 py-1.5 focus-within:border-indigo-500/40 transition-colors">
                  <textarea
                    rows={2}
                    className="bg-transparent text-xs text-white focus:outline-none w-full placeholder-slate-600 resize-none py-1"
                    placeholder={isListening ? 'Listening to voice dictation...' : 'Type your detailed screening answer here...'}
                    value={userAnswer}
                    onChange={e => setUserAnswer(e.target.value)}
                  />
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <button
                      onClick={toggleListening}
                      className={`p-2 rounded-lg transition-colors border ${
                        isListening
                          ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse'
                          : 'bg-white/2 border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                      title={isListening ? 'Stop listening' : 'Start Speech-to-Text dictation'}
                    >
                      {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                    </button>
                    <button
                      onClick={handleNextRound}
                      disabled={!userAnswer.trim()}
                      className="btn-primary py-2 px-4 text-xs font-bold flex items-center gap-1 h-9 rounded-lg"
                    >
                      <span>Submit</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-500">
                  <span>Progress automatically synchronized to localStorage.</span>
                  <span>Press Submit to proceed to the next stage.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recruiter Evaluation Report Card */}
      {activeRound === 'report' && reportData && (
        <div className="space-y-6">
          {/* Top Status Header */}
          {(() => {
            const stl = getDecisionStyles(reportData.decision);
            return (
              <div className={`card p-6 border flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r ${stl.bg} ${stl.border}`}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/3 flex items-center justify-center text-2xl shadow">
                    🕵️
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-300">Marcus Vance's Decision</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Assessment final result matching candidate credentials.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Overall Screening Score</span>
                    <strong className="text-2xl font-black text-white">
                      {Math.round((reportData.scores.technical + reportData.scores.communication + reportData.scores.leadership + reportData.scores.problemSolving) / 4)}%
                    </strong>
                  </div>
                  <span className={`px-4 py-1.5 rounded-xl text-xs font-black border uppercase tracking-wider ${stl.color} ${stl.bg} ${stl.border} shadow-lg`}>
                    {stl.text}
                  </span>
                </div>
              </div>
            );
          })()}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Side: Competency bar scores */}
            <div className="lg:col-span-5 space-y-6">
              <div className="card p-5 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Competency scorecard</h3>
                
                <div className="space-y-4">
                  {[
                    { label: 'Technical Score', score: reportData.scores.technical, color: 'bg-indigo-500' },
                    { label: 'Communication Score', score: reportData.scores.communication, color: 'bg-emerald-500' },
                    { label: 'Leadership Score', score: reportData.scores.leadership, color: 'bg-amber-500' },
                    { label: 'Problem Solving Score', score: reportData.scores.problemSolving, color: 'bg-blue-500' }
                  ].map((bar) => (
                    <div key={bar.label} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 font-semibold">{bar.label}</span>
                        <span className="text-white font-extrabold">{bar.score}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${bar.color} transition-all duration-700`}
                          style={{ width: `${bar.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side: Feedback logs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="card p-6 space-y-5 bg-[#0e0e1e]/20">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="text-indigo-400">📝</span> Recruiter Screening Log & Notes
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Chronological summary feedback recorded by Marcus during the assessment.</p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-white/3 border border-white/5 rounded-xl text-slate-300 leading-relaxed italic">
                    "{reportData.feedback.notes}"
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Strengths */}
                    <div className="space-y-2.5">
                      <h4 className="font-bold text-emerald-400 text-[11px] uppercase tracking-wider">✓ Strengths Identified</h4>
                      <ul className="space-y-2 text-slate-400 leading-relaxed text-[11px]">
                        {reportData.feedback.strengths.map((str, idx) => (
                          <li key={idx} className="flex gap-2 items-start">
                            <span className="text-emerald-400">✓</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="space-y-2.5">
                      <h4 className="font-bold text-amber-400 text-[11px] uppercase tracking-wider">! Gaps / Areas to Improve</h4>
                      <ul className="space-y-2 text-slate-400 leading-relaxed text-[11px]">
                        {reportData.feedback.weaknesses.map((wk, idx) => (
                          <li key={idx} className="flex gap-2 items-start">
                            <span className="text-amber-400">•</span>
                            <span>{wk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={() => setActiveRound('idle')}
              className="btn-ghost py-2.5 px-6 text-xs"
            >
              Exit Simulation
            </button>
            <button
              onClick={handleStartSimulation}
              className="btn-primary py-2.5 px-6 text-xs font-bold"
            >
              Restart New Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



