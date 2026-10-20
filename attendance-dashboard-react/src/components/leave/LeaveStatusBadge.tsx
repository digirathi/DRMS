import React from 'react';
import { LeaveStatus, LeaveDayType } from '../../types/leave';

interface LeaveStatusBadgeProps {
  status: LeaveStatus;
  className?: string;
}

export const LeaveStatusBadge: React.FC<LeaveStatusBadgeProps> = ({ status, className = '' }) => {
  const getBadgeStyle = (st: LeaveStatus) => {
    switch (st) {
      case 'APPROVED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-950/20';
      case 'PENDING_APPROVAL':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-amber-950/20 animate-pulse';
      case 'REJECTED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-rose-950/20';
      case 'MORE_INFORMATION_REQUIRED':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30 shadow-sky-950/20';
      case 'CANCELLATION_REQUESTED':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-purple-950/20 animate-pulse';
      case 'CANCELLED':
        return 'bg-slate-500/10 text-slate-400 border-slate-700 shadow-slate-950/20';
      case 'WITHDRAWN':
      case 'WITHDRAWAL_REQUESTED':
        return 'bg-slate-500/10 text-slate-400 border-slate-600 shadow-slate-950/20';
      case 'DRAFT':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'EXPIRED':
        return 'bg-slate-800 text-slate-500 border-slate-700';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getFormatLabel = (st: LeaveStatus) => {
    switch (st) {
      case 'PENDING_APPROVAL':
        return 'Pending Approval';
      case 'MORE_INFORMATION_REQUIRED':
        return 'More Info Needed';
      case 'CANCELLATION_REQUESTED':
        return 'Cancellation Requested';
      case 'WITHDRAWAL_REQUESTED':
        return 'Withdrawal Requested';
      default:
        return st.charAt(0) + st.slice(1).toLowerCase().replace(/_/g, ' ');
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border shadow-sm ${getBadgeStyle(
        status
      )} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {getFormatLabel(status)}
    </span>
  );
};

export const DayTypeBadge: React.FC<{ dayType: LeaveDayType; className?: string }> = ({
  dayType,
  className = ''
}) => {
  let label = 'Full Day';
  let color = 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';

  if (dayType === 'FIRST_HALF') {
    label = 'First Half';
    color = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
  } else if (dayType === 'SECOND_HALF') {
    label = 'Second Half';
    color = 'bg-teal-500/10 text-teal-300 border-teal-500/30';
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${color} ${className}`}
    >
      {label}
    </span>
  );
};

export default LeaveStatusBadge;
