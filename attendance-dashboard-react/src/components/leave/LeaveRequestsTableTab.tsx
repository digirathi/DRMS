import React, { useState, useEffect, useMemo } from 'react';
import { LeaveRequest, LeaveType } from '../../types/leave';
import { LeaveStatusBadge, DayTypeBadge } from './LeaveStatusBadge';

interface LeaveRequestsTableTabProps {
  requests: LeaveRequest[];
  totalRecords: number;
  loading: boolean;
  error: string | null;
  leaveTypes: LeaveType[];
  page: number;
  limit: number;
  sort: string;
  order: 'asc' | 'desc';
  activeFilters: {
    search: string;
    department: string;
    leaveTypeId: string;
    status: string;
    isPaid: string;
    startDate: string;
    endDate: string;
  };
  onFilterChange: (newFilters: any) => void;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
  onSortChange: (field: string) => void;
  onReviewRequest: (request: LeaveRequest) => void;
  onExport: () => void;
  onRefresh: () => void;
}

export const LeaveRequestsTableTab: React.FC<LeaveRequestsTableTabProps> = ({
  requests,
  totalRecords,
  loading,
  error,
  leaveTypes,
  page,
  limit,
  sort,
  order,
  activeFilters,
  onFilterChange,
  onPageChange,
  onLimitChange,
  onSortChange,
  onReviewRequest,
  onExport,
  onRefresh
}) => {
  const [searchInput, setSearchInput] = useState(activeFilters.search);

  // Debounced search input handler (300-500ms debounce)
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== activeFilters.search) {
        onFilterChange({ search: searchInput });
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchInput, activeFilters.search, onFilterChange]);

  const handleClearSearch = () => {
    setSearchInput('');
    onFilterChange({ search: '' });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    onFilterChange({
      search: '',
      department: 'ALL',
      leaveTypeId: 'ALL',
      status: 'ALL',
      isPaid: 'ALL',
      startDate: '',
      endDate: ''
    });
  };

  const departments = ['Engineering', 'Product', 'Design', 'Sales', 'Human Resources', 'Marketing', 'Finance'];

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
          {/* Debounced Search Bar */}
          <div className="relative flex-1 min-w-[280px]">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search employee by name, employee ID, or department..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition"
            />
            {searchInput && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                title="Clear search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onRefresh}
              className="px-3.5 py-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-700 text-xs font-semibold flex items-center gap-2 transition"
              title="Refresh request list"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Refresh
            </button>

            <button
              onClick={onExport}
              className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-indigo-300 rounded-xl border border-indigo-500/30 text-xs font-semibold flex items-center gap-2 transition shadow-md shadow-slate-950/40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 border-t border-slate-800/80">
          {/* Department Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Department
            </label>
            <select
              value={activeFilters.department}
              onChange={(e) => onFilterChange({ department: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Leave Type Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Leave Type
            </label>
            <select
              value={activeFilters.leaveTypeId}
              onChange={(e) => onFilterChange({ leaveTypeId: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Leave Types</option>
              {leaveTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              value={activeFilters.status}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="MORE_INFORMATION_REQUIRED">More Info Required</option>
              <option value="CANCELLATION_REQUESTED">Cancellation Requested</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="WITHDRAWN">Withdrawn</option>
            </select>
          </div>

          {/* Paid / Unpaid */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Pay Type
            </label>
            <select
              value={activeFilters.isPaid}
              onChange={(e) => onFilterChange({ isPaid: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">Paid & Unpaid</option>
              <option value="PAID">Paid Only</option>
              <option value="UNPAID">Unpaid Only</option>
            </select>
          </div>

          {/* Date Range Start */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              From Date
            </label>
            <input
              type="date"
              value={activeFilters.startDate}
              onChange={(e) => onFilterChange({ startDate: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              onClick={handleResetFilters}
              className="w-full py-1.5 bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg border border-slate-700 text-xs font-semibold transition"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Result Count Indicator */}
        <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
          <span>
            Showing <strong className="text-slate-200">{requests.length}</strong> of{' '}
            <strong className="text-indigo-400">{totalRecords}</strong> leave requests
          </span>
          {activeFilters.search && (
            <span className="bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded text-[11px] border border-indigo-500/20 font-mono">
              Filter active: "{activeFilters.search}"
            </span>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-2xl table-wrap">
        <div className="overflow-x-auto max-h-[650px] overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            {/* Sticky Header */}
            <thead className="bg-slate-950/90 text-slate-300 font-semibold uppercase tracking-wider sticky top-0 z-10 backdrop-blur border-b border-slate-800">
              <tr>
                <th
                  onClick={() => onSortChange('employeeName')}
                  className="px-4 py-3.5 cursor-pointer hover:text-indigo-400 transition"
                >
                  Employee {sort === 'employeeName' ? (order === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="px-3 py-3.5">Department</th>
                <th className="px-3 py-3.5">Leave Type</th>
                <th className="px-3 py-3.5">Dates</th>
                <th className="px-3 py-3.5">Duration</th>
                <th className="px-3 py-3.5">Day Type</th>
                <th className="px-3 py-3.5 text-center">Available Bal</th>
                <th className="px-3 py-3.5">Status</th>
                <th
                  onClick={() => onSortChange('submittedAt')}
                  className="px-3 py-3.5 cursor-pointer hover:text-indigo-400 transition"
                >
                  Submitted {sort === 'submittedAt' ? (order === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="px-3 py-3.5">Processed By</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/70 text-slate-200">
              {loading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-4"><div className="h-4 bg-slate-800 rounded w-24" /></td>
                    <td className="p-3"><div className="h-4 bg-slate-800 rounded w-20" /></td>
                    <td className="p-3"><div className="h-4 bg-slate-800 rounded w-20" /></td>
                    <td className="p-3"><div className="h-4 bg-slate-800 rounded w-24" /></td>
                    <td className="p-3"><div className="h-4 bg-slate-800 rounded w-12" /></td>
                    <td className="p-3"><div className="h-4 bg-slate-800 rounded w-16" /></td>
                    <td className="p-3"><div className="h-4 bg-slate-800 rounded w-10 mx-auto" /></td>
                    <td className="p-3"><div className="h-4 bg-slate-800 rounded w-24" /></td>
                    <td className="p-3"><div className="h-4 bg-slate-800 rounded w-20" /></td>
                    <td className="p-3"><div className="h-4 bg-slate-800 rounded w-20" /></td>
                    <td className="p-4"><div className="h-6 bg-slate-800 rounded w-14 ml-auto" /></td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-rose-400">
                    <p className="font-semibold">{error}</p>
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-16 text-center text-slate-400">
                    <div className="max-w-sm mx-auto space-y-2">
                      <p className="text-base font-semibold text-slate-300">No Leave Requests Found</p>
                      <p className="text-xs text-slate-500">
                        No requests match your current search terms or filter selections.
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="px-4 py-2 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 rounded-xl text-xs font-semibold transition"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/40 transition">
                    {/* Employee Info */}
                    <td className="px-4 py-3 font-medium">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-indigo-400 font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {req.employeeName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-100 leading-tight">{req.employeeName}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{req.employeeCode}</p>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-3 py-3 text-slate-300">{req.department}</td>

                    {/* Leave Type */}
                    <td className="px-3 py-3">
                      <span className="font-medium text-slate-200">{req.leaveTypeName}</span>
                      {!req.isPaid && (
                        <span className="ml-1 text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.2 rounded font-semibold">
                          Unpaid
                        </span>
                      )}
                    </td>

                    {/* Dates */}
                    <td className="px-3 py-3 font-mono text-[11px] text-slate-300">
                      {req.startDate === req.endDate ? (
                        <span>{req.startDate}</span>
                      ) : (
                        <span>
                          {req.startDate} <span className="text-slate-500">to</span> {req.endDate}
                        </span>
                      )}
                    </td>

                    {/* Duration */}
                    <td className="px-3 py-3 font-semibold text-slate-100">
                      {req.totalDays} day{req.totalDays > 1 ? 's' : ''}
                    </td>

                    {/* Day Type */}
                    <td className="px-3 py-3">
                      <DayTypeBadge dayType={req.dayType} />
                    </td>

                    {/* Current Available Balance */}
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded ${
                          req.currentBalance <= 2
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {req.currentBalance}d
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3">
                      <LeaveStatusBadge status={req.status} />
                    </td>

                    {/* Submitted At */}
                    <td className="px-3 py-3 text-[11px] text-slate-400 font-mono">
                      {new Date(req.submittedAt).toLocaleDateString()}{' '}
                      <span className="text-slate-500">{new Date(req.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>

                    {/* Processed By */}
                    <td className="px-3 py-3 text-slate-300">
                      {req.processedByName ? (
                        <div>
                          <p className="font-medium text-slate-200">{req.processedByName}</p>
                          <p className="text-[10px] text-indigo-400 font-mono">{req.processedByRole}</p>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Unprocessed</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onReviewRequest(req)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow transition ${
                          req.status === 'PENDING_APPROVAL' || req.status === 'CANCELLATION_REQUESTED'
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/40'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        {req.status === 'PENDING_APPROVAL' || req.status === 'CANCELLATION_REQUESTED' ? 'Review' : 'View'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Server-Side Pagination Footer */}
        <div className="bg-slate-950/90 px-6 py-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span>Rows per page:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="bg-slate-900 border border-slate-800 text-slate-200 rounded-md px-2 py-1 text-xs focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <span>
              Page <strong className="text-slate-200">{page}</strong> of{' '}
              <strong className="text-slate-200">{Math.ceil(totalRecords / limit) || 1}</strong>
            </span>

            <div className="flex gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 text-slate-200 transition"
              >
                Previous
              </button>
              <button
                disabled={page * limit >= totalRecords}
                onClick={() => onPageChange(page + 1)}
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 text-slate-200 transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestsTableTab;
