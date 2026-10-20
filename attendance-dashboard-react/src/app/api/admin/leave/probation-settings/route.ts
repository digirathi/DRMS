import { NextRequest, NextResponse } from 'next/server';
import { allowSuperAdminLeaveAccess, AuthenticatedLeaveRequest } from '../../../../../middleware/leaveAuthMiddleware';
import {
  mockProbationSettings,
  mockProbationOverrides,
  mockLeaveAuditLogs
} from '../../../../../data/mockLeave';

async function getHandler(req: AuthenticatedLeaveRequest) {
  return NextResponse.json({
    success: true,
    settings: mockProbationSettings,
    overrides: mockProbationOverrides
  });
}

async function patchHandler(req: AuthenticatedLeaveRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid payload.' }, { status: 400 });
  }

  const { override, ...updates } = body;

  // Handle employee probation override if provided
  if (override) {
    const { employeeId, employeeName, originalEndDate, overrideEndDate, reason } = override;
    if (!employeeId || !overrideEndDate || !reason || reason.trim().length < 5) {
      return NextResponse.json(
        {
          success: false,
          message: 'Employee ID, New End Date, and Mandatory Reason (min 5 chars) are required for probation override.'
        },
        { status: 400 }
      );
    }

    const existingIndex = mockProbationOverrides.findIndex((o) => o.employeeId === employeeId);
    const newOverride = {
      id: `epo-${Date.now()}`,
      employeeId,
      employeeName: employeeName || 'Employee',
      originalEndDate: originalEndDate || '2026-08-01',
      overrideEndDate,
      reason: reason.trim(),
      overriddenById: req.user?.id || 'usr-admin-1',
      overriddenByName: req.user?.name || 'Super Admin',
      createdAt: new Date().toISOString()
    };

    if (existingIndex !== -1) {
      mockProbationOverrides[existingIndex] = newOverride;
    } else {
      mockProbationOverrides.unshift(newOverride);
    }

    mockLeaveAuditLogs.unshift({
      id: `lal-${Date.now()}`,
      employeeId,
      action: 'PROBATION_OVERRIDE',
      oldValue: originalEndDate || 'Default probation',
      newValue: overrideEndDate,
      performedBy: req.user?.name || 'Super Admin',
      userRole: req.user?.role || 'SUPER_ADMIN',
      reason: reason.trim(),
      ipAddress: '127.0.0.1',
      deviceInfo: req.headers.get('user-agent') || 'Browser',
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: `Probation end date overridden for ${employeeName || employeeId}.`,
      override: newOverride
    });
  }

  // Update Global Probation Settings
  Object.assign(mockProbationSettings, updates, { updatedAt: new Date().toISOString() });

  mockLeaveAuditLogs.unshift({
    id: `lal-${Date.now()}`,
    employeeId: 'GLOBAL',
    action: 'PROBATION_SETTING_UPDATE',
    oldValue: null,
    newValue: JSON.stringify(mockProbationSettings),
    performedBy: req.user?.name || 'Super Admin',
    userRole: req.user?.role || 'SUPER_ADMIN',
    reason: 'Updated global probation period configuration',
    ipAddress: '127.0.0.1',
    deviceInfo: req.headers.get('user-agent') || 'Browser',
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({
    success: true,
    message: 'Probation settings updated successfully.',
    settings: mockProbationSettings
  });
}

export async function GET(req: NextRequest) {
  return allowSuperAdminLeaveAccess(req as AuthenticatedLeaveRequest, () => getHandler(req as AuthenticatedLeaveRequest));
}

export async function PATCH(req: NextRequest) {
  return allowSuperAdminLeaveAccess(req as AuthenticatedLeaveRequest, () => patchHandler(req as AuthenticatedLeaveRequest));
}
