import React from 'react';
import { Attendance, AuditLog } from '../types/attendance';

interface AuditHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  record: Attendance | null;
  logs: AuditLog[];
  loading?: boolean;
}

export const AuditHistoryDrawer: React.FC<AuditHistoryDrawerProps> = ({
  isOpen,
  onClose,
  record,
  logs,
  loading = false
}) => {
  if (!isOpen || !record) return null;

  const recordLogs = logs.filter((log) => log.attendanceId === record.id);

  const formatActionTitle = (action: string, fieldName?: string) => {
    switch (action) {
      case 'ADD_MISSING_CLOCK_OUT':
        return 'Clock-out Updated';
      case 'CHANGE_WORK_MODE':
        return 'Work Mode Changed';
      case 'MARK_LEAVE':
        return 'Marked as Leave';
      case 'REMOVE_LEAVE':
        return 'Leave Removed';
      case 'CHANGE_STATUS':
        return 'Status Modified';
      case 'EDIT_ATTENDANCE':
      default:
        return fieldName ? `${fieldName} Modified` : 'Attendance Edited';
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 text-slate-100 shadow-2xl flex flex-col pointer-events-auto">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Audit History Log
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                {record.employeeName} ({record.employeeId})
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Immutability Banner */}
          <div className="bg-indigo-500/10 border-b border-indigo-500/20 px-5 py-2.5 flex items-center gap-2 text-xs text-indigo-300">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Audit records are server-timestamped & immutable.</span>
          </div>

          {/* Logs List Container */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {loading ? (
              <div className="text-center py-12 text-slate-400 text-sm flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
                </svg>
                Loading audit logs...
              </div>
            ) : recordLogs.length === 0 ? (
              <div className="text-center py-12 px-4 bg-slate-950/40 rounded-2xl border border-slate-800/80">
                <svg className="w-10 h-10 text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h4 className="text-sm font-semibold text-slate-300">No Audit Logs Found</h4>
                <p className="text-xs text-slate-500 mt-1">
                  No manual modifications have been made to this attendance record yet.
                </p>
              </div>
            ) : (
              <div className="relative border-l-2 border-slate-800 ml-3 space-y-6">
                {recordLogs.map((log) => (
                  <div key={log.id} className="relative pl-6">
                    {/* Timeline Node Dot */}
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-indigo-500" />

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/90 shadow-lg space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                          {formatActionTitle(log.action, log.fieldName)}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {log.id}
                        </span>
                      </div>

                      {/* Values Diff Box */}
                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60 font-mono">
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase">Old Value</span>
                          <span className="text-slate-400 font-medium truncate block">
                            {log.oldValue || '—'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-emerald-500 block uppercase">New Value</span>
                          <span className="text-emerald-400 font-medium truncate block">
                            {log.newValue || '—'}
                          </span>
                        </div>
                      </div>

                      {/* Reason */}
                      <div className="text-xs text-slate-300 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/40 leading-relaxed">
                        <span className="text-[10px] font-semibold text-rose-400 block uppercase mb-0.5">Reason:</span>
                        "{log.reason}"
                      </div>

                      {/* Metadata Footer */}
                      <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 space-y-1">
                        <div className="flex justify-between">
                          <span>Edited by: <strong className="text-slate-200">{log.editedByName}</strong></span>
                          <span className="text-indigo-400 font-semibold">{log.editedByRole}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Date & time:</span>
                          <span className="font-mono">{formatDate(log.createdAt)}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 pt-1 font-mono">
                          <span>IP: {log.ipAddress}</span>
                          <span className="truncate max-w-[180px]">{log.deviceInfo}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditHistoryDrawer;
