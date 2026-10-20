import React, { useState, useEffect } from 'react';
import { RangeType } from '../types/attendance';
import { getWeeklyRange, getMonthlyRange, getYearlyRange } from '../utils/attendanceValidation';

interface DateRangeFilterProps {
  rangeType: RangeType;
  onRangeTypeChange: (type: RangeType) => void;
  startDate: string;
  endDate: string;
  onDatesChange: (start: string, end: string, label: string) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  rangeType,
  onRangeTypeChange,
  startDate,
  endDate,
  onDatesChange
}) => {
  // Weekly internal state
  const [weeklyRefDate, setWeeklyRefDate] = useState<Date>(new Date());

  // Monthly internal state
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());

  // Yearly internal state
  const [yearlyYear, setYearlyYear] = useState<number>(new Date().getFullYear());

  // Custom Range internal state
  const [customStart, setCustomStart] = useState<string>(startDate || '');
  const [customEnd, setCustomEnd] = useState<string>(endDate || '');
  const [customError, setCustomError] = useState<string>('');

  // Handle Weekly changes
  useEffect(() => {
    if (rangeType === 'weekly') {
      const range = getWeeklyRange(weeklyRefDate);
      onDatesChange(range.startDate, range.endDate, range.label);
    }
  }, [rangeType, weeklyRefDate]);

  // Handle Monthly changes
  useEffect(() => {
    if (rangeType === 'monthly') {
      const range = getMonthlyRange(selectedYear, selectedMonth);
      onDatesChange(range.startDate, range.endDate, range.label);
    }
  }, [rangeType, selectedYear, selectedMonth]);

  // Handle Yearly changes
  useEffect(() => {
    if (rangeType === 'yearly') {
      const range = getYearlyRange(yearlyYear);
      onDatesChange(range.startDate, range.endDate, range.label);
    }
  }, [rangeType, yearlyYear]);

  // Handle Weekly Prev / Next / Today
  const handlePrevWeek = () => {
    const d = new Date(weeklyRefDate);
    d.setDate(d.getDate() - 7);
    setWeeklyRefDate(d);
  };
  const handleNextWeek = () => {
    const d = new Date(weeklyRefDate);
    d.setDate(d.getDate() + 7);
    setWeeklyRefDate(d);
  };
  const handleThisWeek = () => {
    setWeeklyRefDate(new Date());
  };

  // Handle Monthly Prev / Next / Today
  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };
  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };
  const handleThisMonth = () => {
    const now = new Date();
    setSelectedYear(now.getFullYear());
    setSelectedMonth(now.getMonth());
  };

  // Handle Yearly Prev / Next / Today
  const handlePrevYear = () => setYearlyYear((y) => y - 1);
  const handleNextYear = () => setYearlyYear((y) => y + 1);
  const handleThisYear = () => setYearlyYear(new Date().getFullYear());

  // Handle Custom Range Apply & Clear
  const handleApplyCustom = () => {
    setCustomError('');
    if (!customStart || !customEnd) {
      setCustomError('Start Date and End Date are required.');
      return;
    }
    if (customEnd < customStart) {
      setCustomError('End Date cannot be earlier than Start Date.');
      return;
    }
    onDatesChange(customStart, customEnd, `${customStart} to ${customEnd}`);
  };

  const handleClearCustom = () => {
    setCustomStart('');
    setCustomEnd('');
    setCustomError('');
    const range = getWeeklyRange(new Date());
    onRangeTypeChange('weekly');
    onDatesChange(range.startDate, range.endDate, range.label);
  };

  const yearsOptions = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
      {/* Date Range Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['weekly', 'monthly', 'yearly', 'custom'] as RangeType[]).map((type) => {
            const labels: Record<RangeType, string> = {
              weekly: 'Weekly',
              monthly: 'Monthly',
              yearly: 'Yearly',
              custom: 'Custom Range'
            };
            const isActive = rangeType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => {
                  onRangeTypeChange(type);
                  if (type === 'custom' && (!customStart || !customEnd)) {
                    const todayStr = new Date().toISOString().slice(0, 10);
                    setCustomStart(todayStr);
                    setCustomEnd(todayStr);
                  }
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {labels[type]}
              </button>
            );
          })}
        </div>

        {/* Current Active Range Banner */}
        <div className="text-xs font-medium text-slate-300 bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Selected Period: <strong className="text-indigo-300 font-semibold">{startDate} – {endDate}</strong></span>
        </div>
      </div>

      {/* Tab Specific Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {rangeType === 'weekly' && (
          <div className="flex flex-wrap items-center gap-3 w-full justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevWeek}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer"
              >
                ← Previous Week
              </button>
              <button
                type="button"
                onClick={handleThisWeek}
                className="px-3 py-1.5 bg-indigo-950/60 border border-indigo-800/80 text-indigo-300 hover:bg-indigo-900/80 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                This Week
              </button>
              <button
                type="button"
                onClick={handleNextWeek}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer"
              >
                Next Week →
              </button>
            </div>
            <div className="text-sm font-semibold text-slate-100 bg-slate-950 border border-slate-800 px-4 py-1.5 rounded-xl shadow-inner">
              {getWeeklyRange(weeklyRefDate).label}
            </div>
          </div>
        )}

        {rangeType === 'monthly' && (
          <div className="flex flex-wrap items-center gap-3 w-full justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer"
              >
                ← Previous Month
              </button>
              <button
                type="button"
                onClick={handleThisMonth}
                className="px-3 py-1.5 bg-indigo-950/60 border border-indigo-800/80 text-indigo-300 hover:bg-indigo-900/80 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                This Month
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer"
              >
                Next Month →
              </button>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={m} value={idx}>{m}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                {yearsOptions.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <div className="text-sm font-semibold text-slate-100 bg-slate-950 border border-slate-800 px-4 py-1.5 rounded-xl shadow-inner">
                {MONTH_NAMES[selectedMonth]} {selectedYear}
              </div>
            </div>
          </div>
        )}

        {rangeType === 'yearly' && (
          <div className="flex flex-wrap items-center gap-3 w-full justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevYear}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer"
              >
                ← Previous Year
              </button>
              <button
                type="button"
                onClick={handleThisYear}
                className="px-3 py-1.5 bg-indigo-950/60 border border-indigo-800/80 text-indigo-300 hover:bg-indigo-900/80 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                This Year
              </button>
              <button
                type="button"
                onClick={handleNextYear}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer"
              >
                Next Year →
              </button>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={yearlyYear}
                onChange={(e) => setYearlyYear(parseInt(e.target.value))}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                {yearsOptions.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <div className="text-sm font-semibold text-slate-100 bg-slate-950 border border-slate-800 px-4 py-1.5 rounded-xl shadow-inner">
                Year {yearlyYear}
              </div>
            </div>
          </div>
        )}

        {rangeType === 'custom' && (
          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-400">Start Date *</label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-400">End Date *</label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyCustom}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                Apply Range
              </button>
              <button
                type="button"
                onClick={handleClearCustom}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-medium transition-all cursor-pointer"
              >
                Clear
              </button>
            </div>

            {customError && (
              <p className="text-xs font-medium text-red-400 flex items-center gap-1">
                <span>⚠️</span> {customError}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
