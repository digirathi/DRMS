import React from 'react';
import { Attendance, AttendanceStatus, CorrectionStatus, VerificationStatus } from '../types/attendance';
import { ActionMenuDropdownPortal, ActionType } from './ActionMenuDropdownPortal';
import { formatDateDisplay, formatTimeDisplay, calculateWorkingHours } from '../utils/attendanceValidation';

interface AttendanceHistoryTableProps {
  records: Attendance[];
  loading: boolean;
  error?: string;
  onViewDetails: (record: Attendance) => void;
  onSelectAction: (action: ActionType, record: Attendance) => void;
  onOpenCorrectionRequest?: (requestId: string) => void;
  isHRorAdmin: boolean;
  sortField: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (limit: number) => void;
}

export const AttendanceHistoryTable: React.FC<AttendanceHistoryTableProps> = ({
  records,
  loading,
  error,
  onViewDetails,
  onSelectAction,
  onOpenCorrectionRequest,
  isHRorAdmin,
  sortField,
  sortOrder,
  onSort,
  currentPage,
  totalPages,
  totalRecords,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange
}) => {
  // Status Badge Styling Helper (Strictly No-Shift Compatible)
  const renderStatusBadge = (status: AttendanceStatus) => {
    const badgeStyles: Record<string, { bg: string; text: string; border: string; label: string }> = {
      COMPLETED: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', label: 'Completed' },
      CLOCKED_IN: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20', label: 'Clocked In' },
      MISSING_CLOCK_IN: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', label: 'Missing Clock-In' },
      MISSING_CLOCK_OUT: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', label: 'Missing Clock-Out' },
      INCOMPLETE_HOURS: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', label: 'Incomplete Hours' },
      NOT_CLOCKED_IN: { bg: 'bg-slate-800/80', text: 'text-slate-400', border: 'border-slate-700/80', label: 'Not Clocked In' },
      ON_LEAVE: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', label: 'On Leave' },
      WEEK_OFF: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', label: 'Week Off' },
      HOLIDAY: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', label: 'Holiday' },
      MANUALLY_CORRECTED: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', label: 'Manually Corrected' },
      CLOCKED_OUT: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', label: 'Completed' }
    };

    const style = badgeStyles[status] || badgeStyles.NOT_CLOCKED_IN;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${style.bg} ${style.text} ${style.border} whitespace-nowrap`}
      >
        {style.label}
      </span>
    );
  };

  // Work Mode Display Helper
  const renderWorkModeBadge = (mode: string | null | undefined) => {
    if (mode === 'OFFICE') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
          🏢 Office
        </span>
      );
    }
    if (mode === 'WFH') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
          🏠 WFH
        </span>
      );
    }
    return <span className="text-slate-500 text-xs font-mono">—</span>;
  };

  // Verification Display Helper
  const renderVerificationDisplay = (verif: VerificationStatus, mode: string | null | undefined, status: AttendanceStatus) => {
    if (status === 'ON_LEAVE' || status === 'WEEK_OFF' || status === 'HOLIDAY' || !mode) {
      return <span className="text-slate-500 text-xs font-mono">—</span>;
    }
    if (mode === 'WFH') {
      return <span className="text-slate-400 text-xs font-medium">Not Required</span>;
    }
    switch (verif) {
      case 'IP_VERIFIED':
        return <span className="text-emerald-400 text-xs font-medium flex items-center gap-1">🌐 IP Verified</span>;
      case 'GPS_VERIFIED':
        return <span className="text-emerald-400 text-xs font-medium flex items-center gap-1">📍 GPS Verified</span>;
      case 'IP_AND_GPS_VERIFIED':
        return <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">✅ IP + GPS Verified</span>;
      case 'VERIFICATION_FAILED':
        return <span className="text-red-400 text-xs font-medium flex items-center gap-1">❌ Failed</span>;
      default:
        return <span className="text-slate-500 text-xs">Not Verified</span>;
    }
  };

  // Correction Status Display Helper
  const renderCorrectionBadge = (corrStatus?: CorrectionStatus, reqId?: string | null) => {
    if (!corrStatus || corrStatus === 'NO_REQUEST') {
      return <span className="text-slate-500 text-xs font-mono">No Request</span>;
    }

    const map: Record<CorrectionStatus, { bg: string; text: string; label: string }> = {
      NO_REQUEST: { bg: 'bg-slate-800/50', text: 'text-slate-500', label: 'No Request' },
      PENDING_REVIEW: { bg: 'bg-amber-500/15', text: 'text-amber-400', label: 'Pending Review' },
      MORE_INFO_REQUIRED: { bg: 'bg-purple-500/15', text: 'text-purple-300', label: 'More Info Required' },
      APPROVED: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', label: 'Approved' },
      REJECTED: { bg: 'bg-red-500/15', text: 'text-red-400', label: 'Rejected' },
      CANCELLED: { bg: 'bg-slate-800', text: 'text-slate-400', label: 'Cancelled' },
      EXPIRED: { bg: 'bg-slate-800', text: 'text-slate-400', label: 'Expired' }
    };

    const style = map[corrStatus] || map.NO_REQUEST;

    return (
      <button
        type="button"
        onClick={() => reqId && onOpenCorrectionRequest && onOpenCorrectionRequest(reqId)}
        disabled={!reqId}
        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-slate-700/60 ${style.bg} ${style.text} transition-all ${
          reqId ? 'hover:underline cursor-pointer' : 'cursor-default'
        }`}
      >
        {style.label}
      </button>
    );
  };

  // Sortable Header Component
  const renderSortableHeader = (field: string, label: string) => {
    const isSorted = sortField === field;
    return (
      <th
        onClick={() => onSort(field)}
        className="px-3.5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors cursor-pointer select-none whitespace-nowrap group"
      >
        <div className="flex items-center gap-1.5">
          <span>{label}</span>
          <span className="text-indigo-400 transition-opacity">
            {isSorted ? (sortOrder === 'asc' ? '↑' : '↓') : <span className="opacity-0 group-hover:opacity-60 text-slate-500">↕</span>}
          </span>
        </div>
      </th>
    );
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Scrollable Container with Sticky Header */}
      <div className="overflow-x-auto min-h-[380px] max-h-[650px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-20 shadow-md">
            <tr>
              {renderSortableHeader('employeeName', 'Employee')}
              {renderSortableHeader('employeeId', 'Employee ID')}
              <th className="px-3.5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-300 whitespace-nowrap">
                Department
              </th>
              {renderSortableHeader('date', 'Date')}
              <th className="px-3.5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-300 whitespace-nowrap">
                Work Mode
              </th>
              {renderSortableHeader('clockInAt', 'Clock In')}
              {renderSortableHeader('clockOutAt', 'Clock Out')}
              {renderSortableHeader('workingHours', 'WORKING HOURS')}
              {renderSortableHeader('status', 'Status')}
              <th className="px-3.5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-300 whitespace-nowrap">
                Verification
              </th>
              <th className="px-3.5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-300 whitespace-nowrap">
                Correction
              </th>
              {renderSortableHeader('updatedAt', 'Last Modified')}
              <th className="px-3.5 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-slate-300 whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60 bg-slate-950/40 text-slate-200 text-xs">
            {loading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td colSpan={13} className="px-4 py-3.5">
                    <div className="h-4 bg-slate-800/80 rounded w-full"></div>
                  </td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={13} className="px-4 py-12 text-center text-red-400">
                  <p className="font-semibold text-sm">⚠️ {error}</p>
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={13} className="px-4 py-16 text-center text-slate-400">
                  <div className="w-12 h-12 rounded-full bg-slate-800/80 text-slate-500 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-slate-200">No attendance records found</p>
                  <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or date range.</p>
                </td>
              </tr>
            ) : (
              records.map((rec) => {
                const dateDisplay = formatDateDisplay(rec.date || rec.createdAt);
                const clockInDisplay = formatTimeDisplay(rec.clockInAt);
                const clockOutDisplay = formatTimeDisplay(rec.clockOutAt);
                const workingHoursStr =
                  rec.workingHoursFormatted ||
                  calculateWorkingHours(rec.clockInAt, rec.clockOutAt, rec.status);

                return (
                  <tr
                    key={rec.id}
                    className="hover:bg-slate-900/90 transition-colors group"
                  >
                    {/* Employee */}
                    <td className="px-3.5 py-3 font-semibold text-slate-100 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-bold flex items-center justify-center text-xs shrink-0">
                          {rec.employeeName.charAt(0)}
                        </div>
                        <span>{rec.employeeName}</span>
                      </div>
                    </td>

                    {/* Employee ID */}
                    <td className="px-3.5 py-3 font-mono text-slate-400 whitespace-nowrap">
                      {rec.employeeId}
                    </td>

                    {/* Department */}
                    <td className="px-3.5 py-3 text-slate-300 whitespace-nowrap">
                      {rec.department}
                    </td>

                    {/* Date */}
                    <td className="px-3.5 py-3 font-medium text-slate-200 whitespace-nowrap">
                      {dateDisplay}
                    </td>

                    {/* Work Mode */}
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      {renderWorkModeBadge(rec.workMode)}
                    </td>

                    {/* Clock In */}
                    <td className="px-3.5 py-3 font-medium text-slate-300 whitespace-nowrap">
                      {clockInDisplay}
                    </td>

                    {/* Clock Out */}
                    <td className="px-3.5 py-3 font-medium text-slate-300 whitespace-nowrap">
                      {clockOutDisplay}
                    </td>

                    {/* Working Hours */}
                    <td className="px-3.5 py-3 font-mono font-semibold text-indigo-300 whitespace-nowrap">
                      {workingHoursStr}
                    </td>

                    {/* Status */}
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      {renderStatusBadge(rec.status)}
                    </td>

                    {/* Verification */}
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      {renderVerificationDisplay(rec.verification, rec.workMode, rec.status)}
                    </td>

                    {/* Correction Status */}
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      {renderCorrectionBadge(rec.correctionStatus, rec.correctionRequestId)}
                    </td>

                    {/* Last Modified */}
                    <td className="px-3.5 py-3 text-slate-400 whitespace-nowrap">
                      {rec.lastModifiedBy ? (
                        <div className="flex flex-col text-[11px]">
                          <span className="text-slate-300 font-medium">{rec.lastModifiedBy}</span>
                          <span className="text-slate-500 text-[10px]">{formatDateDisplay(rec.lastModifiedAt)}</span>
                        </div>
                      ) : (
                        <span className="font-mono text-slate-500">—</span>
                      )}
                    </td>

                    {/* Actions Column */}
                    <td className="px-3.5 py-3 text-right whitespace-nowrap">
                      <ActionMenuDropdownPortal
                        record={rec}
                        onViewDetails={onViewDetails}
                        onSelectAction={onSelectAction}
                        isHRorAdmin={isHRorAdmin}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="bg-slate-950 border-t border-slate-800 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(parseInt(e.target.value))}
            className="bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          >
            {[10, 25, 50, 100].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          <span className="ml-2 text-slate-500">
            Total {totalRecords} records
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span>
            Page <strong className="text-slate-200">{currentPage}</strong> of <strong className="text-slate-200">{totalPages || 1}</strong>
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 text-slate-200 transition-all"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 text-slate-200 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
