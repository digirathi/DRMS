import React from 'react';
import { UserRole } from '../../types/leave';

interface SuperAdminLeaveGuardProps {
  userRole?: UserRole;
  children?: React.ReactNode;
}

export const SuperAdminLeaveGuard: React.FC<SuperAdminLeaveGuardProps> = ({
  userRole,
  children
}) => {
  const isSuperAdmin = userRole === 'SUPER_ADMIN';

  if (!isSuperAdmin) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-slate-950 px-4 py-16">
        <div className="w-full max-w-lg bg-slate-900/90 backdrop-blur-xl border border-red-500/20 p-8 rounded-2xl shadow-2xl text-center">
          <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center rounded-full mx-auto mb-6 shadow-xl shadow-red-950/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <span className="inline-block px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-full mb-3 uppercase tracking-wider">
            HTTP 403 Forbidden
          </span>
          <h2 className="text-2xl font-bold text-slate-100 mb-3">Access Restricted</h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6 font-medium bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-left">
            You do not have permission to access leave management.
          </p>
          <div className="text-xs text-slate-400 border-t border-slate-800/80 pt-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span>Your Current Role:</span>
              <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-mono font-bold">
                {userRole || 'UNKNOWN'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Required Authorization:</span>
              <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded font-mono font-bold">
                SUPER_ADMIN ONLY
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SuperAdminLeaveGuard;
