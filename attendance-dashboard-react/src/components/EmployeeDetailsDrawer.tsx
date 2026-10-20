import React from 'react';
import { Attendance, AuditLog, User, VerificationStatus } from '../types/attendance';

interface EmployeeDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  record: Attendance | null;
  auditLogs: AuditLog[];
  user: User | null;
  onEdit: () => void;
}

export const EmployeeDetailsDrawer: React.FC<EmployeeDetailsDrawerProps> = ({
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

  const formatDateTime = (isoString: string | null) => {
    if (!isoString) return '—';
    return new Date(isoString).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const getWorkingHours = () => {
    if (record.status === 'ON_LEAVE' || record.status === 'WEEK_OFF' || record.status === 'HOLIDAY' || record.status === 'NOT_CLOCKED_IN') {
      return '00h 00m';
    }
    if (!record.clockInAt) return '00h 00m';
    const start = new Date(record.clockInAt).getTime();
    const end = record.clockOutAt ? new Date(record.clockOutAt).getTime() : Date.now();
    const diffMs = Math.max(0, end - start);
    const diffMins = Math.floor(diffMs / 60000);
    const hrs = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${String(hrs).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m`;
  };

  const getVerificationLabel = (v: VerificationStatus) => {
    switch (v) {
      case 'IP_VERIFIED':
        return 'IP Verified';
      case 'GPS_VERIFIED':
        return 'GPS Verified';
      case 'IP_AND_GPS_VERIFIED':
        return 'IP + GPS Verified';
      case 'VERIFICATION_FAILED':
        return 'Verification Failed';
      case 'NOT_VERIFIED':
        return 'Not Verified';
      case 'NOT_REQUIRED':
        return 'Not Required';
      default:
        return '—';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        {/* Backdrop */}
        <div
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        />

        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-md transform bg-[#070a19] border-l border-slate-800 text-slate-100 shadow-2xl transition-all duration-300">
            <div className="flex h-full flex-col justify-between overflow-y-auto">
              
              {/* Header */}
              <div className="border-b border-slate-800 p-6 flex justify-between items-center bg-slate-950/40">
                <div>
                  <h2 className="text-lg font-semibold text-slate-100">
                    Attendance Profile
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    Employee ID: {record.employeeId}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 p-6 space-y-6">
                
                {/* Profile Card */}
                <div className="flex items-center gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-100 font-bold text-lg">
                    {record.employeeName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100">{record.employeeName}</h3>
                    <p className="text-xs text-slate-400">{record.department}</p>
                  </div>
                </div>

                {/* Grid stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/40 border border-slate-800/80 p-3.5 rounded-xl">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1">
                      Status
                    </span>
                    <span className="text-sm font-semibold text-slate-200">{record.status.replaceAll('_', ' ')}</span>
                  </div>
                  <div className="bg-slate-900/40 border border-slate-800/80 p-3.5 rounded-xl">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1">
                      Work Mode
                    </span>
                    <span className="text-sm font-semibold text-slate-200">{record.workMode || '—'}</span>
                  </div>
                </div>

                {/* Clocks timeline */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Timeline Logs
                  </h4>
                  <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Clock In</span>
                      <strong className="font-mono text-slate-200">{formatDateTime(record.clockInAt)}</strong>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Clock Out</span>
                      <strong className="font-mono text-slate-200">{formatDateTime(record.clockOutAt)}</strong>
                    </div>
                    <div className="border-t border-slate-850 pt-3 flex justify-between items-center text-sm font-semibold">
                      <span className="text-slate-400">Total Working Hours</span>
                      <strong className="font-mono text-indigo-400">{getWorkingHours()}</strong>
                    </div>
                  </div>
                </div>

                {/* Location and Verification details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Verification detail
                  </h4>
                  <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl space-y-3.5 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Verification Status</span>
                      <span className="font-semibold text-slate-200">{getVerificationLabel(record.verification)}</span>
                    </div>
                    {record.workMode === 'OFFICE' && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Office Location</span>
                          <span className="text-slate-200">{record.officeLocationName || 'HQ Noida Office'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Logged IP IPAddress</span>
                          <span className="font-mono text-slate-200">{record.ipAddress || '—'}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Remarks */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Admin Remarks
                  </h4>
                  <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl text-sm text-slate-300 italic min-h-[50px]">
                    {record.adminRemark || 'No remarks recorded.'}
                  </div>
                </div>

                {/* Audit history logs */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Audit Edit History
                  </h4>
                  {relevantLogs.length === 0 ? (
                    <p className="text-xs text-slate-500 italic pl-2">No past modifications found.</p>
                  ) : (
                    <div className="relative border-l border-slate-800 pl-4 space-y-5">
                      {relevantLogs.map((log) => (
                        <div key={log.id} className="relative">
                          <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-slate-950" />
                          <div className="text-xs text-slate-400 font-semibold mb-1">
                            {new Date(log.createdAt).toLocaleString()}
                          </div>
                          <div className="bg-slate-900/20 border border-slate-850 p-3 rounded-xl text-xs leading-relaxed text-slate-300">
                            <div>
                              Modified by <strong>{log.editedByName}</strong> ({log.editedByRole}):
                            </div>
                            <div className="mt-1 font-mono text-slate-400 bg-slate-950 p-1.5 rounded border border-slate-900 overflow-x-auto">
                              {log.oldValue} &rarr; {log.newValue}
                            </div>
                            <div className="mt-2 text-slate-400">
                              <strong>Reason:</strong> {log.reason}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Footer */}
              <div className="border-t border-slate-800 p-6 bg-slate-950/40 flex gap-4">
                {isAdmin && (
                  <button
                    onClick={onEdit}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-slate-100 text-sm font-semibold rounded-xl py-3 border border-indigo-500 cursor-pointer shadow-lg transition-colors flex items-center justify-center gap-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Attendance
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-semibold rounded-xl py-3 border border-slate-800 cursor-pointer transition-colors focus:ring-1 focus:ring-slate-500 focus:outline-none"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EmployeeDetailsDrawer;
