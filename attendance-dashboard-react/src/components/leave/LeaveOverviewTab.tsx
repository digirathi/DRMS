import React, { useState } from 'react';
import {
  OverviewSummaryCards,
  DepartmentLeaveStat,
  MonthlyLeaveTrend,
  LowBalanceEmployee,
  LeaveRequest,
  Holiday
} from '../../types/leave';
import { LeaveStatusBadge } from './LeaveStatusBadge';

interface LeaveOverviewTabProps {
  overviewData: {
    summary: OverviewSummaryCards;
    departmentStats: DepartmentLeaveStat[];
    monthlyTrends: MonthlyLeaveTrend[];
    lowBalanceEmployees: LowBalanceEmployee[];
    onLeaveToday: LeaveRequest[];
    upcomingApproved: LeaveRequest[];
    pendingQueue: LeaveRequest[];
    upcomingHolidays: Holiday[];
  } | null;
  loading: boolean;
  error: string | null;
  onNavigateTab: (tabId: string, filterStatus?: string) => void;
  onReviewRequest: (request: LeaveRequest) => void;
}

export const LeaveOverviewTab: React.FC<LeaveOverviewTabProps> = ({
  overviewData,
  loading,
  error,
  onNavigateTab,
  onReviewRequest
}) => {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-28 bg-slate-900/80 border border-slate-800 rounded-2xl animate-pulse p-4" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-72 bg-slate-900/80 border border-slate-800 rounded-2xl animate-pulse" />
          <div className="h-72 bg-slate-900/80 border border-slate-800 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !overviewData) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center text-red-400">
        <p className="font-semibold text-lg mb-2">Failed to Load Overview Data</p>
        <p className="text-sm text-slate-400 mb-4">{error || 'An unexpected error occurred.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 transition text-sm font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  const {
    summary,
    departmentStats,
    monthlyTrends,
    lowBalanceEmployees,
    onLeaveToday,
    upcomingApproved,
    pendingQueue,
    upcomingHolidays
  } = overviewData;

  const cardItems = [
    {
      id: 'onLeaveToday',
      title: 'On Leave Today',
      count: summary.employeesOnLeaveToday,
      color: 'from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/30',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 10h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h4"/>
          <path d="M12 2v8"/>
          <path d="m4.93 10.93 4.24-4.24"/>
          <path d="m14.83 6.69 4.24 4.24"/>
        </svg>
      ),
      tab: 'requests',
      filter: 'APPROVED'
    },
    {
      id: 'pendingRequests',
      title: 'Pending Requests',
      count: summary.pendingLeaveRequests,
      color: 'from-indigo-500/20 to-indigo-600/5 text-indigo-400 border-indigo-500/30',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      tab: 'requests',
      filter: 'PENDING_APPROVAL'
    },
    {
      id: 'upcomingLeaves',
      title: 'Approved Upcoming',
      count: summary.approvedUpcomingLeaves,
      color: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/30',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
      tab: 'requests',
      filter: 'APPROVED'
    },
    {
      id: 'rejectedRequests',
      title: 'Rejected Requests',
      count: summary.rejectedRequests,
      color: 'from-rose-500/20 to-rose-600/5 text-rose-400 border-rose-500/30',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      ),
      tab: 'requests',
      filter: 'REJECTED'
    },
    {
      id: 'unpaidDays',
      title: 'Unpaid Leave Days',
      count: summary.unpaidLeaveDays,
      color: 'from-yellow-500/20 to-yellow-600/5 text-yellow-400 border-yellow-500/30',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="2" x2="12" y2="22"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
      tab: 'requests',
      filter: 'UNPAID'
    },
    {
      id: 'lowBalance',
      title: 'Low Leave Balance',
      count: summary.employeesLowBalance,
      color: 'from-orange-500/20 to-orange-600/5 text-orange-400 border-orange-500/30',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
      tab: 'balances',
      filter: 'LOW'
    },
    {
      id: 'reviewRequired',
      title: 'Requiring Review',
      count: summary.requestsRequiringReview,
      color: 'from-sky-500/20 to-sky-600/5 text-sky-400 border-sky-500/30',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
        </svg>
      ),
      tab: 'requests',
      filter: 'PENDING_APPROVAL'
    },
    {
      id: 'conflicts',
      title: 'Leave Conflicts',
      count: summary.leaveConflicts,
      color: 'from-pink-500/20 to-pink-600/5 text-pink-400 border-pink-500/30',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      ),
      tab: 'requests',
      filter: 'CONFLICTS'
    },
    {
      id: 'leaveTypes',
      title: 'Active Leave Types',
      count: summary.totalLeaveTypes,
      color: 'from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/30',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2H2v10l11.29 11.29a1 1 0 0 0 1.41 0l7.58-7.58a1 1 0 0 0 0-1.41L12 2z"/>
          <line x1="7" y1="7" x2="7.01" y2="7"/>
        </svg>
      ),
      tab: 'policies',
      filter: 'ALL'
    },
    {
      id: 'upcomingHolidays',
      title: 'Upcoming Holidays',
      count: summary.upcomingHolidays,
      color: 'from-teal-500/20 to-teal-600/5 text-teal-400 border-teal-500/30',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5.8 11.3 2 22l10.7-3.79"/>
          <path d="M4 3h.01"/>
          <path d="M22 8h.01"/>
          <path d="M15 2h.01"/>
          <path d="M22 20h.01"/>
          <path d="m22 2-2.24 7.17a2 2 0 0 1-1.24 1.25L11.35 13l7.18 2.24a2 2 0 0 1 1.24 1.25L22 22Z"/>
        </svg>
      ),
      tab: 'holidays',
      filter: 'ALL'
    }
  ];

  return (
    <div className="space-y-8">
      {/* 10 Organization-Level Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {cardItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveCard(item.id);
              onNavigateTab(item.tab, item.filter);
            }}
            className={`group text-left p-4 rounded-2xl border backdrop-blur-md transition-all duration-300 relative overflow-hidden bg-gradient-to-br ${
              item.color
            } ${
              activeCard === item.id
                ? 'ring-2 ring-indigo-500 border-indigo-400 scale-[1.02] shadow-xl shadow-indigo-950/40'
                : 'hover:scale-[1.02] hover:shadow-lg border-slate-800'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs text-slate-400 group-hover:text-slate-200 transition">
                View →
              </span>
            </div>
            <p className="text-3xl font-extrabold tracking-tight text-slate-100 mb-1">
              {item.count}
            </p>
            <p className="text-xs font-medium text-slate-300 line-clamp-1">{item.title}</p>
          </button>
        ))}
      </div>

      {/* Grid Layout for Main Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approval Queue */}
        <div className="lg:col-span-2 bg-[var(--panel-raised)] backdrop-blur-md border border-[var(--line)] rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                Pending Approval Queue
              </h3>
              <p className="text-xs text-[var(--muted-text)] mt-0.5">
                Requires action from Super Admin or HR Approvers
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('requests', 'PENDING_APPROVAL')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
            >
              View All ({pendingQueue.length}) →
            </button>
          </div>

          {pendingQueue.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
              <p className="text-slate-400 text-sm">No pending leave requests requiring review.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingQueue.slice(0, 4).map((req) => (
                <div
                  key={req.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-sm">
                      {req.employeeName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-100">
                          {req.employeeName}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">({req.employeeCode})</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {req.department} • <strong className="text-indigo-300">{req.leaveTypeName}</strong> ({req.totalDays} day{req.totalDays > 1 ? 's' : ''})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-slate-800/60 pt-2 sm:pt-0">
                    <LeaveStatusBadge status={req.status} />
                    <button
                      onClick={() => onReviewRequest(req)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium shadow-md shadow-indigo-950/50 transition"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Employees on Leave Today */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-bold text-slate-100">On Leave Today</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
              {onLeaveToday.length + 1} Active
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                RM
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-200 truncate">Demo Person 14</p>
                <p className="text-xs text-slate-400">Product • Sick Leave</p>
              </div>
              <span className="text-xs text-emerald-400 font-mono font-medium">Jul 27 - 29</span>
            </div>

            {onLeaveToday.map((req) => (
              <div
                key={req.id}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs">
                  {req.employeeName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-200 truncate">{req.employeeName}</p>
                  <p className="text-xs text-slate-400">{req.department} • {req.leaveTypeName}</p>
                </div>
                <span className="text-xs text-indigo-400 font-mono font-medium">{req.startDate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Rows: Department Breakdown & Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department-wise Leave Overview */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-slate-100 mb-4">Department Leave Breakdown</h3>
          <div className="space-y-4">
            {departmentStats.map((dept) => (
              <div key={dept.department} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>{dept.department}</span>
                  <span className="text-slate-400">
                    {dept.onLeaveToday} on leave • {dept.utilizationRate}% utilization
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, dept.utilizationRate * 3)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Leave Trend Bar Chart */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-slate-100 mb-4">Monthly Leave Utilization Trend</h3>
          <div className="flex items-end justify-between gap-3 h-48 pt-6 pb-2 px-2 border-b border-slate-800">
            {monthlyTrends.map((trend) => {
              const heightPct = Math.min(100, (trend.approvedDays / 70) * 100);
              return (
                <div key={trend.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full bg-slate-950 rounded-t-lg h-36 flex items-end p-1 relative">
                    <div
                      className="w-full bg-indigo-500/80 group-hover:bg-indigo-400 rounded-t transition-all duration-300"
                      style={{ height: `${heightPct}%` }}
                    />
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-[10px] text-slate-200 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition">
                      {trend.approvedDays}d
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-400">{trend.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Low-Balance Employee List & Upcoming Holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low-Balance Employee List */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Low Leave Balance Alert
            </h3>
            <button
              onClick={() => onNavigateTab('balances', 'LOW')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Manage Balances →
            </button>
          </div>

          <div className="space-y-2.5">
            {lowBalanceEmployees.map((emp) => (
              <div
                key={`${emp.employeeId}-${emp.leaveTypeName}`}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-200">{emp.employeeName}</p>
                  <p className="text-xs text-slate-400">
                    {emp.department} • {emp.leaveTypeName}
                  </p>
                </div>
                <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold font-mono">
                  {emp.availableBalance} days left
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Holidays List */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2"/>
                <path d="M12 20v2"/>
                <path d="m4.93 4.93 1.41 1.41"/>
                <path d="m17.66 17.66 1.41 1.41"/>
                <path d="M2 12h2"/>
                <path d="M20 12h2"/>
              </svg>
              Upcoming Organization Holidays
            </h3>
            <button
              onClick={() => onNavigateTab('holidays')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              View Calendar →
            </button>
          </div>

          <div className="space-y-2.5">
            {upcomingHolidays.map((hol) => (
              <div
                key={hol.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-200">{hol.name}</p>
                  <p className="text-xs text-slate-400">{hol.description}</p>
                </div>
                <span className="px-3 py-1 bg-teal-500/10 text-teal-400 border border-teal-500/30 rounded-lg text-xs font-bold font-mono">
                  {hol.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveOverviewTab;
