import React, { useState, useEffect } from 'react';

interface LeaveReportsTabProps {
  onExportCSV: () => void;
}

export const LeaveReportsTab: React.FC<LeaveReportsTabProps> = ({ onExportCSV }) => {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dateRange, setDateRange] = useState('MONTHLY');
  const [department, setDepartment] = useState('ALL');

  useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/leave/reports?department=${department}`);
        const data = await res.json();
        if (data.success) {
          setReportData(data.data);
        } else {
          setError(data.message);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load report analytics.');
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, [department, dateRange]);

  return (
    <div className="space-y-6">
      {/* Reports Header & Export Toolbar */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100">Leave Management Analytics & Reports</h3>
          <p className="text-xs text-slate-400">
            Comprehensive organization leave utilization, paid vs unpaid breakdowns, and auto-refill logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Design">Design</option>
            <option value="Sales">Sales</option>
          </select>

          <button
            onClick={onExportCSV}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-950/50 flex items-center gap-2 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Export Report CSV</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-slate-900/80 border border-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : error || !reportData ? (
        <div className="p-8 text-center bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl">
          {error || 'Error loading report data.'}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Key Report Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
              <span className="text-xs font-semibold text-slate-400 block">Total Approved Leave Days</span>
              <p className="text-3xl font-extrabold text-indigo-400 mt-1 font-mono">
                {reportData.metrics.totalApprovedDays} days
              </p>
            </div>

            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
              <span className="text-xs font-semibold text-slate-400 block">Paid vs Unpaid Ratio</span>
              <p className="text-3xl font-extrabold text-emerald-400 mt-1 font-mono">
                {reportData.metrics.totalPaidDays}d <span className="text-xs font-normal text-amber-400">/ {reportData.metrics.totalUnpaidDays}d</span>
              </p>
            </div>

            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
              <span className="text-xs font-semibold text-slate-400 block">Approval Rate</span>
              <p className="text-3xl font-extrabold text-purple-400 mt-1 font-mono">
                {reportData.metrics.approvalRate}%
              </p>
            </div>

            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
              <span className="text-xs font-semibold text-slate-400 block">Pending Days Queue</span>
              <p className="text-3xl font-extrabold text-amber-400 mt-1 font-mono">
                {reportData.metrics.totalPendingDays} days
              </p>
            </div>
          </div>

          {/* Usage by Leave Type & Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h4 className="text-sm font-bold text-slate-100">Leave Days Used by Leave Type</h4>
              <div className="space-y-3">
                {Object.entries(reportData.usageByLeaveType || {}).map(([name, days]: any) => (
                  <div key={name} className="flex justify-between items-center text-xs p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="font-semibold text-slate-200">{name}</span>
                    <span className="font-mono font-bold text-indigo-400">{days} days</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h4 className="text-sm font-bold text-slate-100">Leave Days Used by Department</h4>
              <div className="space-y-3">
                {Object.entries(reportData.usageByDepartment || {}).map(([dept, days]: any) => (
                  <div key={dept} className="flex justify-between items-center text-xs p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="font-semibold text-slate-200">{dept}</span>
                    <span className="font-mono font-bold text-purple-400">{days} days</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Auto Refill History Section */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-100">Auto-Refill Execution Audit History</h4>
            <div className="space-y-2">
              {reportData.autoRefillHistory.map((run: any) => (
                <div key={run.id} className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-200">{run.leaveTypeName}</span>
                    <span className="text-slate-400 ml-2">Period: {run.period}</span>
                    {run.errorMessage && <p className="text-[11px] text-amber-400 mt-0.5">{run.errorMessage}</p>}
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-emerald-400">+{run.totalAmountAdded} days added</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${run.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {run.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveReportsTab;
