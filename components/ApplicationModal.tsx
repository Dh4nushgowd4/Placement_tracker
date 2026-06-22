'use client';

import { useState } from 'react';
import { Application, ApplicationStatus } from '@/types';
import { ALL_STATUSES } from '@/lib/utils';
import { X, Building2, Briefcase, Calendar, StickyNote, CheckCircle2 } from 'lucide-react';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editData?: Application | null;
}

const defaultForm = {
  companyName: '',
  role: '',
  applicationDate: new Date().toISOString().split('T')[0],
  status: 'Applied' as ApplicationStatus,
  notes: '',
};

export function ApplicationModal({ isOpen, onClose, onSubmit, editData }: ApplicationModalProps) {
  const [form, setForm] = useState(
    editData
      ? {
          companyName: editData.companyName,
          role: editData.role,
          applicationDate: editData.applicationDate,
          status: editData.status,
          notes: editData.notes,
        }
      : defaultForm
  );
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Partial<typeof form> = {};
    if (!form.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!form.role.trim()) newErrors.role = 'Role is required';
    if (!form.applicationDate) newErrors.applicationDate = 'Date is required';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(form);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      if (!editData) setForm(defaultForm);
    }, 800);
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h2 className="text-xl font-bold text-white">
              {editData ? 'Edit Application' : 'New Application'}
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {editData ? 'Update your application details' : 'Track a new job application'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Company Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <Building2 size={14} className="text-purple-400" />
              Company Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className={`input-field ${errors.companyName ? 'border-red-500/50 focus:border-red-500' : ''}`}
              placeholder="e.g. Google, Microsoft, Amazon..."
              value={form.companyName}
              onChange={e => handleChange('companyName', e.target.value)}
            />
            {errors.companyName && (
              <p className="text-red-400 text-xs mt-1">{errors.companyName}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <Briefcase size={14} className="text-purple-400" />
              Role / Position <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className={`input-field ${errors.role ? 'border-red-500/50 focus:border-red-500' : ''}`}
              placeholder="e.g. Software Engineer, Data Analyst..."
              value={form.role}
              onChange={e => handleChange('role', e.target.value)}
            />
            {errors.role && (
              <p className="text-red-400 text-xs mt-1">{errors.role}</p>
            )}
          </div>

          {/* Date & Status Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Calendar size={14} className="text-purple-400" />
                Date Applied <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                className={`input-field ${errors.applicationDate ? 'border-red-500/50' : ''}`}
                value={form.applicationDate}
                onChange={e => handleChange('applicationDate', e.target.value)}
                style={{ colorScheme: 'dark' }}
              />
              {errors.applicationDate && (
                <p className="text-red-400 text-xs mt-1">{errors.applicationDate}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Status
              </label>
              <select
                className="input-field"
                value={form.status}
                onChange={e => handleChange('status', e.target.value)}
              >
                {ALL_STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <StickyNote size={14} className="text-purple-400" />
              Notes <span className="text-slate-500 text-xs font-normal">(optional)</span>
            </label>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder="Add any notes, interview feedback, contacts..."
              value={form.notes}
              onChange={e => handleChange('notes', e.target.value)}
            />
          </div>

          {/* Status Color Preview */}
          <div className="flex flex-wrap gap-2">
            {ALL_STATUSES.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => handleChange('status', s)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                  form.status === s
                    ? 'bg-purple-600/10 border-purple-500/20 text-purple-400 scale-105'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
              {submitted ? (
                <>
                  <CheckCircle2 size={16} />
                  Saved!
                </>
              ) : (
                editData ? 'Update Application' : 'Add Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
