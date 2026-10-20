import React, { useState, useEffect } from 'react';
import { ProbationSettings, EmployeeProbationOverride } from '../../types/leave';

interface ProbationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ProbationSettings | null;
  overrides: EmployeeProbationOverride[];
  onSaveSettings: (updates: any) => Promise<void>;
}

export const ProbationSettingsModal: React.FC<ProbationSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  overrides,
  onSaveSettings
}) => {
  const [duration, setDuration] = useState<number>(3);
  const [durationUnit, setDurationUnit] = useState<'DAYS' | 'MONTHS'>('MONTHS');
  const [notifyDays, setNotifyDays] = useState<number>(15);
  const [activeTab, setActiveTab] = useState<'global' | 'override'>('global');

  // Override Form
  const [overrideEmpId, setOverrideEmpId] = useState('EMP003');
  const [overrideEmpName, setOverrideEmpName] = useState('Demo Person 16');
  const [originalDate, setOriginalDate] = useState('2026-08-01');
  const [newEndDate, setNewEndDate] = useState('2026-07-15');
  const [overrideReason, setOverrideReason] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setDuration(settings.duration);
      setDurationUnit(settings.durationUnit as any);
      setNotifyDays(settings.notifyBeforeCompletionDays);
    }
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSaveGlobal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSaveSettings({
        duration,
        durationUnit,
        notifyBeforeCompletionDays: notifyDays
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save probation settings.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideReason.trim() || overrideReason.trim().length < 5) {
      setErrorMsg('Mandatory reason for probation override is required (minimum 5 characters).');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await onSaveSettings({
        override: {
          employeeId: overrideEmpId,
          employeeName: overrideEmpName,
          originalEndDate: originalDate,
          overrideEndDate: newEndDate,
          reason: overrideReason.trim()
        }
      });
      setOverrideReason('');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to override probation end date.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />

      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 text-slate-100 animate-fadeIn">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <h3 className="text-lg font-bold">Probation Period Configuration</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            ✕
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('global')}
            className={`flex-1 py-2 rounded-lg transition ${
              activeTab === 'global' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Global Probation Settings
          </button>
          <button
            onClick={() => setActiveTab('override')}
            className={`flex-1 py-2 rounded-lg transition ${
              activeTab === 'override' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Employee Probation End Date Override
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 font-medium">
            {errorMsg}
          </div>
        )}

        {activeTab === 'global' ? (
          <form onSubmit={handleSaveGlobal} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Probation Duration</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={duration}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDuration(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Duration Unit</label>
                <select
                  value={durationUnit}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDurationUnit(e.target.value as 'DAYS' | 'MONTHS')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
                >
                  <option value="MONTHS">Months</option>
                  <option value="DAYS">Days</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Calculate From</label>
              <input
                type="text"
                disabled
                value="Employee Joining Date (Mandatory)"
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Notification Before Completion (Days)
              </label>
              <input
                type="number"
                value={notifyDays}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotifyDays(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 font-mono"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-950/50"
              >
                {isSubmitting ? 'Saving...' : 'Save Global Settings'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSaveOverride} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Employee *</label>
              <select
                value={overrideEmpId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setOverrideEmpId(e.target.value);
                  if (e.target.value === 'EMP003') {
                    setOverrideEmpName('Demo Person 16');
                    setOriginalDate('2026-08-01');
                  }
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
              >
                <option value="EMP003">Demo Person 16 (DR-1003) - Original End: 2026-08-01</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Original End Date</label>
                <input
                  type="date"
                  disabled
                  value={originalDate}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">New Override End Date *</label>
                <input
                  type="date"
                  required
                  value={newEndDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEndDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mandatory Reason for Override * <span className="text-rose-400">(Audited)</span>
              </label>
              <textarea
                rows={3}
                required
                value={overrideReason}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setOverrideReason(e.target.value)}
                placeholder="State performance evaluation results or executive decision..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-950/50"
              >
                {isSubmitting ? 'Saving...' : 'Confirm End Date Override'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProbationSettingsModal;
