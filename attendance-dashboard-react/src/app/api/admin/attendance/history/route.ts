import { NextRequest, NextResponse } from 'next/server';
import { allowAttendanceAccess, AuthenticatedRequest } from '../../../../../middleware/roleMiddleware';
import { mockAttendanceHistoryRecords, mockCorrectionRequests } from '../../../../../data/mockAttendance';
import { Attendance, HistorySummaryData } from '../../../../../types/attendance';
import { calculateWorkingHours } from '../../../../../utils/attendanceValidation';

async function handler(req: AuthenticatedRequest) {
  const { searchParams } = new URL(req.url);

  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const search = searchParams.get('search')?.toLowerCase().trim() || '';
  const department = searchParams.get('department') || 'ALL';
  const workMode = searchParams.get('workMode') || 'ALL';
  const status = searchParams.get('status') || 'ALL';
  const officeLocation = searchParams.get('officeLocation') || 'ALL';
  const correctionStatus = searchParams.get('correctionStatus') || 'ALL';

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const sort = searchParams.get('sort') || 'date';
  const order = searchParams.get('order') || 'desc';

  let filtered = [...mockAttendanceHistoryRecords];

  // Date Range Filtering
  if (startDate && endDate) {
    filtered = filtered.filter((r) => {
      const recordDate = r.date || r.createdAt.slice(0, 10);
      return recordDate >= startDate && recordDate <= endDate;
    });
  }

  // Search Filter (Employee Name, Employee ID, Department)
  if (search) {
    filtered = filtered.filter(
      (r) =>
        r.employeeName.toLowerCase().includes(search) ||
        r.employeeId.toLowerCase().includes(search) ||
        r.department.toLowerCase().includes(search)
    );
  }

  // Department Filter
  if (department !== 'ALL') {
    filtered = filtered.filter((r) => r.department === department);
  }

  // Work Mode Filter
  if (workMode !== 'ALL') {
    if (workMode === 'NOT_SELECTED') {
      filtered = filtered.filter((r) => r.workMode === null);
    } else {
      filtered = filtered.filter((r) => r.workMode === workMode);
    }
  }

  // Status Filter
  if (status !== 'ALL') {
    if (status === 'PRESENT') {
      filtered = filtered.filter((r) => r.status === 'COMPLETED' || r.status === 'CLOCKED_IN' || r.status === 'MANUALLY_CORRECTED' || r.status === 'CLOCKED_OUT');
    } else if (status === 'OFFICE') {
      filtered = filtered.filter((r) => r.workMode === 'OFFICE');
    } else if (status === 'WFH') {
      filtered = filtered.filter((r) => r.workMode === 'WFH');
    } else if (status === 'PENDING_CORRECTIONS') {
      filtered = filtered.filter((r) => r.correctionStatus === 'PENDING_REVIEW');
    } else {
      filtered = filtered.filter((r) => r.status === status);
    }
  }

  // Location Filter
  if (officeLocation !== 'ALL') {
    filtered = filtered.filter((r) => r.officeLocationId === officeLocation);
  }

  // Correction Status Filter
  if (correctionStatus !== 'ALL') {
    filtered = filtered.filter((r) => r.correctionStatus === correctionStatus);
  }

  // Compute Summary Statistics for current date range
  const summary: HistorySummaryData = {
    totalRecords: filtered.length,
    presentDays: filtered.filter((r) => ['COMPLETED', 'CLOCKED_IN', 'MANUALLY_CORRECTED', 'CLOCKED_OUT'].includes(r.status)).length,
    officeDays: filtered.filter((r) => r.workMode === 'OFFICE').length,
    wfhDays: filtered.filter((r) => r.workMode === 'WFH').length,
    leaveDays: filtered.filter((r) => r.status === 'ON_LEAVE').length,
    missingClockOuts: filtered.filter((r) => r.status === 'MISSING_CLOCK_OUT').length,
    incompleteRecords: filtered.filter((r) => r.status === 'INCOMPLETE_HOURS').length,
    pendingCorrections: mockCorrectionRequests.filter((cr) => cr.status === 'PENDING_REVIEW').length
  };

  // Sorting
  filtered.sort((a, b) => {
    let valA: any = '';
    let valB: any = '';

    if (sort === 'employeeName') {
      valA = a.employeeName.toLowerCase();
      valB = b.employeeName.toLowerCase();
    } else if (sort === 'employeeId') {
      valA = a.employeeId.toLowerCase();
      valB = b.employeeId.toLowerCase();
    } else if (sort === 'date') {
      valA = a.date || a.createdAt;
      valB = b.date || b.createdAt;
    } else if (sort === 'clockInAt') {
      valA = a.clockInAt ? new Date(a.clockInAt).getTime() : 0;
      valB = b.clockInAt ? new Date(b.clockInAt).getTime() : 0;
    } else if (sort === 'clockOutAt') {
      valA = a.clockOutAt ? new Date(a.clockOutAt).getTime() : 0;
      valB = b.clockOutAt ? new Date(b.clockOutAt).getTime() : 0;
    } else if (sort === 'workingHours') {
      valA = calculateWorkingHours(a.clockInAt, a.clockOutAt, a.status);
      valB = calculateWorkingHours(b.clockInAt, b.clockOutAt, b.status);
    } else if (sort === 'status') {
      valA = a.status;
      valB = b.status;
    } else if (sort === 'updatedAt') {
      valA = a.updatedAt;
      valB = b.updatedAt;
    }

    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    success: true,
    total,
    page,
    limit,
    records: paginated,
    summary
  });
}

export async function GET(req: NextRequest) {
  return allowAttendanceAccess(req as AuthenticatedRequest, () => handler(req as AuthenticatedRequest));
}
