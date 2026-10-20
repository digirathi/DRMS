import React from 'react';
import { LeaveRequest } from '../../types/leave';
import { LeaveStatusBadge, DayTypeBadge } from './LeaveStatusBadge';

interface LeaveDetailsDrawerProps {
  request: LeaveRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onApproveClick: (request: LeaveRequest) => void;
  onRejectClick: (request: LeaveRequest) => void;
  onRequestInfoClick: (request: LeaveRequest) => void;
  onCancelActionClick?: (request: LeaveRequest, action: 'APPROVE' | 'REJECT') => void;
}

export const LeaveDetailsDrawer: React.FC<LeaveDetailsDrawerProps> = ({
  request,
  isOpen,
  onClose,
  onApproveClick,
  onRejectClick,
  onRequestInfoClick,
  onCancelActionClick
}) => {
  if (!isOpen || !request) return null;

  const isPending = request.status === 'PENDING_APPROVAL';
  const isCancellationRequested = request.status === 'CANCELLATION_REQUESTED';
  const isProcessed = !isPending && !isCancellationRequested && request.status !== 'MORE_INFORMATION_REQUIRED';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-fadeIn"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl text-slate-100 flex flex-col justify-between overflow-y-auto">
          {/* Header */}
          <div className="p-6 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between sticky top-0 z-10 backdrop-blur">
            <div>
              <span className="text-xs text-indigo-400 font-mono font-semibold uppercase tracking-wider">
                Leave Request Details
              </span>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-3 mt-1">
                {request.employeeName}
                <LeaveStatusBadge status={request.status} />
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-6 space-y-6 flex-1">
            {/* Warnings: Attendance Conflict or Overlapping Leave */}
            {request.hasAttendanceConflict && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-start gap-3">
                <svg className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <div>
                  <strong className="block text-sm font-bold text-rose-200 mb-0.5">
                    Attendance Activity Conflict Detected
                  </strong>
                  This employee already has clock-in or clock-out records on the requested dates. Correct the attendance record before approving full-day leave.
                </div>
              </div>
            )}

            {request.hasOverlappingLeave && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="m13 2-2 10h5l-4 10 2-10h-5l4-10Z"/>
                </svg>
                <div>
                  <strong className="block text-sm font-bold text-amber-200 mb-0.5">
                    Overlapping Team Leave Warning
                  </strong>
                  Other team members in {request.department} are also on leave during this period.
                </div>
              </div>
            )}

            {/* Employee Information Section */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Employee Profile
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Employee ID / Code</span>
                  <span className="font-mono text-slate-200 font-semibold">{request.employeeCode}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Department</span>
                  <span className="text-slate-200 font-semibold">{request.department}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Joining Date</span>
                  <span className="text-slate-300">{request.joiningDate || '2024-03-15'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Office Location</span>
                  <span className="text-slate-300">{request.officeLocationName || 'Bangalore HQ'}</span>
                </div>
              </div>
            </div>

            {/* Leave Details & Duration */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Leave Request Parameters
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Leave Type</span>
                  <span className="font-semibold text-indigo-300 text-sm">{request.leaveTypeName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Pay Status</span>
                  <span className={`font-semibold ${request.isPaid ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {request.isPaid ? 'Paid Leave' : 'Unpaid Leave (LWP)'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Dates</span>
                  <span className="font-mono text-slate-200">{request.startDate} to {request.endDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Day Type & Duration</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <DayTypeBadge dayType={request.dayType} />
                    <span className="font-bold text-slate-100">{request.totalDays} day{request.totalDays > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Balance Calculation Box */}
            <div className="bg-gradient-to-r from-indigo-950/40 to-purple-950/40 border border-indigo-500/20 p-4 rounded-xl flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-400 block">Current Available Balance</span>
                <span className="text-lg font-bold text-slate-100 font-mono">{request.currentBalance} days</span>
              </div>
              <div className="text-center text-indigo-400 font-bold text-sm">
                - {request.totalDays} days
              </div>
              <div className="text-right">
                <span className="text-slate-400 block">Balance After Approval</span>
                <span className={`text-lg font-bold font-mono ${request.balanceAfterApp < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {request.balanceAfterApp} days
                </span>
              </div>
            </div>

            {/* Employee Reason */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Employee Reason
              </h4>
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed font-medium">
                "{request.reason}"
              </div>
            </div>

            {/* Handover & Emergency Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block font-semibold">Handover Delegate</span>
                <p className="text-slate-200 font-medium">{request.handoverPerson || 'None specified'}</p>
                {request.handoverNote && <p className="text-[11px] text-slate-400 italic">"{request.handoverNote}"</p>}
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block font-semibold">Emergency Contact</span>
                <p className="text-slate-200 font-mono font-medium">{request.emergencyContact || 'N/A'}</p>
              </div>
            </div>

            {/* Supporting Attachment */}
            {request.attachmentName && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Supporting Attachment
                </h4>
                <a
                  href={request.attachmentUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 rounded-xl text-xs text-indigo-300 font-medium transition"
                >
                  <span className="text-lg">📎</span>
                  <span className="truncate">{request.attachmentName}</span>
                  <span className="ml-auto text-[11px] text-slate-400 underline">View File</span>
                </a>
              </div>
            )}

            {/* Processed Info (if processed) */}
            {isProcessed && (
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Processed By:</span>
                  <span className="text-slate-200 font-bold">{request.processedByName} ({request.processedByRole})</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Processed At:</span>
                  <span className="text-slate-300 font-mono">{request.processedAt ? new Date(request.processedAt).toLocaleString() : 'N/A'}</span>
                </div>
                {request.approvalNote && (
                  <div className="pt-2 border-t border-slate-800 text-slate-300">
                    <span className="text-slate-500 block">Approval Note:</span>
                    "{request.approvalNote}"
                  </div>
                )}
                {request.rejectionReason && (
                  <div className="pt-2 border-t border-slate-800 text-rose-300">
                    <span className="text-slate-500 block">Rejection Reason:</span>
                    "{request.rejectionReason}"
                  </div>
                )}
              </div>
            )}

            {/* Approval Action History */}
            {request.actions && request.actions.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Approval Timeline & History
                </h4>
                <div className="space-y-2 border-l-2 border-slate-800 pl-4">
                  {request.actions.map((act) => (
                    <div key={act.id} className="text-xs space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200">{act.actorName}</span>
                        <span className="text-[10px] text-indigo-400 font-mono">({act.actorRole})</span>
                        <span className="text-[10px] text-slate-500 font-mono ml-auto">
                          {new Date(act.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-400">{act.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Drawer Sticky Footer with Single-Level Approval Actions */}
          <div className="p-6 bg-slate-950 border-t border-slate-800 sticky bottom-0 z-10">
            {isPending ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onApproveClick(request)}
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/50 transition flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Approve Request</span>
                </button>
                <button
                  onClick={() => onRejectClick(request)}
                  className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-950/50 transition flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  <span>Reject Request</span>
                </button>
                <button
                  onClick={() => onRequestInfoClick(request)}
                  className="py-2.5 px-4 bg-sky-900/40 hover:bg-sky-800/60 border border-sky-500/30 text-sky-300 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <span>Request Info</span>
                </button>
              </div>
            ) : isCancellationRequested ? (
              <div className="flex gap-3">
                <button
                  onClick={() => onCancelActionClick && onCancelActionClick(request, 'APPROVE')}
                  className="flex-1 py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-lg transition"
                >
                  Approve Cancellation
                </button>
                <button
                  onClick={() => onCancelActionClick && onCancelActionClick(request, 'REJECT')}
                  className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
                >
                  Reject Cancellation
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Finalized by {request.processedByName || 'Authorized Approver'}</span>
                <span className="px-3 py-1 bg-slate-800 text-slate-400 rounded-lg font-mono">
                  Actions Closed
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveDetailsDrawer;
