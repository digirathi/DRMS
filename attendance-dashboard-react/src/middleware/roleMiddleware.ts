import { NextRequest, NextResponse } from 'next/server';
import { readDemoIdentity } from './demoIdentity';
import { UserRole } from '../types/attendance';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    role: UserRole;
    name: string;
    email?: string;
  };
}

/**
 * Backend authorization middleware for Attendance History and Admin operations.
 * Validates whether the incoming request has SUPER_ADMIN or HR role.
 * If unauthorized, returns HTTP 403 Forbidden with exact payload required:
 * {
 *   "success": false,
 *   "message": "You do not have permission to view employee attendance history."
 * }
 */
export function allowAttendanceAccess(
  req: AuthenticatedRequest,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const allowedRoles: UserRole[] = ['SUPER_ADMIN', 'HR'];

  req.user = readDemoIdentity(req);

  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return Promise.resolve(
      NextResponse.json(
        {
          success: false,
          message: 'You do not have permission to view employee attendance history.'
        },
        { status: 403 }
      )
    );
  }

  return handler();
}
