'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Attendance, FilterState, SummaryData, User, UserRole, WorkMode, AuditLog } from '../../../../types/attendance';
import { PermissionGuard } from '../../../../components/PermissionGuard';
import { SummaryCard } from '../../../../components/SummaryCard';
import { SearchToolbar } from '../../../../components/SearchToolbar';
import { AttendanceTable } from '../../../../components/AttendanceTable';
import { ActionType } from '../../../../components/ActionMenuDropdownPortal';
import { EmployeeDetailsDrawer } from '../../../../components/EmployeeDetailsDrawer';
import { EditAttendanceModal } from '../../../../components/EditAttendanceModal';
import { AddMissingClockOutModal } from '../../../../components/AddMissingClockOutModal';
import { ChangeWorkModeModal } from '../../../../components/ChangeWorkModeModal';
import { MarkLeaveModal } from '../../../../components/MarkLeaveModal';
import { AuditHistoryDrawer } from '../../../../components/AuditHistoryDrawer';
import { SkeletonLoader } from '../../../../components/SkeletonLoader';
import { mockDepartments } from '../../../../data/mockAttendance';

export default function TodayAttendancePage() {
  // Developer Role Switcher state for quick role testing
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'USR-001',
    name: 'Demo Person 12',
    role: 'SUPER_ADMIN',
    email: 'demo01@example.test'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [records, setRecords] = useState<Attendance[]>([]);
  const [totalEmployeesCount, setTotalEmployeesCount] = useState(0);
  const [summary, setSummary] = useState<SummaryData>({
    totalEmployees: 0,
    clockedIn: 0,
    clockedOut: 0,
    notClockedIn: 0,
    workingFromOffice: 0,
    workingFromHome: 0,
    onLeave: 0,
    missingClockOut: 0
  });

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [workModeFilter, setWorkModeFilter] = useState('ALL');
  const [selectedSummaryFilter, setSelectedSummaryFilter] = useState<string | null>(null);

  // Pagination & Sorting State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [sortField, setSortField] = useState('employeeName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals & Drawer State
  const [selectedRecord, setSelectedRecord] = useState<Attendance | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMissingClockOutModalOpen, setIsMissingClockOutModalOpen] = useState(false);
  const [isWorkModeModalOpen, setIsWorkModeModalOpen] = useState(false);
  const [isMarkLeaveModalOpen, setIsMarkLeaveModalOpen] = useState(false);
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);

  // Auto Refresh
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch Data from APIs
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const headers = {
        'Content-Type': 'application/json',
        'x-user-mock': JSON.stringify(currentUser)
      };

      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(rowsPerPage),
        sort: sortField,
        order: sortOrder,
        search,
        department: departmentFilter,
        workMode: workModeFilter,
        status: selectedSummaryFilter || 'ALL'
      });

      const [recordsRes, summaryRes] = await Promise.all([
        fetch(`/api/admin/attendance/today?${params}`, { headers }).then((r) => r.json()),
        fetch(`/api/admin/attendance/summary`, { headers }).then((r) => r.json())
      ]);

      if (recordsRes.success === false) {
        throw new Error(recordsRes.message || 'Failed to fetch attendance data');
      }

      setRecords(recordsRes.records || []);
      setTotalEmployeesCount(recordsRes.totalEmployees || recordsRes.records?.length || 0);
      if (summaryRes.success && summaryRes.summary) {
        setSummary(summaryRes.summary);
      }
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err?.message || 'An error occurred while loading attendance records.');
    } finally {
      setLoading(false);
    }
  }, [currentUser, currentPage, rowsPerPage, sortField, sortOrder, search, departmentFilter, workModeFilter, selectedSummaryFilter]);

  useEffect(() => {
    if (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'HR') {
      fetchData();
    }
  }, [fetchData, currentUser.role]);

  // Auto refresh interval (60s)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchData();
    }, 60000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  // Fetch Audit History for Selected Record
  const fetchAuditHistory = async (attendanceId: string) => {
    setAuditLoading(true);
    try {
      const res = await fetch(`/api/admin/attendance/${attendanceId}/audit-history`, {
        headers: {
          'x-user-mock': JSON.stringify(currentUser)
        }
      });
      const data = await res.json();
      if (data.success && data.logs) {
        setAuditLogs(data.logs);
      }
    } catch {
      // Fallback
    } finally {
      setAuditLoading(false);
    }
  };

  // Handle Action Menu Selection
  const handleSelectAction = (action: ActionType, record: Attendance) => {
    setSelectedRecord(record);
    switch (action) {
      case 'VIEW_DETAILS':
        setIsDrawerOpen(true);
        break;
      case 'EDIT_ATTENDANCE':
        setIsEditModalOpen(true);
        break;
      case 'ADD_MISSING_CLOCK_OUT':
        setIsMissingClockOutModalOpen(true);
        break;
      case 'CHANGE_WORK_MODE':
        setIsWorkModeModalOpen(true);
        break;
      case 'MARK_LEAVE':
        setIsMarkLeaveModalOpen(true);
        break;
      case 'VIEW_AUDIT_HISTORY':
        fetchAuditHistory(record.id);
        setIsAuditDrawerOpen(true);
        break;
      default:
        break;
    }
  };

  // Handle Sort Change
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Summary Card Click Handler
  const handleSummaryCardClick = (filterCode: string) => {
    if (selectedSummaryFilter === filterCode) {
      setSelectedSummaryFilter(null);
    } else {
      setSelectedSummaryFilter(filterCode);
    }
    setCurrentPage(1);
  };

  // Reset Filters
  const handleClearFilters = () => {
    setSearch('');
    setDepartmentFilter('ALL');
    setWorkModeFilter('ALL');
    setSelectedSummaryFilter(null);
    setCurrentPage(1);
  };

  // Execute API PATCH update
  const executeAttendanceUpdate = async (
    action: string,
    changes: Record<string, any>,
    reason: string
  ) => {
    if (!selectedRecord) return;

    const response = await fetch(`/api/admin/attendance/${selectedRecord.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-user-mock': JSON.stringify(currentUser)
      },
      body: JSON.stringify({
        action,
        changes,
        reason
      })
    });

    const resData = await response.json();
    if (!response.ok || !resData.success) {
      throw new Error(resData.message || 'Failed to update attendance record.');
    }

    // Refresh records & summary counts
    await fetchData();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 flex flex-col gap-6">
      {/* Dev Mock Role Selector */}
      <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Developer Role Preview:
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { role: 'SUPER_ADMIN', name: 'Super Admin' },
            { role: 'HR', name: 'HR Admin' },
            { role: 'MANAGER', name: 'Manager' },
            { role: 'TEAM_LEADER', name: 'Team Leader' },
            { role: 'EMPLOYEE', name: 'Employee' }
          ].map((item) => (
            <button
              key={item.role}
              onClick={() =>
                setCurrentUser((prev) => ({
                  ...prev,
                  role: item.role as UserRole,
                  name: `${item.name} User`
                }))
              }
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                currentUser.role === item.role
                  ? 'bg-indigo-600 border-indigo-500 text-slate-100 shadow-md shadow-indigo-500/20'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <PermissionGuard user={currentUser}>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
              Today’s Attendance
            </h1>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
              <span>Date: {new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}</span>
              <span className="text-slate-600">•</span>
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </p>
          </div>

          <div className="flex items-center gap-3.5">
            <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              Auto-refresh (60s)
            </label>
            <button
              onClick={fetchData}
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              title="Force Refresh Data"
            >
              <svg
                className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* 8 Organization Attendance Summary Cards (4 and 4 stack) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Total Employees"
            count={summary.totalEmployees}
            subtitle="Active employees"
            accentColor="slate"
            active={selectedSummaryFilter === 'ALL'}
            onClick={() => handleSummaryCardClick('ALL')}
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
          />
          <SummaryCard
            title="Clocked In"
            count={summary.clockedIn}
            subtitle="Currently working"
            accentColor="emerald"
            active={selectedSummaryFilter === 'CLOCKED_IN'}
            onClick={() => handleSummaryCardClick('CLOCKED_IN')}
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-2-2m2 2l2-2m-2 2v-7m0 11a9 9 0 110-18 9 9 0 010 18z" /></svg>}
          />
          <SummaryCard
            title="Clocked Out"
            count={summary.clockedOut}
            subtitle="Completed attendance"
            accentColor="indigo"
            active={selectedSummaryFilter === 'CLOCKED_OUT'}
            onClick={() => handleSummaryCardClick('CLOCKED_OUT')}
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" /></svg>}
          />
          <SummaryCard
            title="Not Clocked In"
            count={summary.notClockedIn}
            subtitle="No attendance recorded"
            accentColor="slate"
            active={selectedSummaryFilter === 'NOT_CLOCKED_IN'}
            onClick={() => handleSummaryCardClick('NOT_CLOCKED_IN')}
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>}
          />
          <SummaryCard
            title="Office"
            count={summary.workingFromOffice}
            subtitle="Working from office"
            accentColor="cyan"
            active={selectedSummaryFilter === 'OFFICE_MODE'}
            onClick={() => handleSummaryCardClick('OFFICE_MODE')}
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
          />
          <SummaryCard
            title="WFH"
            count={summary.workingFromHome}
            subtitle="Working remotely"
            accentColor="purple"
            active={selectedSummaryFilter === 'WFH_MODE'}
            onClick={() => handleSummaryCardClick('WFH_MODE')}
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
          />
          <SummaryCard
            title="On Leave"
            count={summary.onLeave}
            subtitle="Approved leave today"
            accentColor="violet"
            active={selectedSummaryFilter === 'ON_LEAVE'}
            onClick={() => handleSummaryCardClick('ON_LEAVE')}
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          />
          <SummaryCard
            title="Missing Clock Out"
            count={summary.missingClockOut}
            subtitle="Requires HR review"
            accentColor="rose"
            active={selectedSummaryFilter === 'MISSING_CLOCK_OUT'}
            onClick={() => handleSummaryCardClick('MISSING_CLOCK_OUT')}
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
          />
        </div>

        {/* Search Toolbar & Filters */}
        <SearchToolbar
          search={search}
          onSearchChange={(newSearch) => {
            setSearch(newSearch);
            setCurrentPage(1);
          }}
          department={departmentFilter}
          onDepartmentChange={(dept) => {
            setDepartmentFilter(dept);
            setCurrentPage(1);
          }}
          workMode={workModeFilter}
          onWorkModeChange={(mode) => {
            setWorkModeFilter(mode);
            setCurrentPage(1);
          }}
          onResetFilters={handleClearFilters}
          departments={mockDepartments}
          filteredCount={records.length}
          totalCount={totalEmployeesCount}
          onRefresh={fetchData}
          isLoading={loading}
        />

        {/* Clear Filter Indicator */}
        {(selectedSummaryFilter || search || departmentFilter !== 'ALL' || workModeFilter !== 'ALL') && (
          <div className="flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl text-xs text-indigo-300">
            <span>
              Active Filter:{' '}
              <strong className="font-semibold text-indigo-200">
                {selectedSummaryFilter ? `Card (${selectedSummaryFilter})` : ''}
                {selectedSummaryFilter && search ? ' + ' : ''}
                {search ? `Search ("${search}")` : ''}
                {departmentFilter !== 'ALL' ? ` + Dept (${departmentFilter})` : ''}
                {workModeFilter !== 'ALL' ? ` + Mode (${workModeFilter})` : ''}
              </strong>
            </span>
            <button
              onClick={handleClearFilters}
              className="text-indigo-400 hover:text-indigo-200 font-bold cursor-pointer underline"
            >
              Clear Filters
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-2xl">
            {error}
          </div>
        )}

        {/* Main Attendance Table */}
        {loading && records.length === 0 ? (
          <SkeletonLoader />
        ) : (
          <AttendanceTable
            records={records}
            onViewDetails={(rec) => handleSelectAction('VIEW_DETAILS', rec)}
            onSelectAction={handleSelectAction}
            onSort={handleSort}
            sortField={sortField}
            sortOrder={sortOrder}
            selectedId={selectedRecord ? selectedRecord.id : null}
            user={currentUser}
            onResetFilters={handleClearFilters}
          />
        )}

        {/* Modals & Drawers */}
        <EmployeeDetailsDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          record={selectedRecord}
          auditLogs={auditLogs}
          user={currentUser}
          onEdit={() => {
            setIsDrawerOpen(false);
            setIsEditModalOpen(true);
          }}
        />

        <EditAttendanceModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          record={selectedRecord}
          onSave={async (updatedFields, changeReason) => {
            await executeAttendanceUpdate('EDIT_ATTENDANCE', updatedFields, changeReason);
          }}
        />

        <AddMissingClockOutModal
          isOpen={isMissingClockOutModalOpen}
          onClose={() => setIsMissingClockOutModalOpen(false)}
          record={selectedRecord}
          onSave={async (clockOutIso, reason) => {
            await executeAttendanceUpdate(
              'ADD_MISSING_CLOCK_OUT',
              { clockOutAt: clockOutIso },
              reason
            );
          }}
        />

        <ChangeWorkModeModal
          isOpen={isWorkModeModalOpen}
          onClose={() => setIsWorkModeModalOpen(false)}
          record={selectedRecord}
          onSave={async (newWorkMode, reason) => {
            await executeAttendanceUpdate('CHANGE_WORK_MODE', { workMode: newWorkMode }, reason);
          }}
        />

        <MarkLeaveModal
          isOpen={isMarkLeaveModalOpen}
          onClose={() => setIsMarkLeaveModalOpen(false)}
          record={selectedRecord}
          onSave={async (reason) => {
            await executeAttendanceUpdate('MARK_LEAVE', {}, reason);
          }}
        />

        <AuditHistoryDrawer
          isOpen={isAuditDrawerOpen}
          onClose={() => setIsAuditDrawerOpen(false)}
          record={selectedRecord}
          logs={auditLogs}
          loading={auditLoading}
        />
      </PermissionGuard>
    </div>
  );
}
