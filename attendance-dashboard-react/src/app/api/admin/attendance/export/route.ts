import { NextRequest, NextResponse } from 'next/server';
import { allowAttendanceAccess, AuthenticatedRequest } from '../../../../../middleware/roleMiddleware';
import { mockAttendanceHistoryRecords } from '../../../../../data/mockAttendance';

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

  let filtered = [...mockAttendanceHistoryRecords];

  if (startDate && endDate) {
    filtered = filtered.filter((r) => {
      const recordDate = r.date || r.createdAt.slice(0, 10);
      return recordDate >= startDate && recordDate <= endDate;
    });
  }

  if (search) {
    filtered = filtered.filter(
      (r) =>
        r.employeeName.toLowerCase().includes(search) ||
        r.employeeId.toLowerCase().includes(search) ||
        r.department.toLowerCase().includes(search)
    );
  }

  if (department !== 'ALL') {
    filtered = filtered.filter((r) => r.department === department);
  }

  if (workMode !== 'ALL') {
    if (workMode === 'NOT_SELECTED') {
      filtered = filtered.filter((r) => r.workMode === null);
    } else {
      filtered = filtered.filter((r) => r.workMode === workMode);
    }
  }

  if (status !== 'ALL') {
    filtered = filtered.filter((r) => r.status === status);
  }

  if (officeLocation !== 'ALL') {
    filtered = filtered.filter((r) => r.officeLocationId === officeLocation);
  }

  if (correctionStatus !== 'ALL') {
    filtered = filtered.filter((r) => r.correctionStatus === correctionStatus);
  }

  return NextResponse.json({
    success: true,
    total: filtered.length,
    records: filtered
  });
}

export async function GET(req: NextRequest) {
  return allowAttendanceAccess(req as AuthenticatedRequest, () => handler(req as AuthenticatedRequest));
}

function paramsFilter(req: NextRequest) {
  return req as AuthenticatedRequest;
}
