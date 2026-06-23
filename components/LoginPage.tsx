'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Zap, Eye, EyeOff, Mail, Lock, Chrome, Github, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getUserProfile, getDefaultProfile, saveUserProfile } from '@/lib/storage';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('dh4nushgowd4@gmail.com');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));

    // Demo: any password works, ensure profile exists
    let profile = getUserProfile();
    if (!profile) {
      profile = getDefaultProfile();
      profile.email = email;
      profile.fullName = email === 'dh4nushgowd4@gmail.com' ? 'Dhanush Gowda G' : email.split('@')[0];
      saveUserProfile(profile);
    }
    if (remember) localStorage.setItem('ptp_remember', 'true');
    localStorage.setItem('ptp_logged_in', 'true');
    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a14]">
      <div className="mesh-bg" />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-black text-xl text-white">Placement <span className="gradient-text">Tracker Pro</span></span>
          </Link>
          <h1 className="text-2xl font-black text-white mb-1">Welcome back</h1>
          <p className="text-slate-400 text-sm">Sign in to your account to continue</p>
        </div>

        <div className="card p-8">
          {/* Social */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="btn-ghost flex items-center justify-center gap-2 text-sm py-2.5">
              <Chrome size={16} />Google
            </button>
            <button className="btn-ghost flex items-center justify-center gap-2 text-sm py-2.5">
              <Github size={16} />GitHub
            </button>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-xs text-slate-600">or continue with email</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">{error}</div>}

            <div>
              <label className="text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2"><Mail size={13} className="text-indigo-400" />Email</label>
              <input type="email" className="input-field" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2"><Lock size={13} className="text-indigo-400" />Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} className="input-field pr-10" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="accent-indigo-500" />
                <span className="text-sm text-slate-400">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60 mt-2">
              {loading ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <><ArrowRight size={16} />Sign In</>}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Create one free</Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-700 mt-4">
          Demo mode: enter any password to sign in
        </p>
      </motion.div>
    </div>
  );
}
