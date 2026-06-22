'use client';

import { MonthlyData, StatusDistribution } from '@/types';
import { STATUS_CHART_COLORS } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, PieChart as PieChartIcon, BarChart2 } from 'lucide-react';

interface AnalyticsChartsProps {
  monthlyData: MonthlyData[];
  statusDistribution: StatusDistribution[];
  successRate: number;
  totalApplications: number;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a2e] border border-indigo-500/20 rounded-xl p-3 shadow-2xl">
        <p className="text-sm font-semibold text-slate-200 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-slate-400">{entry.name}:</span>
            <span className="text-slate-200 font-semibold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a2e] border border-indigo-500/20 rounded-xl p-3 shadow-2xl">
        <p className="text-sm font-semibold text-slate-200">{payload[0].name}</p>
        <p className="text-xs text-slate-400">
          Count: <span className="text-slate-200 font-semibold">{payload[0].value}</span>
        </p>
        <p className="text-xs text-slate-400">
          Share: <span className="text-slate-200 font-semibold">{payload[0].payload.percentage}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export function AnalyticsCharts({
  monthlyData,
  statusDistribution,
  successRate,
  totalApplications,
}: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Success Rate Card */}
      <div className="card p-6 flex flex-col items-center justify-center text-center">
        <div className="relative w-32 h-32 mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="40"
              fill="none"
              stroke="rgba(99,102,241,0.1)"
              strokeWidth="10"
            />
            <circle
              cx="50" cy="50" r="40"
              fill="none"
              stroke="url(#successGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${successRate * 2.51} 251`}
              style={{ transition: 'stroke-dasharray 1s ease' }}
            />
            <defs>
              <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black gradient-text">{successRate}%</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={16} className="text-indigo-400" />
          <h3 className="text-base font-bold text-slate-200">Success Rate</h3>
        </div>
        <p className="text-sm text-slate-500">Offers / Total Applications</p>
        <div className="mt-4 grid grid-cols-2 gap-3 w-full">
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3">
            <p className="text-xs text-slate-400">Total</p>
            <p className="text-xl font-bold text-indigo-300">{totalApplications}</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
            <p className="text-xs text-slate-400">Offers</p>
            <p className="text-xl font-bold text-emerald-300">
              {(statusDistribution.find(s => s.status === 'Offer Received')?.count ?? 0) +
               (statusDistribution.find(s => s.status === 'Offer Accepted')?.count ?? 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Bar Chart */}
      <div className="card p-6 col-span-1 lg:col-span-2">
        <div className="flex items-center gap-2 mb-6">
          <BarChart2 size={18} className="text-indigo-400" />
          <h3 className="text-base font-bold text-slate-200">Applications per Month</h3>
        </div>
        {monthlyData.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
            No data yet. Add applications to see trends.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="month"
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
              <Bar dataKey="applications" name="Applied" fill="#6366f1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="offered" name="Offered" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="rejected" name="Rejected" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Status Distribution */}
      <div className="card p-6 col-span-1 lg:col-span-3">
        <div className="flex items-center gap-2 mb-6">
          <PieChartIcon size={18} className="text-indigo-400" />
          <h3 className="text-base font-bold text-slate-200">Status Distribution</h3>
        </div>
        {statusDistribution.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
            No applications yet. Start tracking to see distribution.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="status"
                >
                  {statusDistribution.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_CHART_COLORS[entry.status]}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-3">
              {statusDistribution.map((item) => (
                <div
                  key={item.status}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5"
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: STATUS_CHART_COLORS[item.status] }}
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-300">{item.status}</p>
                    <p className="text-xs text-slate-500">
                      {item.count} · {item.percentage}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
