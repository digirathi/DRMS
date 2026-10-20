import React, { useState, useEffect } from 'react';
import { LeaveAuditLog } from '../../types/leave';

export const LeaveAuditHistoryTab: React.FC = () => {
  const [logs, setLogs] = useState<LeaveAuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedLog, setSelectedLog] = useState<LeaveAuditLog | null>(null);

  useEffect(() => {
    async function fetchAuditLogs() {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          search,
          action: actionFilter,
          role: roleFilter,
          page: page.toString(),
          limit: limit.toString()
        });
        const res = await fetch(`/api/admin/leave/audit-history?${query.toString()}`);
        const data = await res.json();
        if (data.success) {
          setLogs(data.records);
          setTotal(data.total);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchAuditLogs();
  }, [search, actionFilter, roleFilter, page, limit]);

  return (
    <div className="space-y-6">
      {/* Header & Filter Toolbar */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            Immutable Audit History Log
          </h3>
          <p className="text-xs text-slate-400">
            Server-generated, tamper-proof audit trail for all leave actions, policy edits, and balance adjustments.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by actor, employee ID, or reason..."
            className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50"
          />

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2"
          >
            <option value="ALL">All Actions</option>
            <option value="APPROVE_REQUEST">Approve Request</option>
            <option value="REJECT_REQUEST">Reject Request</option>
            <option value="MANUAL_ADD_LEAVE">Manual Add Leave</option>
            <option value="MANUAL_BALANCE_CREDIT">Balance Credit</option>
            <option value="MANUAL_BALANCE_DEDUCT">Balance Deduct</option>
            <option value="POLICY_UPDATE">Policy Update</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-2xl table-wrap">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/90 text-slate-300 font-semibold uppercase tracking-wider sticky top-0 z-10 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Audit ID</th>
                <th className="px-3 py-3.5">Performed By</th>
                <th className="px-3 py-3.5">Role</th>
                <th className="px-3 py-3.5">Action Type</th>
                <th className="px-3 py-3.5">Target Employee</th>
                <th className="px-3 py-3.5">Audit Reason</th>
                <th className="px-3 py-3.5">IP Address</th>
                <th className="px-3 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5 text-right">Details</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/70 text-slate-200">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-4"><div className="h-4 bg-slate-800 rounded w-20" /></td>
                    <td className="p-3"><div className="h-4 bg-slate-800 rounded w-24" /></td>
                    <td className="p-3"><div className="h-4 bg-slate-800 rounded w-16" /></td>
                    <td className="p-3"><div className="h-4 bg-slate-800 rounded w-28" /></td>
                    <td className="p-3"><div className="h-4 bg-slate-800 rounded w-20" /></td>
                    <td className="p-3"><div className="h-4 bg-slate-800 rounded w-36" /></td>
                    <td className="p-3"><div className="h-4 bg-slate-800 rounded w-20" /></td>
                    <td className="p-3"><div className="h-4 bg-slate-800 rounded w-24" /></td>
                    <td className="p-4"><div className="h-6 bg-slate-800 rounded w-12 ml-auto" /></td>
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No audit records match your filters.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-mono text-[11px] text-indigo-400 font-semibold">{log.id}</td>
                    <td className="px-3 py-3 font-semibold text-slate-100">{log.performedBy}</td>
                    <td className="px-3 py-3 font-mono text-[11px] text-amber-400">{log.userRole}</td>
                    <td className="px-3 py-3 font-bold text-slate-200">{log.action}</td>
                    <td className="px-3 py-3 font-mono text-slate-300">{log.employeeId}</td>
                    <td className="px-3 py-3 text-slate-300 max-w-xs truncate">{log.reason}</td>
                    <td className="px-3 py-3 font-mono text-slate-400">{log.ipAddress}</td>
                    <td className="px-3 py-3 font-mono text-slate-400 text-[11px]">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-semibold transition"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-slate-950/90 px-6 py-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>
            Total <strong className="text-indigo-400">{total}</strong> audit records
          </span>

          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg disabled:opacity-40 hover:bg-slate-800 text-slate-200"
            >
              Previous
            </button>
            <button
              disabled={page * limit >= total}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg disabled:opacity-40 hover:bg-slate-800 text-slate-200"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Audit Log Inspect Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setSelectedLog(null)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-100 animate-fadeIn">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold">Audit Record Details</h3>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-slate-200">
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Audit ID:</span>
                <span className="font-mono text-indigo-400 font-bold">{selectedLog.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Action:</span>
                <span className="font-bold text-slate-200">{selectedLog.action}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Actor:</span>
                <span>{selectedLog.performedBy} ({selectedLog.userRole})</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">IP & Device:</span>
                <span className="font-mono">{selectedLog.ipAddress} • {selectedLog.deviceInfo}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Reason:</span>
                <p className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono text-[11px]">
                  "{selectedLog.reason}"
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedLog(null)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
            >
              Close Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveAuditHistoryTab;
