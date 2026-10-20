import { NextRequest, NextResponse } from 'next/server';
import { allowAttendanceAccess, AuthenticatedRequest } from '../../../../../middleware/roleMiddleware';
import { mockAttendanceRecords } from '../../../../../data/mockAttendance';
import { SummaryData } from '../../../../../types/attendance';

async function handler(req: AuthenticatedRequest) {
  const totalEmployees = mockAttendanceRecords.length;
  const clockedIn = mockAttendanceRecords.filter((r) => r.status === 'CLOCKED_IN').length;
  const clockedOut = mockAttendanceRecords.filter((r) => r.status === 'CLOCKED_OUT').length;
  const notClockedIn = mockAttendanceRecords.filter((r) => r.status === 'NOT_CLOCKED_IN').length;
  const workingFromOffice = mockAttendanceRecords.filter((r) => r.workMode === 'OFFICE').length;
  const workingFromHome = mockAttendanceRecords.filter((r) => r.workMode === 'WFH').length;
  const onLeave = mockAttendanceRecords.filter((r) => r.status === 'ON_LEAVE').length;
  const missingClockOut = mockAttendanceRecords.filter((r) => r.status === 'MISSING_CLOCK_OUT').length;

  const summary: SummaryData = {
    totalEmployees,
    clockedIn,
    clockedOut,
    notClockedIn,
    workingFromOffice,
    workingFromHome,
    onLeave,
    missingClockOut
  };

  return NextResponse.json({ success: true, summary });
}

export async function GET(req: NextRequest) {
  return allowAttendanceAccess(req as AuthenticatedRequest, () => handler(req as AuthenticatedRequest));
}
