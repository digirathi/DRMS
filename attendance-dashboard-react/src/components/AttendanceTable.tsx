import React, { useEffect, useState } from 'react';
import { Attendance, AttendanceStatus, VerificationStatus, User } from '../types/attendance';
import { ActionMenuDropdownPortal, ActionType } from './ActionMenuDropdownPortal';
import { calculateWorkingHours } from '../utils/attendanceValidation';

interface AttendanceTableProps {
  records: Attendance[];
  onViewDetails: (record: Attendance) => void;
  onSelectAction: (action: ActionType, record: Attendance) => void;
  onSort: (field: string) => void;
  sortField: string;
  sortOrder: 'asc' | 'desc';
  selectedId: string | null;
  user: User | null;
  onResetFilters?: () => void;
}

const LiveWorkingHours: React.FC<{ clockInAt: string }> = ({ clockInAt }) => {
  const [elapsed, setElapsed] = useState('00h 00m');

  useEffect(() => {
    const calculateHours = () => {
      const start = new Date(clockInAt).getTime();
      const now = Date.now();
      const diffMs = Math.max(0, now - start);
      const diffMins = Math.floor(diffMs / 60000);
      const hrs = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${String(hrs).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m`;
    };

    setElapsed(calculateHours());
    const interval = setInterval(() => {
      setElapsed(calculateHours());
    }, 60000);

    return () => clearInterval(interval);
  }, [clockInAt]);

  return <span className="font-mono text-emerald-400 font-bold">{elapsed}</span>;
};

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  records,
  onViewDetails,
  onSelectAction,
  onSort,
  sortField,
  sortOrder,
  selectedId,
  user,
  onResetFilters
}) => {
  const isHRorAdmin = Boolean(user && ['SUPER_ADMIN', 'HR'].includes(user.role));

  const getStatusBadge = (status: AttendanceStatus) => {
    const baseClass =
      'inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-center h-6 select-none whitespace-nowrap border';

    switch (status) {
      case 'CLOCKED_IN':
        return (
          <span className={`${baseClass} bg-emerald-500/10 text-emerald-400 border-emerald-500/20`}>
            Clocked In
          </span>
        );
      case 'CLOCKED_OUT':
        return (
          <span className={`${baseClass} bg-blue-500/10 text-blue-400 border-blue-500/20`}>
            Clocked Out
          </span>
        );
      case 'NOT_CLOCKED_IN':
        return (
          <span className={`${baseClass} bg-slate-800 text-slate-400 border-slate-700/50`}>
            Not Clocked In
          </span>
        );
      case 'MISSING_CLOCK_OUT':
        return (
          <span className={`${baseClass} bg-red-500/10 text-red-400 border-red-500/20 animate-pulse`}>
            Missing Clock Out
          </span>
        );
      case 'ON_LEAVE':
        return (
          <span className={`${baseClass} bg-violet-500/10 text-violet-400 border-violet-500/20`}>
            On Leave
          </span>
        );
      case 'WEEK_OFF':
        return (
          <span className={`${baseClass} bg-purple-500/10 text-purple-400 border-purple-500/20`}>
            Week Off
          </span>
        );
      case 'HOLIDAY':
        return (
          <span className={`${baseClass} bg-cyan-500/10 text-cyan-400 border-cyan-500/20`}>
            Holiday
          </span>
        );
      default:
        return null;
    }
  };

  const getWorkModeBadge = (mode: Attendance['workMode'], status: AttendanceStatus) => {
    if (status === 'ON_LEAVE') {
      return <span className="text-slate-500">—</span>;
    }

    const baseClass =
      'inline-flex items-center justify-center px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider text-center h-6 w-20 whitespace-nowrap border';

    if (mode === 'OFFICE') {
      return (
        <span className={`${baseClass} bg-cyan-500/10 text-cyan-400 border-cyan-500/20`}>
          Office
        </span>
      );
    }
    if (mode === 'WFH') {
      return (
        <span className={`${baseClass} bg-purple-500/10 text-purple-400 border-purple-500/20`}>
          WFH
        </span>
      );
    }
    return <span className="text-slate-500">—</span>;
  };

  const getVerificationBadge = (
    verification: VerificationStatus,
    mode: Attendance['workMode'],
    status: AttendanceStatus
  ) => {
    if (
      status === 'NOT_CLOCKED_IN' ||
      status === 'ON_LEAVE' ||
      status === 'WEEK_OFF' ||
      status === 'HOLIDAY'
    ) {
      return <span className="text-slate-500">—</span>;
    }

    const baseClass =
      'inline-flex items-center justify-center px-2.5 py-0.5 rounded text-xs font-medium whitespace-nowrap border select-none';

    if (mode === 'WFH') {
      return (
        <span className={`${baseClass} bg-slate-800/40 text-slate-400 border-slate-700/30`}>
          Not Required
        </span>
      );
    }

    switch (verification) {
      case 'IP_VERIFIED':
        return (
          <span className={`${baseClass} bg-blue-500/10 text-blue-400 border-blue-500/20`}>
            IP Verified
          </span>
        );
      case 'GPS_VERIFIED':
        return (
          <span className={`${baseClass} bg-cyan-500/10 text-cyan-400 border-cyan-500/20`}>
            GPS Verified
          </span>
        );
      case 'IP_AND_GPS_VERIFIED':
        return (
          <span className={`${baseClass} bg-emerald-500/10 text-emerald-400 border-emerald-500/20`}>
            IP + GPS Verified
          </span>
        );
      case 'VERIFICATION_FAILED':
        return (
          <span className={`${baseClass} bg-red-500/10 text-red-400 border-red-500/20 animate-bounce`}>
            Verification Failed
          </span>
        );
      case 'NOT_VERIFIED':
        return (
          <span className={`${baseClass} bg-amber-500/10 text-amber-400 border-amber-500/20`}>
            Not Verified
          </span>
        );
      default:
        return <span className="text-slate-500">—</span>;
    }
  };

  const renderWorkingHours = (record: Attendance) => {
    if (record.status === 'ON_LEAVE') {
      return <span className="font-mono text-slate-500">00h 00m</span>;
    }
    if (record.status === 'CLOCKED_IN' && record.clockInAt) {
      return <LiveWorkingHours clockInAt={record.clockInAt} />;
    }
    const formatted = calculateWorkingHours(record.clockInAt, record.clockOutAt, record.status);
    return <span className="font-mono text-slate-300 font-medium">{formatted}</span>;
  };

  const formatTime = (isoString: string | null, status: AttendanceStatus) => {
    if (status === 'ON_LEAVE' || !isoString) return '—';
    try {
      return new Date(isoString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return '—';
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortField !== field) {
      return (
        <svg className="w-3.5 h-3.5 text-slate-600 ml-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
      );
    }
    return sortOrder === 'asc' ? (
      <svg className="w-3.5 h-3.5 text-indigo-400 ml-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-3.5 h-3.5 text-indigo-400 ml-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  if (records.length === 0) {
    return (
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center shadow-lg">
        <svg
          className="w-12 h-12 text-slate-600 mx-auto mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
        <h3 className="text-lg font-semibold text-slate-200">No employees found matching your search.</h3>
        <p className="text-slate-400 text-sm mt-1">
          Try adjusting your search term or clearing active card filters.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="mt-5 bg-indigo-600 hover:bg-indigo-500 text-slate-100 font-semibold text-sm rounded-xl py-2 px-5 cursor-pointer shadow-lg transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[#070a19] border border-slate-800 rounded-2xl overflow-visible shadow-2xl backdrop-blur-sm">
      <div className="overflow-x-auto min-h-[350px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/90 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider sticky top-0 z-10 select-none">
              <th className="py-4 px-5" style={{ minWidth: '170px' }}>
                <button
                  onClick={() => onSort('employeeName')}
                  className="flex items-center hover:text-slate-200 focus:outline-none cursor-pointer rounded"
                >
                  Employee {renderSortIcon('employeeName')}
                </button>
              </th>
              <th className="py-4 px-4" style={{ minWidth: '120px' }}>Employee ID</th>
              <th className="py-4 px-4" style={{ minWidth: '130px' }}>Department</th>
              <th className="py-4 px-4" style={{ minWidth: '110px' }}>Work Mode</th>
              <th className="py-4 px-4" style={{ minWidth: '110px' }}>
                <button
                  onClick={() => onSort('clockInAt')}
                  className="flex items-center hover:text-slate-200 focus:outline-none cursor-pointer rounded"
                >
                  Clock In {renderSortIcon('clockInAt')}
                </button>
              </th>
              <th className="py-4 px-4" style={{ minWidth: '110px' }}>
                <button
                  onClick={() => onSort('clockOutAt')}
                  className="flex items-center hover:text-slate-200 focus:outline-none cursor-pointer rounded"
                >
                  Clock Out {renderSortIcon('clockOutAt')}
                </button>
              </th>
              <th className="py-4 px-4" style={{ minWidth: '130px' }}>
                <button
                  onClick={() => onSort('workingHours')}
                  className="flex items-center hover:text-slate-200 focus:outline-none cursor-pointer rounded"
                >
                  Working Hours {renderSortIcon('workingHours')}
                </button>
              </th>
              <th className="py-4 px-4" style={{ minWidth: '150px' }}>Status</th>
              <th className="py-4 px-4" style={{ minWidth: '140px' }}>Verification</th>
              <th className="py-4 px-5 text-right" style={{ minWidth: '170px' }}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {records.map((record) => {
              const isSelected = selectedId === record.id;

              return (
                <tr
                  key={record.id}
                  className={`transition-colors group min-h-[64px] ${
                    isSelected
                      ? 'bg-indigo-500/10 hover:bg-indigo-500/15'
                      : 'hover:bg-slate-800/30'
                  }`}
                >
                  {/* Employee Name */}
                  <td className="py-3.5 px-5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-100 font-bold text-sm shrink-0">
                      {record.employeeName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">
                        {record.employeeName}
                      </div>
                      <div className="text-[11px] text-slate-400 sm:hidden">{record.employeeId}</div>
                    </div>
                  </td>

                  {/* Employee ID */}
                  <td className="py-3.5 px-4 text-xs font-mono font-semibold text-slate-300">
                    {record.employeeId}
                  </td>

                  {/* Department */}
                  <td className="py-3.5 px-4 text-sm text-slate-300">
                    {record.department}
                  </td>

                  {/* Work Mode */}
                  <td className="py-3.5 px-4">
                    {getWorkModeBadge(record.workMode, record.status)}
                  </td>

                  {/* Clock In */}
                  <td className="py-3.5 px-4 text-sm font-mono text-slate-300 whitespace-nowrap">
                    {formatTime(record.clockInAt, record.status)}
                  </td>

                  {/* Clock Out */}
                  <td className="py-3.5 px-4 text-sm font-mono text-slate-300 whitespace-nowrap">
                    {formatTime(record.clockOutAt, record.status)}
                  </td>

                  {/* Working Hours */}
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    {renderWorkingHours(record)}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(record.status)}
                  </td>

                  {/* Verification */}
                  <td className="py-3.5 px-4">
                    {getVerificationBadge(record.verification, record.workMode, record.status)}
                  </td>

                  {/* Actions Dropdown Menu */}
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <ActionMenuDropdownPortal
                      record={record}
                      onViewDetails={onViewDetails}
                      onSelectAction={onSelectAction}
                      isHRorAdmin={isHRorAdmin}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;
