import { ApplicationStatus } from '@/types';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const STATUS_COLORS: Record<ApplicationStatus, { bg: string; text: string; border: string; dot: string }> = {
  Interested: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30', dot: 'bg-slate-400' },
  Applied: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', dot: 'bg-blue-400' },
  Assessment: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', dot: 'bg-amber-400' },
  Shortlisted: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30', dot: 'bg-cyan-400' },
  'Technical Interview': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', dot: 'bg-purple-400' },
  'Managerial Interview': { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/30', dot: 'bg-violet-400' },
  'HR Interview': { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30', dot: 'bg-indigo-400' },
  'Offer Received': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
  'Offer Accepted': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', dot: 'bg-green-400' },
  'Offer Rejected': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', dot: 'bg-orange-400' },
  Rejected: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', dot: 'bg-red-400' },
};

export const STATUS_CHART_COLORS: Record<ApplicationStatus, string> = {
  Interested: '#94a3b8', Applied: '#3b82f6', Assessment: '#f59e0b', Shortlisted: '#06b6d4',
  'Technical Interview': '#a855f7', 'Managerial Interview': '#8b5cf6', 'HR Interview': '#6366f1',
  'Offer Received': '#10b981', 'Offer Accepted': '#22c55e', 'Offer Rejected': '#f97316', Rejected: '#ef4444',
};

export const ALL_STATUSES: ApplicationStatus[] = [
  'Interested', 'Applied', 'Assessment', 'Shortlisted',
  'Technical Interview', 'Managerial Interview', 'HR Interview',
  'Offer Received', 'Offer Accepted', 'Offer Rejected', 'Rejected',
];

export function formatDate(dateString: string): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(dateString: string, timeString?: string): string {
  if (!dateString) return '-';
  const date = new Date(dateString).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  return timeString ? `${date} at ${timeString}` : date;
}

export function getDaysUntil(dateString: string): number {
  if (!dateString) return 0;
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const target = new Date(dateString); target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function isToday(dateString: string): boolean {
  if (!dateString) return false;
  const today = new Date().toISOString().split('T')[0];
  return dateString === today;
}

export function isUpcoming(dateString: string): boolean {
  return getDaysUntil(dateString) > 0;
}
