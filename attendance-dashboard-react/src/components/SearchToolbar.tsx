import React, { useState, useEffect, useRef } from 'react';

interface SearchToolbarProps {
  search: string;
  onSearchChange: (search: string) => void;
  department: string;
  onDepartmentChange: (dept: string) => void;
  workMode: string;
  onWorkModeChange: (mode: string) => void;
  onResetFilters: () => void;
  departments: string[];
  filteredCount: number;
  totalCount: number;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const SearchToolbar: React.FC<SearchToolbarProps> = ({
  search,
  onSearchChange,
  department,
  onDepartmentChange,
  workMode,
  onWorkModeChange,
  onResetFilters,
  departments,
  filteredCount,
  totalCount,
  onRefresh,
  isLoading = false
}) => {
  const [inputValue, setInputValue] = useState(search);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Sync internal search input state if external search prop changes
  useEffect(() => {
    setInputValue(search);
  }, [search]);

  // Debounce search input by 350ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== search) {
        onSearchChange(inputValue);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [inputValue, search, onSearchChange]);

  const handleClear = () => {
    setInputValue('');
    onSearchChange('');
    inputRef.current?.focus();
  };

  const hasActiveFilters = Boolean(search || department !== 'ALL' || workMode !== 'ALL');

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 backdrop-blur-md">
      {/* Left-side Filter Group */}
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
        {/* Search Input Wrapper */}
        <div className="relative w-full sm:w-[360px] lg:w-[420px]">
          {/* Outline-only Search Icon */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          <input
            ref={inputRef}
            type="search"
            aria-label="Search employees"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search employee by name or ID"
            className="h-11 w-full rounded-xl border border-indigo-200 dark:border-violet-400/20 bg-white/90 dark:bg-[#100d25] pl-10 pr-10 text-sm text-slate-800 dark:text-slate-100 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 transition hover:border-indigo-300 dark:hover:border-violet-400/30 focus:border-indigo-500 dark:focus:border-violet-400/50 focus:ring-2 focus:ring-indigo-500/15 shadow-sm"
          />

          {/* Clear-search Button */}
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer transition-colors p-1 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-400/50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Department Filter */}
        <select
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
          aria-label="Filter by department"
          className="h-11 rounded-xl border border-indigo-200 dark:border-violet-400/20 bg-white/90 dark:bg-[#100d25] px-3.5 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-violet-400/50 focus:ring-2 focus:ring-indigo-500/15 cursor-pointer shadow-sm"
        >
          <option value="ALL">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* Work Mode Filter */}
        <select
          value={workMode}
          onChange={(e) => onWorkModeChange(e.target.value)}
          aria-label="Filter by work mode"
          className="h-11 rounded-xl border border-indigo-200 dark:border-violet-400/20 bg-white/90 dark:bg-[#100d25] px-3.5 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-violet-400/50 focus:ring-2 focus:ring-indigo-500/15 cursor-pointer shadow-sm"
        >
          <option value="ALL">All Work Modes</option>
          <option value="OFFICE">Office</option>
          <option value="WFH">WFH</option>
          <option value="NOT_SELECTED">Not Selected</option>
        </select>

        {/* Reset Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="h-11 px-4 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold text-slate-300 transition cursor-pointer flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-violet-400/50"
          >
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
            </svg>
            Reset
          </button>
        )}
      </div>

      {/* Right-side Group */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs font-medium text-slate-400">
          Showing <strong className="text-violet-300 font-bold">{filteredCount}</strong> of{' '}
          <strong className="text-slate-200">{totalCount}</strong> employees
        </span>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            title="Refresh Table Data"
            className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <svg
              className={`w-4 h-4 ${isLoading ? 'animate-spin text-violet-400' : 'text-slate-400'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchToolbar;
