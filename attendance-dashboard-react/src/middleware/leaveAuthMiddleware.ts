import { NextRequest, NextResponse } from 'next/server';
import { readDemoIdentity } from './demoIdentity';
import { UserRole } from '../types/leave';

export interface AuthenticatedLeaveRequest extends NextRequest {
  url: string;
  headers: any;
  json(): Promise<any>;
  user?: {
    id: string;
    role: UserRole;
    name: string;
    email?: string;
  };
}

/**
 * Backend authorization middleware for Super Admin Leave Management operations.
 * Validates whether the incoming request strictly has the SUPER_ADMIN role.
 * If unauthorized, returns HTTP 403 Forbidden with exact payload required:
 * {
 *   "success": false,
 *   "message": "You do not have permission to access leave management."
 * }
 */
export function allowSuperAdminLeaveAccess(
  req: AuthenticatedLeaveRequest,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const allowedRoles: UserRole[] = ['SUPER_ADMIN'];

  req.user = readDemoIdentity(req);

  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return Promise.resolve(
      NextResponse.json(
        {
          success: false,
          message: 'You do not have permission to access leave management.'
        },
        { status: 403 }
      )
    );
  }

  return handler();
}
