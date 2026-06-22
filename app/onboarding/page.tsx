'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, GraduationCap, Briefcase, Star, FileText, CheckCircle2,
  ArrowRight, ArrowLeft, Zap, Shield, Sparkles, Upload, FileUp
} from 'lucide-react';
import Link from 'next/link';
import { getUserProfile, saveUserProfile } from '@/lib/storage';
import { UserProfile } from '@/types';

const SKILLS_LIST = [
  'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'SQL',
  'Machine Learning', 'Data Structures', 'System Design', 'AWS',
  'Docker', 'Git', 'TypeScript', 'Go', 'Rust', 'Kubernetes',
  'GraphQL', 'MongoDB', 'PostgreSQL', 'HTML/CSS', 'Tailwind CSS'
];

const ROLES_LIST = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer',
  'Full Stack Developer', 'Data Scientist', 'Data Analyst',
  'Product Manager', 'QA Engineer', 'DevOps Engineer', 'Cloud Architect'
];

const steps = [
  { label: 'Personal Details', icon: User, desc: 'Contact & location info' },
  { label: 'Academic Profile', icon: GraduationCap, desc: 'College & scores' },
  { label: 'Career Preferences', icon: Briefcase, desc: 'Roles & target CTC' },
  { label: 'Skills & Certs', icon: Shield, desc: 'Languages & certificates' },
  { label: 'Test Scorecard', icon: Star, desc: 'Self-evaluation scores' },
  { label: 'Resume Upload', icon: FileText, desc: 'ATS parser setup' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    fullName: '', email: '', phone: '', city: '', state: '',
    college: '', university: '', degree: '', branch: '', currentYear: '', cgpa: '', graduationYear: '', activeBacklogs: 0,
    preferredRole: '', skills: [], certifications: [],
    aptitudeScore: 70, codingScore: 65, communicationScore: 75, mockInterviewScore: 70,
    resumeUploaded: false, resumeName: ''
  });

  // Resume state
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  useEffect(() => {
    const p = getUserProfile();
    if (p) {
      setProfile(p);
    }
  }, []);

  const handleNext = () => {
    // Save to localStorage on each step
    const currentProfile = {
      ...profile,
      fullName: profile.fullName || 'Dhanush Gowda G',
      email: profile.email || 'dh4nushgowd4@gmail.com',
      skills: profile.skills || [],
      certifications: profile.certifications || [],
      onboardingComplete: step === steps.length - 1,
      createdAt: profile.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as UserProfile;
    saveUserProfile(currentProfile);

    if (step < steps.length - 1) {
      setStep(s => s + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }, 1200);
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const setVal = <K extends keyof UserProfile>(k: K, v: UserProfile[K]) => {
    setProfile(prev => ({ ...prev, [k]: v }));
  };

  const toggleSkill = (skill: string) => {
    const list = profile.skills || [];
    if (list.includes(skill)) {
      setVal('skills', list.filter(s => s !== skill));
    } else {
      setVal('skills', [...list, skill]);
    }
  };

  const handleResumeSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      setVal('resumeUploaded', true);
      setVal('resumeName', file.name);
    }
  };

  const currentCompletion = Math.round(((step + 1) / steps.length) * 100);

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a14] text-white">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center mx-auto shadow-2xl border border-indigo-500/20">
            <CheckCircle2 size={40} className="text-indigo-400" />
          </div>
          <h2 className="text-2xl font-black gradient-text">Onboarding Complete!</h2>
          <p className="text-slate-400 text-sm max-w-xs mx-auto">Configuring your dashboard workspace...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white flex flex-col justify-between py-8 px-4 relative overflow-hidden">
      <div className="mesh-bg pointer-events-none" />

      {/* Header */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between relative z-10 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Zap size={15} className="text-white" />
          </div>
          <span className="font-black text-sm text-white">Placement <span className="gradient-text">Tracker Pro</span></span>
        </div>
        <span className="text-xs text-slate-500 font-medium">Logged in as {profile.email || 'dh4nushgowd4@gmail.com'}</span>
      </div>

      {/* Onboarding Box */}
      <div className="max-w-2xl w-full mx-auto relative z-10 flex-1 flex flex-col justify-center my-4">
        {/* Step Indicator Panel */}
        <div className="grid grid-cols-6 gap-2 mb-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isCompleted = idx < step;
            const isActive = idx === step;
            return (
              <div key={idx} className="flex flex-col items-center">
                <button
                  onClick={() => idx <= step && setStep(idx)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                    isActive ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/20' :
                    isCompleted ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-400' :
                    'bg-white/5 border-white/5 text-slate-600 cursor-not-allowed'
                  }`}
                  disabled={idx > step}
                >
                  {isCompleted ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                </button>
                <span className="hidden sm:block text-[10px] text-slate-500 font-medium mt-1 text-center truncate w-full">{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full bg-white/5 rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
            animate={{ width: `${currentCompletion}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Form Container */}
        <div className="card p-6 sm:p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">{steps[step].label}</h3>
                <p className="text-slate-400 text-sm">{steps[step].desc}</p>
              </div>

              {/* Step 1: Personal Details */}
              {step === 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-1.5 block">Phone Number</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="+91 98765 43210"
                        value={profile.phone || ''}
                        onChange={e => setVal('phone', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-1.5 block">Full Name</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Dhanush Gowda G"
                        value={profile.fullName || ''}
                        onChange={e => setVal('fullName', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-1.5 block">City</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Bangalore"
                        value={profile.city || ''}
                        onChange={e => setVal('city', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-1.5 block">State</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Karnataka"
                        value={profile.state || ''}
                        onChange={e => setVal('state', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Academic Profile */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-1.5 block">College Name</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. RVCE, Bangalore"
                      value={profile.college || ''}
                      onChange={e => setVal('college', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-1.5 block">University</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. VTU"
                        value={profile.university || ''}
                        onChange={e => setVal('university', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-1.5 block">Degree</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. B.E. / B.Tech"
                        value={profile.degree || ''}
                        onChange={e => setVal('degree', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-1.5 block">Branch</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Computer Science"
                        value={profile.branch || ''}
                        onChange={e => setVal('branch', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-1.5 block">Current Year</label>
                      <select
                        className="input-field"
                        value={profile.currentYear || ''}
                        onChange={e => setVal('currentYear', e.target.value)}
                      >
                        <option value="">Select Year</option>
                        <option value="1st">1st Year</option>
                        <option value="2nd">2nd Year</option>
                        <option value="3rd">3rd Year</option>
                        <option value="4th">4th Year</option>
                        <option value="Passed Out">Graduated</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-slate-300 mb-1.5 block">CGPA (Out of 10)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        className="input-field"
                        placeholder="8.5"
                        value={profile.cgpa || ''}
                        onChange={e => setVal('cgpa', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-1.5 block">Backlogs</label>
                      <input
                        type="number"
                        min="0"
                        className="input-field"
                        placeholder="0"
                        value={profile.activeBacklogs ?? 0}
                        onChange={e => setVal('activeBacklogs', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Career Preferences */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-1.5 block">Preferred Job Role</label>
                    <select
                      className="input-field"
                      value={profile.preferredRole || ''}
                      onChange={e => setVal('preferredRole', e.target.value)}
                    >
                      <option value="">Select Role</option>
                      {ROLES_LIST.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-1.5 block">LinkedIn Profile</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="linkedin.com/in/username"
                      value={profile.linkedin || ''}
                      onChange={e => setVal('linkedin', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-1.5 block">GitHub Profile</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="github.com/username"
                        value={profile.github || ''}
                        onChange={e => setVal('github', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-1.5 block">Portfolio Website</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="portfolio.com"
                        value={profile.portfolio || ''}
                        onChange={e => setVal('portfolio', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Skills & Certifications */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Choose Core Skills</label>
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1 border border-white/5 rounded-xl bg-black/20">
                      {SKILLS_LIST.map(skill => {
                        const hasSkill = (profile.skills || []).includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                              hasSkill ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' :
                              'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                            }`}
                          >
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-1.5 block">Certifications (comma separated)</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="AWS Cloud Practitioner, Google UX Certificate"
                      onChange={e => setVal('certifications', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Test Score Card */}
              {step === 4 && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500">Provide self-evaluation scores to set your dashboard baseline.</p>
                  {([
                    { label: 'Aptitude Test Score (%)', key: 'aptitudeScore' },
                    { label: 'Coding Test Score (%)', key: 'codingScore' },
                    { label: 'Communication Score (%)', key: 'communicationScore' },
                    { label: 'Mock Interview Score (%)', key: 'mockInterviewScore' },
                  ] as const).map(item => (
                    <div key={item.key}>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-300">{item.label}</label>
                        <span className="text-xs font-bold text-indigo-400">{profile[item.key]}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        className="w-full accent-indigo-500"
                        value={profile[item.key] || 0}
                        onChange={e => setVal(item.key, parseInt(e.target.value))}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Step 6: Resume Upload */}
              {step === 5 && (
                <div className="space-y-6">
                  <p className="text-xs text-slate-500">Simulate resume parsing. Upload any PDF or text file to analyze your resume profile completeness.</p>
                  <div className="border-2 border-dashed border-white/10 hover:border-indigo-500/50 rounded-2xl p-8 text-center transition-all bg-black/20 relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeSimulate}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                        <FileUp size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-200">
                          {profile.resumeUploaded ? profile.resumeName : 'Click or drag your resume here'}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">PDF, DOCX up to 5MB</p>
                      </div>
                    </div>
                  </div>

                  {profile.resumeUploaded && (
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-white">Resume simulated successfully!</p>
                        <p className="text-[10px] text-slate-400">Your profile completeness and ATS score have been updated.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-between gap-4 mt-8 border-t border-white/5 pt-6">
            <button
              onClick={handlePrev}
              disabled={step === 0}
              className="btn-ghost flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="btn-primary flex items-center gap-2 justify-center"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : step === steps.length - 1 ? (
                <>Finish Onboarding <CheckCircle2 size={14} /></>
              ) : (
                <>Continue <ArrowRight size={14} /></>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-[10px] text-slate-600 z-10">
        Placement Tracker Pro · Designed for Dhanush Gowda G (dh4nushgowd4@gmail.com)
      </div>
    </div>
  );
}
