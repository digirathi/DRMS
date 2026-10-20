import React, { useState } from 'react';
import { LeaveRequest } from '../../types/leave';

interface LeaveRequestInfoModalProps {
  request: LeaveRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmRequestInfo: (requestId: string, message: string) => Promise<void>;
}

export const LeaveRequestInfoModal: React.FC<LeaveRequestInfoModalProps> = ({
  request,
  isOpen,
  onClose,
  onConfirmRequestInfo
}) => {
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !request) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || trimmed.length < 5) {
      setErrorMsg('Message to employee is required (minimum 5 characters).');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await onConfirmRequestInfo(request.id, trimmed);
      setMessage('');
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
            <span className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </span>
            Request More Information
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            ✕
          </button>
        </div>

        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs">
          <p className="text-slate-300">
            Requesting clarification from <strong className="text-slate-100">{request.employeeName}</strong>. The request status will switch to <span className="text-sky-400 font-bold">MORE_INFORMATION_REQUIRED</span> until the employee responds.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Message to Employee <span className="text-sky-400">*</span>
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setMessage(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Specify missing details, e.g. handover delegation, doctor certificate, or date adjustments..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
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
              className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-950/50 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Send Request to Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveRequestInfoModal;
