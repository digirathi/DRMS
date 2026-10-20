import type { NextRequest } from 'next/server';
import type { UserRole } from '../types/attendance';

/** Sample identities are available only in explicitly enabled local development.
 * Production stays closed until a real server-verified session is integrated. */
export function readDemoIdentity(req: NextRequest) {
  if (process.env.NODE_ENV === 'production' || process.env.HRMS_ENABLE_DEMO_AUTH !== 'true') return undefined;
  const hostname = new URL(req.url).hostname;
  if (!['localhost', '127.0.0.1', '[::1]'].includes(hostname)) return undefined;
  try {
    const user = JSON.parse(req.headers.get('x-user-mock') || 'null');
    const roles: UserRole[] = ['SUPER_ADMIN', 'HR', 'MANAGER', 'TEAM_LEADER', 'EMPLOYEE'];
    if (!user || typeof user.id !== 'string' || !user.id.trim() || typeof user.name !== 'string' || !roles.includes(user.role)) return undefined;
    return { id: user.id, name: user.name, role: user.role as UserRole };
  } catch { return undefined; }
}
