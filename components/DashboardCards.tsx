'use client';

import { DashboardStats } from '@/types';
import {
  Briefcase,
  Award,
  XCircle,
  Clock,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

interface DashboardCardsProps {
  stats: DashboardStats;
  successRate: number;
}

export function DashboardCards({ stats, successRate }: DashboardCardsProps) {
  const cards = [
    {
      label: 'Total Apps',
      value: stats.total,
      icon: Briefcase,
      colorClass: 'before:bg-zinc-450 border-zinc-800/60',
      textColor: 'text-zinc-100',
      iconColor: 'text-zinc-400',
      bgGlow: 'bg-zinc-500/5',
      desc: 'All applications'
    },
    {
      label: 'Selected',
      value: stats.selected,
      icon: Award,
      colorClass: 'before:bg-emerald-500 border-emerald-500/20',
      textColor: 'text-emerald-400',
      iconColor: 'text-emerald-400',
      bgGlow: 'bg-emerald-500/5',
      desc: 'Offers received'
    },
    {
      label: 'Rejected',
      value: stats.rejected,
      icon: XCircle,
      colorClass: 'before:bg-red-500 border-red-500/20',
      textColor: 'text-red-400',
      iconColor: 'text-red-400',
      bgGlow: 'bg-red-500/5',
      desc: 'Screening denials'
    },
    {
      label: 'In Progress',
      value: stats.pending,
      icon: Clock,
      colorClass: 'before:bg-amber-500 border-amber-500/20',
      textColor: 'text-amber-400',
      iconColor: 'text-amber-400',
      bgGlow: 'bg-amber-500/5',
      desc: 'Under review'
    },
    {
      label: 'Interviewing',
      value: stats.interviewing,
      icon: CheckCircle2,
      colorClass: 'before:bg-purple-500 border-purple-500/20',
      textColor: 'text-purple-400',
      iconColor: 'text-purple-400',
      bgGlow: 'bg-purple-500/5',
      desc: 'Active interviews'
    },
    {
      label: 'Success Rate',
      value: `${successRate}%`,
      icon: TrendingUp,
      colorClass: 'before:bg-blue-500 border-blue-500/20',
      textColor: 'text-blue-400',
      iconColor: 'text-blue-400',
      bgGlow: 'bg-blue-500/5',
      desc: 'Offer ratio'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`relative bg-[#111827] border border-white/5 p-4 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/10 hover:-translate-y-0.5 hover:shadow-lg shadow-black/30 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 ${card.colorClass}`}
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: 'both',
            }}
          >
            {/* Header row with Icon and Label */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest truncate">
                {card.label}
              </span>
              <div className={`p-1.5 rounded-lg ${card.bgGlow} shrink-0`}>
                <Icon size={12} className={card.iconColor} />
              </div>
            </div>

            {/* Value */}
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-white tracking-tight">
                {card.value}
              </span>
            </div>
            
            {/* Short description */}
            <p className="text-[8px] text-zinc-500 mt-1 truncate">
              {card.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}
