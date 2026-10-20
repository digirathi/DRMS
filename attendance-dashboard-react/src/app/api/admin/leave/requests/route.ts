import { NextRequest, NextResponse } from 'next/server';
import { allowSuperAdminLeaveAccess, AuthenticatedLeaveRequest } from '../../../../../middleware/leaveAuthMiddleware';
import { mockLeaveRequests } from '../../../../../data/mockLeave';

async function handler(req: AuthenticatedLeaveRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get('search')?.toLowerCase().trim() || '';
  const department = searchParams.get('department') || 'ALL';
  const leaveTypeId = searchParams.get('leaveTypeId') || 'ALL';
  const status = searchParams.get('status') || 'ALL';
  const isPaid = searchParams.get('isPaid') || 'ALL';
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const approver = searchParams.get('approver') || 'ALL';
  const officeLocation = searchParams.get('officeLocation') || 'ALL';

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const sort = searchParams.get('sort') || 'submittedAt';
  const order = searchParams.get('order') || 'desc';

  let filtered = [...mockLeaveRequests];

  // Case-insensitive search across employeeName, employeeCode (ID), and department
  if (search) {
    filtered = filtered.filter(
      (r) =>
        r.employeeName.toLowerCase().includes(search) ||
        r.employeeCode.toLowerCase().includes(search) ||
        r.employeeId.toLowerCase().includes(search) ||
        r.department.toLowerCase().includes(search)
    );
  }

  if (department !== 'ALL') {
    filtered = filtered.filter((r) => r.department === department);
  }

  if (leaveTypeId !== 'ALL') {
    filtered = filtered.filter((r) => r.leaveTypeId === leaveTypeId);
  }

  if (status !== 'ALL') {
    filtered = filtered.filter((r) => r.status === status);
  }

  if (isPaid !== 'ALL') {
    const paidBool = isPaid === 'PAID';
    filtered = filtered.filter((r) => r.isPaid === paidBool);
  }

  if (startDate && endDate) {
    filtered = filtered.filter((r) => r.startDate >= startDate && r.endDate <= endDate);
  }

  if (approver !== 'ALL') {
    filtered = filtered.filter((r) => r.processedById === approver);
  }

  if (officeLocation !== 'ALL') {
    filtered = filtered.filter((r) => r.officeLocationId === officeLocation);
  }

  // Sorting
  filtered.sort((a: any, b: any) => {
    let valA = a[sort];
    let valB = b[sort];

    if (sort === 'employee') {
      valA = a.employeeName.toLowerCase();
      valB = b.employeeName.toLowerCase();
    } else if (sort === 'submittedAt' || sort === 'createdAt') {
      valA = new Date(a.submittedAt || a.createdAt).getTime();
      valB = new Date(b.submittedAt || b.createdAt).getTime();
    }

    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const paginatedRecords = filtered.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    success: true,
    total,
    page,
    limit,
    records: paginatedRecords
  });
}

export async function GET(req: NextRequest) {
  return allowSuperAdminLeaveAccess(req as AuthenticatedLeaveRequest, () => handler(req as AuthenticatedLeaveRequest));
}
