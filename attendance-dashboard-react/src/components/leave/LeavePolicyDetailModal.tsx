import React, { useState } from 'react';
import { LeaveType } from '../../types/leave';

interface LeavePolicyDetailModalProps {
  leaveType: LeaveType | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenEditModal: (leaveType: LeaveType) => void;
  onDeleteLeaveType?: (leaveTypeId: string) => void;
}

export const LeavePolicyDetailModal: React.FC<LeavePolicyDetailModalProps> = ({
  leaveType,
  isOpen,
  onClose,
  onOpenEditModal,
  onDeleteLeaveType
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'advanced'>('general');

  if (!isOpen || !leaveType) return null;

  const yrQuota = leaveType.leavesAllowedPerYear != null ? leaveType.leavesAllowedPerYear : leaveType.annualAllocation;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" />

      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100 p-6 z-10 space-y-5 animate-fadeIn">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <span
                className="w-3.5 h-3.5 rounded-full"
                style={{ backgroundColor: leaveType.displayColor || '#6366f1' }}
              />
              <h2 className="text-xl font-bold text-slate-100">{leaveType.name}</h2>
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold border ${
                  leaveType.isPaid
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}
              >
                {leaveType.isPaid ? 'Paid' : 'Unpaid (LWP)'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation matching user screenshot */}
        <div className="flex border-b border-slate-800 gap-6">
          <button
            onClick={() => setActiveTab('general')}
            className={`pb-3 text-sm font-semibold transition border-b-2 ${
              activeTab === 'general'
                ? 'text-blue-400 border-blue-500'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            General Settings
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`pb-3 text-sm font-semibold transition border-b-2 ${
              activeTab === 'advanced'
                ? 'text-blue-400 border-blue-500'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            Advanced Settings
          </button>
        </div>

        {/* TAB 1: GENERAL SETTINGS (Screenshot 1) */}
        {activeTab === 'general' && (
          <div className="space-y-4 text-xs">
            <div>
              <p className="font-bold text-slate-200">Name</p>
              <p className="text-slate-400 mt-0.5">{leaveType.name}</p>
            </div>

            <div>
              <p className="font-bold text-slate-200">Description</p>
              <p className="text-slate-400 mt-0.5">
                {leaveType.description || 'This is a default description for the Leave Type. You can customise this.'}
              </p>
            </div>

            <div>
              <p className="font-bold text-slate-200">Leave Short Name</p>
              <p className="text-slate-400 font-mono mt-0.5">{leaveType.shortName || leaveType.code || '--'}</p>
            </div>

            {/* Matrix Table */}
            <div className="border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
              
              {/* Row 1: Leaves Count */}
              <div className="grid grid-cols-1 md:grid-cols-3 p-3.5 bg-slate-800/40 gap-3">
                <div className="font-bold text-slate-200">Leaves Count</div>
                <div>
                  <p className="font-bold text-slate-300">Leaves Allowed in a Year</p>
                  <p className="text-slate-400 font-mono mt-0.5">{Number(yrQuota).toFixed(1)}</p>
                  
                  <p className="font-bold text-slate-300 mt-3">Holidays Between Leave</p>
                  <p className="text-slate-400 mt-0.5">
                    {leaveType.holidaysBetweenLeave === 'CONSIDERED' ? 'Considered' : 'Not Considered'}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-slate-300">Weekends Between Leave</p>
                  <p className="text-slate-400 mt-0.5">
                    {leaveType.weekendsBetweenLeave === 'CONSIDERED' ? 'Considered' : 'Not Considered'}
                  </p>
                </div>
              </div>

              {/* Row 2: Accrual */}
              <div className="grid grid-cols-1 md:grid-cols-3 p-3.5 gap-3">
                <div className="font-bold text-slate-200">Accrual</div>
                <div>
                  <p className="font-bold text-slate-300">Creditable On Accrual Basis</p>
                  <p className="text-slate-400 mt-0.5">
                    {leaveType.creditableOnAccrualBasis
                      ? `Yes (${leaveType.accrualAmount}d / ${(leaveType.accrualFrequency || 'MONTHLY').toLowerCase()})`
                      : 'No (Lump-sum for 1 year)'}
                  </p>
                </div>
                <div />
              </div>

              {/* Row 3: Applicability */}
              <div className="grid grid-cols-1 md:grid-cols-3 p-3.5 bg-slate-800/40 gap-3">
                <div className="font-bold text-slate-200">Applicability</div>
                <div>
                  <p className="font-bold text-slate-300">Allowed under Probation</p>
                  <p className="text-slate-400 mt-0.5">
                    {leaveType.allowedUnderProbation !== false ? 'Yes' : 'No'}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-slate-300">Allowed under Notice Period</p>
                  <p className="text-slate-400 mt-0.5">
                    {leaveType.allowedUnderNoticePeriod ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>

              {/* Row 4: Leave Encash */}
              <div className="grid grid-cols-1 md:grid-cols-3 p-3.5 gap-3">
                <div className="font-bold text-slate-200">Leave Encash</div>
                <div>
                  <p className="font-bold text-slate-300 flex items-center gap-1.5">
                    Leave Encash Enabled
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-800 text-[10px] text-slate-400 flex items-center justify-center">i</span>
                  </p>
                  <p className="text-slate-400 mt-0.5">
                    {leaveType.encashmentEnabled
                      ? `Yes (Min: ${leaveType.encashmentMinBalance || 0}d, Max: ${leaveType.encashmentMaxDays || 0}d)`
                      : 'No'}
                  </p>
                </div>
                <div />
              </div>

              {/* Row 5: Carry Forward */}
              <div className="grid grid-cols-1 md:grid-cols-3 p-3.5 bg-slate-800/40 gap-3">
                <div className="font-bold text-slate-200">Carry Forward</div>
                <div>
                  <p className="font-bold text-slate-300 flex items-center gap-1.5">
                    Carry Forward Enabled
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-800 text-[10px] text-slate-400 flex items-center justify-center">i</span>
                  </p>
                  <p className="text-slate-400 mt-0.5">
                    {leaveType.carryForwardEnabled
                      ? `Yes (Max: ${leaveType.maximumCarryForward || '∞'} days, Expiry: ${leaveType.carryForwardExpiryDays || 0} days)`
                      : 'No'}
                  </p>
                </div>
                <div />
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: ADVANCED SETTINGS (Screenshot 2) */}
        {activeTab === 'advanced' && (
          <div className="space-y-4 text-xs">
            <div className="border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
              
              {/* Row 1: Leaves Count */}
              <div className="grid grid-cols-1 md:grid-cols-3 p-3.5 bg-slate-800/40 gap-3">
                <div className="font-bold text-slate-200">Leaves Count</div>
                <div>
                  <p className="font-bold text-slate-300">Max. Leaves Allowed in a Month</p>
                  <p className="text-slate-400 font-mono mt-0.5">
                    {leaveType.maxLeavesAllowedInMonth != null ? Number(leaveType.maxLeavesAllowedInMonth).toFixed(2) : 'Unlimited'}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-slate-300">Continuous Leaves Allowed</p>
                  <p className="text-slate-400 font-mono mt-0.5">
                    {leaveType.continuousLeavesAllowed != null ? leaveType.continuousLeavesAllowed : 'Unlimited'}
                  </p>
                </div>
              </div>

              {/* Row 2: Applicability */}
              <div className="grid grid-cols-1 md:grid-cols-3 p-3.5 gap-3">
                <div className="font-bold text-slate-200">Applicability</div>
                <div>
                  <p className="font-bold text-slate-300">Negative Leaves Allowed</p>
                  <p className="text-slate-400 mt-0.5">
                    {leaveType.negativeLeavesAllowed
                      ? `Yes (Limit: ${leaveType.negativeBalanceLimit || 0} days)`
                      : 'No'}
                  </p>
                </div>
                <div />
              </div>

              {/* Row 3: Miscellaneous */}
              <div className="grid grid-cols-1 md:grid-cols-3 p-3.5 bg-slate-800/40 gap-3">
                <div className="font-bold text-slate-200">Miscellaneous</div>
                <div>
                  <p className="font-bold text-slate-300">Future-dated Leaves Allowed</p>
                  <p className="text-slate-400 mt-0.5">
                    {leaveType.futureDatedLeavesAllowed !== false ? 'Yes' : 'No'}
                  </p>

                  <p className="font-bold text-slate-300 mt-3">Backdated Leaves Allowed</p>
                  <p className="text-slate-400 mt-0.5">
                    {leaveType.backdatedLeavesAllowed ? 'Yes' : 'No'}
                  </p>

                  <p className="font-bold text-slate-300 mt-3">Apply Leaves for Next Year Till</p>
                  <p className="text-slate-400 mt-0.5">{leaveType.applyLeavesForNextYearTill || '--'}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-300">Future-dated Leaves Allowed After</p>
                  <p className="text-slate-400 mt-0.5">
                    {leaveType.futureDatedAllowedAfterDays || 0} Days
                  </p>

                  <p className="font-bold text-slate-300 mt-3">Backdated Leaves Allowed up to</p>
                  <p className="text-slate-400 mt-0.5">
                    {leaveType.backdatedAllowedUpToDays || 0} Days
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-800">
          {onDeleteLeaveType ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onDeleteLeaveType(leaveType.id);
              }}
              className="px-3.5 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
              </svg>
              Delete Policy
            </button>
          ) : <div />}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenEditModal(leaveType);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
            >
              Edit Policy Rules
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
