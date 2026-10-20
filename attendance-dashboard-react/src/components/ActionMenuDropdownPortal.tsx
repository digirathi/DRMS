import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Attendance } from '../types/attendance';

export type ActionType =
  | 'VIEW_DETAILS'
  | 'EDIT_ATTENDANCE'
  | 'ADD_MISSING_CLOCK_IN'
  | 'ADD_MISSING_CLOCK_OUT'
  | 'CHANGE_WORK_MODE'
  | 'MARK_LEAVE'
  | 'REMOVE_LEAVE'
  | 'VIEW_CORRECTION_REQUEST'
  | 'VIEW_AUDIT_HISTORY';

interface MenuItemConfig {
  action: ActionType;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
  disabledReason?: string;
}

interface ActionMenuDropdownPortalProps {
  record: Attendance;
  onViewDetails: (record: Attendance) => void;
  onSelectAction: (action: ActionType, record: Attendance) => void;
  isHRorAdmin: boolean;
}

export const ActionMenuDropdownPortal: React.FC<ActionMenuDropdownPortalProps> = ({
  record,
  onViewDetails,
  onSelectAction,
  isHRorAdmin
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [mounted, setMounted] = useState(false);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasClockIn = Boolean(record.clockInAt);
  const hasClockOut = Boolean(record.clockOutAt);
  const isOnLeave = record.status === 'ON_LEAVE';
  const hasCorrectionRequest = Boolean(record.correctionRequestId || (record.correctionStatus && record.correctionStatus !== 'NO_REQUEST'));

  const menuItems: MenuItemConfig[] = [
    {
      action: 'EDIT_ATTENDANCE',
      label: 'Edit attendance',
      icon: (
        <svg className="h-4 w-4 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      action: 'ADD_MISSING_CLOCK_IN',
      label: 'Add missing clock-in',
      disabled: hasClockIn || isOnLeave,
      disabledReason: hasClockIn ? 'Clock-in time already recorded.' : isOnLeave ? 'Cannot add clock-in while on leave.' : undefined,
      icon: (
        <svg className={`h-4 w-4 shrink-0 ${!hasClockIn && !isOnLeave ? 'text-teal-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-2-2m2 2l2-2m-2 2v-7m0 11a9 9 0 110-18 9 9 0 010 18z" />
        </svg>
      )
    },
    {
      action: 'ADD_MISSING_CLOCK_OUT',
      label: 'Add missing clock-out',
      disabled: !hasClockIn || hasClockOut || isOnLeave,
      disabledReason: hasClockOut
        ? 'Clock-out already recorded.'
        : !hasClockIn
        ? 'Clock-in is required before adding clock-out.'
        : isOnLeave
        ? 'Cannot add clock-out while on leave.'
        : undefined,
      icon: (
        <svg className={`h-4 w-4 shrink-0 ${hasClockIn && !hasClockOut && !isOnLeave ? 'text-amber-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      action: 'CHANGE_WORK_MODE',
      label: 'Change work mode',
      disabled: isOnLeave,
      disabledReason: isOnLeave ? 'Cannot change work mode while on leave.' : undefined,
      icon: (
        <svg className={`h-4 w-4 shrink-0 ${!isOnLeave ? 'text-cyan-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      action: 'MARK_LEAVE',
      label: 'Mark leave',
      disabled: isOnLeave || hasClockIn || hasClockOut,
      disabledReason: isOnLeave
        ? 'Employee is already marked on leave.'
        : hasClockIn || hasClockOut
        ? 'Cannot mark full-day leave after attendance activity.'
        : undefined,
      icon: (
        <svg className={`h-4 w-4 shrink-0 ${!isOnLeave && !hasClockIn ? 'text-amber-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      action: 'REMOVE_LEAVE',
      label: 'Remove leave',
      disabled: !isOnLeave,
      disabledReason: !isOnLeave ? 'Record is not currently on leave.' : undefined,
      icon: (
        <svg className={`h-4 w-4 shrink-0 ${isOnLeave ? 'text-red-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      )
    },
    {
      action: 'VIEW_CORRECTION_REQUEST',
      label: 'View correction request',
      disabled: !hasCorrectionRequest,
      disabledReason: !hasCorrectionRequest ? 'No correction request for this record.' : undefined,
      icon: (
        <svg className={`h-4 w-4 shrink-0 ${hasCorrectionRequest ? 'text-indigo-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      action: 'VIEW_AUDIT_HISTORY',
      label: 'View audit history',
      icon: (
        <svg className="h-4 w-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuWidth = 240;
    const menuHeight = 310;
    const padding = 12;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = rect.right - menuWidth;
    let top = rect.bottom + 6;

    // Flip upward if insufficient space below
    if (rect.bottom + menuHeight + padding > viewportHeight && rect.top - menuHeight - padding > 0) {
      top = rect.top - menuHeight - 6;
    }

    if (left < padding) left = padding;
    if (left + menuWidth > viewportWidth - padding) left = viewportWidth - padding - menuWidth;

    setMenuPosition({
      top: top + window.scrollY,
      left: left + window.scrollX
    });
  }, []);

  const handleToggle = () => {
    if (!isOpen) {
      updatePosition();
      setFocusedIndex(-1);
    }
    setIsOpen((prev) => !prev);
  };

  const handleClose = useCallback(() => {
    setIsOpen(false);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

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

    const handleScrollOrResize = () => {
      updatePosition();
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen, updatePosition]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggle();
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => {
        let next = (prev + 1) % menuItems.length;
        while (next < menuItems.length && menuItems[next].disabled) {
          next = (next + 1) % menuItems.length;
        }
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => {
        let next = prev <= 0 ? menuItems.length - 1 : prev - 1;
        while (next >= 0 && menuItems[next].disabled) {
          next = next <= 0 ? menuItems.length - 1 : next - 1;
        }
        return next;
      });
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < menuItems.length) {
        const item = menuItems[focusedIndex];
        if (!item.disabled) {
          setIsOpen(false);
          onSelectAction(item.action, record);
        }
      }
    }
  };

  const portalContent =
    isOpen && mounted ? (
      createPortal(
        <div
          ref={menuRef}
          role="menu"
          aria-orientation="vertical"
          tabIndex={-1}
          style={{
            position: 'absolute',
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`
          }}
          className="z-[1000] min-w-[240px] rounded-2xl border border-slate-700/80 bg-slate-900/95 backdrop-blur-xl p-1.5 shadow-2xl shadow-black/80 focus:outline-none animate-in fade-in zoom-in-95 duration-100"
        >
          {menuItems.map((item, idx) => {
            const isFocused = focusedIndex === idx;

            if (item.disabled) {
              return (
                <div key={item.action} className="relative group" role="none">
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    role="menuitem"
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-500 opacity-50 cursor-not-allowed whitespace-nowrap"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                  {item.disabledReason && (
                    <div className="absolute left-full top-0 ml-1 hidden group-hover:block z-[1010] bg-slate-950 border border-slate-800 text-slate-300 text-[11px] py-1 px-2.5 rounded-lg shadow-xl whitespace-nowrap pointer-events-none">
                      {item.disabledReason}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.action}
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  onSelectAction(item.action, record);
                }}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-200 transition-colors whitespace-nowrap cursor-pointer ${
                  isFocused
                    ? 'bg-indigo-600/30 text-indigo-200 outline-none'
                    : 'hover:bg-slate-800/80 hover:text-white focus:bg-slate-800/80 focus:outline-none'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>,
        document.body
      )
    ) : null;

  return (
    <div className="relative inline-flex items-center gap-2">
      <button
        onClick={() => onViewDetails(record)}
        type="button"
        className="inline-flex h-8 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 px-3 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-slate-100 focus:outline-none cursor-pointer"
      >
        View
      </button>

      {isHRorAdmin && (
        <>
          <button
            ref={buttonRef}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            type="button"
            aria-haspopup="menu"
            aria-expanded={isOpen}
            aria-label={`Edit options for ${record.employeeName}`}
            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-xl border border-indigo-500/40 bg-indigo-950/60 px-3 text-xs font-bold text-indigo-300 transition hover:bg-indigo-900/80 hover:text-white cursor-pointer shadow-sm"
          >
            <span>Edit</span>
            <svg
              className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {portalContent}
        </>
      )}
    </div>
  );
};

export default ActionMenuDropdownPortal;
