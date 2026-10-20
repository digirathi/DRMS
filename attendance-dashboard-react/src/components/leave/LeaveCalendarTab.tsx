import React, { useState } from 'react';
import { LeaveRequest, Holiday } from '../../types/leave';

interface LeaveCalendarTabProps {
  events: LeaveRequest[];
  holidays: Holiday[];
  loading: boolean;
  onSelectEvent: (eventId: string) => void;
}

export const LeaveCalendarTab: React.FC<LeaveCalendarTabProps> = ({
  events,
  holidays,
  loading,
  onSelectEvent
}) => {
  const [viewMode, setViewMode] = useState<'MONTH' | 'WEEK' | 'LIST'>('MONTH');

  if (loading) {
    return <div className="h-96 bg-slate-900/80 border border-slate-800 rounded-2xl animate-pulse p-6" />;
  }

  // Pre-generate sample July/August 2026 calendar days
  const daysInJuly2026 = Array.from({ length: 31 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-07-${dayNum < 10 ? '0' + dayNum : dayNum}`;
    const dayEvents = events.filter((e) => e.startDate <= dateStr && e.endDate >= dateStr);
    const dayHolidays = holidays.filter((h) => h.date === dateStr);
    return { dateStr, dayNum, dayEvents, dayHolidays };
  });

  return (
    <div className="space-y-6">
      {/* View Switcher Header */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 rounded-2xl shadow-xl flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-100">Organization Leave & Holiday Calendar</h3>
          <p className="text-xs text-slate-400">
            View approved leaves, pending requests, return dates, and holidays. (Employee confidential reasons hidden).
          </p>
        </div>

        <div className="flex bg-slate-950 p-1 border border-slate-800 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setViewMode('MONTH')}
            className={`px-3 py-1.5 rounded-lg transition ${
              viewMode === 'MONTH' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Month View
          </button>
          <button
            onClick={() => setViewMode('WEEK')}
            className={`px-3 py-1.5 rounded-lg transition ${
              viewMode === 'WEEK' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Week View
          </button>
          <button
            onClick={() => setViewMode('LIST')}
            className={`px-3 py-1.5 rounded-lg transition ${
              viewMode === 'LIST' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            List View
          </button>
        </div>
      </div>

      {/* Month View Grid */}
      {viewMode === 'MONTH' && (
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <h4 className="text-base font-bold text-slate-100">July 2026</h4>
            <div className="flex gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Approved Leave
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Pending Approval
              </span>
              <span className="flex items-center gap-1.5 text-teal-400">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> Holiday
              </span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400 pb-2 border-b border-slate-800/60">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {/* Blank leading slots for Wednesday start */}
            <div className="min-h-[90px] bg-slate-950/30 rounded-xl p-2 opacity-30" />
            <div className="min-h-[90px] bg-slate-950/30 rounded-xl p-2 opacity-30" />
            <div className="min-h-[90px] bg-slate-950/30 rounded-xl p-2 opacity-30" />

            {daysInJuly2026.map((day) => (
              <div
                key={day.dateStr}
                className="min-h-[90px] bg-slate-950/60 border border-slate-800/80 rounded-xl p-2 hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-300">{day.dayNum}</span>
                  {day.dayHolidays.length > 0 && (
                    <span className="text-[10px] bg-teal-500/20 text-teal-300 px-1 rounded font-bold">
                      Holiday
                    </span>
                  )}
                </div>

                <div className="space-y-1 overflow-y-auto max-h-[60px] my-1">
                  {day.dayEvents.map((ev) => (
                    <button
                      key={ev.id}
                      onClick={() => onSelectEvent(ev.id)}
                      className={`w-full text-left px-1.5 py-0.5 rounded text-[10px] font-semibold truncate border ${
                        ev.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                      }`}
                    >
                      {ev.employeeName} ({ev.leaveTypeName})
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List View */}
      {(viewMode === 'LIST' || viewMode === 'WEEK') && (
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-3">
          <h4 className="text-sm font-bold text-slate-200">Scheduled Leave Events</h4>
          <div className="space-y-2">
            {events.map((ev) => (
              <div
                key={ev.id}
                onClick={() => onSelectEvent(ev.id)}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 cursor-pointer flex justify-between items-center transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                    {ev.employeeName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{ev.employeeName}</p>
                    <p className="text-xs text-slate-400">
                      {ev.department} • <strong className="text-indigo-300">{ev.leaveTypeName}</strong> ({ev.totalDays} day{ev.totalDays > 1 ? 's' : ''})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-slate-300">
                    {ev.startDate} to {ev.endDate}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      ev.status === 'APPROVED'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    {ev.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveCalendarTab;
