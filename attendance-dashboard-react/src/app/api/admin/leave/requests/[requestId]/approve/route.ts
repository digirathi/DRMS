import { NextRequest, NextResponse } from 'next/server';
import { allowSuperAdminLeaveAccess, AuthenticatedLeaveRequest } from '../../../../../../../middleware/leaveAuthMiddleware';
import {
  mockLeaveRequests,
  mockLeaveBalances,
  mockBalanceTransactions,
  mockLeaveAuditLogs,
  mockLeaveNotifications,
  mockLeaveTypes
} from '../../../../../../../data/mockLeave';
import { mockAttendanceHistoryRecords } from '../../../../../../../data/mockAttendance';

async function handler(req: AuthenticatedLeaveRequest, params: { requestId: string }) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    // optional note body
  }

  const requestIndex = mockLeaveRequests.findIndex((r) => r.id === params.requestId);

  if (requestIndex === -1) {
    return NextResponse.json(
      { success: false, message: 'Leave request not found.' },
      { status: 404 }
    );
  }

  const leaveReq = mockLeaveRequests[requestIndex];

  // Concurrency Protection check
  if (leaveReq.status !== 'PENDING_APPROVAL') {
    return NextResponse.json(
      {
        success: false,
        message: 'This leave request has already been processed by another approver.'
      },
      { status: 409 }
    );
  }



  const approvalNote = typeof body?.approvalNote === 'string' ? body.approvalNote.trim().slice(0,500) : ''; 

  // Attendance conflict check for full day leave
  if (leaveReq.dayType === 'FULL_DAY') {
    const existingAttendance = mockAttendanceHistoryRecords.find(
      (a) => a.employeeId === leaveReq.employeeId && a.date && a.date >= leaveReq.startDate && a.date <= leaveReq.endDate && (a.clockInAt || a.clockOutAt)
    );
    if (existingAttendance && (existingAttendance.clockInAt || existingAttendance.clockOutAt)) {
      return NextResponse.json(
        {
          success: false,
          message: 'This employee already has attendance activity for the selected date. Correct the attendance record before approving full-day leave.'
        },
        { status: 400 }
      );
    }
  }

  const leaveType = mockLeaveTypes.find((t) => t.id === leaveReq.leaveTypeId);
  const balanceIndex = mockLeaveBalances.findIndex(
    (b) => b.employeeId === leaveReq.employeeId && b.leaveTypeId === leaveReq.leaveTypeId
  );

  let currentBalance = 0;
  if (balanceIndex !== -1) {
    currentBalance = mockLeaveBalances[balanceIndex].availableBalance;
  }

  if (!leaveType || balanceIndex === -1) return NextResponse.json({success:false,message:'Assign a leave policy before approving this request.'},{status:400});
  const minimumBalance = (leaveType.negativeLeavesAllowed ?? leaveType.allowNegativeBalance) ? -Math.abs(leaveType.negativeBalanceLimit || 0) : 0;
  // Validate balance
  if (currentBalance - leaveReq.totalDays < minimumBalance) {
    return NextResponse.json(
      {
        success: false,
        message: `Insufficient leave balance. Available: ${currentBalance} days, Requested: ${leaveReq.totalDays} days.`
      },
      { status: 400 }
    );
  }

  // Deduct balance
  const newBalance = currentBalance - leaveReq.totalDays;
  if (balanceIndex !== -1) {
    mockLeaveBalances[balanceIndex].used += leaveReq.totalDays;
    mockLeaveBalances[balanceIndex].pending = Math.max(0, mockLeaveBalances[balanceIndex].pending - leaveReq.totalDays);
    mockLeaveBalances[balanceIndex].availableBalance = newBalance;
    mockLeaveBalances[balanceIndex].lastUpdated = new Date().toISOString();
  }

  // Record Transaction
  mockBalanceTransactions.unshift({
    id: `lbt-${Date.now()}`,
    balanceId: balanceIndex !== -1 ? mockLeaveBalances[balanceIndex].id : 'lb-temp',
    employeeId: leaveReq.employeeId,
    leaveTypeId: leaveReq.leaveTypeId,
    transactionType: 'APPROVE_REQUEST',
    amount: -leaveReq.totalDays,
    previousBalance: currentBalance,
    newBalance: newBalance,
    effectiveDate: leaveReq.startDate,
    reason: `Leave request approved (${leaveReq.leaveTypeName})`,
    performedById: req.user?.id || 'usr-admin-1',
    performedByName: req.user?.name || 'Super Admin',
    performedByRole: req.user?.role || 'SUPER_ADMIN',
    createdAt: new Date().toISOString()
  });

  // Finalize Leave Request
  const updatedRequest = {
    ...leaveReq,
    status: 'APPROVED' as const,
    version: leaveReq.version + 1,
    processedById: req.user?.id || 'usr-admin-1',
    processedByName: req.user?.name || 'Super Admin',
    processedByRole: req.user?.role || 'SUPER_ADMIN',
    processedAt: new Date().toISOString(),
    approvalNote: approvalNote?.trim() || 'Leave request approved.',
    balanceAfterApp: newBalance,
    updatedAt: new Date().toISOString()
  };

  mockLeaveRequests[requestIndex] = updatedRequest;

  // Cover each selected calendar date; half-day leave preserves clock records.
  if (leaveReq.dayType === 'FULL_DAY') {
    for (let date = new Date(leaveReq.startDate + 'T00:00:00Z'); date.toISOString().slice(0,10) <= leaveReq.endDate; date.setUTCDate(date.getUTCDate()+1)) {
      const day=date.toISOString().slice(0,10);
      const existing=mockAttendanceHistoryRecords.find(a=>a.employeeId===leaveReq.employeeId && a.date===day);
      if(existing){existing.status='ON_LEAVE';existing.workMode=null;existing.adminRemark='Approved Leave: '+leaveReq.leaveTypeName;}
      else mockAttendanceHistoryRecords.push({id:'leave-'+leaveReq.id+'-'+day,employeeId:leaveReq.employeeId,employeeName:leaveReq.employeeName,department:leaveReq.department,date:day,workMode:null,clockInAt:null,clockOutAt:null,status:'ON_LEAVE',verification:'NOT_REQUIRED',adminRemark:'Approved Leave: '+leaveReq.leaveTypeName,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});
    }
  }

  // Create Audit Record
  mockLeaveAuditLogs.unshift({
    id: `lal-${Date.now()}`,
    employeeId: leaveReq.employeeId,
    requestId: leaveReq.id,
    leaveTypeId: leaveReq.leaveTypeId,
    action: 'APPROVE_REQUEST',
    oldValue: 'PENDING_APPROVAL',
    newValue: 'APPROVED',
    performedBy: req.user?.name || 'Super Admin',
    userRole: req.user?.role || 'SUPER_ADMIN',
    reason: approvalNote?.trim() || 'Leave request approved',
    ipAddress: '127.0.0.1',
    deviceInfo: req.headers.get('user-agent') || 'Browser',
    createdAt: new Date().toISOString()
  });

  // Create Notification
  mockLeaveNotifications.unshift({
    id: `nt-${Date.now()}`,
    recipientId: leaveReq.employeeId,
    userRole: 'EMPLOYEE',
    title: 'Leave Request Approved',
    message: `Your ${leaveReq.leaveTypeName} request from ${leaveReq.startDate} to ${leaveReq.endDate} has been approved.`,
    type: 'LEAVE_APPROVED',
    requestId: leaveReq.id,
    isRead: false,
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({
    success: true,
    message: 'Leave request approved successfully.',
    data: updatedRequest
  });
}

export async function POST(req: NextRequest, { params }: { params: { requestId: string } }) {
  return allowSuperAdminLeaveAccess(req as AuthenticatedLeaveRequest, () => handler(req as AuthenticatedLeaveRequest, params));
}
