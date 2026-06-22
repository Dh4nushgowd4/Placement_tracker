'use client';
import { useState, useEffect } from 'react';
import { Interview, JobDrive, Offer } from '@/types';
import {
  getInterviews, addInterview, updateInterview, deleteInterview,
  getDrives, addDrive, updateDrive, deleteDrive,
  getOffers, addOffer, updateOffer, deleteOffer,
} from '@/lib/storage';
import { formatDate, formatDateTime, getDaysUntil } from '@/lib/utils';
import { Plus, Pencil, Trash2, Calendar, Clock, Building2, CheckCircle2, XCircle, AlertCircle, X, Package } from 'lucide-react';

// ─── INTERVIEW TRACKER ────────────────────────────────────────────────────────

export function InterviewTracker() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Interview | null>(null);
  const [form, setForm] = useState<Omit<Interview, 'id' | 'createdAt' | 'updatedAt'>>({
    companyName: '', interviewType: 'Technical', interviewDate: '', interviewTime: '',
    round: '1', interviewerName: '', notes: '', feedback: '', result: '', status: 'Scheduled',
  });

  useEffect(() => { setInterviews(getInterviews()); }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayInterviews = interviews.filter(i => i.interviewDate === today);
  const upcoming = interviews.filter(i => i.interviewDate > today && i.status === 'Scheduled');
  const completed = interviews.filter(i => i.status === 'Completed' || i.status === 'Cleared' || i.status === 'Rejected');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      const u = updateInterview(editing.id, form);
      if (u) setInterviews(prev => prev.map(i => i.id === editing.id ? u : i));
    } else {
      const n = addInterview(form);
      setInterviews(prev => [...prev, n]);
    }
    setShowForm(false); setEditing(null);
    setForm({ companyName: '', interviewType: 'Technical', interviewDate: '', interviewTime: '', round: '1', interviewerName: '', notes: '', feedback: '', result: '', status: 'Scheduled' });
  };

  const handleEdit = (i: Interview) => { setEditing(i); setForm({ companyName: i.companyName, interviewType: i.interviewType, interviewDate: i.interviewDate, interviewTime: i.interviewTime, round: i.round, interviewerName: i.interviewerName ?? '', notes: i.notes ?? '', feedback: i.feedback ?? '', result: i.result ?? '', status: i.status }); setShowForm(true); };
  const handleDelete = (id: string) => { deleteInterview(id); setInterviews(prev => prev.filter(i => i.id !== id)); };

  const statusColor = (s: string) => ({ Scheduled: 'text-blue-400 bg-blue-500/10 border-blue-500/30', Completed: 'text-slate-400 bg-slate-500/10 border-slate-500/30', Cleared: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', Rejected: 'text-red-400 bg-red-500/10 border-red-500/30' }[s] ?? '');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Interview Tracker</h2>
          <p className="text-slate-400 text-sm">Schedule and track all your interviews</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={15} />Schedule Interview
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: interviews.length, color: 'text-indigo-400', icon: Calendar },
          { label: "Today's", value: todayInterviews.length, color: 'text-amber-400', icon: Clock },
          { label: 'Upcoming', value: upcoming.length, color: 'text-cyan-400', icon: AlertCircle },
          { label: 'Completed', value: completed.length, color: 'text-emerald-400', icon: CheckCircle2 },
        ].map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500">{c.label}</span>
                <Icon size={14} className={c.color} />
              </div>
              <div className={`text-2xl font-black ${c.color}`}>{c.value}</div>
            </div>
          );
        })}
      </div>

      {/* Today's interviews */}
      {todayInterviews.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2"><Clock size={14} className="text-amber-400" />Today&apos;s Interviews</h3>
          <div className="space-y-2">
            {todayInterviews.map(i => (
              <div key={i.id} className="card p-4 border-amber-500/20 bg-amber-500/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center"><Building2 size={14} className="text-amber-400" /></div>
                    <div>
                      <p className="font-semibold text-white text-sm">{i.companyName}</p>
                      <p className="text-xs text-slate-400">{i.interviewType} · Round {i.round} · {i.interviewTime}</p>
                    </div>
                  </div>
                  <span className={`status-badge text-xs ${statusColor(i.status)}`}>{i.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All interviews table */}
      {interviews.length === 0 ? (
        <div className="card p-12 text-center">
          <Calendar size={36} className="text-indigo-400/40 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-300 mb-2">No interviews scheduled</h3>
          <p className="text-slate-500 text-sm">Click &quot;Schedule Interview&quot; to add your first interview.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="table-header">
                <tr>{['Company', 'Type', 'Date & Time', 'Round', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {interviews.map(i => (
                  <tr key={i.id} className="table-row">
                    <td className="px-4 py-3 font-semibold text-slate-200 text-sm">{i.companyName}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{i.interviewType}</td>
                    <td className="px-4 py-3 text-sm text-slate-400 whitespace-nowrap">{formatDate(i.interviewDate)} {i.interviewTime && `· ${i.interviewTime}`}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">Round {i.round}</td>
                    <td className="px-4 py-3"><span className={`status-badge text-xs ${statusColor(i.status)}`}>{i.status}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(i)} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 transition-all"><Pencil size={13} /></button>
                        <button onClick={() => handleDelete(i.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal-content">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">{editing ? 'Edit' : 'Schedule'} Interview</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-slate-400 hover:text-white transition-all rounded-lg hover:bg-white/10"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">Company Name*</label>
                  <input className="input-field" required value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} /></div>
                <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">Interview Type</label>
                  <select className="input-field" value={form.interviewType} onChange={e => setForm(f => ({ ...f, interviewType: e.target.value as Interview['interviewType'] }))}>
                    {['Technical', 'HR', 'Managerial', 'Group Discussion', 'Aptitude', 'Coding', 'System Design'].map(t => <option key={t}>{t}</option>)}
                  </select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">Date*</label>
                  <input type="date" className="input-field" style={{ colorScheme: 'dark' }} required value={form.interviewDate} onChange={e => setForm(f => ({ ...f, interviewDate: e.target.value }))} /></div>
                <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">Time</label>
                  <input type="time" className="input-field" style={{ colorScheme: 'dark' }} value={form.interviewTime} onChange={e => setForm(f => ({ ...f, interviewTime: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">Round</label>
                  <input className="input-field" placeholder="1" value={form.round} onChange={e => setForm(f => ({ ...f, round: e.target.value }))} /></div>
                <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">Status</label>
                  <select className="input-field" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Interview['status'] }))}>
                    {['Scheduled', 'Completed', 'Cleared', 'Rejected'].map(s => <option key={s}>{s}</option>)}
                  </select></div>
              </div>
              <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">Interviewer Name</label>
                <input className="input-field" placeholder="Optional" value={form.interviewerName ?? ''} onChange={e => setForm(f => ({ ...f, interviewerName: e.target.value }))} /></div>
              <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">Notes</label>
                <textarea className="input-field resize-none" rows={2} value={form.notes ?? ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
              {editing && <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">Feedback</label>
                <textarea className="input-field resize-none" rows={2} value={form.feedback ?? ''} onChange={e => setForm(f => ({ ...f, feedback: e.target.value }))} /></div>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Schedule'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── JOB DRIVE TRACKER ────────────────────────────────────────────────────────

export function JobDriveTracker() {
  const [drives, setDrives] = useState<JobDrive[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<JobDrive | null>(null);
  const [form, setForm] = useState<Omit<JobDrive, 'id' | 'createdAt' | 'updatedAt'>>({
    companyName: '', driveType: 'Campus', registrationDeadline: '',
    eligibility: '', minCGPA: 6, ctc: '', location: '', driveDate: '', notes: '',
  });

  useEffect(() => { setDrives(getDrives()); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) { const u = updateDrive(editing.id, form); if (u) setDrives(prev => prev.map(d => d.id === editing.id ? u : d)); }
    else { setDrives(prev => [...prev, addDrive(form)]); }
    setShowForm(false); setEditing(null);
    setForm({ companyName: '', driveType: 'Campus', registrationDeadline: '', eligibility: '', minCGPA: 6, ctc: '', location: '', driveDate: '', notes: '' });
  };

  const handleEdit = (d: JobDrive) => { setEditing(d); setForm({ companyName: d.companyName, driveType: d.driveType, registrationDeadline: d.registrationDeadline, eligibility: d.eligibility ?? '', minCGPA: d.minCGPA ?? 6, ctc: d.ctc ?? '', location: d.location ?? '', driveDate: d.driveDate ?? '', notes: d.notes ?? '' }); setShowForm(true); };
  const handleDelete = (id: string) => { deleteDrive(id); setDrives(prev => prev.filter(d => d.id !== id)); };

  const getDeadlineBadge = (deadline: string) => {
    const days = getDaysUntil(deadline);
    if (days < 0) return <span className="text-xs text-slate-600">Expired</span>;
    if (days === 0) return <span className="text-xs font-bold text-red-400 animate-pulse">Today!</span>;
    if (days <= 3) return <span className="text-xs font-bold text-amber-400">⚠ {days}d left</span>;
    return <span className="text-xs text-emerald-400">{days}d left</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Job Drive Tracker</h2>
          <p className="text-slate-400 text-sm">Track campus and off-campus placement drives</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary flex items-center gap-2"><Plus size={15} />Add Drive</button>
      </div>

      {drives.length === 0 ? (
        <div className="card p-12 text-center">
          <Building2 size={36} className="text-indigo-400/40 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-300 mb-2">No drives added</h3>
          <p className="text-slate-500 text-sm">Add campus and off-campus drives to track deadlines.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {drives.map(d => {
            const days = getDaysUntil(d.registrationDeadline);
            return (
              <div key={d.id} className={`card p-5 ${days >= 0 && days <= 3 ? 'border-amber-500/30' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-white text-sm">{d.companyName}</h4>
                    <span className="text-xs text-indigo-400">{d.driveType}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => handleEdit(d)} className="p-1 text-slate-500 hover:text-indigo-400 transition-colors"><Pencil size={12} /></button>
                    <button onClick={() => handleDelete(d.id)} className="p-1 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs text-slate-400">
                  {d.ctc && <div>💰 {d.ctc}</div>}
                  {d.location && <div>📍 {d.location}</div>}
                  {d.minCGPA && <div>📊 Min CGPA: {d.minCGPA}</div>}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                    <span>Reg. Deadline: {formatDate(d.registrationDeadline)}</span>
                    {getDeadlineBadge(d.registrationDeadline)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal-content">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">{editing ? 'Edit' : 'Add'} Job Drive</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">Company*</label>
                  <input className="input-field" required value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} /></div>
                <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">Drive Type</label>
                  <select className="input-field" value={form.driveType} onChange={e => setForm(f => ({ ...f, driveType: e.target.value as JobDrive['driveType'] }))}>
                    {['Campus', 'Off-Campus', 'Referral', 'Walk-in'].map(t => <option key={t}>{t}</option>)}
                  </select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">Reg. Deadline*</label>
                  <input type="date" className="input-field" style={{ colorScheme: 'dark' }} required value={form.registrationDeadline} onChange={e => setForm(f => ({ ...f, registrationDeadline: e.target.value }))} /></div>
                <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">Drive Date</label>
                  <input type="date" className="input-field" style={{ colorScheme: 'dark' }} value={form.driveDate ?? ''} onChange={e => setForm(f => ({ ...f, driveDate: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">CTC</label>
                  <input className="input-field" placeholder="12 LPA" value={form.ctc ?? ''} onChange={e => setForm(f => ({ ...f, ctc: e.target.value }))} /></div>
                <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">Min CGPA</label>
                  <input type="number" step="0.1" min="0" max="10" className="input-field" value={form.minCGPA ?? ''} onChange={e => setForm(f => ({ ...f, minCGPA: parseFloat(e.target.value) }))} /></div>
              </div>
              <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">Location</label>
                <input className="input-field" placeholder="Bangalore / Remote" value={form.location ?? ''} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} /></div>
              <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">Notes</label>
                <textarea className="input-field resize-none" rows={2} value={form.notes ?? ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Add'} Drive</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── OFFER MANAGER ────────────────────────────────────────────────────────────

export function OfferManager() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Offer | null>(null);
  const [form, setForm] = useState<Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>>({
    companyName: '', role: '', package: '', baseSalary: '', bonus: '',
    joiningDate: '', offerExpiry: '', status: 'Received', notes: '',
  });

  useEffect(() => { setOffers(getOffers()); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) { const u = updateOffer(editing.id, form); if (u) setOffers(prev => prev.map(o => o.id === editing.id ? u : o)); }
    else { setOffers(prev => [...prev, addOffer(form)]); }
    setShowForm(false); setEditing(null);
    setForm({ companyName: '', role: '', package: '', baseSalary: '', bonus: '', joiningDate: '', offerExpiry: '', status: 'Received', notes: '' });
  };

  const handleEdit = (o: Offer) => { setEditing(o); setForm({ companyName: o.companyName, role: o.role, package: o.package, baseSalary: o.baseSalary ?? '', bonus: o.bonus ?? '', joiningDate: o.joiningDate ?? '', offerExpiry: o.offerExpiry ?? '', status: o.status, notes: o.notes ?? '' }); setShowForm(true); };
  const handleDelete = (id: string) => { deleteOffer(id); setOffers(prev => prev.filter(o => o.id !== id)); };

  const statusColor = (s: string) => ({ Received: 'text-blue-400 bg-blue-500/10 border-blue-500/30', Accepted: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', Rejected: 'text-red-400 bg-red-500/10 border-red-500/30' }[s] ?? '');

  const highest = offers.reduce((max, o) => {
    const val = parseFloat(o.package.replace(/[^0-9.]/g, '')) || 0;
    const maxVal = parseFloat(max?.package.replace(/[^0-9.]/g, '') ?? '0') || 0;
    return val > maxVal ? o : max;
  }, offers[0]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Offer Management</h2>
          <p className="text-slate-400 text-sm">Compare and manage all your job offers</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary flex items-center gap-2"><Plus size={15} />Add Offer</button>
      </div>

      {/* Summary */}
      {offers.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Offers', value: offers.length, color: 'text-indigo-400' },
            { label: 'Accepted', value: offers.filter(o => o.status === 'Accepted').length, color: 'text-emerald-400' },
            { label: 'Pending', value: offers.filter(o => o.status === 'Received').length, color: 'text-amber-400' },
            { label: 'Highest Package', value: highest?.package ?? '-', color: 'text-purple-400' },
          ].map(c => (
            <div key={c.label} className="card p-4">
              <p className="text-xs text-slate-500 mb-1">{c.label}</p>
              <p className={`text-xl font-black ${c.color}`}>{c.value}</p>
            </div>
          ))}
        </div>
      )}

      {offers.length === 0 ? (
        <div className="card p-12 text-center">
          <Package size={36} className="text-indigo-400/40 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-300 mb-2">No offers yet</h3>
          <p className="text-slate-500 text-sm">Add your offers to compare packages and make decisions.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="table-header">
                <tr>{['Company', 'Role', 'Package', 'Joining Date', 'Expiry', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {offers.map(o => (
                  <tr key={o.id} className={`table-row ${o.id === highest?.id ? 'bg-emerald-500/3' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200 text-sm">{o.companyName}</span>
                        {o.id === highest?.id && <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded px-1.5 py-0.5">Highest</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">{o.role}</td>
                    <td className="px-4 py-3 text-sm font-bold text-emerald-400">{o.package}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{o.joiningDate ? formatDate(o.joiningDate) : '-'}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{o.offerExpiry ? formatDate(o.offerExpiry) : '-'}</td>
                    <td className="px-4 py-3"><span className={`status-badge text-xs ${statusColor(o.status)}`}>{o.status}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(o)} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 transition-all"><Pencil size={13} /></button>
                        <button onClick={() => handleDelete(o.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal-content">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">{editing ? 'Edit' : 'Add'} Offer</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">Company*</label>
                  <input className="input-field" required value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} /></div>
                <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">Role*</label>
                  <input className="input-field" required value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">Package (CTC)*</label>
                  <input className="input-field" placeholder="12 LPA" required value={form.package} onChange={e => setForm(f => ({ ...f, package: e.target.value }))} /></div>
                <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">Status</label>
                  <select className="input-field" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Offer['status'] }))}>
                    {['Received', 'Accepted', 'Rejected'].map(s => <option key={s}>{s}</option>)}
                  </select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">Joining Date</label>
                  <input type="date" className="input-field" style={{ colorScheme: 'dark' }} value={form.joiningDate ?? ''} onChange={e => setForm(f => ({ ...f, joiningDate: e.target.value }))} /></div>
                <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">Offer Expiry</label>
                  <input type="date" className="input-field" style={{ colorScheme: 'dark' }} value={form.offerExpiry ?? ''} onChange={e => setForm(f => ({ ...f, offerExpiry: e.target.value }))} /></div>
              </div>
              <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">Notes</label>
                <textarea className="input-field resize-none" rows={2} value={form.notes ?? ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Add'} Offer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
