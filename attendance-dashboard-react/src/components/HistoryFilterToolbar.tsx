import React, { useState, useEffect } from 'react';
import { HistoryFilterState } from '../types/attendance';
import { mockDepartments, mockOfficeLocations } from '../data/mockAttendance';

interface HistoryFilterToolbarProps {
  filters: HistoryFilterState;
  onFilterChange: (updated: Partial<HistoryFilterState>) => void;
  onReset: () => void;
  onRefresh: () => void;
  filteredCount: number;
  totalCount: number;
  loading?: boolean;
}

export const HistoryFilterToolbar: React.FC<HistoryFilterToolbarProps> = ({
  filters,
  onFilterChange,
  onReset,
  onRefresh,
  filteredCount,
  totalCount,
  loading = false
}) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // 400ms Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFilterChange({ search: searchInput });
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchInput, filters.search, onFilterChange]);

  const handleClearSearch = () => {
    setSearchInput('');
    onFilterChange({ search: '' });
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
      {/* Top Bar: Minimal Lucide Outline Search & Quick Actions */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input Box */}
        <div className="relative flex-1 max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {/* Minimal Modern Outline Search Icon from Lucide */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search employee by name or ID"
            className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500/80 text-slate-100 placeholder-slate-500 text-xs sm:text-sm rounded-xl focus:ring-1 focus:ring-indigo-500/80 focus:outline-none transition-all"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-200 cursor-pointer"
              title="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Status Count & Refresh / Reset */}
        <div className="flex items-center justify-between lg:justify-end gap-3">
          <div className="text-xs font-semibold text-slate-300">
            Showing <span className="text-indigo-400 font-bold">{filteredCount}</span> of {totalCount} attendance records
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReset}
              className="px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              title="Reset all filters"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Reset Filters
            </button>

            <button
              type="button"
              onClick={onRefresh}
              className="px-3.5 py-2 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800/80 text-indigo-200 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              title="Refresh data"
            >
              <svg
                className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Filter Select Controls Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2 border-t border-slate-800/80">
        {/* Department Filter */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Department
          </label>
          <select
            value={filters.department}
            onChange={(e) => onFilterChange({ department: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-2.5 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            {mockDepartments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Work Mode Filter */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Work Mode
          </label>
          <select
            value={filters.workMode}
            onChange={(e) => onFilterChange({ workMode: e.target.value as any })}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-2.5 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="ALL">All Work Modes</option>
            <option value="OFFICE">Office</option>
            <option value="WFH">WFH</option>
            <option value="NOT_SELECTED">Not Selected</option>
          </select>
        </div>

        {/* Attendance Status Filter (No Shift Options) */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Attendance Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-2.5 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="CLOCKED_IN">Clocked In</option>
            <option value="MISSING_CLOCK_IN">Missing Clock-In</option>
            <option value="MISSING_CLOCK_OUT">Missing Clock-Out</option>
            <option value="INCOMPLETE_HOURS">Incomplete Hours</option>
            <option value="NOT_CLOCKED_IN">Not Clocked In</option>
            <option value="ON_LEAVE">On Leave</option>
            <option value="WEEK_OFF">Week Off</option>
            <option value="HOLIDAY">Holiday</option>
            <option value="MANUALLY_CORRECTED">Manually Corrected</option>
          </select>
        </div>

        {/* Office Location Filter */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Office Location
          </label>
          <select
            value={filters.officeLocation}
            onChange={(e) => onFilterChange({ officeLocation: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-2.5 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="ALL">All Locations</option>
            {mockOfficeLocations.map((loc) => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
        </div>

        {/* Correction Status Filter */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Correction Status
          </label>
          <select
            value={filters.correctionStatus}
            onChange={(e) => onFilterChange({ correctionStatus: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-2.5 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="ALL">All Correction States</option>
            <option value="NO_REQUEST">No Request</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="MORE_INFO_REQUIRED">More Information Required</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
      </div>
    </div>
  );
};
