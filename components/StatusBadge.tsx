'use client';

import { ApplicationStatus } from '@/types';
import { STATUS_COLORS } from '@/lib/utils';

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const colors = STATUS_COLORS[status];
  
  return (
    <span
      className={`status-badge ${colors.bg} ${colors.text} ${colors.border} ${
        size === 'sm' ? 'text-xs px-2 py-0.5' : ''
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {status}
    </span>
  );
}
