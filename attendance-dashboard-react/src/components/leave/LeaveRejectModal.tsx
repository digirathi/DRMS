import React, { useState } from 'react';
import { LeaveRequest } from '../../types/leave';

interface LeaveRejectModalProps {
  request: LeaveRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmReject: (requestId: string, reason: string) => Promise<void>;
}

export const LeaveRejectModal: React.FC<LeaveRejectModalProps> = ({
  request,
  isOpen,
  onClose,
  onConfirmReject
}) => {
  const [reason, setReason] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !request) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = reason.trim();
    if (!trimmed || trimmed.length < 5 || trimmed.length > 500) {
      setErrorMsg('Rejection reason is required and must be between 5 and 500 characters.');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await onConfirmReject(request.id, trimmed);
      setReason('');
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
            <span className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm">
              ✕
            </span>
            Reject Leave Request
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            ✕
          </button>
        </div>

        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs space-y-1">
          <p className="text-slate-300">
            Rejecting request for <strong className="text-slate-100">{request.employeeName}</strong> ({request.leaveTypeName}, {request.totalDays} day{request.totalDays > 1 ? 's' : ''}).
          </p>
          <p className="text-slate-500">The employee will be notified immediately along with your reason.</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Rejection Reason <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setReason(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="State the explicit reason for rejecting this leave request (min 5 characters)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>Must be concise and clear</span>
              <span>{reason.trim().length} / 500</span>
            </div>
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
              className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-950/50 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : 'Confirm Rejection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveRejectModal;
