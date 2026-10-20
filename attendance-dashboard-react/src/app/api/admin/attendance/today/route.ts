import { NextRequest, NextResponse } from 'next/server';
import { allowAttendanceAccess, AuthenticatedRequest } from '../../../../../middleware/roleMiddleware';
import { mockAttendanceRecords } from '../../../../../data/mockAttendance';
import { Attendance } from '../../../../../types/attendance';

async function handler(req: AuthenticatedRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get('search')?.toLowerCase().trim() || '';
  const department = searchParams.get('department') || 'ALL';
  const officeLocation = searchParams.get('officeLocation') || 'ALL';
  const workMode = searchParams.get('workMode') || 'ALL';
  const status = searchParams.get('status') || 'ALL';

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const sort = searchParams.get('sort') || 'employeeName';
  const order = searchParams.get('order') || 'asc';

  let filteredRecords = [...mockAttendanceRecords];

  // Case-insensitive search matching Employee Name, Employee ID, and Department
  if (search) {
    filteredRecords = filteredRecords.filter(
      (r) =>
        r.employeeName.toLowerCase().includes(search) ||
        r.employeeId.toLowerCase().includes(search) ||
        r.department.toLowerCase().includes(search)
    );
  }

  // Department filter
  if (department !== 'ALL') {
    filteredRecords = filteredRecords.filter((r) => r.department === department);
  }

  // Location filter
  if (officeLocation !== 'ALL') {
    filteredRecords = filteredRecords.filter((r) => r.officeLocationId === officeLocation);
  }

  // Work Mode filter
  if (workMode !== 'ALL') {
    if (workMode === 'NOT_SELECTED') {
      filteredRecords = filteredRecords.filter((r) => r.workMode === null);
    } else {
      filteredRecords = filteredRecords.filter((r) => r.workMode === workMode);
    }
  }

  // Status / Summary Card filter
  if (status !== 'ALL') {
    if (status === 'OFFICE_MODE' || status === 'OFFICE') {
      filteredRecords = filteredRecords.filter((r) => r.workMode === 'OFFICE');
    } else if (status === 'WFH_MODE' || status === 'WFH') {
      filteredRecords = filteredRecords.filter((r) => r.workMode === 'WFH');
    } else {
      filteredRecords = filteredRecords.filter((r) => r.status === status);
    }
  }

  // Sorting
  filteredRecords.sort((a, b) => {
    let fieldA: any = '';
    let fieldB: any = '';

    if (sort === 'employeeName') {
      fieldA = a.employeeName.toLowerCase();
      fieldB = b.employeeName.toLowerCase();
    } else if (sort === 'clockInAt') {
      fieldA = a.clockInAt ? new Date(a.clockInAt).getTime() : 0;
      fieldB = b.clockInAt ? new Date(b.clockInAt).getTime() : 0;
    } else if (sort === 'clockOutAt') {
      fieldA = a.clockOutAt ? new Date(a.clockOutAt).getTime() : 0;
      fieldB = b.clockOutAt ? new Date(b.clockOutAt).getTime() : 0;
    } else if (sort === 'workingHours') {
      const getDuration = (rec: Attendance) => {
        if (!rec.clockInAt || rec.status === 'ON_LEAVE') return 0;
        const start = new Date(rec.clockInAt).getTime();
        const end = rec.clockOutAt ? new Date(rec.clockOutAt).getTime() : Date.now();
        return end - start;
      };
      fieldA = getDuration(a);
      fieldB = getDuration(b);
    }

    if (fieldA < fieldB) return order === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const total = filteredRecords.length;
  const startIndex = (page - 1) * limit;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    success: true,
    total,
    totalEmployees: mockAttendanceRecords.length,
    page,
    limit,
    records: paginatedRecords
  });
}

export async function GET(req: NextRequest) {
  return allowAttendanceAccess(req as AuthenticatedRequest, () => handler(req as AuthenticatedRequest));
}
