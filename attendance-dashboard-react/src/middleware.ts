import { NextRequest, NextResponse } from 'next/server';
import { readDemoIdentity } from './middleware/demoIdentity';

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const leave = path === '/admin/leave' || path.startsWith('/admin/leave/') || path.startsWith('/api/admin/leave');
  const user = readDemoIdentity(req);
  const allowed = leave ? user?.role === 'SUPER_ADMIN' : user && ['SUPER_ADMIN', 'HR'].includes(user.role);
  if (!allowed) return NextResponse.json({ success: false, message: leave
    ? 'You do not have permission to access leave management.'
    : 'You do not have permission to access this administration module.' }, { status: 403 });
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };
