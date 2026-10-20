import React, { useState, useEffect } from 'react';
import { Attendance } from '../types/attendance';
import { MandatoryReasonInput } from './MandatoryReasonInput';
import { hasAttendanceActivity, validateModificationReason } from '../utils/attendanceValidation';

interface MarkLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: Attendance | null;
  onSave: (reason: string) => Promise<void>;
}

export const MarkLeaveModal: React.FC<MarkLeaveModalProps> = ({
  isOpen,
  onClose,
  record,
  onSave
}) => {
  const [confirmed, setConfirmed] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (record) {
      setConfirmed(false);
      setReason('');
      setError('');

      // Validate if attendance activity already exists on open
      if (hasAttendanceActivity(record)) {
        setError(
          'This employee already has attendance activity for this date. Remove the attendance entry before marking full-day leave.'
        );
      }
    }
  }, [record, isOpen]);

  if (!isOpen || !record) return null;

  const activityExists = hasAttendanceActivity(record);
  const reasonValidation = validateModificationReason(reason);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activityExists) {
      setError(
        'This employee already has attendance activity for this date. Remove the attendance entry before marking full-day leave.'
      );
      return;
    }

    if (!reasonValidation.isValid) {
      setError(reasonValidation.message || 'Reason for modification is mandatory.');
      return;
    }

    if (!confirmed) {
      setError('Please check the confirmation box to proceed.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(reason.trim());
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to mark employee as on leave.');
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
                <span className="w-2.5 h-2.5 rounded-full bg-violet-400" />
                Mark Full-Day Leave
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
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-xl font-medium leading-relaxed flex items-start gap-2.5">
                <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>{error}</div>
              </div>
            )}

            {/* Leave Details Summary Box */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Leave Type:</span>
                <span className="font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 rounded-full">
                  Full Day
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Target Attendance Date:</span>
                <span className="font-mono text-slate-200">{record.createdAt.slice(0, 10)}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-slate-800/60 pt-2 text-slate-400">
                <span>Resulting State:</span>
                <span className="font-mono text-slate-300">
                  Mode: — | In: — | Out: — | 00h 00m
                </span>
              </div>
            </div>

            {/* Mandatory Reason Input */}
            <MandatoryReasonInput
              value={reason}
              onChange={setReason}
              disabled={activityExists}
              placeholder="e.g. Employee requested approved sick leave for today."
            />

            {/* Confirmation Checkbox */}
            <label
              className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                activityExists
                  ? 'opacity-50 pointer-events-none bg-slate-950 border-slate-800'
                  : confirmed
                  ? 'bg-indigo-600/10 border-indigo-500/40 text-slate-200'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                disabled={activityExists}
                className="mt-0.5 rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span className="text-xs leading-relaxed">
                I confirm marking <strong>{record.employeeName}</strong> as Full-Day On Leave. Work mode, clock-in, clock-out, and verification entries will be reset to null.
              </span>
            </label>
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
              disabled={isSubmitting || activityExists || !confirmed || !reasonValidation.isValid}
              className="bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-800 disabled:cursor-not-allowed text-slate-100 text-sm font-semibold rounded-xl py-2.5 px-6 border border-violet-500 cursor-pointer shadow-lg transition-colors"
            >
              {isSubmitting ? 'Processing...' : 'Mark as Leave'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarkLeaveModal;
