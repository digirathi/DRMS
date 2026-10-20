import React, { useState, useEffect } from 'react';
import { Attendance, AttendanceStatus, User, WorkMode } from '../types/attendance';
import { validateClockTimes, validateMarkLeave, validateModificationReason, calculateWorkingHours, formatDateDisplay } from '../utils/attendanceValidation';

interface ManualCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  allRecords: Attendance[];
  initialRecord?: Attendance | null;
  currentUser: User;
  onSaveCorrection: (
    attendanceId: string,
    actionType: string,
    changes: Record<string, any>,
    reason: string
  ) => Promise<void>;
}

type ActionTypeOption =
  | 'EDIT_ATTENDANCE'
  | 'ADD_MISSING_CLOCK_IN'
  | 'ADD_MISSING_CLOCK_OUT'
  | 'CHANGE_WORK_MODE'
  | 'MARK_LEAVE'
  | 'REMOVE_LEAVE'
  | 'CHANGE_STATUS';

export const ManualCorrectionModal: React.FC<ManualCorrectionModalProps> = ({
  isOpen,
  onClose,
  allRecords,
  initialRecord,
  currentUser,
  onSaveCorrection
}) => {
  // Wizard Step (1 to 5)
  const [step, setStep] = useState<number>(1);

  // Step 1: Employee & Date
  const [selectedRecordId, setSelectedRecordId] = useState<string>('');
  const [selectedRecord, setSelectedRecord] = useState<Attendance | null>(null);

  // Step 2: Selected Action
  const [selectedAction, setSelectedAction] = useState<ActionTypeOption>('EDIT_ATTENDANCE');

  // Step 3: New Values Input
  const [newClockIn, setNewClockIn] = useState<string>('');
  const [newClockOut, setNewClockOut] = useState<string>('');
  const [newWorkMode, setNewWorkMode] = useState<WorkMode>('OFFICE');
  const [newStatus, setNewStatus] = useState<AttendanceStatus>('COMPLETED');
  const [adminRemark, setAdminRemark] = useState<string>('');

  // Step 4: Mandatory Reason
  const [reason, setReason] = useState<string>('');
  const [reasonError, setReasonError] = useState<string>('');

  // Execution state
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  // Initialize if record passed
  useEffect(() => {
    if (initialRecord) {
      setSelectedRecordId(initialRecord.id);
      setSelectedRecord(initialRecord);
      setNewClockIn(initialRecord.clockInAt ? new Date(initialRecord.clockInAt).toISOString().slice(11, 16) : '');
      setNewClockOut(initialRecord.clockOutAt ? new Date(initialRecord.clockOutAt).toISOString().slice(11, 16) : '');
      setNewWorkMode(initialRecord.workMode || 'OFFICE');
      setNewStatus(initialRecord.status || 'COMPLETED');
      setStep(1);
    }
  }, [initialRecord]);

  if (!isOpen) return null;

  const handleSelectRecord = (id: string) => {
    setSelectedRecordId(id);
    const rec = allRecords.find((r) => r.id === id) || null;
    setSelectedRecord(rec);
    if (rec) {
      setNewClockIn(rec.clockInAt ? new Date(rec.clockInAt).toISOString().slice(11, 16) : '');
      setNewClockOut(rec.clockOutAt ? new Date(rec.clockOutAt).toISOString().slice(11, 16) : '');
      setNewWorkMode(rec.workMode || 'OFFICE');
      setNewStatus(rec.status || 'COMPLETED');
    }
  };

  // Build Preview Changes Summary
  const getPreviewChanges = () => {
    if (!selectedRecord) return {};

    const changes: Record<string, { oldVal: string; newVal: string }> = {};

    const dateStr = selectedRecord.date || selectedRecord.createdAt.slice(0, 10);

    if (selectedAction === 'EDIT_ATTENDANCE' || selectedAction === 'ADD_MISSING_CLOCK_IN' || selectedAction === 'ADD_MISSING_CLOCK_OUT') {
      const fullIn = newClockIn ? `${dateStr}T${newClockIn}:00Z` : null;
      const fullOut = newClockOut ? `${dateStr}T${newClockOut}:00Z` : null;

      if (fullIn !== selectedRecord.clockInAt) {
        changes['Clock In'] = {
          oldVal: selectedRecord.clockInAt ? new Date(selectedRecord.clockInAt).toLocaleTimeString() : '—',
          newVal: fullIn ? new Date(fullIn).toLocaleTimeString() : '—'
        };
      }
      if (fullOut !== selectedRecord.clockOutAt) {
        changes['Clock Out'] = {
          oldVal: selectedRecord.clockOutAt ? new Date(selectedRecord.clockOutAt).toLocaleTimeString() : '—',
          newVal: fullOut ? new Date(fullOut).toLocaleTimeString() : '—'
        };
      }

      const oldHours = calculateWorkingHours(selectedRecord.clockInAt, selectedRecord.clockOutAt, selectedRecord.status);
      const newCalcStatus = fullIn && fullOut ? 'COMPLETED' : fullIn ? 'CLOCKED_IN' : selectedRecord.status;
      const newHours = calculateWorkingHours(fullIn, fullOut, newCalcStatus as AttendanceStatus);

      changes['Working Hours'] = {
        oldVal: oldHours,
        newVal: newHours
      };

      changes['Status'] = {
        oldVal: selectedRecord.status,
        newVal: newCalcStatus
      };
    } else if (selectedAction === 'CHANGE_WORK_MODE') {
      changes['Work Mode'] = {
        oldVal: selectedRecord.workMode || '—',
        newVal: newWorkMode || '—'
      };
    } else if (selectedAction === 'MARK_LEAVE') {
      changes['Status'] = {
        oldVal: selectedRecord.status,
        newVal: 'ON_LEAVE'
      };
      changes['Clock In'] = { oldVal: selectedRecord.clockInAt || '—', newVal: '—' };
      changes['Clock Out'] = { oldVal: selectedRecord.clockOutAt || '—', newVal: '—' };
      changes['Working Hours'] = { oldVal: calculateWorkingHours(selectedRecord.clockInAt, selectedRecord.clockOutAt, selectedRecord.status), newVal: '00h 00m' };
    } else if (selectedAction === 'REMOVE_LEAVE') {
      changes['Status'] = {
        oldVal: selectedRecord.status,
        newVal: 'NOT_CLOCKED_IN'
      };
    } else if (selectedAction === 'CHANGE_STATUS') {
      changes['Status'] = {
        oldVal: selectedRecord.status,
        newVal: newStatus
      };
    }

    return changes;
  };

  const handleStepValidation = () => {
    setFormError('');
    if (step === 1) {
      if (!selectedRecord) {
        setFormError('Please select an employee attendance record.');
        return false;
      }
    } else if (step === 3) {
      const dateStr = selectedRecord!.date || selectedRecord!.createdAt.slice(0, 10);
      const fullIn = newClockIn ? `${dateStr}T${newClockIn}:00Z` : null;
      const fullOut = newClockOut ? `${dateStr}T${newClockOut}:00Z` : null;

      if (selectedAction === 'MARK_LEAVE') {
        const leaveVal = validateMarkLeave(selectedRecord!);
        if (!leaveVal.isValid) {
          setFormError(leaveVal.message!);
          return false;
        }
      }

      if (fullIn && fullOut) {
        const timeVal = validateClockTimes(fullIn, fullOut);
        if (!timeVal.isValid) {
          setFormError(timeVal.message!);
          return false;
        }
      }
    } else if (step === 4) {
      const reasonVal = validateModificationReason(reason);
      if (!reasonVal.isValid) {
        setReasonError(reasonVal.message!);
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (handleStepValidation()) {
      setStep((prev) => Math.min(5, prev + 1));
    }
  };

  const handleBack = () => {
    setFormError('');
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleConfirmSave = async () => {
    if (!selectedRecord) return;
    setFormError('');

    const reasonVal = validateModificationReason(reason);
    if (!reasonVal.isValid) {
      setReasonError(reasonVal.message!);
      setStep(4);
      return;
    }

    setSubmitting(true);
    try {
      const dateStr = selectedRecord.date || selectedRecord.createdAt.slice(0, 10);
      const changesPayload: Record<string, any> = {};

      if (selectedAction === 'EDIT_ATTENDANCE' || selectedAction === 'ADD_MISSING_CLOCK_IN' || selectedAction === 'ADD_MISSING_CLOCK_OUT') {
        if (newClockIn) changesPayload.clockInAt = `${dateStr}T${newClockIn}:00Z`;
        if (newClockOut) changesPayload.clockOutAt = `${dateStr}T${newClockOut}:00Z`;
        if (adminRemark) changesPayload.adminRemark = adminRemark;
      } else if (selectedAction === 'CHANGE_WORK_MODE') {
        changesPayload.workMode = newWorkMode;
      } else if (selectedAction === 'MARK_LEAVE') {
        changesPayload.status = 'ON_LEAVE';
      } else if (selectedAction === 'REMOVE_LEAVE') {
        changesPayload.status = 'NOT_CLOCKED_IN';
      } else if (selectedAction === 'CHANGE_STATUS') {
        changesPayload.status = newStatus;
      }

      await onSaveCorrection(selectedRecord.id, selectedAction, changesPayload, reason.trim());
      onClose();
    } catch (err: any) {
      setFormError(err?.message || 'Failed to apply manual correction.');
    } finally {
      setSubmitting(false);
    }
  };

  const isSaveDisabled = reason.trim().length < 5 || reason.trim().length > 500;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/85 backdrop-blur-md" />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#090d21] border border-slate-800 rounded-3xl p-6 shadow-2xl z-10 text-slate-100 space-y-6">
        {/* Header & Step Indicator */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
              Admin Manual Correction Wizard
            </span>
            <h2 className="text-xl font-extrabold text-slate-100">
              Step {step} of 5: {step === 1 && 'Select Employee & Date'}
              {step === 2 && 'Select Correction Action'}
              {step === 3 && 'Enter New Values'}
              {step === 4 && 'Mandatory Modification Reason'}
              {step === 5 && 'Preview & Confirm Changes'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white border border-slate-800 cursor-pointer">
            ✕
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                s <= step ? 'bg-indigo-500 shadow-sm shadow-indigo-500/50' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* STEP 1: SELECT EMPLOYEE AND DATE */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Search & Select Employee Record *
              </label>
              <select
                value={selectedRecordId}
                onChange={(e) => handleSelectRecord(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-3 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">-- Select Employee Record --</option>
                {allRecords.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.employeeName} ({r.employeeId}) — {r.department} — {formatDateDisplay(r.date || r.createdAt)} ({r.status})
                  </option>
                ))}
              </select>
            </div>

            {selectedRecord && (
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold uppercase text-indigo-400 block">Loaded Current Record</span>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>Date: <strong>{formatDateDisplay(selectedRecord.date || selectedRecord.createdAt)}</strong></div>
                  <div>Work Mode: <strong>{selectedRecord.workMode || '—'}</strong></div>
                  <div>Clock In: <strong>{selectedRecord.clockInAt ? new Date(selectedRecord.clockInAt).toLocaleTimeString() : '—'}</strong></div>
                  <div>Clock Out: <strong>{selectedRecord.clockOutAt ? new Date(selectedRecord.clockOutAt).toLocaleTimeString() : '—'}</strong></div>
                  <div>Status: <strong className="text-emerald-400">{selectedRecord.status}</strong></div>
                  <div>Working Hours: <strong className="text-indigo-300">{calculateWorkingHours(selectedRecord.clockInAt, selectedRecord.clockOutAt, selectedRecord.status)}</strong></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: SELECT ACTION */}
        {step === 2 && (
          <div className="space-y-3 text-xs">
            <label className="block text-slate-300 font-semibold mb-1">
              Select Correction Action Type *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { id: 'EDIT_ATTENDANCE', label: 'Edit attendance', desc: 'Modify clock-in or clock-out times' },
                { id: 'ADD_MISSING_CLOCK_IN', label: 'Add missing clock-in', desc: 'Record employee clock-in timestamp' },
                { id: 'ADD_MISSING_CLOCK_OUT', label: 'Add missing clock-out', desc: 'Record employee clock-out timestamp' },
                { id: 'CHANGE_WORK_MODE', label: 'Change work mode', desc: 'Switch between Office and WFH' },
                { id: 'MARK_LEAVE', label: 'Mark leave', desc: 'Mark full day casual or earned leave' },
                { id: 'REMOVE_LEAVE', label: 'Remove leave', desc: 'Cancel full day leave status' },
                { id: 'CHANGE_STATUS', label: 'Change attendance status', desc: 'Manually override status' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedAction(opt.id as ActionTypeOption)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedAction === opt.id
                      ? 'border-indigo-500 bg-indigo-950/50 ring-2 ring-indigo-500/30'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-slate-100 mb-0.5">{opt.label}</div>
                  <div className="text-[11px] text-slate-400">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: ENTER NEW VALUES */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            {(selectedAction === 'EDIT_ATTENDANCE' || selectedAction === 'ADD_MISSING_CLOCK_IN' || selectedAction === 'ADD_MISSING_CLOCK_OUT') && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">New Clock-In Time</label>
                  <input
                    type="time"
                    value={newClockIn}
                    onChange={(e) => setNewClockIn(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">New Clock-Out Time</label>
                  <input
                    type="time"
                    value={newClockOut}
                    onChange={(e) => setNewClockOut(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5"
                  />
                </div>
              </div>
            )}

            {selectedAction === 'CHANGE_WORK_MODE' && (
              <div>
                <label className="block text-slate-400 font-semibold mb-1">New Work Mode</label>
                <select
                  value={newWorkMode || 'OFFICE'}
                  onChange={(e) => setNewWorkMode(e.target.value as WorkMode)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5"
                >
                  <option value="OFFICE">Office</option>
                  <option value="WFH">WFH</option>
                </select>
              </div>
            )}

            {selectedAction === 'CHANGE_STATUS' && (
              <div>
                <label className="block text-slate-400 font-semibold mb-1">New Attendance Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as AttendanceStatus)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5"
                >
                  <option value="COMPLETED">Completed</option>
                  <option value="CLOCKED_IN">Clocked In</option>
                  <option value="MISSING_CLOCK_IN">Missing Clock-In</option>
                  <option value="MISSING_CLOCK_OUT">Missing Clock-Out</option>
                  <option value="INCOMPLETE_HOURS">Incomplete Hours</option>
                  <option value="NOT_CLOCKED_IN">Not Clocked In</option>
                  <option value="ON_LEAVE">On Leave</option>
                  <option value="WEEK_OFF">Week Off</option>
                  <option value="HOLIDAY">Holiday</option>
                  <option value="MANUALLY_CORRECTED">Manually Corrected</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Admin Remarks (Optional)</label>
              <input
                type="text"
                value={adminRemark}
                onChange={(e) => setAdminRemark(e.target.value)}
                placeholder="Optional internal remark"
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5"
              />
            </div>
          </div>
        )}

        {/* STEP 4: MANDATORY REASON */}
        {step === 4 && (
          <div className="space-y-3 text-xs">
            <label className="block text-slate-200 font-semibold">
              Reason for Modification * <span className="text-slate-400 font-normal">(Mandatory: 5 to 500 characters)</span>
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setReasonError('');
              }}
              placeholder="Write a clear, detailed reason for modifying this attendance record (e.g. Employee forgot to clock out due to offsite client emergency)."
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-2xl p-3 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              required
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Min 5 characters required</span>
              <span>{reason.trim().length} / 500</span>
            </div>
            {reasonError && <p className="text-xs font-medium text-red-400">⚠️ {reasonError}</p>}
          </div>
        )}

        {/* STEP 5: PREVIEW CHANGES */}
        {step === 5 && (
          <div className="space-y-4 text-xs">
            <div className="bg-indigo-950/40 border border-indigo-500/30 p-4 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Change Summary Preview
              </h4>
              <div className="space-y-2">
                {Object.entries(getPreviewChanges()).map(([field, vals]) => (
                  <div key={field} className="flex justify-between items-center bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="font-semibold text-slate-300">{field}:</span>
                    <div className="font-mono flex items-center gap-2">
                      <span className="text-red-400 line-through">{vals.oldVal}</span>
                      <span className="text-slate-500">→</span>
                      <span className="text-emerald-400 font-bold">{vals.newVal}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-slate-300 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mandatory Reason Provided:</span>
              <p className="italic">"{reason.trim()}"</p>
            </div>
          </div>
        )}

        {formError && <p className="text-xs font-medium text-red-400 bg-red-950/50 p-3 rounded-xl border border-red-800">⚠️ {formError}</p>}

        {/* Wizard Footer Controls */}
        <div className="flex justify-between items-center border-t border-slate-800 pt-4">
          <button
            type="button"
            onClick={step === 1 ? onClose : handleBack}
            className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            {step === 1 ? 'Cancel' : '← Back'}
          </button>

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
            >
              Next Step →
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting || isSaveDisabled}
              onClick={handleConfirmSave}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold rounded-xl text-xs transition-all shadow-lg shadow-emerald-600/30 cursor-pointer"
            >
              {submitting ? 'Applying Changes...' : 'Confirm and Save'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
