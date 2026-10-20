import React, { useState } from 'react';
import { LeaveRequest } from '../../types/leave';

interface LeaveApproveModalProps {
  request: LeaveRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmApprove: (requestId: string, approvalNote: string) => Promise<void>;
}

export const LeaveApproveModal: React.FC<LeaveApproveModalProps> = ({
  request,
  isOpen,
  onClose,
  onConfirmApprove
}) => {
  const [approvalNote, setApprovalNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !request) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirmApprove(request.id, approvalNote);
      setApprovalNote('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />

      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 p-6 space-y-5 animate-fadeIn">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              ✓
            </span>
            Confirm Leave Approval
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            ✕
          </button>
        </div>

        {/* Request Summary Box */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">Employee:</span>
            <span className="font-semibold text-slate-200">{request.employeeName} ({request.employeeCode})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Leave Type:</span>
            <span className="font-semibold text-indigo-300">{request.leaveTypeName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Duration:</span>
            <span className="font-mono text-slate-200">{request.startDate} to {request.endDate} ({request.totalDays} day{request.totalDays > 1 ? 's' : ''})</span>
          </div>
        </div>

        {/* Balance Change Preview */}
        <div className="p-4 bg-gradient-to-r from-emerald-950/30 to-teal-950/30 border border-emerald-500/20 rounded-xl text-xs flex justify-between items-center">
          <div>
            <span className="text-slate-400 block">Current Balance</span>
            <span className="font-bold text-slate-100 text-sm font-mono">{request.currentBalance} days</span>
          </div>
          <div className="text-rose-400 font-bold text-sm">- {request.totalDays} days</div>
          <div className="text-right">
            <span className="text-slate-400 block">Balance After Approval</span>
            <span className="font-bold text-emerald-400 text-sm font-mono">{request.balanceAfterApp} days</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Approval Note <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={approvalNote}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setApprovalNote(e.target.value)}
              placeholder="Add an optional remark for the employee..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/50 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : 'Confirm Approval'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveApproveModal;
