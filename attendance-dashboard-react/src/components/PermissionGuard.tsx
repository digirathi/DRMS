import React from 'react';
import { User } from '../types/attendance';

interface PermissionGuardProps {
  user: User | null;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  user,
  children,
  fallback
}) => {
  const allowedRoles = ['SUPER_ADMIN', 'HR'];
  const hasAccess = user && allowedRoles.includes(user.role);

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-[400px] flex items-center justify-center bg-slate-950 px-4 py-12">
        <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-md border border-slate-800 p-8 rounded-2xl shadow-2xl text-center">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center rounded-full mx-auto mb-5 shadow-lg shadow-red-950/40">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Access Restricted</h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6 font-medium">
            You do not have permission to view employee attendance history.
          </p>
          <div className="text-xs text-slate-500 border-t border-slate-800/80 pt-4 flex flex-col gap-1">
            <span>Current Role: <strong className="text-amber-400">{user?.role || 'Guest'}</strong></span>
            <span>Required Authorization: <strong>Super Admin (SUPER_ADMIN)</strong> or <strong>HR (HR)</strong></span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PermissionGuard;
