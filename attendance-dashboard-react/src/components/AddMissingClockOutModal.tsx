import React, { useState, useEffect } from 'react';
import { Attendance } from '../types/attendance';
import { MandatoryReasonInput } from './MandatoryReasonInput';
import { validateClockTimes, validateModificationReason } from '../utils/attendanceValidation';

interface AddMissingClockOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: Attendance | null;
  onSave: (clockOutIso: string, reason: string) => Promise<void>;
}

export const AddMissingClockOutModal: React.FC<AddMissingClockOutModalProps> = ({
  isOpen,
  onClose,
  record,
  onSave
}) => {
  const [clockOutDate, setClockOutDate] = useState('');
  const [clockOutTime, setClockOutTime] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (record) {
      setReason('');
      setError('');
      if (record.clockInAt) {
        const inDate = new Date(record.clockInAt);
        setClockOutDate(inDate.toISOString().slice(0, 10));
        // Default clock out time to current time or 9h after clock in
        const defaultOut = new Date(inDate.getTime() + 9 * 60 * 60 * 1000);
        setClockOutTime(defaultOut.toTimeString().slice(0, 5));
      } else {
        setClockOutDate(new Date().toISOString().slice(0, 10));
        setClockOutTime('');
      }
    }
  }, [record, isOpen]);

  if (!isOpen || !record) return null;

  const formattedClockIn = record.clockInAt
    ? new Date(record.clockInAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    : '—';

  const reasonValidation = validateModificationReason(reason);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!reasonValidation.isValid) {
      setError(reasonValidation.message || 'A valid reason for modification is required.');
      return;
    }

    if (!clockOutDate || !clockOutTime) {
      setError('Please select both clock-out date and time.');
      return;
    }

    const clockOutIso = new Date(`${clockOutDate}T${clockOutTime}:00`).toISOString();

    const timeValidation = validateClockTimes(record.clockInAt, clockOutIso);
    if (!timeValidation.isValid) {
      setError(timeValidation.message || 'Clock-out time must be after clock-in time.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(clockOutIso, reason.trim());
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save missing clock-out.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div onClick={onClose} className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />

      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto">
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Header */}
          <div className="border-b border-slate-800 p-5 flex justify-between items-center bg-slate-900/60">
            <div>
              <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                Add Missing Clock-Out
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                {record.employeeName} ({record.employeeId}) • {record.department}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-xl font-medium">
                {error}
              </div>
            )}

            {/* Existing Clock-in Badge */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Existing Clock-In
                </span>
                <span className="text-lg font-mono font-bold text-emerald-400 mt-0.5 block">
                  {formattedClockIn}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Current Status
                </span>
                <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full inline-block mt-1">
                  Missing Clock-Out
                </span>
              </div>
            </div>

            {/* Clock Out Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Clock Out Date *
                </label>
                <input
                  type="date"
                  value={clockOutDate}
                  onChange={(e) => setClockOutDate(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Clock Out Time *
                </label>
                <input
                  type="time"
                  value={clockOutTime}
                  onChange={(e) => setClockOutTime(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Mandatory Reason */}
            <MandatoryReasonInput
              value={reason}
              onChange={setReason}
              placeholder="e.g. Employee forgot to clock out upon departure at 6:30 PM."
            />
          </div>

          {/* Footer */}
          <div className="border-t border-slate-800 p-5 bg-slate-900/60 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl py-2.5 px-5 border border-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reasonValidation.isValid}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/40 disabled:cursor-not-allowed text-slate-100 text-sm font-semibold rounded-xl py-2.5 px-6 border border-indigo-500 cursor-pointer shadow-lg transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Save Missing Clock-Out'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMissingClockOutModal;
