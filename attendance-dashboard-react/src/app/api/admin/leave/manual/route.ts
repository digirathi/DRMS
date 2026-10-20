import { NextRequest, NextResponse } from 'next/server';
import { allowSuperAdminLeaveAccess, AuthenticatedLeaveRequest } from '../../../../../middleware/leaveAuthMiddleware';
import {
  mockLeaveRequests,
  mockLeaveBalances,
  mockBalanceTransactions,
  mockLeaveAuditLogs,
  mockLeaveTypes
} from '../../../../../data/mockLeave';
import { mockAttendanceHistoryRecords } from '../../../../../data/mockAttendance';

async function handler(req: AuthenticatedLeaveRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON payload.' }, { status: 400 });
  }

  const {
    employeeId,
    employeeName,
    employeeCode,
    department,
    leaveTypeId,
    startDate,
    endDate,
    dayType = 'FULL_DAY',
    totalDays = 1,
    reason,
    approvalStatus = 'APPROVED',
    deductBalance = true,
    internalNote,
    manualEntryReason
  } = body;

  if (!employeeId || !leaveTypeId || !startDate || !endDate || !reason || !manualEntryReason) {
    return NextResponse.json(
      {
        success: false,
        message: 'Missing mandatory fields (Employee, Leave Type, Dates, Reason, Manual Entry Reason).'
      },
      { status: 400 }
    );
  }

  const leaveType = mockLeaveTypes.find((t) => t.id === leaveTypeId);
  const leaveTypeName = leaveType ? leaveType.name : 'Manual Leave';

  const balanceIndex = mockLeaveBalances.findIndex(
    (b) => b.employeeId === employeeId && b.leaveTypeId === leaveTypeId
  );

  let currentBal = balanceIndex !== -1 ? mockLeaveBalances[balanceIndex].availableBalance : 10;
  let newBal = currentBal;

  if (deductBalance && approvalStatus === 'APPROVED') {
    newBal = currentBal - totalDays;
    if (balanceIndex !== -1) {
      mockLeaveBalances[balanceIndex].used += totalDays;
      mockLeaveBalances[balanceIndex].availableBalance = newBal;
      mockLeaveBalances[balanceIndex].lastUpdated = new Date().toISOString();
    }
  }

  const newRequestId = `lr-manual-${Date.now()}`;
  const newRequest = {
    id: newRequestId,
    employeeId,
    employeeName: employeeName || 'Employee',
    employeeCode: employeeCode || 'DR-1000',
    department: department || 'Engineering',
    leaveTypeId,
    leaveTypeName,
    isPaid: leaveType ? leaveType.isPaid : true,
    startDate,
    endDate,
    dayType,
    totalDays: Number(totalDays),
    currentBalance: currentBal,
    balanceAfterApp: newBal,
    reason,
    status: approvalStatus,
    version: 1,
    submittedAt: new Date().toISOString(),
    processedById: req.user?.id || 'usr-admin-1',
    processedByName: req.user?.name || 'Super Admin',
    processedByRole: req.user?.role || 'SUPER_ADMIN',
    processedAt: new Date().toISOString(),
    approvalNote: `Manual entry by Super Admin: ${manualEntryReason}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  mockLeaveRequests.unshift(newRequest as any);

  if (deductBalance && approvalStatus === 'APPROVED') {
    mockBalanceTransactions.unshift({
      id: `lbt-${Date.now()}`,
      balanceId: balanceIndex !== -1 ? mockLeaveBalances[balanceIndex].id : 'lb-manual',
      employeeId,
      leaveTypeId,
      transactionType: 'MANUAL_ADD_LEAVE',
      amount: -Number(totalDays),
      previousBalance: currentBal,
      newBalance: newBal,
      effectiveDate: startDate,
      reason: `Manual Leave Entry: ${manualEntryReason}`,
      internalNote,
      performedById: req.user?.id || 'usr-admin-1',
      performedByName: req.user?.name || 'Super Admin',
      performedByRole: req.user?.role || 'SUPER_ADMIN',
      createdAt: new Date().toISOString()
    });

    // Attendance Sync
    if (dayType === 'FULL_DAY') {
      const attRecord = mockAttendanceHistoryRecords.find(
        (a) => a.employeeId === employeeId && a.date === startDate
      );
      if (attRecord) {
        attRecord.status = 'ON_LEAVE';
        attRecord.adminRemark = `Manual Leave: ${leaveTypeName}`;
      }
    }
  }

  // Audit Record
  mockLeaveAuditLogs.unshift({
    id: `lal-${Date.now()}`,
    employeeId,
    requestId: newRequestId,
    leaveTypeId,
    action: 'MANUAL_ADD_LEAVE',
    oldValue: 'No Leave',
    newValue: `Approved ${leaveTypeName}`,
    performedBy: req.user?.name || 'Super Admin',
    userRole: req.user?.role || 'SUPER_ADMIN',
    reason: manualEntryReason,
    ipAddress: '127.0.0.1',
    deviceInfo: req.headers.get('user-agent') || 'Browser',
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({
    success: true,
    message: 'Manual leave added successfully.',
    data: newRequest
  });
}

export async function POST(req: NextRequest) {
  return allowSuperAdminLeaveAccess(req as AuthenticatedLeaveRequest, () => handler(req as AuthenticatedLeaveRequest));
}
