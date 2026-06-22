'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Eye, EyeOff, CheckCircle2, ArrowRight, ArrowLeft, User, GraduationCap, Briefcase, Star } from 'lucide-react';
import Link from 'next/link';
import { saveUserProfile, getDefaultProfile } from '@/lib/storage';
import { UserProfile } from '@/types';

const SKILLS_LIST = ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'SQL', 'Machine Learning', 'Data Structures', 'System Design', 'AWS', 'Docker', 'Git', 'TypeScript', 'Go', 'Rust', 'Kubernetes', 'GraphQL', 'MongoDB', 'PostgreSQL'];

const steps = [
  { label: 'Personal', icon: User },
  { label: 'Academic', icon: GraduationCap },
  { label: 'Career', icon: Briefcase },
  { label: 'Readiness', icon: Star },
];

function PasswordStrength({ password }: { password: string }) {
  const checks = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)];
  const score = checks.filter(Boolean).length;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map(i => <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i < score ? colors[score] : 'bg-white/10'}`} />)}
      </div>
      {password && <p className={`text-xs ${score < 2 ? 'text-red-400' : score < 4 ? 'text-amber-400' : 'text-emerald-400'}`}>{labels[score]}</p>}
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<Partial<UserProfile> & { password?: string; confirmPassword?: string }>({
    fullName: '', email: '', phone: '', city: '', state: '',
    college: '', university: '', degree: '', branch: '', currentYear: '', cgpa: '', graduationYear: '', activeBacklogs: 0,
    linkedin: '', github: '', portfolio: '', preferredRole: '',
    skills: [], certifications: [],
    aptitudeScore: 0, codingScore: 0, communicationScore: 0, mockInterviewScore: 0,
    password: '', confirmPassword: '',
  });

  const completion = Math.round(((step + 1) / steps.length) * 100);
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const toggleSkill = (s: string) => set('skills', form.skills?.includes(s) ? form.skills.filter(x => x !== s) : [...(form.skills ?? []), s]);

  const handleSubmit = () => {
    const profile: UserProfile = {
      ...getDefaultProfile(),
      ...form,
      skills: form.skills ?? [],
      certifications: form.certifications ?? [],
      onboardingComplete: false,
      updatedAt: new Date().toISOString(),
    };
    saveUserProfile(profile);
    localStorage.setItem('ptp_logged_in', 'true');
    setSuccess(true);
    setTimeout(() => router.push('/dashboard'), 1800);
  };

  if (success) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a14]">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={40} className="text-emerald-400" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Account Created!</h2>
        <p className="text-slate-400">Redirecting to your dashboard...</p>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a14]">
      <div className="mesh-bg" />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg relative z-10">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-black text-lg text-white">Placement <span className="gradient-text">Tracker Pro</span></span>
          </Link>
          <h1 className="text-2xl font-black text-white mb-1">Create your account</h1>
          <p className="text-slate-400 text-sm">Step {step + 1} of {steps.length}: {steps[step].label}</p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i <= step ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-600'}`}>
                    {i < step ? <CheckCircle2 size={14} /> : <Icon size={14} />}
                  </div>
                  {i < steps.length - 1 && <div className={`h-px w-12 sm:w-20 transition-all ${i < step ? 'bg-indigo-500' : 'bg-white/5'}`} />}
                </div>
              );
            })}
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" animate={{ width: `${completion}%` }} transition={{ duration: 0.5 }} />
          </div>
          <p className="text-right text-xs text-slate-500 mt-1">{completion}% complete</p>
        </div>

        <div className="card p-7">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>

              {/* Step 0: Personal */}
              {step === 0 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-white mb-4">Personal Information</h3>
                  {[
                    { label: 'Full Name', key: 'fullName', type: 'text', placeholder: 'Dhanush Gowda G' },
                    { label: 'Email Address', key: 'email', type: 'email', placeholder: 'you@email.com' },
                    { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '+91 9876543210' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-sm font-medium text-slate-300 mb-1.5 block">{f.label}</label>
                      <input type={f.type} className="input-field" placeholder={f.placeholder}
                        value={(form as Record<string, string>)[f.key] ?? ''} onChange={e => set(f.key, e.target.value)} />
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">City</label>
                      <input type="text" className="input-field" placeholder="Bangalore" value={form.city ?? ''} onChange={e => set('city', e.target.value)} /></div>
                    <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">State</label>
                      <input type="text" className="input-field" placeholder="Karnataka" value={form.state ?? ''} onChange={e => set('state', e.target.value)} /></div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-1.5 block">Password</label>
                    <div className="relative">
                      <input type={showPw ? 'text' : 'password'} className="input-field pr-10" placeholder="Min 8 characters"
                        value={form.password ?? ''} onChange={e => set('password', e.target.value)} />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                        {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    <PasswordStrength password={form.password ?? ''} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-1.5 block">Confirm Password</label>
                    <input type="password" className="input-field" placeholder="Re-enter password"
                      value={form.confirmPassword ?? ''} onChange={e => set('confirmPassword', e.target.value)} />
                    {form.confirmPassword && form.password !== form.confirmPassword && <p className="text-xs text-red-400 mt-1">Passwords don&apos;t match</p>}
                  </div>
                </div>
              )}

              {/* Step 1: Academic */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-white mb-4">Academic Information</h3>
                  {[
                    { label: 'College Name', key: 'college', placeholder: 'RVCE, Bangalore' },
                    { label: 'University', key: 'university', placeholder: 'VTU' },
                    { label: 'Degree', key: 'degree', placeholder: 'B.E. / B.Tech' },
                    { label: 'Branch', key: 'branch', placeholder: 'Computer Science' },
                  ].map(f => (
                    <div key={f.key}><label className="text-sm font-medium text-slate-300 mb-1.5 block">{f.label}</label>
                      <input type="text" className="input-field" placeholder={f.placeholder}
                        value={(form as Record<string, string>)[f.key] ?? ''} onChange={e => set(f.key, e.target.value)} /></div>
                  ))}
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">Current Year</label>
                      <select className="input-field" value={form.currentYear ?? ''} onChange={e => set('currentYear', e.target.value)}>
                        <option value="">Select</option>
                        {['1st', '2nd', '3rd', '4th', 'Passed Out'].map(y => <option key={y} value={y}>{y}</option>)}
                      </select></div>
                    <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">Graduation Year</label>
                      <input type="text" className="input-field" placeholder="2025" value={form.graduationYear ?? ''} onChange={e => set('graduationYear', e.target.value)} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">CGPA</label>
                      <input type="number" step="0.01" min="0" max="10" className="input-field" placeholder="8.5" value={form.cgpa ?? ''} onChange={e => set('cgpa', e.target.value)} /></div>
                    <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">Active Backlogs</label>
                      <input type="number" min="0" className="input-field" placeholder="0" value={form.activeBacklogs ?? ''} onChange={e => set('activeBacklogs', parseInt(e.target.value) || 0)} /></div>
                  </div>
                </div>
              )}

              {/* Step 2: Career */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-white mb-4">Career Information</h3>
                  {[
                    { label: 'LinkedIn Profile', key: 'linkedin', placeholder: 'linkedin.com/in/yourname' },
                    { label: 'GitHub Profile', key: 'github', placeholder: 'github.com/yourusername' },
                    { label: 'Portfolio Website', key: 'portfolio', placeholder: 'yourportfolio.com' },
                    { label: 'Preferred Job Role', key: 'preferredRole', placeholder: 'Software Engineer' },
                  ].map(f => (
                    <div key={f.key}><label className="text-sm font-medium text-slate-300 mb-1.5 block">{f.label}</label>
                      <input type="text" className="input-field" placeholder={f.placeholder}
                        value={(form as Record<string, string>)[f.key] ?? ''} onChange={e => set(f.key, e.target.value)} /></div>
                  ))}
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Skills (select all that apply)</label>
                    <div className="flex flex-wrap gap-2">
                      {SKILLS_LIST.map(s => (
                        <button key={s} type="button" onClick={() => toggleSkill(s)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${form.skills?.includes(s) ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{form.skills?.length ?? 0} selected</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-1.5 block">Certifications (comma-separated)</label>
                    <input type="text" className="input-field" placeholder="AWS Cloud, Google Analytics..."
                      onChange={e => set('certifications', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
                  </div>
                </div>
              )}

              {/* Step 3: Readiness */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-white mb-4">Placement Readiness</h3>
                  <p className="text-sm text-slate-400 mb-4">Rate yourself out of 100 on each area. This helps calculate your Readiness Score.</p>
                  {[
                    { label: 'Aptitude Score', key: 'aptitudeScore' },
                    { label: 'Coding Score', key: 'codingScore' },
                    { label: 'Communication Score', key: 'communicationScore' },
                    { label: 'Mock Interview Score', key: 'mockInterviewScore' },
                  ].map(f => (
                    <div key={f.key}>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-sm font-medium text-slate-300">{f.label}</label>
                        <span className="text-sm font-bold text-indigo-400">{(form as Record<string, number>)[f.key] ?? 0}/100</span>
                      </div>
                      <input type="range" min="0" max="100" className="w-full accent-indigo-500"
                        value={(form as Record<string, number>)[f.key] ?? 0}
                        onChange={e => set(f.key, parseInt(e.target.value))} />
                    </div>
                  ))}
                  <label className="flex items-start gap-3 cursor-pointer mt-4">
                    <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="accent-indigo-500 mt-0.5" />
                    <span className="text-sm text-slate-400">I agree to the <span className="text-indigo-400">Terms of Service</span> and <span className="text-indigo-400">Privacy Policy</span></span>
                  </label>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Nav buttons */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} className="btn-ghost flex items-center gap-2 px-5">
                <ArrowLeft size={15} />Back
              </button>
            )}
            {step < steps.length - 1 ? (
              <button onClick={() => setStep(s => s + 1)} className="btn-primary flex-1 flex items-center justify-center gap-2">
                Continue <ArrowRight size={15} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={!agreed} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
                <CheckCircle2 size={15} />Create Account
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
