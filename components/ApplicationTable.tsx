'use client';

import { Application, SortConfig, SortField, FilterConfig, ApplicationStatus } from '@/types';
import { StatusBadge } from './StatusBadge';
import { ALL_STATUSES, formatDate } from '@/lib/utils';
import {
  Search,
  SortAsc,
  SortDesc,
  Pencil,
  Trash2,
  ChevronDown,
  Building2,
  Filter,
  FileText,
  ArrowUpDown
} from 'lucide-react';

interface ApplicationTableProps {
  applications: Application[];
  filter: FilterConfig;
  onFilterChange: (filter: FilterConfig) => void;
  sort: SortConfig;
  onSortChange: (sort: SortConfig) => void;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
}

const SORT_FIELDS: { label: string; field: SortField }[] = [
  { label: 'Company', field: 'companyName' },
  { label: 'Role', field: 'role' },
  { label: 'Date', field: 'applicationDate' },
  { label: 'Status', field: 'status' },
];

export function ApplicationTable({
  applications,
  filter,
  onFilterChange,
  sort,
  onSortChange,
  onEdit,
  onDelete,
}: ApplicationTableProps) {
  const handleSort = (field: SortField) => {
    if (sort.field === field) {
      onSortChange({ field, direction: sort.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      onSortChange({ field, direction: 'asc' });
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sort.field !== field) return <ArrowUpDown size={11} className="text-zinc-550 shrink-0" />;
    return sort.direction === 'asc'
      ? <SortAsc size={11} className="text-purple-400 shrink-0" />
      : <SortDesc size={11} className="text-purple-400 shrink-0" />;
  };

  return (
    <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
      {/* Search & Filter Toolbar */}
      <div className="p-4 border-b border-white/5 bg-zinc-950/20 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              className="w-full bg-[#050816]/60 border border-white/5 rounded-xl text-xs text-white pl-9 pr-4 py-2.5 placeholder-zinc-500 focus:outline-none focus:border-purple-500/40 transition-colors"
              placeholder="Search target companies, roles or notes..."
              value={filter.search}
              onChange={e => onFilterChange({ ...filter, search: e.target.value })}
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative shrink-0">
            <Filter size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <select
              className="bg-[#050816]/60 border border-white/5 rounded-xl text-xs text-white pl-8 pr-10 py-2.5 appearance-none focus:outline-none focus:border-purple-500/40 transition-colors min-w-[160px]"
              value={filter.status}
              onChange={e => onFilterChange({ ...filter, status: e.target.value as ApplicationStatus | 'All' })}
            >
              <option value="All">All Statuses</option>
              {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </div>
        </div>

        {/* Sort pills row */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Sort by:</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {SORT_FIELDS.map(({ label, field }) => (
              <button
                key={field}
                onClick={() => handleSort(field)}
                className={`flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full border transition-all ${
                  sort.field === field
                    ? 'bg-purple-650/10 border-purple-500/20 text-purple-400 font-semibold'
                    : 'bg-transparent border-white/5 text-zinc-400 hover:border-white/10 hover:text-white'
                }`}
              >
                <span>{label}</span>
                <SortIcon field={field} />
              </button>
            ))}
          </div>
          <span className="ml-auto text-[10px] text-zinc-500 font-medium">
            {applications.length} result{applications.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Empty State */}
      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-zinc-950/10">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center mb-4">
            <FileText size={22} className="text-purple-450" />
          </div>
          <h3 className="text-xs font-bold text-zinc-300 mb-1">No Applications Found</h3>
          <p className="text-[11px] text-zinc-500 max-w-xs leading-relaxed">
            {filter.search || filter.status !== 'All'
              ? 'Adjust your filters or query to locate records.'
              : 'Add applications manually or run imports to start tracking.'}
          </p>
        </div>
      ) : (
        /* Applications Table view */
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-zinc-950/40">
                <th className="px-5 py-3 text-[10px] font-bold text-zinc-450 uppercase tracking-widest">
                  Company
                </th>
                <th className="px-5 py-3 text-[10px] font-bold text-zinc-455 uppercase tracking-widest hidden sm:table-cell">
                  Role / Position
                </th>
                <th className="px-5 py-3 text-[10px] font-bold text-zinc-460 uppercase tracking-widest hidden md:table-cell">
                  Date Applied
                </th>
                <th className="px-5 py-3 text-[10px] font-bold text-zinc-465 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-5 py-3 text-[10px] font-bold text-zinc-470 uppercase tracking-widest hidden lg:table-cell">
                  Notes
                </th>
                <th className="px-5 py-3 text-[10px] font-bold text-zinc-475 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {applications.map((app, index) => (
                <tr
                  key={app.id}
                  className="group hover:bg-white/[0.01] transition-colors"
                  style={{ animationDelay: `${index * 20}ms` }}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-950/40 border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:border-purple-500/20 transition-colors">
                        <Building2 size={13} className="text-zinc-400 group-hover:text-purple-400 transition-colors" />
                      </div>
                      <div>
                        <span className="font-semibold text-zinc-200 text-xs block group-hover:text-white transition-colors">{app.companyName}</span>
                        <span className="text-[10px] text-zinc-500 sm:hidden block mt-0.5">{app.role}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-zinc-300 hidden sm:table-cell font-medium">
                    {app.role}
                  </td>
                  <td className="px-5 py-4 text-xs text-zinc-450 hidden md:table-cell whitespace-nowrap">
                    {formatDate(app.applicationDate)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={app.status} size="sm" />
                  </td>
                  <td className="px-5 py-4 text-xs text-zinc-500 hidden lg:table-cell max-w-[240px]">
                    <span className="truncate block" title={app.notes}>
                      {app.notes || <span className="text-zinc-700 italic">No notes</span>}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(app)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all"
                        title="Edit Details"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => onDelete(app.id)}
                        className="p-1.5 rounded-lg text-zinc-450 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Delete Record"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
