import React, { useState, useEffect } from 'react';
import { Attendance, WorkMode } from '../types/attendance';
import { MandatoryReasonInput } from './MandatoryReasonInput';
import { validateModificationReason } from '../utils/attendanceValidation';

interface ChangeWorkModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: Attendance | null;
  onSave: (newWorkMode: WorkMode, reason: string) => Promise<void>;
}

export const ChangeWorkModeModal: React.FC<ChangeWorkModeModalProps> = ({
  isOpen,
  onClose,
  record,
  onSave
}) => {
  const [selectedMode, setSelectedMode] = useState<WorkMode>(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (record) {
      setSelectedMode(record.workMode);
      setReason('');
      setError('');
    }
  }, [record, isOpen]);

  if (!isOpen || !record) return null;

  const currentModeText =
    record.workMode === 'OFFICE'
      ? 'Office'
      : record.workMode === 'WFH'
      ? 'WFH (Work From Home)'
      : 'Not Selected';

  const reasonValidation = validateModificationReason(reason);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!reasonValidation.isValid) {
      setError(reasonValidation.message || 'Reason for modification is mandatory.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(selectedMode, reason.trim());
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to update work mode.');
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
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                Change Work Mode
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                {record.employeeName} ({record.employeeId})
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

            {/* Current Work Mode Banner */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Current Work Mode
                </span>
                <span className="text-sm font-bold text-slate-200 mt-1 block">
                  {currentModeText}
                </span>
              </div>
              <span className="text-xs text-slate-500 italic">Historical data preserved in audit log</span>
            </div>

            {/* Radio / Selector for New Work Mode */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Select New Work Mode *
              </label>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'OFFICE', label: 'Office', desc: 'Office Policy Verification' },
                  { value: 'WFH', label: 'WFH', desc: 'Verification Not Required' },
                  { value: null, label: 'Not Selected', desc: 'Clear Mode' }
                ].map((item) => {
                  const isSelected = selectedMode === item.value;
                  return (
                    <button
                      key={String(item.value)}
                      type="button"
                      onClick={() => setSelectedMode(item.value as WorkMode)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-500/10'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="text-xs font-bold">{item.label}</div>
                      <div className="text-[10px] text-slate-400 mt-1 leading-tight">{item.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mandatory Reason Input */}
            <MandatoryReasonInput
              value={reason}
              onChange={setReason}
              placeholder="e.g. Employee reported from office today / requested remote work."
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
              {isSubmitting ? 'Saving...' : 'Update Work Mode'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeWorkModeModal;
