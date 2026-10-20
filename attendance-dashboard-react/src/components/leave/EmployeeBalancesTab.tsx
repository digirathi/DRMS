import React, { useState } from 'react';
import { LeaveBalance, LeaveType, LeaveBalanceTransaction } from '../../types/leave';

interface EmployeeBalancesTabProps {
  balances: LeaveBalance[];
  leaveTypes: LeaveType[];
  loading: boolean;
  onAdjustBalance: (balanceId: string, payload: any) => Promise<void>;
  onFetchTransactions: (balanceId: string) => Promise<LeaveBalanceTransaction[]>;
  onOpenAssignLeave?: () => void;
  onOpenManualLeave?: () => void;
}

export const EmployeeBalancesTab: React.FC<EmployeeBalancesTabProps> = ({
  balances,
  leaveTypes,
  loading,
  onAdjustBalance,
  onFetchTransactions,
  onOpenAssignLeave,
  onOpenManualLeave
}) => {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('ALL');
  const [leaveTypeId, setLeaveTypeId] = useState('ALL');
  const [lowBalanceOnly, setLowBalanceOnly] = useState(false);

  // Adjustment Modal State
  const [selectedBalance, setSelectedBalance] = useState<LeaveBalance | null>(null);
  const [adjType, setAdjType] = useState<'CREDIT' | 'DEDUCT'>('CREDIT');
  const [adjDays, setAdjDays] = useState<number>(1);
  const [adjReason, setAdjReason] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // History Drawer State
  const [historyBalance, setHistoryBalance] = useState<LeaveBalance | null>(null);
  const [transactions, setTransactions] = useState<LeaveBalanceTransaction[]>([]);
  const [loadingTx, setLoadingTx] = useState(false);

  const filteredBalances = balances.filter((b) => {
    const matchSearch =
      !search ||
      b.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      b.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
      b.department.toLowerCase().includes(search.toLowerCase());
    const matchDept = department === 'ALL' || b.department === department;
    const matchType = leaveTypeId === 'ALL' || b.leaveTypeId === leaveTypeId;
    const matchLow = !lowBalanceOnly || b.availableBalance <= 2;
    return matchSearch && matchDept && matchType && matchLow;
  });

  const handleOpenAdjustment = (bal: LeaveBalance) => {
    setSelectedBalance(bal);
    setAdjType('CREDIT');
    setAdjDays(1);
    setAdjReason('');
    setInternalNote('');
    setErrorMsg(null);
  };

  const handleConfirmAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBalance) return;

    if (!adjDays || adjDays <= 0) {
      setErrorMsg('Number of days must be greater than 0.');
      return;
    }

    if (!adjReason.trim() || adjReason.trim().length < 5) {
      setErrorMsg('Reason for Balance Adjustment is mandatory (minimum 5 characters).');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await onAdjustBalance(selectedBalance.id, {
        adjustmentType: adjType,
        days: adjDays,
        reason: adjReason.trim(),
        internalNote: internalNote.trim() || undefined
      });
      setSelectedBalance(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to adjust balance.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewHistory = async (bal: LeaveBalance) => {
    setHistoryBalance(bal);
    setLoadingTx(true);
    try {
      const txs = await onFetchTransactions(bal.id);
      setTransactions(txs);
    } finally {
      setLoadingTx(false);
    }
  };

  const previewBalance = selectedBalance
    ? adjType === 'CREDIT'
      ? selectedBalance.availableBalance + Number(adjDays || 0)
      : selectedBalance.availableBalance - Number(adjDays || 0)
    : 0;

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            placeholder="Search employee name or code..."
            className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50"
          />

          <select
            value={department}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDepartment(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Design">Design</option>
            <option value="Sales">Sales</option>
            <option value="Human Resources">Human Resources</option>
          </select>

          <select
            value={leaveTypeId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLeaveTypeId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
          >
            <option value="ALL">All Leave Types</option>
            {leaveTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {onOpenAssignLeave && (
            <button
              onClick={onOpenAssignLeave}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
              Assign Leave to Employees
            </button>
          )}

          {onOpenManualLeave && (
            <button
              onClick={onOpenManualLeave}
              title="Record an approved absence on behalf of an employee (deducts from balance)"
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
              Record Employee Absence
            </button>
          )}

          <label className="flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={lowBalanceOnly}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLowBalanceOnly(e.target.checked)}
              className="rounded border-amber-500 text-amber-500"
            />
            <span>Low / Negative Only</span>
          </label>
        </div>
      </div>

      {/* Balances Table */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-2xl table-wrap">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/90 text-slate-300 font-semibold uppercase tracking-wider sticky top-0 z-10 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Employee</th>
                <th className="px-3 py-3.5">Department</th>
                <th className="px-3 py-3.5">Leave Type</th>
                <th className="px-3 py-3.5 text-center">Opening</th>
                <th className="px-3 py-3.5 text-center">Refilled</th>
                <th className="px-3 py-3.5 text-center">Carried Fwd</th>
                <th className="px-3 py-3.5 text-center text-rose-400">Used</th>
                <th className="px-3 py-3.5 text-center text-amber-400">Pending</th>
                <th className="px-3 py-3.5 text-center text-indigo-400">Adjusted</th>
                <th className="px-3 py-3.5 text-center font-bold text-emerald-400">Available</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/70 text-slate-200">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-4"><div className="h-4 bg-slate-800 rounded w-24" /></td>
                    <td className="p-3"><div className="h-4 bg-slate-800 rounded w-20" /></td>
                    <td className="p-3"><div className="h-4 bg-slate-800 rounded w-20" /></td>
                    <td colSpan={7} className="p-3"><div className="h-4 bg-slate-800 rounded w-full" /></td>
                    <td className="p-4"><div className="h-6 bg-slate-800 rounded w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredBalances.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    No employee leave balances match your filters.
                  </td>
                </tr>
              ) : (
                filteredBalances.map((bal) => (
                  <tr key={bal.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-semibold">
                      <p className="text-slate-100">{bal.employeeName}</p>
                      <p className="text-[10px] font-mono text-slate-400">{bal.employeeCode}</p>
                    </td>

                    <td className="px-3 py-3 text-slate-300">{bal.department}</td>
                    <td className="px-3 py-3 font-medium text-indigo-300">{bal.leaveTypeName}</td>
                    <td className="px-3 py-3 text-center font-mono">{bal.openingBalance}d</td>
                    <td className="px-3 py-3 text-center font-mono text-emerald-400">+{bal.refilled}d</td>
                    <td className="px-3 py-3 text-center font-mono">{bal.carriedForward}d</td>
                    <td className="px-3 py-3 text-center font-mono text-rose-400">-{bal.used}d</td>
                    <td className="px-3 py-3 text-center font-mono text-amber-400">{bal.pending}d</td>
                    <td className="px-3 py-3 text-center font-mono text-indigo-400">
                      {bal.manuallyAdjusted > 0 ? `+${bal.manuallyAdjusted}` : bal.manuallyAdjusted}d
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`font-mono font-extrabold px-2.5 py-1 rounded-lg ${
                          bal.availableBalance <= 2
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {bal.availableBalance} days
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenAdjustment(bal)}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-semibold transition"
                      >
                        Adjust
                      </button>
                      <button
                        onClick={() => handleViewHistory(bal)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-semibold transition"
                      >
                        Tx History
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Balance Adjustment Modal */}
      {selectedBalance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setSelectedBalance(null)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />

          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 text-slate-100 animate-fadeIn">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                  ⚡
                </span>
                Adjust Employee Leave Balance
              </h3>
              <button onClick={() => setSelectedBalance(null)} className="text-slate-400 hover:text-slate-200">
                ✕
              </button>
            </div>

            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 text-xs space-y-1 text-slate-300">
              <p>
                Employee: <strong className="text-slate-100">{selectedBalance.employeeName}</strong> ({selectedBalance.employeeCode})
              </p>
              <p>
                Leave Type: <span className="text-indigo-400 font-semibold">{selectedBalance.leaveTypeName}</span>
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleConfirmAdjustment} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Adjustment Type</label>
                  <select
                    value={adjType}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAdjType(e.target.value as 'CREDIT' | 'DEDUCT')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
                  >
                    <option value="CREDIT">+ Credit Balance</option>
                    <option value="DEDUCT">- Deduct Balance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Number of Days</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={adjDays}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdjDays(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 font-mono"
                  />
                </div>
              </div>

              {/* Preview Box */}
              <div className="p-3.5 bg-indigo-950/30 border border-indigo-500/20 rounded-xl text-xs flex justify-between items-center">
                <span>Current: <strong>{selectedBalance.availableBalance}d</strong></span>
                <span className="font-bold text-indigo-400">
                  {adjType === 'CREDIT' ? `+${adjDays}` : `-${adjDays}`}d
                </span>
                <span>Preview New: <strong className="text-emerald-400">{previewBalance}d</strong></span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Reason for Balance Adjustment <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={adjReason}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAdjReason(e.target.value)}
                  placeholder="Mandatory reason for audit record..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Internal Note (Optional)</label>
                <input
                  type="text"
                  value={internalNote}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInternalNote(e.target.value)}
                  placeholder="Internal reference or ticket ID..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-100"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBalance(null)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-950/50"
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Balance Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction History Drawer */}
      {historyBalance && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div onClick={() => setHistoryBalance(null)} className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />

          <div className="relative w-full max-w-lg bg-slate-900 border-l border-slate-800 shadow-2xl text-slate-100 flex flex-col justify-between h-full z-10 animate-slideLeft">
            <div className="p-6 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-100">Leave Balance Audit Trail</h3>
                <p className="text-xs text-slate-400">
                  {historyBalance.employeeName} ({historyBalance.employeeCode}) &middot;{' '}
                  <span className="text-indigo-400 font-semibold">{historyBalance.leaveTypeName}</span>
                </p>
              </div>
              <button onClick={() => setHistoryBalance(null)} className="text-slate-400 hover:text-slate-200">
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {loadingTx ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="h-16 bg-slate-800/50 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : transactions.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  No historical ledger transactions recorded for this balance record yet.
                </div>
              ) : (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span
                          className={`font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-full border ${
                            tx.transactionType === 'MANUAL_BALANCE_CREDIT' || tx.transactionType === 'AUTO_REFILL_SUCCESS'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {tx.transactionType.replace(/_/g, ' ')}
                        </span>
                        <p className="text-slate-300 font-medium mt-1">{tx.reason}</p>
                      </div>
                      <span
                        className={`font-mono font-extrabold text-sm ${
                          tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {tx.amount > 0 ? `+${tx.amount}` : tx.amount}d
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                      <span>By: {tx.performedByName || 'System'}</span>
                      <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
              <button
                onClick={() => setHistoryBalance(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeBalancesTab;
