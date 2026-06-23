'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, ExternalLink, CheckCircle2, TrendingUp, Users, Award, BarChart2,
  ChevronRight, Star, Moon, Sun, ArrowRight, Briefcase, Bell,
  Shield, Sparkles, Target, Play, Check, Menu, X, ArrowUpRight,
  FileText, Mic, Brain, Mail, Compass
} from 'lucide-react';
import Link from 'next/link';

// Type declarations
interface FeatureCardProps {
  icon: any;
  title: string;
  desc: string;
  dark: boolean;
}

interface StatProps {
  value: string;
  label: string;
}

interface TestimonialProps {
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
}

// Data definition
const featureList = [
  {
    icon: Briefcase,
    title: 'Application Tracker',
    desc: 'Organize applications across multiple states—from Interested and Applied to Technical rounds and Final Offers.'
  },
  {
    icon: FileText,
    title: 'AI Resume ATS Analyzer',
    desc: 'Audit resume formats, score keyword matching against target job profiles, and identify critical optimization opportunities.'
  },
  {
    icon: Mic,
    title: 'AI Mock Interviews',
    desc: 'Conduct realistic, role-tailored audio screenings with real-time feedback on filler words, speaking speed, and confidence.'
  },
  {
    icon: Target,
    title: 'Placement Readiness Engine',
    desc: 'Quantify placement preparedness with score cards summarizing technical skill levels, soft skills, and academic profile logs.'
  },
  {
    icon: TrendingUp,
    title: 'Placement Probability Predictor',
    desc: 'Leverage predictive analytical models to estimate placement likelihood, target readiness level, and confidence indicators.'
  },
  {
    icon: Compass,
    title: 'Smart Job Import',
    desc: 'Instantly parse external job URLs from LinkedIn or career pages, automatically scraping company metadata and required skills.'
  }
];

const clientLogos = [
  { name: 'Google', icon: 'Google' },
  { name: 'Microsoft', icon: 'Microsoft' },
  { name: 'Amazon', icon: 'Amazon' },
  { name: 'Adobe', icon: 'Adobe' },
  { name: 'Accenture', icon: 'Accenture' },
  { name: 'Infosys', icon: 'Infosys' },
  { name: 'TCS', icon: 'TCS' },
  { name: 'Wipro', icon: 'Wipro' }
];

const testimonialsList: TestimonialProps[] = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer',
    company: 'Google',
    text: 'Placement Tracker Pro completely streamlined my interview prep. The ATS optimizer helped me tweak my CV keywords, boosting response rates from top tech companies.',
    rating: 5
  },
  {
    name: 'Rahul Mehta',
    role: 'Associate Analyst',
    company: 'Microsoft',
    text: 'The mock interview simulator felt extremely realistic. Having Marcus evaluate my system design explanations under pressure was the final push I needed to get selected.',
    rating: 5
  },
  {
    name: 'Sneha Patel',
    role: 'Product Manager',
    company: 'Stripe',
    text: 'A highly clean, minimal, and serious career product. The interface makes tracking dozens of applications painless, giving me exact visibility into my offers pipeline.',
    rating: 5
  }
];

// Helper components
function AnimatedCounter({ value, duration = 1200 }: { value: string; duration?: number }) {
  const numericPart = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
  const suffix = value.replace(/[0-9,]/g, '');
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * numericPart));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [numericPart, duration]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function LandingPage() {
  const [dark, setDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeShowcase, setActiveShowcase] = useState<'tracker' | 'ats' | 'interview' | 'prediction'>('tracker');
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const toggleTheme = () => {
    setDark(!dark);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 selection:bg-purple-500/20 ${
      dark ? 'bg-[#030303] text-zinc-100 dark' : 'bg-[#fbfbfd] text-zinc-900'
    }`}>
      {/* Mesh Background Accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.15] dark:opacity-[0.08] transition-colors duration-200 ${
          dark ? 'bg-purple-600' : 'bg-purple-505'
        }`} />
        <div className={`absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.1] dark:opacity-[0.05] transition-colors duration-200 ${
          dark ? 'bg-indigo-600' : 'bg-indigo-400'
        }`} />
      </div>

      {/* Sticky Blur Navbar */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md transition-colors duration-200 border-b ${
        dark ? 'bg-[#030303]/80 border-zinc-900/80' : 'bg-[#fbfbfd]/80 border-zinc-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/10">
              <Zap size={15} className="text-white" />
            </div>
            <span className="font-extrabold text-sm tracking-tight">
              Placement <span className="text-purple-500">Tracker Pro</span>
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className={`text-xs font-semibold hover:text-purple-500 transition-colors ${
              dark ? 'text-zinc-400' : 'text-zinc-550'
            }`}>Features</a>
            <a href="#showcase" className={`text-xs font-semibold hover:text-purple-500 transition-colors ${
              dark ? 'text-zinc-400' : 'text-zinc-550'
            }`}>AI Interview</a>
            <a href="#showcase" className={`text-xs font-semibold hover:text-purple-500 transition-colors ${
              dark ? 'text-zinc-400' : 'text-zinc-550'
            }`}>Resume ATS</a>
            <a href="#showcase" className={`text-xs font-semibold hover:text-purple-500 transition-colors ${
              dark ? 'text-zinc-400' : 'text-zinc-550'
            }`}>Analytics</a>
            <a href="#pricing" className={`text-xs font-semibold hover:text-purple-500 transition-colors ${
              dark ? 'text-zinc-400' : 'text-zinc-550'
            }`}>Pricing</a>
            <a href="#about" className={`text-xs font-semibold hover:text-purple-500 transition-colors ${
              dark ? 'text-zinc-400' : 'text-zinc-550'
            }`}>About</a>
          </div>

          {/* Navbar Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Developer Info */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold ${
              dark 
                ? 'bg-zinc-950/40 border-zinc-800 text-zinc-300' 
                : 'bg-zinc-50 border-zinc-200 text-zinc-650'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              <span>Dev: Dhanush Gowda G</span>
              <span className="opacity-40">|</span>
              <a href="mailto:dh4nushgowd4@gmail.com" className="hover:underline text-purple-600 dark:text-purple-400">dh4nushgowd4@gmail.com</a>
            </div>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                dark ? 'text-zinc-400 hover:text-white hover:bg-zinc-900' : 'text-zinc-505 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
              aria-label="Toggle Theme"
            >
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <Link
              href="/login"
              className={`text-xs font-semibold px-4 py-2 rounded-lg transition-colors border ${
                dark 
                  ? 'text-zinc-300 border-zinc-800 hover:text-white hover:bg-zinc-900' 
                  : 'text-zinc-650 border-zinc-200 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-xs font-bold px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-md shadow-purple-500/10 hover:shadow-purple-500/20 active:scale-[0.98]"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                dark ? 'text-zinc-400 hover:bg-zinc-900' : 'text-zinc-505 hover:bg-zinc-100'
              }`}
            >
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${
                dark ? 'text-zinc-400 hover:bg-zinc-900' : 'text-zinc-505 hover:bg-zinc-100'
              }`}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={`md:hidden overflow-hidden border-t ${
                dark ? 'bg-[#030303]/95 border-zinc-900' : 'bg-white/95 border-zinc-200'
              }`}
            >
              <div className="flex flex-col gap-4 px-6 py-5">
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-xs font-semibold ${dark ? 'text-zinc-400 hover:text-white' : 'text-zinc-505 hover:text-zinc-900'}`}
                >
                  Features
                </a>
                <a
                  href="#showcase"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-xs font-semibold ${dark ? 'text-zinc-400 hover:text-white' : 'text-zinc-505 hover:text-zinc-900'}`}
                >
                  AI Interview
                </a>
                <a
                  href="#showcase"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-xs font-semibold ${dark ? 'text-zinc-400 hover:text-white' : 'text-zinc-505 hover:text-zinc-900'}`}
                >
                  Resume ATS
                </a>
                <a
                  href="#showcase"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-xs font-semibold ${dark ? 'text-zinc-400 hover:text-white' : 'text-zinc-505 hover:text-zinc-900'}`}
                >
                  Analytics
                </a>
                <a
                  href="#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-xs font-semibold ${dark ? 'text-zinc-400 hover:text-white' : 'text-zinc-505 hover:text-zinc-900'}`}
                >
                  Pricing
                </a>
                <a
                  href="#about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-xs font-semibold ${dark ? 'text-zinc-400 hover:text-white' : 'text-zinc-505 hover:text-zinc-900'}`}
                >
                  About
                </a>

                <div className="h-px w-full my-2 bg-zinc-800/30" />

                {/* Mobile Developer Info */}
                <div className={`w-full flex flex-col gap-1 p-3 rounded-xl border text-[10px] font-bold ${
                  dark 
                    ? 'bg-zinc-950/40 border-zinc-900 text-zinc-300' 
                    : 'bg-zinc-50 border-zinc-200 text-zinc-650'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                    <span>Developer: Dhanush Gowda G</span>
                  </div>
                  <a href="mailto:dh4nushgowd4@gmail.com" className="hover:underline text-purple-650 dark:text-purple-400 mt-0.5">
                    Email: dh4nushgowd4@gmail.com
                  </a>
                </div>

                <div className="flex items-center gap-4">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex-1 text-center text-xs font-semibold px-4 py-2.5 rounded-lg border ${
                      dark 
                        ? 'text-zinc-300 border-zinc-800 hover:bg-zinc-900' 
                        : 'text-zinc-650 border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center text-xs font-bold px-4 py-2.5 rounded-lg bg-purple-600 text-white"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-20 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-5 text-center lg:text-left space-y-6">
            {/* Small badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border transition-all duration-305 bg-purple-500/10 border-purple-500/20 text-purple-400 dark:text-purple-400">
              <Sparkles size={11} className="animate-pulse" />
              AI Powered Career Success Platform
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-zinc-900 dark:text-white">
              Track Applications.<br />
              Ace Interviews.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">
                Land Your Dream Job.
              </span>
            </h1>

            {/* Subheading */}
            <p className={`text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0 ${
              dark ? 'text-zinc-400' : 'text-zinc-550'
            }`}>
              Manage placements, optimize resumes, prepare for interviews, and improve your placement readiness through AI-powered insights.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto text-xs font-bold px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 active:scale-[0.98]"
              >
                <span>Get Started Free</span>
                <ArrowRight size={13} />
              </Link>
              <a
                href="#showcase"
                className={`w-full sm:w-auto text-xs font-semibold px-6 py-3.5 rounded-xl border flex items-center justify-center gap-2 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-900/50 ${
                  dark ? 'text-zinc-300 border-zinc-800' : 'text-zinc-650 border-zinc-200'
                }`}
              >
                <Play size={11} className="fill-current" />
                <span>Watch Demo</span>
              </a>
            </div>

            {/* Checkmark Features Checklist */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 max-w-xs mx-auto lg:mx-0 pt-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider text-left">
              <div className="flex items-center gap-1.5">
                <Check size={12} className="text-emerald-500 shrink-0" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check size={12} className="text-emerald-500 shrink-0" />
                <span>AI Powered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check size={12} className="text-emerald-500 shrink-0" />
                <span>No Card Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check size={12} className="text-emerald-500 shrink-0" />
                <span>Save 100+ Hours</span>
              </div>
            </div>
          </div>

          {/* Hero Right Dashboard Mockup */}
          <div className="lg:col-span-7 w-full">
            <div className={`relative w-full rounded-2xl border bg-white dark:bg-[#07070a] p-4 shadow-xl backdrop-blur-md overflow-hidden ${
              dark ? 'border-zinc-900/80 shadow-black/80' : 'border-zinc-200/50 shadow-zinc-200/50'
            }`}>
              {/* Window buttons */}
              <div className="flex items-center gap-1.5 pb-3 border-b mb-4 justify-between transition-colors border-zinc-100 dark:border-zinc-900">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-505 font-mono ml-3 truncate hidden sm:inline">placement-tracker-pro.com/dashboard</span>
                </div>
                <div className="w-3.5 h-3.5 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-[7px] font-bold text-zinc-455 dark:text-zinc-505">?</div>
              </div>
              
              <div className="flex gap-4">
                {/* Mock Sidebar */}
                <div className="w-1/4 hidden md:flex flex-col gap-2.5 border-r pr-3 transition-colors border-zinc-100 dark:border-zinc-900">
                  <div className="w-full h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center px-2 gap-2 text-purple-500">
                    <Zap size={11} />
                    <div className="w-14 h-1.5 bg-purple-505/50 rounded" />
                  </div>
                  <div className="w-full h-8 rounded-lg bg-transparent flex items-center px-2 gap-2 opacity-50">
                    <Briefcase size={11} className="text-zinc-400" />
                    <div className="w-10 h-1.5 bg-zinc-400 rounded" />
                  </div>
                  <div className="w-full h-8 rounded-lg bg-transparent flex items-center px-2 gap-2 opacity-50">
                    <FileText size={11} className="text-zinc-400" />
                    <div className="w-12 h-1.5 bg-zinc-400 rounded" />
                  </div>
                  <div className="w-full h-8 rounded-lg bg-transparent flex items-center px-2 gap-2 opacity-50">
                    <Target size={11} className="text-zinc-400" />
                    <div className="w-14 h-1.5 bg-zinc-400 rounded" />
                  </div>
                </div>
                
                {/* Mock Main content */}
                <div className="flex-1 space-y-4">
                  {/* Mock Greeting */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="w-16 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded" />
                      <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Hi Priya, Welcome Back</div>
                    </div>
                    <div className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-[8px] text-emerald-500 font-extrabold tracking-wider uppercase">Active Session</div>
                  </div>
                  
                  {/* Mock Grid Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {/* Gauge 1 */}
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/40 rounded-xl space-y-1.5 flex flex-col justify-between">
                      <span className="text-[9px] text-zinc-400 font-medium">Placement Chance</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-zinc-800 dark:text-white">84%</span>
                        <span className="text-[8px] text-emerald-500 font-extrabold bg-emerald-500/10 px-1 rounded">+4%</span>
                      </div>
                      <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '84%' }} />
                      </div>
                    </div>
                    {/* Gauge 2 */}
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/40 rounded-xl space-y-1.5 flex flex-col justify-between">
                      <span className="text-[9px] text-zinc-400 font-medium">ATS Match Score</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-zinc-800 dark:text-white">88/100</span>
                        <span className="text-[8px] text-purple-500 font-extrabold bg-purple-500/10 px-1 rounded">Optimal</span>
                      </div>
                      <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-505 rounded-full" style={{ width: '88%' }} />
                      </div>
                    </div>
                    {/* Gauge 3 */}
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/40 rounded-xl space-y-1.5 flex flex-col justify-between">
                      <span className="text-[9px] text-zinc-400 font-medium">Readiness Level</span>
                      <div className="text-[9px] font-extrabold text-indigo-500 tracking-tight truncate">Industry Ready</div>
                      <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-505 rounded-full" style={{ width: '92%' }} />
                      </div>
                    </div>
                    {/* Gauge 4 */}
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/40 rounded-xl space-y-1.5 flex flex-col justify-between">
                      <span className="text-[9px] text-zinc-400 font-medium">Tracked Apps</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-zinc-800 dark:text-white">24</span>
                        <span className="text-[8px] text-zinc-550 bg-zinc-100 dark:bg-zinc-800 px-1 rounded font-bold">Active</span>
                      </div>
                      <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1 rounded-full overflow-hidden">
                        <div className="h-full bg-zinc-400 rounded-full" style={{ width: '60%' }} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Mock Table Pipeline */}
                  <div className="border border-zinc-100 dark:border-zinc-800/40 rounded-xl overflow-hidden">
                    <div className="bg-zinc-50 dark:bg-zinc-900/20 px-3 py-1.5 border-b border-zinc-100 dark:border-zinc-800/40 flex justify-between items-center text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                      <span>Placements Feed</span>
                      <span className="text-[8px] text-zinc-550 normal-case font-normal">Real-time mock logs</span>
                    </div>
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800/40">
                      <div className="px-3 py-2 flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">Google</span>
                          <span className="text-zinc-400 font-mono text-[8px]">SDE-1</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[8px] font-bold">Interviewing</span>
                      </div>
                      <div className="px-3 py-2 flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">Stripe</span>
                          <span className="text-zinc-400 font-mono text-[8px]">Frontend Engineer</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-[8px] font-bold">Technical Round</span>
                      </div>
                      <div className="px-3 py-2 flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">Microsoft</span>
                          <span className="text-zinc-400 font-mono text-[8px]">Cloud Specialist</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[8px] font-bold">Offer Received</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Partners */}
      <section className={`border-y py-10 transition-colors duration-200 ${
        dark ? 'border-zinc-900/80 bg-zinc-950/20' : 'border-zinc-200/50 bg-zinc-50/50'
      }`}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-6">
            Trusted by students preparing for placements
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 sm:gap-8 items-center justify-items-center opacity-60">
            {clientLogos.map((logo) => (
              <span
                key={logo.name}
                className={`text-sm sm:text-base font-extrabold tracking-tight transition-all duration-300 select-none hover:scale-105 hover:opacity-100 ${
                  dark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-900'
                }`}
              >
                {logo.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 md:py-28 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
            Everything you need to land the job
          </h2>
          <p className={`text-sm ${dark ? 'text-zinc-400' : 'text-zinc-550'}`}>
            6 powerful modules working together to build a serious career success dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className={`group p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                  dark
                    ? 'bg-[#08080c]/50 border-zinc-900/60 hover:border-purple-505/30'
                    : 'bg-white border-zinc-200/60 hover:border-purple-505/30 hover:shadow-lg hover:shadow-zinc-100'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
                  dark ? 'bg-zinc-900 group-hover:bg-purple-950/30 text-zinc-405 group-hover:text-purple-400' : 'bg-zinc-100 group-hover:bg-purple-50 text-zinc-505 group-hover:text-purple-600'
                }`}>
                  <Icon size={16} />
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-2">{f.title}</h3>
                <p className={`text-xs leading-relaxed ${dark ? 'text-zinc-400' : 'text-zinc-550'}`}>
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Product Showcase Tabbed browser section */}
      <section id="showcase" className={`py-20 md:py-28 border-y transition-colors duration-200 ${
        dark ? 'bg-[#07070a]/30 border-zinc-900/80' : 'bg-zinc-50/30 border-zinc-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
              Experience the platform live
            </h2>
            <p className={`text-sm ${dark ? 'text-zinc-400' : 'text-zinc-555'}`}>
              Browse direct product snapshots displaying simulated workflows built into Placement Tracker Pro.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {[
              { id: 'tracker', label: 'Application Dashboard' },
              { id: 'ats', label: 'Resume ATS Optimizer' },
              { id: 'interview', label: 'AI Mock Interview' },
              { id: 'prediction', label: 'Placement Predictor' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveShowcase(tab.id as any)}
                className={`text-xs font-semibold px-4 py-2.5 rounded-xl border transition-all ${
                  activeShowcase === tab.id
                    ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-505/10'
                    : dark 
                    ? 'text-zinc-400 border-zinc-900 bg-zinc-955/50 hover:text-white hover:bg-zinc-900' 
                    : 'text-zinc-650 border-zinc-200 bg-white hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Browser frame preview mockup container */}
          <div className="max-w-4xl mx-auto">
            <div className={`relative w-full rounded-2xl border p-5 shadow-2xl backdrop-blur-md overflow-hidden min-h-[350px] transition-colors duration-200 ${
              dark ? 'bg-[#050508] border-zinc-900/80 shadow-black/60' : 'bg-white border-zinc-200/60 shadow-zinc-200/50'
            }`}>
              {/* Browser control header */}
              <div className="flex items-center gap-1.5 pb-4 border-b mb-6 transition-colors border-zinc-100 dark:border-zinc-900">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] text-zinc-400 dark:text-zinc-505 font-mono ml-4 truncate">
                  placement-tracker-pro.com/dashboard/{activeShowcase}
                </span>
              </div>

              {/* Browser Dynamic Showcase content */}
              <div className="animate-fade-in duration-300">
                {activeShowcase === 'tracker' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-205">Placements Pipeline Kanban</h4>
                      <span className="text-[9px] text-zinc-550 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800 px-2 py-0.5 rounded">Interactive Workflow</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {/* Column Interested */}
                      <div className="p-3 bg-zinc-50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-850 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                          <span>Interested</span>
                          <span className="bg-zinc-205 dark:bg-zinc-850 px-1 rounded text-zinc-500">2</span>
                        </div>
                        <div className="p-2 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-150 dark:border-zinc-909 space-y-1">
                          <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-202 block">Netflix</span>
                          <span className="text-[8px] text-zinc-500">SDE-II · Remote</span>
                        </div>
                        <div className="p-2 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-155 dark:border-zinc-909 space-y-1">
                          <span className="text-[10px] font-bold text-zinc-805 dark:text-zinc-202 block">Tesla</span>
                          <span className="text-[8px] text-zinc-550">Robotics Dev · Texas</span>
                        </div>
                      </div>
                      {/* Column Applied */}
                      <div className="p-3 bg-zinc-50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-855 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                          <span>Applied</span>
                          <span className="bg-zinc-205 dark:bg-zinc-855 px-1 rounded text-zinc-550">1</span>
                        </div>
                        <div className="p-2 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-150 dark:border-zinc-909 space-y-1">
                          <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-202 block">Apple</span>
                          <span className="text-[8px] text-zinc-550">iOS Engineer · Cupertino</span>
                        </div>
                      </div>
                      {/* Column Interviewing */}
                      <div className="p-3 bg-zinc-50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-860 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                          <span>Interviewing</span>
                          <span className="bg-indigo-505/15 px-1.5 py-0.5 rounded text-indigo-500 font-extrabold">2</span>
                        </div>
                        <div className="p-2 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-150 dark:border-zinc-909 space-y-1 relative overflow-hidden">
                          <div className="absolute right-1 top-1 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-202 block">Google</span>
                          <span className="text-[8px] text-zinc-550">Systems Developer</span>
                        </div>
                        <div className="p-2 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-150 dark:border-zinc-909 space-y-1">
                          <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-202 block">Stripe</span>
                          <span className="text-[8px] text-zinc-550">API Support Eng</span>
                        </div>
                      </div>
                      {/* Column Offer */}
                      <div className="p-3 bg-zinc-50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-865 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                          <span>Offer</span>
                          <span className="bg-emerald-505/15 px-1.5 py-0.5 rounded text-emerald-505 font-extrabold">1</span>
                        </div>
                        <div className="p-2 bg-emerald-505/5 dark:bg-emerald-500/10 rounded-lg border border-emerald-500/20 space-y-1">
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">Microsoft</span>
                          <span className="text-[8px] text-zinc-555">Cloud Solutions</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeShowcase === 'ats' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-4 flex flex-col items-center justify-center p-5 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-850 rounded-xl text-center">
                      <div className="w-20 h-20 rounded-full border-4 border-purple-505 border-t-transparent flex items-center justify-center mb-3">
                        <span className="text-lg font-black text-purple-500">88%</span>
                      </div>
                      <h5 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">ATS Rating: Optimal</h5>
                      <span className="text-[9px] text-zinc-450 mt-1">Ready for SDE Applications</span>
                    </div>
                    <div className="md:col-span-8 space-y-3">
                      <h5 className="text-xs font-bold text-zinc-800 dark:text-zinc-202">ATS Audit Insights</h5>
                      <div className="space-y-2">
                        <div className="p-2.5 bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 rounded-lg flex gap-3 text-[10px]">
                          <span className="text-red-505 font-extrabold font-mono uppercase shrink-0 text-[8px] tracking-wider bg-red-505/10 px-1.5 py-0.5 rounded self-start">Critical</span>
                          <p className="text-zinc-650 dark:text-zinc-400">Missing key tech tags: <strong>Redux</strong>, <strong>Redis</strong>, and <strong>Webpack</strong></p>
                        </div>
                        <div className="p-2.5 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-lg flex gap-3 text-[10px]">
                          <span className="text-amber-500 font-extrabold font-mono uppercase shrink-0 text-[8px] tracking-wider bg-amber-505/10 px-1.5 py-0.5 rounded self-start">Improve</span>
                          <p className="text-zinc-655 dark:text-zinc-400">Action verb count is below baseline threshold. Replace passive descriptions.</p>
                        </div>
                        <div className="p-2.5 bg-emerald-500/5 dark:bg-emerald-505/10 border border-emerald-500/20 rounded-lg flex gap-3 text-[10px]">
                          <span className="text-emerald-500 font-extrabold font-mono uppercase shrink-0 text-[8px] tracking-wider bg-emerald-505/10 px-1.5 py-0.5 rounded self-start">Compliant</span>
                          <p className="text-zinc-660 dark:text-zinc-400">Structural schema, margin parameters, and character layout match target rules.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeShowcase === 'interview' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-7 p-4 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/40 rounded-xl space-y-3 flex flex-col justify-between min-h-[220px]">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[9px] text-zinc-450 font-semibold uppercase tracking-wider">
                          <span>AI Mock Recruiter (Marcus)</span>
                          <span>Round 2 (Technical)</span>
                        </div>
                        <p className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                          "You mentioned state synchronization. How did you optimize query validation rules to prevent server-side data races?"
                        </p>
                      </div>
                      <div className="p-3 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-lg">
                        <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Your Voice Output</span>
                        <p className="text-[10px] text-zinc-800 dark:text-zinc-202">
                          "I configured optimistic mutations on the client and enforced database transactional integrity using Redis lock mechanisms..."
                        </p>
                      </div>
                    </div>
                    <div className="md:col-span-5 space-y-3">
                      <h5 className="text-xs font-bold text-zinc-800 dark:text-zinc-202">Live Mock Insights</h5>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="p-2.5 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/40 rounded-xl">
                          <span className="text-base font-black text-emerald-500 block">142</span>
                          <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider">WPM (Speed)</span>
                        </div>
                        <div className="p-2.5 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/40 rounded-xl">
                          <span className="text-base font-black text-purple-500 block">2</span>
                          <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider">Fillers</span>
                        </div>
                        <div className="p-2.5 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/40 rounded-xl">
                          <span className="text-base font-black text-indigo-505 block">92%</span>
                          <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider">Confidence</span>
                        </div>
                        <div className="p-2.5 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/40 rounded-xl">
                          <span className="text-base font-black text-pink-500 block">STAR</span>
                          <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider">Answer Logic</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeShowcase === 'prediction' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-5 p-4 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/40 rounded-xl flex flex-col justify-center items-center text-center">
                      <div className="relative w-28 h-28 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="6" className="text-zinc-200 dark:text-zinc-800" fill="transparent" />
                          <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="6" className="text-emerald-500" strokeDasharray={263.8} strokeDashoffset={263.8 * (1 - 0.84)} fill="transparent" strokeLinecap="round" />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-2xl font-black text-zinc-800 dark:text-white">84%</span>
                          <span className="text-[7px] text-emerald-500 font-extrabold uppercase">Probability</span>
                        </div>
                      </div>
                      <span className="mt-3 px-2.5 py-0.5 rounded bg-emerald-505/10 border border-emerald-505/20 text-emerald-505 text-[8px] font-extrabold uppercase tracking-wider">Highly Competitive</span>
                    </div>
                    <div className="md:col-span-7 space-y-3">
                      <h5 className="text-xs font-bold text-zinc-800 dark:text-zinc-202">Probability Breakdown Metrics</h5>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-zinc-500">Academic Score Impact (8.9 CGPA)</span>
                            <span className="font-bold text-zinc-850 dark:text-zinc-100">92%</span>
                          </div>
                          <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full">
                            <div className="h-full bg-purple-505 rounded-full" style={{ width: '92%' }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-zinc-500">Skills Matching Index</span>
                            <span className="font-bold text-zinc-850 dark:text-zinc-100">86%</span>
                          </div>
                          <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full">
                            <div className="h-full bg-indigo-505 rounded-full" style={{ width: '86%' }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-zinc-500">Interview Readiness Score</span>
                            <span className="font-bold text-zinc-850 dark:text-zinc-100">79%</span>
                          </div>
                          <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '79%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works timeline Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
            How it works
          </h2>
          <p className={`text-sm ${dark ? 'text-zinc-400' : 'text-zinc-550'}`}>
            Supercharge your placement journey in four simple, highly structured steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {[
            { step: '01', title: 'Create Profile', desc: 'Configure target engineering roles, update academic benchmarks, and sync details.' },
            { step: '02', title: 'Upload Resume', desc: 'Scan files inside the ATS Audit analyzer for missing skills or formatting gaps.' },
            { step: '03', title: 'Track Applications', desc: 'Scrape external platforms or import job openings into the pipeline workflow.' },
            { step: '04', title: 'Get AI Insights', desc: 'Launch mock assessments, check readiness probabilities, and follow weekly plans.' }
          ].map((item, idx) => (
            <div key={item.step} className="space-y-4 relative group">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-black text-purple-500/20 group-hover:text-purple-500 transition-colors">
                  {item.step}
                </span>
                <div className="h-px bg-zinc-800/30 flex-1 hidden lg:block group-last:hidden" />
              </div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{item.title}</h4>
              <p className={`text-xs leading-relaxed ${dark ? 'text-zinc-400' : 'text-zinc-550'}`}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Features Highlight */}
      <section className={`py-20 md:py-28 border-y transition-colors duration-200 ${
        dark ? 'bg-[#07070a]/20 border-zinc-900/80' : 'bg-zinc-50/20 border-zinc-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
              AI Powered Capabilities
            </h2>
            <p className={`text-sm ${dark ? 'text-zinc-400' : 'text-zinc-550'}`}>
              Deep analytics and generative models designed specifically to help you succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { title: 'Mock Interviewer', desc: 'Interactive audio simulator with real-time speech audits.', icon: Mic },
              { title: 'Resume Analysis', desc: 'Score cv matching indices based on target job postings.', icon: FileText },
              { title: 'Skill Gap Detection', desc: 'Contrast current skills against role baselines and map paths.', icon: Brain },
              { title: 'Placement Prediction', desc: 'Identify probability levels using academic and resume data.', icon: TrendingUp },
              { title: 'Recruiter Simulator', desc: 'Engage with lead recruiter Marcus in a 4-round assessment.', icon: Zap }
            ].map((ai) => {
              const Icon = ai.icon;
              return (
                <div
                  key={ai.title}
                  className={`p-5 rounded-2xl border transition-all duration-305 ${
                    dark
                      ? 'bg-zinc-950/60 border-zinc-900/60 hover:border-purple-500/20'
                      : 'bg-white border-zinc-200 hover:border-purple-500/20 hover:shadow-md'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center mb-3.5">
                    <Icon size={14} />
                  </div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white mb-2">{ai.title}</h4>
                  <p className={`text-[11px] leading-relaxed ${dark ? 'text-zinc-400' : 'text-zinc-550'}`}>
                    {ai.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics Section with Counters */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28 text-center space-y-12">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-purple-500">
          Proven success parameters
        </h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: '10,000+', label: 'Applications Tracked' },
            { value: '95%', label: 'Resume Improvement Success' },
            { value: '85%', label: 'Interview Confidence Growth' },
            { value: '5,000+', label: 'Mock Interviews Conducted' }
          ].map((s) => (
            <div key={s.label} className="space-y-2">
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">
                {hasMounted ? <AnimatedCounter value={s.value} /> : s.value}
              </div>
              <p className={`text-xs ${dark ? 'text-zinc-450' : 'text-zinc-500'}`}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials section */}
      <section className={`py-20 md:py-28 border-t transition-colors duration-200 ${
        dark ? 'bg-[#030303]/10 border-zinc-900/80' : 'bg-zinc-50/10 border-zinc-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
              Loved by placement candidates
            </h2>
            <p className={`text-sm ${dark ? 'text-zinc-400' : 'text-zinc-550'}`}>
              See how students cracked interviews using Placement Tracker Pro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonialsList.map((t) => (
              <div
                key={t.name}
                className={`p-6 rounded-2xl border flex flex-col justify-between space-y-6 ${
                  dark ? 'bg-zinc-950/40 border-zinc-900/60' : 'bg-white border-zinc-200/60'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star key={idx} size={12} className="fill-purple-500 text-purple-500" />
                    ))}
                  </div>
                  <p className={`text-xs leading-relaxed ${dark ? 'text-zinc-300' : 'text-zinc-650'}`}>
                    "{t.text}"
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">{t.name}</h4>
                  <span className="text-[10px] text-purple-500 font-medium">
                    {t.role} · {t.company}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className={`relative p-8 md:p-12 rounded-3xl border text-center space-y-6 overflow-hidden ${
          dark ? 'bg-zinc-955/50 border-zinc-900/80 shadow-black' : 'bg-white border-zinc-200 shadow-zinc-100 shadow-lg'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-indigo-600/5 pointer-events-none" />
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
            Ready to accelerate your placement journey?
          </h2>
          <p className={`text-xs sm:text-sm max-w-xl mx-auto ${dark ? 'text-zinc-400' : 'text-zinc-550'}`}>
            Start tracking applications, optimizing resumes, and preparing for interviews today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="w-full sm:w-auto text-xs font-bold px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all active:scale-[0.98]"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className={`w-full sm:w-auto text-xs font-semibold px-8 py-3.5 rounded-xl border transition-all hover:bg-zinc-100 dark:hover:bg-zinc-900/50 ${
                dark ? 'text-zinc-350 border-zinc-800' : 'text-zinc-650 border-zinc-200'
              }`}
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className={`border-t py-12 transition-colors duration-200 ${
        dark ? 'border-zinc-900 bg-[#020205]' : 'border-zinc-200 bg-zinc-50'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-900 dark:text-white">
                Placement Tracker Pro
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 mt-1">
                <span className="text-[10px] text-zinc-550 dark:text-zinc-400">Dhanush Gowda G</span>
                <span className="hidden sm:inline text-zinc-700">·</span>
                <a href="mailto:dh4nushgowd4@gmail.com" className="text-[10px] text-purple-500 hover:underline">
                  dh4nushgowd4@gmail.com
                </a>
              </div>
            </div>
          </div>

          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold tracking-tight hover:shadow-md transition-all ${
              dark 
                ? 'bg-zinc-955 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900' 
                : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            <span>Built for Digital Heroes</span>
            <ArrowUpRight size={13} className="text-purple-500" />
          </a>
        </div>
      </footer>
    </div>
  );
}
