import React, { useState, useRef, useEffect } from 'react';
import { Attendance } from '../types/attendance';

export type ActionType =
  | 'VIEW_DETAILS'
  | 'EDIT_ATTENDANCE'
  | 'ADD_MISSING_CLOCK_OUT'
  | 'CHANGE_WORK_MODE'
  | 'MARK_LEAVE'
  | 'VIEW_AUDIT_HISTORY';

interface ActionMenuProps {
  record: Attendance;
  onViewDetails: (record: Attendance) => void;
  onSelectAction: (action: ActionType, record: Attendance) => void;
  isHRorAdmin: boolean;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  record,
  onViewDetails,
  onSelectAction,
  isHRorAdmin
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleAction = (action: ActionType) => {
    setIsOpen(false);
    onSelectAction(action, record);
  };

  const isMissingClockOutAvailable =
    Boolean(record.clockInAt) && !record.clockOutAt && record.status !== 'ON_LEAVE';

  return (
    <div className="relative inline-flex items-center gap-2">
      {/* View Button */}
      <button
        onClick={() => onViewDetails(record)}
        type="button"
        className="text-xs font-semibold text-slate-300 hover:text-slate-100 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 rounded-lg px-3 py-1.5 cursor-pointer transition-colors focus:ring-1 focus:ring-indigo-500 focus:outline-none"
      >
        View
      </button>

      {/* Edit Dropdown Trigger */}
      {isHRorAdmin && (
        <div className="relative inline-block text-left">
          <button
            ref={buttonRef}
            onClick={() => setIsOpen((prev) => !prev)}
            type="button"
            aria-expanded={isOpen}
            aria-haspopup="true"
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-lg px-3 py-1.5 cursor-pointer transition-colors focus:ring-1 focus:ring-indigo-500 focus:outline-none leading-none"
          >
            <span>Edit</span>
            <svg
              className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu Popup with Enhanced Dark Theme & Typography */}
          {isOpen && (
            <div
              ref={menuRef}
              role="menu"
              aria-orientation="vertical"
              className="absolute right-0 mt-2 w-56 bg-slate-900/95 border border-slate-800/90 backdrop-blur-xl rounded-xl shadow-2xl shadow-indigo-950/50 z-50 py-1.5 focus:outline-none divide-y divide-slate-800/80 animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="py-1" role="none">
                <button
                  onClick={() => handleAction('EDIT_ATTENDANCE')}
                  className="w-full text-left px-3.5 py-2.5 text-[13px] font-medium text-slate-200 hover:bg-indigo-500/10 hover:text-indigo-300 flex items-center gap-2.5 cursor-pointer transition-colors"
                  role="menuitem"
                >
                  <div className="w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <span>Edit attendance</span>
                </button>

                <button
                  onClick={() => {
                    if (isMissingClockOutAvailable) {
                      handleAction('ADD_MISSING_CLOCK_OUT');
                    }
                  }}
                  disabled={!isMissingClockOutAvailable}
                  title={
                    !isMissingClockOutAvailable
                      ? record.clockOutAt
                        ? 'Clock-out already exists for this attendance record.'
                        : 'No clock-in time recorded.'
                      : undefined
                  }
                  className={`w-full text-left px-3.5 py-2.5 text-[13px] font-medium flex items-center gap-2.5 transition-colors ${
                    isMissingClockOutAvailable
                      ? 'text-slate-200 hover:bg-amber-500/10 hover:text-amber-300 cursor-pointer'
                      : 'text-slate-600 cursor-not-allowed opacity-50'
                  }`}
                  role="menuitem"
                >
                  <div className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 ${isMissingClockOutAvailable ? 'bg-amber-500/10 border-amber-500/20' : 'bg-slate-800/40 border-slate-700/30'}`}>
                    <svg className={`w-3.5 h-3.5 ${isMissingClockOutAvailable ? 'text-amber-400' : 'text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span>Add missing clock-out</span>
                </button>

                <button
                  onClick={() => handleAction('CHANGE_WORK_MODE')}
                  className="w-full text-left px-3.5 py-2.5 text-[13px] font-medium text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-300 flex items-center gap-2.5 cursor-pointer transition-colors"
                  role="menuitem"
                >
                  <div className="w-6 h-6 rounded-md bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <span>Change work mode</span>
                </button>

                <button
                  onClick={() => handleAction('MARK_LEAVE')}
                  className="w-full text-left px-3.5 py-2.5 text-[13px] font-medium text-slate-200 hover:bg-violet-500/10 hover:text-violet-300 flex items-center gap-2.5 cursor-pointer transition-colors"
                  role="menuitem"
                >
                  <div className="w-6 h-6 rounded-md bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span>Mark leave</span>
                </button>
              </div>

              <div className="py-1" role="none">
                <button
                  onClick={() => handleAction('VIEW_AUDIT_HISTORY')}
                  className="w-full text-left px-3.5 py-2.5 text-[13px] font-medium text-slate-300 hover:bg-slate-800/80 hover:text-slate-100 flex items-center gap-2.5 cursor-pointer transition-colors"
                  role="menuitem"
                >
                  <div className="w-6 h-6 rounded-md bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span>View audit history</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
