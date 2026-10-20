import React, { useState } from 'react';
import { LeaveType } from '../../types/leave';
import { LeavePolicyDetailModal } from './LeavePolicyDetailModal';

interface LeavePoliciesTabProps {
  leaveTypes: LeaveType[];
  loading: boolean;
  onOpenAddModal: () => void;
  onOpenEditModal: (leaveType: LeaveType) => void;
  onArchiveLeaveType: (leaveTypeId: string) => Promise<void>;
  onDeleteLeaveType: (leaveTypeId: string) => Promise<void>;
  onOpenProbationModal: () => void;
}

export const LeavePoliciesTab: React.FC<LeavePoliciesTabProps> = ({
  leaveTypes,
  loading,
  onOpenAddModal,
  onOpenEditModal,
  onArchiveLeaveType,
  onDeleteLeaveType,
  onOpenProbationModal
}) => {
  const [selectedTypeForDetail, setSelectedTypeForDetail] = useState<LeaveType | null>(null);
  const [selectedTypeForArchive, setSelectedTypeForArchive] = useState<LeaveType | null>(null);
  const [selectedTypeForDelete, setSelectedTypeForDelete] = useState<LeaveType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmArchive = async () => {
    if (!selectedTypeForArchive) return;
    setIsSubmitting(true);
    try {
      await onArchiveLeaveType(selectedTypeForArchive.id);
      setSelectedTypeForArchive(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedTypeForDelete) return;
    setIsSubmitting(true);
    try {
      await onDeleteLeaveType(selectedTypeForDelete.id);
      setSelectedTypeForDelete(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h3 className="text-lg font-bold text-slate-100">Leave Policies & Allocation Rules</h3>
          <p className="text-xs text-slate-400">
            Define leave types, general settings (accruals, weekends/holidays, probation/notice) & advanced caps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenProbationModal}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 text-xs font-semibold flex items-center gap-2 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            Probation Settings
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-950/50 flex items-center gap-2 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Leave Type
          </button>
        </div>
      </div>

      {/* Policy Table */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-2xl table-wrap">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/90 text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Leave Type</th>
                <th className="px-3 py-3.5">Code</th>
                <th className="px-3 py-3.5">Pay Status</th>
                <th className="px-3 py-3.5">Annual Quota</th>
                <th className="px-3 py-3.5">Accrual</th>
                <th className="px-3 py-3.5">Probation / Notice</th>
                <th className="px-3 py-3.5">Carry Fwd / Encash</th>
                <th className="px-3 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/70 text-slate-200">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-4"><div className="h-4 bg-slate-800 rounded w-28" /></td>
                    <td className="p-3"><div className="h-4 bg-slate-800 rounded w-12" /></td>
                    <td className="p-3"><div className="h-4 bg-slate-800 rounded w-16" /></td>
                    <td className="p-3"><div className="h-4 bg-slate-800 rounded w-16" /></td>
                    <td className="p-3"><div className="h-4 bg-slate-800 rounded w-24" /></td>
                    <td className="p-3"><div className="h-4 bg-slate-800 rounded w-20" /></td>
                    <td className="p-3"><div className="h-4 bg-slate-800 rounded w-16" /></td>
                    <td className="p-3"><div className="h-4 bg-slate-800 rounded w-16" /></td>
                    <td className="p-4"><div className="h-6 bg-slate-800 rounded w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : leaveTypes.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No leave policies configured yet. Click "Add Leave Type" above to create one.
                  </td>
                </tr>
              ) : (
                leaveTypes.map((type) => {
                  const yrQuota = type.leavesAllowedPerYear != null ? type.leavesAllowedPerYear : type.annualAllocation;
                  return (
                    <tr key={type.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3 font-semibold">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: type.displayColor || '#6366f1' }}
                          />
                          <div>
                            <button
                              onClick={() => setSelectedTypeForDetail(type)}
                              className="text-slate-100 font-bold hover:text-indigo-400 transition text-left"
                            >
                              {type.name}
                            </button>
                            {type.description && (
                              <p className="text-[11px] text-slate-400 line-clamp-1">{type.description}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-3 font-mono font-bold text-indigo-400">{type.shortName || type.code}</td>

                      <td className="px-3 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                            type.isPaid
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          {type.isPaid ? 'PAID' : 'UNPAID'}
                        </span>
                      </td>

                      <td className="px-3 py-3 font-mono font-bold text-slate-100">
                        {yrQuota} days/yr
                      </td>

                      <td className="px-3 py-3 text-slate-300">
                        {type.creditableOnAccrualBasis ? (
                          <span className="text-emerald-400 font-semibold">
                            {type.accrualAmount ?? 1}d / {(type.accrualFrequency || 'MONTHLY').toLowerCase()}
                          </span>
                        ) : (
                          <span className="text-slate-400">Lump-sum (1 Year)</span>
                        )}
                      </td>

                      <td className="px-3 py-3">
                        <span className={type.allowedUnderProbation !== false ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
                          Prob: {type.allowedUnderProbation !== false ? 'Yes' : 'No'}
                        </span>
                        <span className="text-slate-500 mx-1">&middot;</span>
                        <span className={type.allowedUnderNoticePeriod ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
                          Notice: {type.allowedUnderNoticePeriod ? 'Yes' : 'No'}
                        </span>
                      </td>

                      <td className="px-3 py-3 text-slate-300">
                        <span>{type.carryForwardEnabled ? `Max ${type.maximumCarryForward || '∞'}d` : 'No CF'}</span>
                        <span className="text-slate-500 mx-1">&middot;</span>
                        <span className={type.encashmentEnabled ? 'text-indigo-400 font-medium' : 'text-slate-500'}>
                          {type.encashmentEnabled ? 'Encash: Yes' : 'Encash: No'}
                        </span>
                      </td>

                      <td className="px-3 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                            type.isActive
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {type.isActive ? 'Active' : 'Archived'}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedTypeForDetail(type)}
                            title="View Policy Details"
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                            View Details
                          </button>
                          <button
                            onClick={() => onOpenEditModal(type)}
                            title="Edit Policy"
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 20h9"/>
                              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                            </svg>
                            Edit
                          </button>
                          {type.isActive && (
                            <button
                              onClick={() => setSelectedTypeForArchive(type)}
                              title="Archive Policy"
                              className="px-2.5 py-1.5 bg-rose-900/30 hover:bg-rose-900/50 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition"
                            >
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                <rect width="20" height="5" x="2" y="3" rx="1"/>
                                <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/>
                                <path d="M10 12h4"/>
                              </svg>
                              Archive
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedTypeForDelete(type)}
                            title="Delete Policy"
                            className="px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18"/>
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                              <line x1="10" x2="10" y1="11" y2="17"/>
                              <line x1="14" x2="14" y1="11" y2="17"/>
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Policy Details Modal */}
      <LeavePolicyDetailModal
        leaveType={selectedTypeForDetail}
        isOpen={Boolean(selectedTypeForDetail)}
        onClose={() => setSelectedTypeForDetail(null)}
        onOpenEditModal={onOpenEditModal}
        onDeleteLeaveType={(id) => {
          const t = leaveTypes.find(item => item.id === id);
          if (t) setSelectedTypeForDelete(t);
        }}
      />

      {/* Confirmation Modal for Archiving */}
      {selectedTypeForArchive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setSelectedTypeForArchive(null)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-100 animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-100">Archive Leave Type</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to archive <strong>{selectedTypeForArchive.name}</strong>?
              Historical requests referencing this leave type will be preserved safely.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSelectedTypeForArchive(null)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmArchive}
                disabled={isSubmitting}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold"
              >
                {isSubmitting ? 'Archiving...' : 'Confirm Archive'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deleting */}
      {selectedTypeForDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setSelectedTypeForDelete(null)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-slate-900 border border-rose-500/30 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-100 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"/>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                <line x1="10" x2="10" y1="11" y2="17"/>
                <line x1="14" x2="14" y1="11" y2="17"/>
              </svg>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-100">Delete Leave Policy</h3>
              <p className="text-xs text-slate-300 mt-1">
                Are you sure you want to permanently delete <strong>{selectedTypeForDelete.name}</strong> (<span className="font-mono text-indigo-400">{selectedTypeForDelete.code}</span>)?
              </p>
            </div>

            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 leading-relaxed">
              ⚠️ <strong>Warning:</strong> This action cannot be undone. Associated quota allocations and balance configurations will be removed.
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSelectedTypeForDelete(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"/>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
                {isSubmitting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeavePoliciesTab;
