import React from 'react';
import { HistorySummaryData } from '../types/attendance';

interface HistorySummaryCardsProps {
  summary: HistorySummaryData;
  selectedFilter: string | null;
  onSelectFilter: (filterKey: string | null) => void;
}

interface CardConfig {
  key: string;
  title: string;
  count: number;
  subtitle: string;
  color: 'indigo' | 'emerald' | 'amber' | 'cyan' | 'red' | 'purple' | 'slate';
  icon: React.ReactNode;
}

export const HistorySummaryCards: React.FC<HistorySummaryCardsProps> = ({
  summary,
  selectedFilter,
  onSelectFilter
}) => {
  const cards: CardConfig[] = [
    {
      key: 'ALL',
      title: 'Total Records',
      count: summary.totalRecords,
      subtitle: 'Recorded log entries',
      color: 'slate',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      key: 'PRESENT',
      title: 'Present Days',
      count: summary.presentDays,
      subtitle: 'Clocked in or completed',
      color: 'emerald',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      key: 'OFFICE',
      title: 'Office Days',
      count: summary.officeDays,
      subtitle: 'In-office attendance',
      color: 'indigo',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H9m4 0V7m0 0h4m-4 0H9" />
        </svg>
      )
    },
    {
      key: 'WFH',
      title: 'WFH Days',
      count: summary.wfhDays,
      subtitle: 'Work from home',
      color: 'cyan',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      key: 'ON_LEAVE',
      title: 'Leave Days',
      count: summary.leaveDays,
      subtitle: 'Approved leaves',
      color: 'amber',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      key: 'MISSING_CLOCK_OUT',
      title: 'Missing Clock-Outs',
      count: summary.missingClockOuts,
      subtitle: 'Requires clock-out',
      color: 'red',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      key: 'INCOMPLETE_HOURS',
      title: 'Incomplete Records',
      count: summary.incompleteRecords,
      subtitle: 'Partial hours',
      color: 'purple',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      key: 'PENDING_CORRECTIONS',
      title: 'Pending Corrections',
      count: summary.pendingCorrections,
      subtitle: 'Needs HR review',
      color: 'amber',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    }
  ];

  const colorStyles: Record<string, { border: string; bg: string; activeBorder: string; activeBg: string; text: string; iconBg: string }> = {
    slate: {
      border: 'border-slate-800',
      bg: 'bg-slate-900/70',
      activeBorder: 'border-slate-500 ring-2 ring-slate-500/30',
      activeBg: 'bg-slate-900',
      text: 'text-slate-100',
      iconBg: 'bg-slate-800 text-slate-300'
    },
    emerald: {
      border: 'border-slate-800',
      bg: 'bg-slate-900/70',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/30',
      activeBg: 'bg-emerald-950/40',
      text: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10 text-emerald-400'
    },
    indigo: {
      border: 'border-slate-800',
      bg: 'bg-slate-900/70',
      activeBorder: 'border-indigo-500 ring-2 ring-indigo-500/30',
      activeBg: 'bg-indigo-950/40',
      text: 'text-indigo-400',
      iconBg: 'bg-indigo-500/10 text-indigo-400'
    },
    cyan: {
      border: 'border-slate-800',
      bg: 'bg-slate-900/70',
      activeBorder: 'border-cyan-500 ring-2 ring-cyan-500/30',
      activeBg: 'bg-cyan-950/40',
      text: 'text-cyan-400',
      iconBg: 'bg-cyan-500/10 text-cyan-400'
    },
    amber: {
      border: 'border-slate-800',
      bg: 'bg-slate-900/70',
      activeBorder: 'border-amber-500 ring-2 ring-amber-500/30',
      activeBg: 'bg-amber-950/40',
      text: 'text-amber-400',
      iconBg: 'bg-amber-500/10 text-amber-400'
    },
    red: {
      border: 'border-slate-800',
      bg: 'bg-slate-900/70',
      activeBorder: 'border-red-500 ring-2 ring-red-500/30',
      activeBg: 'bg-red-950/40',
      text: 'text-red-400',
      iconBg: 'bg-red-500/10 text-red-400'
    },
    purple: {
      border: 'border-slate-800',
      bg: 'bg-slate-900/70',
      activeBorder: 'border-purple-500 ring-2 ring-purple-500/30',
      activeBg: 'bg-purple-950/40',
      text: 'text-purple-400',
      iconBg: 'bg-purple-500/10 text-purple-400'
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Selected Date Range Overview
        </h3>
        {selectedFilter && (
          <button
            type="button"
            onClick={() => onSelectFilter(null)}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            Clear Card Filter ✕
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {cards.map((card) => {
          const isSelected = selectedFilter === card.key;
          const style = colorStyles[card.color] || colorStyles.slate;

          return (
            <button
              key={card.key}
              type="button"
              onClick={() => onSelectFilter(isSelected ? null : card.key)}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? `${style.activeBorder} ${style.activeBg} shadow-lg shadow-indigo-950/50 scale-[1.02]`
                  : `${style.border} ${style.bg} hover:border-slate-700 hover:bg-slate-900`
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`p-1.5 rounded-lg ${style.iconBg}`}>{card.icon}</span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
                )}
              </div>
              <div>
                <div className={`text-xl font-extrabold ${style.text} tracking-tight`}>
                  {card.count}
                </div>
                <div className="text-[11px] font-semibold text-slate-200 mt-0.5 truncate">
                  {card.title}
                </div>
                <div className="text-[10px] text-slate-400 truncate">{card.subtitle}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
