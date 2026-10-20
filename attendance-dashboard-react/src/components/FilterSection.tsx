import React from 'react';
import { FilterState, AttendanceStatus } from '../types/attendance';

interface FilterSectionProps {
  filters: FilterState;
  onChange: (filters: Partial<FilterState>) => void;
  departments: string[];
  locations: { id: string; name: string }[];
  onReset: () => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  onChange,
  departments,
  locations,
  onReset
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 mb-6 shadow-lg backdrop-blur-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Search */}
        <div className="flex flex-col gap-1.5 col-span-1 sm:col-span-2 lg:col-span-1">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Search Employee
          </label>
          <div className="relative">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleInputChange}
              placeholder="Name or EMP ID..."
              className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 placeholder-slate-500 rounded-xl py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <svg
              className="absolute left-3 top-2.5 w-4 h-4 text-slate-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Department */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Department
          </label>
          <select
            name="department"
            value={filters.department}
            onChange={handleInputChange}
            className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            <option value="ALL">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Office Location
          </label>
          <select
            name="officeLocation"
            value={filters.officeLocation}
            onChange={handleInputChange}
            className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            <option value="ALL">All Locations</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Work Mode */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Work Mode
          </label>
          <select
            name="workMode"
            value={filters.workMode}
            onChange={handleInputChange}
            className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            <option value="ALL">All Modes</option>
            <option value="OFFICE">Office</option>
            <option value="WFH">WFH</option>
            <option value="NOT_SELECTED">Not Selected</option>
          </select>
        </div>

        {/* Attendance Status */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Status
          </label>
          <select
            name="status"
            value={filters.status}
            onChange={handleInputChange}
            className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="CLOCKED_IN">Clocked In</option>
            <option value="CLOCKED_OUT">Clocked Out</option>
            <option value="NOT_CLOCKED_IN">Not Clocked In</option>
            <option value="MISSING_CLOCK_OUT">Missing Clock Out</option>
            <option value="ON_LEAVE">On Leave</option>
            <option value="WEEK_OFF">Week Off</option>
            <option value="HOLIDAY">Holiday</option>
          </select>
        </div>

        {/* Date & Reset */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-end col-span-1 lg:col-span-1">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleInputChange}
              className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            />
          </div>
          <button
            onClick={onReset}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl py-2 px-4 border border-slate-700/80 cursor-pointer shadow-md transition-colors h-[38px] flex items-center justify-center"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
export default FilterSection;
