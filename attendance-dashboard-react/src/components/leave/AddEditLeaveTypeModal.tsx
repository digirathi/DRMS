import React, { useState, useEffect } from 'react';
import { LeaveType } from '../../types/leave';

interface AddEditLeaveTypeModalProps {
  leaveType: LeaveType | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveLeaveType: (data: Partial<LeaveType>) => Promise<void>;
}

export const AddEditLeaveTypeModal: React.FC<AddEditLeaveTypeModalProps> = ({
  leaveType,
  isOpen,
  onClose,
  onSaveLeaveType
}) => {
  const [formData, setFormData] = useState<Partial<LeaveType>>({
    name: '',
    code: '',
    shortName: '',
    description: '',
    isPaid: true,
    isActive: true,
    displayColor: '#6366f1',
    annualAllocation: 12,
    leavesAllowedPerYear: 12,
    weekendsBetweenLeave: 'NOT_CONSIDERED',
    holidaysBetweenLeave: 'NOT_CONSIDERED',
    creditableOnAccrualBasis: false,
    accrualFrequency: 'YEARLY',
    accrualAmount: 0,
    allowedUnderProbation: true,
    allowedUnderNoticePeriod: false,
    encashmentEnabled: false,
    encashmentMinBalance: 0,
    encashmentMaxDays: 0,
    carryForwardEnabled: false,
    maximumCarryForward: 0,
    carryForwardExpiryDays: 0,
    maxLeavesAllowedInMonth: null,
    continuousLeavesAllowed: null,
    negativeLeavesAllowed: false,
    negativeBalanceLimit: 0,
    futureDatedLeavesAllowed: true,
    futureDatedAllowedAfterDays: 0,
    backdatedLeavesAllowed: false,
    backdatedAllowedUpToDays: 15,
    applyLeavesForNextYearTill: ''
  });

  const [activeTab, setActiveTab] = useState<'general' | 'advanced'>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (leaveType) {
      setFormData({
        ...leaveType,
        shortName: leaveType.shortName || leaveType.code,
        leavesAllowedPerYear: leaveType.leavesAllowedPerYear != null ? leaveType.leavesAllowedPerYear : leaveType.annualAllocation
      });
    } else {
      setFormData({
        name: '',
        code: '',
        shortName: '',
        description: 'This is a default description for the Leave Type. You can customise this.',
        isPaid: true,
        isActive: true,
        displayColor: '#6366f1',
        annualAllocation: 12,
        leavesAllowedPerYear: 12,
        weekendsBetweenLeave: 'NOT_CONSIDERED',
        holidaysBetweenLeave: 'NOT_CONSIDERED',
        creditableOnAccrualBasis: false,
        accrualFrequency: 'YEARLY',
        accrualAmount: 0,
        allowedUnderProbation: true,
        allowedUnderNoticePeriod: false,
        encashmentEnabled: false,
        encashmentMinBalance: 0,
        encashmentMaxDays: 0,
        carryForwardEnabled: false,
        maximumCarryForward: 0,
        carryForwardExpiryDays: 0,
        maxLeavesAllowedInMonth: null,
        continuousLeavesAllowed: null,
        negativeLeavesAllowed: false,
        negativeBalanceLimit: 0,
        futureDatedLeavesAllowed: true,
        futureDatedAllowedAfterDays: 0,
        backdatedLeavesAllowed: false,
        backdatedAllowedUpToDays: 15,
        applyLeavesForNextYearTill: ''
      });
    }
  }, [leaveType, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || (!formData.code?.trim() && !formData.shortName?.trim())) {
      setErrorMsg('Leave Type Name and Leave Code / Short Name are mandatory fields.');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const codeVal = (formData.code || formData.shortName || '').trim().toUpperCase();
      const yrAllocation = Number(formData.leavesAllowedPerYear ?? formData.annualAllocation ?? 12);
      await onSaveLeaveType({
        ...formData,
        creditableOnAccrualBasis:false, accrualFrequency:'YEARLY', accrualAmount:0, autoRefillEnabled:false,
        code: codeVal,
        shortName: codeVal,
        annualAllocation: yrAllocation,
        leavesAllowedPerYear: yrAllocation
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save leave policy.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      <div onClick={onClose} className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />

      <div className="relative w-full max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl text-slate-100 flex flex-col justify-between h-full z-10">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h3 className="text-xl font-bold text-slate-100">
              {leaveType ? `Edit Leave Policy (${leaveType.name})` : 'Create Custom Leave Policy'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Standardized General and Advanced leave policy configuration.
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-200 rounded-lg">
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 gap-3 pt-3">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`pb-3 text-xs font-bold px-3 border-b-2 transition ${
              activeTab === 'general'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. General Settings
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('advanced')}
            className={`pb-3 text-xs font-bold px-3 border-b-2 transition ${
              activeTab === 'advanced'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Advanced Settings
          </button>
        </div>

        {/* Form Body */}
        <form id="leave-type-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 font-medium">
              {errorMsg}
            </div>
          )}

          {/* TAB 1: GENERAL SETTINGS */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Leave Type Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Casual Leave"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Leave Code / Short Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code || formData.shortName || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase(), shortName: e.target.value.toUpperCase() }))}
                    placeholder="e.g. CL"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief policy description..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Pay Status</label>
                  <select
                    value={formData.isPaid ? 'PAID' : 'UNPAID'}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData((prev) => ({ ...prev, isPaid: e.target.value === 'PAID' }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                  >
                    <option value="PAID">Paid Leave</option>
                    <option value="UNPAID">Unpaid Leave (LWP)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Annual Quota (Days)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={formData.leavesAllowedPerYear ?? formData.annualAllocation ?? 12}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const val = Number(e.target.value);
                      setFormData((prev) => ({ ...prev, leavesAllowedPerYear: val, annualAllocation: val }));
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Display Color</label>
                  <input
                    type="color"
                    value={formData.displayColor || '#6366f1'}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, displayColor: e.target.value }))}
                    className="w-full h-8 bg-slate-900 border border-slate-800 rounded-lg p-1 cursor-pointer"
                  />
                </div>
              </div>

              {/* Weekends & Holidays */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Weekends Between Leave</label>
                  <select
                    value={formData.weekendsBetweenLeave || 'NOT_CONSIDERED'}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData((prev) => ({ ...prev, weekendsBetweenLeave: e.target.value as any }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                  >
                    <option value="NOT_CONSIDERED">Not Considered (Excluded)</option>
                    <option value="CONSIDERED">Considered (Counted as leave)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Holidays Between Leave</label>
                  <select
                    value={formData.holidaysBetweenLeave || 'NOT_CONSIDERED'}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData((prev) => ({ ...prev, holidaysBetweenLeave: e.target.value as any }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                  >
                    <option value="NOT_CONSIDERED">Not Considered (Excluded)</option>
                    <option value="CONSIDERED">Considered (Counted as leave)</option>
                  </select>
                </div>
              </div>

              <div className="rounded-xl border border-slate-700 p-4 text-slate-200"><strong>Annual lump-sum allocation</strong><p>The full annual quota is assigned for a one-year cycle through Assign Leave Policy to Employees.</p></div>

              {/* Applicability */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Allowed Under Probation *</label>
                  <select
                    value={formData.allowedUnderProbation !== false ? 'YES' : 'NO'}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData((prev) => ({ ...prev, allowedUnderProbation: e.target.value === 'YES' }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                  >
                    <option value="YES">Yes</option>
                    <option value="NO">No</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Allowed Under Notice Period *</label>
                  <select
                    value={formData.allowedUnderNoticePeriod ? 'YES' : 'NO'}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData((prev) => ({ ...prev, allowedUnderNoticePeriod: e.target.value === 'YES' }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                  >
                    <option value="NO">No</option>
                    <option value="YES">Yes</option>
                  </select>
                </div>
              </div>

              {/* Encashment & Carry Forward */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <label className="block font-semibold text-slate-300">Leave Encash Enabled</label>
                  <select
                    value={formData.encashmentEnabled ? 'YES' : 'NO'}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData((prev) => ({ ...prev, encashmentEnabled: e.target.value === 'YES' }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                  >
                    <option value="NO">No</option>
                    <option value="YES">Yes</option>
                  </select>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <label className="block font-semibold text-slate-300">Carry Forward Enabled</label>
                  <select
                    value={formData.carryForwardEnabled ? 'YES' : 'NO'}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData((prev) => ({ ...prev, carryForwardEnabled: e.target.value === 'YES' }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                  >
                    <option value="NO">No</option>
                    <option value="YES">Yes</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADVANCED SETTINGS */}
          {activeTab === 'advanced' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Max Leaves Allowed in a Month</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.maxLeavesAllowedInMonth ?? ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, maxLeavesAllowedInMonth: e.target.value ? Number(e.target.value) : null }))}
                    placeholder="e.g. 8.00 (blank = unlimited)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Continuous Leaves Allowed (Days)</label>
                  <input
                    type="number"
                    value={formData.continuousLeavesAllowed ?? ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, continuousLeavesAllowed: e.target.value ? Number(e.target.value) : null }))}
                    placeholder="e.g. 8 (max consecutive)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Negative Leaves Allowed</label>
                  <select
                    value={formData.negativeLeavesAllowed ? 'YES' : 'NO'}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData((prev) => ({ ...prev, negativeLeavesAllowed: e.target.value === 'YES' }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                  >
                    <option value="NO">No</option>
                    <option value="YES">Yes</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Negative Balance Limit</label>
                  <input
                    type="number"
                    value={formData.negativeBalanceLimit ?? 0}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, negativeBalanceLimit: Number(e.target.value) }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Future-dated Leaves Allowed</label>
                  <select
                    value={formData.futureDatedLeavesAllowed !== false ? 'YES' : 'NO'}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData((prev) => ({ ...prev, futureDatedLeavesAllowed: e.target.value === 'YES' }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                  >
                    <option value="YES">Yes</option>
                    <option value="NO">No</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Future-dated Allowed After (Days)</label>
                  <input
                    type="number"
                    value={formData.futureDatedAllowedAfterDays ?? 0}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, futureDatedAllowedAfterDays: Number(e.target.value) }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Backdated Leaves Allowed</label>
                  <select
                    value={formData.backdatedLeavesAllowed ? 'YES' : 'NO'}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData((prev) => ({ ...prev, backdatedLeavesAllowed: e.target.value === 'YES' }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                  >
                    <option value="YES">Yes</option>
                    <option value="NO">No</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Backdated Allowed up to (Days)</label>
                  <input
                    type="number"
                    value={formData.backdatedAllowedUpToDays ?? 15}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, backdatedAllowedUpToDays: Number(e.target.value) }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Apply Leaves for Next Year Till</label>
                <input
                  type="text"
                  value={formData.applyLeavesForNextYearTill || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, applyLeavesForNextYearTill: e.target.value }))}
                  placeholder="e.g. 31 Dec (boundary cutoff)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                />
              </div>
            </div>
          )}
        </form>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end gap-3 sticky bottom-0 z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="leave-type-form"
            disabled={isSubmitting}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-950/50"
          >
            {isSubmitting ? 'Saving...' : leaveType ? 'Save Policy Changes' : 'Create Leave Policy'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddEditLeaveTypeModal;
