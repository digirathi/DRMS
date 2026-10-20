import React, { useState, useEffect } from 'react';
import { Attendance, AttendanceStatus, WorkMode, VerificationStatus } from '../types/attendance';
import { MandatoryReasonInput } from './MandatoryReasonInput';
import { validateClockTimes, validateModificationReason, calculateWorkingHours } from '../utils/attendanceValidation';

interface EditAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: Attendance | null;
  onSave: (
    updatedFields: Partial<Attendance>,
    changeReason: string
  ) => Promise<void>;
}

export const EditAttendanceModal: React.FC<EditAttendanceModalProps> = ({
  isOpen,
  onClose,
  record,
  onSave
}) => {
  const [workMode, setWorkMode] = useState<WorkMode>(null);
  const [status, setStatus] = useState<AttendanceStatus>('NOT_CLOCKED_IN');
  const [verification, setVerification] = useState<VerificationStatus>(null);
  const [clockInDate, setClockInDate] = useState('');
  const [clockInTime, setClockInTime] = useState('');
  const [clockOutDate, setClockOutDate] = useState('');
  const [clockOutTime, setClockOutTime] = useState('');
  const [adminRemark, setAdminRemark] = useState('');
  const [changeReason, setChangeReason] = useState('');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (record) {
      setWorkMode(record.workMode);
      setStatus(record.status);
      setVerification(record.verification);
      setAdminRemark(record.adminRemark || '');
      setChangeReason('');
      setError('');

      if (record.clockInAt) {
        const dateObj = new Date(record.clockInAt);
        setClockInDate(dateObj.toISOString().slice(0, 10));
        setClockInTime(dateObj.toTimeString().slice(0, 5));
      } else {
        setClockInDate('');
        setClockInTime('');
      }

      if (record.clockOutAt) {
        const dateObj = new Date(record.clockOutAt);
        setClockOutDate(dateObj.toISOString().slice(0, 10));
        setClockOutTime(dateObj.toTimeString().slice(0, 5));
      } else {
        setClockOutDate('');
        setClockOutTime('');
      }
    }
  }, [record, isOpen]);

  if (!isOpen || !record) return null;

  const reasonValidation = validateModificationReason(changeReason);

  // Compute live preview of new clock times
  let previewClockIn: string | null = null;
  let previewClockOut: string | null = null;
  if (clockInDate && clockInTime) {
    previewClockIn = new Date(`${clockInDate}T${clockInTime}:00`).toISOString();
  }
  if (clockOutDate && clockOutTime) {
    previewClockOut = new Date(`${clockOutDate}T${clockOutTime}:00`).toISOString();
  }

  const previewHours = calculateWorkingHours(previewClockIn, previewClockOut, status);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!reasonValidation.isValid) {
      setError(reasonValidation.message || 'Reason for modification is mandatory.');
      return;
    }

    // Validation: Prevent Clock Out earlier than Clock In
    if (previewClockIn && previewClockOut) {
      const timeVal = validateClockTimes(previewClockIn, previewClockOut);
      if (!timeVal.isValid) {
        setError(timeVal.message || 'Clock-out time cannot be earlier than clock-in time.');
        return;
      }
    }

    // Enforce clean state for ON_LEAVE
    if (status === 'ON_LEAVE') {
      if (previewClockIn || previewClockOut || workMode !== null) {
        setError(
          'Contradictory record: Full-day leave cannot contain work mode or clock-in/out times. Clear times and set Work Mode to Not Selected.'
        );
        return;
      }
    }

    // Auto verification mapping based on Work Mode
    let finalVerification = verification;
    if (
      status === 'ON_LEAVE' ||
      status === 'WEEK_OFF' ||
      status === 'HOLIDAY' ||
      status === 'NOT_CLOCKED_IN'
    ) {
      finalVerification = null;
    } else if (workMode === 'WFH') {
      finalVerification = 'NOT_REQUIRED';
    } else if (workMode === 'OFFICE' && (!verification || verification === 'NOT_REQUIRED')) {
      finalVerification = 'IP_VERIFIED';
    }

    setIsSubmitting(true);
    try {
      const updatedFields: Partial<Attendance> = {
        workMode: status === 'ON_LEAVE' ? null : workMode,
        status,
        clockInAt: status === 'ON_LEAVE' ? null : previewClockIn,
        clockOutAt: status === 'ON_LEAVE' ? null : previewClockOut,
        verification: status === 'ON_LEAVE' ? null : finalVerification,
        adminRemark: adminRemark.trim() || null
      };

      await onSave(updatedFields, changeReason.trim());
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save attendance edits.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div onClick={onClose} className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />

      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto">
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Header */}
          <div className="border-b border-slate-800 p-5 flex justify-between items-center bg-slate-900/60">
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                Edit Attendance Record
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                {record.employeeName} ({record.employeeId}) • {record.department}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form Content */}
          <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-xl font-medium leading-relaxed">
                {error}
              </div>
            )}

            {/* Old vs New Working Hours Preview */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-slate-500 block">Old Working Hours</span>
                <span className="text-slate-300 font-bold">
                  {calculateWorkingHours(record.clockInAt, record.clockOutAt, record.status)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block">Recalculated Hours</span>
                <span className="text-indigo-400 font-bold">{previewHours}</span>
              </div>
            </div>

            {/* Work Mode */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Work Mode
              </label>
              <select
                value={workMode || ''}
                onChange={(e) => setWorkMode((e.target.value as WorkMode) || null)}
                disabled={status === 'ON_LEAVE'}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-50"
              >
                <option value="">Not Selected</option>
                <option value="OFFICE">Office</option>
                <option value="WFH">WFH</option>
              </select>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Attendance Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="CLOCKED_IN">Clocked In</option>
                <option value="CLOCKED_OUT">Clocked Out</option>
                <option value="NOT_CLOCKED_IN">Not Clocked In</option>
                <option value="MISSING_CLOCK_OUT">Missing Clock Out</option>
                <option value="ON_LEAVE">On Leave</option>
                <option value="WEEK_OFF">Week Off</option>
                <option value="HOLIDAY">Holiday</option>
              </select>
            </div>

            {/* Clock In Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  New Clock In Date
                </label>
                <input
                  type="date"
                  value={clockInDate}
                  onChange={(e) => setClockInDate(e.target.value)}
                  disabled={status === 'ON_LEAVE'}
                  className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  New Clock In Time
                </label>
                <input
                  type="time"
                  value={clockInTime}
                  onChange={(e) => setClockInTime(e.target.value)}
                  disabled={status === 'ON_LEAVE'}
                  className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Clock Out Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  New Clock Out Date
                </label>
                <input
                  type="date"
                  value={clockOutDate}
                  onChange={(e) => setClockOutDate(e.target.value)}
                  disabled={status === 'ON_LEAVE'}
                  className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  New Clock Out Time
                </label>
                <input
                  type="time"
                  value={clockOutTime}
                  onChange={(e) => setClockOutTime(e.target.value)}
                  disabled={status === 'ON_LEAVE'}
                  className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Admin Remark */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Admin Remark
              </label>
              <textarea
                value={adminRemark}
                onChange={(e) => setAdminRemark(e.target.value)}
                placeholder="Internal notes for this attendance record..."
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Mandatory Reason Input Component */}
            <MandatoryReasonInput
              value={changeReason}
              onChange={setChangeReason}
            />
          </div>

          {/* Footer */}
          <div className="border-t border-slate-800 p-5 bg-slate-900/60 flex justify-end gap-3.5">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl py-2.5 px-5 border border-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reasonValidation.isValid}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/40 disabled:cursor-not-allowed text-slate-100 text-sm font-semibold rounded-xl py-2.5 px-6 border border-indigo-500 cursor-pointer shadow-lg transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAttendanceModal;
