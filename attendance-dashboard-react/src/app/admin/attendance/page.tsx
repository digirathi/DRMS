'use client';

import TodayAttendancePage from './today/page';
import AttendanceHistoryPage from './history/page';

export default function HRMSAttendanceDashboardPage() {
  return (
    <div className="space-y-8 bg-slate-950 min-h-screen">
      {/* 1. Today's Team Attendance Section */}
      <TodayAttendancePage />

      {/* Divider */}
      <div className="px-6">
        <div className="border-t border-slate-800/80 my-2" />
      </div>

      {/* 2. ATTENDANCE RECORDS -> Attendance History Section */}
      <AttendanceHistoryPage />
    </div>
  );
}
