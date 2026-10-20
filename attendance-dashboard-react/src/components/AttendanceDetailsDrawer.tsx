import React from 'react';
import { Attendance, AuditLog, User } from '../types/attendance';
import { formatDateDisplay, formatTimeDisplay, calculateWorkingHours } from '../utils/attendanceValidation';

interface AttendanceDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  record: Attendance | null;
  auditLogs: AuditLog[];
  user: User | null;
  onEdit?: () => void;
}

export const AttendanceDetailsDrawer: React.FC<AttendanceDetailsDrawerProps> = ({
  isOpen,
  onClose,
  record,
  auditLogs,
  user,
  onEdit
}) => {
  if (!isOpen || !record) return null;

  const isAdmin = user && ['SUPER_ADMIN', 'HR'].includes(user.role);
  const relevantLogs = auditLogs.filter((log) => log.attendanceId === record.id);
  const workingHours = record.workingHoursFormatted || calculateWorkingHours(record.clockInAt, record.clockOutAt, record.status);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        {/* Backdrop */}
        <div
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        />

        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-lg transform bg-[#090d21] border-l border-slate-800 text-slate-100 shadow-2xl transition-all duration-300">
            <div className="flex h-full flex-col justify-between overflow-y-auto">
              
              {/* Header */}
              <div className="border-b border-slate-800 p-6 flex justify-between items-center bg-slate-950/60 sticky top-0 z-10 backdrop-blur-md">
                <div>
                  <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <span>{record.employeeName}</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono flex items-center gap-2">
                    <span>ID: {record.employeeId}</span>
                    <span>•</span>
                    <span className="text-indigo-400 font-semibold">{record.department}</span>
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-xl p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800 cursor-pointer focus:outline-none"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 flex-1">
                {/* Attendance Summary Banner */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-inner">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Attendance Status
                    </span>
                    <span className="text-sm font-extrabold text-indigo-300">
                      {record.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      WORKING HOURS
                    </span>
                    <span className="text-base font-mono font-bold text-emerald-400">
                      {workingHours}
                    </span>
                  </div>
                </div>

                {/* Primary Record Details */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 border-b border-slate-800/80 pb-1.5">
                    Record Info & Timings
                  </h3>
                  <div className="grid grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Date</span>
                      <span className="font-semibold text-slate-200">{formatDateDisplay(record.date || record.createdAt)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Work Mode</span>
                      <span className="font-semibold text-indigo-300">{record.workMode || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Clock In</span>
                      <span className="font-mono text-emerald-400 font-semibold">{formatTimeDisplay(record.clockInAt)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Clock Out</span>
                      <span className="font-mono text-amber-400 font-semibold">{formatTimeDisplay(record.clockOutAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Verification & Location */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 border-b border-slate-800/80 pb-1.5">
                    Verification & Location
                  </h3>
                  <div className="grid grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Verification Status</span>
                      <span className="font-semibold text-slate-200">{record.verification || 'Not Required'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Office Location</span>
                      <span className="font-semibold text-slate-200">{record.officeLocationName || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">IP Address</span>
                      <span className="font-mono text-slate-300">{record.ipAddress || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Device / Browser</span>
                      <span className="text-slate-300 truncate block">{record.deviceInfo || '—'}</span>
                    </div>
                  </div>
                </div>

                {/* Correction Status & Remarks */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 border-b border-slate-800/80 pb-1.5">
                    Correction & Admin Remarks
                  </h3>
                  <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 text-xs space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Correction Request Status:</span>
                      <span className="font-semibold text-amber-300">{record.correctionStatus || 'NO_REQUEST'}</span>
                    </div>
                    {record.adminRemark && (
                      <div>
                        <span className="text-slate-400 block mb-1">Admin Remark:</span>
                        <p className="text-slate-200 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                          {record.adminRemark}
                        </p>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
                      <span>Last Modified By: {record.lastModifiedBy || '—'}</span>
                      <span>{formatDateDisplay(record.lastModifiedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Audit History Summary */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 border-b border-slate-800/80 pb-1.5">
                    Audit Log History ({relevantLogs.length})
                  </h3>
                  {relevantLogs.length === 0 ? (
                    <p className="text-xs text-slate-500 italic bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                      No audit history logged for this attendance entry.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {relevantLogs.map((log) => (
                        <div key={log.id} className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                          <div className="flex justify-between items-center font-semibold text-slate-200">
                            <span>{log.action.replace(/_/g, ' ')}</span>
                            <span className="text-[10px] text-slate-500">{new Date(log.createdAt).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            Reason: <span className="text-slate-300">{log.reason}</span>
                          </p>
                          <div className="text-[10px] text-slate-500 flex justify-between pt-1 border-t border-slate-800/50">
                            <span>Edited by: {log.editedByName} ({log.editedByRole})</span>
                            <span>{log.ipAddress}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-slate-800 p-4 bg-slate-950/80 flex justify-end gap-3 sticky bottom-0 backdrop-blur-md">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  Close
                </button>
                {isAdmin && onEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onEdit();
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-md shadow-indigo-600/30"
                  >
                    Edit Record
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
