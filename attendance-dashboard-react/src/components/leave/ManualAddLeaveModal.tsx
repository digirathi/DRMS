import React, { useState, useMemo } from 'react';
import { LeaveType, LeaveDayType } from '../../types/leave';

interface ManualAddLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaveTypes: LeaveType[];
  onSaveManualLeave: (payload: any) => Promise<void>;
}

export const ManualAddLeaveModal: React.FC<ManualAddLeaveModalProps> = ({
  isOpen,
  onClose,
  leaveTypes,
  onSaveManualLeave
}) => {
  const [employeeId, setEmployeeId] = useState('EMP001');
  const [employeeName, setEmployeeName] = useState('Demo Person 13');
  const [employeeCode, setEmployeeCode] = useState('DR-1001');
  const [department, setDepartment] = useState('Engineering');
  const [leaveTypeId, setLeaveTypeId] = useState(leaveTypes[0]?.id || 'lt-casual');
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-08-01');
  const [dayType, setDayType] = useState<LeaveDayType>('FULL_DAY');
  const [reason, setReason] = useState('');
  const [approvalStatus] = useState('APPROVED');
  const [deductBalance] = useState(true);
  const [internalNote] = useState('');
  const [manualEntryReason, setManualEntryReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedPolicy = useMemo(() => {
    return leaveTypes.find((t) => t.id === leaveTypeId) || leaveTypes[0];
  }, [leaveTypes, leaveTypeId]);

  const calculatedDays = useMemo(() => {
    if (!startDate || !endDate || startDate > endDate) return 0;
    if (dayType !== 'FULL_DAY') {
      const d = new Date(startDate);
      const dayOfWeek = d.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      if (isWeekend && selectedPolicy?.weekendsBetweenLeave === 'NOT_CONSIDERED') return 0;
      return 0.5;
    }

    let current = new Date(startDate);
    const end = new Date(endDate);
    let workingDays = 0;

    while (current <= end) {
      const dayOfWeek = current.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const skipWeekend = isWeekend && selectedPolicy?.weekendsBetweenLeave === 'NOT_CONSIDERED';

      if (!skipWeekend) {
        workingDays += 1;
      }
      current.setDate(current.getDate() + 1);
    }

    return workingDays;
  }, [startDate, endDate, dayType, selectedPolicy]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (calculatedDays <= 0) {
      setErrorMsg(`The selected date range contains only non-working days (weekends) excluded under ${selectedPolicy?.name || 'this policy'}.`);
      return;
    }
    if (!reason.trim() || !manualEntryReason.trim()) {
      setErrorMsg('Reason and Mandatory Reason for Manual Entry are required.');
      return;
    }

    // Policy Rule Checks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startD = new Date(startDate);
    startD.setHours(0, 0, 0, 0);
    const msPerDay = 86400000;
    const todayStr = today.toISOString().split('T')[0];

    if (startDate > todayStr) {
      if (selectedPolicy?.futureDatedLeavesAllowed === false) {
        setErrorMsg(`Future-dated leaves are not allowed for ${selectedPolicy.name}.`);
        return;
      }
      const daysInAdvance = Math.round((startD.getTime() - today.getTime()) / msPerDay);
      const minBuffer = selectedPolicy?.futureDatedAllowedAfterDays || 0;
      if (minBuffer > 0 && daysInAdvance < minBuffer) {
        setErrorMsg(`${selectedPolicy.name} requires at least ${minBuffer} day(s) advance notice.`);
        return;
      }
    }

    if (startDate < todayStr) {
      if (selectedPolicy?.backdatedLeavesAllowed === false) {
        setErrorMsg(`Backdated leaves are not permitted under the ${selectedPolicy.name} policy.`);
        return;
      }
      const daysInPast = Math.round((today.getTime() - startD.getTime()) / msPerDay);
      const maxPastWindow = selectedPolicy?.backdatedAllowedUpToDays || 15;
      if (daysInPast > maxPastWindow) {
        setErrorMsg(`Backdated leaves for ${selectedPolicy.name} can only be applied up to ${maxPastWindow} days in the past.`);
        return;
      }
    }

    if (selectedPolicy?.continuousLeavesAllowed != null && calculatedDays > selectedPolicy.continuousLeavesAllowed) {
      setErrorMsg(`The maximum continuous leave allowed for ${selectedPolicy.name} is ${selectedPolicy.continuousLeavesAllowed} days in a single application.`);
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await onSaveManualLeave({
        employeeId,
        employeeName,
        employeeCode,
        department,
        leaveTypeId,
        startDate,
        endDate,
        dayType,
        totalDays: calculatedDays,
        reason: reason.trim(),
        approvalStatus,
        deductBalance,
        internalNote: internalNote.trim() || undefined,
        manualEntryReason: manualEntryReason.trim()
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit manual leave entry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTypeName = selectedPolicy?.name || 'Casual Leave';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />

      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 p-6 space-y-5 animate-fadeIn max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
              </span>
              Record Employee Absence (Manual Leave Entry)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Record an approved leave absence on behalf of an employee. This deducts days from their available balance.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Employee *</label>
              <select
                value={employeeId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setEmployeeId(e.target.value);
                  if (e.target.value === 'EMP001') {
                    setEmployeeName('Demo Person 13');
                    setEmployeeCode('DR-1001');
                    setDepartment('Engineering');
                  } else if (e.target.value === 'EMP002') {
                    setEmployeeName('Demo Person 14');
                    setEmployeeCode('DR-1002');
                    setDepartment('Product');
                  } else {
                    setEmployeeName('Demo Person 16');
                    setEmployeeCode('DR-1003');
                    setDepartment('Design');
                  }
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
              >
                <option value="EMP001">Demo Person 13 (DR-1001)</option>
                <option value="EMP002">Demo Person 14 (DR-1002)</option>
                <option value="EMP003">Demo Person 16 (DR-1003)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Leave Type *</label>
              <select
                value={leaveTypeId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLeaveTypeId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
              >
                {leaveTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">End Date *</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Day Type</label>
              <select
                value={dayType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDayType(e.target.value as LeaveDayType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
              >
                <option value="FULL_DAY">Full Day</option>
                <option value="FIRST_HALF">First Half</option>
                <option value="SECOND_HALF">Second Half</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Employee Reason *</label>
            <textarea
              rows={2}
              required
              value={reason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
              placeholder="Reason for taking leave..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Reason for Manual Entry * <span className="text-rose-400 font-normal">(Audited)</span>
            </label>
            <input
              type="text"
              required
              value={manualEntryReason}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManualEntryReason(e.target.value)}
              placeholder="e.g. Employee submitted physical form or offline request..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
            />
          </div>

          {/* Change Summary Box */}
          <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs space-y-2">
            <h4 className="font-bold text-indigo-300 uppercase tracking-wider text-[11px]">
              Change Summary Preview
            </h4>
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-indigo-500/20">
              <div>
                <span className="text-slate-400 block">Leave Status</span>
                <span className="text-rose-400 block">Old: Pending</span>
                <span className="text-emerald-400 font-bold">New: Approved {selectedTypeName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Working Days Charged</span>
                <span className="text-slate-300 block">{calculatedDays} day{calculatedDays !== 1 ? 's' : ''}</span>
                <span className="text-indigo-300 font-bold">
                  {selectedPolicy?.weekendsBetweenLeave === 'NOT_CONSIDERED' ? '(Excl. weekends)' : '(Incl. weekends)'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Attendance</span>
                <span className="text-slate-300 block">Old: Scheduled</span>
                <span className="text-amber-400 font-bold">New: On Leave</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-950/50"
            >
              {isSubmitting ? 'Saving...' : 'Submit Manual Leave'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualAddLeaveModal;
