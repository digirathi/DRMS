import { NextRequest, NextResponse } from 'next/server';
import { allowSuperAdminLeaveAccess, AuthenticatedLeaveRequest } from '../../../../../middleware/leaveAuthMiddleware';
import { mockLeaveRequests } from '../../../../../data/mockLeave';

async function handler(req: AuthenticatedLeaveRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get('search')?.toLowerCase().trim() || '';
  const department = searchParams.get('department') || 'ALL';
  const status = searchParams.get('status') || 'ALL';
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  let filtered = [...mockLeaveRequests];

  if (search) {
    filtered = filtered.filter(
      (r) =>
        r.employeeName.toLowerCase().includes(search) ||
        r.employeeCode.toLowerCase().includes(search) ||
        r.department.toLowerCase().includes(search)
    );
  }

  if (department !== 'ALL') {
    filtered = filtered.filter((r) => r.department === department);
  }

  if (status !== 'ALL') {
    filtered = filtered.filter((r) => r.status === status);
  }

  if (startDate && endDate) {
    filtered = filtered.filter((r) => r.startDate >= startDate && r.endDate <= endDate);
  }

  // Generate CSV Content
  const headers = [
    'Request ID',
    'Employee Name',
    'Employee Code',
    'Department',
    'Leave Type',
    'Is Paid',
    'Start Date',
    'End Date',
    'Duration Days',
    'Day Type',
    'Status',
    'Submitted At',
    'Processed By',
    'Reason'
  ];

  const rows = filtered.map((r) => [
    `"${r.id}"`,
    `"${r.employeeName}"`,
    `"${r.employeeCode}"`,
    `"${r.department}"`,
    `"${r.leaveTypeName}"`,
    `"${r.isPaid ? 'Yes' : 'No'}"`,
    `"${r.startDate}"`,
    `"${r.endDate}"`,
    `"${r.totalDays}"`,
    `"${r.dayType}"`,
    `"${r.status}"`,
    `"${r.submittedAt}"`,
    `"${r.processedByName || 'N/A'}"`,
    `"${(r.reason || '').replace(/"/g, '""')}"`
  ]);

  const csvString = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  return new NextResponse(csvString, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename=leave_report_${new Date().toISOString().slice(0, 10)}.csv`
    }
  });
}

export async function GET(req: NextRequest) {
  return allowSuperAdminLeaveAccess(req as AuthenticatedLeaveRequest, () => handler(req as AuthenticatedLeaveRequest));
}
