'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LandingPage from '@/components/LandingPage';
import { Zap } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('ptp_logged_in') === 'true';
    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a14]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse shadow-2xl">
            <Zap size={22} className="text-white" />
          </div>
          <p className="text-slate-400 text-xs font-semibold">Booting Placement Tracker...</p>
        </div>
      </div>
    );
  }

  return <LandingPage />;
}
