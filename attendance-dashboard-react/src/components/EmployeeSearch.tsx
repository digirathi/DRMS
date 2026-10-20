import React, { useState, useEffect } from 'react';

interface EmployeeSearchProps {
  value: string;
  onSearchChange: (search: string) => void;
  filteredCount: number;
  totalCount: number;
  placeholder?: string;
}

export const EmployeeSearch: React.FC<EmployeeSearchProps> = ({
  value,
  onSearchChange,
  filteredCount,
  totalCount,
  placeholder = 'Search employee by name or ID'
}) => {
  const [inputValue, setInputValue] = useState(value);

  // Sync internal state if prop changes externally
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Debounce search input by 350ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== value) {
        onSearchChange(inputValue);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [inputValue, value, onSearchChange]);

  const handleClear = () => {
    setInputValue('');
    onSearchChange('');
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800 backdrop-blur-md">
      <div className="relative flex-1 max-w-md">
        {/* Theme-matched Search Icon Container */}
        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl pl-11 pr-9 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder:text-slate-500"
        />

        {/* Clear Button */}
        {inputValue && (
          <button
            onClick={handleClear}
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-indigo-400 cursor-pointer transition-colors"
            title="Clear search"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="text-xs font-medium text-slate-400 px-2 flex items-center gap-2">
        <span>
          Showing <strong className="text-indigo-400 font-bold">{filteredCount}</strong> of{' '}
          <strong className="text-slate-200">{totalCount}</strong> employees
        </span>
      </div>
    </div>
  );
};

export default EmployeeSearch;
