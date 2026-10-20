import React, { useState, useMemo } from 'react';
import { LeaveType } from '../../types/leave';

interface AssignLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaveTypes: LeaveType[];
  onAssignPolicy?: (payload: {
    leaveTypeId: string;
    quotaAmount: number;
    assignmentMode: 'SET_ANNUAL' | 'ADD_TO_CURRENT';
    selectedEmployeeIds: string[];
    auditReason: string;
  }) => Promise<void>;
}

const SAMPLE_EMPLOYEES = [
  { id: 'EMP001', name: 'Demo Person 13', code: 'DR-1001', department: 'Engineering' },
  { id: 'EMP002', name: 'Demo Person 14', code: 'DR-1002', department: 'Product' },
  { id: 'EMP003', name: 'Demo Person 16', code: 'DR-1003', department: 'Design' },
  { id: 'EMP004', name: 'Demo Person 17', code: 'DR-1004', department: 'Engineering' },
  { id: 'EMP005', name: 'Demo Person 18', code: 'DR-1005', department: 'Human Resources' },
  { id: 'EMP006', name: 'Demo Person 19', code: 'DR-1006', department: 'Sales' }
];

export const AssignLeaveModal: React.FC<AssignLeaveModalProps> = ({
  isOpen,
  onClose,
  leaveTypes,
  onAssignPolicy
}) => {
  const activePolicies = useMemo(() => leaveTypes.filter(t => t.isActive), [leaveTypes]);
  const [selectedPolicyId, setSelectedPolicyId] = useState(activePolicies[0]?.id || 'lt-casual');
  
  const selectedPolicy = useMemo(() => {
    return activePolicies.find(t => t.id === selectedPolicyId) || activePolicies[0];
  }, [activePolicies, selectedPolicyId]);

  const defaultQuota = useMemo(() => {
    if (!selectedPolicy) return 12;
    return selectedPolicy.leavesAllowedPerYear != null 
      ? selectedPolicy.leavesAllowedPerYear 
      : (selectedPolicy.annualAllocation || 0);
  }, [selectedPolicy]);

  const [quotaAmount, setQuotaAmount] = useState<number>(defaultQuota);
  const [assignmentMode, setAssignmentMode] = useState<'SET_ANNUAL' | 'ADD_TO_CURRENT'>('SET_ANNUAL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmpIds, setSelectedEmpIds] = useState<string[]>(SAMPLE_EMPLOYEES.map(e => e.id));
  const [auditReason, setAuditReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Synchronize quota when policy changes
  React.useEffect(() => {
    setQuotaAmount(defaultQuota);
  }, [defaultQuota]);

  const filteredEmployees = useMemo(() => {
    return SAMPLE_EMPLOYEES.filter(emp => {
      const matchDept = deptFilter === 'ALL' || emp.department === deptFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || emp.name.toLowerCase().includes(q) || emp.id.toLowerCase().includes(q) || emp.code.toLowerCase().includes(q);
      return matchDept && matchSearch;
    });
  }, [deptFilter, searchQuery]);

  const isAllVisibleSelected = useMemo(() => {
    if (filteredEmployees.length === 0) return false;
    return filteredEmployees.every(emp => selectedEmpIds.includes(emp.id));
  }, [filteredEmployees, selectedEmpIds]);

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      const idsToAdd = filteredEmployees.map(e => e.id);
      setSelectedEmpIds(prev => Array.from(new Set([...prev, ...idsToAdd])));
    } else {
      const idsToRemove = new Set(filteredEmployees.map(e => e.id));
      setSelectedEmpIds(prev => prev.filter(id => !idsToRemove.has(id)));
    }
  };

  const toggleSelectEmp = (empId: string) => {
    setSelectedEmpIds(prev => 
      prev.includes(empId) ? prev.filter(id => id !== empId) : [...prev, empId]
    );
  };

  const departments = useMemo(() => {
    return Array.from(new Set(SAMPLE_EMPLOYEES.map(e => e.department)));
  }, []);

  if (!isOpen) return null;

  const totalAllocatedDays = (selectedEmpIds.length * Number(quotaAmount || 0)).toFixed(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (selectedEmpIds.length === 0) {
      setErrorMsg('Please select at least one employee to assign leave.');
      return;
    }

    if (quotaAmount < 0) {
      setErrorMsg('Quota amount cannot be negative.');
      return;
    }

    if (!auditReason.trim() || auditReason.trim().length < 5) {
      setErrorMsg('Mandatory audit reason is required (minimum 5 characters).');
      return;
    }

    try {
      setIsSubmitting(true);
      if (onAssignPolicy) {
        await onAssignPolicy({
          leaveTypeId: selectedPolicyId,
          quotaAmount,
          assignmentMode,
          selectedEmployeeIds: selectedEmpIds,
          auditReason: auditReason.trim()
        });
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to assign leave policy to employees.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto text-slate-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
              Assign Leave Policy & Quota to Employees
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Allocate annual lump-sum leave entitlements for the 1-year cycle.
            </p>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Step 1: Policy Selection & Quota */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Select Leave Policy *</label>
                <select
                  value={selectedPolicyId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedPolicyId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100"
                >
                  {activePolicies.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.code}) - {t.isPaid ? 'Paid' : 'Unpaid'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Annual Quota (Days) *</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={quotaAmount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuotaAmount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 font-mono font-bold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Assignment Mode</label>
              <select
                value={assignmentMode}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAssignmentMode(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100"
              >
                <option value="SET_ANNUAL">Set as Annual Base Quota (Sets Opening & Available Balance)</option>
                <option value="ADD_TO_CURRENT">Add as Additional Grant to Current Balance</option>
              </select>
            </div>
          </div>

          {/* Step 2: Employee Selection */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-slate-200">Select Employees to Assign *</label>
              <span className="text-slate-400 font-mono text-[11px]">
                {filteredEmployees.length} available &middot; {selectedEmpIds.length} selected
              </span>
            </div>

            {/* Filter Toolbar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Search by name or code..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs"
              />
              <select
                value={deptFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDeptFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs"
              >
                <option value="ALL">All Departments</option>
                {departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Select All Bar */}
            <div className="flex items-center justify-between bg-slate-950/40 px-3 py-2 rounded-xl border border-slate-800/60">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-300">
                <input
                  type="checkbox"
                  checked={isAllVisibleSelected}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => toggleSelectAll(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0 cursor-pointer"
                />
                <span>Select All Visible</span>
              </label>
              <span className="text-[11px] text-slate-500">Toggle all filtered</span>
            </div>

            {/* Scrollable Employee List */}
            <div className="max-h-40 overflow-y-auto border border-slate-800 rounded-xl bg-slate-950/80 p-2 space-y-1">
              {filteredEmployees.map(emp => {
                const isSelected = selectedEmpIds.includes(emp.id);
                return (
                  <label
                    key={emp.id}
                    onClick={() => toggleSelectEmp(emp.id)}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${
                      isSelected ? 'bg-emerald-950/30 border border-emerald-500/20' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // Handled by container
                        className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0 cursor-pointer"
                      />
                      <span className="font-semibold text-slate-100">{emp.name}</span>
                      <span className="text-slate-500 font-mono text-[11px]">({emp.id})</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-400 text-[10px]">
                      {emp.department}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Step 3: Change Summary Preview */}
          <div className="p-3.5 rounded-xl border bg-emerald-500/10 border-emerald-500/20 text-emerald-300">
            {selectedEmpIds.length > 0 ? (
              <p>
                ✓ <strong>Summary Preview:</strong> Will assign <strong>{quotaAmount} days</strong> of{' '}
                <strong>{selectedPolicy?.name}</strong> to <strong>{selectedEmpIds.length} employee(s)</strong>.
                Total allocated: <strong>{totalAllocatedDays} days</strong>.
              </p>
            ) : (
              <p className="text-amber-400">
                ⚠️ <em>No employees selected yet. Check individual employees or click &quot;Select All Visible&quot; above.</em>
              </p>
            )}
          </div>

          {/* Step 4: Mandatory Audit Reason */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Mandatory Audit Reason * <span className="text-slate-500 font-normal">(Min 5 characters)</span>
            </label>
            <textarea
              rows={2}
              required
              value={auditReason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAuditReason(e.target.value)}
              placeholder="e.g. Annual lump-sum entitlement allocation for FY 2026-27..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || selectedEmpIds.length === 0}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs transition"
            >
              {isSubmitting ? 'Assigning...' : 'Confirm & Assign Leave'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignLeaveModal;
