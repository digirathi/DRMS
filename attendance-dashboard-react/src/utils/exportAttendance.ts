import { Attendance } from '../types/attendance';
import { formatDateDisplay, formatTimeDisplay, calculateWorkingHours } from './attendanceValidation';

/**
 * Converts filtered attendance records to CSV string and triggers browser file download.
 */
export function exportAttendanceToCSV(records: Attendance[], filenamePrefix: string = 'attendance_history_report') {
  if (!records || records.length === 0) {
    throw new Error('No attendance records available to export.');
  }

  const headers = [
    'Employee Name',
    'Employee ID',
    'Department',
    'Date',
    'Work Mode',
    'Clock In',
    'Clock Out',
    'Working Hours',
    'Status',
    'Verification',
    'Correction Status',
    'Last Modified By'
  ];

  const rows = records.map((rec) => {
    const dateStr = formatDateDisplay(rec.date || rec.createdAt);
    const clockInStr = formatTimeDisplay(rec.clockInAt);
    const clockOutStr = formatTimeDisplay(rec.clockOutAt);
    const workingHoursStr =
      rec.workingHoursFormatted || calculateWorkingHours(rec.clockInAt, rec.clockOutAt, rec.status);

    return [
      `"${rec.employeeName.replace(/"/g, '""')}"`,
      `"${rec.employeeId}"`,
      `"${rec.department.replace(/"/g, '""')}"`,
      `"${dateStr}"`,
      `"${rec.workMode || '—'}"`,
      `"${clockInStr}"`,
      `"${clockOutStr}"`,
      `"${workingHoursStr}"`,
      `"${rec.status.replace(/_/g, ' ')}"`,
      `"${rec.verification || 'Not Required'}"`,
      `"${rec.correctionStatus || 'NO_REQUEST'}"`,
      `"${rec.lastModifiedBy || '—'}"`
    ];
  });

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filenamePrefix}_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
