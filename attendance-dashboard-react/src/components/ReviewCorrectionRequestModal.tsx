import React, { useState } from 'react';
import { CorrectionRequest, User } from '../types/attendance';
import { formatDateDisplay } from '../utils/attendanceValidation';

interface ReviewCorrectionRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: CorrectionRequest | null;
  reviewer: User;
  onApprove: (requestId: string, reviewNote: string) => Promise<void>;
  onReject: (requestId: string, rejectionReason: string) => Promise<void>;
  onRequestMoreInfo: (requestId: string, message: string) => Promise<void>;
}

export const ReviewCorrectionRequestModal: React.FC<ReviewCorrectionRequestModalProps> = ({
  isOpen,
  onClose,
  request,
  reviewer,
  onApprove,
  onReject,
  onRequestMoreInfo
}) => {
  const [activeAction, setActiveAction] = useState<'NONE' | 'APPROVE' | 'REJECT' | 'MORE_INFO'>('NONE');
  const [inputText, setInputText] = useState('');
  const [errorText, setErrorText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !request) return null;

  const handleActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    const trimmed = inputText.trim();

    if (!trimmed) {
      if (activeAction === 'APPROVE') setErrorText('Review note is required.');
      else if (activeAction === 'REJECT') setErrorText('Rejection reason is required.');
      else if (activeAction === 'MORE_INFO') setErrorText('Message to employee is required.');
      return;
    }

    if (trimmed.length < 5) {
      setErrorText('Note must be at least 5 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      if (activeAction === 'APPROVE') {
        await onApprove(request.id, trimmed);
      } else if (activeAction === 'REJECT') {
        await onReject(request.id, trimmed);
      } else if (activeAction === 'MORE_INFO') {
        await onRequestMoreInfo(request.id, trimmed);
      }
      setActiveAction('NONE');
      setInputText('');
      onClose();
    } catch (err: any) {
      setErrorText(err?.message || 'Failed to submit action.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#090d21] border border-slate-800 rounded-3xl p-6 shadow-2xl z-10 text-slate-100 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
              Correction Request Review
            </span>
            <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">
              Request #{request.id}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Employee & Record Overview Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5">Employee</span>
            <span className="font-bold text-slate-100">{request.employeeName}</span>
            <span className="block text-[11px] text-slate-500 font-mono">{request.employeeId}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Department</span>
            <span className="font-semibold text-slate-200">{request.department}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Attendance Date</span>
            <span className="font-semibold text-indigo-300">{formatDateDisplay(request.attendanceDate)}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Correction Type</span>
            <span className="font-semibold text-amber-300">{request.correctionType.replace(/_/g, ' ')}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Submitted At</span>
            <span className="font-mono text-slate-300">{new Date(request.submittedAt).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Status</span>
            <span className="font-bold text-emerald-400">{request.status.replace(/_/g, ' ')}</span>
          </div>
        </div>

        {/* Current vs Requested Value Side-by-Side Comparison */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Requested Modification Comparison
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950/90 border border-slate-800 p-3.5 rounded-2xl text-xs space-y-1">
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">Old / Current Value</span>
              <p className="font-mono text-slate-300 font-semibold">{request.currentValue || '—'}</p>
            </div>
            <div className="bg-indigo-950/40 border border-indigo-500/30 p-3.5 rounded-2xl text-xs space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">New / Requested Value</span>
              <p className="font-mono text-emerald-300 font-semibold">{request.requestedValue}</p>
            </div>
          </div>
        </div>

        {/* Reason & Attachments */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Employee Reason & Attachment
          </h4>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
            <p className="text-slate-200 leading-relaxed font-medium">"{request.reason}"</p>
            {request.attachmentUrl ? (
              <a
                href={request.attachmentUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold underline text-[11px]"
              >
                📎 View Supporting Attachment
              </a>
            ) : (
              <span className="text-slate-500 text-[11px] block">No attachment uploaded.</span>
            )}
          </div>
        </div>

        {/* Active Action Form */}
        {activeAction !== 'NONE' && (
          <form onSubmit={handleActionSubmit} className="bg-slate-950 border border-indigo-500/40 p-4 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center justify-between">
              <span>
                {activeAction === 'APPROVE' && 'Approve Request — Mandatory Review Note'}
                {activeAction === 'REJECT' && 'Reject Request — Mandatory Rejection Reason'}
                {activeAction === 'MORE_INFO' && 'Request More Information — Message to Employee'}
              </span>
              <button
                type="button"
                onClick={() => setActiveAction('NONE')}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Cancel Action
              </button>
            </h4>

            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                activeAction === 'APPROVE'
                  ? 'Enter review note (e.g. Verified system logs and approved clock-out).'
                  : activeAction === 'REJECT'
                  ? 'Enter rejection reason (e.g. Insufficient proof provided).'
                  : 'Enter message to employee (e.g. Please provide medical certificate).'
              }
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              required
            />

            {errorText && <p className="text-xs font-medium text-red-400">⚠️ {errorText}</p>}

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setActiveAction('NONE')}
                className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-800 transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer shadow-md ${
                  activeAction === 'APPROVE'
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25'
                    : activeAction === 'REJECT'
                    ? 'bg-red-600 hover:bg-red-500 shadow-red-600/25'
                    : 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/25'
                }`}
              >
                {submitting ? 'Processing...' : 'Submit Action'}
              </button>
            </div>
          </form>
        )}

        {/* Footer Actions */}
        {activeAction === 'NONE' && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              Close
            </button>

            {request.status === 'PENDING_REVIEW' || request.status === 'MORE_INFO_REQUIRED' ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveAction('MORE_INFO');
                    setInputText('');
                    setErrorText('');
                  }}
                  className="px-3.5 py-2 bg-purple-950/80 border border-purple-800/80 text-purple-300 hover:bg-purple-900 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  Request Info
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveAction('REJECT');
                    setInputText('');
                    setErrorText('');
                  }}
                  className="px-3.5 py-2 bg-red-950/80 border border-red-800/80 text-red-300 hover:bg-red-900 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveAction('APPROVE');
                    setInputText('');
                    setErrorText('');
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-md shadow-emerald-600/30"
                >
                  Approve Request
                </button>
              </div>
            ) : (
              <div className="text-xs font-semibold text-slate-400">
                This request is already finalized (<strong className="text-slate-200">{request.status}</strong>).
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
