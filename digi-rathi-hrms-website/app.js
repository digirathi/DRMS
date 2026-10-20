const HIST_ICONS = {

  building: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`,

  home: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,

  pencil: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>`,

  clock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,

  refreshCw: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,

  calendarOff: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.2 4.2l15.6 15.6"/><path d="M21 15V6a2 2 0 0 0-2-2H9"/><path d="M3 10h7"/><path d="M3 6v14a2 2 0 0 0 2 2h11"/></svg>`,

  history: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>`,

  checkCircle: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,

  xCircle: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,

  info: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,

  close: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`

};



const appState = {

  role: "Super Admin",

  backendConnected: false,

  backendPermissions: [

    "EMPLOYEE_READ", "EMPLOYEE_CREATE", "EMPLOYEE_UPDATE", "EMPLOYEE_DELETE",

    "ATTENDANCE_READ_SELF", "ATTENDANCE_READ_TEAM", "ATTENDANCE_READ_ALL", "ATTENDANCE_MANUAL_OVERRIDE",

    "LEAVE_APPLY", "LEAVE_READ_TEAM", "LEAVE_READ_ALL", "LEAVE_APPROVE", "LEAVE_APPROVE_ALL",

    "PAYROLL_READ", "PAYROLL_GENERATE", "PAYROLL_FINALIZE",

    "DOCUMENT_READ_SELF", "DOCUMENT_READ_ALL", "DOCUMENT_GENERATE",

    "ASSET_ASSIGN", "REPORT_EXPORT", "SETTINGS_UPDATE", "DEPARTMENT_CREATE", "DEPARTMENT_UPDATE", "DEPARTMENT_ARCHIVE", "DEPARTMENT_DELETE"

  ],

  backendUser: null,

  csrfHeader: null,

  csrfToken: null,

  resetEmail: "",

  resetToken: "",

  resendTimer: null,

  currentEmployee: null,

  theme: window.hrmsPreferences.theme(),

  checkedIn: false,

  wfh: false,

  clockInTime: null,

  lastShiftWorkingTime: null,

  attendanceAudit: [],

  leaveRequests: [],

  onboardingDraft: null,

  workflowAudit: [],

  documentTemplates: [],

  payrollRuns: [],

  companySettings: null,

  companyHolidays: [],

  dashboardFilters: { metric: "Present Rate", period: "Weekly" },

  departmentFilters: { search: "", status: "All", parent: "All", head: "All" },

  departments: [],

  activeView: "dashboard",

  sidebarReturnFocus: null,

  clockTimer: null,

  attendanceLatePolicy: {
    deductionsEnabled: false,

    gracePeriodMins: 30,

    requiredWorkingHours: 9,

    lateDaysThreshold: 4,

    penaltyAction: "Full Day"

  },

  officeSettings: { requireGps: false, requireIp: false, lat: 28.6139, lng: 77.2090, ips: [], radiusMeters: 150, maxAccuracyMeters: 100 },

  attendanceHistory: []

};



const employees = [

  { backendId: 1, id: "DR-001", name: "Demo Person 23", dept: "Management", designation: "CEO", role: "Super Admin", manager: "-", status: "Active", attendance: "Office", shift: "09:00 AM - 06:00 PM", checkInTime: "08:50 AM", lateDays: 4 },

  { backendId: 2, id: "DR-002", name: "Demo Person 01", dept: "Engineering", designation: "Software Engineer", role: "Employee", manager: "Demo Person 23 (DR-001)", status: "Active", attendance: "WFH", shift: "09:00 AM - 06:00 PM", checkInTime: "08:45 AM", lateDays: 1 },

  { backendId: 3, id: "DR-003", name: "Demo Person 02", dept: "HR", designation: "HR Manager", role: "HR Admin", manager: "Demo Person 23 (DR-001)", status: "Active", attendance: "Late", shift: "09:00 AM - 06:00 PM", checkInTime: "09:45 AM", lateDays: 5 },

  { backendId: 4, id: "DR-004", name: "Demo Person 03", dept: "Engineering", designation: "Frontend Developer", role: "Employee", manager: "Demo Person 01 (DR-002)", status: "Active", attendance: "Not Started", shift: "10:00 AM - 07:00 PM", checkInTime: null, checkOutTime: null, lateDays: 0 },

  { backendId: 5, id: "DR-005", name: "Demo Person 22", dept: "HR", designation: "HR Executive", role: "Employee", manager: "Demo Person 02 (DR-003)", status: "Active", attendance: "Not Started", shift: "09:00 AM - 06:00 PM", checkInTime: null, lateDays: 0 }

];



const notifications = [];



const leaveBalances = [

  ["Casual Leave", "8 days / year"],

  ["Privilege Leave", "10 days / year"],

  ["Sick Leave", "8 days / year"],

  ["Birthday Leave", "1 day / year"],

  ["LWP", "Up to 365 days"]

];



const tickets = [];



const assets = [];



const documents = [];



const reports = [

  ["Attendance Report", "Daily, monthly, late arrivals, WFH, overtime", "PDF / Excel / CSV"],

  ["Leave Report", "Balances, history, trends, approvals", "PDF / Excel / CSV"],

  ["Payroll Report", "Salary register, deductions, department summary", "PDF / Excel / CSV"],

  ["Employee Report", "Directory, joining, exit, assets, reviews", "PDF / Excel / CSV"],

  ["Help Desk Report", "Open tickets, resolution time, category trends", "PDF / Excel / CSV"]

];



const roleDashboards = {

  "Super Admin": {

    title: "Good morning, Demo Person 23",

    summary: ["Total Employees", "Present Today", "Pending Leaves", "Payroll Status", "Late Today", "Absent Today", "WFH Today", "In Office Today"],

    actions: ["Employee Onboard", "Create Department", "Generate Payroll", "Employee Directory", "Holiday List", "View Reports"]

  },

  "HR Admin": {

    title: "HR operations",

    summary: ["Total Employees", "Present Today", "Pending Leaves", "Payroll Status", "Late Today", "Absent Today", "WFH Today", "In Office Today"],

    actions: ["Employee Onboard", "Create Department", "Generate Payroll", "Employee Directory", "Holiday List", "View Reports", "Apply Leave"]

  },

  "Employee": {

    title: "Your workday dashboard",

    summary: [],

    actions: ["Clock In / Clock Out", "Leave Apply", "Salary Slip", "Holiday List", "My Settings", "Raise Ticket"]

  }

};



const pageTitles = {

  dashboard: "Dashboard",

  employees: "Employees",

  attendance: "Attendance",

  leave: "Leave",

  payroll: "Payroll",

  directory: "Directory",

  assets: "Assets",

  performance: "Performance",

  tickets: "Help Desk",

  reports: "Reports",

  settings: "Settings"

};



const $ = (selector) => document.querySelector(selector);



function actionButton(label, onclickAttr, isDanger = false) {

  if (!label) return "";

  return `<button class="${isDanger ? "text-button danger-text" : "text-button"}" onclick="${onclickAttr}">${label}</button>`;

}



function actionsCell(buttonsArray) {

  const filtered = (buttonsArray || []).filter(Boolean);

  if (!filtered.length) return "";

  return `<div class="table-actions">${filtered.join("")}</div>`;

}



// Resolve employee identities without trusting display names or request-supplied roles.
function administrativeEmployee(value) {
  const ids = typeof value === 'object' && value ? [value.employeeCode,value.employeeId,value.backendId,value.id] : [value];
  return employees.find(p => ids.some(id => id != null && [p.id,p.backendId,p.employeeId].some(key => key != null && String(key) === String(id))));
}
function canAdministerEmployee(value) {
  return HRDomain.canAdminister(appState.role,currentUser().id,administrativeEmployee(value));
}
function requireEmployeeAdministration(value) {
  if(canAdministerEmployee(value))return true;
  showToast('Only Super Admin can manage HR Admin and Super Admin records. Submit a request for your own leave or attendance.','danger');return false;
}
function isOwnEmployeeRecord(value) {return administrativeEmployee(value)?.id === currentUser().id;}

function currentUser() {

  if (!appState.backendUser) return { id: "-", name: "Signed out", initials: "--", department: "-" };

  const employee = appState.currentEmployee || employees.find(item => String(item.backendId) === String(appState.backendUser.employeeId) || item.id === appState.backendUser.employeeCode);

  const emailName = (appState.backendUser.email || "User").split("@")[0].replace(/[._-]+/g, " ")

    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  const name = appState.backendUser.displayName || employee?.name || employee?.fullName || emailName;

  return {

    id: appState.backendUser.employeeCode || employee?.employeeId || employee?.id || `USR-${appState.backendUser.userId}`,

    name,

    initials: name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(),

    department: employee?.dept || employee?.department || "Digi Rathi"

  };

}



function canAccess(view) {
  if (["documents","performance"].includes(view)) return false;
  if (["directory","settings"].includes(view)) return Boolean(appState.backendUser);
  if (view==='payroll' && HRDomain.accessRole(appState.role)==='Employee') return Boolean(appState.backendUser);

  if (!appState.backendPermissions) return false;

  const requirements = {

    dashboard: [], employees: ["EMPLOYEE_READ"], attendance: ["ATTENDANCE_READ_SELF", "ATTENDANCE_READ_TEAM", "ATTENDANCE_READ_ALL"],

    leave: ["LEAVE_APPLY", "LEAVE_READ_TEAM", "LEAVE_READ_ALL"], payroll: ["PAYROLL_READ"],

    documents: ["DOCUMENT_READ_SELF", "DOCUMENT_READ_ALL"], assets: ["ASSET_ASSIGN", "DOCUMENT_READ_SELF"],

    performance: ["EMPLOYEE_READ", "DOCUMENT_READ_SELF"], tickets: ["LEAVE_APPLY"], reports: ["REPORT_EXPORT"],

    settings: ["SETTINGS_UPDATE", "DEPARTMENT_CREATE", "DEPARTMENT_UPDATE"]

  };

  return requirements[view]?.length === 0 || requirements[view]?.some((permission) => hasPermission(permission)) || false;

}



function roleNotifications() {

  return notifications.filter((item) => item.roles.includes(appState.role));

}



function init() {

  document.documentElement.dataset.theme = appState.theme;

  const today = new Date().toISOString().slice(0, 10);

  document.querySelectorAll('input[type="date"]').forEach((input) => { input.min = today; });

  bindEvents();

  closeSidebar();

  updateThemeIcon();

  if (window.location.search.includes("mock=true") || window.location.search.includes("bypass=1") || window.location.hash.includes("preview")) {

    bypassLoginWithMock();

    return;

  }

  if (window.location.protocol === "file:") {

    showLogin(fileProtocolMessage(), true);

    $("#loginButton").disabled = true;

    const mockBtn = $("#mockBypassButton");

    if (mockBtn) mockBtn.disabled = false;

    return;

  }

  connectBackend();

}



function fileProtocolMessage() {

  return "Please open Digi Rathi HRMS using the local server: http://127.0.0.1:4174\nThe HRMS backend should be running at http://127.0.0.1:8080";

}



async function connectBackend() {

  if (isResetPasswordRoute()) {

    showResetPassword();

    return;

  }

  setAuthStatus("Checking your session...");

  try {

    const me = await apiRequest("/api/v1/auth/me", { silentAuth: true });

    if (appState.isMockBypass) return;

    await hydrateAuthenticatedApp(me);

  } catch (error) {

    if (appState.isMockBypass) return;

    showLogin(error.message === "Please login again." ? "Sign in with your official account." : "The HRMS backend is not connected. Use Explore demo to preview the website.", false);

  }

}



async function hydrateAuthenticatedApp(me) {

  appState.backendConnected = true;

  appState.backendPermissions = HRDomain.accessPermissions(me.roles,me.permissions);

  appState.backendUser = me;

  const csrf = await apiRequest("/api/v1/auth/csrf");

  appState.csrfHeader = csrf.headerName;

  appState.csrfToken = csrf.token;

  appState.role = HRDomain.accessRole(me.roles);

  await loadBackendReferenceData(me);

  await loadTodayAttendance();

  document.body.classList.remove("auth-pending");

  document.body.classList.add("authenticated");

  $("#authScreen").hidden = true;

  updateProfile();

  renderAll();

  setView(canAccess(appState.activeView) ? appState.activeView : "dashboard");

  startClockTimer();

}



function humanizeStatus(value) {

  return String(value || "").toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

}



async function loadTodayAttendance() {

  if (!appState.backendPermissions.includes("ATTENDANCE_READ_SELF") || !appState.backendUser.employeeId) return;

  try {

    const attendance = await apiRequest("/api/v1/attendance/today");

    applyAttendanceState(attendance);

  } catch (error) {

    appState.checkedIn = false; appState.wfh = false; appState.clockInTime = null; appState.lastShiftWorkingTime = null;

  }

}



function evaluateHistoryStatus(inTimeStr, outTimeStr, assignedShift = "09:00 AM - 06:00 PM") {

  let shiftStartMinutes = 9 * 60; // default 09:00 AM

  if (assignedShift) {

    const shiftMatch = assignedShift.match(/(\d+):(\d+)\s*(AM|PM)/i);

    if (shiftMatch) {

      let sHour = parseInt(shiftMatch[1]);

      const sMin = parseInt(shiftMatch[2]);

      const sAmpm = shiftMatch[3].toUpperCase();

      if (sAmpm === "PM" && sHour < 12) sHour += 12;

      if (sAmpm === "AM" && sHour === 12) sHour = 0;

      shiftStartMinutes = sHour * 60 + sMin;

    }

  }

  

  const checkInMatch = inTimeStr?.match(/(\d+):(\d+)\s*(AM|PM)/i);

  let statusText = "Completed";

  let statusType = "success";

  

  if (checkInMatch) {

    let checkHour = parseInt(checkInMatch[1]);

    const checkMin = parseInt(checkInMatch[2]);

    const checkAmpm = checkInMatch[3].toUpperCase();

    if (checkAmpm === "PM" && checkHour < 12) checkHour += 12;

    if (checkAmpm === "AM" && checkHour === 12) checkHour = 0;

    const checkMinutes = checkHour * 60 + checkMin;

    

    const policy = appState.attendanceLatePolicy || { gracePeriodMins: 30 };

    if (checkMinutes > shiftStartMinutes + policy.gracePeriodMins) {

      statusText = "Late (Grace Exceeded)";

      statusType = "warning";

    }

  }

  

  if (outTimeStr) {

    const checkInMatch = inTimeStr?.match(/(\d+):(\d+)\s*(AM|PM)/i);

    const checkOutMatch = outTimeStr?.match(/(\d+):(\d+)\s*(AM|PM)/i);

    if (checkInMatch && checkOutMatch) {

      let checkInHour = parseInt(checkInMatch[1]);

      const checkInMin = parseInt(checkInMatch[2]);

      const checkInAmpm = checkInMatch[3].toUpperCase();

      if (checkInAmpm === "PM" && checkInHour < 12) checkInHour += 12;

      if (checkInAmpm === "AM" && checkInHour === 12) checkInHour = 0;

      

      let checkOutHour = parseInt(checkOutMatch[1]);

      const checkOutMin = parseInt(checkOutMatch[2]);

      const checkOutAmpm = checkOutMatch[3].toUpperCase();

      if (checkOutAmpm === "PM" && checkOutHour < 12) checkOutHour += 12;

      if (checkOutAmpm === "AM" && checkOutHour === 12) checkOutHour = 0;

      

      const workMin = (checkOutHour * 60 + checkOutMin) - (checkInHour * 60 + checkInMin);

      const policy = appState.attendanceLatePolicy || { requiredWorkingHours: 9 };

      if (workMin < policy.requiredWorkingHours * 60) {

        statusText = statusText === "Late (Grace Exceeded)" ? "Late & Short Hours" : "Short Hours";

        statusType = "warning";

      }

    }

  }

  

  return badge(statusText, statusType);

}



function recomputeLateDeductions() {

  if (appState.attendanceHistory) {

    appState.attendanceHistory = appState.attendanceHistory.map(row => {

      row[4] = evaluateHistoryStatus(row[2], row[3]);

      return row;

    });

  }

}



// Policy saves are implemented in attendance-policy-ui.js with validation and role checks.

function showAttendanceRulesModal() {

  openWorkflow("attendanceRules");

}



function getEmployeeLateDays(emp) {

  if (emp.id === "DR-001" && appState.attendanceHistory) {

    return appState.attendanceHistory.filter(row => row[4] && (row[4].includes("Late") || row[4].includes("warning"))).length;

  }

  return emp.lateDays || 0;

}



function getOvertimeMinutes(row) {

  const inTimeStr = row[2];

  const outTimeStr = row[3];

  if (!inTimeStr || !outTimeStr) return 0;

  

  const checkInMatch = inTimeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);

  const checkOutMatch = outTimeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);

  if (checkInMatch && checkOutMatch) {

    let checkInHour = parseInt(checkInMatch[1]);

    const checkInMin = parseInt(checkInMatch[2]);

    const checkInAmpm = checkInMatch[3].toUpperCase();

    if (checkInAmpm === "PM" && checkInHour < 12) checkInHour += 12;

    if (checkInAmpm === "AM" && checkInHour === 12) checkInHour = 0;

    

    let checkOutHour = parseInt(checkOutMatch[1]);

    const checkOutMin = parseInt(checkOutMatch[2]);

    const checkOutAmpm = checkOutMatch[3].toUpperCase();

    if (checkOutAmpm === "PM" && checkOutHour < 12) checkOutHour += 12;

    if (checkOutAmpm === "AM" && checkOutHour === 12) checkOutHour = 0;

    

    const workMin = (checkOutHour * 60 + checkOutMin) - (checkInHour * 60 + checkInMin);

    const requiredMin = (appState.attendanceLatePolicy?.requiredWorkingHours || 9) * 60;

    return Math.max(0, workMin - requiredMin);

  }

  return 0;

}



function openPayslipModal(employeeId) {

  const latest = [...appState.payrollRuns].sort((a, b) => b.payrollYear - a.payrollYear || b.payrollMonth - a.payrollMonth)[0];

  const item = latest?.items?.find(i => i.employeeId === employeeId);

  if (!item) {

    showToast("No payslip data found for this employee");

    return;

  }

  

  let modal = document.getElementById("payslipModal");

  if (!modal) {

    modal = document.createElement("dialog");

    modal.id = "payslipModal";

    modal.className = "workflow-modal";

    document.body.appendChild(modal);

  }

  

  modal.innerHTML = `

    <div class="workflow-shell">

      <header class="workflow-header">

        <div>

          <h2>Salary Pay Slip</h2>

          <p>Digi Rathi Internal HRMS - ${String(latest.payrollMonth).padStart(2, "0")}/${latest.payrollYear}</p>

        </div>

        <button class="icon-button" onclick="document.getElementById('payslipModal').close()"><i data-lucide="x"></i></button>

      </header>

      <div class="workflow-step-body" style="padding: 24px;">

        <div style="display: flex; justify-content: space-between; border-bottom: 2px solid var(--line-strong); padding-bottom: 12px; margin-bottom: 16px;">

          <div>

            <h3 style="margin: 0; color: var(--primary);">${escapeHtml(item.employee)}</h3>

            <span class="muted" style="font-size: 0.85rem;">Employee ID: ${escapeHtml(item.employeeId)}</span>

          </div>

          <div style="text-align: right;">

            <strong>Status: ${latest.status}</strong><br/>

            <span class="status success" style="margin-top: 4px; display: inline-block;">Paid</span>

          </div>

        </div>

        

        <div class="grid two-col" style="margin-bottom: 20px;">

          <div>

            <h4 style="margin-bottom: 8px; border-bottom: 1px solid var(--line); padding-bottom: 4px;">Earnings</h4>

            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">

              <span>Basic Salary</span>

              <strong>${moneyDisplay(item.basicSalary)}</strong>

            </div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">

              <span>HRA</span>

              <strong>${moneyDisplay(item.hra)}</strong>

            </div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">

              <span>Special Allowance</span>

              <strong>${moneyDisplay(item.specialAllowance)}</strong>

            </div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">

              <span>Overtime Pay</span>

              <strong>${moneyDisplay(item.overtimePay)}</strong>

            </div>

          </div>

          <div>

            <h4 style="margin-bottom: 8px; border-bottom: 1px solid var(--line); padding-bottom: 4px; color: var(--danger);">Deductions</h4>

            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">

              <span>LWP Deduction</span>

              <strong>${moneyDisplay(item.lwpDeduction || item.lwp)}</strong>

            </div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: var(--accent); font-weight: 500;">

              <span>Late Clock-in Penalty</span>

              <strong>${moneyDisplay(item.lateDeduction || 0)}</strong>

            </div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">

              <span>Manual Deduction</span>

              <strong>${moneyDisplay(item.manualDeduction || item.manual)}</strong>

            </div>

          </div>

        </div>

        

        <div style="display: flex; justify-content: space-between; background: var(--panel-soft); padding: 14px; border-radius: 8px; border: 1px solid var(--line-strong);">

          <div>

            <h4 style="margin: 0;">Gross Earnings: ${moneyDisplay(item.grossSalary || item.gross)}</h4>

          </div>

          <div style="text-align: right;">

            <h3 style="margin: 0; color: var(--success);">Net Pay: ${moneyDisplay(item.netSalary || item.net)}</h3>

          </div>

        </div>

      </div>

      <footer class="workflow-footer" style="padding: 16px 24px; border-top: 1px solid var(--line); display: flex; justify-content: flex-end;">

        <button class="primary-button" onclick="document.getElementById('payslipModal').close()">Close</button>

      </footer>

    </div>

  `;

  

  modal.showModal();

  refreshIcons();

}



function applyAttendanceState(attendance) {

  appState.checkedIn = !!attendance.checkInAt && !attendance.checkOutAt;

  appState.wfh = attendance.mode === "WFH";

  appState.clockInTime = attendance.checkInAt ? Date.parse(attendance.checkInAt) : null;
  appState.clockOutTime = attendance.checkOutAt ? Date.parse(attendance.checkOutAt) : null;
  appState.attendanceDate = attendance.checkInAt ? (window.EmployeeDomain?.companyDate(attendance.checkInAt) || HRDomain.isoDate(attendance.checkInAt)) : (window.EmployeeDomain?.companyDate() || HRDomain.isoDate(new Date()));

  if (attendance.checkInAt && attendance.checkOutAt) {

    const elapsedMinutes = Math.max(0, Math.floor((Date.parse(attendance.checkOutAt) - Date.parse(attendance.checkInAt)) / 60000));

    appState.lastShiftWorkingTime = `${String(Math.floor(elapsedMinutes / 60)).padStart(2, "0")}:${String(elapsedMinutes % 60).padStart(2, "0")}`;

  } else {

    appState.lastShiftWorkingTime = null;

  }

}



function startClockTimer() {

  if (appState.clockTimer) window.clearInterval(appState.clockTimer);

  appState.clockTimer = window.setInterval(() => {

    if (!appState.checkedIn) return;

    document.querySelectorAll("[data-live-working-hours]").forEach((workingHours) => {

      workingHours.textContent = getWorkingTime();

    });

  }, 1000);

}



function showLogin(message, isError = false) {

  if (appState.isMockBypass) return;

  appState.backendConnected = false;

  appState.backendPermissions = null;

  appState.backendUser = null;

  appState.currentEmployee = null;

  appState.csrfHeader = null;

  appState.csrfToken = null;

  document.body.classList.add("auth-pending");

  document.body.classList.remove("authenticated");

  $("#authScreen").hidden = false;

  showAuthView("signin");

  setAuthStatus(message, isError);

  $("#loginButton").disabled = false;

  $("#loginButton span").textContent = "Sign in";

  if ($("#mockBypassButton")) $("#mockBypassButton").disabled = false;

  refreshIcons();

}



function showAuthView(view) {

  document.querySelectorAll("[data-auth-view]").forEach((item) => {

    const active = item.dataset.authView === view;

    item.hidden = !active;

    item.classList.toggle("active", active);

  });

  window.setTimeout(() => document.querySelector(`[data-auth-view="${view}"] input`)?.focus(), 30);

  refreshIcons();

}



function isResetPasswordRoute() {

  return window.location.pathname.replace(/\/$/, "").endsWith("/reset-password")

    || new URLSearchParams(window.location.search).has("token");

}



function showResetPassword() {

  appState.resetToken = new URLSearchParams(window.location.search).get("token") || "";

  document.body.classList.add("auth-pending");

  document.body.classList.remove("authenticated");

  $("#authScreen").hidden = false;

  showAuthView("reset");

  setResetStatus(appState.resetToken ? "" : "This reset link is missing its security token.", !appState.resetToken);

  $("#resetPasswordButton").disabled = !appState.resetToken;

}



function setAuthStatus(message, isError = false) {

  const status = $("#authStatus");

  status.textContent = message;

  status.classList.toggle("error", isError);

}



async function submitLogin(event) {

  event.preventDefault();

  setAuthStatus("Checking credentials...");

  $("#loginButton").disabled = true;

  $("#loginButton span").textContent = "Signing in...";

  const form = new FormData(event.target);

  try {

    const me = await apiRequest("/api/v1/auth/login", {

      method: "POST", silentAuth: true,

      body: JSON.stringify({ email: form.get("email"), password: form.get("password") })

    });

    await hydrateAuthenticatedApp(me);

  } catch (error) {

    $("#loginButton").disabled = false;

    $("#loginButton span").textContent = "Sign in";

    showLogin(error.message === "Please login again." ? "Email or password is incorrect." : error.message, true);

  }

}



window.bypassLoginWithMock = async function bypassLoginWithMock() {

  try {

    appState.isMockBypass = true;

    appState.backendConnected = false;

    appState.backendPermissions = [

      "EMPLOYEE_READ", "EMPLOYEE_CREATE", "EMPLOYEE_UPDATE", "EMPLOYEE_DELETE",

      "ATTENDANCE_READ_SELF", "ATTENDANCE_READ_TEAM", "ATTENDANCE_READ_ALL", "ATTENDANCE_MANUAL_OVERRIDE",

      "LEAVE_APPLY", "LEAVE_READ_TEAM", "LEAVE_READ_ALL", "LEAVE_APPROVE", "LEAVE_APPROVE_ALL",

      "PAYROLL_READ", "PAYROLL_GENERATE", "PAYROLL_FINALIZE",

      "DOCUMENT_READ_SELF", "DOCUMENT_READ_ALL", "DOCUMENT_GENERATE",

      "ASSET_ASSIGN", "REPORT_EXPORT", "SETTINGS_UPDATE", "DEPARTMENT_CREATE", "DEPARTMENT_UPDATE", "DEPARTMENT_ARCHIVE", "DEPARTMENT_DELETE"

    ];

    appState.backendUser = {

      userId: 1,

      employeeId: "DR-001",

      displayName: "Demo Person 23",

      email: "demo01@example.test",

      employeeCode: "DR-001",

      initials: "R",

      roles: ["SUPER_ADMIN"]

    };

    appState.role = "Super Admin";

    if (typeof leaveStore !== "undefined") leaveStore.userRole = "SUPER_ADMIN";

    appState.csrfHeader = "X-CSRF-TOKEN";

    appState.csrfToken = "mock-csrf-token";



    employees.splice(0, employees.length);

    employees.push(

      { backendId: 1, id: "DR-001", name: "Demo Person 23", dept: "Management", designation: "CEO", role: "Super Admin", manager: "-", status: "Active", attendance: "Office", shift: "09:00 AM - 06:00 PM", checkInTime: "08:50 AM", lateDays: 4 },

      { backendId: 2, id: "DR-002", name: "Demo Person 01", dept: "Engineering", designation: "Software Engineer", role: "Employee", manager: "Demo Person 23 (DR-001)", status: "Active", attendance: "WFH", shift: "09:00 AM - 06:00 PM", checkInTime: "08:45 AM", lateDays: 1 },

      { backendId: 3, id: "DR-003", name: "Demo Person 02", dept: "HR", designation: "HR Manager", role: "HR Admin", manager: "Demo Person 23 (DR-001)", status: "Active", attendance: "Late", shift: "09:00 AM - 06:00 PM", checkInTime: "09:45 AM", lateDays: 5 },

      { backendId: 4, id: "DR-004", name: "Demo Person 03", dept: "Engineering", designation: "Frontend Developer", role: "Employee", manager: "Demo Person 01 (DR-002)", status: "Active", attendance: "Not Started", shift: "10:00 AM - 07:00 PM", checkInTime: null, checkOutTime: null, lateDays: 0 },

      { backendId: 5, id: "DR-005", name: "Demo Person 22", dept: "HR", designation: "HR Executive", role: "Employee", manager: "Demo Person 02 (DR-003)", status: "Active", attendance: "Not Started", shift: "09:00 AM - 06:00 PM", checkInTime: null, lateDays: 0 }

    );



    appState.officeSettings = { requireGps: false, requireIp: false, lat: 28.6139, lng: 77.2090, ips: [], radiusMeters: 150, maxAccuracyMeters: 100 };



    // Pre-populate mock attendance history for Demo Person 23 (DR-001)

    appState.attendanceHistory = [

      ["22 Jul 2026", "Office", "08:50 AM", "06:00 PM", evaluateHistoryStatus("08:50 AM", "06:00 PM"), "09:10", actionsCell([actionButton("Details", "scaffoldAction('View session details')")])],

      ["21 Jul 2026", "Office", "09:40 AM", "06:00 PM", evaluateHistoryStatus("09:40 AM", "06:00 PM"), "08:20", actionsCell([actionButton("Details", "scaffoldAction('View session details')")])],

      ["20 Jul 2026", "WFH", "08:45 AM", "06:00 PM", evaluateHistoryStatus("08:45 AM", "06:00 PM"), "09:15", actionsCell([actionButton("Details", "scaffoldAction('View session details')")])],

      ["17 Jul 2026", "Office", "09:35 AM", "06:00 PM", evaluateHistoryStatus("09:35 AM", "06:00 PM"), "08:25", actionsCell([actionButton("Details", "scaffoldAction('View session details')")])],

      ["16 Jul 2026", "Office", "09:45 AM", "05:00 PM", evaluateHistoryStatus("09:45 AM", "05:00 PM"), "07:15", actionsCell([actionButton("Details", "scaffoldAction('View session details')")])],

      ["15 Jul 2026", "Office", "09:50 AM", "06:00 PM", evaluateHistoryStatus("09:50 AM", "06:00 PM"), "08:10", actionsCell([actionButton("Details", "scaffoldAction('View session details')")])]

    ];



    // Pre-populate finalized payroll run

    appState.payrollRuns = [

      {

        id: 1,

        payrollMonth: 7,

        payrollYear: 2026,

        status: "FINALIZED",

        items: [

          { id: 101, employeeId: "DR-001", employee: "Demo Person 23", basicSalary: 32000, hra: 12800, specialAllowance: 7000, overtimePay: 1200, lwpDeduction: 0, lateDeduction: 1067, manualDeduction: 500, grossSalary: 53000, netSalary: 51433 },

          { id: 102, employeeId: "DR-002", employee: "Demo Person 01", basicSalary: 37500, hra: 15000, specialAllowance: 8000, overtimePay: 1450, lwpDeduction: 0, lateDeduction: 0, manualDeduction: 500, grossSalary: 61950, netSalary: 61450 },

          { id: 103, employeeId: "DR-003", employee: "Demo Person 02", basicSalary: 43000, hra: 17200, specialAllowance: 9000, overtimePay: 1700, lwpDeduction: 1800, lateDeduction: 1433, manualDeduction: 500, grossSalary: 70900, netSalary: 67167 },

          { id: 104, employeeId: "DR-004", employee: "Demo Person 03", basicSalary: 48500, hra: 19400, specialAllowance: 10000, overtimePay: 1950, lwpDeduction: 0, lateDeduction: 0, manualDeduction: 500, grossSalary: 79850, netSalary: 79350 }

        ]

      }

    ];



    // Pre-populate company holiday list

    const year = new Date().getFullYear();

    appState.companyHolidays = [

      { date: `${year}-01-26`, name: "Republic Day", type: "National" },

      { date: `${year}-04-14`, name: "Ambedkar Jayanti", type: "National" },

      { date: `${year}-04-22`, name: "Eid ul-Fitr", type: "National" },

      { date: `${year}-05-01`, name: "Labour Day", type: "National" },

      { date: `${year}-08-15`, name: "Independence Day", type: "National" },

      { date: `${year}-08-28`, name: "Raksha Bandhan", type: "Regional" },

      { date: `${year}-10-02`, name: "Gandhi Jayanti", type: "National" },

      { date: `${year}-10-20`, name: "Dussehra", type: "Regional" },

      { date: `${year}-11-01`, name: "Diwali", type: "Regional" },

      { date: `${year}-12-25`, name: "Christmas", type: "National" }

    ];



    // Pre-populate sample leave requests

    appState.leaveRequests = [

      ["Casual Leave", "21 Jul - 22 Jul 2026", "2 day(s)", `<span class="status warning">Pending</span>`, "Demo Person 01", "DR-002"],

      ["Sick Leave", "18 Jul 2026", "1 day(s)", `<span class="status success">Approved</span>`, "Demo Person 02", "DR-003"]

    ];



    appState.departments = [

      { id: 1, name: "Management", code: "MGMT", description: "Executive administration", parent: "None", head: "Demo Person 23", employees: 1, status: "Active", created: "01 Jan 2026" },

      { id: 2, name: "Engineering", code: "ENG", description: "Product development", parent: "Management", head: "Demo Person 01", employees: 2, status: "Active", created: "01 Jan 2026" },

      { id: 3, name: "HR", code: "HRD", description: "Human resources", parent: "Management", head: "Demo Person 02", employees: 2, status: "Active", created: "01 Jan 2026" }

    ];



    document.body.classList.remove("auth-pending");

    document.body.classList.add("authenticated");

    const authScreen = $("#authScreen");

    if (authScreen) authScreen.hidden = true;

    if (window.prepareDemoData) window.prepareDemoData();
    updateProfile();
    renderAll();
    setView("dashboard");
    showToast("Demo workspace opened. Changes are temporary.", "info");

  } catch (err) {

    console.error("Bypass error:", err);

    document.body.classList.remove("auth-pending");

    document.body.classList.add("authenticated");

    const authScreen = $("#authScreen");

    if (authScreen) authScreen.hidden = true;

    renderAll();

    setView("dashboard");

  }

}



function openForgotPassword() {

  const loginEmail = new FormData($("#loginForm")).get("email") || "";

  $("#forgotPasswordForm").elements.email.value = loginEmail;

  setForgotStatus("");

  showAuthView("forgot");

}



async function submitForgotPassword(event) {

  event.preventDefault();

  if (!event.currentTarget.reportValidity()) return;

  const button = $("#sendResetLinkButton");

  const email = new FormData(event.currentTarget).get("email").trim();

  button.disabled = true;

  button.querySelector("span").textContent = "Sending...";

  setForgotStatus("Sending a secure reset link...");

  try {

    await requestPasswordReset(email);

    appState.resetEmail = email;

    showAuthView("sent");

    startResendCountdown();

  } catch (error) {

    const message = error.message === "Failed to fetch"

      ? "The HRMS service is unavailable. Please try again shortly."

      : error.message;

    setForgotStatus(message, true);

  } finally {

    button.disabled = false;

    button.querySelector("span").textContent = "Send Reset Link";

    refreshIcons();

  }

}



async function requestPasswordReset(email) {

  return apiRequest("/api/v1/auth/forgot-password", {

    method: "POST",

    silentAuth: true,

    body: JSON.stringify({ email })

  });

}



function startResendCountdown() {

  if (appState.resendTimer) window.clearInterval(appState.resendTimer);

  let remaining = 60;

  const button = $("#resendResetButton");

  button.disabled = true;

  button.querySelector("span").textContent = `Resend Link in ${remaining}s`;

  appState.resendTimer = window.setInterval(() => {

    remaining--;

    if (remaining <= 0) {

      window.clearInterval(appState.resendTimer);

      appState.resendTimer = null;

      button.disabled = false;

      button.querySelector("span").textContent = "Resend Link";

      return;

    }

    button.querySelector("span").textContent = `Resend Link in ${remaining}s`;

  }, 1000);

}



async function resendPasswordReset() {

  if (!appState.resetEmail) return;

  const button = $("#resendResetButton");

  button.disabled = true;

  button.querySelector("span").textContent = "Sending...";

  try {

    await requestPasswordReset(appState.resetEmail);

    startResendCountdown();

  } catch (error) {

    button.disabled = false;

    button.querySelector("span").textContent = "Try Resend Again";

  }

}



async function submitResetPassword(event) {

  event.preventDefault();

  const formElement = event.currentTarget;

  const form = new FormData(formElement);

  const newPassword = form.get("newPassword");

  const confirmation = form.get("confirmPassword");

  if (!passwordMeetsPolicy(newPassword)) {

    setResetStatus("Use at least 12 characters with uppercase, lowercase, number and special character.", true);

    return;

  }

  if (newPassword !== confirmation) {

    setResetStatus("The passwords do not match.", true);

    return;

  }

  if (!appState.resetToken) {

    setResetStatus("This reset link is invalid. Request a new link.", true);

    return;

  }



  const button = $("#resetPasswordButton");

  button.disabled = true;

  button.querySelector("span").textContent = "Resetting...";

  setResetStatus("Updating your password...");

  try {

    await apiRequest("/api/v1/auth/reset-password", {

      method: "POST",

      silentAuth: true,

      body: JSON.stringify({ token: appState.resetToken, newPassword })

    });

    formElement.reset();

    updatePasswordStrength("");

    appState.resetToken = "";

    window.history.replaceState({}, "", "/");

    showAuthView("changed");

  } catch (error) {

    const message = error.message === "Failed to fetch"

      ? "The HRMS service is unavailable. Please try again shortly."

      : error.message;

    setResetStatus(message, true);

  } finally {

    button.disabled = false;

    button.querySelector("span").textContent = "Reset Password";

    refreshIcons();

  }

}



function passwordMeetsPolicy(password) {

  return password.length >= 12 && /[A-Z]/.test(password) && /[a-z]/.test(password)

    && /\d/.test(password) && /[^A-Za-z0-9]/.test(password);

}



function updatePasswordStrength(password) {

  const checks = [password.length >= 12, /[A-Z]/.test(password), /[a-z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)];

  const passed = checks.filter(Boolean).length;

  const score = !password ? 0 : passed === 5 ? 4 : passed >= 4 ? 3 : passed >= 2 ? 2 : 1;

  const strength = $("#passwordStrength");

  strength.dataset.score = score;

  strength.querySelector("p").textContent = score === 4

    ? "Strong password. All requirements are met."

    : "Use 8+ characters with uppercase, lowercase, number and special character.";

}



function setForgotStatus(message, isError = false) {

  const status = $("#forgotPasswordStatus");

  status.textContent = message;

  status.classList.toggle("error", isError);

}



function setResetStatus(message, isError = false) {

  const status = $("#resetPasswordStatus");

  status.textContent = message;

  status.classList.toggle("error", isError);

}



function returnToSignIn() {

  if (appState.resendTimer) window.clearInterval(appState.resendTimer);

  appState.resendTimer = null;

  appState.resetToken = "";

  window.history.replaceState({}, "", "/");

  $("#forgotPasswordForm").reset();

  $("#resetPasswordForm").reset();

  updatePasswordStrength("");

  showLogin("Sign in with your official account.");

}



async function apiRequest(path, options = {}) {

  if (appState.csrfToken === "mock-csrf-token") {

    if (path.includes("/clock-in")) {

      const mode = options.body ? JSON.parse(options.body).mode : "OFFICE";

      return { checkInAt: new Date().toISOString(), mode };

    }

    if (path.includes("/clock-out")) {

      return { checkInAt: appState.clockInTime ? new Date(appState.clockInTime).toISOString() : null, checkOutAt: new Date().toISOString(), mode: appState.wfh ? 'WFH' : 'OFFICE' };

    }

    if (path.includes("/today")) {

      return { checkInAt: appState.clockInTime ? new Date(appState.clockInTime).toISOString() : null, checkOutAt: appState.clockOutTime ? new Date(appState.clockOutTime).toISOString() : null, mode: appState.wfh ? 'WFH' : 'OFFICE' };

    }

    if (path.includes("/payroll/generate")) {

      return { id: 1, payrollMonth: 7, payrollYear: 2026, status: "DRAFT" };

    }

    if (path.includes("/preview")) {

      return {

        id: 1,

        payrollMonth: 7,

        payrollYear: 2026,

        status: "DRAFT",

        items: [

          { id: 101, employeeId: "DR-001", employee: "Demo Person 23", basicSalary: 32000, hra: 12800, specialAllowance: 7000, overtimePay: 1200, lwpDeduction: 0, lateDeduction: 1067, manualDeduction: 500, grossSalary: 53000, netSalary: 51433 },

          { id: 102, employeeId: "DR-002", employee: "Demo Person 01", basicSalary: 37500, hra: 15000, specialAllowance: 8000, overtimePay: 1450, lwpDeduction: 0, lateDeduction: 0, manualDeduction: 500, grossSalary: 61950, netSalary: 61450 },

          { id: 103, employeeId: "DR-003", employee: "Demo Person 02", basicSalary: 43000, hra: 17200, specialAllowance: 9000, overtimePay: 1700, lwpDeduction: 1800, lateDeduction: 1433, manualDeduction: 500, grossSalary: 70900, netSalary: 67167 },

          { id: 104, employeeId: "DR-004", employee: "Demo Person 03", basicSalary: 48500, hra: 19400, specialAllowance: 10000, overtimePay: 1950, lwpDeduction: 0, lateDeduction: 0, manualDeduction: 500, grossSalary: 79850, netSalary: 79350 }

        ]

      };

    }

    if (path.includes("/finalize")) {

      return {

        id: 1,

        payrollMonth: 7,

        payrollYear: 2026,

        status: "FINALIZED",

        items: [

          { id: 101, employeeId: "DR-001", employee: "Demo Person 23", basicSalary: 32000, hra: 12800, specialAllowance: 7000, overtimePay: 1200, lwpDeduction: 0, lateDeduction: 1067, manualDeduction: 500, grossSalary: 53000, netSalary: 51433 },

          { id: 102, employeeId: "DR-002", employee: "Demo Person 01", basicSalary: 37500, hra: 15000, specialAllowance: 8000, overtimePay: 1450, lwpDeduction: 0, lateDeduction: 0, manualDeduction: 500, grossSalary: 61950, netSalary: 61450 },

          { id: 103, employeeId: "DR-003", employee: "Demo Person 02", basicSalary: 43000, hra: 17200, specialAllowance: 9000, overtimePay: 1700, lwpDeduction: 1800, lateDeduction: 1433, manualDeduction: 500, grossSalary: 70900, netSalary: 67167 },

          { id: 104, employeeId: "DR-004", employee: "Demo Person 03", basicSalary: 48500, hra: 19400, specialAllowance: 10000, overtimePay: 1950, lwpDeduction: 0, lateDeduction: 0, manualDeduction: 500, grossSalary: 79850, netSalary: 79350 }

        ]

      };

    }

    if (path.includes("/payslips")) {

      return { generated: 4 };

    }

    throw new Error("This action is not connected in the demo. No changes were saved.");

  }



  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");
  const { silentAuth, ...requestOptions } = options;

  if (options.body && !(options.body instanceof FormData)) headers.set("Content-Type", "application/json");

  if (appState.csrfHeader && appState.csrfToken) headers.set(appState.csrfHeader, appState.csrfToken);

  let response;

  try {

    response = await fetch(`${window.HRMS_API_BASE || "http://127.0.0.1:8080"}${path}`, {

      ...requestOptions, headers, credentials: "include", signal: options.signal || AbortSignal.timeout(12000)

    });

  } catch (error) {

    throw new Error("The HRMS backend is not connected. Use Explore demo to preview the website.");

  }

  if (response.status === 401) {

    if (!options.silentAuth) showToast("Please login again.");

    throw new Error("Please login again.");

  }

  if (response.status === 403) {

    showToast("You do not have permission to access this action.");

    throw new Error("You do not have permission to access this action.");

  }

  const contentType = response.headers.get("content-type") || "";

  const body = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) throw new Error(body?.message || body?.error?.message || "The request could not be completed.");

  if (response.status !== 204 && !contentType.includes("application/json")) throw new Error("The API returned a webpage instead of data. Check the backend address.");
  return body;

}



function bindEvents() {

  $("#loginForm").addEventListener("submit", submitLogin);

  if ($("#mockBypassButton")) $("#mockBypassButton").addEventListener("click", (e) => { e.preventDefault(); bypassLoginWithMock(); });

  $("#forgotPasswordLink").addEventListener("click", openForgotPassword);

  $("#forgotPasswordForm").addEventListener("submit", submitForgotPassword);

  $("#resendResetButton").addEventListener("click", resendPasswordReset);

  $("#resetPasswordForm").addEventListener("submit", submitResetPassword);

  $("#resetPasswordForm").elements.newPassword.addEventListener("input", (event) => updatePasswordStrength(event.target.value));

  $("#goToSignInButton").addEventListener("click", returnToSignIn);

  document.querySelectorAll("[data-auth-back]").forEach((button) => button.addEventListener("click", returnToSignIn));

  document.querySelectorAll(".nav-item").forEach((button) => {

    button.addEventListener("click", () => setView(button.dataset.view));

  });



  $("#themeToggle").addEventListener("click", toggleTheme);

  $("#authThemeToggle").addEventListener("click", toggleTheme);



  $("#menuToggle").addEventListener("click", toggleSidebar);

  $("#sidebarBackdrop").addEventListener("click", closeSidebar);

  $("#sidebarClose").addEventListener("click", closeSidebar);

  $("#notificationButton").addEventListener("click", toggleNotifications);

  $("#markReadButton").addEventListener("click", markAllNotificationsRead);









  $("#leaveForm").addEventListener("submit", submitLeaveRequest);

  $("#ticketForm").addEventListener("submit", submitTicketRequest);

  document.querySelectorAll("[data-close-dialog]").forEach((button) => {

    button.addEventListener("click", () => $("#" + button.dataset.closeDialog).close());

  });

  document.addEventListener("keydown", handleGlobalKeydown);

  document.addEventListener("click", (event) => {

    const drawer = $("#notificationDrawer");

    if (!drawer.hidden && !drawer.contains(event.target) && !$("#notificationButton").contains(event.target)) closeNotifications();

  });

}



function renderAll() {

  renderNotifications();

  renderDashboard();

  const renderers = {

    employees: renderEmployees,

    attendance: renderAttendance,

    leave: renderLeave,

    payroll: renderPayroll,

    directory: window.renderDirectory || (()=>{}),

    assets: renderAssets,

    

    tickets: renderTickets,

    reports: renderReports,

    settings: renderSettings

  };

  Object.entries(renderers).forEach(([view, renderer]) => {

    if (canAccess(view)) renderer();

    else $("#" + view).replaceChildren();

  });

  applyPermissions();

  refreshClockControls();

  if ($("#dashboard").classList.contains("active")) $("#pageTitle").textContent = roleDashboards[HRDomain.accessRole(appState.role)].title;

  refreshIcons();

}



function setView(view) {

  if (!canAccess(view)) {

    showToast("This module is not available for your role");

    view = "dashboard";

  }

  appState.activeView = view;
  if (view === "dashboard") renderDashboard();

  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === view));

  document.querySelectorAll(".content-view").forEach((section) => section.classList.toggle("active", section.id === view));

  if (view === "dashboard") {

    $("#breadcrumb").textContent = "Dashboard";

    $("#breadcrumb").style.display = "";

    $("#pageTitle").textContent = roleDashboards[appState.role].title;

  } else {

    $("#breadcrumb").style.display = "none";

    $("#pageTitle").textContent = pageTitles[view];

  }

  closeSidebar();
  document.querySelectorAll(".nav-item").forEach(item => item.setAttribute("aria-current", item.dataset.view === view ? "page" : "false"));
  window.scrollTo({top:0, behavior:"instant"});
  if (window.enhanceInterface) window.enhanceInterface();

}



function applyPermissions() {

  document.querySelectorAll(".nav-item").forEach((item) => {

    const allowed = canAccess(item.dataset.view);

    item.hidden = !allowed;

    item.disabled = !allowed;

  });

}



function updateProfile() {

  const user = currentUser();

  $(".profile-avatar").textContent = user.initials;

  $(".sidebar-profile strong").textContent = user.name;

  $("#profileRole").textContent = appState.role;

}



function stat(label, value, type = "", onClick = "") {

  const icons = {

    "Total Employees": "users",

    "Present Today": "user-check",

    "Absent Today": "user-x",

    "On Leave": "calendar-off",

    "Today WFH": "house",

    "Today Late": "clock-alert",

    "Pending Leaves": "calendar-clock",

    "Upcoming Holidays": "calendar-days",

    "WFH Today": "house",

    "In Office Today": "building-2",

    "Late Today": "clock-alert",

    "Late Arrivals": "clock-alert",

    "Pending Leave": "calendar-clock",

    "Pending Corrections": "file-clock",

    "Payroll Status": "wallet-cards",

    "Team Members": "users-round",

    "Pending Reviews": "clipboard-check",

    "Open Tickets": "life-buoy",

    "Team Attendance": "activity",

    "Attendance Status": "badge-check",

    "Working Hours": "timer",

    "Leave Balance": "calendar-range",

    "Salary Slip": "receipt-indian-rupee",

    "Holiday List": "party-popper",

    "Documents": "files",

    "Company Profile": "building-2",

    "Today's Status": "badge-check",

    "Overtime": "timer-reset",

    "Payroll Cycle": "calendar-sync",

    "Gross Salary": "landmark",

    "Deductions": "circle-minus",

    "Status": "circle-check-big"

  };

  const notes = {

    "Total Employees": "Active workforce",

    "Present Today": "Clocked in today",

    "Absent Today": "Not clocked in",

    "On Leave": "Approved today",

    "Today WFH": "Remote today",

    "Today Late": "After the shift grace period",

    "Late Today": "After the shift grace period",

    "WFH Today": "Working remotely",

    "In Office Today": "At office",

    "Pending Leaves": "Awaiting approval",

    "Upcoming Holidays": "Next 30 days",

    "Payroll Status": "Latest payroll run",

    "Attendance Status": "Current status",

    "Working Hours": "Today",

    "Leave Balance": "Available balance",

    "Salary Slip": "Latest cycle",

    "Team Members": "Direct reports",

    "Pending Reviews": "Awaiting action",

    "Open Tickets": "Active requests",

    "Team Attendance": "Today",

    "Today's Status": "Current status",

    "Late Arrivals": "Requires review",

    "Overtime": "This month",

    "Payroll Cycle": "Current cycle",

    "Gross Salary": "Current cycle",

    "Deductions": "Current cycle",

    "Status": "Processing state"

  };

  const clickAttrs = onClick ? `onclick="${onClick}" role="button" tabindex="0" onkeydown="if(event.key==='Enter')${onClick}"` : "";

  return `

    <article class="stat-card ${type}${onClick ? " stat-card--link" : ""}" ${clickAttrs}>

      <div class="stat-head"><span>${label}</span><span class="metric-icon"><i data-lucide="${icons[label] || "activity"}"></i></span></div>

      <strong ${label === "Working Hours" ? "data-live-working-hours" : ""}>${value}</strong>

      <small><i data-lucide="${type === "accent" ? "circle-alert" : "info"}"></i>${notes[label] || "Current value"}</small>

    </article>

  `;

}



function panel(title, subtitle, body, action = "") {

  return `

    <section class="panel">

      <div class="panel-head">

        <div>

          <p class="eyebrow">${subtitle}</p>

          <h2>${title}</h2>

        </div>

        ${action}

      </div>

      ${body}

    </section>

  `;

}



function hasPermission(permission) {

  return HRDomain.accessPermissions(appState.role,appState.backendPermissions||[]).includes(permission);

}



function actionAllowed(action) {

  const checks = {

    "Employee Onboard": () => hasPermission("EMPLOYEE_CREATE"),

    "Create Department": () => hasPermission("DEPARTMENT_CREATE"),

    "Generate Payroll": () => hasPermission("PAYROLL_GENERATE"),

    

    "View Reports": () => hasPermission("REPORT_EXPORT"),

    "Export Team Report": () => hasPermission("REPORT_EXPORT"),

    "Apply Leave": () => hasPermission("LEAVE_APPLY"),

    "Leave Apply": () => hasPermission("LEAVE_APPLY"),

    "Clock In / Clock Out": () => hasPermission("ATTENDANCE_CLOCK"),

    "Salary Slip": () => hasPermission("DOCUMENT_READ_SELF") || hasPermission("DOCUMENT_READ_ALL"),

    "Holiday List": () => hasPermission("LEAVE_APPLY") || hasPermission("LEAVE_READ_TEAM") || hasPermission("LEAVE_READ_ALL"),

    "My Settings": () => hasPermission("DOCUMENT_READ_SELF") || hasPermission("DOCUMENT_READ_ALL"),

    "Raise Ticket": () => hasPermission("LEAVE_APPLY"),

    "View Team": () => hasPermission("EMPLOYEE_READ"),

    "Employee Directory": () => Boolean(appState.backendUser),

    "View Leave Calendar": () => hasPermission("LEAVE_APPLY") || hasPermission("LEAVE_READ_TEAM") || hasPermission("LEAVE_READ_ALL"),

    "Publish Announcement": () => appState.role === "Super Admin" || appState.role === "HR Admin"

  };

  return checks[action]?.() ?? true;

}



function emptyState(module, options = {}) {

  const config = {

    Employees: ["users", "No employees found.", "Add Employee"],

    Departments: ["building-2", "No departments found.", "Create Department"],

    Attendance: ["clock-3", "No attendance records yet.", "Clock in from the top bar."],

    Leave: ["calendar-days", "No leave requests yet.", "Apply Leave"],

    Payroll: ["wallet-cards", "No payroll run yet.", "Generate Payroll"],

    Documents: ["files", "No documents shared yet.", "Generate Document"],

    Assets: ["laptop", "No assets assigned yet.", "Assign Asset"],

    "Help Desk": ["life-buoy", "No tickets yet.", "Create Ticket"],

    Performance: ["clipboard-check", "No reviews yet.", "Create Review"],

    Reports: ["chart-spline", "Choose a report to export.", ""]

  }[module] || ["inbox", "No records to show.", "Records available to this role will appear here."];

  const action = options.action || config[2];

  return `<div class="empty-state ${options.compact ? "compact" : ""}"><i data-lucide="${config[0]}"></i><strong>${config[1]}</strong>${action ? `<span>${action}</span>` : ""}</div>`;

}



function actionButton(label, handler, danger = false) {

  return `<button class="text-button ${danger ? "danger-text" : ""}" onclick="${handler}">${label}</button>`;

}



function actionsCell(actions) {

  const visible = actions.filter(Boolean);

  return visible.length ? `<div class="table-actions">${visible.join("")}</div>` : "";

}



function scaffoldAction(label) {

  showToast(`${label} is not connected yet. No changes were saved.`, "info");

}



function recordWorkflowAudit(action, payload = {}) {

  if (!appState.workflowAudit) appState.workflowAudit = [];

  appState.workflowAudit.unshift({

    type: window.workflowState?.type || "unknown",

    action,

    actor: currentUser().name,

    timestamp: new Date().toISOString(),

    payload

  });

  if (appState.workflowAudit.length > 50) appState.workflowAudit.length = 50;

}



function upcomingHolidays() {

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const source = appState.companyHolidays && appState.companyHolidays.length > 0 ? appState.companyHolidays : [];

  return source

    .map((h) => {

      const d = new Date(h.date + "T00:00:00");

      return { name: h.name, type: h.type, date: d, day: d.getDate(), monthName: monthNames[d.getMonth()] };

    })

    .filter((h) => h.date >= today)

    .sort((a, b) => a.date - b.date)

    .slice(0, 4);

}



function getAttendanceAnalysisData(metric, period) {

  const configurations = {

    "Weekly": {

      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],

      data: {

        "Present Rate": [96, 98, 95, 97, 94, 88, 92],

        "Absent Rate": [4, 2, 5, 3, 6, 12, 8],

        "Late Arrival Rate": [12, 8, 15, 6, 18, 5, 10],

        "Early Arrival Rate": [32, 40, 28, 35, 22, 15, 25],

        "Early Out Rate": [4, 6, 5, 8, 12, 2, 4],

        "Missing Punch Count": [1, 0, 2, 0, 3, 1, 0]

      }

    },

    "Monthly": {

      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],

      data: {

        "Present Rate": [95, 96, 94, 97],

        "Absent Rate": [5, 4, 6, 3],

        "Late Arrival Rate": [10, 12, 14, 8],

        "Early Arrival Rate": [30, 34, 28, 38],

        "Early Out Rate": [6, 8, 5, 7],

        "Missing Punch Count": [4, 2, 5, 3]

      }

    },

    "Last Month": {

      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],

      data: {

        "Present Rate": [94, 95, 93, 96],

        "Absent Rate": [6, 5, 7, 4],

        "Late Arrival Rate": [11, 13, 15, 9],

        "Early Arrival Rate": [29, 32, 27, 36],

        "Early Out Rate": [7, 9, 6, 8],

        "Missing Punch Count": [5, 3, 6, 4]

      }

    },

    "Quarterly": {

      labels: ["Month 1", "Month 2", "Month 3"],

      data: {

        "Present Rate": [95, 96, 95],

        "Absent Rate": [5, 4, 5],

        "Late Arrival Rate": [11, 12, 10],

        "Early Arrival Rate": [31, 33, 35],

        "Early Out Rate": [6, 7, 5],

        "Missing Punch Count": [12, 10, 14]

      }

    },

    "Yearly": {

      labels: ["Q1", "Q2", "Q3", "Q4"],

      data: {

        "Present Rate": [94, 96, 95, 97],

        "Absent Rate": [6, 4, 5, 3],

        "Late Arrival Rate": [12, 10, 11, 8],

        "Early Arrival Rate": [30, 35, 32, 38],

        "Early Out Rate": [7, 5, 6, 4],

        "Missing Punch Count": [45, 38, 50, 32]

      }

    }

  };



  const config = configurations[period] || configurations["Weekly"];

  const values = config.data[metric] || config.data["Present Rate"];

  const isRate = metric.includes("Rate");

  const unit = isRate ? "%" : "";

  

  const total = values.reduce((sum, v) => sum + v, 0);

  const avg = Math.round((total / values.length) * 10) / 10;

  const summary = isRate ? `Average: ${avg}%` : `Total: ${total}`;



  return { labels: config.labels, values, unit, summary };

}



function handleDashboardFilterChange() {

  const metric = document.getElementById("attendanceMetricSelect")?.value || "Present Rate";

  const period = document.getElementById("attendancePeriodSelect")?.value || "Weekly";

  appState.dashboardFilters = { metric, period };

  renderDashboard();

}



function getEmployeeAttendanceStatus(employee) {

  if (!employee.attendance || employee.attendance === "Not Started" || employee.attendance === "On Leave" || employee.attendance === "Inactive") {

    return employee.attendance || "Not Started";

  }

  if (!employee.shift || !employee.checkInTime) {

    return employee.attendance;

  }

  

  // Parse shift start time (e.g. "09:00 AM")

  const shiftStartMatch = employee.shift.match(/(\d+):(\d+)\s*(AM|PM)/i);

  const checkInMatch = employee.checkInTime.match(/(\d+):(\d+)\s*(AM|PM)/i);

  

  if (shiftStartMatch && checkInMatch) {

    let shiftHour = parseInt(shiftStartMatch[1]);

    const shiftMin = parseInt(shiftStartMatch[2]);

    const shiftAmpm = shiftStartMatch[3].toUpperCase();

    if (shiftAmpm === "PM" && shiftHour < 12) shiftHour += 12;

    if (shiftAmpm === "AM" && shiftHour === 12) shiftHour = 0;

    

    let checkHour = parseInt(checkInMatch[1]);

    const checkMin = parseInt(checkInMatch[2]);

    const checkAmpm = checkInMatch[3].toUpperCase();

    if (checkAmpm === "PM" && checkHour < 12) checkHour += 12;

    if (checkAmpm === "AM" && checkHour === 12) checkHour = 0;

    

    const shiftMinutes = shiftHour * 60 + shiftMin;

    const checkMinutes = checkHour * 60 + checkMin;

    

    const graceMins = appState.attendanceLatePolicy?.gracePeriodMins ?? 30;

    if (checkMinutes > shiftMinutes + graceMins) {

      return "Late";

    } else {

      // If checked in before/on time, keep status as WFH or Office (or generic Clocked In)

      return employee.attendance === "Late" ? "Office" : employee.attendance;

    }

  }

  return employee.attendance;

}



function deactivateEmployee(backendId) {
  if (!requireEmployeeAdministration(backendId)) return;
  if (!appState.isMockBypass) { showToast("Employee deactivation is not connected. No changes were saved.", "info"); return; }

  const emp = employees.find((e) => String(e.backendId) === String(backendId));

  if (!emp) return;

  if (!window.confirm(`Are you sure you want to deactivate employee ${emp.name} (${emp.id})?`)) return;

  emp.status = "Inactive";

  recordWorkflowAudit("EMPLOYEE_DEACTIVATED", { employeeId: emp.id, name: emp.name });

  renderEmployees();

  renderDashboard();

  showToast(`Employee ${emp.name} has been deactivated successfully`);

}



function renderDashboard() {

  const dashboard = roleDashboards[HRDomain.accessRole(appState.role)];

  const isPersonal = HRDomain.accessRole(appState.role) === "Employee";

  const latestPayroll = [...appState.payrollRuns].sort((a, b) => b.payrollYear - a.payrollYear || b.payrollMonth - a.payrollMonth)[0];



  // Recalculate late status based on shifts

  employees.forEach((e) => {

    e.attendance = getEmployeeAttendanceStatus(e);

  });



  // Compute real values from in-memory state

  const activeEmployees = employees.filter((e) => e.status === "Active");

  const presentCount = activeEmployees.filter(e => ["Office", "Late", "WFH"].includes(e.attendance)).length;

  const lateCount = activeEmployees.filter((e) => e.attendance === "Late").length;

  const absentCount = activeEmployees.filter((e) => !e.attendance || e.attendance === "Not Started").length;

  const wfhCount = activeEmployees.filter((e) => e.attendance === "WFH").length;

  const officeCount = activeEmployees.filter(e => ["Office", "Late"].includes(e.attendance)).length;

  const pendingLeaves = appState.isMockBypass ? leaveStore.requests.filter(r => ["PENDING_APPROVAL", "CANCELLATION_REQUESTED"].includes(r.status)).length : appState.leaveRequests.filter((r) => Array.isArray(r) ? r[3]?.includes("Pending") : ["Pending", "PENDING_APPROVAL", "CANCELLATION_REQUESTED"].includes(r.status)).length;

  const payrollStatusValue = appState.isMockBypass && window.payrollStore ? `${humanizeStatus(payrollStore.currentRunStatus)} ${payrollStore.selectedMonth}/${payrollStore.selectedYear}` : latestPayroll

    ? `${humanizeStatus(latestPayroll.status)} ${latestPayroll.payrollMonth}/${latestPayroll.payrollYear}`

    : "No run yet";



  const values = {

    "Total Employees": activeEmployees.length,

    "Present Today": `${presentCount} / ${activeEmployees.length}`,

    "Pending Leaves": pendingLeaves > 0 ? pendingLeaves : appState.leaveRequests.length > 0 ? "0" : "-",

    "Payroll Status": payrollStatusValue,

    "Late Today": lateCount > 0 ? lateCount : "0",

    "Absent Today": absentCount > 0 ? absentCount : "0",

    "WFH Today": wfhCount > 0 ? wfhCount : "0",

    "In Office Today": officeCount > 0 ? officeCount : "0",

    "Team Members": employees.length,

    "On Leave": "-",

    "Late Arrivals": "-",

    "Pending Reviews": "-",

    "Open Tickets": tickets.length > 0 ? tickets.length : "-",

    "Team Attendance": "-"

  };

  const actionIcons = {

    "Employee Onboard": "user-plus",

    "Create Department": "building-2",

    "Generate Payroll": "wallet-cards",

    "Employee Directory": "contact-round",

    "View Reports": "chart-spline",

    "Apply Leave": "calendar-plus",

    "Leave Apply": "calendar-plus",

    "Clock In / Clock Out": "timer",

    "Salary Slip": "receipt-indian-rupee",

    "Holiday List": "calendar-days",

    "My Settings": "settings-2",

    "Raise Ticket": "life-buoy",

    "View Team": "users",

    "Employee Directory": "contact-round",

    "View Leave Calendar": "calendar-days",

    "Export Team Report": "download"

  };

  const quickActions = dashboard.actions

    .filter((item) => actionAllowed(item))

    .map((item) => `<button class="quick-action" onclick="handleQuickAction('${item}')"><span><i data-lucide="${actionIcons[item] || "arrow-up-right"}"></i></span><strong>${item}</strong><i data-lucide="chevron-right"></i></button>`)

    .join("");



  if (isPersonal) {

    $("#dashboard").innerHTML = `

      <section class="dashboard-simple">

        <div class="dashboard-simple-head">

          <p class="eyebrow">My Workspace</p>

          <h2>${appState.checkedIn ? `Working ${getWorkingTime()}` : "Ready for today"}</h2>

          <p>Use your attendance card to clock in and clock out.</p>

        </div>

        <div class="quick-actions personal-actions">${quickActions}</div>

      </section>

    `;

    return;

  }



  const metricOptions = [

    "Present Rate", "Absent Rate", "Late Arrival Rate", "Early Arrival Rate", "Early Out Rate", "Missing Punch Count"

  ];

  const periodOptions = [

    "Weekly", "Monthly", "Last Month", "Quarterly", "Yearly"

  ];



  const currentMetric = appState.dashboardFilters?.metric || "Present Rate";

  const currentPeriod = appState.dashboardFilters?.period || "Weekly";



  const chartData = getAttendanceAnalysisData(currentMetric, currentPeriod);

  const chartMax = Math.max(1, ...chartData.values);



  const filtersHtml = `

    <div class="inline-group" style="gap: 8px;">

      <select id="attendanceMetricSelect" class="analysis-select" onchange="handleDashboardFilterChange()">

        ${metricOptions.map((m) => `<option value="${m}" ${m === currentMetric ? "selected" : ""}>${m}</option>`).join("")}

      </select>

      <select id="attendancePeriodSelect" class="analysis-select" onchange="handleDashboardFilterChange()">

        ${periodOptions.map((p) => `<option value="${p}" ${p === currentPeriod ? "selected" : ""}>${p}</option>`).join("")}

      </select>

    </div>

  `;



  const chartBody = `

    <div class="chart-summary" style="margin-bottom: 8px;">

      <div><strong>${chartData.summary}</strong><span style="margin-left: 16px; font-weight: 600; color: var(--muted-text); font-size: 0.9rem;">${currentMetric} (${currentPeriod})</span></div>

    </div>

    <div class="chart-wrapper">

      <div class="chart-grid-lines">

        <div class="grid-line"></div>

        <div class="grid-line"></div>

        <div class="grid-line"></div>

        <div class="grid-line"></div>

      </div>

      <div class="chart" aria-label="Attendance analysis chart">

        ${chartData.labels.map((label, index) => {

          const val = chartData.values[index];

          const height = Math.max(12, Math.round((val / chartMax) * 100));

          return `

            <div class="chart-column">

              <span class="bar-value">${val}${chartData.unit}</span>

              <div class="bar" style="height:${height}%"></div>

              <span class="bar-label">${label}</span>

            </div>

          `;

        }).join("")}

      </div>

    </div>

  `;



  const holidays = upcomingHolidays();

  const holidaysHtml = holidays.length

    ? holidays.map((h) => {

        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        const dayName = dayNames[h.date.getDay()];

        return `<div class="holiday-item"><time><strong>${String(h.day).padStart(2, "0")}</strong><span>${h.monthName}</span></time><div><strong>${h.name}</strong><span class="muted">${dayName}</span></div><i data-lucide="chevron-right"></i></div>`;

      }).join("")

    : `<p class="muted" style="padding:1rem">No upcoming holidays this year.</p>`;



  const row1 = dashboard.summary.slice(0, 4);

  const row2 = dashboard.summary.slice(4, 8);

  const statColor = (item, index) => item === "Absent Today" || item === "Late Today" ? "accent" : index === 0 ? "success" : "";

  const statClick = (item) => item === "Pending Leaves" ? "setView('leave')" : "";



  $("#dashboard").innerHTML = `

    <div class="stats-row" style="margin-bottom:var(--page-gap)">

      ${row1.map((item, index) => stat(item, values[item] ?? "-", statColor(item, index), statClick(item))).join("")}

    </div>

    ${row2.length ? `<div class="stats-row" style="margin-bottom:var(--page-gap)">

      ${row2.map((item) => stat(item, values[item] ?? "-", statColor(item, 99), statClick(item))).join("")}

    </div>` : ""}

    <div class="dashboard-main-grid dashboard-quiet-grid">

      ${panel("Quick actions", "Common admin operations", `<div class="quick-actions">${quickActions || `<span class="muted">No quick actions available for this role.</span>`}</div>`)}

      ${panel("Upcoming holidays", `Company calendar — next ${holidays.length || 0} events`, `<div class="mini-list">${holidaysHtml}</div>`)}

    </div>

    <div class="dashboard-lower-grid" style="grid-template-columns: 1fr;">

      ${panel("Attendance Data Analysis", "Company attendance statistics", chartBody, filtersHtml)}

    </div>

  `;

}



function renderEmployees() {

  const visibleEmployees = employees;

  const canManageEmployees = hasPermission("EMPLOYEE_CREATE") || hasPermission("EMPLOYEE_UPDATE");

  $("#employees").innerHTML = `

    ${panel("Employee Directory", `${visibleEmployees.length} visible employees`, `

      <div class="actions-row">

        <input class="search-bar" placeholder="Search employee, department or role" oninput="filterEmployeeTable(this.value)" />

        ${hasPermission("EMPLOYEE_CREATE") ? `<button class="primary-button" onclick="openWorkflow('onboard')">Add Employee</button>` : ""}

        ${hasPermission("REPORT_EXPORT") ? `<button class="secondary-button" onclick="openWorkflow('report', { reportType: 'EMPLOYEE_REPORT' })">Export Report</button>` : ""}

      </div>

      ${table(["Employee", "Department", "Role", "Manager", "Status", "Attendance", "Actions"], visibleEmployees.map((e) => [

    `<strong>${e.name}</strong><span class="muted">${e.id}</span>`,

    e.dept,

    e.role,

    e.manager,

    badge(e.status, e.status === "Active" ? "success" : "warning"),

    badge(e.attendance, e.attendance === "Clocked In" || e.attendance === "WFH" ? "success" : e.attendance === "Late" ? "warning" : "neutral"),

    actionsCell([

      actionButton("View", `openWorkflow('onboard', { employeeId: '${e.backendId}', viewOnly: true })`),

      hasPermission("EMPLOYEE_UPDATE") && canAdministerEmployee(e) ? actionButton("Edit", `openWorkflow('onboard', { employeeId: '${e.backendId}' })`) : "",

      (hasPermission("EMPLOYEE_DELETE") && canAdministerEmployee(e) && e.status === "Active") ? actionButton("Deactivate", `deactivateEmployee('${e.backendId}')`, true) : ""

    ])

  ]), { module: "Employees", emptyAction: hasPermission("EMPLOYEE_CREATE") ? "Add Employee" : "" })}

    `)}

  `;

}



function renderAttendance() {

  const status = appState.checkedIn ? (appState.wfh ? "WFH Active" : "Office Clocked In") : "Clocked Out";  

  const canReviewTeam = ["Super Admin", "HR Admin"].includes(appState.role);

  const isAdmin = ["Super Admin", "HR Admin"].includes(appState.role);

  const canRequestCorrection = appState.role !== "Super Admin";

  const canViewHistory = Boolean(appState.isMockBypass);

  const attendanceRows = appState.attendanceHistory || [];

  

  // Calculate dynamic late arrivals

  let lateCount = 0;

  if (canReviewTeam) {

    lateCount = employees.filter((e) => e.attendance === "Late").length;

  } else {

    lateCount = window.employeeAttendancePolicySummary?.().lateDays || 0;

  }



  // Calculate dynamic overtime

  let totalOvertimeMins = 0;

  attendanceRows.forEach(row => {

    totalOvertimeMins += getOvertimeMinutes(row);

  });

  const otHrs = Math.floor(totalOvertimeMins / 60);

  const otMins = totalOvertimeMins % 60;

  const overtimeStr = totalOvertimeMins > 0 ? `${otHrs}h ${otMins}m` : "0h";

  

  // Organization summary cards calculation (dynamic)

  const totalEmp = employees.filter(e => e.status === "Active").length;

  const clockedInCount = employees.filter(e => e.attendance === "Office" || e.attendance === "WFH" || e.attendance === "Late").length;

  const clockedOutCount = employees.filter(e => e.checkInTime && e.checkOutTime).length;

  const notClockedInCount = employees.filter(e => (!e.checkInTime || e.attendance === "Not Started") && e.attendance !== "On Leave" && e.attendance !== "Leave").length;

  const officeCount = employees.filter(e => e.attendance === "Office" || e.attendance === "Late").length;

  const wfhCount = employees.filter(e => e.attendance === "WFH").length;

  const leaveCount = employees.filter(e => e.attendance === "On Leave" || e.attendance === "Leave").length;

  const missingClockOutCount = employees.filter(e => e.checkInTime && !e.checkOutTime && e.attendance !== "Not Started" && e.attendance !== "On Leave").length;



  // Calculate Today's Team Attendance for Admin/HR review

  const todayRows = [];

  if (canReviewTeam) {

    employees.forEach(item => {

      let currentCheckIn = item.checkInTime;

      let currentCheckOut = item.checkOutTime || null;

      let currentAttendance = item.attendance;

      

      if (item.id === currentUser().id) {

        if (appState.checkedIn) {

          currentCheckIn = appState.clockInTime ? new Date(appState.clockInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : "08:50 AM";

          currentCheckOut = null;

          currentAttendance = appState.wfh ? "WFH" : "Office";

        } else if (appState.clockInTime && appState.clockOutTime) {

          currentCheckIn = new Date(appState.clockInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

          currentCheckOut = new Date(appState.clockOutTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

          currentAttendance = appState.wfh ? "WFH" : "Office";

        }

      }

      

      const isWfh = currentAttendance === "WFH";

      const isOffice = currentAttendance === "Office" || currentAttendance === "Late";

      const isLeave = currentAttendance === "On Leave" || currentAttendance === "Leave";

      

      const workModeBadge = isLeave ? badge("—", "neutral") : (isWfh ? badge("WFH", "purple") : (isOffice ? badge("OFFICE", "cyan") : badge("—", "neutral")));

      

      let statusText = "NOT CLOCKED IN";

      let statusType = "neutral";

      if (isWfh || isOffice) {

        statusText = "CLOCKED IN";

        statusType = "success";

      }

      if (currentCheckIn && currentCheckOut) {

        statusText = "CLOCKED OUT";

        statusType = "info";

      }

      if (isLeave) {

        statusText = "ON LEAVE";

        statusType = "warning";

      }

      const statusBadge = badge(statusText, statusType);

      

      let verification = "—";

      if (isLeave) {

        verification = "—";

      } else if (isWfh) {

        verification = "Not Required";

      } else if (isOffice) {

        if (item.id === "DR-005") {

          verification = "IP + GPS Verified";

        } else if (item.id === "DR-004") {

          verification = "IP Verified";

        } else if (item.id === "DR-001") {

          verification = "GPS Verified";

        } else {

          verification = "Not Verified";

        }

      }

      

      let hoursStr = "00h 00m";

      if (isLeave) {

        hoursStr = "00h 00m";

        currentCheckIn = null;

        currentCheckOut = null;

      } else if (currentCheckIn) {

        let startMs;

        if (item.id === "DR-001" && appState.clockInTime) {

          startMs = new Date(appState.clockInTime).getTime();

        } else {

          const parts = currentCheckIn.split(" ");

          const [hStr, mStr] = parts[0].split(":");

          let hrs = parseInt(hStr);

          const mins = parseInt(mStr);

          const isPm = parts[1] === "PM";

          if (isPm && hrs < 12) hrs += 12;

          if (!isPm && hrs === 12) hrs = 0;

          const checkInDate = new Date();

          checkInDate.setHours(hrs, mins, 0, 0);

          startMs = checkInDate.getTime();

        }

        

        let endMs = Date.now();

        if (currentCheckOut) {

          if (item.id === "DR-001" && appState.clockOutTime) {

            endMs = new Date(appState.clockOutTime).getTime();

          } else {

            const parts = currentCheckOut.split(" ");

            const [hStr, mStr] = parts[0].split(":");

            let hrs = parseInt(hStr);

            const mins = parseInt(mStr);

            const isPm = parts[1] === "PM";

            if (isPm && hrs < 12) hrs += 12;

            if (!isPm && hrs === 12) hrs = 0;

            const checkOutDate = new Date();

            checkOutDate.setHours(hrs, mins, 0, 0);

            endMs = checkOutDate.getTime();

          }

        }

        const diffMs = Math.max(0, endMs - startMs);

        const diffMins = Math.floor(diffMs / 60000);

        const otHrs = Math.floor(diffMins / 60);

        const otMins = diffMins % 60;

        hoursStr = `${String(otHrs).padStart(2, '0')}h ${String(otMins).padStart(2, '0')}m`;

      }

      

      const actionHtml = `

        <div style="display:inline-flex; gap:8px; align-items:center; justify-content:flex-end;">

          <button class="secondary-button" style="padding: 6px 12px; height: 36px; font-size: 0.85rem; font-weight:600;" onclick="window.openTodayEmployeeDetailModal('${item.id}')">View</button>

          ${canAdministerEmployee(item) ? `

            <div style="position:relative; display:inline-flex; align-items:center;">

              <button type="button" class="secondary-button today-edit-toggle" style="display:inline-flex; align-items:center; justify-content:center; gap:6px; padding: 6px 12px; height: 36px; font-size: 0.85rem; border-radius: 8px; background: var(--primary-soft, rgba(99, 102, 241, 0.1)); color: var(--primary, #4f46e5); border: 1px solid var(--line-strong, rgba(99, 102, 241, 0.3)); font-weight:700; cursor:pointer;" onclick="event.stopPropagation(); window.toggleTodayEditDropdown(this, '${item.id}')">

                <span>Edit</span>

                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>

              </button>

              <div class="today-edit-dropdown">

                <button type="button" class="hist-dd-item" onclick="window.openTodayEditAttendanceModal('${item.id}','EDIT_TIMES')">${HIST_ICONS.pencil} Edit attendance</button>

                <button type="button" class="hist-dd-item" onclick="window.openTodayEditAttendanceModal('${item.id}','ADD_CLOCK_OUT')">${HIST_ICONS.clock} Add missing clock-out</button>

                <button type="button" class="hist-dd-item" onclick="window.openTodayEditAttendanceModal('${item.id}','CHANGE_WORK_MODE')">${HIST_ICONS.refreshCw} Change work mode</button>

                <button type="button" class="hist-dd-item" onclick="window.openTodayEditAttendanceModal('${item.id}','MARK_LEAVE')">${HIST_ICONS.calendarOff} Mark as leave</button>

                <div style="border-top:1px solid var(--line); margin:4px 0;"></div>

                <button type="button" class="hist-dd-item" style="color:var(--muted-text);" onclick="window.openTodayAuditHistoryDrawer('${item.id}')">${HIST_ICONS.history} View audit history</button>

              </div>

            </div>

          ` : ""}

        </div>

      `;

      

      todayRows.push([

        `<strong>${item.name}</strong>`,

        item.id,

        item.dept,

        workModeBadge,

        currentCheckIn || "—",

        currentCheckOut || "—",

        hoursStr,

        statusBadge,

        verification,

        actionHtml

      ]);

    });

  }



  const teamSectionHtml = canReviewTeam ? `

    <div class="grid one-col" style="margin-top:16px">

      ${panel("Today’s Team Attendance", "Real-time employee clock-in status", `

        <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:12px; margin-bottom:12px; background:var(--panel-soft); padding:12px 16px; border-radius:16px; border:1px solid var(--line-strong);">

          <div style="display:flex; flex:1; flex-wrap:wrap; align-items:center; gap:12px; min-width:0;">

            <div style="position:relative; width:100%; max-width:420px;">

              <svg style="position:absolute; left:14px; top:50%; transform:translateY(-50%); width:16px; height:16px; color:var(--muted-text, #6b7280); pointer-events:none;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>

              <input type="search" id="attendanceSearchInput" aria-label="Search employees" placeholder="Search employee by name or ID" style="width:100%; height:44px; padding:0 36px 0 40px; border-radius:12px; font-size:0.875rem; outline:none;" onkeyup="filterTodayAttendanceTable(this.value)" />

            </div>

          </div>

          <div style="font-size:0.85rem; font-weight:600; color:var(--muted);" id="todayAttendanceCount">

            Showing <strong style="color:var(--primary);" id="visibleCount">${todayRows.length}</strong> of <strong>${totalEmp}</strong> employees

          </div>

        </div>

        <div class="table-wrap" style="margin-top:10px; overflow-x: auto;">

          <table id="todayAttendanceTable">

            <thead>

              <tr>

                <th style="min-width: 170px;">Employee</th>

                <th style="min-width: 110px;">Employee ID</th>

                <th style="min-width: 130px;">Department</th>

                <th style="min-width: 110px;">Work Mode</th>

                <th style="min-width: 110px; white-space: nowrap;">Clock In</th>

                <th style="min-width: 110px; white-space: nowrap;">Clock Out</th>

                <th style="min-width: 140px; white-space: nowrap;">Working Hours</th>

                <th style="min-width: 150px; white-space: nowrap;">Status</th>

                <th style="min-width: 140px; white-space: nowrap;">Verification</th>

                <th style="min-width: 170px; text-align: right; white-space: nowrap;">Actions</th>

              </tr>

            </thead>

            <tbody>

              ${todayRows.map(row => `

                <tr style="transition: background-color 0.2s;">

                  <td>${row[0]}</td>

                  <td style="font-family: monospace; font-size:0.85rem;">${row[1]}</td>

                  <td>${row[2]}</td>

                  <td>${row[3]}</td>

                  <td style="font-family: monospace; white-space: nowrap;">${row[4]}</td>

                  <td style="font-family: monospace; white-space: nowrap;">${row[5]}</td>

                  <td style="font-family: monospace; white-space: nowrap;">${row[6]}</td>

                  <td style="white-space: nowrap;">${row[7]}</td>

                  <td style="white-space: nowrap;">${row[8]}</td>

                  <td style="text-align: right; white-space: nowrap; padding: 8px 20px;">${row[9]}</td>

                </tr>

              `).join("")}

            </tbody>

          </table>

          <div id="noAttendanceResults" style="display:none; text-align:center; padding:32px; color:var(--muted); font-size:0.9rem;">

            No employees found matching your search.

          </div>

        </div>

      `)}

    </div>

  ` : "";



  const settingsHtml = window.renderAttendancePolicies?.() || "";

  const cardsHtml = canReviewTeam ? `

    <div class="grid four-col" style="display:grid; grid-template-columns: repeat(4, 1fr); gap:12px;">

      ${stat("Total Employees", totalEmp, "Active employees")}

      ${stat("Clocked In", clockedInCount, "Currently working")}

      ${stat("Clocked Out", clockedOutCount, "Completed attendance")}

      ${stat("Not Clocked In", notClockedInCount, "No attendance recorded")}

      ${stat("Office", officeCount, "Working from office")}

      ${stat("WFH", wfhCount, "Working remotely")}

      ${stat("On Leave", leaveCount, "Approved leave today")}

      ${stat("Missing Clock Out", missingClockOutCount, "Requires HR review")}

    </div>

  ` : `

    <div class="grid stats-grid">

      ${stat("Today's Status", status, appState.checkedIn ? "success" : "")}

      ${stat("Working Hours", getWorkingTime())}

      ${stat(canReviewTeam ? "Late Arrivals" : "Late This Month", lateCount)}

      ${stat("Overtime", overtimeStr)}

    </div>

  `;



  $("#attendance").innerHTML = `

    ${cardsHtml}

    ${settingsHtml}

    ${teamSectionHtml}

    <!-- ATTENDANCE RECORDS -> Attendance History Section -->

    <div class="grid one-col" style="margin-top:16px">

      ${!canViewHistory ? `

        <section class="panel" style="padding:40px 24px; text-align:center;">

          <div style="width:64px; height:64px; border-radius:50%; background:var(--danger-soft); border:1px solid var(--danger); color:var(--danger); display:flex; align-items:center; justify-content:center; margin:0 auto 16px;">

            <i data-lucide="shield-alert" style="width:32px; height:32px;"></i>

          </div>

          <h2 style="font-size:1.25rem; font-weight:700; color:var(--text); margin-bottom:8px;">Access Restricted</h2>

          <p style="font-size:0.9rem; color:var(--muted-text); max-width:480px; margin:0 auto 16px;">

            You do not have permission to view employee attendance history.

          </p>

          <div style="font-size:0.75rem; color:var(--muted-text); border-top:1px solid var(--line); padding-top:16px;">

            Required Authorization: <strong>Super Admin (SUPER_ADMIN)</strong> or <strong>HR (HR)</strong>

          </div>

        </section>

      ` : `

        <section class="panel hist-panel">

          

          <!-- Header Actions Bar -->

          <div class="panel-head" style="margin-bottom:0; padding-bottom:16px;">

            <div>

              <p class="eyebrow" style="display:flex; align-items:center; gap:6px; margin:0 0 2px;">

                <span>ATTENDANCE RECORDS</span>

                <span>•</span>

                <span style="text-transform:none; font-weight:500;" id="historyPeriodLabel"></span>

              </p>

              <h2>Attendance History</h2>

            </div>

            

            <div style="display:flex; flex-wrap:wrap; align-items:center; gap:10px;">

              ${canRequestCorrection ? `

                <button type="button" class="hist-btn-cr" style="background:var(--primary-soft); color:var(--primary); border-color:var(--line-strong);" onclick="window.openEmployeeCorrectionRequestModal()">

                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>

                  Request Correction

                </button>

              ` : ""}

              ${canReviewTeam ? `

                <button type="button" class="hist-btn-cr" onclick="window.openHistoryCorrectionModal()">

                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>

                  Correction Requests (<strong id="pendingCRBadge">${mockHistoryDataset.filter(r => ["PENDING_REVIEW", "MORE_INFO_REQUIRED"].includes(r.correctionStatus)).length}</strong>)

                </button>

                <button type="button" class="hist-btn-mc" onclick="window.openHistoryManualCorrectionModal()">

                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>

                  Manual Correction

                </button>

              ` : ""}

              <button type="button" class="hist-btn-export" onclick="window.exportHistoryReportCSV()">

                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>

                Export Report

              </button>

            </div>

          </div>



          <!-- Date Range Tabs -->

          <div class="hist-box">

            <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px; border-bottom:1px solid var(--line); padding-bottom:12px;">

              <div style="display:flex; align-items:center; gap:6px; background:var(--panel-raised); padding:4px; border-radius:12px; border:1px solid var(--line-strong);">

                <button type="button" id="tab-weekly" class="range-tab-btn active" style="padding:6px 14px; border-radius:8px; font-size:0.75rem; font-weight:700; background:var(--primary); color:#ffffff; border:none; cursor:pointer;" onclick="window.switchHistoryTab('weekly')">Weekly</button>

                <button type="button" id="tab-monthly" class="range-tab-btn" style="padding:6px 14px; border-radius:8px; font-size:0.75rem; font-weight:700; background:transparent; color:var(--muted-text); border:none; cursor:pointer;" onclick="window.switchHistoryTab('monthly')">Monthly</button>

                <button type="button" id="tab-yearly" class="range-tab-btn" style="padding:6px 14px; border-radius:8px; font-size:0.75rem; font-weight:700; background:transparent; color:var(--muted-text); border:none; cursor:pointer;" onclick="window.switchHistoryTab('yearly')">Yearly</button>

                <button type="button" id="tab-custom" class="range-tab-btn" style="padding:6px 14px; border-radius:8px; font-size:0.75rem; font-weight:700; background:transparent; color:var(--muted-text); border:none; cursor:pointer;" onclick="window.switchHistoryTab('custom')">Custom Range</button>

              </div>



              <div style="font-size:0.75rem; font-weight:600; color:var(--text); background:var(--panel-raised); padding:6px 12px; border-radius:8px; border:1px solid var(--line-strong);">

                Active Period: <strong style="color:var(--primary);" id="activePeriodText"></strong>

              </div>

            </div>



            <!-- Tab Navigation Controls -->

            <div id="tabControlsContainer" style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px;"></div>

          </div>



          <!-- Summary Cards Grid (8 Cards - Populated via JS) -->

          <div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">

              <span style="font-size:0.7rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:var(--muted-text);">SELECTED DATE RANGE OVERVIEW</span>

              <button type="button" style="display:inline-flex; align-items:center; gap:4px; font-size:0.75rem; font-weight:600; color:var(--primary); background:none; border:none; cursor:pointer;" onclick="window.clearHistoryCardFilter()">

                Clear Card Filter

                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>

              </button>

            </div>



            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap:10px;" id="historySummaryCardsGrid"></div>

          </div>



          <!-- Filter Toolbar -->

          <div class="hist-box">

            <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px;">

              <div style="position:relative; flex:1; max-width:480px;">

                <svg style="position:absolute; left:12px; top:50%; transform:translateY(-50%); width:16px; height:16px; color:var(--muted-text); pointer-events:none;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>

                <input type="text" id="historySearchInput" placeholder="Search employee by name or ID" class="hist-input-search" onkeyup="window.debounceHistorySearch(this.value)" />

                <button type="button" style="position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; color:var(--muted-text); cursor:pointer; font-size:0.8rem; display:flex; align-items:center; justify-content:center;" onclick="document.getElementById('historySearchInput').value=''; window.filterHistoryTable();">

                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>

                </button>

              </div>



              <div style="display:flex; align-items:center; gap:12px;">

                <span style="font-size:0.75rem; font-weight:600; color:var(--text);" id="historyResultCount"></span>

                <button type="button" class="secondary-button" style="padding:6px 12px; font-size:0.75rem;" onclick="window.resetHistoryFilters()">Reset Filters</button>

              </div>

            </div>



            <!-- Filter Dropdowns Grid -->

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:10px; border-top:1px solid var(--line); padding-top:10px;">

              <div>

                <label style="font-size:0.65rem; font-weight:700; text-transform:uppercase; color:var(--muted-text); display:block; margin-bottom:4px;">Department</label>

                <select id="histDeptFilter" class="hist-select" onchange="window.filterHistoryTable()">

                  <option value="ALL">All Departments</option>

                  <option value="Engineering">Engineering</option>

                  <option value="HR">HR</option>

                  <option value="Accounts">Accounts</option>

                  <option value="Marketing">Marketing</option>

                  <option value="Operations">Operations</option>

                  <option value="Product">Product</option>

                  <option value="Management">Management</option>

                </select>

              </div>

              <div>

                <label style="font-size:0.65rem; font-weight:700; text-transform:uppercase; color:var(--muted-text); display:block; margin-bottom:4px;">Work Mode</label>

                <select id="histWorkModeFilter" class="hist-select" onchange="window.filterHistoryTable()">

                  <option value="ALL">All Work Modes</option>

                  <option value="OFFICE">Office</option>

                  <option value="WFH">WFH</option>

                  <option value="NOT_SELECTED">Not Selected</option>

                </select>

              </div>

              <div>

                <label style="font-size:0.65rem; font-weight:700; text-transform:uppercase; color:var(--muted-text); display:block; margin-bottom:4px;">Attendance Status</label>

                <select id="histStatusFilter" class="hist-select" onchange="window.filterHistoryTable()">

                  <option value="ALL">All Statuses</option>

                  <option value="COMPLETED">Completed</option>

                  <option value="CLOCKED_IN">Clocked In</option>

                  <option value="MISSING_CLOCK_IN">Missing Clock-In</option>

                  <option value="MISSING_CLOCK_OUT">Missing Clock-Out</option>

                  <option value="INCOMPLETE_HOURS">Incomplete Hours</option>

                  <option value="NOT_CLOCKED_IN">Not Clocked In</option>

                  <option value="ON_LEAVE">On Leave</option>

                  <option value="WEEK_OFF">Week Off</option>

                  <option value="HOLIDAY">Holiday</option>

                  <option value="MANUALLY_CORRECTED">Manually Corrected</option>

                </select>

              </div>

              <div>

                <label style="font-size:0.65rem; font-weight:700; text-transform:uppercase; color:var(--muted-text); display:block; margin-bottom:4px;">Correction Status</label>

                <select id="histCorrectionFilter" class="hist-select" onchange="window.filterHistoryTable()">

                  <option value="ALL">All Correction States</option>

                  <option value="NO_REQUEST">No Request</option>

                  <option value="PENDING_REVIEW">Pending Review</option>

                  <option value="MORE_INFO_REQUIRED">More Info Required</option>

                  <option value="APPROVED">Approved</option>

                  <option value="REJECTED">Rejected</option>

                </select>

              </div>

            </div>

          </div>



          <!-- Attendance History Table (Sticky Header, Up/Down + Side Scroll) -->

          <div class="hist-table-wrap">

            <table class="hist-table">

              <thead>

                <tr>

                  <th style="min-width:140px;">Employee</th>

                  <th style="min-width:90px;">Employee ID</th>

                  <th style="min-width:100px;">Department</th>

                  <th style="min-width:90px;">Date</th>

                  <th style="min-width:95px;">Work Mode</th>

                  <th style="min-width:85px;">Clock In</th>

                  <th style="min-width:85px;">Clock Out</th>

                  <th style="min-width:110px; color:var(--primary);">WORKING HOURS</th>

                  <th style="min-width:110px;">Status</th>

                  <th style="min-width:110px;">Verification</th>

                  <th style="min-width:95px;">Correction</th>

                  <th style="min-width:110px;">Last Modified</th>

                  <th style="min-width:110px; text-align:right;">Actions</th>

                </tr>

              </thead>

              <tbody id="historyTableBody">

                <!-- Dynamically populated via JS -->

              </tbody>

            </table>

          </div>



        </section>

      `}

    </div>

  `;



  // Initialise Attendance History section

  setTimeout(() => {

    if (window.setupHistoryStyles) window.setupHistoryStyles();

    if (window.setupHistoryDropdownClose) window.setupHistoryDropdownClose();

    if (window.updateSummaryCards) window.updateSummaryCards();

    if (window.updateNavControls) window.updateNavControls();

    if (window.filterHistoryTable) window.filterHistoryTable();

  }, 0);

}



// ==================== SUPER ADMIN LEAVE MANAGEMENT MODULE ====================



const initialLeaveTypesData = [
  {
    id: "lt-sick",
    name: "Sick Leave",
    shortName: "SL",
    code: "SL",
    description: "This is a default description for the Leave Type. You can customise this.",
    isPaid: true,
    isActive: true,
    displayColor: "#ec4899",
    leavesAllowedPerYear: 8.0,
    annualAllocation: 8.0,
    weekendsBetweenLeave: "NOT_CONSIDERED",
    holidaysBetweenLeave: "NOT_CONSIDERED",
    creditableOnAccrualBasis: false,
    accrualFrequency: "YEARLY",
    accrualAmount: 0,
    allowedUnderProbation: true,
    allowedUnderNoticePeriod: false,
    encashmentEnabled: false,
    encashmentMinBalance: 0,
    encashmentMaxDays: 0,
    carryForwardEnabled: false,
    maximumCarryForward: 0,
    carryForwardExpiryDays: 0,
    maxLeavesAllowedInMonth: 8.00,
    continuousLeavesAllowed: 8,
    negativeLeavesAllowed: true,
    negativeBalanceLimit: -2,
    futureDatedLeavesAllowed: true,
    futureDatedAllowedAfterDays: 0,
    backdatedLeavesAllowed: true,
    backdatedAllowedUpToDays: 15,
    applyLeavesForNextYearTill: ""
  },
  {
    id: "lt-casual",
    name: "Casual Leave",
    shortName: "CL",
    code: "CL",
    description: "Annual lump-sum leave for personal matters and unexpected tasks.",
    isPaid: true,
    isActive: true,
    displayColor: "#6366f1",
    leavesAllowedPerYear: 12.0,
    annualAllocation: 12.0,
    weekendsBetweenLeave: "NOT_CONSIDERED",
    holidaysBetweenLeave: "NOT_CONSIDERED",
    creditableOnAccrualBasis: false,
    accrualFrequency: "YEARLY",
    accrualAmount: 0,
    allowedUnderProbation: true,
    allowedUnderNoticePeriod: false,
    encashmentEnabled: false,
    encashmentMinBalance: 0,
    encashmentMaxDays: 0,
    carryForwardEnabled: true,
    maximumCarryForward: 5,
    carryForwardExpiryDays: 90,
    maxLeavesAllowedInMonth: 3.00,
    continuousLeavesAllowed: 3,
    negativeLeavesAllowed: false,
    negativeBalanceLimit: 0,
    futureDatedLeavesAllowed: true,
    futureDatedAllowedAfterDays: 1,
    backdatedLeavesAllowed: true,
    backdatedAllowedUpToDays: 3,
    applyLeavesForNextYearTill: "31 Dec"
  },
  {
    id: "lt-earned",
    name: "Earned Leave",
    shortName: "EL",
    code: "EL",
    description: "Annual lump-sum privilege leave for planned long vacations.",
    isPaid: true,
    isActive: true,
    displayColor: "#10b981",
    leavesAllowedPerYear: 15.0,
    annualAllocation: 15.0,
    weekendsBetweenLeave: "CONSIDERED",
    holidaysBetweenLeave: "CONSIDERED",
    creditableOnAccrualBasis: false,
    accrualFrequency: "YEARLY",
    accrualAmount: 0,
    allowedUnderProbation: false,
    allowedUnderNoticePeriod: false,
    encashmentEnabled: true,
    encashmentMinBalance: 10,
    encashmentMaxDays: 15,
    carryForwardEnabled: true,
    maximumCarryForward: 30,
    carryForwardExpiryDays: 180,
    maxLeavesAllowedInMonth: 15.00,
    continuousLeavesAllowed: 15,
    negativeLeavesAllowed: false,
    negativeBalanceLimit: 0,
    futureDatedLeavesAllowed: true,
    futureDatedAllowedAfterDays: 7,
    backdatedLeavesAllowed: false,
    backdatedAllowedUpToDays: 0,
    applyLeavesForNextYearTill: "31 Dec"
  },
  {
    id: "lt-unpaid",
    name: "Unpaid Leave / LWP",
    shortName: "LWP",
    code: "LWP",
    description: "Leave without pay when paid quota is exhausted.",
    isPaid: false,
    isActive: true,
    displayColor: "#f59e0b",
    leavesAllowedPerYear: 30.0,
    annualAllocation: 30.0,
    weekendsBetweenLeave: "NOT_CONSIDERED",
    holidaysBetweenLeave: "NOT_CONSIDERED",
    creditableOnAccrualBasis: false,
    accrualFrequency: "MONTHLY",
    accrualAmount: 0,
    allowedUnderProbation: true,
    allowedUnderNoticePeriod: true,
    encashmentEnabled: false,
    encashmentMinBalance: 0,
    encashmentMaxDays: 0,
    carryForwardEnabled: false,
    maximumCarryForward: 0,
    carryForwardExpiryDays: 0,
    maxLeavesAllowedInMonth: 30.00,
    continuousLeavesAllowed: 30,
    negativeLeavesAllowed: true,
    negativeBalanceLimit: -30,
    futureDatedLeavesAllowed: true,
    futureDatedAllowedAfterDays: 2,
    backdatedLeavesAllowed: true,
    backdatedAllowedUpToDays: 5,
    applyLeavesForNextYearTill: ""
  },
  {
    id: "lt-comp-off",
    name: "Compensatory Off",
    shortName: "COMP",
    code: "COMP",
    description: "Credit leave awarded for working on weekends or holidays.",
    isPaid: true,
    isActive: true,
    displayColor: "#8b5cf6",
    leavesAllowedPerYear: 0.0,
    annualAllocation: 0.0,
    weekendsBetweenLeave: "NOT_CONSIDERED",
    holidaysBetweenLeave: "NOT_CONSIDERED",
    creditableOnAccrualBasis: false,
    accrualFrequency: "MONTHLY",
    accrualAmount: 0,
    allowedUnderProbation: true,
    allowedUnderNoticePeriod: true,
    encashmentEnabled: false,
    encashmentMinBalance: 0,
    encashmentMaxDays: 0,
    carryForwardEnabled: false,
    maximumCarryForward: 0,
    carryForwardExpiryDays: 0,
    maxLeavesAllowedInMonth: 5.00,
    continuousLeavesAllowed: 3,
    negativeLeavesAllowed: false,
    negativeBalanceLimit: 0,
    futureDatedLeavesAllowed: true,
    futureDatedAllowedAfterDays: 1,
    backdatedLeavesAllowed: true,
    backdatedAllowedUpToDays: 15,
    applyLeavesForNextYearTill: ""
  },
  {
    id: "lt-maternity",
    name: "Maternity Leave",
    shortName: "ML",
    code: "ML",
    description: "Statutory maternity leave for female employees.",
    isPaid: true,
    isActive: true,
    displayColor: "#06b6d4",
    leavesAllowedPerYear: 180.0,
    annualAllocation: 180.0,
    weekendsBetweenLeave: "CONSIDERED",
    holidaysBetweenLeave: "CONSIDERED",
    creditableOnAccrualBasis: false,
    accrualFrequency: "YEARLY",
    accrualAmount: 180,
    allowedUnderProbation: true,
    allowedUnderNoticePeriod: true,
    encashmentEnabled: false,
    encashmentMinBalance: 0,
    encashmentMaxDays: 0,
    carryForwardEnabled: false,
    maximumCarryForward: 0,
    carryForwardExpiryDays: 0,
    maxLeavesAllowedInMonth: 180.00,
    continuousLeavesAllowed: 180,
    negativeLeavesAllowed: false,
    negativeBalanceLimit: 0,
    futureDatedLeavesAllowed: true,
    futureDatedAllowedAfterDays: 30,
    backdatedLeavesAllowed: false,
    backdatedAllowedUpToDays: 0,
    applyLeavesForNextYearTill: ""
  },
  {
    id: "lt-paternity",
    name: "Paternity Leave",
    shortName: "PL",
    code: "PL",
    description: "Leave for new fathers upon child birth.",
    isPaid: true,
    isActive: true,
    displayColor: "#3b82f6",
    leavesAllowedPerYear: 15.0,
    annualAllocation: 15.0,
    weekendsBetweenLeave: "CONSIDERED",
    holidaysBetweenLeave: "CONSIDERED",
    creditableOnAccrualBasis: false,
    accrualFrequency: "YEARLY",
    accrualAmount: 15,
    allowedUnderProbation: true,
    allowedUnderNoticePeriod: true,
    encashmentEnabled: false,
    encashmentMinBalance: 0,
    encashmentMaxDays: 0,
    carryForwardEnabled: false,
    maximumCarryForward: 0,
    carryForwardExpiryDays: 0,
    maxLeavesAllowedInMonth: 15.00,
    continuousLeavesAllowed: 15,
    negativeLeavesAllowed: false,
    negativeBalanceLimit: 0,
    futureDatedLeavesAllowed: true,
    futureDatedAllowedAfterDays: 15,
    backdatedLeavesAllowed: true,
    backdatedAllowedUpToDays: 7,
    applyLeavesForNextYearTill: ""
  }
];




const initialLeaveRequestsData = [

  { id: "lr-101", employeeId: "EMP001", employeeName: "Demo Person 13", employeeCode: "DR-1001", department: "Engineering", joiningDate: "2024-03-15", leaveTypeId: "lt-casual", leaveTypeName: "Casual Leave", isPaid: true, startDate: "2026-07-28", endDate: "2026-07-28", dayType: "FULL_DAY", totalDays: 1, currentBalance: 7, balanceAfterApp: 6, reason: "Personal errand and family dentist appointment.", handoverPerson: "Demo Person 21 (DR-1004)", handoverNote: "Priya will cover urgent hotfix PR reviews during the afternoon.", emergencyContact: "+91 98765 43210", attachmentName: "Appointment_Slip.pdf", status: "PENDING_APPROVAL", submittedAt: "2026-07-27T10:15:00Z", hasAttendanceConflict: false, hasOverlappingLeave: false },

  { id: "lr-102", employeeId: "EMP002", employeeName: "Demo Person 14", employeeCode: "DR-1002", department: "Product", joiningDate: "2025-01-10", leaveTypeId: "lt-sick", leaveTypeName: "Sick Leave", isPaid: true, startDate: "2026-07-27", endDate: "2026-07-29", dayType: "FULL_DAY", totalDays: 3, currentBalance: 4, balanceAfterApp: 1, reason: "High fever and viral infection recommended rest by physician.", handoverPerson: "Karan Patel (DR-1008)", handoverNote: "Karan is leading the sprint planning meeting.", emergencyContact: "+91 98111 22334", attachmentName: "Doctor_Prescription.pdf", status: "APPROVED", submittedAt: "2026-07-26T08:30:00Z", processedByName: "Demo Person 15", processedByRole: "SUPER_ADMIN", processedAt: "2026-07-26T09:45:00Z", approvalNote: "Approved. Rest well and get healthy soon!", hasAttendanceConflict: false, hasOverlappingLeave: false },

  { id: "lr-103", employeeId: "EMP003", employeeName: "Demo Person 16", employeeCode: "DR-1003", department: "Design", joiningDate: "2026-05-01", leaveTypeId: "lt-earned", leaveTypeName: "Earned Leave", isPaid: true, startDate: "2026-08-05", endDate: "2026-08-10", dayType: "FULL_DAY", totalDays: 6, currentBalance: 0, balanceAfterApp: -6, reason: "Planned vacation trip to Goa.", status: "REJECTED", submittedAt: "2026-07-25T14:20:00Z", processedByName: "Demo Person 15", processedByRole: "SUPER_ADMIN", processedAt: "2026-07-25T16:00:00Z", rejectionReason: "Earned leave is not available during probation period as per company policy.", hasAttendanceConflict: false, hasOverlappingLeave: true },

  { id: "lr-104", employeeId: "EMP004", employeeName: "Demo Person 17", employeeCode: "DR-1004", department: "Engineering", joiningDate: "2023-11-01", leaveTypeId: "lt-casual", leaveTypeName: "Casual Leave", isPaid: true, startDate: "2026-07-30", endDate: "2026-07-30", dayType: "SECOND_HALF", totalDays: 0.5, currentBalance: 8, balanceAfterApp: 7.5, reason: "House relocation and utility technician visit.", status: "MORE_INFORMATION_REQUIRED", submittedAt: "2026-07-26T11:00:00Z", processedByName: "Demo Person 15", processedByRole: "SUPER_ADMIN", processedAt: "2026-07-26T14:10:00Z", moreInfoMessage: "Please specify your designated handover team member for the afternoon deployment.", hasAttendanceConflict: false, hasOverlappingLeave: false },

  { id: "lr-105", employeeId: "EMP005", employeeName: "Demo Person 18", employeeCode: "DR-1005", department: "Human Resources", joiningDate: "2024-06-01", leaveTypeId: "lt-unpaid", leaveTypeName: "Unpaid Leave / LWP", isPaid: false, startDate: "2026-08-01", endDate: "2026-08-03", dayType: "FULL_DAY", totalDays: 3, currentBalance: 15, balanceAfterApp: 12, reason: "Attending higher education exams in hometown.", status: "PENDING_APPROVAL", submittedAt: "2026-07-27T09:00:00Z", hasAttendanceConflict: false, hasOverlappingLeave: false },

  { id: "lr-106", employeeId: "EMP006", employeeName: "Demo Person 19", employeeCode: "DR-1006", department: "Sales", joiningDate: "2025-02-15", leaveTypeId: "lt-comp-off", leaveTypeName: "Compensatory Off", isPaid: true, startDate: "2026-07-29", endDate: "2026-07-29", dayType: "FULL_DAY", totalDays: 1, currentBalance: 2, balanceAfterApp: 1, reason: "Availing comp-off for working client pitch event on Sunday.", status: "CANCELLATION_REQUESTED", cancellationReason: "Client meeting rescheduled to 29th; need to work on this day.", submittedAt: "2026-07-24T10:00:00Z", processedByName: "Demo Person 15", processedByRole: "SUPER_ADMIN", processedAt: "2026-07-24T11:30:00Z", approvalNote: "Approved comp off.", hasAttendanceConflict: false, hasOverlappingLeave: false }

];



const initialLeaveBalancesData = [

  { id: "lb-1", employeeId: "EMP001", employeeName: "Demo Person 13", employeeCode: "DR-1001", department: "Engineering", leaveTypeId: "lt-casual", leaveTypeName: "Casual Leave", openingBalance: 12, refilled: 0, carriedForward: 2, used: 3, pending: 1, manuallyAdjusted: 0, availableBalance: 11, expiringBalance: 1 },

  { id: "lb-2", employeeId: "EMP001", employeeName: "Demo Person 13", employeeCode: "DR-1001", department: "Engineering", leaveTypeId: "lt-sick", leaveTypeName: "Sick Leave", openingBalance: 8, refilled: 0, carriedForward: 0, used: 2, pending: 0, manuallyAdjusted: 1, availableBalance: 7, expiringBalance: 0 },

  { id: "lb-3", employeeId: "EMP002", employeeName: "Demo Person 14", employeeCode: "DR-1002", department: "Product", leaveTypeId: "lt-sick", leaveTypeName: "Sick Leave", openingBalance: 8, refilled: 0, carriedForward: 0, used: 5, pending: 0, manuallyAdjusted: 0, availableBalance: 3, expiringBalance: 0 },

  { id: "lb-4", employeeId: "EMP003", employeeName: "Demo Person 16", employeeCode: "DR-1003", department: "Design", leaveTypeId: "lt-earned", leaveTypeName: "Earned Leave", openingBalance: 15, refilled: 0, carriedForward: 0, used: 0, pending: 0, manuallyAdjusted: 0, availableBalance: 15, expiringBalance: 0 },

  { id: "lb-5", employeeId: "EMP004", employeeName: "Demo Person 17", employeeCode: "DR-1004", department: "Engineering", leaveTypeId: "lt-casual", leaveTypeName: "Casual Leave", openingBalance: 12, refilled: 0, carriedForward: 1, used: 1.5, pending: 0.5, manuallyAdjusted: 0, availableBalance: 11.5, expiringBalance: 0 }

];



const initialHolidaysData = [

  { id: "hol-1", name: "Independence Day", date: "2026-08-15", dayType: "FULL_DAY", description: "National Holiday celebrating Indian Independence", recurringAnnually: true, isActive: true },

  { id: "hol-2", name: "Mahatma Gandhi Jayanti", date: "2026-10-02", dayType: "FULL_DAY", description: "National Holiday commemorating Gandhi Jayanti", recurringAnnually: true, isActive: true },

  { id: "hol-3", name: "Diwali / Deepavali", date: "2026-11-08", dayType: "FULL_DAY", description: "Festival of Lights national holiday", recurringAnnually: false, isActive: true },

  { id: "hol-4", name: "Christmas Day", date: "2026-12-25", dayType: "FULL_DAY", description: "Christmas Celebration", recurringAnnually: true, isActive: true }

];



const initialAuditLogsData = [

  { id: "lal-1", employeeId: "EMP001", employeeName: "Demo Person 13", action: "CREATE_REQUEST", performedBy: "Demo Person 13", userRole: "EMPLOYEE", reason: "Leave request submitted for 2026-07-28", ipAddress: "192.168.1.45", createdAt: "2026-07-27T10:15:00Z" },

  { id: "lal-2", employeeId: "EMP002", employeeName: "Demo Person 14", action: "APPROVE_REQUEST", performedBy: "Demo Person 15", userRole: "SUPER_ADMIN", reason: "Approved sick leave request based on submitted prescription", ipAddress: "10.0.0.12", createdAt: "2026-07-26T09:45:00Z" },

  { id: "lal-3", employeeId: "EMP003", employeeName: "Demo Person 16", action: "REJECT_REQUEST", performedBy: "Demo Person 15", userRole: "SUPER_ADMIN", reason: "Earned leave unavailable during probation period.", ipAddress: "10.0.0.12", createdAt: "2026-07-25T16:00:00Z" }

];



let leaveStore = {

  activeTab: "overview",

  userRole: "SUPER_ADMIN",

  leaveTypes: initialLeaveTypesData,

  requests: initialLeaveRequestsData,

  balances: initialLeaveBalancesData,

  holidays: initialHolidaysData,

  auditLogs: initialAuditLogsData,

  probationSettings: { duration: 3, durationUnit: "MONTHS", notifyBeforeCompletionDays: 15 },

  calendarYear: new Date().getFullYear(),

  calendarMonth: new Date().getMonth() + 1,

  filters: { search: "", department: "ALL", leaveTypeId: "ALL", status: "ALL", isPaid: "ALL", startDate: "", endDate: "" },

  pagination: { page: 1, limit: 10, sort: "submittedAt", order: "desc" },

  activeDrawerReqId: null,

  activeModal: null,

  modalPayload: null

};



window.switchLeaveTab = function(tabId, filterStatus) {

  leaveStore.activeTab = tabId;

  if (filterStatus) {

    leaveStore.filters.status = filterStatus;

  }

  renderLeave();

};



window.changeCalendarMonth = function(delta) {

  leaveStore.calendarMonth += delta;

  if (leaveStore.calendarMonth > 12) { leaveStore.calendarMonth = 1; leaveStore.calendarYear++; }

  if (leaveStore.calendarMonth < 1) { leaveStore.calendarMonth = 12; leaveStore.calendarYear--; }

  renderLeave();

};



window.setLeaveRoleSimulator = function(role) {

  leaveStore.userRole = role;

  renderLeave();

};



window.openLeaveDrawer = function(reqId) {

  leaveStore.activeDrawerReqId = reqId;

  renderLeave();

};



window.closeLeaveDrawer = function() {

  leaveStore.activeDrawerReqId = null;

  renderLeave();

};



window.openLeaveModalDialog = function(modalName, payload) {
  const target = ['adjustBalance','encashBalance'].includes(modalName) ? leaveStore.balances.find(b=>b.id===payload) : leaveStore.requests.find(r=>r.id===payload);
  if(['approve','reject','requestInfo','adjustBalance','encashBalance'].includes(modalName) && !requireEmployeeAdministration(target))return;

  leaveStore.activeModal = modalName;

  leaveStore.modalPayload = payload || null;

  renderLeave();

};



window.closeLeaveModalDialog = function() {

  leaveStore.activeModal = null;

  leaveStore.modalPayload = null;

  renderLeave();

};



window.updateLeaveFilter = function(key, value) {

  leaveStore.filters[key] = value;

  leaveStore.pagination.page = 1;

  renderLeave();

};



window.resetLeaveFilters = function() {

  leaveStore.filters = { search: "", department: "ALL", leaveTypeId: "ALL", status: "ALL", isPaid: "ALL", startDate: "", endDate: "" };

  leaveStore.pagination.page = 1;

  renderLeave();

};



window.changeLeavePage = function(newPage) {

  leaveStore.pagination.page = newPage;

  renderLeave();

};



window.filterAuditLogs = function() {

  const searchTerm = document.getElementById('auditSearchInput')?.value.toLowerCase() || "";

  const actionFilter = document.getElementById('auditActionFilter')?.value || "ALL";

  const tbody = document.querySelector('#auditLogTable tbody');

  if (!tbody) return;

  const filtered = leaveStore.auditLogs.filter(l => 

    (l.employeeName?.toLowerCase().includes(searchTerm) || l.performedBy.toLowerCase().includes(searchTerm) || l.employeeId.toLowerCase().includes(searchTerm)) &&

    (actionFilter === "ALL" || l.action === actionFilter)

  );

  tbody.innerHTML = filtered.map(log => `

    <tr>

      <td style="font-family:monospace; color:var(--primary); font-weight:700;">${log.id}</td>

      <td><strong>${log.performedBy}</strong></td>

      <td style="font-family:monospace; color:var(--warning); font-size:0.75rem;">${log.userRole}</td>

      <td><strong>${log.action}</strong></td>

      <td>${log.employeeName ? `<strong>${log.employeeName}</strong><br><span style="font-family:monospace; font-size:0.72rem; color:var(--muted-text);">${log.employeeId}</span>` : `<span style="font-family:monospace; font-size:0.8rem; color:var(--muted-text);">${log.employeeId}</span>`}</td>

      <td style="color:var(--muted-text); max-width:200px; word-break:break-word;">${log.reason}</td>

      <td style="font-family:monospace; font-size:0.75rem; color:var(--muted-text);">${new Date(log.createdAt).toLocaleString('en-GB')}</td>

    </tr>

  `).join("");

};



window.exportLeaveReportCSV = function() {

  const filtered = filterLeaveRequestsData();

  const headers = ["Request ID", "Employee Name", "Employee Code", "Department", "Leave Type", "Is Paid", "Start Date", "End Date", "Total Days", "Day Type", "Status", "Submitted At", "Processed By", "Reason"];

  const rows = filtered.map(r => [

    `"${r.id}"`, `"${r.employeeName}"`, `"${r.employeeCode}"`, `"${r.department}"`, `"${r.leaveTypeName}"`, `"${r.isPaid ? 'Yes' : 'No'}"`,

    `"${HRDomain.date(r.startDate)}"`, `"${HRDomain.date(r.endDate)}"`, `"${r.totalDays}"`, `"${r.dayType}"`, `"${r.status}"`, `"${HRDomain.date(r.submittedAt)}"`, `"${r.processedByName || 'N/A'}"`, `"${(r.reason || '').replace(/"/g, '""')}"`

  ]);

  const csvStr = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

  const encodedUri = encodeURI(csvStr);

  const link = document.createElement("a");

  link.setAttribute("href", encodedUri);

  link.setAttribute("download", `leave_report_${new Date().toISOString().slice(0, 10)}.csv`);

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  showToast("Filtered leave report exported to CSV.");

};



window.switchActiveUserRole = function(newRole) {
  if (!appState.isMockBypass) return;
  const requestedRole = newRole;
  newRole = HRDomain.accessRole(newRole);
  appState.role = newRole;
  if (newRole === "Super Admin") {
    appState.backendUser = { userId: 1, email: "demo03@example.test", displayName: "Demo Person 23", employeeCode: "DR-001" };
    appState.currentEmployee = employees[0];
    leaveStore.userRole = "SUPER_ADMIN";
  } else if (newRole === "HR Admin") {
    appState.backendUser = { userId: 3, email: "demo04@example.test", displayName: "Demo Person 02", employeeCode: "DR-003" };
    appState.currentEmployee = employees[2];
    leaveStore.userRole = "HR_ADMIN";
  } else if (HRDomain.adminRole(requestedRole) === "MANAGER") {
    appState.backendUser = { userId: 2, email: "demo05@example.test", displayName: "Demo Person 01", employeeCode: "DR-002" };
    appState.currentEmployee = employees[1];
    leaveStore.userRole = "EMPLOYEE";
  } else {
    appState.backendUser = { userId: 4, email: "demo06@example.test", displayName: "Demo Person 03", employeeCode: "DR-004" };
    appState.currentEmployee = employees[3];
    leaveStore.userRole = "EMPLOYEE";
  }

  const selfPermissions = ["ATTENDANCE_READ_SELF", "ATTENDANCE_CLOCK", "LEAVE_APPLY", "DOCUMENT_READ_SELF"];
  const adminPermissions = [...selfPermissions, "EMPLOYEE_READ", "ATTENDANCE_READ_TEAM", "LEAVE_READ_TEAM", "REPORT_EXPORT"];
  appState.backendPermissions = newRole === "Employee" ? selfPermissions : [
    ...adminPermissions, "EMPLOYEE_CREATE", "EMPLOYEE_UPDATE", "EMPLOYEE_DELETE", "ATTENDANCE_READ_ALL", "ATTENDANCE_MANUAL_OVERRIDE", "LEAVE_READ_ALL", "LEAVE_APPROVE", "LEAVE_APPROVE_ALL", "PAYROLL_READ", "PAYROLL_GENERATE", "PAYROLL_FINALIZE", "DOCUMENT_READ_ALL", "DOCUMENT_GENERATE", "ASSET_ASSIGN", "DEPARTMENT_CREATE", "DEPARTMENT_UPDATE", "DEPARTMENT_ARCHIVE", "DEPARTMENT_DELETE", ...(newRole === "Super Admin" ? ["SETTINGS_UPDATE"] : [])
  ];
  appState.checkedIn = false; appState.clockInTime = null; appState.clockOutTime = null;
  const sel = document.getElementById("roleSelect");
  if (sel) sel.value = newRole;

  updateProfile();
  renderAll();
  setView(canAccess(appState.activeView) ? appState.activeView : "dashboard");
  if (appState.activeView === "leave") renderLeave();
  else if (appState.activeView === "attendance") renderAttendance();
  else if (appState.activeView === "employees") renderEmployees();
  refreshIcons();
  showToast(`Switched active profile to ${newRole} (${currentUser().name})`, "info");
};

window.executeLeaveApprove = function(reqId) {
  const req = leaveStore.requests.find(r => r.id === reqId);
  if (!req) return;
  if (!requireEmployeeAdministration(req)) return;

  if (req.status !== "PENDING_APPROVAL" && req.status !== "CANCELLATION_REQUESTED") {
    showToast("HTTP 409 Conflict: This leave request has already been processed by another approver.", "danger");
    return;
  }

  const note = (document.querySelector("#approvalNoteInput")?.value || "").trim();
  const currentProcName = currentUser().name;
  const currentProcRole = appState.role === "Super Admin" ? "SUPER_ADMIN" : "HR_ADMIN";

  if (req.status === "CANCELLATION_REQUESTED") {
    req.status = "CANCELLED";
    req.processedByName = currentProcName;
    req.processedByRole = currentProcRole;
    req.processedAt = new Date().toISOString();
    req.approvalNote = note || "Approved cancellation request.";

    let bal = leaveStore.balances.find(b => b.employeeId === req.employeeId && b.leaveTypeId === req.leaveTypeId);
    if (bal) {
      bal.used = Math.max(0, bal.used - req.totalDays);
      bal.availableBalance += req.totalDays;
    }

    // Reset attendance if on leave
    (appState.attendanceHistory || []).forEach(h => {
      if (h.employeeId === req.employeeCode && h.date >= req.startDate && h.date <= req.endDate) {
        if (h.status === "ON_LEAVE" || h.attendance === "On Leave") {
          h.status = "NOT_CLOCKED_IN";
          h.attendance = "Not Started";
        }
      }
    });

    leaveStore.auditLogs.unshift({
      id: `lal-${Date.now()}`,
      employeeId: req.employeeId,
      employeeName: req.employeeName,
      action: "APPROVE_CANCELLATION",
      performedBy: currentProcName,
      userRole: currentProcRole,
      reason: note || "Approved leave cancellation and restored balance",
      ipAddress: "127.0.0.1",
      createdAt: new Date().toISOString()
    });

    notifications.unshift({
      id: `notif-${Date.now()}`,
      category: "Leave Request",
      message: `Cancellation approved for ${req.leaveTypeName} (${req.startDate}). ${req.totalDays} day(s) restored.`,
      time: "Just now",
      read: false,
      roles: ["Employee", "Super Admin", "HR Admin"]
    });

    window.closeLeaveModalDialog();
    window.closeLeaveDrawer();
    renderLeave();
    renderDashboard();
    refreshIcons();
    showToast(`✓ Approved leave cancellation for ${req.employeeName}. ${req.totalDays} day(s) restored to balance.`, "success");
    return;
  }

  const isFullDay = req.dayType === "FULL_DAY" || !req.dayType;
  if (isFullDay) {
    const target = administrativeEmployee(req);
    const clockRows = [...(appState.attendanceHistory || []), ...(typeof mockHistoryDataset !== 'undefined' ? mockHistoryDataset : [])];
    const hasClockRecord = clockRows.some(h =>
      administrativeEmployee(h)?.id === target?.id &&
      HRDomain.isoDate(h.date) >= req.startDate && HRDomain.isoDate(h.date) <= req.endDate &&
      (HRDomain.time(h.clockIn) !== null || HRDomain.time(h.clockOut) !== null)
    ) || !!target && req.startDate <= (window.EmployeeDomain?.companyDate() || HRDomain.isoDate(new Date())) && req.endDate >= (window.EmployeeDomain?.companyDate() || HRDomain.isoDate(new Date())) &&
      (HRDomain.time(target.checkInTime) !== null || HRDomain.time(target.checkOutTime) !== null);
    if (hasClockRecord) {
      alert("Approval blocked: clock-in/out records already exist for the selected leave dates.");
      return;
    }
  }

  req.status = "APPROVED";
  req.processedByName = currentProcName;
  req.processedByRole = currentProcRole;
  req.processedAt = new Date().toISOString();
  req.approvalNote = note || "Approved leave request.";

  if (isFullDay) {
    (appState.attendanceHistory || []).forEach(h => {
      if (h.employeeId === req.employeeCode && h.date >= req.startDate && h.date <= req.endDate) {
        h.status = "ON_LEAVE";
        h.attendance = "On Leave";
      }
    });
  }

  let bal = leaveStore.balances.find(b => b.employeeId === req.employeeId && b.leaveTypeId === req.leaveTypeId);
  if (!bal) {
    bal = {
      id: `lb-${Date.now()}`, employeeId: req.employeeId, employeeName: req.employeeName, employeeCode: req.employeeCode, department: req.department,
      leaveTypeId: req.leaveTypeId, leaveTypeName: req.leaveTypeName, openingBalance: 0, refilled: 0, carriedForward: 0, used: 0, pending: 0, manuallyAdjusted: 0, availableBalance: 0, expiringBalance: 0
    };
    leaveStore.balances.unshift(bal);
  }
  bal.used += req.totalDays;
  bal.availableBalance = Math.max(0, bal.availableBalance - req.totalDays);

  leaveStore.auditLogs.unshift({
    id: `lal-${Date.now()}`,
    employeeId: req.employeeId,
    employeeName: req.employeeName,
    action: "APPROVE_REQUEST",
    performedBy: currentProcName,
    userRole: currentProcRole,
    reason: note || "Approved leave request",
    ipAddress: "127.0.0.1",
    createdAt: new Date().toISOString()
  });

  notifications.unshift({
    id: `notif-${Date.now()}`,
    category: "Leave Request",
    message: `Leave approved for ${req.employeeName} (${req.leaveTypeName}, ${req.startDate})`,
    time: "Just now",
    read: false,
    roles: ["Employee", "Super Admin", "HR Admin"]
  });

  window.closeLeaveModalDialog();
  window.closeLeaveDrawer();
  renderLeave();
  renderDashboard();
  refreshIcons();
  showToast(`✓ Leave request for ${req.employeeName} (${req.leaveTypeName}) approved successfully. Balance & attendance updated.`, "success");
};

window.executeLeaveReject = function(reqId) {
  const req = leaveStore.requests.find(r => r.id === reqId);
  if (!req) return;
  if (!requireEmployeeAdministration(req)) return;

  if (req.status !== "PENDING_APPROVAL" && req.status !== "CANCELLATION_REQUESTED") {
    showToast("HTTP 409 Conflict: This request has already been processed by another approver.", "danger");
    return;
  }

  const reason = (document.querySelector("#rejectionReasonInput")?.value || "").trim();
  if (!reason || reason.length < 5 || reason.length > 500) {
    alert("Rejection reason is mandatory and must be trimmed, non-empty, and between 5 and 500 characters.");
    return;
  }

  const currentProcName = currentUser().name;
  const currentProcRole = appState.role === "Super Admin" ? "SUPER_ADMIN" : "HR_ADMIN";

  if (req.status === "CANCELLATION_REQUESTED") {
    req.status = "APPROVED"; 
    req.processedByName = currentProcName;
    req.processedByRole = currentProcRole;
    req.processedAt = new Date().toISOString();
    req.rejectionReason = reason;

    leaveStore.auditLogs.unshift({
      id: `lal-${Date.now()}`,
      employeeId: req.employeeId,
      employeeName: req.employeeName,
      action: "REJECT_CANCELLATION",
      performedBy: currentProcName,
      userRole: currentProcRole,
      reason,
      ipAddress: "127.0.0.1",
      createdAt: new Date().toISOString()
    });

    window.closeLeaveModalDialog();
    window.closeLeaveDrawer();
    renderLeave();
    renderDashboard();
    refreshIcons();
    showToast(`✕ Cancellation request for ${req.employeeName} rejected. Leave remains Approved.`, "info");
    return;
  }

  req.status = "REJECTED";
  req.processedByName = currentProcName;
  req.processedByRole = currentProcRole;
  req.processedAt = new Date().toISOString();
  req.rejectionReason = reason;

  leaveStore.auditLogs.unshift({
    id: `lal-${Date.now()}`,
    employeeId: req.employeeId,
    employeeName: req.employeeName,
    action: "REJECT_REQUEST",
    performedBy: currentProcName,
    userRole: currentProcRole,
    reason,
    ipAddress: "127.0.0.1",
    createdAt: new Date().toISOString()
  });

  notifications.unshift({
    id: `notif-${Date.now()}`,
    category: "Leave Request",
    message: `Leave rejected for ${req.employeeName}: ${reason}`,
    time: "Just now",
    read: false,
    roles: ["Employee", "Super Admin", "HR Admin"]
  });

  window.closeLeaveModalDialog();
  window.closeLeaveDrawer();
  renderLeave();
  renderDashboard();
  refreshIcons();
  showToast(`✕ Leave request for ${req.employeeName} rejected successfully.`, "danger");
};

window.executeLeaveCancel = function(reqId, cancelReason) {
  const req = leaveStore.requests.find(r => r.id === reqId);
  if (!req) return;

  if (!canAdministerEmployee(req) && !isOwnEmployeeRecord(req)) { requireEmployeeAdministration(req); return; }
  if (!['APPROVED','PENDING_APPROVAL','MORE_INFORMATION_REQUIRED','CANCELLATION_REQUESTED'].includes(req.status)) {showToast('This request cannot be cancelled.');return;}
  if (!canAdministerEmployee(req) && ['APPROVED','CANCELLATION_REQUESTED'].includes(req.status)) {
    if(req.status==='CANCELLATION_REQUESTED'){showToast('Your cancellation is already awaiting review.');return;}
    req.status='CANCELLATION_REQUESTED';req.cancellationReason=(cancelReason || document.querySelector('#cancelReasonInput')?.value || 'Employee requested cancellation').trim();
    leaveStore.auditLogs.unshift({id:'lal-'+Date.now(),employeeId:req.employeeId,employeeName:req.employeeName,action:'REQUEST_CANCELLATION',performedBy:currentUser().name,userRole:HRDomain.adminRole(appState.role),reason:req.cancellationReason,createdAt:new Date().toISOString()});
    window.closeLeaveModalDialog();window.closeLeaveDrawer();renderLeave();renderDashboard();showToast('Cancellation sent for approval. Your balance is unchanged.');return;
  }
  if (req.status === "CANCELLED") {
    showToast("This leave request is already cancelled.", "info");
    return;
  }

  const reason = (cancelReason || document.querySelector("#cancelReasonInput")?.value || "").trim() || "Leave cancelled by user";
  const currentProcName = currentUser().name;
  const currentProcRole = appState.role === "Super Admin" ? "SUPER_ADMIN" : appState.role === "HR Admin" ? "HR_ADMIN" : "EMPLOYEE";
  const wasApproved = req.status === "APPROVED" || req.status === "CANCELLATION_REQUESTED";

  req.status = "CANCELLED";
  req.cancelledAt = new Date().toISOString();
  req.cancellationReason = reason;
  req.processedByName = currentProcName;
  req.processedByRole = currentProcRole;
  req.processedAt = new Date().toISOString();
  req.approvalNote = `Cancelled (${reason})`;

  // Restore employee leave balance if previously approved
  if (wasApproved) {
    let bal = leaveStore.balances.find(b => b.employeeId === req.employeeId && b.leaveTypeId === req.leaveTypeId);
    if (bal) {
      bal.used = Math.max(0, bal.used - req.totalDays);
      bal.availableBalance += req.totalDays;
    }
  }

  // Restore attendance record if on leave
  const isFullDay = req.dayType === "FULL_DAY" || !req.dayType;
  if (isFullDay) {
    (appState.attendanceHistory || []).forEach(h => {
      if (h.employeeId === req.employeeCode && h.date >= req.startDate && h.date <= req.endDate) {
        if (h.status === "ON_LEAVE" || h.attendance === "On Leave") {
          h.status = "NOT_CLOCKED_IN";
          h.attendance = "Not Started";
        }
      }
    });
  }

  // Immutable Audit Log
  leaveStore.auditLogs.unshift({
    id: `lal-${Date.now()}`,
    employeeId: req.employeeId,
    employeeName: req.employeeName,
    action: wasApproved ? "CANCEL_APPROVED_LEAVE" : "CANCEL_PENDING_REQUEST",
    performedBy: currentProcName,
    userRole: currentProcRole,
    reason: reason,
    ipAddress: "127.0.0.1",
    createdAt: new Date().toISOString()
  });

  // Notification
  notifications.unshift({
    id: `notif-${Date.now()}`,
    category: "Leave Request",
    message: `Leave for ${req.employeeName} (${req.startDate} to ${req.endDate}) was cancelled. Balance restored.`,
    time: "Just now",
    read: false,
    roles: ["Employee", "Super Admin", "HR Admin"]
  });

  window.closeLeaveModalDialog();
  window.closeLeaveDrawer();
  renderLeave();
  renderDashboard();
  refreshIcons();

  showToast(`✓ Leave for ${req.employeeName} (${req.startDate}${req.startDate !== req.endDate ? ' to ' + req.endDate : ''}) cancelled successfully. ${req.totalDays} day(s) restored to balance.`, "success");
};

window.executeRequestInfo = function(reqId) {
  const req = leaveStore.requests.find(r => r.id === reqId);
  if (!req) return;
  if (!requireEmployeeAdministration(req)) return;
  const msg = (document.querySelector("#requestInfoMsgInput")?.value || "").trim();
  if (!msg || msg.length < 5) {
    alert("Message to employee is required (min 5 characters).");
    return;
  }
  req.status = "MORE_INFORMATION_REQUIRED";
  req.moreInfoMessage = msg;

  notifications.unshift({
    id: `notif-${Date.now()}`,
    category: "Leave Request",
    message: `Clarification requested on leave: ${msg}`,
    time: "Just now",
    read: false,
    roles: ["Employee", "Super Admin"]
  });

  leaveStore.auditLogs.unshift({
    id: `lal-${Date.now()}`,
    employeeId: req.employeeId,
    employeeName: req.employeeName,
    action: "REQUEST_MORE_INFO",
    performedBy: currentUser().name,
    userRole: appState.role === "Super Admin" ? "SUPER_ADMIN" : "HR_ADMIN",
    reason: msg,
    ipAddress: "127.0.0.1",
    createdAt: new Date().toISOString()
  });

  showToast(`✓ Requested clarification from ${req.employeeName}.`, "info");
  window.closeLeaveModalDialog();
  window.closeLeaveDrawer();
  renderLeave();
};



window.calculateLeaveWorkingDays = function(startDate, endDate, dayType, leaveTypeObj, holidaysList) {
  if (!startDate || !endDate || startDate > endDate) return 0;
  if (dayType === "HALF_DAY" || dayType === "FIRST_HALF" || dayType === "SECOND_HALF") {
    const d = new Date(startDate);
    const dayOfWeek = d.getDay();
    const isWeekend = HRDomain.weekOff(startDate, appState.weekendSchedules || []);
    const isHoliday = (holidaysList || []).some(h => h.date === startDate && h.isActive);
    if (isWeekend && leaveTypeObj?.weekendsBetweenLeave === "NOT_CONSIDERED") return 0;
    if (isHoliday && leaveTypeObj?.holidaysBetweenLeave === "NOT_CONSIDERED") return 0;
    return 0.5;
  }

  let current = new Date(startDate);
  const end = new Date(endDate);
  let workingDays = 0;

  while (current <= end) {
    const dayOfWeek = current.getDay();
    const dateStr = current.toISOString().split("T")[0];
    const isWeekend = HRDomain.weekOff(dateStr, appState.weekendSchedules || []);
    const isHoliday = (holidaysList || []).some(h => h.date === dateStr && h.isActive);

    const skipWeekend = isWeekend && leaveTypeObj?.weekendsBetweenLeave === "NOT_CONSIDERED";
    const skipHoliday = isHoliday && leaveTypeObj?.holidaysBetweenLeave === "NOT_CONSIDERED";

    if (!skipWeekend && !skipHoliday) {
      workingDays += 1;
    }

    current.setDate(current.getDate() + 1);
  }

  return workingDays;
};

window.validateLeavePolicyRules = function(emp, leaveTypeObj, startDate, endDate, totalDays, currentBalance, existingRequests, probationSettings) {
  if (!leaveTypeObj) return { valid: false, error: "Invalid leave type specified." };
  if (totalDays <= 0) {
    return { valid: false, error: `The selected date range contains only non-working days (weekends/holidays) that are excluded under the ${leaveTypeObj.name} policy.` };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startD = new Date(startDate);
  startD.setHours(0, 0, 0, 0);
  const msPerDay = 86400000;
  const todayStr = today.toISOString().split("T")[0];

  // 1. Future-dated checks
  if (startDate > todayStr) {
    if (leaveTypeObj.futureDatedLeavesAllowed === false) {
      return { valid: false, error: `Future-dated leaves are not permitted under the ${leaveTypeObj.name} policy.` };
    }
    const daysInAdvance = Math.round((startD - today) / msPerDay);
    const minBuffer = leaveTypeObj.futureDatedAllowedAfterDays || 0;
    if (minBuffer > 0 && daysInAdvance < minBuffer) {
      return { valid: false, error: `${leaveTypeObj.name} requires at least ${minBuffer} day(s) advance notice. You applied ${daysInAdvance} day(s) in advance.` };
    }
  }

  // 2. Backdated checks
  if (startDate < todayStr) {
    if (leaveTypeObj.backdatedLeavesAllowed === false) {
      return { valid: false, error: `Backdated leaves are not permitted under the ${leaveTypeObj.name} policy.` };
    }
    const daysInPast = Math.round((today - startD) / msPerDay);
    const maxPastWindow = leaveTypeObj.backdatedAllowedUpToDays ?? 15;
    if (daysInPast > maxPastWindow) {
      return { valid: false, error: `Backdated leaves for ${leaveTypeObj.name} can only be applied up to ${maxPastWindow} days in the past. (Selected date is ${daysInPast} days ago).` };
    }
  }

  // 3. Probation eligibility check
  if (leaveTypeObj.allowedUnderProbation === false && emp?.joiningDate) {
    const joinDate = new Date(emp.joiningDate);
    const diffMonths = (today.getFullYear() - joinDate.getFullYear()) * 12 + (today.getMonth() - joinDate.getMonth());
    const probationMonths = probationSettings?.duration || 3;
    if (diffMonths < probationMonths) {
      return { valid: false, error: `${emp.name || 'Employee'} is currently in probation (${diffMonths}/${probationMonths} months completed). ${leaveTypeObj.name} is blocked during probation.` };
    }
  }

  // 4. Continuous leaves cap
  if (leaveTypeObj.continuousLeavesAllowed != null && totalDays > leaveTypeObj.continuousLeavesAllowed) {
    return { valid: false, error: `The maximum continuous leave allowed for ${leaveTypeObj.name} is ${leaveTypeObj.continuousLeavesAllowed} days in a single application. (Requested: ${totalDays}d).` };
  }

  // 5. Max leaves allowed in month
  if (leaveTypeObj.maxLeavesAllowedInMonth != null) {
    const monthKey = startDate.substring(0, 7); // YYYY-MM
    const existingInMonth = (existingRequests || [])
      .filter(r => r.employeeId === emp.id && r.leaveTypeId === leaveTypeObj.id && r.status !== "REJECTED" && r.status !== "CANCELLED" && (r.startDate.startsWith(monthKey) || r.endDate.startsWith(monthKey)))
      .reduce((sum, r) => sum + (r.totalDays || 0), 0);
    if (existingInMonth + totalDays > leaveTypeObj.maxLeavesAllowedInMonth) {
      return { valid: false, error: `Monthly limit of ${leaveTypeObj.maxLeavesAllowedInMonth} days exceeded for ${leaveTypeObj.name}. (Already taken/pending in ${monthKey}: ${existingInMonth}d, Requested: ${totalDays}d).` };
    }
  }

  // 6. Negative balance check
  const balanceAfter = currentBalance - totalDays;
  if (balanceAfter < 0) {
    if (!leaveTypeObj.negativeLeavesAllowed) {
      return { valid: false, error: `Insufficient leave balance (${currentBalance} days available, ${totalDays} days requested). Negative balance is not permitted for ${leaveTypeObj.name}.` };
    }
    const maxNegLimit = Math.abs(leaveTypeObj.negativeBalanceLimit ?? 0);
    if (Math.abs(balanceAfter) > maxNegLimit) {
      return { valid: false, error: `Insufficient leave balance. This application would result in ${balanceAfter} days, exceeding the allowed negative balance limit of -${maxNegLimit} days.` };
    }
  }

  return { valid: true };
};

window.ensureAllEmployeeBalancesInitialized = function() {
  employees.forEach(emp => {
    leaveStore.leaveTypes.forEach(lt => {
      let b = leaveStore.balances.find(bal => bal.employeeId === emp.id && bal.leaveTypeId === lt.id);
      if (!b) {
        const annualQuota = 0;
        leaveStore.balances.push({
          id: `lb-${emp.id}-${lt.id}`,
          employeeId: emp.id,
          employeeName: emp.name,
          employeeCode: emp.id,
          department: emp.dept || "Engineering",
          leaveTypeId: lt.id,
          leaveTypeName: lt.name,
          openingBalance: annualQuota,
          refilled: 0,
          carriedForward: 0,
          used: 0,
          pending: 0,
          manuallyAdjusted: 0,
          availableBalance: annualQuota,
          expiringBalance: 0
        });
      }
    });
  });
};

window.updateAssignPolicyDefaults = function() {
  const select = document.getElementById("assignPolicyTypeId");
  const quotaInput = document.getElementById("assignPolicyQuotaInput");
  if (!select || !quotaInput) return;
  const lt = leaveStore.leaveTypes.find(t => t.id === select.value);
  if (lt) {
    const quota = lt.leavesAllowedPerYear != null ? lt.leavesAllowedPerYear : (lt.annualAllocation || 0);
    quotaInput.value = quota;
  }
  window.updateAssignPolicyPreview();
};

window.filterAssignPolicyEmployees = function() {
  const dept = document.getElementById("assignPolicyDeptFilter")?.value || "ALL";
  const search = (document.getElementById("assignPolicySearchInput")?.value || "").toLowerCase().trim();
  const rows = document.querySelectorAll(".assign-emp-row");
  let visibleCount = 0;
  rows.forEach(row => {
    const rDept = row.getAttribute("data-dept") || "";
    const rText = row.getAttribute("data-search") || "";
    const matchDept = (dept === "ALL" || rDept === dept);
    const matchSearch = (!search || rText.includes(search));
    if (matchDept && matchSearch) {
      row.style.display = "flex";
      visibleCount++;
    } else {
      row.style.display = "none";
    }
  });
  const countEl = document.getElementById("assignPolicyFilteredCount");
  if (countEl) countEl.innerText = `${visibleCount} available`;
  window.updateAssignPolicyPreview();
};

window.toggleAssignPolicySelectAll = function(checked) {
  const rows = document.querySelectorAll(".assign-emp-row");
  rows.forEach(row => {
    if (row.style.display !== "none") {
      const cb = row.querySelector("input[type='checkbox']");
      if (cb && !cb.disabled) cb.checked = checked;
    }
  });
  window.updateAssignPolicyPreview();
};

window.updateAssignPolicyPreview = function() {
  const checkedBoxes = document.querySelectorAll(".assign-emp-row input[type='checkbox']:checked");
  const quotaInput = document.getElementById("assignPolicyQuotaInput");
  const select = document.getElementById("assignPolicyTypeId");
  const previewBox = document.getElementById("assignPolicySummaryPreview");
  if (!previewBox) return;
  const count = checkedBoxes.length;
  const quota = parseFloat(quotaInput?.value || 0);
  const lt = leaveStore.leaveTypes.find(t => t.id === select?.value);
  const ltName = lt ? lt.name : "selected leave policy";
  const totalDays = (count * quota).toFixed(1);
  if (count === 0) {
    previewBox.innerHTML = `⚠️ <em>No employees selected yet. Check individual employees or click "Select All" above.</em>`;
    previewBox.style.color = "#f59e0b";
    previewBox.style.borderColor = "rgba(245,158,11,0.3)";
    previewBox.style.background = "rgba(245,158,11,0.08)";
  } else {
    previewBox.innerHTML = `✓ <strong>Summary Preview:</strong> Will assign <strong>${quota} days</strong> of <strong>${ltName}</strong> to <strong>${count} employee(s)</strong>. Total leave allocated: <strong>${totalDays} days</strong>.`;
    previewBox.style.color = "#34d399";
    previewBox.style.borderColor = "rgba(52,211,153,0.3)";
    previewBox.style.background = "rgba(52,211,153,0.08)";
  }
};

window.executeAssignPolicySave = function(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const leaveTypeId = formData.get("leaveTypeId");
  const quota = parseFloat(formData.get("quotaAmount") || 0);
  const mode = formData.get("assignmentMode") || "SET_ANNUAL";
  const reason = (formData.get("auditReason") || "").trim();

  const selectedBoxes = form.querySelectorAll("input[name='selectedEmployees']:checked");
  const selectedEmpIds = Array.from(selectedBoxes).map(cb => cb.value);
  if (selectedEmpIds.some(id => !canAdministerEmployee(id))) { requireEmployeeAdministration(selectedEmpIds.find(id => !canAdministerEmployee(id))); return; }

  if (selectedEmpIds.length === 0) {
    alert("Please select at least one employee to assign leave policy.");
    return;
  }

  if (isNaN(quota) || quota < 0) {
    alert("Please specify a valid non-negative leave quota amount.");
    return;
  }

  if (!reason || reason.length < 5) {
    alert("Mandatory audit reason is required (min 5 characters).");
    return;
  }

  const lt = leaveStore.leaveTypes.find(t => t.id === leaveTypeId);
  if (!lt) {
    alert("Invalid leave policy selected.");
    return;
  }

  const currentProcName = currentUser().name;
  const currentProcRole = appState.role === "Super Admin" ? "SUPER_ADMIN" : "HR_ADMIN";

  selectedEmpIds.forEach(empId => {
    const emp = employees.find(item => item.id === empId || item.backendId == empId) || { id: empId, name: "Employee " + empId, dept: "Engineering" };
    let bal = leaveStore.balances.find(b => b.employeeId === empId && b.leaveTypeId === leaveTypeId);
    if (!bal) {
      bal = {
        id: `lb-${empId}-${leaveTypeId}`,
        employeeId: empId,
        employeeName: emp.name || emp.fullName || "Employee",
        employeeCode: emp.id || `DR-${empId}`,
        department: emp.dept || emp.department || "Engineering",
        leaveTypeId: lt.id,
        leaveTypeName: lt.name,
        openingBalance: quota,
        refilled: 0,
        carriedForward: 0,
        used: 0,
        pending: 0,
        manuallyAdjusted: 0,
        availableBalance: quota,
        expiringBalance: 0
      };
      leaveStore.balances.push(bal);
    } else {
      if (mode === "SET_ANNUAL") {
        bal.openingBalance = quota;
        bal.availableBalance = quota + (bal.carriedForward || 0) - (bal.used || 0) + (bal.manuallyAdjusted || 0);
        bal.refilled = 0;
      } else {
        bal.openingBalance = (bal.openingBalance || 0) + quota;
        bal.availableBalance = (bal.availableBalance || 0) + quota;
        bal.manuallyAdjusted = (bal.manuallyAdjusted || 0) + quota;
      }
    }
  });

  leaveStore.auditLogs.unshift({
    id: `lal-${Date.now()}`,
    employeeId: selectedEmpIds.length === 1 ? selectedEmpIds[0] : "BULK_ASSIGNMENT",
    employeeName: selectedEmpIds.length === 1 ? (employees.find(e => e.id === selectedEmpIds[0])?.name || selectedEmpIds[0]) : `${selectedEmpIds.length} Employees`,
    action: "POLICY_ASSIGNMENT",
    performedBy: currentProcName,
    userRole: currentProcRole,
    reason: `${reason} (Assigned ${quota}d of ${lt.name} to ${selectedEmpIds.length} employees [${mode}])`,
    ipAddress: "127.0.0.1",
    createdAt: new Date().toISOString()
  });

  window.closeLeaveModalDialog();
  renderLeave();
  renderDashboard();
  refreshIcons();
  showToast(`✓ Assigned ${quota} days of ${lt.name} to ${selectedEmpIds.length} employee(s) successfully.`, "success");
};

window.executeManualLeaveSave = function(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const empId = formData.get("employeeId");
  if (!requireEmployeeAdministration(empId)) return;
  const emp = employees.find(item => item.id === empId || item.backendId == empId) || { id: empId, name: "Employee " + empId, dept: "Engineering" };
  const empName = emp.name || emp.fullName || "Employee";
  const empCode = emp.id || `DR-${empId}`;
  const dept = emp.dept || emp.department || "Engineering";
  const leaveTypeId = formData.get("leaveTypeId");
  const leaveTypeObj = leaveStore.leaveTypes.find(t => t.id === leaveTypeId);

  const manualReason = (formData.get("manualEntryReason") || "").trim();
  if (!manualReason || manualReason.length < 5) {
    alert("Mandatory audit reason for Manual Entry is required (min 5 characters).");
    return;
  }

  const startDate = formData.get("startDate");
  const endDate = formData.get("endDate");
  const dayType = formData.get("dayType") || "FULL_DAY";
  const isFullDay = dayType === "FULL_DAY";

  if (!startDate || !endDate || startDate > endDate) {
    alert("Please provide valid start and end dates.");
    return;
  }

  // Calculate actual working days excluding weekends & holidays per policy
  const totalDays = window.calculateLeaveWorkingDays(startDate, endDate, dayType, leaveTypeObj, leaveStore.holidays);

  let bal = leaveStore.balances.find(b => b.employeeId === empId && b.leaveTypeId === leaveTypeId);
  const actualCurrentBalance = bal ? bal.availableBalance : (leaveTypeObj?.leavesAllowedPerYear || 0);

  // Validate policy constraints
  const validation = window.validateLeavePolicyRules(
    emp,
    leaveTypeObj,
    startDate,
    endDate,
    totalDays,
    actualCurrentBalance,
    leaveStore.requests,
    leaveStore.probationSettings
  );

  if (!validation.valid) {
    alert(validation.error);
    return;
  }

  if (isFullDay) {
    const hasClockRecord = (appState.attendanceHistory || []).some(h => 
      h.employeeId === empCode && h.date >= startDate && h.date <= endDate && h.clockIn && h.clockIn !== "-"
    );
    if (hasClockRecord) {
      alert("Manual leave blocked: clock-in/out records already exist for the selected leave dates.");
      return;
    }
  }

  const currentProcName = currentUser().name;
  const currentProcRole = appState.role === "Super Admin" ? "SUPER_ADMIN" : "HR_ADMIN";

  const actualBalanceAfterApp = actualCurrentBalance - totalDays;

  const newReq = {
    id: `lr-manual-${Date.now()}`,
    employeeId: empId,
    employeeName: empName,
    employeeCode: empCode,
    department: dept,
    leaveTypeId,
    leaveTypeName: leaveTypeObj ? leaveTypeObj.name : "Manual Leave",
    isPaid: leaveTypeObj ? leaveTypeObj.isPaid : true,
    startDate,
    endDate,
    dayType,
    totalDays,
    currentBalance: actualCurrentBalance,
    balanceAfterApp: actualBalanceAfterApp,
    reason: formData.get("reason"),
    status: "APPROVED",
    submittedAt: new Date().toISOString(),
    processedByName: currentProcName,
    processedByRole: currentProcRole
  };

  if (isFullDay) {
    (appState.attendanceHistory || []).forEach(h => {
      if (h.employeeId === empCode && h.date >= startDate && h.date <= endDate) {
        h.status = "ON_LEAVE";
        h.attendance = "On Leave";
      }
    });
  }

  if (!bal) {
    bal = {
      id: `lb-${Date.now()}`,
      employeeId: empId,
      employeeName: empName,
      employeeCode: empCode,
      department: dept,
      leaveTypeId,
      leaveTypeName: leaveTypeObj ? leaveTypeObj.name : "Manual Leave",
      openingBalance: leaveTypeObj?.leavesAllowedPerYear || 0,
      refilled: 0,
      carriedForward: 0,
      used: 0,
      pending: 0,
      manuallyAdjusted: 0,
      availableBalance: leaveTypeObj?.leavesAllowedPerYear || 0,
      expiringBalance: 0
    };
    leaveStore.balances.unshift(bal);
  }

  bal.used += totalDays;
  bal.availableBalance = actualBalanceAfterApp; // Correctly supports negative balance

  leaveStore.requests.unshift(newReq);
  leaveStore.auditLogs.unshift({
    id: `lal-${Date.now()}`,
    employeeId: empId,
    employeeName: empName,
    action: "MANUAL_ADD_LEAVE",
    performedBy: currentProcName,
    userRole: currentProcRole,
    reason: manualReason,
    ipAddress: "127.0.0.1",
    createdAt: new Date().toISOString()
  });

  showToast(`Manual leave (${totalDays} day${totalDays !== 1 ? 's' : ''}) added for ${empName}. Balance updated to ${actualBalanceAfterApp}d.`);
  window.closeLeaveModalDialog();
};




window.executeBalanceAdjustmentSave = function(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const balId = formData.get("balanceId");
  const days = Number(formData.get("days") || 1);
  const type = formData.get("adjType");
  const reason = (formData.get("reason") || "").trim();

  if (!reason || reason.length < 5) {
    alert("Reason for Balance Adjustment is mandatory (min 5 characters).");
    return;
  }

  const currentProcName = currentUser().name;
  const currentProcRole = appState.role === "Super Admin" ? "SUPER_ADMIN" : "HR_ADMIN";

  const bal = leaveStore.balances.find(b => b.id === balId);
  if (!requireEmployeeAdministration(bal)) return;
  if (!Number.isFinite(days) || days <= 0 || days % 0.5 !== 0) { showToast("Enter a positive number of days in half-day increments.","danger"); return; }
  if (bal) {
    const change = type === "CREDIT" ? days : -days;
    bal.manuallyAdjusted += change;
    bal.availableBalance += change; // Supports negative balance if policy allows

    leaveStore.auditLogs.unshift({
      id: `lal-${Date.now()}`,
      employeeId: bal.employeeId,
      employeeName: bal.employeeName,
      action: type === "CREDIT" ? "MANUAL_BALANCE_CREDIT" : "MANUAL_BALANCE_DEDUCT",
      performedBy: currentProcName,
      userRole: currentProcRole,
      reason,
      ipAddress: "127.0.0.1",
      createdAt: new Date().toISOString()
    });

    showToast(`Adjusted balance for ${bal.employeeName} (${change > 0 ? '+' : ''}${change} days).`);
  }

  window.closeLeaveModalDialog();
};

window.executeYearEndRollover = function() {
  if(appState.role !== 'Super Admin'){showToast('Only Super Admin can run a rollover that changes every employee balance.','danger');return;}
  const currentProcName = currentUser().name;
  const currentProcRole = appState.role === "Super Admin" ? "SUPER_ADMIN" : "HR_ADMIN";
  let totalCarriedForward = 0;
  let rolledCount = 0;

  window.ensureAllEmployeeBalancesInitialized();

  leaveStore.balances.forEach(b => {
    const lt = leaveStore.leaveTypes.find(t => t.id === b.leaveTypeId);
    if (lt && lt.isActive) {
      const annualQuota = lt.leavesAllowedPerYear != null ? lt.leavesAllowedPerYear : (lt.annualAllocation || 0);
      let cfAmount = 0;

      if (lt.carryForwardEnabled && b.availableBalance > 0) {
        const maxCF = lt.maximumCarryForward > 0 ? lt.maximumCarryForward : b.availableBalance;
        cfAmount = Math.min(b.availableBalance, maxCF);
      }

      b.carriedForward = cfAmount;
      b.openingBalance = annualQuota;
      b.refilled = 0;
      b.used = 0;
      b.pending = 0;
      b.manuallyAdjusted = 0;
      b.availableBalance = annualQuota + cfAmount;
      b.expiringBalance = cfAmount;

      totalCarriedForward += cfAmount;
      rolledCount++;
    }
  });

  leaveStore.auditLogs.unshift({
    id: `lal-${Date.now()}`,
    employeeId: "ALL_ACTIVE",
    employeeName: "Organization Wide",
    action: "YEAR_END_ROLLOVER",
    performedBy: currentProcName,
    userRole: currentProcRole,
    reason: `Processed Year-End Carry Forward Rollover for ${rolledCount} balances (Total carried forward: ${totalCarriedForward} days)`,
    ipAddress: "127.0.0.1",
    createdAt: new Date().toISOString()
  });

  renderLeave();
  showToast(`✓ Year-End Rollover completed! Carried forward ${totalCarriedForward} days across ${rolledCount} balances.`, "success");
  window.closeLeaveModalDialog();
};

window.archiveLeaveTypeAction = function(typeId) {
  const typeObj = leaveStore.leaveTypes.find(t => t.id === typeId);
  if (!typeObj) return;
  if (!confirm(`Are you sure you want to archive "${typeObj.name}"? Historical requests and current balances will remain preserved.`)) return;
  typeObj.isActive = false;
  leaveStore.auditLogs.unshift({
    id: `lal-${Date.now()}`,
    employeeId: "POLICY_ARCHIVE",
    employeeName: typeObj.name,
    action: "POLICY_UPDATE",
    performedBy: currentUser().name,
    userRole: appState.role === "Super Admin" ? "SUPER_ADMIN" : "HR_ADMIN",
    reason: `Archived leave policy "${typeObj.name}" (${typeObj.code}).`,
    ipAddress: "127.0.0.1",
    createdAt: new Date().toISOString()
  });
  renderLeave();
  showToast(`✓ Archived leave policy "${typeObj.name}".`, "info");
};

window.openDeleteLeavePolicyModal = function(typeId) {
  leaveStore.activeModal = "deleteLeavePolicy";
  leaveStore.modalPayload = typeId;
  renderLeave();
};

window.executeDeleteLeavePolicy = function(typeId) {
  const typeIndex = leaveStore.leaveTypes.findIndex(t => t.id === typeId);
  if (typeIndex === -1) {
    alert("Leave policy not found.");
    return;
  }
  const typeObj = leaveStore.leaveTypes[typeIndex];
  const typeName = typeObj.name;
  const typeCode = typeObj.shortName || typeObj.code;

  // Remove from leaveStore.leaveTypes
  leaveStore.leaveTypes.splice(typeIndex, 1);

  // Remove associated balances
  const removedBalCount = leaveStore.balances.filter(b => b.leaveTypeId === typeId).length;
  leaveStore.balances = leaveStore.balances.filter(b => b.leaveTypeId !== typeId);

  // Record audit log
  const currentProcName = currentUser().name;
  const currentProcRole = appState.role === "Super Admin" ? "SUPER_ADMIN" : "HR_ADMIN";
  leaveStore.auditLogs.unshift({
    id: `lal-${Date.now()}`,
    employeeId: "POLICY_DELETION",
    employeeName: typeName,
    action: "POLICY_DELETE",
    performedBy: currentProcName,
    userRole: currentProcRole,
    reason: `Permanently deleted leave policy "${typeName}" (${typeCode}) and cleared ${removedBalCount} associated balance allocation(s).`,
    ipAddress: "127.0.0.1",
    createdAt: new Date().toISOString()
  });

  window.closeLeaveModalDialog();
  renderLeave();
  renderDashboard();
  refreshIcons();
  showToast(`✓ Leave policy "${typeName}" has been permanently deleted.`, "success");
};

window.executeLeaveEncashmentSave = function(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const balId = formData.get("balanceId");
  const days = Number(formData.get("encashDays") || 1);
  const reason = (formData.get("reason") || "").trim();

  const bal = leaveStore.balances.find(b => b.id === balId);
  if (!requireEmployeeAdministration(bal)) return;
  if (!Number.isFinite(days) || days <= 0 || days % 0.5 !== 0) { showToast("Enter a positive number of days in half-day increments.","danger"); return; }
  if (!bal) return;

  const lt = leaveStore.leaveTypes.find(t => t.id === bal.leaveTypeId);
  if (!lt || !lt.encashmentEnabled) {
    alert("Leave encashment is not enabled for this leave policy.");
    return;
  }

  if (lt.encashmentMinBalance > 0 && bal.availableBalance < lt.encashmentMinBalance) {
    alert(`Minimum balance required for encashment is ${lt.encashmentMinBalance} days (Current balance: ${bal.availableBalance}d).`);
    return;
  }

  if (lt.encashmentMaxDays > 0 && days > lt.encashmentMaxDays) {
    alert(`Maximum allowed encashment is ${lt.encashmentMaxDays} days per request.`);
    return;
  }

  if (days > bal.availableBalance) {
    alert(`Cannot encash more than available balance (${bal.availableBalance} days).`);
    return;
  }

  const currentProcName = currentUser().name;
  const currentProcRole = appState.role === "Super Admin" ? "SUPER_ADMIN" : "HR_ADMIN";

  bal.availableBalance -= days;
  bal.used += days;

  leaveStore.auditLogs.unshift({
    id: `lal-${Date.now()}`,
    employeeId: bal.employeeId,
    employeeName: bal.employeeName,
    action: "LEAVE_ENCASHMENT",
    performedBy: currentProcName,
    userRole: currentProcRole,
    reason: `Encashed ${days} days of ${bal.leaveTypeName}. ${reason ? 'Note: ' + reason : ''}`,
    ipAddress: "127.0.0.1",
    createdAt: new Date().toISOString()
  });

  renderLeave();
  showToast(`✓ Encashed ${days} day(s) for ${bal.employeeName}. Remaining balance: ${bal.availableBalance}d.`, "success");
  window.closeLeaveModalDialog();
};




window.switchPolicyDetailTab = function(tabName) {
  leaveStore.policyDetailTab = tabName;
  const genContent = document.getElementById("policyDetailGenTab");
  const advContent = document.getElementById("policyDetailAdvTab");
  const genBtn = document.getElementById("btnPolicyDetailGen");
  const advBtn = document.getElementById("btnPolicyDetailAdv");
  if (genContent && advContent) {
    if (tabName === 'general') {
      genContent.style.display = "block";
      advContent.style.display = "none";
      if (genBtn) { genBtn.style.borderBottom = "2px solid #3b82f6"; genBtn.style.color = "#2563eb"; genBtn.style.fontWeight = "700"; }
      if (advBtn) { advBtn.style.borderBottom = "2px solid transparent"; advBtn.style.color = "var(--muted-text)"; advBtn.style.fontWeight = "500"; }
    } else {
      genContent.style.display = "none";
      advContent.style.display = "block";
      if (advBtn) { advBtn.style.borderBottom = "2px solid #3b82f6"; advBtn.style.color = "#2563eb"; advBtn.style.fontWeight = "700"; }
      if (genBtn) { genBtn.style.borderBottom = "2px solid transparent"; genBtn.style.color = "var(--muted-text)"; genBtn.style.fontWeight = "500"; }
    }
  } else {
    renderLeave();
  }
};

window.switchPolicyFormTab = function(tabName) {
  leaveStore.policyFormTab = tabName;
  const genEl = document.getElementById("policyFormGenContent");
  const advEl = document.getElementById("policyFormAdvContent");
  const genBtn = document.getElementById("btnPolicyFormGen");
  const advBtn = document.getElementById("btnPolicyFormAdv");
  if (genEl && advEl) {
    if (tabName === 'general') {
      genEl.style.display = "block";
      advEl.style.display = "none";
      if (genBtn) { genBtn.style.borderBottom = "2px solid #6366f1"; genBtn.style.color = "#818cf8"; }
      if (advBtn) { advBtn.style.borderBottom = "2px solid transparent"; advBtn.style.color = "var(--muted-text)"; }
    } else {
      genEl.style.display = "none";
      advEl.style.display = "block";
      if (advBtn) { advBtn.style.borderBottom = "2px solid #6366f1"; advBtn.style.color = "#818cf8"; }
      if (genBtn) { genBtn.style.borderBottom = "2px solid transparent"; genBtn.style.color = "var(--muted-text)"; }
    }
  } else {
    renderLeave();
  }
};

window.openLeavePolicyDetail = function(typeId) {
  leaveStore.activeModal = "viewPolicy";
  leaveStore.modalPayload = typeId;
  leaveStore.policyDetailTab = "general";
  renderLeave();
};

window.executeAddLeaveTypeSave = function(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const name = formData.get("name").trim();
  const code = (formData.get("code") || formData.get("shortName") || "").trim().toUpperCase();

  if (!name || !code) {
    alert("Leave Type Name and Leave Code / Short Name are mandatory.");
    return;
  }

  const currentProcName = currentUser().name;
  const currentProcRole = appState.role === "Super Admin" ? "SUPER_ADMIN" : "HR_ADMIN";

  const leavesAllowedPerYear = parseFloat(formData.get("leavesAllowedPerYear") || formData.get("annualAllocation") || 12);
  const isPaid = formData.get("isPaid") === "PAID" || formData.get("isPaid") === "true";
  const displayColor = formData.get("displayColor") || "#6366f1";

  const newType = {
    id: `lt-${Date.now()}`,
    name,
    shortName: code,
    code,
    description: formData.get("description") || "This is a default description for the Leave Type. You can customise this.",
    isPaid,
    isActive: true,
    displayColor,
    leavesAllowedPerYear,
    annualAllocation: leavesAllowedPerYear,
    weekendsBetweenLeave: formData.get("weekendsBetweenLeave") || "NOT_CONSIDERED",
    holidaysBetweenLeave: formData.get("holidaysBetweenLeave") || "NOT_CONSIDERED",
    creditableOnAccrualBasis: false,
    accrualFrequency: "YEARLY",
    accrualAmount: 0,
    allowedUnderProbation: formData.get("allowedUnderProbation") === "YES",
    allowedUnderNoticePeriod: formData.get("allowedUnderNoticePeriod") === "YES",
    encashmentEnabled: formData.get("encashmentEnabled") === "YES",
    encashmentMinBalance: parseFloat(formData.get("encashmentMinBalance") || 0),
    encashmentMaxDays: parseFloat(formData.get("encashmentMaxDays") || 0),
    carryForwardEnabled: formData.get("carryForwardEnabled") === "YES",
    maximumCarryForward: parseFloat(formData.get("maximumCarryForward") || 0),
    carryForwardExpiryDays: parseInt(formData.get("carryForwardExpiryDays") || 0, 10),
    maxLeavesAllowedInMonth: formData.get("maxLeavesAllowedInMonth") ? parseFloat(formData.get("maxLeavesAllowedInMonth")) : null,
    continuousLeavesAllowed: formData.get("continuousLeavesAllowed") ? parseFloat(formData.get("continuousLeavesAllowed")) : null,
    negativeLeavesAllowed: formData.get("negativeLeavesAllowed") === "YES",
    negativeBalanceLimit: -Math.abs(parseFloat(formData.get("negativeBalanceLimit") || 0)),
    futureDatedLeavesAllowed: formData.get("futureDatedLeavesAllowed") === "YES",
    futureDatedAllowedAfterDays: parseInt(formData.get("futureDatedAllowedAfterDays") || 0, 10),
    backdatedLeavesAllowed: formData.get("backdatedLeavesAllowed") === "YES",
    backdatedAllowedUpToDays: parseInt(formData.get("backdatedAllowedUpToDays") || 0, 10),
    applyLeavesForNextYearTill: formData.get("applyLeavesForNextYearTill") || ""
  };

  leaveStore.leaveTypes.unshift(newType);
  leaveStore.auditLogs.unshift({
    id: `lal-${Date.now()}`,
    employeeId: "N/A",
    employeeName: "—",
    action: "POLICY_CREATE",
    performedBy: currentProcName,
    userRole: currentProcRole,
    reason: `Created custom leave policy ${name} (${code}) with standard two-tier matrix settings`,
    ipAddress: "127.0.0.1",
    createdAt: new Date().toISOString()
  });

  showToast(`Created custom leave policy '${name}'.`);
  window.closeLeaveModalDialog();
};

window.executeEditLeaveTypeSave = function(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const typeId = formData.get("typeId");
  const typeObj = leaveStore.leaveTypes.find(t => t.id === typeId);
  if (!typeObj) return;

  const currentProcName = currentUser().name;
  const currentProcRole = appState.role === "Super Admin" ? "SUPER_ADMIN" : "HR_ADMIN";

  const name = formData.get("name").trim();
  const code = (formData.get("code") || formData.get("shortName") || "").trim().toUpperCase();
  const leavesAllowedPerYear = parseFloat(formData.get("leavesAllowedPerYear") || formData.get("annualAllocation") || 12);

  typeObj.name = name;
  typeObj.shortName = code;
  typeObj.code = code;
  typeObj.description = formData.get("description") || "";
  typeObj.isPaid = formData.get("isPaid") === "PAID" || formData.get("isPaid") === "true";
  typeObj.displayColor = formData.get("displayColor") || typeObj.displayColor || "#6366f1";
  typeObj.leavesAllowedPerYear = leavesAllowedPerYear;
  typeObj.annualAllocation = leavesAllowedPerYear;
  typeObj.weekendsBetweenLeave = formData.get("weekendsBetweenLeave") || "NOT_CONSIDERED";
  typeObj.holidaysBetweenLeave = formData.get("holidaysBetweenLeave") || "NOT_CONSIDERED";
  typeObj.creditableOnAccrualBasis = false;
  typeObj.accrualFrequency = "YEARLY";
  typeObj.accrualAmount = 0;
  typeObj.allowedUnderProbation = formData.get("allowedUnderProbation") === "YES";
  typeObj.allowedUnderNoticePeriod = formData.get("allowedUnderNoticePeriod") === "YES";
  typeObj.encashmentEnabled = formData.get("encashmentEnabled") === "YES";
  typeObj.encashmentMinBalance = parseFloat(formData.get("encashmentMinBalance") || 0);
  typeObj.encashmentMaxDays = parseFloat(formData.get("encashmentMaxDays") || 0);
  typeObj.carryForwardEnabled = formData.get("carryForwardEnabled") === "YES";
  typeObj.maximumCarryForward = parseFloat(formData.get("maximumCarryForward") || 0);
  typeObj.carryForwardExpiryDays = parseInt(formData.get("carryForwardExpiryDays") || 0, 10);
  typeObj.maxLeavesAllowedInMonth = formData.get("maxLeavesAllowedInMonth") ? parseFloat(formData.get("maxLeavesAllowedInMonth")) : null;
  typeObj.continuousLeavesAllowed = formData.get("continuousLeavesAllowed") ? parseFloat(formData.get("continuousLeavesAllowed")) : null;
  typeObj.negativeLeavesAllowed = formData.get("negativeLeavesAllowed") === "YES";
  typeObj.negativeBalanceLimit = -Math.abs(parseFloat(formData.get("negativeBalanceLimit") || 0));
  typeObj.futureDatedLeavesAllowed = formData.get("futureDatedLeavesAllowed") === "YES";
  typeObj.futureDatedAllowedAfterDays = parseInt(formData.get("futureDatedAllowedAfterDays") || 0, 10);
  typeObj.backdatedLeavesAllowed = formData.get("backdatedLeavesAllowed") === "YES";
  typeObj.backdatedAllowedUpToDays = parseInt(formData.get("backdatedAllowedUpToDays") || 0, 10);
  typeObj.applyLeavesForNextYearTill = formData.get("applyLeavesForNextYearTill") || "";

  leaveStore.auditLogs.unshift({
    id: `lal-${Date.now()}`,
    employeeId: "N/A",
    employeeName: "—",
    action: "POLICY_UPDATE",
    performedBy: currentProcName,
    userRole: currentProcRole,
    reason: `Updated leave policy ${typeObj.name} with modified matrix parameters`,
    ipAddress: "127.0.0.1",
    createdAt: new Date().toISOString()
  });

  showToast(`Updated leave policy '${typeObj.name}'.`);
  window.closeLeaveModalDialog();
};




window.archiveLeaveTypeAction = function(typeId) {

  const typeObj = leaveStore.leaveTypes.find(t => t.id === typeId);

  if (typeObj) {

    typeObj.isActive = false;

    leaveStore.auditLogs.unshift({

      id: `lal-${Date.now()}`, employeeId: "N/A", employeeName: "—", action: "POLICY_ARCHIVE", performedBy: currentUser().name, userRole: appState.role === "Super Admin" ? "SUPER_ADMIN" : "HR_ADMIN", reason: `Archived leave policy ${typeObj.name}`, ipAddress: "127.0.0.1", createdAt: new Date().toISOString()

    });

    showToast(`Leave type '${typeObj.name}' archived. Historical requests preserved.`, "info");

    renderLeave();

  }

};



window.executeProbationSave = function(e) {

  e.preventDefault();

  const form = e.target;

  const formData = new FormData(form);

  leaveStore.probationSettings.duration = Number(formData.get("duration") || 3);

  leaveStore.probationSettings.durationUnit = formData.get("durationUnit") || "MONTHS";

  leaveStore.probationSettings.notifyBeforeCompletionDays = Number(formData.get("notifyDays") || 15);



  leaveStore.auditLogs.unshift({

    id: `lal-${Date.now()}`, employeeId: "N/A", employeeName: "—", action: "PROBATION_POLICY_UPDATE", performedBy: currentUser().name, userRole: appState.role === "Super Admin" ? "SUPER_ADMIN" : "HR_ADMIN", reason: `Updated probation settings to ${leaveStore.probationSettings.duration} ${leaveStore.probationSettings.durationUnit}`, ipAddress: "127.0.0.1", createdAt: new Date().toISOString()

  });



  showToast("Probation policy settings saved.");

  window.closeLeaveModalDialog();

};



window.executeAddHolidaySave = function(e) {

  e.preventDefault();

  const form = e.target;

  const formData = new FormData(form);

  const name = formData.get("name").trim();

  const date = formData.get("date");



  if (!name || !date) {

    alert("Holiday Name and Date are required.");

    return;

  }



  leaveStore.holidays.unshift({

    id: `hol-${Date.now()}`, name, date, dayType: "FULL_DAY", description: formData.get("description") || "", recurringAnnually: formData.get("recurring") === "on", isActive: true

  });

  showToast(`Holiday '${name}' added to calendar.`);

  window.closeLeaveModalDialog();

};




window.executeEditHolidaySave = function(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const holId = formData.get("holidayId");
  const hol = leaveStore.holidays.find(h => h.id === holId);
  if (!hol) return;

  const name = formData.get("name").trim();
  const date = formData.get("date");
  if (!name || !date) {
    alert("Holiday Name and Date are required.");
    return;
  }

  hol.name = name;
  hol.date = date;
  hol.description = formData.get("description") || "";
  hol.recurringAnnually = formData.get("recurring") === "on";

  leaveStore.auditLogs.unshift({
    id: `lal-${Date.now()}`, employeeId: "N/A", employeeName: "—", action: "HOLIDAY_UPDATE", performedBy: currentUser().name, userRole: appState.role === "Super Admin" ? "SUPER_ADMIN" : "HR_ADMIN", reason: `Updated holiday '${name}'`, ipAddress: "127.0.0.1", createdAt: new Date().toISOString()
  });

  showToast(`Holiday '${name}' updated.`);
  window.closeLeaveModalDialog();
};


window.toggleHolidayActiveAction = function(holId) {

  const hol = leaveStore.holidays.find(h => h.id === holId);

  if (hol) {

    hol.isActive = !hol.isActive;

    showToast(`Holiday '${hol.name}' status updated to ${hol.isActive ? 'Active' : 'Archived'}.`);

    renderLeave();

  }

};



function filterLeaveRequestsData() {

  let filtered = [...leaveStore.requests];

  const { search, department, leaveTypeId, status, isPaid, startDate, endDate } = leaveStore.filters;



  if (search) {

    const s = search.toLowerCase();

    filtered = filtered.filter(r => r.employeeName.toLowerCase().includes(s) || r.employeeCode.toLowerCase().includes(s) || r.department.toLowerCase().includes(s));

  }

  if (department !== "ALL") filtered = filtered.filter(r => r.department === department);

  if (leaveTypeId !== "ALL") filtered = filtered.filter(r => r.leaveTypeId === leaveTypeId);

  if (status !== "ALL") filtered = filtered.filter(r => r.status === status);

  if (isPaid !== "ALL") filtered = filtered.filter(r => r.isPaid === (isPaid === "PAID"));

  if (startDate) filtered = filtered.filter(r => r.startDate >= startDate);

  if (endDate) filtered = filtered.filter(r => r.endDate <= endDate);



  return filtered;

}



function renderLeaveBadge(status) {

  const st = String(status).toUpperCase();

  const badgeMap = {

    APPROVED: "background:rgba(16,185,129,0.15); color:#059669; border:1px solid rgba(16,185,129,0.4); font-weight:800;",

    PENDING_APPROVAL: "background:rgba(245,158,11,0.18); color:#b45309; border:1px solid rgba(245,158,11,0.4); font-weight:800;",

    REJECTED: "background:rgba(244,63,94,0.15); color:#e11d48; border:1px solid rgba(244,63,94,0.4); font-weight:800;",

    MORE_INFORMATION_REQUIRED: "background:rgba(14,165,233,0.15); color:#0284c7; border:1px solid rgba(14,165,233,0.4); font-weight:800;",

    CANCELLATION_REQUESTED: "background:rgba(168,85,247,0.15); color:#7e22ce; border:1px solid rgba(168,85,247,0.4); font-weight:800;",

    CANCELLED: "background:rgba(100,116,139,0.15); color:var(--muted-text); border:1px solid rgba(100,116,139,0.4); font-weight:700;",

    WITHDRAWN: "background:rgba(100,116,139,0.15); color:var(--muted-text); border:1px solid rgba(100,116,139,0.4); font-weight:700;"

  };

  const labelMap = {
    PENDING_APPROVAL: "Pending Approval",
    MORE_INFORMATION_REQUIRED: "More Info Required",
    CANCELLATION_REQUESTED: "Cancellation Requested"
  };

  const label = labelMap[st] || (st.charAt(0) + st.slice(1).toLowerCase().replace(/_/g, " "));
  const style = badgeMap[st] || "background:rgba(100,116,139,0.15); color:var(--muted-text); border:1px solid rgba(100,116,139,0.4); font-weight:700;";
  return `<span style="display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:999px; font-size:0.72rem; ${style}">${label}</span>`;
}

function renderEmployeeLeavePortal() {
  const user = currentUser();
  const currentRole = appState.role || "Employee";
  const todayStr = new Date().toISOString().slice(0, 10);

  const activeTypes = leaveStore.leaveTypes.filter(t => t.isActive);
  const userBalances = activeTypes.map(t => {
    let bal = leaveStore.balances.find(b => isOwnEmployeeRecord(b) && b.leaveTypeId === t.id);
    if (!bal) {
      bal = {
        id: `lb-${user.id}-${t.id}`,
        employeeId: user.id || "DR-004",
        employeeName: user.name || "Employee",
        employeeCode: user.id || "DR-004",
        leaveTypeId: t.id,
        leaveTypeName: t.name,
        availableBalance: 0,
        used: 0,
        pending: 0
      };
    }
    return { type: t, balance: bal };
  });

  let myRequests = leaveStore.requests.filter(r => isOwnEmployeeRecord(r));
  if (myRequests.length === 0) {
    myRequests = [];
  }

  const approvedCount = myRequests.filter(r => r.status === "APPROVED").length;
  const pendingCount = myRequests.filter(r => r.status === "PENDING_APPROVAL" || r.status === "CANCELLATION_REQUESTED").length;
  const cancelledCount = myRequests.filter(r => r.status === "CANCELLED").length;

  let modalHtml = "";
  if (leaveStore.activeModal === "cancel") {
    const req = leaveStore.requests.find(r => r.id === leaveStore.modalPayload);
    if (req) {
      modalHtml = `
        <div style="position:fixed; inset:0; z-index:110; display:flex; align-items:center; justify-content:center; padding:16px;">
          <div onclick="window.closeLeaveModalDialog()" style="position:absolute; inset:0; background:rgba(2,6,23,0.75); backdrop-filter:blur(4px);"></div>
          <div style="position:relative; width:100%; max-width:480px; background:var(--panel-raised); border:1px solid var(--line); border-radius:20px; padding:24px; z-index:111; color:var(--text);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
              <h3 style="font-size:1.15rem; font-weight:800; color:#f43f5e; margin:0; display:flex; align-items:center; gap:8px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                Cancel Leave
              </h3>
              <button onclick="window.closeLeaveModalDialog()" style="background:var(--panel-soft); border:1px solid var(--line); border-radius:8px; padding:4px 8px; cursor:pointer; color:var(--muted-text);">✕</button>
            </div>
            <p style="font-size:0.85rem; color:var(--muted-text); margin:0 0 14px;">
              Are you sure you want to cancel this leave? Your consumed quota (${req.totalDays} day${req.totalDays > 1 ? 's' : ''}) will be automatically restored to your available balance.
            </p>
            <div style="background:var(--panel-soft); padding:14px; border-radius:12px; border:1px solid var(--line); margin-bottom:16px; font-size:0.82rem; display:flex; flex-direction:column; gap:6px;">
              <div><strong>Employee:</strong> ${req.employeeName} <span style="font-family:monospace; color:var(--muted-text);">(${req.employeeCode})</span></div>
              <div><strong>Leave Type:</strong> <span style="color:var(--primary); font-weight:700;">${req.leaveTypeName}</span> &nbsp;&middot;&nbsp; <strong>${req.totalDays} day(s)</strong></div>
              <div><strong>Dates:</strong> <span style="font-family:monospace;">${req.startDate} ${req.startDate !== req.endDate ? 'to ' + req.endDate : ''}</span></div>
              <div><strong>Current Status:</strong> ${renderLeaveBadge(req.status)}</div>
            </div>
            <div style="margin-bottom:16px;">
              <label style="font-size:0.75rem; font-weight:700; color:var(--text); display:block; margin-bottom:6px;">Cancellation Reason / Remarks (Optional)</label>
              <textarea id="cancelReasonInput" rows="2" placeholder="e.g. Plans changed / meeting rescheduled..." style="width:100%; padding:10px; border-radius:10px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text); font-size:0.8rem; resize:vertical;"></textarea>
            </div>
            <div style="display:flex; gap:10px;">
              <button type="button" class="secondary-button" style="flex:1;" onclick="window.closeLeaveModalDialog()">Keep Leave</button>
              <button type="button" class="primary-button" style="flex:1; background:#f43f5e;" onclick="window.executeLeaveCancel('${req.id}')">Confirm Cancel Leave</button>
            </div>
          </div>
        </div>
      `;
    }
  }

  $("#leave").innerHTML = `
    <div class="panel" style="background:linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1)); border:1px solid rgba(99,102,241,0.3); border-radius:20px; padding:22px 26px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
      <div>
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:4px;">
          <h2 style="font-size:1.35rem; font-weight:800; color:var(--text); margin:0;">Leave & Time Off Portal</h2>
          <span style="font-size:0.7rem; font-weight:700; padding:3px 10px; border-radius:99px; background:rgba(99,102,241,0.2); color:var(--primary);">${currentRole}</span>
        </div>
        <p style="font-size:0.85rem; color:var(--muted-text); margin:0;">Welcome back, <strong>${user.name}</strong> (${user.id || 'DR-004'}). Manage your annual leaves, check balances, and apply for time off.</p>
      </div>
      <div style="display:flex; gap:10px;">
        <button class="primary-button" onclick="openLeaveModal()" style="display:inline-flex; align-items:center; gap:6px; padding:10px 20px; font-size:0.88rem; box-shadow:0 8px 20px rgba(99,102,241,0.35);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Apply for Leave
        </button>
      </div>
    </div>

    <div style="margin-bottom:24px;">
      <h3 style="font-size:1rem; font-weight:800; margin-bottom:12px; display:flex; align-items:center; gap:8px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--primary);"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h18"/></svg>
        My Leave Balances & Quota
      </h3>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:14px;">
        ${userBalances.map(({ type, balance }) => `
          <div style="background:var(--panel-raised); border:1px solid var(--line); border-radius:16px; padding:16px; position:relative; overflow:hidden;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
              <span style="font-weight:700; font-size:0.88rem; color:var(--text);">${type.name}</span>
              <span style="font-size:0.65rem; font-weight:700; padding:2px 8px; border-radius:6px; ${type.isPaid ? 'background:rgba(16,185,129,0.15); color:var(--success);' : 'background:rgba(245,158,11,0.15); color:var(--warning);'}">${type.isPaid ? 'PAID' : 'UNPAID'}</span>
            </div>
            <div style="display:flex; align-items:baseline; gap:6px; margin-bottom:8px;">
              <span style="font-size:1.8rem; font-weight:800; color:${balance.availableBalance > 2 ? '#10b981' : balance.availableBalance > 0 ? '#f59e0b' : '#f43f5e'};">${balance.availableBalance}</span>
              <span style="font-size:0.75rem; color:var(--muted-text);">days available</span>
            </div>
            <div style="font-size:0.72rem; color:var(--muted-text); display:flex; justify-content:space-between; border-top:1px solid var(--line); padding-top:8px;">
              <span>Used: <strong style="color:var(--text);">${balance.used || 0}d</strong></span>
              <span>Quota: <strong style="color:var(--text);">${type.annualAllocation}d/yr</strong></span>
            </div>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="panel" style="background:var(--panel-raised); border:1px solid var(--line); border-radius:20px; padding:20px; margin-bottom:24px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
        <div>
          <h3 style="font-size:1.05rem; font-weight:800; margin:0 0 2px;">My Leave Applications</h3>
          <p style="font-size:0.78rem; color:var(--muted-text); margin:0;">Review approval status and cancel active or pending leave applications anytime.</p>
        </div>
        <div style="display:flex; gap:8px;">
          <span style="font-size:0.75rem; padding:4px 10px; border-radius:8px; background:rgba(16,185,129,0.1); color:var(--success); font-weight:700;">Approved: ${approvedCount}</span>
          <span style="font-size:0.75rem; padding:4px 10px; border-radius:8px; background:rgba(245,158,11,0.1); color:var(--warning); font-weight:700;">Pending: ${pendingCount}</span>
          <span style="font-size:0.75rem; padding:4px 10px; border-radius:8px; background:rgba(100,116,139,0.1); color:var(--muted-text); font-weight:700;">Cancelled: ${cancelledCount}</span>
        </div>
      </div>

      <div class="table-wrap" style="overflow-x:auto;">
        <table>
          <thead>
            <tr>
              <th>Leave Type</th>
              <th>Date Range</th>
              <th>Duration</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Decision Note</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${myRequests.length === 0 ? `
              <tr><td colspan="7" style="text-align:center; padding:32px; color:var(--muted-text);">No leave requests found. Click &ldquo;Apply for Leave&rdquo; above to submit your first request!</td></tr>
            ` : myRequests.map(r => `
              <tr>
                <td><strong style="color:var(--primary);">${r.leaveTypeName}</strong></td>
                <td style="font-family:monospace; font-size:0.8rem;">${r.startDate} ${r.startDate !== r.endDate ? `to ${r.endDate}` : ''}</td>
                <td><strong>${r.totalDays}d</strong></td>
                <td style="font-size:0.8rem; color:var(--muted-text); max-width:200px; word-break:break-word;">${r.reason || '-'}</td>
                <td>${renderLeaveBadge(r.status)}</td>
                <td style="font-size:0.78rem; color:var(--muted-text);">
                  ${r.processedByName ? `<strong>${r.processedByName}</strong>` : '-'}
                  ${r.approvalNote ? `<br><small style="font-style:italic;">&ldquo;${r.approvalNote}&rdquo;</small>` : ''}
                  ${r.rejectionReason ? `<br><small style="color:var(--danger);">&ldquo;${r.rejectionReason}&rdquo;</small>` : ''}
                </td>
                <td style="text-align:right;">
                  ${r.status === 'APPROVED' ? `
                    <button class="secondary-button" style="padding:5px 12px; font-size:0.75rem; color:#f43f5e; border-color:rgba(244,63,94,0.3); font-weight:700; display:inline-flex; align-items:center; gap:4px;" onclick="window.openLeaveModalDialog('cancel', '${r.id}')" title="Cancel this approved leave">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      Cancel Leave
                    </button>
                  ` : r.status === 'PENDING_APPROVAL' ? `
                    <button class="secondary-button" style="padding:5px 12px; font-size:0.75rem; color:var(--warning); border-color:rgba(245,158,11,0.3); font-weight:700; display:inline-flex; align-items:center; gap:4px;" onclick="window.openLeaveModalDialog('cancel', '${r.id}')" title="Cancel this pending request">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      Cancel Request
                    </button>
                  ` : `
                    <span style="font-size:0.75rem; color:var(--muted-text);">-</span>
                  `}
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>

    <div class="panel" style="background:var(--panel-raised); border:1px solid var(--line); border-radius:20px; padding:20px;">
      <h3 style="font-size:1rem; font-weight:800; margin:0 0 14px; display:flex; align-items:center; gap:8px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--warning);"><path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24 7.17a2 2 0 0 1-1.24 1.25L11.35 13l7.18 2.24a2 2 0 0 1 1.24 1.25L22 22Z"/></svg>
        Upcoming Organization Holidays
      </h3>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:12px;">
        ${leaveStore.holidays.map(hol => `
          <div style="padding:12px 16px; background:var(--panel-soft); border:1px solid var(--line); border-radius:12px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <strong style="color:var(--text); font-size:0.85rem;">${hol.name}</strong>
              <p style="font-size:0.72rem; color:var(--muted-text); margin:2px 0 0;">${hol.description || 'Public Holiday'}</p>
            </div>
            <span style="font-family:monospace; font-weight:700; color:var(--primary); font-size:0.8rem; background:rgba(99,102,241,0.1); padding:4px 8px; border-radius:6px;">${hol.date}</span>
          </div>
        `).join("")}
      </div>
    </div>

    ${modalHtml}
  `;
}

function renderLeave() {
  if (!appState.isMockBypass) { $("#leave").innerHTML = panel("Leave management", "Service connection required", `<p class="module-notice">This leave workspace currently uses demonstration data. Connect the leave API to use real requests, balances and approvals.</p>`); return; }
  const currentRole = appState.role || "Super Admin";
  const isSuperAdminOrHR = currentRole === "Super Admin" || currentRole === "HR Admin";

  if (!isSuperAdminOrHR) {
    renderEmployeeLeavePortal();
    return;
  }

  leaveStore.balances.forEach(b=>{b.pending=leaveStore.requests.filter(r=>administrativeEmployee(r)?.id===administrativeEmployee(b)?.id&&r.leaveTypeId===b.leaveTypeId&&['PENDING_APPROVAL','MORE_INFORMATION_REQUIRED'].includes(r.status)).reduce((n,r)=>n+r.totalDays,0);});
  let tabContentHtml = "";
  const filteredRequests = filterLeaveRequestsData();
  const todayStr = new Date().toISOString().slice(0, 10);

  if (leaveStore.activeTab === "overview") {
    const onLeaveTodayCount = leaveStore.requests.filter(r => r.status === "APPROVED" && r.startDate <= todayStr && r.endDate >= todayStr).length;
    const pendingCount = leaveStore.requests.filter(r => r.status === "PENDING_APPROVAL" || r.status === "CANCELLATION_REQUESTED").length;
    const approvedUpcoming = leaveStore.requests.filter(r => r.status === "APPROVED" && r.startDate > todayStr).length;
    const rejectedCount = leaveStore.requests.filter(r => r.status === "REJECTED").length;
    const unpaidDaysCount = leaveStore.requests.filter(r => r.status === "APPROVED" && r.isPaid === false).reduce((sum, r) => sum + r.totalDays, 0);
    const lowBalCount = leaveStore.balances.filter(b => b.availableBalance <= 2).length;
    const conflictCount = leaveStore.requests.filter(r => r.hasOverlappingLeave || r.hasAttendanceConflict).length;
    const onLeaveTodayList = leaveStore.requests.filter(r => r.status === "APPROVED" && r.startDate <= todayStr && r.endDate >= todayStr);

    tabContentHtml = `
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:12px; margin-bottom:24px;">
        <div class="stat-card" onclick="window.switchLeaveTab('requests', 'APPROVED')" style="cursor:pointer; background:var(--panel-raised); border:1px solid var(--line); padding:14px 16px; border-radius:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center;"><span style="color:var(--warning);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h4"/><path d="M12 2v8"/><path d="m4.93 10.93 4.24-4.24"/><path d="m14.83 6.69 4.24 4.24"/></svg></span><span style="font-size:0.7rem; color:var(--muted-text);">View →</span></div>
          <p style="font-size:1.6rem; font-weight:800; color:var(--text); margin:6px 0 2px;">${onLeaveTodayCount}</p>
          <p style="font-size:0.72rem; font-weight:600; color:var(--muted-text);">On Leave Today</p>
        </div>
        <div class="stat-card" onclick="window.switchLeaveTab('requests', 'PENDING_APPROVAL')" style="cursor:pointer; background:var(--panel-raised); border:1px solid var(--line); padding:14px 16px; border-radius:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center;"><span style="color:var(--primary);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span><span style="font-size:0.7rem; color:var(--muted-text);">View →</span></div>
          <p style="font-size:1.6rem; font-weight:800; color:var(--text); margin:6px 0 2px;">${pendingCount}</p>
          <p style="font-size:0.72rem; font-weight:600; color:var(--muted-text);">Pending Requests</p>
        </div>
        <div class="stat-card" onclick="window.switchLeaveTab('requests', 'APPROVED')" style="cursor:pointer; background:var(--panel-raised); border:1px solid var(--line); padding:14px 16px; border-radius:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center;"><span style="color:var(--success);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span><span style="font-size:0.7rem; color:var(--muted-text);">View →</span></div>
          <p style="font-size:1.6rem; font-weight:800; color:var(--text); margin:6px 0 2px;">${approvedUpcoming}</p>
          <p style="font-size:0.72rem; font-weight:600; color:var(--muted-text);">Approved Upcoming</p>
        </div>
        <div class="stat-card" onclick="window.switchLeaveTab('requests', 'REJECTED')" style="cursor:pointer; background:var(--panel-raised); border:1px solid var(--line); padding:14px 16px; border-radius:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center;"><span style="color:var(--danger);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span><span style="font-size:0.7rem; color:var(--muted-text);">View →</span></div>
          <p style="font-size:1.6rem; font-weight:800; color:var(--text); margin:6px 0 2px;">${rejectedCount}</p>
          <p style="font-size:0.72rem; font-weight:600; color:var(--muted-text);">Rejected Requests</p>
        </div>
        <div class="stat-card" onclick="window.switchLeaveTab('reports')" style="cursor:pointer; background:var(--panel-raised); border:1px solid var(--line); padding:14px 16px; border-radius:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center;"><span style="color:var(--warning);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></span><span style="font-size:0.7rem; color:var(--muted-text);">View →</span></div>
          <p style="font-size:1.6rem; font-weight:800; color:var(--text); margin:6px 0 2px;">${unpaidDaysCount}d</p>
          <p style="font-size:0.72rem; font-weight:600; color:var(--muted-text);">Unpaid Leave Days</p>
        </div>
        <div class="stat-card" onclick="window.switchLeaveTab('balances')" style="cursor:pointer; background:var(--panel-raised); border:1px solid var(--line); padding:14px 16px; border-radius:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center;"><span style="color:var(--accent);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span><span style="font-size:0.7rem; color:var(--muted-text);">View →</span></div>
          <p style="font-size:1.6rem; font-weight:800; color:var(--text); margin:6px 0 2px;">${lowBalCount}</p>
          <p style="font-size:0.72rem; font-weight:600; color:var(--muted-text);">Low Balance Alert</p>
        </div>
        <div class="stat-card" onclick="window.switchLeaveTab('requests')" style="cursor:pointer; background:var(--panel-raised); border:1px solid var(--line); padding:14px 16px; border-radius:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center;"><span style="color:var(--primary);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></span><span style="font-size:0.7rem; color:var(--muted-text);">View →</span></div>
          <p style="font-size:1.6rem; font-weight:800; color:var(--text); margin:6px 0 2px;">${conflictCount}</p>
          <p style="font-size:0.72rem; font-weight:600; color:var(--muted-text);">Leave Conflicts</p>
        </div>
        <div class="stat-card" onclick="window.switchLeaveTab('policies')" style="cursor:pointer; background:var(--panel-raised); border:1px solid var(--line); padding:14px 16px; border-radius:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center;"><span style="color:var(--primary);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2H2v10l11.29 11.29a1 1 0 0 0 1.41 0l7.58-7.58a1 1 0 0 0 0-1.41L12 2z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg></span><span style="font-size:0.7rem; color:var(--muted-text);">View →</span></div>
          <p style="font-size:1.6rem; font-weight:800; color:var(--text); margin:6px 0 2px;">${leaveStore.leaveTypes.filter(t => t.isActive).length}</p>
          <p style="font-size:0.72rem; font-weight:600; color:var(--muted-text);">Active Types</p>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: 2fr 1fr; gap:16px;">
        <div class="panel" style="background:var(--panel-raised); border:1px solid var(--line); border-radius:20px; padding:20px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h3 style="font-size:1rem; font-weight:800; color:var(--text);">Pending Review Queue</h3>
            <button class="text-button" onclick="window.switchLeaveTab('requests', 'PENDING_APPROVAL')">View All →</button>
          </div>
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${leaveStore.requests.filter(r => r.status === "PENDING_APPROVAL" || r.status === "CANCELLATION_REQUESTED").length === 0 
              ? `<div style="text-align:center; padding:24px; color:var(--muted-text); font-size:0.8rem;">No pending leave requests requiring review.</div>`
              : leaveStore.requests.filter(r => r.status === "PENDING_APPROVAL" || r.status === "CANCELLATION_REQUESTED").slice(0, 4).map(req => `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; background:var(--panel-soft); border:1px solid var(--line); border-radius:12px;">
                  <div>
                    <strong style="color:var(--text); font-size:0.85rem;">${req.employeeName}</strong> <span style="font-family:monospace; font-size:0.75rem; color:var(--muted-text);">(${req.employeeCode})</span>
                    <p style="font-size:0.75rem; color:var(--muted-text); margin:2px 0 0;">${req.department} • <strong style="color:var(--primary);">${req.leaveTypeName}</strong> (${req.totalDays} day)</p>
                  </div>
                  <div style="display:flex; align-items:center; gap:10px;">
                    ${renderLeaveBadge(req.status)}
                    <button class="primary-button" style="padding:4px 12px; font-size:0.75rem;" onclick="window.openLeaveDrawer('${req.id}')">Review</button>
                  </div>
                </div>
              `).join("")}
          </div>
        </div>
        <div class="panel" style="background:var(--panel-raised); border:1px solid var(--line); border-radius:20px; padding:20px;">
          <h3 style="font-size:1rem; font-weight:800; color:var(--text); margin-bottom:16px;">On Leave Today</h3>
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${onLeaveTodayList.length === 0 
              ? `<div style="text-align:center; padding:24px; color:var(--muted-text); font-size:0.8rem;">No employees on leave today.</div>`
              : onLeaveTodayList.map(req => `
                <div style="padding:10px 14px; background:var(--panel-soft); border:1px solid var(--line); border-radius:12px; display:flex; justify-content:space-between; align-items:center; font-size:0.8rem;">
                  <div><strong style="color:var(--text);">${req.employeeName}</strong><p style="font-size:0.7rem; color:var(--muted-text);">${req.department} • ${req.leaveTypeName}</p></div>
                  <span style="font-family:monospace; color:var(--success); font-weight:700;">${req.startDate === req.endDate ? req.startDate : req.startDate + ' → ' + req.endDate}</span>
                </div>
              `).join("")}
          </div>
        </div>
      </div>
    `;

  } else if (leaveStore.activeTab === "requests") {
    const total = filteredRequests.length;
    const startIdx = (leaveStore.pagination.page - 1) * leaveStore.pagination.limit;
    const paginated = filteredRequests.slice(startIdx, startIdx + leaveStore.pagination.limit);

    tabContentHtml = `
      <div class="panel" style="background:var(--panel-raised, rgba(15,23,42,0.8)); border:1px solid var(--line); border-radius:20px; padding:20px; margin-bottom:16px;">
        <div style="display:flex; flex-wrap:wrap; gap:12px; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <input type="text" value="${escapeAttr(leaveStore.filters.search)}" oninput="window.updateLeaveFilter('search', this.value)" placeholder="Search employee by name, ID, or department..." style="flex:1; min-width:260px; height:40px; border-radius:10px; background:var(--panel-soft); border:1px solid var(--line-strong); padding:0 14px; font-size:0.85rem; color:var(--text);" />
          <div style="display:flex; gap:8px;">
            <button class="secondary-button" style="padding:6px 14px; font-size:0.75rem;" onclick="window.resetLeaveFilters()">Reset Filters</button>
            <button class="secondary-button" style="padding:6px 14px; font-size:0.75rem; color:var(--success);" onclick="window.exportLeaveReportCSV()">Export CSV</button>
          </div>
        </div>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:10px; border-top:1px solid var(--line); padding-top:12px;">
          <div>
            <label style="font-size:0.65rem; font-weight:700; text-transform:uppercase; color:var(--muted-text); display:block; margin-bottom:4px;">Department</label>
            <select class="hist-select" onchange="window.updateLeaveFilter('department', this.value)">
              <option value="ALL">All Departments</option>
              ${[...new Set(leaveStore.requests.map(r => r.department))].sort().map(dept => `<option value="${dept}" ${leaveStore.filters.department === dept ? "selected" : ""}>${dept}</option>`).join("")}
            </select>
          </div>
          <div>
            <label style="font-size:0.65rem; font-weight:700; text-transform:uppercase; color:var(--muted-text); display:block; margin-bottom:4px;">Leave Type</label>
            <select class="hist-select" onchange="window.updateLeaveFilter('leaveTypeId', this.value)">
              <option value="ALL">All Leave Types</option>
              ${leaveStore.leaveTypes.map(t => `<option value="${t.id}" ${leaveStore.filters.leaveTypeId === t.id ? "selected" : ""}>${t.name}</option>`).join("")}
            </select>
          </div>
          <div>
            <label style="font-size:0.65rem; font-weight:700; text-transform:uppercase; color:var(--muted-text); display:block; margin-bottom:4px;">Status</label>
            <select class="hist-select" onchange="window.updateLeaveFilter('status', this.value)">
              <option value="ALL">All Statuses</option>
              <option value="PENDING_APPROVAL" ${leaveStore.filters.status === "PENDING_APPROVAL" ? "selected" : ""}>Pending Approval</option>
              <option value="APPROVED" ${leaveStore.filters.status === "APPROVED" ? "selected" : ""}>Approved</option>
              <option value="REJECTED" ${leaveStore.filters.status === "REJECTED" ? "selected" : ""}>Rejected</option>
              <option value="MORE_INFORMATION_REQUIRED" ${leaveStore.filters.status === "MORE_INFORMATION_REQUIRED" ? "selected" : ""}>More Info Required</option>
              <option value="CANCELLATION_REQUESTED" ${leaveStore.filters.status === "CANCELLATION_REQUESTED" ? "selected" : ""}>Cancellation Requested</option>
            </select>
          </div>
          <div>
            <label style="font-size:0.65rem; font-weight:700; text-transform:uppercase; color:var(--muted-text); display:block; margin-bottom:4px;">Paid Status</label>
            <select class="hist-select" onchange="window.updateLeaveFilter('isPaid', this.value)">
              <option value="ALL">All Paid States</option>
              <option value="PAID" ${leaveStore.filters.isPaid === "PAID" ? "selected" : ""}>Paid</option>
              <option value="UNPAID" ${leaveStore.filters.isPaid === "UNPAID" ? "selected" : ""}>Unpaid</option>
            </select>
          </div>
          <div>
            <label style="font-size:0.65rem; font-weight:700; text-transform:uppercase; color:var(--muted-text); display:block; margin-bottom:4px;">From Date</label>
            <input type="date" value="${leaveStore.filters.startDate || ''}" onchange="window.updateLeaveFilter('startDate', this.value)" style="width:100%; padding:6px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text); font-size:0.75rem;" />
          </div>
        </div>
      </div>
      <div class="table-wrap" style="overflow-x:auto;">
        <table>
          <thead>
            <tr><th>Employee</th><th>Department</th><th>Leave Type</th><th>Dates</th><th>Duration</th><th>Status</th><th style="text-align:right;">Actions</th></tr>
          </thead>
          <tbody>
            ${paginated.length === 0 ? `<tr><td colSpan="7" style="text-align:center; padding:32px; color:var(--muted-text);">No leave requests match your filter selection.</td></tr>`
              : paginated.map(r => `
                <tr>
                  <td><strong>${r.employeeName}</strong><br><span style="font-family:monospace; font-size:0.75rem; color:var(--muted-text);">${r.employeeCode}</span></td>
                  <td>${r.department}</td>
                  <td><strong style="color:var(--primary);">${r.leaveTypeName}</strong></td>
                  <td style="font-family:monospace; font-size:0.8rem;">${r.startDate} ${r.startDate !== r.endDate ? `to ${r.endDate}` : ''}</td>
                  <td><strong>${r.totalDays}d</strong></td>
                  <td>${renderLeaveBadge(r.status)}</td>
                  <td style="text-align:right;">
                    <div style="display:flex; gap:6px; justify-content:flex-end; align-items:center;">
                      <button class="${r.status === 'PENDING_APPROVAL' || r.status === 'CANCELLATION_REQUESTED' ? 'primary-button' : 'secondary-button'}" style="padding:4px 12px; font-size:0.75rem;" onclick="window.openLeaveDrawer('${r.id}')">
                        ${r.status === 'PENDING_APPROVAL' || r.status === 'CANCELLATION_REQUESTED' ? 'Review' : 'View'}
                      </button>
                      ${r.status === 'APPROVED' ? `
                        <button class="secondary-button" style="padding:4px 10px; font-size:0.75rem; color:#f43f5e; border-color:rgba(244,63,94,0.3); font-weight:700;" onclick="window.openLeaveModalDialog('cancel', '${r.id}')" title="Cancel this approved leave">
                          Cancel
                        </button>
                      ` : ''}
                      ${r.status === 'PENDING_APPROVAL' ? `
                        <button class="secondary-button" style="padding:4px 10px; font-size:0.75rem; color:var(--warning); border-color:rgba(245,158,11,0.3); font-weight:700;" onclick="window.openLeaveModalDialog('cancel', '${r.id}')" title="Cancel this request">
                          Cancel
                        </button>
                      ` : ''}
                    </div>
                  </td>
                </tr>
              `).join("")}
          </tbody>
        </table>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px; font-size:0.8rem; color:var(--muted-text);">
        <div>Showing ${total === 0 ? 0 : startIdx + 1} to ${Math.min(total, startIdx + leaveStore.pagination.limit)} of ${total} requests</div>
        <div style="display:flex; gap:6px;">
          <button class="secondary-button" style="padding:4px 10px;" ${leaveStore.pagination.page === 1 ? "disabled" : ""} onclick="window.changeLeavePage(${leaveStore.pagination.page - 1})">Prev</button>
          <button class="secondary-button" style="padding:4px 10px;" ${startIdx + leaveStore.pagination.limit >= total ? "disabled" : ""} onclick="window.changeLeavePage(${leaveStore.pagination.page + 1})">Next</button>
        </div>
      </div>
    `;

  } else if (leaveStore.activeTab === "calendar") {
    const calYear = leaveStore.calendarYear || new Date().getFullYear();
    const calMonth = leaveStore.calendarMonth || (new Date().getMonth() + 1);
    const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const daysInMonth = new Date(calYear, calMonth, 0).getDate();
    const firstDayOfWeek = new Date(calYear, calMonth - 1, 1).getDay();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    tabContentHtml = `
      <div class="panel" style="background:var(--panel-raised, rgba(15,23,42,0.8)); border:1px solid var(--line); border-radius:20px; padding:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <div>
            <h3 style="font-size:1.1rem; font-weight:800; color:var(--text);">Organization Leave & Holiday Calendar</h3>
            <p style="font-size:0.75rem; color:var(--muted-text);">Visual schedule of approved employee leaves, team availability, and organization holidays.</p>
          </div>
          <div style="display:flex; align-items:center; gap:12px;">
            <button class="secondary-button" style="padding:4px 12px; font-size:0.8rem; display:inline-flex; align-items:center; gap:4px;" onclick="window.changeCalendarMonth(-1)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg> Prev</button>
            <span style="font-weight:800; font-size:1rem; color:var(--primary); font-family:monospace; min-width:140px; text-align:center;">${monthNames[calMonth - 1]} ${calYear}</span>
            <button class="secondary-button" style="padding:4px 12px; font-size:0.8rem; display:inline-flex; align-items:center; gap:4px;" onclick="window.changeCalendarMonth(1)">Next <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></button>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(7, 1fr); gap:6px; text-align:center; margin-bottom:8px;">
          ${dayNames.map(d => `<div style="font-size:0.75rem; font-weight:800; color:var(--muted-text); padding:6px; background:var(--panel-soft); border-radius:8px;">${d}</div>`).join("")}
        </div>

        <div style="display:grid; grid-template-columns: repeat(7, 1fr); gap:6px;">
          ${Array.from({ length: firstDayOfWeek }, () => `<div style="background:rgba(2,6,23,0.3); border-radius:10px; min-height:80px;"></div>`).join("")}
          ${Array.from({ length: daysInMonth }, (_, i) => i + 1).map(dayNum => {
            const dateStr = `${calYear}-${String(calMonth).padStart(2,'0')}-${String(dayNum).padStart(2,'0')}`;
            const holiday = leaveStore.holidays.find(h => h.date === dateStr && h.isActive);
            const leavesOnDay = leaveStore.requests.filter(r => r.status === "APPROVED" && r.startDate <= dateStr && r.endDate >= dateStr);
            const isToday = dateStr === todayStr;

            return `
              <div style="background:var(--panel-soft); border:1px solid ${isToday ? 'var(--primary)' : 'var(--line)'}; border-radius:10px; padding:6px; min-height:85px; display:flex; flex-direction:column; justify-content:space-between; ${holiday ? 'background:rgba(45,212,191,0.08); border-color:rgba(45,212,191,0.3);' : ''}">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-weight:800; font-size:0.8rem; font-family:monospace; ${isToday ? 'color:var(--primary);' : 'color:var(--text);'}">${dayNum}</span>
                  ${holiday ? `<span style="font-size:0.6rem; padding:1px 4px; background:rgba(45,212,191,0.2); color:#2dd4bf; border-radius:4px; font-weight:700;">Holiday</span>` : ''}
                </div>
                <div>
                  ${holiday ? `<div style="font-size:0.65rem; color:#2dd4bf; font-weight:700; margin-top:2px; display:inline-flex; align-items:center; gap:3px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/></svg> ${holiday.name}</div>` : ''}
                  ${leavesOnDay.map(l => `<div style="font-size:0.65rem; background:rgba(99,102,241,0.15); color:var(--primary); padding:2px 4px; border-radius:4px; margin-top:2px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:flex; align-items:center; gap:3px;"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> ${l.employeeName} (${l.leaveTypeName})</div>`).join("")}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  } else if (leaveStore.activeTab === "balances") {
    window.ensureAllEmployeeBalancesInitialized();
    tabContentHtml = `
      <div class="panel" style="background:var(--panel-raised, rgba(15,23,42,0.8)); border:1px solid var(--line); border-radius:20px; padding:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
          <div>
            <h3 style="font-size:1.05rem; font-weight:800; color:var(--text); margin:0 0 4px;">Employee Leave Balances & Manual Controls</h3>
            <p style="font-size:0.75rem; color:var(--muted-text); margin:0;">Search annual allocations, used leave and available balances. Filter by department, leave type or remaining days.</p>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button class="secondary-button" style="padding:6px 14px; font-size:0.75rem; font-weight:700; color:var(--primary); border-color:rgba(56,189,248,0.3); display:inline-flex; align-items:center; gap:6px;" ${appState.role !== "Super Admin" ? 'disabled title="Only Super Admin can roll over all balances"' : ''} onclick="window.openLeaveModalDialog('yearEndRollover')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
              Year-End Rollover
            </button>
            <button class="secondary-button" style="padding:6px 14px; font-size:0.75rem; font-weight:700; color:var(--success); border-color:rgba(52,211,153,0.3); display:inline-flex; align-items:center; gap:6px;" onclick="window.openLeaveModalDialog('assignPolicy')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
              Assign Leave Policy to Employees
            </button>
            <button class="primary-button" style="padding:6px 14px; font-size:0.75rem; display:inline-flex; align-items:center; gap:6px;" onclick="window.openLeaveModalDialog('manualLeave')" title="Record an approved absence on behalf of an employee (deducts from balance)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
              Record Employee Absence
            </button>
          </div>
        </div>

        ${window.leaveBalanceToolbar ? window.leaveBalanceToolbar() : ""}
        <div id="balanceEmpty" class="module-empty" hidden>No employee balances match these filters.</div>
        <div class="table-wrap" style="overflow-x:auto;">
          <table>
            <thead>
              <tr><th>Employee</th><th>Department</th><th>Leave Type</th><th style="text-align:center;">Opening</th><th style="text-align:center;">Refilled</th><th style="text-align:center; color:var(--danger);">Used</th><th style="text-align:center; color:var(--warning);">Pending</th><th style="text-align:center; color:var(--success);">Available</th><th style="text-align:right;">Actions</th></tr>
            </thead>

            <tbody>
              ${leaveStore.balances.map(b => {
                const lt = leaveStore.leaveTypes.find(t => t.id === b.leaveTypeId);
                const canEncash = lt && lt.encashmentEnabled && b.availableBalance > 0;
                return `
                <tr data-balance-id="${b.id}">
                  <td><strong>${b.employeeName}</strong><br><span style="font-family:monospace; font-size:0.75rem; color:var(--muted-text);">${b.employeeCode}</span></td>
                  <td>${b.department}</td>
                  <td><strong style="color:var(--primary);">${b.leaveTypeName}</strong></td>
                  <td style="text-align:center; font-family:monospace;">${b.openingBalance}d</td>
                  <td style="text-align:center; font-family:monospace; color:var(--success);">+${b.refilled}d</td>
                  <td style="text-align:center; font-family:monospace; color:var(--danger);">-${b.used}d</td>
                  <td style="text-align:center; font-family:monospace; color:var(--warning);">${b.pending}d</td>
                  <td style="text-align:center; font-family:monospace; font-weight:800; color:${b.availableBalance <= 2 ? '#f87171' : '#34d399'};">${b.availableBalance} days</td>
                  <td style="text-align:right;">
                    <div style="display:flex; justify-content:flex-end; gap:6px;">
                      ${canEncash && canAdministerEmployee(b) ? `
                        <button class="secondary-button" style="padding:4px 10px; font-size:0.75rem; color:var(--primary); border-color:rgba(129,140,248,0.3);" onclick="window.openLeaveModalDialog('encashBalance', '${b.id}')">Encash</button>
                      ` : ''}
                      ${canAdministerEmployee(b) ? `<button class="primary-button" style="padding:4px 10px; font-size:0.75rem;" onclick="window.openLeaveModalDialog('adjustBalance', '${b.id}')">Adjust</button>` : `<span class="muted">Super Admin only</span>`}
                    </div>
                  </td>
                </tr>
              `;}).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (leaveStore.activeTab === "policies") {
    tabContentHtml = `
      <div class="panel" style="background:var(--panel-raised, rgba(15,23,42,0.8)); border:1px solid var(--line); border-radius:20px; padding:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
          <div>
            <h3 style="font-size:1.05rem; font-weight:800; color:var(--text); margin:0 0 4px;">Leave Policies & Allocation Rules</h3>
            <p style="font-size:0.75rem; color:var(--muted-text); margin:0;">Define leave types, general settings (accruals, weekends/holidays, probation/notice) & advanced caps.</p>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="primary-button" style="padding:7px 16px; font-size:0.8rem; display:inline-flex; align-items:center; gap:6px;" onclick="window.openLeaveModalDialog('addType')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Leave Type
            </button>
          </div>
        </div>

        <div class="table-wrap" style="overflow-x:auto;">
          <table>
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Code</th>
                <th>Pay Status</th>
                <th>Annual Quota</th>
                <th>Accrual</th>
                <th>Probation / Notice</th>
                <th>Carry Fwd / Encash</th>
                <th>Status</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${leaveStore.leaveTypes.map(t => {
                const yrQuota = t.leavesAllowedPerYear != null ? t.leavesAllowedPerYear : (t.annualAllocation || 0);
                return `
                <tr>
                  <td>
                    <div style="display:flex; align-items:center; gap:8px;">
                      <span style="width:10px; height:10px; border-radius:50%; background:${t.displayColor || '#6366f1'}; flex-shrink:0;"></span>
                      <div>
                        <strong style="color:var(--text); cursor:pointer;" onclick="window.openLeavePolicyDetail('${t.id}')">${t.name}</strong>
                        <br><span style="font-size:0.72rem; color:var(--muted-text); display:inline-block; max-width:240px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${t.description || '—'}</span>
                      </div>
                    </div>
                  </td>
                  <td style="font-family:monospace; font-weight:800; color:var(--primary);">${t.shortName || t.code}</td>
                  <td>
                    <span style="font-size:0.72rem; padding:3px 8px; border-radius:6px; font-weight:700; ${t.isPaid ? 'background:rgba(16,185,129,0.15); color:var(--success); border:1px solid rgba(16,185,129,0.3);' : 'background:rgba(245,158,11,0.15); color:var(--warning); border:1px solid rgba(245,158,11,0.3);'}">
                      ${t.isPaid ? 'PAID' : 'UNPAID'}
                    </span>
                  </td>
                  <td style="font-family:monospace; font-weight:700; font-size:0.85rem;">${yrQuota} days/yr</td>
                  <td style="font-size:0.78rem;">
                    ${t.creditableOnAccrualBasis ? `<span style="color:var(--success); font-weight:600;">${t.accrualAmount}d / ${(t.accrualFrequency||'MONTHLY').toLowerCase()}</span>` : '<span style="color:var(--muted-text);">Lump-sum (1 Year)</span>'}
                  </td>
                  <td style="font-size:0.75rem;">
                    <span style="color:${t.allowedUnderProbation !== false ? '#34d399' : '#f87171'}; font-weight:600;">Prob: ${t.allowedUnderProbation !== false ? 'Yes' : 'No'}</span>
                    &nbsp;&middot;&nbsp;
                    <span style="color:${t.allowedUnderNoticePeriod ? '#34d399' : '#f87171'}; font-weight:600;">Notice: ${t.allowedUnderNoticePeriod ? 'Yes' : 'No'}</span>
                  </td>
                  <td style="font-size:0.75rem; color:var(--muted-text);">
                    ${t.carryForwardEnabled ? `<span style="color:var(--text); font-weight:600;">Max ${t.maximumCarryForward || '∞'}d</span>` : 'No CF'}
                    &nbsp;&middot;&nbsp;
                    ${t.encashmentEnabled ? '<span style="color:var(--primary); font-weight:600;">Encash: Yes</span>' : 'Encash: No'}
                  </td>
                  <td>
                    <span style="font-size:0.72rem; padding:2px 8px; border-radius:99px; ${t.isActive ? 'background:rgba(16,185,129,0.12); color:var(--success); border:1px solid rgba(16,185,129,0.3);' : 'background:rgba(100,116,139,0.12); color:var(--muted-text); border:1px solid rgba(100,116,139,0.3);'} font-weight:700;">
                      ${t.isActive ? 'Active' : 'Archived'}
                    </span>
                  </td>
                  <td style="text-align:right;">
                    <div style="display:flex; gap:6px; justify-content:flex-end; align-items:center;">
                      <button class="secondary-button" style="padding:4px 8px; font-size:0.75rem; font-weight:600; color:var(--primary); display:inline-flex; align-items:center; gap:4px;" onclick="window.openLeavePolicyDetail('${t.id}')" title="View Policy Details">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        View Details
                      </button>
                      <button class="secondary-button" style="padding:4px 8px; font-size:0.75rem; display:inline-flex; align-items:center; gap:4px;" onclick="window.openLeaveModalDialog('editType', '${t.id}')" title="Edit Policy">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                        Edit
                      </button>
                      ${t.isActive ? `<button class="secondary-button" style="padding:4px 8px; font-size:0.75rem; color:var(--warning); border-color:rgba(245,158,11,0.3); display:inline-flex; align-items:center; gap:4px;" onclick="window.archiveLeaveTypeAction('${t.id}')" title="Archive Policy">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>
                        Archive
                      </button>` : ''}
                      <button class="secondary-button" style="padding:4px 8px; font-size:0.75rem; color:var(--danger); border-color:rgba(239,68,68,0.3); display:inline-flex; align-items:center; gap:4px;" onclick="window.openDeleteLeavePolicyModal('${t.id}')" title="Delete Policy">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (leaveStore.activeTab === "holidays") {
    tabContentHtml = `
      <div class="panel" style="background:var(--panel-raised, rgba(15,23,42,0.8)); border:1px solid var(--line); border-radius:20px; padding:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <div><h3 style="font-size:1rem; font-weight:800;">Holiday Calendar</h3><p style="font-size:0.75rem; color:var(--muted-text);">Company holidays and scheduled non-working days for 2026.</p></div>
          <button class="primary-button" style="padding:6px 14px; font-size:0.75rem;" onclick="window.openLeaveModalDialog('addHoliday')">+ Add Holiday</button>
        </div>

        <div class="table-wrap" style="overflow-x:auto;">
          <table>
            <thead>
              <tr><th>Holiday Name</th><th>Date</th><th>Description</th><th>Recurring</th><th>Status</th><th style="text-align:right;">Actions</th></tr>
            </thead>
            <tbody>
              ${leaveStore.holidays.map(h => `
                <tr>
                  <td><strong>${h.name}</strong></td>
                  <td style="font-family:monospace; font-weight:700; color:#2dd4bf;">${h.date}</td>
                  <td style="color:var(--muted-text);">${h.description || '—'}</td>
                  <td><span style="font-size:0.75rem; font-family:monospace;">${h.recurringAnnually ? 'Yes (Annual)' : 'One-time'}</span></td>
                  <td><span style="font-size:0.75rem; padding:2px 8px; border-radius:99px; ${h.isActive ? 'background:rgba(16,185,129,0.1); color:var(--success);' : 'background:rgba(100,116,139,0.1); color:var(--muted-text);'}">${h.isActive ? 'Active' : 'Archived'}</span></td>
                  <td style="text-align:right;">
                    <button class="secondary-button" style="padding:4px 10px; font-size:0.75rem;" onclick="window.openLeaveModalDialog('editHoliday', '${h.id}')">Edit</button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (leaveStore.activeTab === "audit") {
    tabContentHtml = `
      <div class="panel" style="background:var(--panel-raised, rgba(15,23,42,0.8)); border:1px solid var(--line); border-radius:20px; padding:20px;">
        <div style="margin-bottom:16px;">
          <h3 style="font-size:1rem; font-weight:800; display:flex; align-items:center; gap:8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            Demo Audit History
          </h3>
          <p style="font-size:0.75rem; color:var(--muted-text);">Sample history of leave actions, policy updates and manual adjustments. Production auditing requires server-side storage.</p>
        </div>

        <div class="table-wrap" style="overflow-x:auto;">
          <table>
            <thead>
              <tr><th>Audit ID</th><th>Performed By</th><th>Role</th><th>Action Type</th><th>Target Employee</th><th>Reason</th><th>Timestamp</th></tr>
            </thead>
            <tbody>
              ${leaveStore.auditLogs.map(log => `
                <tr>
                  <td style="font-family:monospace; color:var(--primary); font-weight:700;">${log.id}</td>
                  <td><strong>${log.performedBy}</strong></td>
                  <td style="font-family:monospace; color:var(--warning); font-size:0.75rem;">${log.userRole}</td>
                  <td><strong>${log.action}</strong></td>
                  <td style="font-family:monospace;">${log.employeeName || log.employeeId}</td>
                  <td style="color:var(--muted-text);">${log.reason}</td>
                  <td style="font-family:monospace; font-size:0.75rem; color:var(--muted-text);">${new Date(log.createdAt).toLocaleString('en-GB')}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (leaveStore.activeTab === "reports") {
    const totalApprovedDays = leaveStore.requests.filter(r => r.status === "APPROVED").reduce((sum, r) => sum + r.totalDays, 0);
    tabContentHtml = `
      <div class="panel" style="background:var(--panel-raised); border:1px solid var(--line); border-radius:20px; padding:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
          <div>
            <h3 style="font-size:1.15rem; font-weight:800; color:var(--text); margin:0;">Leave Analytics & Consumption Report</h3>
            <p style="font-size:0.8rem; color:var(--muted-text); margin:4px 0 0;">Organization-wide leave consumption overview</p>
          </div>
          <button class="primary-button" onclick="window.exportLeaveReportCSV()">Export Detailed CSV</button>
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
          <div style="background:var(--panel-soft); border:1px solid var(--line); border-radius:16px; padding:20px;">
            <h4 style="font-size:0.9rem; font-weight:800; margin-bottom:12px;">Department Utilization</h4>
            <div style="display:flex; flex-direction:column; gap:10px;">
              ${[...new Set(employees.map(e => e.dept))].map(dept => {
                const count = leaveStore.requests.filter(r => r.department === dept && r.status === "APPROVED").reduce((sum, r) => sum + r.totalDays, 0);
                const pct = totalApprovedDays > 0 ? Math.min(100, Math.round((count / totalApprovedDays) * 100)) : 0;
                return `
                  <div>
                    <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:4px;">
                      <strong>${dept}</strong>
                      <span style="font-family:monospace; color:var(--muted-text);">${count} days (${pct}%)</span>
                    </div>
                    <div style="height:8px; background:rgba(2,6,23,0.5); border-radius:99px; overflow:hidden;">
                      <div style="width:${pct}%; height:100%; background:var(--primary); border-radius:99px;"></div>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
          <div style="background:var(--panel-soft); border:1px solid var(--line); border-radius:16px; padding:20px;">
            <h4 style="font-size:0.9rem; font-weight:800; margin-bottom:12px;">Leave Type Breakdown</h4>
            <div style="display:flex; flex-direction:column; gap:10px;">
              ${leaveStore.leaveTypes.filter(t => t.isActive).map(type => {
                const count = leaveStore.requests.filter(r => r.leaveTypeId === type.id && r.status === "APPROVED").reduce((sum, r) => sum + r.totalDays, 0);
                const pct = totalApprovedDays > 0 ? Math.min(100, Math.round((count / totalApprovedDays) * 100)) : 0;
                return `
                  <div>
                    <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:4px;">
                      <strong>${type.name}</strong>
                      <span style="font-family:monospace; color:var(--muted-text);">${count} days (${pct}%)</span>
                    </div>
                    <div style="height:8px; background:rgba(2,6,23,0.5); border-radius:99px; overflow:hidden;">
                      <div style="width:${pct}%; height:100%; background:#818cf8; border-radius:99px;"></div>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    tabContentHtml = `<div style="padding:40px; text-align:center; color:var(--muted-text);">Under development.</div>`;
  }

  let drawerHtml = "";
  if (leaveStore.activeDrawerReqId) {
    const req = leaveStore.requests.find(r => r.id === leaveStore.activeDrawerReqId);
    if (req) {
      (() => {
        const lBal = leaveStore.balances.find(b => b.employeeId === req.employeeId && b.leaveTypeId === req.leaveTypeId);
        const currentBal = lBal ? lBal.availableBalance : (req.currentBalance ?? 0);
        const balAfter = Math.max(0, currentBal - req.totalDays);
        const isPending = req.status === "PENDING_APPROVAL";
        const isCancelReq = req.status === "CANCELLATION_REQUESTED";
        const isApproved = req.status === "APPROVED";
        const canAct = canAdministerEmployee(req) && (isPending || isCancelReq || isApproved);
        const statusMap = {
          PENDING_APPROVAL: { bg: 'rgba(251,191,36,0.12)', color: '#fbbf24', label: 'Pending Approval' },
          CANCELLATION_REQUESTED: { bg: 'rgba(251,146,60,0.12)', color: '#fb923c', label: 'Cancellation Requested' },
          APPROVED: { bg: 'rgba(52,211,153,0.12)', color: '#34d399', label: 'Approved' },
          REJECTED: { bg: 'rgba(248,113,113,0.12)', color: '#f87171', label: 'Rejected' },
          CANCELLED: { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8', label: 'Cancelled' }
        };
        const sc = statusMap[req.status] || { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8', label: req.status };
        drawerHtml = `
        <div style="position:fixed; inset:0; z-index:100; display:flex; justify-content:flex-end;">
          <div onclick="window.closeLeaveDrawer()" style="position:absolute; inset:0; background:rgba(2,6,23,0.75); backdrop-filter:blur(4px);"></div>
          <div style="position:relative; width:100%; max-width:620px; height:100%; background:var(--panel-raised); border-left:1px solid var(--line); overflow:hidden; z-index:101; display:flex; flex-direction:column;">

            <div style="display:flex; justify-content:space-between; align-items:flex-start; padding:20px 24px 16px; border-bottom:1px solid var(--line); flex-shrink:0;">
              <div style="flex:1; min-width:0;">
                <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:6px;">
                  <h2 style="font-size:1.15rem; font-weight:800; color:var(--text); margin:0;">${req.employeeName}</h2>
                  <span style="font-size:0.68rem; padding:3px 10px; border-radius:99px; background:${sc.bg}; color:${sc.color}; font-weight:700; white-space:nowrap; flex-shrink:0;">${sc.label}</span>
                </div>
                <p style="font-size:0.78rem; color:var(--muted-text); margin:0; font-family:monospace;">${req.employeeCode} &middot; ${req.department}</p>
              </div>
              <button onclick="window.closeLeaveDrawer()" style="flex-shrink:0; margin-left:12px; background:var(--panel-soft); border:1px solid var(--line); border-radius:8px; padding:7px 9px; cursor:pointer; color:var(--muted-text); display:inline-flex; align-items:center; transition:background 0.2s;" title="Close">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div style="flex:1; display:flex; flex-direction:column; gap:14px; padding:20px 24px; overflow-y:auto;">
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                <div style="background:var(--panel-soft); padding:14px 16px; border-radius:12px; border:1px solid var(--line);">
                  <div style="font-size:0.62rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--muted-text); margin-bottom:5px;">Leave Type</div>
                  <div style="font-size:0.92rem; font-weight:800; color:var(--primary);">${req.leaveTypeName}</div>
                  <div style="font-size:0.7rem; margin-top:3px;">${req.isPaid ? '<span style="color:var(--success); font-weight:600;">Paid Leave</span>' : '<span style="color:var(--warning); font-weight:600;">Unpaid Leave</span>'}</div>
                </div>
                <div style="background:var(--panel-soft); padding:14px 16px; border-radius:12px; border:1px solid var(--line);">
                  <div style="font-size:0.62rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--muted-text); margin-bottom:5px;">Day Type</div>
                  <div style="font-size:0.92rem; font-weight:800; color:var(--text);">${req.dayType === 'HALF_DAY' ? 'Half Day' : 'Full Day'}</div>
                  <div style="font-size:0.7rem; color:var(--muted-text); margin-top:3px; font-family:monospace;">${req.totalDays} day${req.totalDays !== 1 ? 's' : ''} total</div>
                </div>
              </div>

              <div style="background:var(--panel-soft); padding:14px 16px; border-radius:12px; border:1px solid var(--line);">
                <div style="font-size:0.62rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--muted-text); margin-bottom:8px;">Dates</div>
                <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
                  <span style="font-family:monospace; font-weight:800; color:var(--text); font-size:0.92rem;">${req.startDate}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--muted-text); flex-shrink:0;"><polyline points="9 18 15 12 9 6"/></svg>
                  <span style="font-family:monospace; font-weight:800; color:var(--text); font-size:0.92rem;">${req.endDate}</span>
                  <span style="font-size:0.72rem; padding:2px 8px; background:rgba(99,102,241,0.12); color:var(--primary); border-radius:4px; font-weight:700; font-family:monospace;">${req.totalDays}d</span>
                </div>
              </div>

              <div style="background:var(--panel-soft); padding:14px 16px; border-radius:12px; border:1px solid var(--line);">
                <div style="font-size:0.62rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--muted-text); margin-bottom:10px;">Balance Impact</div>
                <div style="display:flex; justify-content:space-around; align-items:center; gap:8px;">
                  <div style="text-align:center;">
                    <div style="font-size:0.68rem; color:var(--muted-text); margin-bottom:3px;">Current</div>
                    <div style="font-size:1.4rem; font-weight:800; font-family:monospace; color:var(--text);">${currentBal}<small style="font-size:0.7rem;">d</small></div>
                  </div>
                  <div style="display:flex; align-items:center; gap:4px; color:var(--primary); font-weight:800;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    <span style="font-size:0.88rem;">-${req.totalDays}d</span>
                  </div>
                  <div style="text-align:center;">
                    <div style="font-size:0.68rem; color:var(--muted-text); margin-bottom:3px;">After</div>
                    <div style="font-size:1.4rem; font-weight:800; font-family:monospace; color:${balAfter <= 0 ? '#f87171' : '#34d399'};">${balAfter}<small style="font-size:0.7rem;">d</small></div>
                  </div>
                </div>
              </div>

              <div style="background:var(--panel-soft); padding:14px 16px; border-radius:12px; border:1px solid var(--line);">
                <div style="font-size:0.62rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--muted-text); margin-bottom:6px;">Reason / Notes</div>
                <p style="font-size:0.85rem; color:var(--text); line-height:1.55; margin:0;">${req.reason || '<em style="color:var(--muted-text)">No reason provided</em>'}</p>
              </div>

              ${req.attachmentName ? `
              <div style="background:var(--panel-soft); padding:12px 16px; border-radius:12px; border:1px solid var(--line); display:flex; align-items:center; gap:12px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--primary); flex-shrink:0;"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                <div>
                  <div style="font-size:0.62rem; color:var(--muted-text); font-weight:700; text-transform:uppercase; margin-bottom:2px;">Attachment</div>
                  <div style="font-size:0.82rem; font-weight:700; color:var(--text);">${req.attachmentName}</div>
                </div>
              </div>` : ''}

              <div style="font-size:0.72rem; color:var(--muted-text); text-align:right;">Submitted: ${new Date(req.submittedAt).toLocaleString('en-GB')}</div>
            </div>

            ${!canAdministerEmployee(req) ? '<p class="module-note" style="margin:16px">Only Super Admin can approve or reject administrator leave requests.</p>' : ''}
            ${canAct ? `
            <div style="padding:16px 24px; border-top:1px solid var(--line); background:var(--panel-raised); display:flex; gap:10px; flex-wrap:wrap; flex-shrink:0;">
              ${isPending ? `
              <button class="primary-button" style="flex:1; min-width:110px; display:inline-flex; align-items:center; justify-content:center; gap:6px;" onclick="window.openLeaveModalDialog('approve', '${req.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Approve
              </button>
              <button class="primary-button" style="flex:1; min-width:110px; background:#f43f5e; display:inline-flex; align-items:center; justify-content:center; gap:6px;" onclick="window.openLeaveModalDialog('reject', '${req.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                Reject
              </button>` : ''}
              ${isCancelReq ? `
              <button class="primary-button" style="flex:1; min-width:140px; display:inline-flex; align-items:center; justify-content:center; gap:6px;" onclick="window.openLeaveModalDialog('approve', '${req.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Approve Cancellation
              </button>
              <button class="primary-button" style="flex:1; min-width:140px; background:#f43f5e; display:inline-flex; align-items:center; justify-content:center; gap:6px;" onclick="window.openLeaveModalDialog('reject', '${req.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                Reject Cancellation
              </button>` : ''}
              ${isApproved ? `
              <button class="primary-button" style="flex:1; min-width:140px; background:#f43f5e; display:inline-flex; align-items:center; justify-content:center; gap:6px;" onclick="window.openLeaveModalDialog('cancel', '${req.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                Cancel / Revoke Leave
              </button>` : ''}
            </div>` : ''}

          </div>
        </div>
      `;
      })();
    }
  }

  let modalHtml = "";
  if (leaveStore.activeModal === "approve") {
    const req = leaveStore.requests.find(r => r.id === leaveStore.modalPayload);
    if (req) {
      modalHtml = `
        <div style="position:fixed; inset:0; z-index:110; display:flex; align-items:center; justify-content:center; padding:16px;">
          <div onclick="window.closeLeaveModalDialog()" style="position:absolute; inset:0; background:rgba(2,6,23,0.75); backdrop-filter:blur(4px);"></div>
          <div style="position:relative; width:100%; max-width:480px; background:var(--panel-raised); border:1px solid var(--line); border-radius:20px; padding:24px; z-index:111; color:var(--text);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
              <h3 style="font-size:1.1rem; font-weight:800; color:var(--text); margin:0;">Approve Leave Request</h3>
              <button onclick="window.closeLeaveModalDialog()" style="background:var(--panel-soft); border:1px solid var(--line); border-radius:8px; padding:4px 8px; cursor:pointer; color:var(--muted-text);">✕</button>
            </div>
            <div style="background:var(--panel-soft); padding:14px; border-radius:12px; border:1px solid var(--line); margin-bottom:16px; font-size:0.82rem; display:flex; flex-direction:column; gap:6px;">
              <div><strong>Employee:</strong> ${req.employeeName} <span style="font-family:monospace; color:var(--muted-text);">(${req.employeeCode})</span></div>
              <div><strong>Leave Type:</strong> <span style="color:var(--primary); font-weight:700;">${req.leaveTypeName}</span> &nbsp;&middot;&nbsp; <strong>${req.totalDays} day(s)</strong></div>
              <div><strong>Dates:</strong> <span style="font-family:monospace;">${req.startDate} to ${req.endDate}</span></div>
            </div>
            <div style="margin-bottom:16px;">
              <label style="font-size:0.75rem; font-weight:700; color:var(--muted-text); display:block; margin-bottom:6px;">Approval Note / Comments (Optional)</label>
              <input type="text" id="approvalNoteInput" placeholder="Add an optional note for the employee..." style="width:100%; padding:10px; border-radius:10px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text); font-size:0.8rem;" />
            </div>
            <div style="display:flex; gap:10px;">
              <button type="button" class="secondary-button" style="flex:1;" onclick="window.closeLeaveModalDialog()">Cancel</button>
              <button type="button" class="primary-button" style="flex:1; background:#10b981;" onclick="window.executeLeaveApprove('${req.id}')">Confirm Approval</button>
            </div>
          </div>
        </div>
      `;
    }
  } else if (leaveStore.activeModal === "reject") {
    const req = leaveStore.requests.find(r => r.id === leaveStore.modalPayload);
    if (req) {
      modalHtml = `
        <div style="position:fixed; inset:0; z-index:110; display:flex; align-items:center; justify-content:center; padding:16px;">
          <div onclick="window.closeLeaveModalDialog()" style="position:absolute; inset:0; background:rgba(2,6,23,0.75); backdrop-filter:blur(4px);"></div>
          <div style="position:relative; width:100%; max-width:480px; background:var(--panel-raised); border:1px solid var(--line); border-radius:20px; padding:24px; z-index:111; color:var(--text);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
              <h3 style="font-size:1.1rem; font-weight:800; color:#f43f5e; margin:0;">Reject Leave Request</h3>
              <button onclick="window.closeLeaveModalDialog()" style="background:var(--panel-soft); border:1px solid var(--line); border-radius:8px; padding:4px 8px; cursor:pointer; color:var(--muted-text);">✕</button>
            </div>
            <div style="background:var(--panel-soft); padding:14px; border-radius:12px; border:1px solid var(--line); margin-bottom:16px; font-size:0.82rem; display:flex; flex-direction:column; gap:6px;">
              <div><strong>Employee:</strong> ${req.employeeName} <span style="font-family:monospace; color:var(--muted-text);">(${req.employeeCode})</span></div>
              <div><strong>Leave Type:</strong> <span style="color:var(--primary); font-weight:700;">${req.leaveTypeName}</span> &nbsp;&middot;&nbsp; <strong>${req.totalDays} day(s)</strong></div>
              <div><strong>Dates:</strong> <span style="font-family:monospace;">${req.startDate} to ${req.endDate}</span></div>
            </div>
            <div style="margin-bottom:16px;">
              <label style="font-size:0.75rem; font-weight:700; color:var(--text); display:block; margin-bottom:6px;">Rejection Reason <span style="color:#f43f5e;">*</span> <small style="color:var(--muted-text); font-weight:normal;">(Mandatory, 5 - 500 characters)</small></label>
              <textarea id="rejectionReasonInput" rows="3" required placeholder="Explain why this request is rejected..." style="width:100%; padding:10px; border-radius:10px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text); font-size:0.8rem; resize:vertical;"></textarea>
            </div>
            <div style="display:flex; gap:10px;">
              <button type="button" class="secondary-button" style="flex:1;" onclick="window.closeLeaveModalDialog()">Cancel</button>
              <button type="button" class="primary-button" style="flex:1; background:#f43f5e;" onclick="window.executeLeaveReject('${req.id}')">Confirm Rejection</button>
            </div>
          </div>
        </div>
      `;
    }
  } else if (leaveStore.activeModal === "cancel") {
    const req = leaveStore.requests.find(r => r.id === leaveStore.modalPayload);
    if (req) {
      modalHtml = `
        <div style="position:fixed; inset:0; z-index:110; display:flex; align-items:center; justify-content:center; padding:16px;">
          <div onclick="window.closeLeaveModalDialog()" style="position:absolute; inset:0; background:rgba(2,6,23,0.75); backdrop-filter:blur(4px);"></div>
          <div style="position:relative; width:100%; max-width:480px; background:var(--panel-raised); border:1px solid var(--line); border-radius:20px; padding:24px; z-index:111; color:var(--text);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
              <h3 style="font-size:1.15rem; font-weight:800; color:#f43f5e; margin:0; display:flex; align-items:center; gap:8px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                Cancel Leave
              </h3>
              <button onclick="window.closeLeaveModalDialog()" style="background:var(--panel-soft); border:1px solid var(--line); border-radius:8px; padding:4px 8px; cursor:pointer; color:var(--muted-text);">✕</button>
            </div>
            <p style="font-size:0.85rem; color:var(--muted-text); margin:0 0 14px;">
              Are you sure you want to cancel this leave? The consumed quota (${req.totalDays} day${req.totalDays > 1 ? 's' : ''}) will be automatically restored to the employee balance.
            </p>
            <div style="background:var(--panel-soft); padding:14px; border-radius:12px; border:1px solid var(--line); margin-bottom:16px; font-size:0.82rem; display:flex; flex-direction:column; gap:6px;">
              <div><strong>Employee:</strong> ${req.employeeName} <span style="font-family:monospace; color:var(--muted-text);">(${req.employeeCode})</span></div>
              <div><strong>Leave Type:</strong> <span style="color:var(--primary); font-weight:700;">${req.leaveTypeName}</span> &nbsp;&middot;&nbsp; <strong>${req.totalDays} day(s)</strong></div>
              <div><strong>Dates:</strong> <span style="font-family:monospace;">${req.startDate} ${req.startDate !== req.endDate ? 'to ' + req.endDate : ''}</span></div>
              <div><strong>Current Status:</strong> ${renderLeaveBadge(req.status)}</div>
            </div>
            <div style="margin-bottom:16px;">
              <label style="font-size:0.75rem; font-weight:700; color:var(--text); display:block; margin-bottom:6px;">Cancellation Reason / Remarks (Optional)</label>
              <textarea id="cancelReasonInput" rows="2" placeholder="e.g. Plans changed / meeting rescheduled..." style="width:100%; padding:10px; border-radius:10px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text); font-size:0.8rem; resize:vertical;"></textarea>
            </div>
            <div style="display:flex; gap:10px;">
              <button type="button" class="secondary-button" style="flex:1;" onclick="window.closeLeaveModalDialog()">Keep Leave</button>
              <button type="button" class="primary-button" style="flex:1; background:#f43f5e;" onclick="window.executeLeaveCancel('${req.id}')">Confirm Cancel Leave</button>
            </div>
          </div>
        </div>
      `;
    }
  } else if (leaveStore.activeModal === "manualLeave") {
    modalHtml = `
      <div style="position:fixed; inset:0; z-index:110; display:flex; align-items:center; justify-content:center; padding:16px;">
        <div onclick="window.closeLeaveModalDialog()" style="position:absolute; inset:0; background:rgba(2,6,23,0.75); backdrop-filter:blur(4px);"></div>
        <div style="position:relative; width:100%; max-width:520px; background:var(--panel-raised); border:1px solid var(--line); border-radius:20px; padding:24px; z-index:111; color:var(--text);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h3 style="font-size:1.15rem; font-weight:800; color:var(--text); margin:0;">Manual Leave Addition</h3>
            <button onclick="window.closeLeaveModalDialog()" style="background:var(--panel-soft); border:1px solid var(--line); border-radius:8px; padding:4px 8px; cursor:pointer; color:var(--muted-text);">✕</button>
          </div>
          <form onsubmit="window.executeManualLeaveSave(event)" style="display:flex; flex-direction:column; gap:14px; font-size:0.8rem;">
            <div>
              <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Select Employee *</label>
              <select name="employeeId" required style="width:100%; padding:9px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);">
                ${employees.filter(canAdministerEmployee).map(e => `<option value="${e.id}">${e.name} (${e.id}) - ${e.dept}</option>`).join("")}
              </select>
            </div>
            <div>
              <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Leave Type *</label>
              <select name="leaveTypeId" required style="width:100%; padding:9px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);">
                ${leaveStore.leaveTypes.filter(t => t.isActive).map(t => `<option value="${t.id}">${t.name} (${t.code}) - ${t.isPaid ? 'Paid' : 'Unpaid'}</option>`).join("")}
              </select>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
              <div>
                <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Start Date *</label>
                <input type="date" name="startDate" required style="width:100%; padding:8px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);" />
              </div>
              <div>
                <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">End Date *</label>
                <input type="date" name="endDate" required style="width:100%; padding:8px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);" />
              </div>
            </div>
            <div>
              <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Day Type *</label>
              <select name="dayType" style="width:100%; padding:9px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);">
                <option value="FULL_DAY">Full Day</option>
                <option value="HALF_DAY">Half Day (0.5 day)</option>
              </select>
            </div>
            <div>
              <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Reason / Notes *</label>
              <input type="text" name="reason" placeholder="Reason for manual leave..." required style="width:100%; padding:9px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);" />
            </div>
            <div>
              <label style="font-weight:700; color:var(--text); display:block; margin-bottom:4px;">Mandatory Audit Reason <span style="color:#f43f5e;">*</span> <small style="color:var(--muted-text); font-weight:normal;">(For immutable audit log)</small></label>
              <input type="text" name="manualEntryReason" placeholder="Administrative reason for manual entry (min 5 chars)..." required style="width:100%; padding:9px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);" />
            </div>
            <div style="display:flex; gap:10px; margin-top:8px;">
              <button type="button" class="secondary-button" style="flex:1;" onclick="window.closeLeaveModalDialog()">Cancel</button>
              <button type="submit" class="primary-button" style="flex:1;">Submit Manual Leave Entry</button>
            </div>
          </form>
        </div>
      </div>
    `;
  } else if (leaveStore.activeModal === "adjustBalance") {
    const bal = leaveStore.balances.find(b => b.id === leaveStore.modalPayload);
    if (bal) {
      modalHtml = `
        <div style="position:fixed; inset:0; z-index:110; display:flex; align-items:center; justify-content:center; padding:16px;">
          <div onclick="window.closeLeaveModalDialog()" style="position:absolute; inset:0; background:rgba(2,6,23,0.75); backdrop-filter:blur(4px);"></div>
          <div style="position:relative; width:100%; max-width:480px; background:var(--panel-raised); border:1px solid var(--line); border-radius:20px; padding:24px; z-index:111; color:var(--text);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
              <h3 style="font-size:1.1rem; font-weight:800; color:var(--text); margin:0;">Adjust Employee Leave Balance</h3>
              <button onclick="window.closeLeaveModalDialog()" style="background:var(--panel-soft); border:1px solid var(--line); border-radius:8px; padding:4px 8px; cursor:pointer; color:var(--muted-text);">✕</button>
            </div>
            <div style="background:var(--panel-soft); padding:14px; border-radius:12px; border:1px solid var(--line); margin-bottom:16px; font-size:0.82rem; display:flex; flex-direction:column; gap:6px;">
              <div><strong>Employee:</strong> ${bal.employeeName} <span style="font-family:monospace; color:var(--muted-text);">(${bal.employeeCode})</span></div>
              <div><strong>Leave Type:</strong> <span style="color:var(--primary); font-weight:700;">${bal.leaveTypeName}</span></div>
              <div><strong>Current Balance:</strong> <span style="font-family:monospace; font-weight:800; color:var(--success);">${bal.availableBalance} days</span></div>
            </div>
            <form onsubmit="window.executeBalanceAdjustmentSave(event)" style="display:flex; flex-direction:column; gap:14px; font-size:0.8rem;">
              <input type="hidden" name="balanceId" value="${bal.id}" />
              <div>
                <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Adjustment Action *</label>
                <select name="adjType" style="width:100%; padding:9px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);">
                  <option value="CREDIT">Add Balance (Credit +)</option>
                  <option value="DEDUCT">Deduct Balance (Debit -)</option>
                </select>
              </div>
              <div>
                <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Days to Adjust *</label>
                <input type="number" name="days" min="0.5" step="0.5" value="1" required style="width:100%; padding:8px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);" />
              </div>
              <div>
                <label style="font-weight:700; color:var(--text); display:block; margin-bottom:4px;">Mandatory Audit Reason <span style="color:#f43f5e;">*</span> <small style="color:var(--muted-text); font-weight:normal;">(For immutable audit log)</small></label>
                <input type="text" name="reason" placeholder="Reason for balance adjustment (min 5 chars)..." required style="width:100%; padding:9px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);" />
              </div>
              <div style="display:flex; gap:10px; margin-top:8px;">
                <button type="button" class="secondary-button" style="flex:1;" onclick="window.closeLeaveModalDialog()">Cancel</button>
                <button type="submit" class="primary-button" style="flex:1;">Confirm Balance Adjustment</button>
              </div>
            </form>
          </div>
        </div>
      `;
    }
  } else if (leaveStore.activeModal === "assignPolicy") {
    const activeLeaveTypes = leaveStore.leaveTypes.filter(t => t.isActive);
    const firstType = activeLeaveTypes[0];
    const defaultQuota = firstType ? (firstType.leavesAllowedPerYear != null ? firstType.leavesAllowedPerYear : (firstType.annualAllocation || 0)) : 12;
    const depts = Array.from(new Set(employees.map(e => e.dept || "Engineering")));

    modalHtml = `
      <div style="position:fixed; inset:0; z-index:110; display:flex; align-items:center; justify-content:center; padding:16px;">
        <div onclick="window.closeLeaveModalDialog()" style="position:absolute; inset:0; background:rgba(2,6,23,0.75); backdrop-filter:blur(4px);"></div>
        <div style="position:relative; width:100%; max-width:620px; max-height:90vh; overflow-y:auto; background:var(--panel-raised); border:1px solid var(--line); border-radius:20px; padding:24px; z-index:111; color:var(--text); box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);">
          
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px;">
            <div>
              <h3 style="font-size:1.2rem; font-weight:800; color:var(--text); margin:0 0 4px; display:flex; align-items:center; gap:8px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                Assign Leave Policy & Quota to Employees
              </h3>
              <p style="font-size:0.78rem; color:var(--muted-text); margin:0;">Allocate annual lump-sum leave entitlements for the 1-year cycle.</p>
            </div>
            <button onclick="window.closeLeaveModalDialog()" style="background:var(--panel-soft); border:1px solid var(--line); border-radius:8px; padding:4px 8px; cursor:pointer; color:var(--muted-text);">✕</button>
          </div>

          <form onsubmit="window.executeAssignPolicySave(event)" style="display:flex; flex-direction:column; gap:14px; font-size:0.8rem;">
            
            <!-- Step 1: Select Policy & Quota -->
            <div style="background:var(--panel-soft); padding:14px; border-radius:12px; border:1px solid var(--line); display:flex; flex-direction:column; gap:10px;">
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                <div>
                  <label style="font-weight:700; color:var(--text); display:block; margin-bottom:4px;">Select Leave Policy *</label>
                  <select name="leaveTypeId" id="assignPolicyTypeId" required onchange="window.updateAssignPolicyDefaults()" style="width:100%; padding:9px; border-radius:8px; background:var(--panel-raised); border:1px solid var(--line); color:var(--text);">
                    ${activeLeaveTypes.map(t => `<option value="${t.id}">${t.name} (${t.code}) - ${t.isPaid ? 'Paid' : 'Unpaid'}</option>`).join("")}
                  </select>
                </div>
                <div>
                  <label style="font-weight:700; color:var(--text); display:block; margin-bottom:4px;">Annual Quota (Days) *</label>
                  <input type="number" step="0.5" min="0" name="quotaAmount" id="assignPolicyQuotaInput" value="${defaultQuota}" oninput="window.updateAssignPolicyPreview()" required style="width:100%; padding:9px; border-radius:8px; background:var(--panel-raised); border:1px solid var(--line); color:var(--text); font-family:monospace; font-weight:700;" />
                </div>
              </div>

              <div>
                <label style="font-weight:700; color:var(--text); display:block; margin-bottom:4px;">Assignment Mode</label>
                <select name="assignmentMode" id="assignPolicyMode" onchange="window.updateAssignPolicyPreview()" style="width:100%; padding:8px; border-radius:8px; background:var(--panel-raised); border:1px solid var(--line); color:var(--text);">
                  <option value="SET_ANNUAL">Set as Annual Base Quota (Sets Opening & Available Balance)</option>
                  <option value="ADD_TO_CURRENT">Add as Additional Grant to Current Balance</option>
                </select>
              </div>
            </div>

            <!-- Step 2: Employee Selection -->
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <label style="font-weight:700; color:var(--text);">Select Employees to Assign *</label>
                <span id="assignPolicyFilteredCount" style="font-size:0.75rem; color:var(--muted-text); font-family:monospace;">${employees.length} available</span>
              </div>

              <!-- Filter Toolbar -->
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:8px;">
                <input type="text" id="assignPolicySearchInput" oninput="window.filterAssignPolicyEmployees()" placeholder="Filter by employee name / ID..." style="width:100%; padding:7px 10px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text); font-size:0.75rem;" />
                <select id="assignPolicyDeptFilter" onchange="window.filterAssignPolicyEmployees()" style="width:100%; padding:7px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text); font-size:0.75rem;">
                  <option value="ALL">All Departments</option>
                  ${depts.map(d => `<option value="${d}">${d}</option>`).join("")}
                </select>
              </div>

              <!-- Select All Toggle -->
              <div style="display:flex; align-items:center; justify-content:space-between; background:var(--panel-soft); padding:8px 12px; border-radius:8px; margin-bottom:6px; border:1px solid var(--line);">
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-weight:700; color:var(--text);">
                  <input type="checkbox" id="assignPolicySelectAll" onchange="window.toggleAssignPolicySelectAll(this.checked)" style="width:15px; height:15px; cursor:pointer;" />
                  <span>Select All Visible Employees</span>
                </label>
                <small style="color:var(--muted-text);">Click to toggle selection</small>
              </div>

              <!-- Scrollable Employee List -->
              <div id="assignPolicyEmpList" style="max-height:180px; overflow-y:auto; border:1px solid var(--line); border-radius:10px; background:var(--panel-soft); padding:4px;">
                ${employees.map(e => `
                  <div class="assign-emp-row" data-dept="${e.dept || ''}" data-search="${(e.name || '').toLowerCase()} ${(e.id || '').toLowerCase()}" style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; border-radius:6px; margin-bottom:2px; transition:background 0.15s ease;">
                    <label style="display:flex; align-items:center; gap:10px; cursor:pointer; flex:1;">
                      <input type="checkbox" name="selectedEmployees" ${canAdministerEmployee(e) ? '' : 'disabled title="Super Admin only"'} value="${e.id}" onchange="window.updateAssignPolicyPreview()" style="width:15px; height:15px; cursor:pointer;" />
                      <div>
                        <strong style="color:var(--text); font-size:0.8rem;">${e.name}</strong>
                        <span style="font-family:monospace; color:var(--muted-text); font-size:0.72rem; margin-left:6px;">(${e.id})</span>
                      </div>
                    </label>
                    <span style="font-size:0.7rem; color:var(--muted-text); background:var(--panel-raised); padding:2px 8px; border-radius:6px; border:1px solid var(--line);">${e.dept || 'Engineering'}</span>
                  </div>
                `).join("")}
              </div>
            </div>

            <!-- Step 3: Summary Preview Box -->
            <div id="assignPolicySummaryPreview" style="background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.3); padding:10px 14px; border-radius:10px; font-size:0.8rem; color:var(--warning);">
              ⚠️ <em>No employees selected yet. Check individual employees or click "Select All" above.</em>
            </div>

            <!-- Step 4: Audit Reason -->
            <div>
              <label style="font-weight:700; color:var(--text); display:block; margin-bottom:4px;">Mandatory Audit Reason * <small style="color:var(--muted-text); font-weight:normal;">(Min 5 characters)</small></label>
              <textarea name="auditReason" required rows="2" placeholder="e.g. Annual leave entitlement allocation for FY 2026-27..." style="width:100%; padding:9px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text); font-size:0.8rem; resize:vertical;"></textarea>
            </div>

            <!-- Actions -->
            <div style="display:flex; gap:10px; margin-top:4px;">
              <button type="button" class="secondary-button" style="flex:1;" onclick="window.closeLeaveModalDialog()">Cancel</button>
              <button type="submit" class="primary-button" style="flex:1; background:#10b981;">Confirm & Assign Leave</button>
            </div>
          </form>
        </div>
      </div>
    `;
  } else if (leaveStore.activeModal === "deleteLeavePolicy") {
    const typeObj = leaveStore.leaveTypes.find(t => t.id === leaveStore.modalPayload);
    if (typeObj) {
      const activeBalancesCount = leaveStore.balances.filter(b => b.leaveTypeId === typeObj.id).length;
      const yrQuota = typeObj.leavesAllowedPerYear != null ? typeObj.leavesAllowedPerYear : (typeObj.annualAllocation || 0);
      modalHtml = `
        <div style="position:fixed; inset:0; z-index:110; display:flex; align-items:center; justify-content:center; padding:16px;">
          <div onclick="window.closeLeaveModalDialog()" style="position:absolute; inset:0; background:rgba(2,6,23,0.8); backdrop-filter:blur(6px);"></div>
          <div style="position:relative; width:100%; max-width:460px; background:var(--panel-raised); border:1px solid rgba(239,68,68,0.3); border-radius:22px; padding:26px; z-index:111; color:var(--text); box-shadow:0 25px 50px -12px rgba(0,0,0,0.6);">
            
            <div style="width:52px; height:52px; border-radius:50%; background:rgba(239,68,68,0.12); border:1px solid rgba(239,68,68,0.3); display:flex; align-items:center; justify-content:center; margin:0 auto 16px; color:var(--danger);">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
              </svg>
            </div>

            <h3 style="font-size:1.2rem; font-weight:800; color:var(--text); text-align:center; margin:0 0 6px;">Delete Leave Policy</h3>
            <p style="font-size:0.8rem; color:var(--muted-text); text-align:center; margin:0 0 16px; line-height:1.4;">
              Are you sure you want to permanently delete the leave policy <strong>${typeObj.name}</strong> (<span style="font-family:monospace; color:var(--primary);">${typeObj.shortName || typeObj.code}</span>)?
            </p>

            <div style="background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.25); border-radius:12px; padding:12px; font-size:0.75rem; color:#fca5a5; margin-bottom:20px; line-height:1.4;">
              ⚠️ <strong>Warning:</strong> This action cannot be undone.
              ${activeBalancesCount > 0 ? `<br>• Currently assigned to <strong>${activeBalancesCount} employee balance record(s)</strong>.` : ''}
              <br>• Policy parameters (Quota: ${yrQuota}d) will be permanently deleted.
            </div>

            <div style="display:flex; gap:10px;">
              <button type="button" class="secondary-button" style="flex:1; padding:9px; font-size:0.8rem;" onclick="window.closeLeaveModalDialog()">Cancel</button>
              <button type="button" class="primary-button" style="flex:1; padding:9px; font-size:0.8rem; background:#dc2626; border-color:#dc2626; display:inline-flex; align-items:center; justify-content:center; gap:6px;" onclick="window.executeDeleteLeavePolicy('${typeObj.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      `;
    }
  } else if (leaveStore.activeModal === "yearEndRollover") {
    modalHtml = `
      <div style="position:fixed; inset:0; z-index:110; display:flex; align-items:center; justify-content:center; padding:16px;">
        <div onclick="window.closeLeaveModalDialog()" style="position:absolute; inset:0; background:rgba(2,6,23,0.75); backdrop-filter:blur(4px);"></div>
        <div style="position:relative; width:100%; max-width:480px; background:var(--panel-raised); border:1px solid var(--line); border-radius:20px; padding:24px; z-index:111; color:var(--text);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 style="font-size:1.15rem; font-weight:800; color:var(--text); margin:0; display:flex; align-items:center; gap:8px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
              Process Year-End Carry Forward
            </h3>
            <button onclick="window.closeLeaveModalDialog()" style="background:var(--panel-soft); border:1px solid var(--line); border-radius:8px; padding:4px 8px; cursor:pointer; color:var(--muted-text);">✕</button>
          </div>
          <p style="font-size:0.85rem; color:var(--muted-text); margin:0 0 14px;">
            Executing this process will reset used/refilled counters for the new annual cycle, allocate the annual base quota for each policy, and carry forward unused days up to the maximum permitted cap.
          </p>
          <div style="background:rgba(56,189,248,0.08); border:1px solid rgba(56,189,248,0.25); padding:12px; border-radius:12px; margin-bottom:16px; font-size:0.8rem; color:var(--primary);">
            💡 <strong>Policy Rules Enforced:</strong> Unused balances on leave policies with <em>Carry Forward Enabled</em> will roll over up to their configured maximum limit. Non-carry-forward policies will reset to base annual quota.
          </div>
          <div style="display:flex; gap:10px;">
            <button type="button" class="secondary-button" style="flex:1;" onclick="window.closeLeaveModalDialog()">Cancel</button>
            <button type="button" class="primary-button" style="flex:1; background:#0284c7;" onclick="window.executeYearEndRollover()">Execute Rollover Now</button>
          </div>
        </div>
      </div>
    `;
  } else if (leaveStore.activeModal === "encashBalance") {
    const bal = leaveStore.balances.find(b => b.id === leaveStore.modalPayload);
    const lt = bal ? leaveStore.leaveTypes.find(t => t.id === bal.leaveTypeId) : null;
    if (bal && lt) {
      modalHtml = `
        <div style="position:fixed; inset:0; z-index:110; display:flex; align-items:center; justify-content:center; padding:16px;">
          <div onclick="window.closeLeaveModalDialog()" style="position:absolute; inset:0; background:rgba(2,6,23,0.75); backdrop-filter:blur(4px);"></div>
          <div style="position:relative; width:100%; max-width:480px; background:var(--panel-raised); border:1px solid var(--line); border-radius:20px; padding:24px; z-index:111; color:var(--text);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
              <h3 style="font-size:1.1rem; font-weight:800; color:var(--text); margin:0;">Leave Encashment Payout</h3>
              <button onclick="window.closeLeaveModalDialog()" style="background:var(--panel-soft); border:1px solid var(--line); border-radius:8px; padding:4px 8px; cursor:pointer; color:var(--muted-text);">✕</button>
            </div>
            <div style="background:var(--panel-soft); padding:14px; border-radius:12px; border:1px solid var(--line); margin-bottom:16px; font-size:0.82rem; display:flex; flex-direction:column; gap:6px;">
              <div><strong>Employee:</strong> ${bal.employeeName} <span style="font-family:monospace; color:var(--muted-text);">(${bal.employeeCode})</span></div>
              <div><strong>Leave Type:</strong> <span style="color:var(--primary); font-weight:700;">${bal.leaveTypeName}</span></div>
              <div><strong>Available Balance:</strong> <span style="font-family:monospace; font-weight:800; color:var(--success);">${bal.availableBalance} days</span></div>
              <div style="font-size:0.75rem; color:var(--muted-text); margin-top:2px;">
                Policy Limits: Min Balance Required: ${lt.encashmentMinBalance || 0}d &nbsp;|&nbsp; Max Encashable: ${lt.encashmentMaxDays || '∞'}d
              </div>
            </div>
            <form onsubmit="window.executeLeaveEncashmentSave(event)" style="display:flex; flex-direction:column; gap:14px; font-size:0.8rem;">
              <input type="hidden" name="balanceId" value="${bal.id}" />
              <div>
                <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Days to Encash *</label>
                <input type="number" name="encashDays" min="1" max="${Math.min(bal.availableBalance, lt.encashmentMaxDays || bal.availableBalance)}" step="1" value="1" required style="width:100%; padding:8px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);" />
              </div>
              <div>
                <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Remarks / Note (Optional)</label>
                <input type="text" name="reason" placeholder="e.g. Approved encashment for Q4..." style="width:100%; padding:9px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);" />
              </div>
              <div style="display:flex; gap:10px; margin-top:8px;">
                <button type="button" class="secondary-button" style="flex:1;" onclick="window.closeLeaveModalDialog()">Cancel</button>
                <button type="submit" class="primary-button" style="flex:1; background:#6366f1;">Confirm Encashment</button>
              </div>
            </form>
          </div>
        </div>
      `;
    }
  } else if (leaveStore.activeModal === "viewPolicy") {
    const typeObj = leaveStore.leaveTypes.find(t => t.id === leaveStore.modalPayload);
    if (typeObj) {
      const activeTab = leaveStore.policyDetailTab || "general";
      const yrQuota = typeObj.leavesAllowedPerYear != null ? typeObj.leavesAllowedPerYear : (typeObj.annualAllocation || 0);
      modalHtml = `
        <div style="position:fixed; inset:0; z-index:110; display:flex; align-items:center; justify-content:center; padding:16px;">
          <div onclick="window.closeLeaveModalDialog()" style="position:absolute; inset:0; background:rgba(2,6,23,0.75); backdrop-filter:blur(4px);"></div>
          <div style="position:relative; width:100%; max-width:760px; max-height:90vh; overflow-y:auto; background:var(--panel-raised, #ffffff); border:1px solid var(--line); border-radius:20px; padding:24px 28px; z-index:111; color:var(--text); box-shadow:0 20px 40px rgba(0,0,0,0.4);">
            
            <!-- Header -->
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
              <div>
                <h2 style="font-size:1.35rem; font-weight:800; color:var(--text); margin:0 0 4px; display:flex; align-items:center; gap:10px;">
                  <span style="width:14px; height:14px; border-radius:50%; background:${typeObj.displayColor || '#6366f1'}; display:inline-block;"></span>
                  ${typeObj.name}
                  <span style="font-size:0.75rem; padding:2px 8px; border-radius:6px; font-weight:700; ${typeObj.isPaid ? 'background:rgba(16,185,129,0.15); color:var(--success);' : 'background:rgba(245,158,11,0.15); color:var(--warning);'}">${typeObj.isPaid ? 'Paid' : 'Unpaid (LWP)'}</span>
                </h2>
              </div>
              <button onclick="window.closeLeaveModalDialog()" style="background:var(--panel-soft); border:1px solid var(--line); border-radius:8px; padding:6px 10px; cursor:pointer; color:var(--muted-text); font-size:0.85rem;">✕</button>
            </div>

            <!-- Tab Navigation (General Settings | Advanced Settings) matching screenshot -->
            <div style="display:flex; border-bottom:1px solid var(--line); margin-bottom:20px; gap:20px;">
              <button id="btnPolicyDetailGen" onclick="window.switchPolicyDetailTab('general')" style="background:none; border:none; padding:8px 4px 12px; font-size:0.9rem; font-weight:${activeTab === 'general' ? '700' : '500'}; color:${activeTab === 'general' ? '#2563eb' : 'var(--muted-text)'}; border-bottom:${activeTab === 'general' ? '2px solid #3b82f6' : '2px solid transparent'}; cursor:pointer; font-family:inherit;">
                General Settings
              </button>
              <button id="btnPolicyDetailAdv" onclick="window.switchPolicyDetailTab('advanced')" style="background:none; border:none; padding:8px 4px 12px; font-size:0.9rem; font-weight:${activeTab === 'advanced' ? '700' : '500'}; color:${activeTab === 'advanced' ? '#2563eb' : 'var(--muted-text)'}; border-bottom:${activeTab === 'advanced' ? '2px solid #3b82f6' : '2px solid transparent'}; cursor:pointer; font-family:inherit;">
                Advanced Settings
              </button>
            </div>

            <!-- TAB 1: GENERAL SETTINGS (Screenshot 1) -->
            <div id="policyDetailGenTab" style="display:${activeTab === 'general' ? 'block' : 'none'};">
              <div style="margin-bottom:16px;">
                <div style="font-size:0.75rem; font-weight:700; color:var(--text); margin-bottom:2px;">Name</div>
                <div style="font-size:0.85rem; color:var(--muted-text);">${typeObj.name}</div>
              </div>

              <div style="margin-bottom:16px;">
                <div style="font-size:0.75rem; font-weight:700; color:var(--text); margin-bottom:2px;">Description</div>
                <div style="font-size:0.85rem; color:var(--muted-text);">${typeObj.description || 'This is a default description for the Leave Type. You can customise this.'}</div>
              </div>

              <div style="margin-bottom:20px;">
                <div style="font-size:0.75rem; font-weight:700; color:var(--text); margin-bottom:2px;">Leave Short Name</div>
                <div style="font-size:0.85rem; color:var(--muted-text); font-family:monospace; font-weight:600;">${typeObj.shortName || typeObj.code || '--'}</div>
              </div>

              <!-- Matrix Table Structure -->
              <div style="border:1px solid var(--line); border-radius:12px; overflow:hidden; font-size:0.82rem;">
                
                <!-- Row 1: Leaves Count -->
                <div style="display:grid; grid-template-columns: 160px 1fr 1fr; border-bottom:1px solid var(--line); padding:14px 16px; background:var(--panel-soft);">
                  <div style="font-weight:700; color:var(--text);">Leaves Count</div>
                  <div>
                    <div style="font-weight:700; color:var(--text); font-size:0.78rem;">Leaves Allowed in a Year</div>
                    <div style="color:var(--muted-text); font-family:monospace; margin-top:2px;">${Number(yrQuota).toFixed(1)}</div>
                    
                    <div style="font-weight:700; color:var(--text); font-size:0.78rem; margin-top:12px;">Holidays Between Leave</div>
                    <div style="color:var(--muted-text); margin-top:2px;">${typeObj.holidaysBetweenLeave === 'CONSIDERED' ? 'Considered' : 'Not Considered'}</div>
                  </div>
                  <div>
                    <div style="font-weight:700; color:var(--text); font-size:0.78rem;">Weekends Between Leave</div>
                    <div style="color:var(--muted-text); margin-top:2px;">${typeObj.weekendsBetweenLeave === 'CONSIDERED' ? 'Considered' : 'Not Considered'}</div>
                  </div>
                </div>

                <!-- Row 2: Accrual -->
                <div style="display:grid; grid-template-columns: 160px 1fr 1fr; border-bottom:1px solid var(--line); padding:14px 16px;">
                  <div style="font-weight:700; color:var(--text);">Accrual</div>
                  <div>
                    <div style="font-weight:700; color:var(--text); font-size:0.78rem;">Creditable On Accrual Basis</div>
                    <div style="color:var(--muted-text); margin-top:2px;">${typeObj.creditableOnAccrualBasis ? `Yes (${typeObj.accrualAmount}d / ${(typeObj.accrualFrequency||'MONTHLY').toLowerCase()})` : 'No (Lump-sum for 1 year)'}</div>
                  </div>
                  <div></div>
                </div>

                <!-- Row 3: Applicability -->
                <div style="display:grid; grid-template-columns: 160px 1fr 1fr; border-bottom:1px solid var(--line); padding:14px 16px; background:var(--panel-soft);">
                  <div style="font-weight:700; color:var(--text);">Applicability</div>
                  <div>
                    <div style="font-weight:700; color:var(--text); font-size:0.78rem;">Allowed under Probation</div>
                    <div style="color:var(--muted-text); margin-top:2px;">${typeObj.allowedUnderProbation !== false ? 'Yes' : 'No'}</div>
                  </div>
                  <div>
                    <div style="font-weight:700; color:var(--text); font-size:0.78rem;">Allowed under Notice Period</div>
                    <div style="color:var(--muted-text); margin-top:2px;">${typeObj.allowedUnderNoticePeriod ? 'Yes' : 'No'}</div>
                  </div>
                </div>

                <!-- Row 4: Leave Encash -->
                <div style="display:grid; grid-template-columns: 160px 1fr 1fr; border-bottom:1px solid var(--line); padding:14px 16px;">
                  <div style="font-weight:700; color:var(--text);">Leave Encash</div>
                  <div>
                    <div style="font-weight:700; color:var(--text); font-size:0.78rem; display:flex; align-items:center; gap:4px;">
                      Leave Encash Enabled
                      <span style="font-size:0.7rem; background:rgba(99,102,241,0.15); color:var(--primary); width:14px; height:14px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center;">i</span>
                    </div>
                    <div style="color:var(--muted-text); margin-top:2px;">${typeObj.encashmentEnabled ? `Yes (Min: ${typeObj.encashmentMinBalance || 0}d, Max: ${typeObj.encashmentMaxDays || 0}d)` : 'No'}</div>
                  </div>
                  <div></div>
                </div>

                <!-- Row 5: Carry Forward -->
                <div style="display:grid; grid-template-columns: 160px 1fr 1fr; padding:14px 16px; background:var(--panel-soft);">
                  <div style="font-weight:700; color:var(--text);">Carry Forward</div>
                  <div>
                    <div style="font-weight:700; color:var(--text); font-size:0.78rem; display:flex; align-items:center; gap:4px;">
                      Carry Forward Enabled
                      <span style="font-size:0.7rem; background:rgba(99,102,241,0.15); color:var(--primary); width:14px; height:14px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center;">i</span>
                    </div>
                    <div style="color:var(--muted-text); margin-top:2px;">${typeObj.carryForwardEnabled ? `Yes (Max: ${typeObj.maximumCarryForward || '∞'} days, Expiry: ${typeObj.carryForwardExpiryDays || 0} days)` : 'No'}</div>
                  </div>
                  <div></div>
                </div>

              </div>
            </div>

            <!-- TAB 2: ADVANCED SETTINGS (Screenshot 2) -->
            <div id="policyDetailAdvTab" style="display:${activeTab === 'advanced' ? 'block' : 'none'};">
              <div style="border:1px solid var(--line); border-radius:12px; overflow:hidden; font-size:0.82rem;">
                
                <!-- Row 1: Leaves Count -->
                <div style="display:grid; grid-template-columns: 160px 1fr 1fr; border-bottom:1px solid var(--line); padding:14px 16px; background:var(--panel-soft);">
                  <div style="font-weight:700; color:var(--text);">Leaves Count</div>
                  <div>
                    <div style="font-weight:700; color:var(--text); font-size:0.78rem;">Max. Leaves Allowed in a Month</div>
                    <div style="color:var(--muted-text); font-family:monospace; margin-top:2px;">${typeObj.maxLeavesAllowedInMonth != null ? Number(typeObj.maxLeavesAllowedInMonth).toFixed(2) : 'Unlimited'}</div>
                  </div>
                  <div>
                    <div style="font-weight:700; color:var(--text); font-size:0.78rem;">Continuous Leaves Allowed</div>
                    <div style="color:var(--muted-text); margin-top:2px;">${typeObj.continuousLeavesAllowed != null ? typeObj.continuousLeavesAllowed : 'Unlimited'}</div>
                  </div>
                </div>

                <!-- Row 2: Applicability -->
                <div style="display:grid; grid-template-columns: 160px 1fr 1fr; border-bottom:1px solid var(--line); padding:14px 16px;">
                  <div style="font-weight:700; color:var(--text);">Applicability</div>
                  <div>
                    <div style="font-weight:700; color:var(--text); font-size:0.78rem;">Negative Leaves Allowed</div>
                    <div style="color:var(--muted-text); margin-top:2px;">${typeObj.negativeLeavesAllowed ? `Yes (Floor Limit: ${typeObj.negativeBalanceLimit || 0} days)` : 'No'}</div>
                  </div>
                  <div></div>
                </div>

                <!-- Row 3: Miscellaneous -->
                <div style="display:grid; grid-template-columns: 160px 1fr 1fr; padding:14px 16px; background:var(--panel-soft);">
                  <div style="font-weight:700; color:var(--text);">Miscellaneous</div>
                  <div>
                    <div style="font-weight:700; color:var(--text); font-size:0.78rem;">Future-dated Leaves Allowed</div>
                    <div style="color:var(--muted-text); margin-top:2px;">${typeObj.futureDatedLeavesAllowed !== false ? 'Yes' : 'No'}</div>
                    
                    <div style="font-weight:700; color:var(--text); font-size:0.78rem; margin-top:14px;">Backdated Leaves Allowed</div>
                    <div style="color:var(--muted-text); margin-top:2px;">${typeObj.backdatedLeavesAllowed ? 'Yes' : 'No'}</div>
                    
                    <div style="font-weight:700; color:var(--text); font-size:0.78rem; margin-top:14px;">Apply Leaves for Next Year Till</div>
                    <div style="color:var(--muted-text); margin-top:2px;">${typeObj.applyLeavesForNextYearTill || '--'}</div>
                  </div>
                  <div>
                    <div style="font-weight:700; color:var(--text); font-size:0.78rem;">Future-dated Leaves Allowed After</div>
                    <div style="color:var(--muted-text); margin-top:2px;">${typeObj.futureDatedAllowedAfterDays || 0} Days</div>
                    
                    <div style="font-weight:700; color:var(--text); font-size:0.78rem; margin-top:14px;">Backdated Leaves Allowed up to</div>
                    <div style="color:var(--muted-text); margin-top:2px;">${typeObj.backdatedAllowedUpToDays || 0} Days</div>
                  </div>
                </div>

              </div>
            </div>

            <!-- Footer Actions -->
            <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; margin-top:20px; padding-top:16px; border-top:1px solid var(--line);">
              <button type="button" class="secondary-button" style="color:var(--danger); border-color:rgba(239,68,68,0.3); display:inline-flex; align-items:center; gap:6px;" onclick="window.closeLeaveModalDialog(); window.openDeleteLeavePolicyModal('${typeObj.id}');">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                Delete Policy
              </button>
              <div style="display:flex; gap:10px;">
                <button type="button" class="secondary-button" onclick="window.closeLeaveModalDialog()">Close</button>
                <button type="button" class="primary-button" onclick="window.closeLeaveModalDialog(); window.openLeaveModalDialog('editType', '${typeObj.id}');">Edit Policy Rules</button>
              </div>
            </div>

          </div>
        </div>
      `;
    }
  } else if (leaveStore.activeModal === "addType") {
    modalHtml = `
      <div style="position:fixed; inset:0; z-index:110; display:flex; align-items:center; justify-content:center; padding:16px;">
        <div onclick="window.closeLeaveModalDialog()" style="position:absolute; inset:0; background:rgba(2,6,23,0.75); backdrop-filter:blur(4px);"></div>
        <div style="position:relative; width:100%; max-width:640px; max-height:90vh; overflow-y:auto; background:var(--panel-raised); border:1px solid var(--line); border-radius:20px; padding:24px; z-index:111; color:var(--text);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <h3 style="font-size:1.15rem; font-weight:800; color:var(--text); margin:0;">Create Custom Leave Policy</h3>
            <button onclick="window.closeLeaveModalDialog()" style="background:var(--panel-soft); border:1px solid var(--line); border-radius:8px; padding:4px 8px; cursor:pointer; color:var(--muted-text);">✕</button>
          </div>

          <!-- Tab Navigation for Form -->
          <div style="display:flex; border-bottom:1px solid var(--line); margin-bottom:16px; gap:16px;">
            <button type="button" id="btnPolicyFormGen" onclick="window.switchPolicyFormTab('general')" style="background:none; border:none; padding:8px 4px 10px; font-size:0.85rem; font-weight:700; color:var(--primary); border-bottom:2px solid #6366f1; cursor:pointer; font-family:inherit;">
              1. General Settings
            </button>
            <button type="button" id="btnPolicyFormAdv" onclick="window.switchPolicyFormTab('advanced')" style="background:none; border:none; padding:8px 4px 10px; font-size:0.85rem; font-weight:500; color:var(--muted-text); border-bottom:2px solid transparent; cursor:pointer; font-family:inherit;">
              2. Advanced Settings
            </button>
          </div>

          <form onsubmit="window.executeAddLeaveTypeSave(event)" style="display:flex; flex-direction:column; gap:14px; font-size:0.8rem;">
            
            <!-- SECTION 1: GENERAL SETTINGS -->
            <div id="policyFormGenContent" style="display:block; space-y-3;">
              <div style="display:grid; grid-template-columns:2fr 1fr; gap:12px; margin-bottom:10px;">
                <div>
                  <label style="font-weight:700; color:var(--text); display:block; margin-bottom:4px;">Leave Type Name *</label>
                  <input type="text" name="name" placeholder="e.g. Vacation Leave" required style="width:100%; padding:8px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);" />
                </div>
                <div>
                  <label style="font-weight:700; color:var(--text); display:block; margin-bottom:4px;">Leave Code / Short Name *</label>
                  <input type="text" name="code" placeholder="e.g. VL" required style="width:100%; padding:8px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text); font-family:monospace;" />
                </div>
              </div>

              <div style="margin-bottom:10px;">
                <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Description</label>
                <input type="text" name="description" placeholder="Brief policy description..." style="width:100%; padding:8px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);" />
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-bottom:10px; background:var(--panel-soft); padding:12px; border-radius:10px;">
                <div>
                  <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Pay Status *</label>
                  <select name="isPaid" style="width:100%; padding:7px; border-radius:8px; background:var(--panel-raised); border:1px solid var(--line); color:var(--text);">
                    <option value="PAID">Paid Leave</option>
                    <option value="UNPAID">Unpaid Leave (LWP)</option>
                  </select>
                </div>
                <div>
                  <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Annual Quota (Days) *</label>
                  <input type="number" name="leavesAllowedPerYear" step="0.5" min="0" value="12" required style="width:100%; padding:7px; border-radius:8px; background:var(--panel-raised); border:1px solid var(--line); color:var(--text); font-family:monospace;" />
                </div>
                <div>
                  <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Badge Color</label>
                  <input type="color" name="displayColor" value="#6366f1" style="width:100%; height:33px; border-radius:8px; background:var(--panel-raised); border:1px solid var(--line); cursor:pointer;" />
                </div>
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
                <div>
                  <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Weekends Between Leave</label>
                  <select name="weekendsBetweenLeave" style="width:100%; padding:7px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);">
                    <option value="NOT_CONSIDERED">Not Considered (Excluded)</option>
                    <option value="CONSIDERED">Considered (Counted as leave)</option>
                  </select>
                </div>
                <div>
                  <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Holidays Between Leave</label>
                  <select name="holidaysBetweenLeave" style="width:100%; padding:7px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);">
                    <option value="NOT_CONSIDERED">Not Considered (Excluded)</option>
                    <option value="CONSIDERED">Considered (Counted as leave)</option>
                  </select>
                </div>
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-bottom:10px; background:var(--panel-soft); padding:12px; border-radius:10px;">
                <div>
                  <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Allocation model</label>
                  <select name="creditableOnAccrualBasis" aria-label="Allocation model"><option value="NO">Annual lump-sum</option></select>
                </div>
                <div>
                  <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Allocation cycle</label>
                  <select name="accrualFrequency" aria-label="Allocation cycle"><option value="YEARLY">One year</option></select>
                </div>
                <div>
                  <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Periodic accrual (not used)</label>
                  <input type="number" name="accrualAmount" value="0" readonly aria-label="Periodic accrual amount (not used)" />
                </div>
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
                <div>
                  <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Allowed Under Probation *</label>
                  <select name="allowedUnderProbation" style="width:100%; padding:7px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);">
                    <option value="YES">Yes</option>
                    <option value="NO">No</option>
                  </select>
                </div>
                <div>
                  <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Allowed Under Notice Period *</label>
                  <select name="allowedUnderNoticePeriod" style="width:100%; padding:7px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);">
                    <option value="NO">No</option>
                    <option value="YES">Yes</option>
                  </select>
                </div>
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
                <div style="background:var(--panel-soft); padding:10px; border-radius:10px;">
                  <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Leave Encash Enabled</label>
                  <select name="encashmentEnabled" style="width:100%; padding:6px; border-radius:8px; background:var(--panel-raised); border:1px solid var(--line); color:var(--text);">
                    <option value="NO">No</option>
                    <option value="YES">Yes</option>
                  </select>
                </div>
                <div style="background:var(--panel-soft); padding:10px; border-radius:10px;">
                  <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Carry Forward Enabled</label>
                  <select name="carryForwardEnabled" style="width:100%; padding:6px; border-radius:8px; background:var(--panel-raised); border:1px solid var(--line); color:var(--text);">
                    <option value="NO">No</option>
                    <option value="YES">Yes</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- SECTION 2: ADVANCED SETTINGS -->
            <div id="policyFormAdvContent" style="display:none; space-y-3;">
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
                <div>
                  <label style="font-weight:700; color:var(--text); display:block; margin-bottom:4px;">Max Leaves in a Month</label>
                  <input type="number" step="0.5" name="maxLeavesAllowedInMonth" placeholder="e.g. 8.00 (blank = unlimited)" style="width:100%; padding:8px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);" />
                </div>
                <div>
                  <label style="font-weight:700; color:var(--text); display:block; margin-bottom:4px;">Continuous Leaves Allowed (Days)</label>
                  <input type="number" name="continuousLeavesAllowed" placeholder="e.g. 8 (max consecutive)" style="width:100%; padding:8px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);" />
                </div>
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px; background:var(--panel-soft); padding:12px; border-radius:10px;">
                <div>
                  <label style="font-weight:700; color:var(--text); display:block; margin-bottom:4px;">Negative Leaves Allowed</label>
                  <select name="negativeLeavesAllowed" style="width:100%; padding:7px; border-radius:8px; background:var(--panel-raised); border:1px solid var(--line); color:var(--text);">
                    <option value="NO">No</option>
                    <option value="YES">Yes</option>
                  </select>
                </div>
                <div>
                  <label style="font-weight:700; color:var(--text); display:block; margin-bottom:4px;">Negative Balance Limit</label>
                  <input type="number" name="negativeBalanceLimit" max="0" step="0.5" value="0" style="width:100%; padding:7px; border-radius:8px; background:var(--panel-raised); border:1px solid var(--line); color:var(--text);" />
                </div>
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
                <div>
                  <label style="font-weight:700; color:var(--text); display:block; margin-bottom:4px;">Future-dated Leaves Allowed</label>
                  <select name="futureDatedLeavesAllowed" style="width:100%; padding:7px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);">
                    <option value="YES">Yes</option>
                    <option value="NO">No</option>
                  </select>
                </div>
                <div>
                  <label style="font-weight:700; color:var(--text); display:block; margin-bottom:4px;">Future-dated Notice After (Days)</label>
                  <input type="number" name="futureDatedAllowedAfterDays" value="0" style="width:100%; padding:7px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);" />
                </div>
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
                <div>
                  <label style="font-weight:700; color:var(--text); display:block; margin-bottom:4px;">Backdated Leaves Allowed</label>
                  <select name="backdatedLeavesAllowed" style="width:100%; padding:7px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);">
                    <option value="YES">Yes</option>
                    <option value="NO">No</option>
                  </select>
                </div>
                <div>
                  <label style="font-weight:700; color:var(--text); display:block; margin-bottom:4px;">Backdated Allowed up to (Days)</label>
                  <input type="number" name="backdatedAllowedUpToDays" value="15" style="width:100%; padding:7px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);" />
                </div>
              </div>

              <div>
                <label style="font-weight:700; color:var(--text); display:block; margin-bottom:4px;">Apply Leaves for Next Year Till</label>
                <input type="text" name="applyLeavesForNextYearTill" placeholder="e.g. 31 Dec (boundary cutoff)" style="width:100%; padding:8px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);" />
              </div>
            </div>

            <div style="display:flex; gap:10px; margin-top:12px; padding-top:12px; border-top:1px solid var(--line);">
              <button type="button" class="secondary-button" style="flex:1;" onclick="window.closeLeaveModalDialog()">Cancel</button>
              <button type="submit" class="primary-button" style="flex:1;">Create Leave Policy</button>
            </div>
          </form>
        </div>
      </div>
    `;
  } else if (leaveStore.activeModal === "editType") {
    const typeObj = leaveStore.leaveTypes.find(t => t.id === leaveStore.modalPayload);
    if (typeObj) {
      const yrQuota = typeObj.leavesAllowedPerYear != null ? typeObj.leavesAllowedPerYear : (typeObj.annualAllocation || 0);
      modalHtml = `
        <div style="position:fixed; inset:0; z-index:110; display:flex; align-items:center; justify-content:center; padding:16px;">
          <div onclick="window.closeLeaveModalDialog()" style="position:absolute; inset:0; background:rgba(2,6,23,0.75); backdrop-filter:blur(4px);"></div>
          <div style="position:relative; width:100%; max-width:640px; max-height:90vh; overflow-y:auto; background:var(--panel-raised); border:1px solid var(--line); border-radius:20px; padding:24px; z-index:111; color:var(--text);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <h3 style="font-size:1.15rem; font-weight:800; color:var(--text); margin:0;">Edit Leave Policy (${typeObj.name})</h3>
              <button onclick="window.closeLeaveModalDialog()" style="background:var(--panel-soft); border:1px solid var(--line); border-radius:8px; padding:4px 8px; cursor:pointer; color:var(--muted-text);">✕</button>
            </div>

            <!-- Tab Navigation for Edit Form -->
            <div style="display:flex; border-bottom:1px solid var(--line); margin-bottom:16px; gap:16px;">
              <button type="button" id="btnPolicyFormGen" onclick="window.switchPolicyFormTab('general')" style="background:none; border:none; padding:8px 4px 10px; font-size:0.85rem; font-weight:700; color:var(--primary); border-bottom:2px solid #6366f1; cursor:pointer; font-family:inherit;">
                1. General Settings
              </button>
              <button type="button" id="btnPolicyFormAdv" onclick="window.switchPolicyFormTab('advanced')" style="background:none; border:none; padding:8px 4px 10px; font-size:0.85rem; font-weight:500; color:var(--muted-text); border-bottom:2px solid transparent; cursor:pointer; font-family:inherit;">
                2. Advanced Settings
              </button>
            </div>

            <form onsubmit="window.executeEditLeaveTypeSave(event)" style="display:flex; flex-direction:column; gap:14px; font-size:0.8rem;">
              <input type="hidden" name="typeId" value="${typeObj.id}" />

              <!-- SECTION 1: GENERAL SETTINGS -->
              <div id="policyFormGenContent" style="display:block;">
                <div style="display:grid; grid-template-columns:2fr 1fr; gap:12px; margin-bottom:10px;">
                  <div>
                    <label style="font-weight:700; color:var(--text); display:block; margin-bottom:4px;">Leave Type Name *</label>
                    <input type="text" name="name" value="${typeObj.name}" required style="width:100%; padding:8px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);" />
                  </div>
                  <div>
                    <label style="font-weight:700; color:var(--text); display:block; margin-bottom:4px;">Leave Code / Short Name *</label>
                    <input type="text" name="code" value="${typeObj.shortName || typeObj.code}" required style="width:100%; padding:8px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text); font-family:monospace;" />
                  </div>
                </div>

                <div style="margin-bottom:10px;">
                  <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Description</label>
                  <input type="text" name="description" value="${typeObj.description || ''}" style="width:100%; padding:8px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);" />
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-bottom:10px; background:var(--panel-soft); padding:12px; border-radius:10px;">
                  <div>
                    <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Pay Status *</label>
                    <select name="isPaid" style="width:100%; padding:7px; border-radius:8px; background:var(--panel-raised); border:1px solid var(--line); color:var(--text);">
                      <option value="PAID" ${typeObj.isPaid ? 'selected' : ''}>Paid Leave</option>
                      <option value="UNPAID" ${!typeObj.isPaid ? 'selected' : ''}>Unpaid Leave (LWP)</option>
                    </select>
                  </div>
                  <div>
                    <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Annual Quota (Days) *</label>
                    <input type="number" step="0.5" name="leavesAllowedPerYear" min="0" value="${yrQuota}" required style="width:100%; padding:7px; border-radius:8px; background:var(--panel-raised); border:1px solid var(--line); color:var(--text); font-family:monospace;" />
                  </div>
                  <div>
                    <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Badge Color</label>
                    <input type="color" name="displayColor" value="${typeObj.displayColor || '#6366f1'}" style="width:100%; height:33px; border-radius:8px; background:var(--panel-raised); border:1px solid var(--line); cursor:pointer;" />
                  </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
                  <div>
                    <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Weekends Between Leave</label>
                    <select name="weekendsBetweenLeave" style="width:100%; padding:7px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);">
                      <option value="NOT_CONSIDERED" ${typeObj.weekendsBetweenLeave === 'NOT_CONSIDERED' ? 'selected' : ''}>Not Considered (Excluded)</option>
                      <option value="CONSIDERED" ${typeObj.weekendsBetweenLeave === 'CONSIDERED' ? 'selected' : ''}>Considered (Counted as leave)</option>
                    </select>
                  </div>
                  <div>
                    <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Holidays Between Leave</label>
                    <select name="holidaysBetweenLeave" style="width:100%; padding:7px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);">
                      <option value="NOT_CONSIDERED" ${typeObj.holidaysBetweenLeave === 'NOT_CONSIDERED' ? 'selected' : ''}>Not Considered (Excluded)</option>
                      <option value="CONSIDERED" ${typeObj.holidaysBetweenLeave === 'CONSIDERED' ? 'selected' : ''}>Considered (Counted as leave)</option>
                    </select>
                  </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-bottom:10px; background:var(--panel-soft); padding:12px; border-radius:10px;">
                  <div>
                    <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Allocation model</label>
                    <select name="creditableOnAccrualBasis" aria-label="Allocation model"><option value="NO">Annual lump-sum</option></select>
                  </div>
                  <div>
                    <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Allocation cycle</label>
                    <select name="accrualFrequency" aria-label="Allocation cycle"><option value="YEARLY">One year</option></select>
                  </div>
                  <div>
                    <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Periodic accrual (not used)</label>
                    <input type="number" name="accrualAmount" value="0" readonly aria-label="Periodic accrual amount (not used)" />
                  </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
                  <div>
                    <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Allowed Under Probation *</label>
                    <select name="allowedUnderProbation" style="width:100%; padding:7px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);">
                      <option value="YES" ${typeObj.allowedUnderProbation !== false ? 'selected' : ''}>Yes</option>
                      <option value="NO" ${typeObj.allowedUnderProbation === false ? 'selected' : ''}>No</option>
                    </select>
                  </div>
                  <div>
                    <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Allowed Under Notice Period *</label>
                    <select name="allowedUnderNoticePeriod" style="width:100%; padding:7px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);">
                      <option value="NO" ${!typeObj.allowedUnderNoticePeriod ? 'selected' : ''}>No</option>
                      <option value="YES" ${typeObj.allowedUnderNoticePeriod ? 'selected' : ''}>Yes</option>
                    </select>
                  </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
                  <div style="background:var(--panel-soft); padding:10px; border-radius:10px;">
                    <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Leave Encash Enabled</label>
                    <select name="encashmentEnabled" style="width:100%; padding:6px; border-radius:8px; background:var(--panel-raised); border:1px solid var(--line); color:var(--text);">
                      <option value="NO" ${!typeObj.encashmentEnabled ? 'selected' : ''}>No</option>
                      <option value="YES" ${typeObj.encashmentEnabled ? 'selected' : ''}>Yes</option>
                    </select>
                  </div>
                  <div style="background:var(--panel-soft); padding:10px; border-radius:10px;">
                    <label style="font-weight:700; color:var(--muted-text); display:block; margin-bottom:4px;">Carry Forward Enabled</label>
                    <select name="carryForwardEnabled" style="width:100%; padding:6px; border-radius:8px; background:var(--panel-raised); border:1px solid var(--line); color:var(--text);">
                      <option value="NO" ${!typeObj.carryForwardEnabled ? 'selected' : ''}>No</option>
                      <option value="YES" ${typeObj.carryForwardEnabled ? 'selected' : ''}>Yes</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- SECTION 2: ADVANCED SETTINGS -->
              <div id="policyFormAdvContent" style="display:none;">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
                  <div>
                    <label style="font-weight:700; color:var(--text); display:block; margin-bottom:4px;">Max Leaves in a Month</label>
                    <input type="number" step="0.5" name="maxLeavesAllowedInMonth" value="${typeObj.maxLeavesAllowedInMonth != null ? typeObj.maxLeavesAllowedInMonth : ''}" placeholder="e.g. 8.00 (blank = unlimited)" style="width:100%; padding:8px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);" />
                  </div>
                  <div>
                    <label style="font-weight:700; color:var(--text); display:block; margin-bottom:4px;">Continuous Leaves Allowed (Days)</label>
                    <input type="number" name="continuousLeavesAllowed" value="${typeObj.continuousLeavesAllowed != null ? typeObj.continuousLeavesAllowed : ''}" placeholder="e.g. 8 (max consecutive)" style="width:100%; padding:8px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);" />
                  </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px; background:var(--panel-soft); padding:12px; border-radius:10px;">
                  <div>
                    <label style="font-weight:700; color:var(--text); display:block; margin-bottom:4px;">Negative Leaves Allowed</label>
                    <select name="negativeLeavesAllowed" style="width:100%; padding:7px; border-radius:8px; background:var(--panel-raised); border:1px solid var(--line); color:var(--text);">
                      <option value="NO" ${!typeObj.negativeLeavesAllowed ? 'selected' : ''}>No</option>
                      <option value="YES" ${typeObj.negativeLeavesAllowed ? 'selected' : ''}>Yes</option>
                    </select>
                  </div>
                  <div>
                    <label style="font-weight:700; color:var(--text); display:block; margin-bottom:4px;">Negative Balance Limit</label>
                    <input type="number" name="negativeBalanceLimit" max="0" step="0.5" value="${typeObj.negativeBalanceLimit || 0}" style="width:100%; padding:7px; border-radius:8px; background:var(--panel-raised); border:1px solid var(--line); color:var(--text);" />
                  </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
                  <div>
                    <label style="font-weight:700; color:var(--text); display:block; margin-bottom:4px;">Future-dated Leaves Allowed</label>
                    <select name="futureDatedLeavesAllowed" style="width:100%; padding:7px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);">
                      <option value="YES" ${typeObj.futureDatedLeavesAllowed !== false ? 'selected' : ''}>Yes</option>
                      <option value="NO" ${typeObj.futureDatedLeavesAllowed === false ? 'selected' : ''}>No</option>
                    </select>
                  </div>
                  <div>
                    <label style="font-weight:700; color:var(--text); display:block; margin-bottom:4px;">Future-dated Notice After (Days)</label>
                    <input type="number" name="futureDatedAllowedAfterDays" value="${typeObj.futureDatedAllowedAfterDays || 0}" style="width:100%; padding:7px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);" />
                  </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
                  <div>
                    <label style="font-weight:700; color:var(--text); display:block; margin-bottom:4px;">Backdated Leaves Allowed</label>
                    <select name="backdatedLeavesAllowed" style="width:100%; padding:7px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);">
                      <option value="YES" ${typeObj.backdatedLeavesAllowed ? 'selected' : ''}>Yes</option>
                      <option value="NO" ${!typeObj.backdatedLeavesAllowed ? 'selected' : ''}>No</option>
                    </select>
                  </div>
                  <div>
                    <label style="font-weight:700; color:var(--text); display:block; margin-bottom:4px;">Backdated Allowed up to (Days)</label>
                    <input type="number" name="backdatedAllowedUpToDays" value="${typeObj.backdatedAllowedUpToDays || 0}" style="width:100%; padding:7px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);" />
                  </div>
                </div>

                <div>
                  <label style="font-weight:700; color:var(--text); display:block; margin-bottom:4px;">Apply Leaves for Next Year Till</label>
                  <input type="text" name="applyLeavesForNextYearTill" value="${typeObj.applyLeavesForNextYearTill || ''}" placeholder="e.g. 31 Dec (boundary cutoff)" style="width:100%; padding:8px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);" />
                </div>
              </div>

              <div style="display:flex; gap:10px; margin-top:12px; padding-top:12px; border-top:1px solid var(--line);">
                <button type="button" class="secondary-button" style="flex:1;" onclick="window.closeLeaveModalDialog()">Cancel</button>
                <button type="submit" class="primary-button" style="flex:1;">Save Policy Changes</button>
              </div>
            </form>
          </div>
        </div>
      `;
    }
  } else if (leaveStore.activeModal === "addHoliday") {
    modalHtml = `
      <div style="position:fixed; inset:0; z-index:110; display:flex; align-items:center; justify-content:center; padding:16px;">
        <div onclick="window.closeLeaveModalDialog()" style="position:absolute; inset:0; background:rgba(2,6,23,0.75); backdrop-filter:blur(4px);"></div>
        <div style="position:relative; width:100%; max-width:480px; background:var(--panel-raised); border:1px solid var(--line); border-radius:20px; padding:24px; z-index:111; color:var(--text);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 style="font-size:1.1rem; font-weight:800; color:var(--text); margin:0;">Add Organization Holiday</h3>
            <button onclick="window.closeLeaveModalDialog()" style="background:var(--panel-soft); border:1px solid var(--line); border-radius:8px; padding:4px 8px; cursor:pointer; color:var(--muted-text);">✕</button>
          </div>
          <form onsubmit="window.executeAddHolidaySave(event)" style="display:flex; flex-direction:column; gap:12px; font-size:0.8rem;">
            <label>Holiday Name *<input type="text" name="name" required placeholder="e.g. Independence Day" style="width:100%; padding:8px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);" /></label>
            <label>Date *<input type="date" name="date" required style="width:100%; padding:8px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);" /></label>
            <label>Description<input type="text" name="description" placeholder="Optional notes..." style="width:100%; padding:8px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);" /></label>
            <label><input type="checkbox" name="recurring" checked /> Recurring Annually</label>
            <div style="display:flex; gap:10px; margin-top:8px;">
              <button type="button" class="secondary-button" style="flex:1;" onclick="window.closeLeaveModalDialog()">Cancel</button>
              <button type="submit" class="primary-button" style="flex:1;">Add Holiday</button>
            </div>
          </form>
        </div>
      </div>
    `;
  } else if (leaveStore.activeModal === "editHoliday") {
    const hol = leaveStore.holidays.find(h => h.id === leaveStore.modalPayload);
    if (hol) {
      modalHtml = `
        <div style="position:fixed; inset:0; z-index:110; display:flex; align-items:center; justify-content:center; padding:16px;">
          <div onclick="window.closeLeaveModalDialog()" style="position:absolute; inset:0; background:rgba(0,0,0,0.5); backdrop-filter:blur(4px);"></div>
          <div style="position:relative; width:100%; max-width:480px; background:var(--panel-raised); border:1px solid var(--line); border-radius:20px; padding:24px; z-index:111; color:var(--text);">
            <h3 style="font-size:1.1rem; font-weight:800; margin-bottom:12px;">Edit Organization Holiday</h3>
            <form onsubmit="window.executeEditHolidaySave(event)" style="display:flex; flex-direction:column; gap:12px; font-size:0.8rem;">
              <input type="hidden" name="holidayId" value="${hol.id}" />
              <label>Holiday Name *<input type="text" name="name" required value="${hol.name}" style="width:100%; padding:8px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);" /></label>
              <label>Date *<input type="date" name="date" required value="${hol.date}" style="width:100%; padding:8px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);" /></label>
              <label>Description<input type="text" name="description" value="${hol.description || ''}" style="width:100%; padding:8px; border-radius:8px; background:var(--panel-soft); border:1px solid var(--line); color:var(--text);" /></label>
              <label><input type="checkbox" name="recurring" ${hol.recurringAnnually ? 'checked' : ''} /> Recurring Annually</label>
              <div style="display:flex; gap:10px; margin-top:8px;">
                <button type="button" class="secondary-button" style="flex:1;" onclick="window.closeLeaveModalDialog()">Cancel</button>
                <button type="submit" class="primary-button" style="flex:1;">Save Holiday Changes</button>
              </div>
            </form>
          </div>
        </div>
      `;
    }
  }





  $("#leave").innerHTML = `

    <!-- 8 Main Navigation Tabs per Spec Section 2 -->

    <div style="display:flex; overflow-x:auto; gap:6px; background:var(--panel-raised); padding:6px; border-radius:16px; border:1px solid var(--line); margin-bottom:20px;">

      ${[

        { id: 'overview', label: 'Overview', icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>` },

        { id: 'requests', label: 'Leave Requests', icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M9 12h6"/><path d="M9 16h6"/></svg>` },

        { id: 'calendar', label: 'Leave Calendar', icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>` },

        { id: 'balances', label: 'Employee Balances', icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h18"/></svg>` },

        { id: 'policies', label: 'Leave Policies', icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>` },

        { id: 'holidays', label: 'Holiday Calendar', icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24 7.17a2 2 0 0 1-1.24 1.25L11.35 13l7.18 2.24a2 2 0 0 1 1.24 1.25L22 22Z"/></svg>` },

        { id: 'reports', label: 'Reports', icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>` },

        { id: 'audit', label: 'Audit History', icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>` }

      ].map(t => `

        <button class="tab-btn ${leaveStore.activeTab === t.id ? 'active' : ''}" style="padding:8px 16px; border-radius:12px; font-size:0.8rem; font-weight:700; border:none; cursor:pointer; font-family:inherit; white-space:nowrap; display:inline-flex; align-items:center; gap:6px; ${leaveStore.activeTab === t.id ? 'background:var(--primary, #4f46e5); color:#ffffff;' : 'background:transparent; color:var(--muted-text);'}" onclick="window.switchLeaveTab('${t.id}')">

          <span>${t.icon}</span>

          <span>${t.label}</span>

        </button>

      `).join("")}

    </div>



    <!-- Main Active Tab Content -->

    ${tabContentHtml}



    <!-- Drawers & Modals -->

    ${drawerHtml}

    ${modalHtml}

  `;

}



function renderPayroll() {
  if (window.renderPayrollSuite && appState.isMockBypass) {
    window.renderPayrollSuite();
    return;
  }

  const latest = [...appState.payrollRuns].sort((a, b) => b.payrollYear - a.payrollYear || b.payrollMonth - a.payrollMonth)[0];

  const payrollItems = latest?.items || [];

  const gross = payrollItems.reduce((sum, item) => sum + Number(item.grossSalary || 0), 0);

  const deductions = payrollItems.reduce((sum, item) => sum + Number(item.lwpDeduction || 0) + Number(item.manualDeduction || 0), 0);

  $("#payroll").innerHTML = `

    <div class="grid stats-grid">

      ${stat("Payroll Cycle", latest ? `${String(latest.payrollMonth).padStart(2, "0")}/${latest.payrollYear}` : "No runs")}

      ${stat("Gross Salary", latest ? moneyDisplay(gross) : "-")}

      ${stat("Deductions", latest ? moneyDisplay(deductions) : "-", deductions ? "accent" : "")}

      ${stat("Status", latest ? humanizeStatus(latest.status) : "Not started", latest?.status === "FINALIZED" ? "success" : "")}

    </div>

    ${panel("Payroll Processing", "Attendance and leave integrated", `

      <div class="actions-row">

        ${hasPermission("PAYROLL_GENERATE") ? `<button class="primary-button" onclick="openWorkflow('payroll')">Generate Payroll</button>` : ""}

        ${hasPermission("PAYROLL_FINALIZE") ? `<button class="secondary-button" onclick="openWorkflow('payroll', { startAt: 'payslips' })">Generate Payslips</button>` : ""}

        ${hasPermission("REPORT_EXPORT_PAYROLL") ? `<button class="secondary-button" onclick="openWorkflow('report', { reportType: 'PAYROLL_REPORT' })">Export Report</button>` : ""}

      </div>

      ${table(["Employee", "Basic", "HRA", "Special Allowance", "Deductions", "Net Salary", "Actions"], payrollItems.map((item) => [

    escapeHtml(item.employee), moneyDisplay(item.basicSalary), moneyDisplay(item.hra), moneyDisplay(item.specialAllowance),

    moneyDisplay(Number(item.lwpDeduction || 0) + Number(item.manualDeduction || 0)), moneyDisplay(item.netSalary),

    actionsCell([

      actionButton("View", `scaffoldAction('View payroll item')`),

      hasPermission("PAYROLL_GENERATE") ? actionButton("Edit Components", `scaffoldAction('Edit salary components')`) : "",

      hasPermission("PAYROLL_GENERATE") ? actionButton("Add Deduction", `scaffoldAction('Add payroll deduction')`) : "",

      hasPermission("PAYROLL_GENERATE") ? actionButton("Add Bonus", `scaffoldAction('Add payroll bonus')`) : "",

      hasPermission("PAYROLL_FINALIZE") ? actionButton("Finalize", `scaffoldAction('Finalize payroll item')`) : "",

      actionButton("Payslip", `openPayslipModal('${item.employeeId}')`)

    ])

  ]), { module: "Payroll", emptyAction: hasPermission("PAYROLL_GENERATE") ? "Generate Payroll" : "" })}

    `)}

  `;

}



function moneyDisplay(value) {

  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value || 0));

}



function renderDocuments() {

  const privileged = hasPermission("DOCUMENT_READ_ALL");

  const visibleDocuments = privileged ? documents : documents.filter((row) => row.employee === currentUser().name);

  $("#documents").innerHTML = `

    ${panel(privileged ? "Document and Letter Generation" : "My Settings", privileged ? "DOCX templates with placeholders" : "Documents shared with you", `

      <div class="actions-row">

      ${hasPermission("DOCUMENT_GENERATE") ? `

        <button class="primary-button" onclick="openWorkflow('document')">Upload Template</button>

        <button class="secondary-button" onclick="openWorkflow('document')">Generate Document</button>` : ""}

        ${hasPermission("REPORT_EXPORT") ? `<button class="secondary-button" onclick="openWorkflow('report', { reportType: 'DOCUMENT_REPORT' })">Export Report</button>` : ""}

      </div>

      ${table(["Document", "Employee", "Format", "Status", "Actions"], visibleDocuments.map((row) => [

    escapeHtml(row.type), escapeHtml(row.employee), row.format,

    badge(row.status, row.status === "Shared" || row.status === "Finalized" ? "success" : row.status === "Draft" ? "warning" : ""),

    actionsCell([

      actionButton("View", `scaffoldAction('View document')`),

      row.downloadUrl ? `<a class="text-button" href="${window.HRMS_API_BASE || "http://127.0.0.1:8080"}${row.downloadUrl}" target="_blank" rel="noopener">Download</a>` : "",

      hasPermission("DOCUMENT_GENERATE") ? actionButton("Edit Template", `scaffoldAction('Edit document template')`) : "",

      hasPermission("DOCUMENT_GENERATE") ? actionButton("Regenerate", `openWorkflow('document')`) : "",

      hasPermission("DOCUMENT_GENERATE") ? actionButton("Resend Email", `scaffoldAction('Resend document email')`) : "",

      actionButton("History", `scaffoldAction('Document version history')`)

    ])

  ]), { module: "Documents", emptyAction: hasPermission("DOCUMENT_GENERATE") ? "Generate Document" : "" })}

    `)}

  `;

}



function renderAssets() {

  const privileged = hasPermission("ASSET_ASSIGN");

  const teamNames = employees.filter((employee) => employee.manager === currentUser().name).map((employee) => employee.name);

  const visibleAssets = privileged ? assets : assets.filter((row) => row[2] === currentUser().name);

  $("#assets").innerHTML = `

    ${panel(privileged ? "Asset Management" : "My Assets", "Assignment and return tracking", `

      ${privileged ? `<div class="actions-row"><button class="primary-button" onclick="scaffoldAction('Assign asset')">Assign Asset</button></div>` : ""}

      ${table(["Asset", "Asset ID", "Assigned To", "Status", "Actions"], visibleAssets.map((row) => [

    row[0], row[1], row[2], badge(row[3], row[3] === "Assigned" || row[3] === "Available" ? "success" : "warning"),

    actionsCell([

      actionButton("View", `scaffoldAction('View asset')`),

      privileged ? actionButton("Edit", `scaffoldAction('Edit asset')`) : "",

      privileged ? actionButton("Assign", `scaffoldAction('Assign asset')`) : "",

      privileged ? actionButton("Reassign", `scaffoldAction('Reassign asset')`) : "",

      privileged ? actionButton("Return", `scaffoldAction('Return asset')`) : "",

      privileged ? actionButton("Damaged/Lost", `scaffoldAction('Mark asset damaged or lost')`, true) : "",

      privileged ? actionButton("Archive", `scaffoldAction('Archive asset')`, true) : ""

    ])

  ]), { module: "Assets", emptyAction: privileged ? "Assign Asset" : "" })}

    `)}

  `;

}



function renderPerformance() {

  const reviewRows = [];

  const privileged = ["Super Admin", "HR Admin"].includes(appState.role);

  const visibleReviews = privileged ? reviewRows : reviewRows.filter((row) => row[0] === currentUser().name);

  const canCreateReview = ["Super Admin", "HR Admin"].includes(appState.role);

  $("#performance").innerHTML = `

    ${panel(privileged ? "Basic Performance Reviews" : "My Performance Reviews", "Manager and HR feedback", `

      ${canCreateReview ? `<div class="actions-row"><button class="primary-button" onclick="scaffoldAction('Create performance review')">Create Review</button></div>` : ""}

      ${table(["Employee", "Period", "Rating", "Reviewer", "Status", "Actions"], visibleReviews.map((row) => [

    row[0], row[1], row[2], row[3], badge(row[4], row[4] === "Completed" ? "success" : "warning"),

    actionsCell([

      canCreateReview ? actionButton("Create Review", `scaffoldAction('Create performance review')`) : "",

      canCreateReview ? actionButton("Edit Draft", `scaffoldAction('Edit draft review')`) : "",

      canCreateReview ? actionButton("Submit Final", `scaffoldAction('Submit final review')`) : "",

      actionButton("History", `scaffoldAction('View performance history')`)

    ])

  ]), { module: "Performance", emptyAction: canCreateReview ? "Create Review" : "" })}

    `)}

  `;

}



function renderTickets() {

  const privileged = ["Super Admin", "HR Admin"].includes(appState.role);

  const teamNames = employees.filter((employee) => employee.manager === currentUser().name).map((employee) => employee.name);

  const visibleTickets = privileged ? tickets : tickets.filter((row) => row[5] === currentUser().name);

  $("#tickets").innerHTML = `

    ${panel(privileged ? "Help Desk Tickets" : "My Support Tickets", "IT, HR and Admin requests", `

      <div class="actions-row">

        <button class="primary-button" onclick="openTicketModal()">Create Ticket</button>

        ${privileged ? `<button class="secondary-button" onclick="openWorkflow('report', { reportType: 'HELP_DESK_REPORT' })">Export Tickets</button>` : ""}

      </div>

      ${table(["Ticket", "Title", "Category", "Priority", "Status", "Actions"], visibleTickets.map((row) => [

    row[0], row[1], row[2], badge(row[3], row[3] === "High" ? "warning" : ""), badge(row[4], row[4] === "Resolved" ? "success" : row[4] === "Open" ? "warning" : ""),

    actionsCell([

      actionButton("View", `scaffoldAction('View ticket')`),

      privileged ? actionButton("Edit Status", `scaffoldAction('Edit ticket status')`) : "",

      privileged ? actionButton("Assign", `scaffoldAction('Assign ticket')`) : "",

      privileged ? actionButton("Priority", `scaffoldAction('Change ticket priority')`) : "",

      privileged ? actionButton("Internal Comment", `scaffoldAction('Add internal comment')`) : "",

      privileged ? actionButton("Resolve", `scaffoldAction('Resolve ticket')`) : "",

      actionButton("Reopen", `scaffoldAction('Reopen ticket')`)

    ])

  ]), { module: "Help Desk" })}

    `)}

  `;

}



function renderReports() {

  const visibleReports = reports;

  $("#reports").innerHTML = `

    ${panel("Reports and Export", "PDF, Excel, CSV and print", `

      ${table(["Report", "Includes", "Export"], visibleReports.map((row) => [row[0], row[1], hasPermission("REPORT_EXPORT") ? `<button class="text-button" onclick="openWorkflow('report', { reportType: '${row[0].replaceAll(" ", "_").toUpperCase()}' })">Export Report</button>` : ""]), { module: "Reports" })}

    `)}

  `;

}



function renderSettings() {

  const settings = appState.companySettings || {};

  const statuses = ["All", ...new Set(appState.departments.map((item) => item.status))];

  const parents = ["All", ...new Set(appState.departments.map((item) => item.parent).filter((value) => value && value !== "None"))];

  const heads = ["All", ...new Set(appState.departments.map((item) => item.head).filter((value) => value && value !== "Unassigned"))];

  const departmentRows = appState.departments.map((department) => `<tr data-department-row data-name="${escapeHtml(department.name.toLowerCase())}" data-code="${escapeHtml(department.code.toLowerCase())}" data-status="${escapeHtml(department.status)}" data-parent="${escapeHtml(department.parent)}" data-head="${escapeHtml(department.head)}">

    <td><strong>${escapeHtml(department.name)}</strong></td><td>${escapeHtml(department.code)}</td><td>${escapeHtml(department.head)}</td>

    <td>${department.employees}</td><td>${escapeHtml(department.parent)}</td><td>${badge(department.status, department.status === "Active" ? "success" : "neutral")}</td><td>${escapeHtml(department.created)}</td>

    <td><div class="table-actions"><button class="text-button" onclick="openWorkflow('department', { departmentId: ${department.id}, startStep: 2, viewOnly: true })">View</button>

      ${appState.backendPermissions.includes("DEPARTMENT_UPDATE") ? `<button class="text-button" onclick="openWorkflow('department', { departmentId: ${department.id} })">Edit</button><button class="text-button" onclick="openWorkflow('department', { departmentId: ${department.id}, startStep: 1 })">Assign Head</button>` : ""}

      ${appState.backendPermissions.includes("DEPARTMENT_ARCHIVE") && department.status !== "Archived" ? `<button class="text-button" onclick="quickArchiveDepartment(${department.id})">Archive</button>` : ""}

      ${appState.backendPermissions.includes("DEPARTMENT_DELETE") ? `<button class="text-button danger-text" onclick="quickDeleteDepartment(${department.id})">Delete</button>` : ""}</div></td></tr>`).join("");

  $("#settings").innerHTML = `

    <div class="grid two-col">

      ${panel("Company Profile", "Digi Rathi", `

        <form class="form-grid" id="companySettingsForm" onsubmit="saveCompanySettings(event)">

          <label>Company Name<input name="companyName" value="${escapeAttr(settings.companyName || "Digi Rathi")}" /></label>

          <label>Email<input name="email" value="${escapeAttr(settings.email || "demo07@example.test")}" /></label>

          <label>Phone<input name="phone" value="${escapeAttr(settings.phone || "+91 98765 43210")}" /></label>

          <label>Website<input name="website" value="${escapeAttr(settings.website || "https://digirathi.com")}" /></label>

          <label class="full-span">Office Address<input name="officeAddress" value="${escapeAttr(settings.officeAddress || "Single office, India")}" /></label>

          <div class="form-actions full-span"><button class="primary-button" type="submit">Save Company Profile</button></div>

        </form>

      `)}

      ${panel("Policy Settings", "Backend API required", `

        <p class="helper-note">Editing company settings works here. Editing leave policies, shifts, roles, branding and notification channels requires backend API support.</p>

        <div class="mini-list">

          <div class="mini-item"><strong>2FA</strong><span>Every 30 days</span></div>

          <div class="mini-item"><strong>Leave Carry Forward</strong><span>Disabled</span></div>

          <div class="mini-item"><strong>Office Shift</strong><span>10:00 AM - 7:00 PM</span></div>

          <div class="mini-item"><strong>Notifications</strong><span>Email, In-app, Push, WhatsApp</span></div>

        </div>

        <div class="actions-row" style="margin-top:14px">

          <button class="secondary-button" onclick="scaffoldAction('Edit holidays')">Edit Holidays</button>

          <button class="secondary-button" onclick="scaffoldAction('Edit shifts')">Edit Shifts</button>

          <button class="secondary-button" onclick="scaffoldAction('Edit roles')">Edit Roles</button>

          <button class="secondary-button" onclick="scaffoldAction('Edit branding')">Edit Branding</button>

        </div>

      `)}

    </div>

    <div style="margin-top:16px">

      ${panel("Department Management", "Create, edit, archive and assign department heads", `

        <div class="department-filters">

          <input class="search-bar" id="departmentSearch" placeholder="Search name or code" oninput="applyDepartmentTableFilters()" />

          <select id="departmentStatusFilter" aria-label="Filter by status" onchange="applyDepartmentTableFilters()">${statuses.map((value) => `<option>${escapeHtml(value)}</option>`).join("")}</select>

          <select id="departmentParentFilter" aria-label="Filter by parent department" onchange="applyDepartmentTableFilters()">${parents.map((value) => `<option>${escapeHtml(value)}</option>`).join("")}</select>

          <select id="departmentHeadFilter" aria-label="Filter by department head" onchange="applyDepartmentTableFilters()">${heads.map((value) => `<option>${escapeHtml(value)}</option>`).join("")}</select>

          ${hasPermission("DEPARTMENT_CREATE") ? `<button class="primary-button" onclick="openWorkflow('department')">Create Department</button>` : ""}

        </div>

        ${departmentRows ? `<div class="table-wrap" style="margin-top:14px"><table><thead><tr>${["Department", "Code", "Head", "Employees", "Parent", "Status", "Created", "Actions"].map((heading) => `<th scope="col">${heading}</th>`).join("")}</tr></thead><tbody>${departmentRows}</tbody></table></div>` : emptyState("Departments", { action: hasPermission("DEPARTMENT_CREATE") ? "Create Department" : "" })}

        <div class="empty-state compact" id="departmentFilterEmpty" hidden><i data-lucide="search-x"></i><strong>No matching departments</strong><span>Change or clear the current filters.</span></div>

      `)}

    </div>

  `;

}



function applyDepartmentTableFilters() {

  const search = ($("#departmentSearch")?.value || "").trim().toLowerCase();

  const status = $("#departmentStatusFilter")?.value || "All";

  const parent = $("#departmentParentFilter")?.value || "All";

  const head = $("#departmentHeadFilter")?.value || "All";

  let visible = 0;

  document.querySelectorAll("[data-department-row]").forEach((row) => {

    const matches = (!search || row.dataset.name.includes(search) || row.dataset.code.includes(search))

      && (status === "All" || row.dataset.status === status) && (parent === "All" || row.dataset.parent === parent)

      && (head === "All" || row.dataset.head === head);

    row.hidden = !matches; if (matches) visible += 1;

  });

  if ($("#departmentFilterEmpty")) $("#departmentFilterEmpty").hidden = visible !== 0;

}



async function quickArchiveDepartment(id) {

  const department = appState.departments.find((item) => item.id === id);

  if (!department || !window.confirm(`Archive ${department.name}? It will be removed from new onboarding selections.`)) return;

  try { const updated = await apiRequest(`/api/v1/departments/${id}/archive`, { method: "PATCH" }); department.status = humanizeStatus(updated.status); renderSettings(); refreshIcons(); showToast("Department archived"); }

  catch (error) { showToast(error.message); }

}



async function quickDeleteDepartment(id) {

  const department = appState.departments.find((item) => item.id === id);

  if (!department || !window.confirm(`Delete ${department.name}? This cannot be undone.`)) return;

  try { await apiRequest(`/api/v1/departments/${id}`, { method: "DELETE" }); appState.departments = appState.departments.filter((item) => item.id !== id); renderSettings(); refreshIcons(); showToast("Department deleted"); }

  catch (error) { showToast(error.message); }

}



function renderNotifications() {

  const visible = roleNotifications();

  const unread = visible.filter((item) => !item.read).length;

  $("#notificationList").innerHTML = visible.length ? visible.map((item) => `

    <div class="mini-item notification-item ${item.read ? "is-read" : ""}">

      <div>

        <strong>${escapeHtml(item.category)}</strong>

        <span class="muted">${escapeHtml(item.message)}</span>

      </div>

      <span class="status">${escapeHtml(item.time)}</span>

    </div>

  `).join("") : `<div class="empty-state compact"><i data-lucide="bell-off"></i><strong>No notifications</strong><span>New account activity will appear here.</span></div>`;

  $("#notificationCount").textContent = unread;

  $("#notificationCount").hidden = unread === 0;

  $("#markReadButton").disabled = unread === 0;

}



function toggleNotifications() {

  const drawer = $("#notificationDrawer");

  const willOpen = drawer.hidden;

  drawer.hidden = !willOpen;

  drawer.classList.toggle("open", willOpen);

  drawer.setAttribute("aria-hidden", String(!willOpen));

  $("#notificationButton").setAttribute("aria-expanded", String(willOpen));

}



function closeNotifications() {

  const drawer = $("#notificationDrawer");

  drawer.classList.remove("open");

  drawer.hidden = true;

  drawer.setAttribute("aria-hidden", "true");

  $("#notificationButton").setAttribute("aria-expanded", "false");

}



function markAllNotificationsRead() {

  roleNotifications().forEach((item) => { item.read = true; });

  renderNotifications();

  closeNotifications();

  showToast("Notifications marked as read");

}



function table(headers, rows, options = {}) {

  if (!rows.length) return emptyState(options.module || "Records", { action: options.emptyAction });

  return `

    <div class="table-wrap" style="margin-top:14px">

      <table>

        <thead><tr>${headers.map((h) => `<th scope="col">${h}</th>`).join("")}</tr></thead>

        <tbody>

          ${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}

        </tbody>

      </table>

    </div>

  `;

}



function badge(label, type = "") {

  return `<span class="status ${type}">${label}</span>`;

}



function handleQuickAction(action) {
  if(action === "Employee Directory"){setView("directory");return;}
  if(action === "My Settings"){setView("settings");return;}

  if (action === "Employee Onboard") { openWorkflow("onboard"); return; }

  if (action === "Create Department") { openWorkflow("department"); return; }

  if (action === "Generate Payroll") { openWorkflow("payroll"); return; }

  if (action === "Employee Directory") { openWorkflow("document"); return; }

  if (action === "View Leave Calendar") { openWorkflow("leaveCalendar"); return; }

  if (action === "Export Team Report" || action === "View Reports") { openWorkflow("report"); return; }

  if (action === "Clock In / Clock Out") {

    if (appState.checkedIn) checkOut();

    else checkIn(false);

    return;

  }

  if (action === "Apply Leave" || action === "Leave Apply") {

    openLeaveModal();

    return;

  }

  if (action === "Holiday List") {

    if (["Super Admin", "HR Admin"].includes(appState.role)) {

      openWorkflow("holidayList");

    } else {

      openWorkflow("leaveCalendar");

    }

    return;

  }

  if (action === "Raise Ticket") {

    openTicketModal();

    return;

  }

  if (action === "Salary Slip" && window.openEmployeePayslips) {
    window.openEmployeePayslips();
    return;
  }
  if (action === "My Settings") {

    setView("documents");

    return;

  }

  const routes = {

    "View Team": "employees",

    "Employee Directory": "performance",

    "View Attendance": "attendance",

    "View Documents": "documents"

  };

  if (routes[action]) {

    setView(routes[action]);

    return;

  }

  if (action === "Publish Announcement") {

    showToast("Announcements are not enabled yet");

    return;

  }

  showToast(`${action} opened`);

}



function filterEmployeeTable(value) {

  const term = String(value || "").trim().toLowerCase();

  document.querySelectorAll("#employees tbody tr").forEach((row) => {

    row.hidden = !!term && !row.textContent.toLowerCase().includes(term);

  });

}



function openLeaveModal() {
  const modal = $("#leaveModal");
  if (!modal) return;
  const select = $("#leaveForm select[name='leaveType']");
  if (select) {
    const user = currentUser();
    const activeTypes = leaveStore.leaveTypes.filter(t => t.isActive);
    select.innerHTML = activeTypes.map(t => {
      const bal = leaveStore.balances.find(b => isOwnEmployeeRecord(b) && b.leaveTypeId === t.id);
      const avail = bal ? bal.availableBalance : 0;
      return `<option value="${escapeHtml(t.name)}" data-type-id="${t.id}">${escapeHtml(t.name)} (${avail}d available &middot; ${t.isPaid ? 'Paid' : 'Unpaid'})</option>`;
    }).join("");
  }
  const today = new Date().toISOString().slice(0, 10);
  const startInput = $("#leaveForm input[name='startDate']");
  const endInput = $("#leaveForm input[name='endDate']");
  if (startInput) startInput.value = today;
  if (endInput) endInput.value = today;
  modal.showModal();
  if (select) select.focus();
}

function openTicketModal() {
  $("#ticketModal").showModal();
  $("#ticketForm select").focus();
}

async function submitLeaveRequest(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const start = data.get("startDate");
  const end = data.get("endDate");
  if (end < start) {
    form.elements.endDate.setCustomValidity("End date must be on or after the start date.");
    form.elements.endDate.reportValidity();
    form.elements.endDate.setCustomValidity("");
    return;
  }

  const duration = data.get("duration");
  const isHalfDay = duration !== "Full Day";
  if (isHalfDay && start !== end) {
    alert("Half day leave can only be applied for a single date. Please match Start Date and End Date.");
    return;
  }

  const button = $("#submitLeaveButton");
  button.disabled = true;
  button.textContent = "Submitting...";

  try {
    const leaveTypeName = data.get("leaveType");
    const leaveTypeObj = leaveStore.leaveTypes.find(t => t.name === leaveTypeName) || leaveStore.leaveTypes[0];
    const user = currentUser();
    const dayTypeVal = duration === "First Half" ? "FIRST_HALF" : duration === "Second Half" ? "SECOND_HALF" : "FULL_DAY";
    HRDomain.requireValue(leaveTypeObj && leaveTypeObj.isActive, 'Choose an active leave policy.');
    HRDomain.reason(data.get('reason'));
    const daysCount = window.calculateLeaveWorkingDays(start,end,dayTypeVal,leaveTypeObj,leaveStore.holidays);

    const bal = leaveStore.balances.find(b => isOwnEmployeeRecord(b) && b.leaveTypeId === leaveTypeObj.id);
    HRDomain.requireValue(bal,'Ask an administrator to assign this leave policy before applying.');
    const reserved=leaveStore.requests.filter(r=>isOwnEmployeeRecord(r)&&r.leaveTypeId===leaveTypeObj.id&&['PENDING_APPROVAL','MORE_INFORMATION_REQUIRED'].includes(r.status)).reduce((sum,r)=>sum+r.totalDays,0);
    const curBal=bal.availableBalance-reserved;
    const validation=window.validateLeavePolicyRules(administrativeEmployee(user.id),leaveTypeObj,start,end,daysCount,curBal,leaveStore.requests,leaveStore.probationSettings);
    HRDomain.requireValue(validation.valid,validation.error);
    const overlap=leaveStore.requests.some(r=>isOwnEmployeeRecord(r)&&['APPROVED','CANCELLATION_REQUESTED','PENDING_APPROVAL','MORE_INFORMATION_REQUIRED'].includes(r.status)&&r.startDate<=end&&r.endDate>=start&&(dayTypeVal==='FULL_DAY'||!r.dayType||r.dayType==='FULL_DAY'||r.dayType===dayTypeVal));
    HRDomain.requireValue(!overlap,'You already have leave or a pending request for these dates.');
    const afterBal=curBal-daysCount;

    const newReqId = `lr-${Date.now()}`;
    const newAdminReq = {
      id: newReqId,
      employeeId: user.id || "EMP001",
      employeeName: user.name || "Digi Rathi Employee",
      employeeCode: user.code || user.id || "DR-1001",
      department: user.department || "Engineering",
      joiningDate: user.joiningDate || "2024-01-01",
      leaveTypeId: leaveTypeObj ? leaveTypeObj.id : "lt-casual",
      leaveTypeName: leaveTypeName,
      isPaid: leaveTypeObj ? leaveTypeObj.isPaid : true,
      startDate: start,
      endDate: end,
      dayType: dayTypeVal,
      totalDays: daysCount,
      currentBalance: curBal,
      balanceAfterApp: afterBal,
      reason: data.get("reason"),
      status: "PENDING_APPROVAL",
      approvalRole: appState.role === "HR Admin" ? "SUPER_ADMIN" : "HR_ADMIN",
      submittedAt: new Date().toISOString(),
      hasAttendanceConflict: false,
      hasOverlappingLeave: false
    };

    leaveStore.requests.unshift(newAdminReq);
    leaveStore.auditLogs.unshift({
      id: `lal-${Date.now()}`,
      employeeId: user.id || "EMP001",
      employeeName: user.name || "Employee",
      action: "CREATE_REQUEST",
      performedBy: user.name || "Employee",
      userRole: appState.role === "Super Admin" ? "SUPER_ADMIN" : appState.role === "HR Admin" ? "HR_ADMIN" : "EMPLOYEE",
      reason: `Submitted leave request for ${start}${start !== end ? ' to ' + end : ''} (${daysCount}d)`,
      ipAddress: "127.0.0.1",
      createdAt: new Date().toISOString()
    });

    notifications.unshift({
      id: `notif-${Date.now()}`,
      category: "Leave Request",
      message: `New leave request submitted by ${user.name} for ${start}`,
      time: "Just now",
      read: false,
      roles: ["Super Admin", "HR Admin"]
    });

    appState.leaveRequests.unshift([
      escapeHtml(leaveTypeName),
      `${formatDate(start)}${start !== end ? ' - ' + formatDate(end) : ''}`,
      `${daysCount} day(s)`,
      badge("Pending", "warning")
    ]);

    form.reset();
    $("#leaveModal").close();
    renderLeave();
    renderDashboard();
    refreshIcons();
    showToast(`✓ Leave request for ${leaveTypeName} (${daysCount} day(s)) submitted successfully and added to review queue.`, "success");
  } catch (error) {
    showToast(error.message, "danger");
  } finally {
    button.disabled = false;
    button.textContent = "Submit Request";
  }
}



function submitTicketRequest(event) {

  event.preventDefault();

  const form = event.currentTarget;

  if (!form.reportValidity()) return;

  const data = new FormData(form);

  const ticketNumber = `TKT-2026-${String(145 + tickets.length).padStart(6, "0")}`;

  tickets.unshift([

    ticketNumber,

    escapeHtml(data.get("title")),

    escapeHtml(data.get("category")),

    escapeHtml(data.get("priority")),

    "Open",

    currentUser().name

  ]);

  form.reset();

  $("#ticketModal").close();

  renderTickets();

  refreshIcons();

  showToast(`${ticketNumber} created`);

}



function formatDate(value) {

  return HRDomain.date(value);

}



function escapeHtml(value) {

  return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);

}



function escapeAttr(value) {

  return escapeHtml(String(value)).replaceAll("`", "&#96;");

}



async function saveCompanySettings(event) {

  event.preventDefault();

  if (!hasPermission("SETTINGS_UPDATE")) {

    showToast("You do not have permission to update company settings.");

    return;

  }

  const form = event.currentTarget;

  const button = form.querySelector("button[type='submit']");

  const values = Object.fromEntries(new FormData(form).entries());

  button.disabled = true;

  button.textContent = "Saving...";

  try {

    appState.companySettings = await apiRequest("/api/v1/settings", { method: "PUT", body: JSON.stringify(values) });

    renderSettings();

    refreshIcons();

    showToast("Company profile saved");

  } catch (error) {

    showToast(error.message);

  } finally {

    button.disabled = false;

    button.textContent = "Save Company Profile";

  }

}



async function checkIn(wfh) {
  if (!window.EmployeeWorkspace) { showToast('Attendance is still loading. Please try again.'); return; }
  return EmployeeWorkspace.punch(wfh ? 'WFH' : 'OFFICE');
}

async function checkOut() {
  if (!window.EmployeeWorkspace) { showToast('Attendance is still loading. Please try again.'); return; }
  return EmployeeWorkspace.punch('OUT');
}
// Haversine distance formula in meters

function getDistance(lat1, lon1, lat2, lon2) {

  const R = 6371e3;

  const p1 = lat1 * Math.PI / 180;

  const p2 = lat2 * Math.PI / 180;

  const dp = (lat2 - lat1) * Math.PI / 180;

  const dl = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(dp / 2) * Math.sin(dp / 2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;

}



function requestCurrentPosition() {

  if (!navigator.geolocation) return Promise.reject(new Error("Location is not available in this browser."));

  return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve,

    () => reject(new Error("Allow location access to clock in from the office.")), { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }));

}



function getWorkingTime() {

  if (appState.checkedIn && appState.clockInTime) {

    const elapsedMinutes = Math.max(0, Math.floor((Date.now() - appState.clockInTime) / 60000));

    return `${String(Math.floor(elapsedMinutes / 60)).padStart(2, "0")}:${String(elapsedMinutes % 60).padStart(2, "0")}`;

  }

  return appState.lastShiftWorkingTime || "00:00";

}



function getWorkingTimeLabel() {

  return appState.checkedIn ? `Working ${getWorkingTime()}` : "00:00";

}



function getWorkingProgress() {

  if (!appState.checkedIn || !appState.clockInTime) return 0;

  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - appState.clockInTime) / 60000));

  return Math.min(100, Math.round((elapsedMinutes / 540) * 100));

}



function refreshClockControls() {
  refreshIcons();
}

function toggleTheme() {

  appState.theme = appState.theme === "dark" ? "light" : "dark";

  window.hrmsPreferences.write("drTheme", appState.theme);

  document.documentElement.dataset.theme = appState.theme;

  updateThemeIcon();

}



function updateThemeIcon() {

  document.querySelectorAll("#themeToggle, #authThemeToggle").forEach((themeButton) => {

    themeButton.innerHTML = `<i data-lucide="${appState.theme === "dark" ? "sun" : "moon"}"></i>`;

    themeButton.setAttribute("aria-label", appState.theme === "dark" ? "Switch to light mode" : "Switch to dark mode");

  });

  refreshIcons();

}



function refreshIcons() {

  if (window.lucide) window.lucide.createIcons({ attrs: { "stroke-width": 1.8 } });

}



function showToast(message, type = "success") {
  const toast = $("#toast");
  if (!toast) return;

  let resolvedType = type;
  if (type === "success" && (message.startsWith("✕") || message.toLowerCase().includes("rejected") || message.toLowerCase().includes("conflict"))) {
    resolvedType = "danger";
  } else if (type === "success" && (message.startsWith("ℹ") || message.toLowerCase().includes("clarification") || message.toLowerCase().includes("switched"))) {
    resolvedType = "info";
  }

  toast.className = "toast " + resolvedType;
  const icon = ["danger", "error"].includes(resolvedType) ? "circle-alert" : resolvedType === "info" ? "info" : "circle-check";
  const cleanMsg = message.replace(/^[✓✕ℹ]\s*/, "");
  toast.innerHTML = `<span class="toast-icon"><i data-lucide="${icon}"></i></span><span>${escapeHtml(cleanMsg)}</span>`;
  toast.classList.add("show");
  refreshIcons();

  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 5500);
}



function toggleSidebar() {

  const sidebar = $("#sidebar");

  const backdrop = $("#sidebarBackdrop");

  if (sidebar.classList.contains("open")) {

    closeSidebar();

    return;

  }

  appState.sidebarReturnFocus = document.activeElement;

  sidebar.inert = false;

  sidebar.removeAttribute("inert");

  sidebar.setAttribute("aria-hidden", "false");

  setSidebarFocusable(true);

  sidebar.classList.add("open");

  backdrop.classList.add("open");

  document.body.classList.add("nav-open");

  $("#menuToggle").setAttribute("aria-expanded", "true");

  $("#sidebarClose").focus();

}



function closeSidebar() {
  const sidebar = $("#sidebar");
  const desktop = window.matchMedia("(min-width: 1100px)").matches;
  const wasOpen = sidebar.classList.contains("open");
  sidebar.classList.remove("open");
  sidebar.inert = !desktop;
  sidebar.setAttribute("aria-hidden", String(!desktop));
  setSidebarFocusable(desktop);
  $("#sidebarBackdrop").classList.remove("open");
  document.body.classList.remove("nav-open");
  $("#menuToggle").setAttribute("aria-expanded", "false");
  if (wasOpen && !desktop && appState.sidebarReturnFocus?.isConnected) appState.sidebarReturnFocus.focus();
}

function setSidebarFocusable(isOpen) {

  $("#sidebar").querySelectorAll("button, select, [href], input").forEach((element) => {

    if (isOpen) {

      const previous = element.dataset.closedTabindex;

      if (previous === undefined || previous === "") element.removeAttribute("tabindex");

      else element.setAttribute("tabindex", previous);

      delete element.dataset.closedTabindex;

      return;

    }

    if (!element.hasAttribute("data-closed-tabindex")) {

      element.dataset.closedTabindex = element.getAttribute("tabindex") || "";

    }

    element.setAttribute("tabindex", "-1");

  });

}



function handleGlobalKeydown(event) {

  if (event.key === "Escape") {

    if ($("#sidebar").classList.contains("open")) closeSidebar();

    if (!$("#notificationDrawer").hidden) closeNotifications();

    return;

  }

  if (event.key !== "Tab" || !$("#sidebar").classList.contains("open")) return;

  const focusable = [...$("#sidebar").querySelectorAll("button:not([disabled]), select:not([disabled]), [href], input:not([disabled])")];

  if (!focusable.length) return;

  const first = focusable[0];

  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {

    event.preventDefault();

    last.focus();

  } else if (!event.shiftKey && document.activeElement === last) {

    event.preventDefault();

    first.focus();

  }

}



function filterTodayAttendanceTable(query) {

  const q = (query || '').toLowerCase().trim();

  const rows = document.querySelectorAll('#todayAttendanceTable tbody tr');

  let visible = 0;



  rows.forEach((row) => {

    const empName = row.children[0]?.textContent?.toLowerCase() || '';

    const empId = row.children[1]?.textContent?.toLowerCase() || '';

    const dept = row.children[2]?.textContent?.toLowerCase() || '';



    if (!q || empName.includes(q) || empId.includes(q) || dept.includes(q)) {

      row.style.display = '';

      visible++;

    } else {

      row.style.display = 'none';

    }

  });



  const countEl = document.getElementById('visibleCount');

  if (countEl) countEl.textContent = visible;



  const noResults = document.getElementById('noAttendanceResults');

  if (noResults) {

    noResults.style.display = visible === 0 ? 'block' : 'none';

  }

}



// ============================================================

// ATTENDANCE HISTORY — STATE

// ============================================================

appState.historyTab = "weekly";

appState.historySummaryCardFilter = null;

appState.historyPeriodOffset = 0;

appState.historyCustomStart = null;

appState.historyCustomEnd = null;



function getRelativeHistDate(daysAgo) {

  const d = new Date();

  d.setDate(d.getDate() - daysAgo);

  const m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`;

}



const mockHistoryDataset = [

  { id:"ATT-HIST-001", employeeName:"Demo Person 01",    employeeId:"DR-002", department:"Engineering", date:getRelativeHistDate(0), workMode:"WFH",    clockIn:"08:45 AM", clockOut:"06:20 PM", workingHours:"09h 35m", status:"COMPLETED",         verification:"NOT_REQUIRED",       correctionStatus:"NO_REQUEST",       lastModified:"—" },

  { id:"ATT-HIST-002", employeeName:"Demo Person 02",     employeeId:"DR-003", department:"HR",          date:getRelativeHistDate(0), workMode:null,     clockIn:"—",        clockOut:"—",        workingHours:"00h 00m", status:"ON_LEAVE",           verification:null,                 correctionStatus:"APPROVED",         lastModified:`HR · ${getRelativeHistDate(0)}` },

  { id:"ATT-HIST-003", employeeName:"Demo Person 03",     employeeId:"DR-004", department:"Engineering", date:getRelativeHistDate(1), workMode:"OFFICE", clockIn:"09:55 AM", clockOut:"—",        workingHours:"—",       status:"MISSING_CLOCK_OUT",  verification:"IP_VERIFIED",        correctionStatus:"PENDING_REVIEW",   lastModified:"—" },

  { id:"ATT-HIST-004", employeeName:"Demo Person 04",        employeeId:"DR-005", department:"Accounts",    date:getRelativeHistDate(1), workMode:"OFFICE", clockIn:"09:30 AM", clockOut:"06:45 PM", workingHours:"09h 15m", status:"COMPLETED",         verification:"IP_AND_GPS_VERIFIED", correctionStatus:"NO_REQUEST",       lastModified:"—" },

  { id:"ATT-HIST-005", employeeName:"Demo Person 05",  employeeId:"DR-006", department:"Marketing",   date:getRelativeHistDate(2), workMode:"WFH",    clockIn:"09:00 AM", clockOut:"05:30 PM", workingHours:"08h 30m", status:"MANUALLY_CORRECTED", verification:"NOT_REQUIRED",       correctionStatus:"APPROVED",         lastModified:`Super Admin · ${getRelativeHistDate(2)}` },

  { id:"ATT-HIST-006", employeeName:"Demo Person 06",    employeeId:"DR-007", department:"Operations",  date:getRelativeHistDate(3), workMode:"OFFICE", clockIn:"—",        clockOut:"—",        workingHours:"00h 00m", status:"NOT_CLOCKED_IN",     verification:"NOT_VERIFIED",       correctionStatus:"NO_REQUEST",       lastModified:"—" },

  { id:"ATT-HIST-007", employeeName:"Demo Person 07",     employeeId:"DR-008", department:"Product",     date:getRelativeHistDate(4), workMode:null,     clockIn:"—",        clockOut:"—",        workingHours:"00h 00m", status:"WEEK_OFF",           verification:null,                 correctionStatus:"NO_REQUEST",       lastModified:"—" },

  { id:"ATT-HIST-008", employeeName:"Demo Person 08",    employeeId:"DR-009", department:"Engineering", date:getRelativeHistDate(5), workMode:null,     clockIn:"—",        clockOut:"—",        workingHours:"00h 00m", status:"HOLIDAY",            verification:null,                 correctionStatus:"NO_REQUEST",       lastModified:"—" },

  { id:"ATT-HIST-009", employeeName:"Demo Person 09",  employeeId:"DR-010", department:"HR",          date:getRelativeHistDate(6), workMode:"OFFICE", clockIn:"09:10 AM", clockOut:"12:30 PM", workingHours:"03h 20m", status:"INCOMPLETE_HOURS",   verification:"IP_VERIFIED",        correctionStatus:"MORE_INFO_REQUIRED",lastModified:"—" },

  { id:"ATT-HIST-010", employeeName:"Demo Person 10",     employeeId:"DR-001", department:"Management",  date:getRelativeHistDate(7), workMode:"OFFICE", clockIn:"09:00 AM", clockOut:"06:30 PM", workingHours:"09h 30m", status:"COMPLETED",         verification:"IP_AND_GPS_VERIFIED", correctionStatus:"NO_REQUEST",       lastModified:"—" }

];



// ============================================================

// STYLE INJECTION

// ============================================================

function setupHistoryStyles() {

  if (document.getElementById("histStyleTag")) return;

  const s = document.createElement("style");

  s.id = "histStyleTag";

  s.textContent = `

    .hist-dd-item {

      display:block; width:100%; text-align:left; padding:8px 10px;

      border-radius:6px; background:none; border:none; color:var(--text);

      font-size:0.75rem; font-weight:600; cursor:pointer; transition:background 0.15s;

    }

    .hist-dd-item:hover { background:var(--primary-soft); color:var(--primary); }

    .hist-modal-input {

      width:100%; padding:9px 12px; border-radius:8px; background:var(--panel-soft);

      border:1px solid var(--line-strong); color:var(--text); font-size:0.82rem;

      box-sizing:border-box; outline:none; transition:border 0.15s;

    }

    .hist-modal-input:focus { border-color:var(--primary); }

    .hist-modal-btn-primary {

      padding:9px 18px; border-radius:10px; background:var(--primary); color:#fff;

      font-size:0.82rem; font-weight:700; border:none; cursor:pointer;

      transition:background 0.15s;

    }

    .hist-modal-btn-primary:hover { opacity:0.9; }

    .hist-modal-btn-secondary {

      padding:9px 18px; border-radius:10px; background:var(--primary-soft);

      color:var(--primary); font-size:0.82rem; font-weight:600;

      border:1px solid var(--line-strong); cursor:pointer; transition:background 0.15s;

    }

    .hist-modal-btn-secondary:hover { opacity:0.85; }

    @keyframes histSlideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }

    @keyframes histFadeIn  { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }

  `;

  document.head.appendChild(s);

}



// ============================================================

// DATE UTILITIES

// ============================================================

function histFmtDate(d) {

  const m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`;

}

function histFmtDateLong(d) {

  const m = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  return `${m[d.getMonth()]} ${d.getFullYear()}`;

}

function histParseDate(str) { const iso=HRDomain.isoDate(str); return new Date(iso ? iso+"T00:00:00" : str); }



function getHistoryDateRange() {

  const today = new Date(); today.setHours(0,0,0,0);

  const tab    = appState.historyTab;

  const offset = appState.historyPeriodOffset;



  if (tab === "custom") {

    const s = appState.historyCustomStart ? new Date(appState.historyCustomStart + "T00:00:00") : null;

    const e = appState.historyCustomEnd   ? new Date(appState.historyCustomEnd   + "T23:59:59") : null;

    const label = (s && e) ? `${histFmtDate(s)} – ${histFmtDate(e)}` : (s ? `From ${histFmtDate(s)}` : "Select date range");

    return { start: s, end: e, label };

  }

  if (tab === "monthly") {

    const base  = new Date(today.getFullYear(), today.getMonth() + offset, 1);

    const start = new Date(base.getFullYear(), base.getMonth(), 1); start.setHours(0,0,0,0);

    const end   = new Date(base.getFullYear(), base.getMonth() + 1, 0); end.setHours(23,59,59,999);

    return { start, end, label: histFmtDateLong(start) };

  }

  if (tab === "yearly") {

    const yr    = today.getFullYear() + offset;

    const start = new Date(yr, 0, 1); start.setHours(0,0,0,0);

    const end   = new Date(yr, 11, 31); end.setHours(23,59,59,999);

    return { start, end, label: String(yr) };

  }

  // weekly (default)

  const day  = today.getDay();

  const diff = day === 0 ? -6 : 1 - day;

  const mon  = new Date(today); mon.setDate(today.getDate() + diff + offset * 7); mon.setHours(0,0,0,0);

  const sun  = new Date(mon); sun.setDate(mon.getDate() + 6); sun.setHours(23,59,59,999);

  return { start: mon, end: sun, label: `${histFmtDate(mon)} – ${histFmtDate(sun)}` };

}



function getDatasetForPeriod() {

  const { start, end } = getHistoryDateRange();

  const visible = mockHistoryDataset.filter(item => ["Super Admin", "HR Admin"].includes(appState.role) || item.employeeId === currentUser().id);
  if (!start || !end) return visible;

  return visible.filter(item => {

    const d = histParseDate(item.date);

    return !isNaN(d.getTime()) && d >= start && d <= end;

  });

}



// ============================================================

// SUMMARY CARDS (Dynamic)

// ============================================================

function buildHistorySummaryCardsHtml() {

  const ds     = getDatasetForPeriod();

  const active = appState.historySummaryCardFilter;

  const total     = ds.length;

  const present   = ds.filter(r => ["COMPLETED","CLOCKED_IN","MANUALLY_CORRECTED"].includes(r.status)).length;

  const office    = ds.filter(r => r.workMode === "OFFICE").length;

  const wfh       = ds.filter(r => r.workMode === "WFH").length;

  const onLeave   = ds.filter(r => r.status === "ON_LEAVE").length;

  const missingCO = ds.filter(r => r.status === "MISSING_CLOCK_OUT").length;

  const incomplete= ds.filter(r => r.status === "INCOMPLETE_HOURS").length;

  const pending   = ds.filter(r => r.correctionStatus === "PENDING_REVIEW").length;



  function card(key, label, value, color, sub) {

    const isActive = active === key;

    const bStyle   = isActive

      ? `border:2px solid ${color}; box-shadow:0 0 0 3px ${color}26;`

      : `border:1px solid var(--line-strong);`;

    const fn = (key === "ALL") ? `window.clearHistoryCardFilter()` : `window.filterHistoryCard('${key}')`;

    return `

      <div class="hist-card" style="padding:10px; border-radius:14px; background:var(--panel-raised); ${bStyle} cursor:pointer;

                  transition:border 0.15s, box-shadow 0.15s; position:relative;"

           onclick="${fn}">

        ${isActive ? `<div style="position:absolute;top:7px;right:7px;width:8px;height:8px;border-radius:50%;background:${color};"></div>` : ""}

        <div style="font-size:0.68rem; font-weight:700; color:${isActive ? color : "var(--muted-text)"};">${label}</div>

        <div style="font-size:1.3rem; font-weight:800; color:${color}; margin-top:2px;">${value}</div>

        <div style="font-size:0.63rem; color:var(--muted-text);">${sub}</div>

      </div>`;

  }



  return `

    ${card("ALL",                "Total Records",        total,     "var(--muted-text)", "All entries")}

    ${card("PRESENT",            "Present Days",         present,   "var(--success)", "Clocked in/done")}

    ${card("OFFICE",             "Office Days",          office,    "var(--primary)", "In-office")}

    ${card("WFH",                "WFH Days",             wfh,       "#22d3ee", "Remote work")}

    ${card("ON_LEAVE",           "Leave Days",           onLeave,   "var(--warning)", "Approved leaves")}

    ${card("MISSING_CLOCK_OUT",  "Missing Clock-Outs",  missingCO,  "var(--danger)", "Needs clock-out")}

    ${card("INCOMPLETE_HOURS",   "Incomplete Records",  incomplete,  "#c084fc", "Partial hours")}

    ${card("PENDING_CORRECTIONS","Pending Corrections",  pending,   "var(--warning)", "Needs HR review")}`;

}



function updateSummaryCards() {

  const grid = document.getElementById("historySummaryCardsGrid");

  if (grid) grid.innerHTML = buildHistorySummaryCardsHtml();

  // Sync pending badge on header button across all records requiring review

  const pending = mockHistoryDataset.filter(r => ["PENDING_REVIEW", "MORE_INFO_REQUIRED"].includes(r.correctionStatus)).length;

  const badge = document.getElementById("pendingCRBadge");

  if (badge) badge.textContent = pending;

}



// ============================================================

// NAVIGATION CONTROLS (Dynamic)

// ============================================================

function updateNavControls() {

  const container = document.getElementById("tabControlsContainer");

  if (!container) return;

  const tab = appState.historyTab;

  const { label } = getHistoryDateRange();



  // Sync period label chips

  ["activePeriodText","periodDisplayTitle","historyPeriodLabel"].forEach(id => {

    const el = document.getElementById(id);

    if (el) el.textContent = label;

  });



  if (tab === "custom") {

    container.innerHTML = `

      <div style="display:flex; flex-wrap:wrap; align-items:center; gap:12px; width:100%;">

        <div style="display:flex; align-items:center; gap:8px;">

          <label style="font-size:0.75rem; font-weight:700; color:var(--muted-text);">From</label>

          <input type="date" id="histCustomStart" value="${appState.historyCustomStart || ''}"

                 class="hist-modal-input" style="width:auto; padding:6px 10px;"

                 onchange="window.handleCustomDateChange()" />

        </div>

        <div style="display:flex; align-items:center; gap:8px;">

          <label style="font-size:0.75rem; font-weight:700; color:var(--muted-text);">To</label>

          <input type="date" id="histCustomEnd" value="${appState.historyCustomEnd || ''}"

                 class="hist-modal-input" style="width:auto; padding:6px 10px;"

                 onchange="window.handleCustomDateChange()" />

        </div>

        <button type="button" class="hist-modal-btn-primary" style="padding:6px 14px; font-size:0.75rem;"

                onclick="window.applyCustomDateRange()">Apply</button>

        <button type="button" class="hist-modal-btn-secondary" style="padding:6px 12px; font-size:0.75rem;"

                onclick="window.clearCustomDateRange()">Clear</button>

        <div style="font-size:0.85rem; font-weight:700; color:var(--text); background:var(--panel-raised); padding:6px 16px;

                    border-radius:12px; border:1px solid var(--line-strong); white-space:nowrap;"

             id="periodDisplayTitle">${label}</div>

      </div>`;

    return;

  }



  const labels = {

    weekly:  ["← Prev Week",  "This Week",   "Next Week →"],

    monthly: ["← Prev Month", "This Month",  "Next Month →"],

    yearly:  ["← Prev Year",  "This Year",   "Next Year →"]

  };

  const [prev, cur, next] = labels[tab] || labels.weekly;



  container.innerHTML = `

    <div style="display:flex; align-items:center; gap:8px;">

      <button type="button" class="secondary-button"

              style="padding:6px 12px; font-size:0.75rem; font-weight:600;"

              onclick="window.navigateHistoryPeriod(-1)">${prev}</button>

      <button type="button" class="secondary-button"

              style="padding:6px 12px; font-size:0.75rem; font-weight:700; background:var(--primary-soft); color:var(--primary);"

              onclick="window.navigateHistoryPeriod(0)">${cur}</button>

      <button type="button" class="secondary-button"

              style="padding:6px 12px; font-size:0.75rem; font-weight:600;"

              onclick="window.navigateHistoryPeriod(1)">${next}</button>

    </div>

    <div style="font-size:0.9rem; font-weight:700; color:var(--text); background:var(--panel-raised); padding:6px 16px;

                border-radius:12px; border:1px solid var(--line-strong); white-space:nowrap;"

         id="periodDisplayTitle">${label}</div>`;

}



// ============================================================

// FILTER TABLE

// ============================================================

function filterHistoryTable() {

  const tbody = document.getElementById("historyTableBody");

  if (!tbody) return;



  const searchQ    = (document.getElementById("historySearchInput")?.value || "").toLowerCase().trim();

  const dept       = document.getElementById("histDeptFilter")?.value       || "ALL";

  const workMode   = document.getElementById("histWorkModeFilter")?.value   || "ALL";

  const status     = document.getElementById("histStatusFilter")?.value     || "ALL";

  const correction = document.getElementById("histCorrectionFilter")?.value || "ALL";

  const periodData = getDatasetForPeriod();



  const filtered = periodData.filter(item => {

    if (searchQ) {

      if (!item.employeeName.toLowerCase().includes(searchQ) &&

          !item.employeeId.toLowerCase().includes(searchQ) &&

          !item.department.toLowerCase().includes(searchQ)) return false;

    }

    if (dept !== "ALL" && item.department !== dept) return false;

    if (workMode !== "ALL") {

      if (workMode === "NOT_SELECTED" && item.workMode !== null) return false;

      if (workMode !== "NOT_SELECTED" && item.workMode !== workMode) return false;

    }

    if (status !== "ALL") {

      if (status === "PRESENT") {

        if (!["COMPLETED","CLOCKED_IN","MANUALLY_CORRECTED"].includes(item.status)) return false;

      } else if (item.status !== status) return false;

    }

    if (correction !== "ALL" && item.correctionStatus !== correction) return false;

    const card = appState.historySummaryCardFilter;

    if (card && card !== "ALL") {

      if (card === "PRESENT"            && !["COMPLETED","CLOCKED_IN","MANUALLY_CORRECTED"].includes(item.status)) return false;

      if (card === "OFFICE"             && item.workMode !== "OFFICE") return false;

      if (card === "WFH"                && item.workMode !== "WFH") return false;

      if (card === "ON_LEAVE"           && item.status !== "ON_LEAVE") return false;

      if (card === "MISSING_CLOCK_OUT"  && item.status !== "MISSING_CLOCK_OUT") return false;

      if (card === "INCOMPLETE_HOURS"   && item.status !== "INCOMPLETE_HOURS") return false;

      if (card === "PENDING_CORRECTIONS"&& item.correctionStatus !== "PENDING_REVIEW") return false;

    }

    return true;

  });



  const countEl = document.getElementById("historyResultCount");

  if (countEl) countEl.innerHTML = `Showing <strong style="color:var(--primary);">${filtered.length}</strong> of ${periodData.length} attendance records`;



  if (filtered.length === 0) {

    tbody.innerHTML = `

      <tr><td colspan="13" style="padding:40px; text-align:center; color:var(--muted-text); font-size:0.85rem;">

        No attendance records match the current filters.

      </td></tr>`;

    return;

  }



  // ── Badge renderers ──────────────────────────────────────────

  const BADGE = (bg, color, border, text) =>

    `<span style="background:${bg}; color:${color}; border:1px solid ${border}; padding:3px 8px; border-radius:6px; font-size:0.7rem; font-weight:700; white-space:nowrap;">${text}</span>`;



  const renderBadge = st => ({

    COMPLETED:         BADGE("rgba(52,211,153,.15)",  "var(--success)", "rgba(52,211,153,.3)",  "Completed"),

    CLOCKED_IN:        BADGE("rgba(45,212,191,.15)",  "#2dd4bf", "rgba(45,212,191,.3)",  "Clocked In"),

    MISSING_CLOCK_IN:  BADGE("rgba(248,113,113,.15)", "var(--danger)", "rgba(248,113,113,.3)", "Missing Clock-In"),

    MISSING_CLOCK_OUT: BADGE("rgba(248,113,113,.15)", "var(--danger)", "rgba(248,113,113,.3)", "Missing Clock-Out"),

    INCOMPLETE_HOURS:  BADGE("rgba(251,191,36,.15)",  "var(--warning)", "rgba(251,191,36,.3)",  "Incomplete Hours"),

    NOT_CLOCKED_IN:    BADGE("var(--panel-soft)",     "var(--muted-text)", "var(--line-strong)", "Not Clocked In"),

    ON_LEAVE:          BADGE("rgba(251,191,36,.15)",  "var(--warning)", "rgba(251,191,36,.3)",  "On Leave"),

    WEEK_OFF:          BADGE("rgba(192,132,252,.15)", "#c084fc", "rgba(192,132,252,.3)", "Week Off"),

    HOLIDAY:           BADGE("rgba(34,211,238,.15)",  "#22d3ee", "rgba(34,211,238,.3)",  "Holiday"),

    MANUALLY_CORRECTED:BADGE("rgba(96,165,250,.15)",  "#60a5fa", "rgba(96,165,250,.3)",  "Manually Corrected")

  }[st] || BADGE("var(--panel-soft)","var(--muted-text)","var(--line-strong)","Not Clocked In"));



  const renderWorkMode = wm => {

    if (wm === "OFFICE") return BADGE("var(--primary-soft)","var(--primary)","var(--line-strong)",`Office`);

    if (wm === "WFH")    return BADGE("rgba(34,211,238,.15)","#22d3ee","rgba(34,211,238,.3)",`WFH`);

    return `<span style="color:var(--muted-text); font-size:0.75rem;">—</span>`;

  };



  // Plain text verification badges without icons

  const renderVerif = (v, wm) => {

    if (wm === "WFH")                return `<span style="color:var(--muted-text); font-size:0.75rem;">Not Required</span>`;

    if (v === "IP_VERIFIED")         return `<span style="color:var(--success); font-size:0.75rem; font-weight:600;">IP Verified</span>`;

    if (v === "IP_AND_GPS_VERIFIED") return `<span style="color:var(--success); font-size:0.75rem; font-weight:700;">IP + GPS Verified</span>`;

    if (v === "NOT_VERIFIED")        return `<span style="color:var(--danger); font-size:0.75rem; font-weight:600;">Not Verified</span>`;

    return `<span style="color:var(--muted-text); font-size:0.75rem;">—</span>`;

  };



  // Plain text correction badges without icons (Pending is interactive button)

  const renderCorrBadge = c => {

    if (!c || c === "NO_REQUEST")   return `<span style="color:var(--muted-text); font-size:0.75rem;">—</span>`;

    if (c === "APPROVED")           return `<span style="color:var(--success); font-weight:700; font-size:0.75rem;">Approved</span>`;

    if (c === "PENDING_REVIEW")     return `<button type="button" style="color:var(--warning); font-weight:700; font-size:0.75rem; cursor:pointer; background:none; border:none; padding:0; text-decoration:underline; text-decoration-style:dotted;" onclick="event.stopPropagation(); window.openHistoryCorrectionModal()">Pending</button>`;

    if (c === "MORE_INFO_REQUIRED") return `<span style="color:#c084fc; font-weight:700; font-size:0.75rem;">More Info</span>`;

    if (c === "REJECTED")           return `<span style="color:var(--danger); font-weight:700; font-size:0.75rem;">Rejected</span>`;

    return `<span style="color:var(--muted-text); font-size:0.75rem;">${c}</span>`;

  };



  tbody.innerHTML = filtered.map(item => `

    <tr>

      <td style="padding:10px 12px; white-space:nowrap;">

        <div style="display:flex; align-items:center; gap:8px;">

          <div style="width:28px;height:28px;border-radius:50%;background:var(--primary-soft);color:var(--primary);font-weight:800;display:flex;align-items:center;justify-content:center;font-size:0.75rem;flex-shrink:0;">${item.employeeName.charAt(0)}</div>

          <span style="font-size:0.8rem; font-weight:700; color:var(--text);">${item.employeeName}</span>

        </div>

      </td>

      <td style="padding:10px 12px; font-family:monospace; color:var(--muted-text); font-size:0.75rem; white-space:nowrap;">${item.employeeId}</td>

      <td style="padding:10px 12px; color:var(--text); font-size:0.78rem;">${item.department}</td>

      <td style="padding:10px 12px; color:var(--text); font-weight:600; font-size:0.78rem; white-space:nowrap;">${item.date}</td>

      <td style="padding:10px 12px;">${renderWorkMode(item.workMode)}</td>

      <td style="padding:10px 12px; font-family:monospace; color:var(--success); font-size:0.78rem; white-space:nowrap;">${item.clockIn}</td>

      <td style="padding:10px 12px; font-family:monospace; color:var(--warning); font-size:0.78rem; white-space:nowrap;">${item.clockOut}</td>

      <td style="padding:10px 12px; font-family:monospace; font-weight:800; color:var(--primary); font-size:0.8rem; white-space:nowrap;">${item.workingHours}</td>

      <td style="padding:10px 12px;">${renderBadge(item.status)}</td>

      <td style="padding:10px 12px;">${renderVerif(item.verification, item.workMode)}</td>

      <td style="padding:10px 12px;">${renderCorrBadge(item.correctionStatus)}</td>

      <td style="padding:10px 12px; color:var(--muted-text); font-size:0.7rem; white-space:nowrap;">${item.lastModified}</td>

      <td style="padding:10px 12px; text-align:right; white-space:nowrap;">

        <div style="display:inline-flex; gap:6px; align-items:center; justify-content:flex-end;">

          <button type="button" class="secondary-button"

                  style="padding:4px 10px; font-size:0.72rem; font-weight:600;"

                  onclick="window.openHistoryDetailDrawer('${item.id}')">View</button>

          ${canAdministerEmployee(item) ? `<button type="button" class="secondary-button hist-edit-toggle"

                  style="padding:4px 10px; font-size:0.72rem; font-weight:700; background:var(--primary-soft); color:var(--primary); border:1px solid var(--line-strong);"

                  onclick="event.stopPropagation(); window.toggleHistoryEditDropdown(this, '${item.id}')"

                  data-record-id="${item.id}">Edit ▾</button>` : ""}

        </div>

      </td>

    </tr>`).join("");

}



// ============================================================

// DROPDOWN TOGGLE & CLOSE ON OUTSIDE CLICK / SCROLL

// ============================================================

function hideGlobalDropdown() {

  const globalDd = document.getElementById("globalAppDropdown");

  if (globalDd) {

    globalDd.style.display = "none";

    globalDd.dataset.activeBtnId = "";

  }

}



function toggleSmartDropdown(btn, contentHtml, width = 220) {

  let globalDd = document.getElementById("globalAppDropdown");

  if (!globalDd) {

    globalDd = document.createElement("div");

    globalDd.id = "globalAppDropdown";

    document.body.appendChild(globalDd);

  }



  const btnId = btn.dataset.recordId || btn.id || (btn.getAttribute("onclick") || Math.random().toString());

  const wasOpen = globalDd.style.display === "block" && globalDd.dataset.activeBtnId === btnId;



  if (wasOpen) {

    hideGlobalDropdown();

    return;

  }



  globalDd.dataset.activeBtnId = btnId;

  globalDd.innerHTML = contentHtml;

  globalDd.className = "today-edit-dropdown hist-edit-dropdown global-app-dropdown";

  

  globalDd.style.display = "block";

  globalDd.style.visibility = "hidden";



  const rect = btn.getBoundingClientRect();

  const dropdownHeight = globalDd.offsetHeight || 190;

  const dropdownWidth = globalDd.offsetWidth || width;

  const viewportHeight = window.innerHeight;

  const viewportWidth = window.innerWidth;



  let top = rect.bottom + 4;



  if (top + dropdownHeight > viewportHeight - 10) {

    const topAbove = rect.top - dropdownHeight - 4;

    if (topAbove >= 10) {

      top = topAbove;

    } else {

      top = Math.max(10, viewportHeight - dropdownHeight - 10);

    }

  }



  let left = rect.right - dropdownWidth;

  if (left < 10) left = 10;

  if (left + dropdownWidth > viewportWidth - 10) {

    left = viewportWidth - dropdownWidth - 10;

  }



  globalDd.style.top = `${top}px`;

  globalDd.style.left = `${left}px`;

  globalDd.style.visibility = "visible";

}



function toggleHistoryEditDropdown(btn, recId) {

  const targetId = recId || btn.dataset.recordId;

  const item = mockHistoryDataset.find(r => r.id === targetId);

  if (!item) return;



  const html = `

    <button type="button" class="hist-dd-item" onclick="window.hideGlobalDropdown(); window.openHistoryEditModal('${item.id}','EDIT_TIMES')">${HIST_ICONS.pencil} Edit attendance</button>

    <button type="button" class="hist-dd-item" onclick="window.hideGlobalDropdown(); window.openHistoryEditModal('${item.id}','ADD_CLOCK_OUT')">${HIST_ICONS.clock} Add missing clock-out</button>

    <button type="button" class="hist-dd-item" onclick="window.hideGlobalDropdown(); window.openHistoryEditModal('${item.id}','CHANGE_WORK_MODE')">${HIST_ICONS.refreshCw} Change work mode</button>

    <button type="button" class="hist-dd-item" onclick="window.hideGlobalDropdown(); window.openHistoryEditModal('${item.id}','MARK_LEAVE')">${HIST_ICONS.calendarOff} Mark as leave</button>

    <div style="border-top:1px solid var(--line); margin:4px 0;"></div>

    <button type="button" class="hist-dd-item" style="color:var(--muted-text);" onclick="window.hideGlobalDropdown(); window.openHistoryAuditDrawer('${item.id}')">${HIST_ICONS.history} View audit history</button>

  `;



  toggleSmartDropdown(btn, html, 210);

}



function toggleTodayEditDropdown(btn, empId) {
  if (!requireEmployeeAdministration(empId)) return;

  const item = employees.find(e => e.id === empId);

  if (!item) return;



  const html = `

    <button type="button" class="hist-dd-item" onclick="window.hideGlobalDropdown(); window.openTodayEditAttendanceModal('${item.id}','EDIT_TIMES')">${HIST_ICONS.pencil} Edit attendance</button>

    <button type="button" class="hist-dd-item" onclick="window.hideGlobalDropdown(); window.openTodayEditAttendanceModal('${item.id}','ADD_CLOCK_OUT')">${HIST_ICONS.clock} Add missing clock-out</button>

    <button type="button" class="hist-dd-item" onclick="window.hideGlobalDropdown(); window.openTodayEditAttendanceModal('${item.id}','CHANGE_WORK_MODE')">${HIST_ICONS.refreshCw} Change work mode</button>

    <button type="button" class="hist-dd-item" onclick="window.hideGlobalDropdown(); window.openTodayEditAttendanceModal('${item.id}','MARK_LEAVE')">${HIST_ICONS.calendarOff} Mark as leave</button>

    <div style="border-top:1px solid var(--line); margin:4px 0;"></div>

    <button type="button" class="hist-dd-item" style="color:var(--muted-text);" onclick="window.hideGlobalDropdown(); window.openTodayAuditHistoryDrawer('${item.id}')">${HIST_ICONS.history} View audit history</button>

  `;



  toggleSmartDropdown(btn, html, 220);

}



function setupHistoryDropdownClose() {

  if (window._histDropdownSetup) return;

  window._histDropdownSetup = true;

  document.addEventListener("click", e => {

    if (!e.target.closest(".hist-edit-toggle") && !e.target.closest(".today-edit-toggle") && !e.target.closest("#globalAppDropdown")) {

      hideGlobalDropdown();

    }

  });

  window.addEventListener("scroll", () => {

    hideGlobalDropdown();

  }, true);

}



// ============================================================

// DEBOUNCE SEARCH

// ============================================================

let historySearchTimer = null;

function debounceHistorySearch() {

  clearTimeout(historySearchTimer);

  historySearchTimer = setTimeout(() => filterHistoryTable(), 400);

}



// ============================================================

// TAB SWITCHING

// ============================================================

function switchHistoryTab(tab) {

  appState.historyTab = tab;

  appState.historyPeriodOffset = 0;

  document.querySelectorAll(".range-tab-btn").forEach(btn => {

    const act = btn.id === `tab-${tab}`;

    btn.style.background = act ? "var(--primary)" : "transparent";

    btn.style.color      = act ? "#ffffff" : "var(--muted-text)";

  });

  updateNavControls();

  updateSummaryCards();

  filterHistoryTable();

}



// ============================================================

// PERIOD NAVIGATION

// ============================================================

function navigateHistoryPeriod(dir) {

  appState.historyPeriodOffset = dir === 0 ? 0 : appState.historyPeriodOffset + dir;

  updateNavControls();

  updateSummaryCards();

  filterHistoryTable();

}



// ============================================================

// CUSTOM DATE RANGE

// ============================================================

function handleCustomDateChange() {

  appState.historyCustomStart = document.getElementById("histCustomStart")?.value || null;

  appState.historyCustomEnd   = document.getElementById("histCustomEnd")?.value   || null;

}

function applyCustomDateRange() {

  handleCustomDateChange();

  updateNavControls();

  updateSummaryCards();

  filterHistoryTable();

}

function clearCustomDateRange() {

  appState.historyCustomStart = null;

  appState.historyCustomEnd   = null;

  updateNavControls();

  updateSummaryCards();

  filterHistoryTable();

}



// ============================================================

// CARD FILTER

// ============================================================

function filterHistoryCard(key) {

  appState.historySummaryCardFilter = appState.historySummaryCardFilter === key ? null : key;

  updateSummaryCards();

  filterHistoryTable();

}

function clearHistoryCardFilter() {

  appState.historySummaryCardFilter = null;

  updateSummaryCards();

  filterHistoryTable();

}



// ============================================================

// RESET ALL FILTERS

// ============================================================

function resetHistoryFilters() {

  const ids = ["historySearchInput","histDeptFilter","histWorkModeFilter","histStatusFilter","histCorrectionFilter"];

  ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = id === "historySearchInput" ? "" : "ALL"; });

  appState.historySummaryCardFilter = null;

  appState.historyPeriodOffset = 0;

  appState.historyCustomStart  = null;

  appState.historyCustomEnd    = null;

  switchHistoryTab("weekly");

}



// ============================================================

// REAL CSV EXPORT

// ============================================================

function exportHistoryReportCSV() {

  const ds = getDatasetForPeriod();

  const headers = ["Employee Name","Employee ID","Department","Date","Work Mode","Clock In","Clock Out","Working Hours","Status","Verification","Correction Status","Last Modified"];

  const rows = ds.map(r => [

    `"${r.employeeName}"`, r.employeeId, r.department, HRDomain.date(histParseDate(r.date)),

    r.workMode || "N/A", r.clockIn, r.clockOut, r.workingHours,

    r.status, r.verification || "N/A", r.correctionStatus, `"${r.lastModified}"`

  ].join(","));

  const csv  = [headers.join(","), ...rows].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

  const url  = URL.createObjectURL(blob);

  const a    = document.createElement("a");

  const { label } = getHistoryDateRange();

  a.href = url;

  a.download = `Attendance_History_${label.replace(/[^a-zA-Z0-9]/g, "_")}.csv`;

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);

  URL.revokeObjectURL(url);

  showToast("Attendance report CSV downloaded successfully.");

}



// ============================================================

// HELPERS

// ============================================================

function histRemovePanel(id) { document.getElementById(id)?.remove(); }



function histDetailRow(label, value) {

  return `<div style="display:flex; align-items:center; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--line);">

    <span style="font-size:0.75rem; color:var(--muted-text); font-weight:600;">${label}</span>

    <span style="font-size:0.8rem; color:var(--text); font-weight:600; text-align:right;">${value}</span>

  </div>`;

}



function histTodayLabel() {

  return new Date().toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });

}



const STATUS_LABELS = {

  COMPLETED:"Completed", CLOCKED_IN:"Clocked In", MISSING_CLOCK_IN:"Missing Clock-In",

  MISSING_CLOCK_OUT:"Missing Clock-Out", INCOMPLETE_HOURS:"Incomplete Hours",

  NOT_CLOCKED_IN:"Not Clocked In", ON_LEAVE:"On Leave", WEEK_OFF:"Week Off",

  HOLIDAY:"Holiday", MANUALLY_CORRECTED:"Manually Corrected"

};



// ============================================================

// VIEW DETAIL DRAWER

// ============================================================

function openHistoryDetailDrawer(recordId) {

  const item = mockHistoryDataset.find(r => r.id === recordId);

  if (!item) return;

  histRemovePanel("histDetailDrawer");



  const drawer = document.createElement("div");

  drawer.id = "histDetailDrawer";

  drawer.className = "hist-drawer-bg";

  drawer.style.animation = "histSlideIn 0.25s ease";

  drawer.innerHTML = `

    <div style="padding:24px; border-bottom:1px solid var(--line); display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; background:var(--panel-raised); z-index:2;">

      <div>

        <p style="font-size:0.65rem; font-weight:800; text-transform:uppercase; color:var(--primary); margin:0;">ATTENDANCE RECORD</p>

        <h3 style="margin:4px 0 0; color:var(--text); font-size:1.1rem; font-weight:800;">${item.employeeName}</h3>

      </div>

      <button onclick="document.getElementById('histDetailDrawer').remove()"

              style="background:none;border:none;color:var(--muted-text);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:4px;">${HIST_ICONS.close}</button>

    </div>

    <div style="padding:20px; display:flex; flex-direction:column; gap:14px;">



      <div style="background:var(--panel-soft); border:1px solid var(--line-strong); border-radius:12px; padding:16px;">

        <p style="font-size:0.63rem; font-weight:800; text-transform:uppercase; color:var(--muted-text); margin:0 0 10px;">EMPLOYEE INFO</p>

        ${histDetailRow("Employee ID", item.employeeId)}

        ${histDetailRow("Department",  item.department)}

      </div>



      <div style="background:var(--panel-soft); border:1px solid var(--line-strong); border-radius:12px; padding:16px;">

        <p style="font-size:0.63rem; font-weight:800; text-transform:uppercase; color:var(--muted-text); margin:0 0 10px;">ATTENDANCE DETAILS</p>

        ${histDetailRow("Date",          item.date)}

        ${histDetailRow("Work Mode",     item.workMode || "Not set")}

        ${histDetailRow("Clock In",      `<span style="color:var(--success); font-family:monospace;">${item.clockIn}</span>`)}

        ${histDetailRow("Clock Out",     `<span style="color:var(--warning); font-family:monospace;">${item.clockOut}</span>`)}

        ${histDetailRow("Working Hours", `<span style="color:var(--primary); font-weight:800; font-family:monospace;">${item.workingHours}</span>`)}

        ${histDetailRow("Status",        STATUS_LABELS[item.status] || item.status)}

      </div>



      <div style="background:var(--panel-soft); border:1px solid var(--line-strong); border-radius:12px; padding:16px;">

        <p style="font-size:0.63rem; font-weight:800; text-transform:uppercase; color:var(--muted-text); margin:0 0 10px;">VERIFICATION & CORRECTION</p>

        ${histDetailRow("Verification",      item.verification || "—")}

        ${histDetailRow("Correction Status", item.correctionStatus)}

        ${histDetailRow("Last Modified",     item.lastModified)}

      </div>



      <div style="background:var(--panel-soft); border:1px solid var(--line-strong); border-radius:12px; padding:16px;">

        <p style="font-size:0.63rem; font-weight:800; text-transform:uppercase; color:var(--muted-text); margin:0 0 10px;">AUDIT TRAIL</p>

        <div style="display:flex; flex-direction:column; gap:10px;">

          <div style="display:flex; gap:10px; align-items:flex-start;">

            <div style="width:8px;height:8px;border-radius:50%;background:var(--primary);margin-top:5px;flex-shrink:0;"></div>

            <span style="font-size:0.75rem; color:var(--text);"><strong>${item.employeeName}</strong> clocked in at <strong>${item.clockIn}</strong> on ${item.date}</span>

          </div>

          ${item.clockOut !== "—" ? `<div style="display:flex;gap:10px;align-items:flex-start;"><div style="width:8px;height:8px;border-radius:50%;background:var(--success);margin-top:5px;flex-shrink:0;"></div><span style="font-size:0.75rem;color:var(--text);"><strong>${item.employeeName}</strong> clocked out at <strong>${item.clockOut}</strong> · Hours: <strong style="color:var(--primary);">${item.workingHours}</strong></span></div>` : ""}

          ${item.lastModified !== "—" ? `<div style="display:flex;gap:10px;align-items:flex-start;"><div style="width:8px;height:8px;border-radius:50%;background:var(--warning);margin-top:5px;flex-shrink:0;"></div><span style="font-size:0.75rem;color:var(--text);">Record modified by <strong>${item.lastModified}</strong></span></div>` : ""}

        </div>

      </div>



      <div style="display:flex; gap:8px;">

        ${canAdministerEmployee(item) ? `<button type="button" class="hist-modal-btn-primary" style="flex:1; display:inline-flex; align-items:center; justify-content:center;"

                onclick="window.openHistoryEditModal('${item.id}','EDIT_TIMES')">${HIST_ICONS.pencil} Edit Attendance</button>` : ""}

        <button type="button" class="hist-modal-btn-secondary"

                onclick="document.getElementById('histDetailDrawer').remove()">Close</button>

      </div>

    </div>`;

  document.body.appendChild(drawer);

}



// ============================================================

// AUDIT HISTORY DRAWER

// ============================================================

function openHistoryAuditDrawer(recordId) {

  document.querySelectorAll(".hist-edit-dropdown").forEach(d => (d.style.display = "none"));

  const item = mockHistoryDataset.find(r => r.id === recordId);

  if (!item) return;

  histRemovePanel("histAuditDrawer");



  const log = [

    { action:"Record Created",     by:"System",           at:`${item.date}, 12:00 AM`, note:"Initial attendance record created by the system." },

    { action:"Clock In Recorded",  by:item.employeeName,  at:`${item.date}, ${item.clockIn  !== "—" ? item.clockIn  : "N/A"}`, note:item.clockIn  !== "—" ? `Clocked in at ${item.clockIn}.` : "No clock-in recorded." },

    ...(item.clockOut !== "—" ? [{ action:"Clock Out Recorded", by:item.employeeName, at:`${item.date}, ${item.clockOut}`, note:`Clocked out at ${item.clockOut}. Total: ${item.workingHours}.` }] : []),

    ...(item.lastModified !== "—" ? [{ action:"Record Modified", by:item.lastModified.split(" · ")[0], at:item.lastModified.split(" · ")[1] || item.lastModified, note:`Attendance manually corrected. Status: ${item.correctionStatus}.` }] : [])

  ];



  const dotColors = ["var(--primary)","#22d3ee","var(--success)","var(--warning)"];



  const drawer = document.createElement("div");

  drawer.id = "histAuditDrawer";

  drawer.className = "hist-drawer-bg";

  drawer.style.zIndex = "10001";

  drawer.style.animation = "histSlideIn 0.25s ease";

  drawer.innerHTML = `

    <div style="padding:24px; border-bottom:1px solid var(--line); display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; background:var(--panel-raised); z-index:2;">

      <div>

        <p style="font-size:0.65rem; font-weight:800; text-transform:uppercase; color:var(--primary); margin:0;">AUDIT HISTORY</p>

        <h3 style="margin:4px 0 0; color:var(--text); font-size:1.05rem;">${item.employeeName} · ${item.date}</h3>

      </div>

      <button onclick="document.getElementById('histAuditDrawer').remove()"

              style="background:none;border:none;color:var(--muted-text);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:4px;">${HIST_ICONS.close}</button>

    </div>

    <div style="padding:24px;">

      <div style="position:relative; padding-left:20px; border-left:2px solid var(--line-strong); display:flex; flex-direction:column; gap:18px;">

        ${log.map((entry, i) => `

          <div style="position:relative;">

            <div style="position:absolute; left:-25px; top:5px; width:10px; height:10px; border-radius:50%; background:${dotColors[i]||"var(--line-strong)"}; border:2px solid var(--panel-raised);"></div>

            <div style="background:var(--panel-soft); border:1px solid var(--line-strong); border-radius:10px; padding:12px;">

              <div style="font-weight:700; color:var(--text); font-size:0.82rem;">${entry.action}</div>

              <div style="color:var(--muted-text); font-size:0.7rem; margin-top:2px;">by <span style="color:var(--text);">${entry.by}</span> · <span style="color:var(--text);">${entry.at}</span></div>

              <p style="color:var(--muted-text); font-size:0.75rem; margin:8px 0 0;">${entry.note}</p>

            </div>

          </div>`).join("")}

      </div>

    </div>`;

  document.body.appendChild(drawer);

}



// ============================================================

// EDIT MODAL (4 action types)

// ============================================================

function openHistoryEditModal(recordId, actionType) {

  document.querySelectorAll(".hist-edit-dropdown").forEach(d => (d.style.display = "none"));

  const item = mockHistoryDataset.find(r => r.id === recordId);

  if (!item) return;

  histRemovePanel("histEditModal");



  const TITLES = {

    EDIT_TIMES:       "Edit Attendance",

    ADD_CLOCK_OUT:    "Add Missing Clock-Out",

    CHANGE_WORK_MODE: "Change Work Mode",

    MARK_LEAVE:       "Mark as Leave"

  };



  let formHtml = "";

  if (actionType === "EDIT_TIMES") {

    formHtml = `

      <label style="font-size:0.75rem;font-weight:700;color:var(--muted-text);display:block;margin-bottom:4px;">Clock In Time</label>

      <input id="editClockIn" type="text" class="hist-modal-input" placeholder="e.g. 09:00 AM" value="${item.clockIn !== "—" ? item.clockIn : ""}" style="margin-bottom:12px;" />

      <label style="font-size:0.75rem;font-weight:700;color:var(--muted-text);display:block;margin-bottom:4px;">Clock Out Time</label>

      <input id="editClockOut" type="text" class="hist-modal-input" placeholder="e.g. 06:00 PM" value="${item.clockOut !== "—" ? item.clockOut : ""}" />`;

  } else if (actionType === "ADD_CLOCK_OUT") {

    formHtml = `

      <label style="font-size:0.75rem;font-weight:700;color:var(--muted-text);display:block;margin-bottom:4px;">Clock Out Time</label>

      <input id="editClockOut" type="text" class="hist-modal-input" placeholder="e.g. 06:00 PM" />`;

  } else if (actionType === "CHANGE_WORK_MODE") {

    formHtml = `

      <label style="font-size:0.75rem;font-weight:700;color:var(--muted-text);display:block;margin-bottom:8px;">Work Mode</label>

      <div style="display:flex;gap:10px;">

        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:12px 16px;border-radius:10px;border:1px solid ${item.workMode==="OFFICE"?"var(--primary)":"var(--line-strong)"};background:${item.workMode==="OFFICE"?"var(--primary-soft)":"transparent"};flex:1;">

          <input type="radio" name="editWorkMode" value="OFFICE" ${item.workMode==="OFFICE"?"checked":""} style="accent-color:var(--primary);">

          <span style="color:var(--text);font-weight:700;display:flex;align-items:center;">${HIST_ICONS.building} Office</span>

        </label>

        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:12px 16px;border-radius:10px;border:1px solid ${item.workMode==="WFH"?"#22d3ee":"var(--line-strong)"};background:${item.workMode==="WFH"?"rgba(34,211,238,.1)":"transparent"};flex:1;">

          <input type="radio" name="editWorkMode" value="WFH" ${item.workMode==="WFH"?"checked":""} style="accent-color:#22d3ee;">

          <span style="color:var(--text);font-weight:700;display:flex;align-items:center;">${HIST_ICONS.home} WFH</span>

        </label>

      </div>`;

  } else if (actionType === "MARK_LEAVE") {

    formHtml = `

      <label style="font-size:0.75rem;font-weight:700;color:var(--muted-text);display:block;margin-bottom:4px;">Leave Type</label>

      <select id="editLeaveType" class="hist-modal-input">

        <option value="CASUAL">Casual Leave</option>

        <option value="SICK">Sick Leave</option>

        <option value="PRIVILEGE">Privilege Leave</option>

        <option value="LWP">Leave Without Pay (LWP)</option>

      </select>`;

  }



  const modal = document.createElement("div");

  modal.id = "histEditModal";

  modal.className = "hist-modal-bg";

  modal.innerHTML = `

    <div style="background:var(--panel-raised); border:1px solid var(--panel-border); border-radius:20px; width:100%; max-width:490px;

                box-shadow:var(--shadow-lg); animation:histFadeIn 0.2s ease; color:var(--text);">

      <div style="padding:20px 24px; border-bottom:1px solid var(--line); display:flex; align-items:center; justify-content:space-between;">

        <div>

          <p style="font-size:0.63rem;font-weight:800;text-transform:uppercase;color:var(--primary);margin:0;">MANUAL CORRECTION</p>

          <h3 style="margin:4px 0 0;color:var(--text);font-size:1.05rem;font-weight:800;">${TITLES[actionType]}</h3>

        </div>

        <button onclick="document.getElementById('histEditModal').remove()"

                style="background:none;border:none;color:var(--muted-text);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:4px;">${HIST_ICONS.close}</button>

      </div>

      <div style="padding:20px 24px;">

        <div style="background:var(--panel-soft);border:1px solid var(--line-strong);border-radius:10px;padding:12px;margin-bottom:16px;font-size:0.78rem;color:var(--muted-text);">

          <strong style="color:var(--text);">${item.employeeName}</strong> (${item.employeeId}) · ${item.date}

        </div>

        <div style="margin-bottom:16px;">${formHtml}</div>

        <label style="font-size:0.75rem;font-weight:700;color:var(--muted-text);display:block;margin-bottom:4px;">

          Reason for Correction <span style="color:var(--danger);">*</span>

          <span style="color:var(--muted-text);font-weight:400;">(5–500 chars)</span>

        </label>

        <textarea id="editCorrectionReason" class="hist-modal-input" rows="3"

                  placeholder="Explain the reason for this correction..."

                  style="resize:vertical;"

                  oninput="window.validateCorrectionReason()"></textarea>

        <p id="editReasonError" style="color:var(--danger);font-size:0.72rem;margin:4px 0 0;display:none;">

          Reason must be at least 5 characters.

        </p>

        <div style="display:flex;gap:10px;margin-top:16px;">

          <button type="button" class="hist-modal-btn-primary" style="flex:1;"

                  onclick="window.submitHistoryCorrection('${recordId}','${actionType}')">Save Correction</button>

          <button type="button" class="hist-modal-btn-secondary"

                  onclick="document.getElementById('histEditModal').remove()">Cancel</button>

        </div>

      </div>

    </div>`;

  document.body.appendChild(modal);

  modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });

}



function validateCorrectionReason() {

  const val = document.getElementById("editCorrectionReason")?.value || "";

  const err = document.getElementById("editReasonError");

  if (err) err.style.display = val.length > 0 && val.length < 5 ? "block" : "none";

}



function submitHistoryCorrection(recordId, actionType) {
  if (!requireEmployeeAdministration(mockHistoryDataset.find(r => r.id === recordId))) return;

  const reason = document.getElementById("editCorrectionReason")?.value || "";

  if (reason.trim().length < 5) {

    const err = document.getElementById("editReasonError");

    if (err) err.style.display = "block";

    showToast("Please enter a reason (at least 5 characters).");

    return;

  }

  const item = mockHistoryDataset.find(r => r.id === recordId);

  if (!item) return;



  item.lastModified    = `Super Admin · ${histTodayLabel()}`;

  item.correctionStatus = "APPROVED";



  if (actionType === "EDIT_TIMES") {

    const ci = document.getElementById("editClockIn")?.value.trim();

    const co = document.getElementById("editClockOut")?.value.trim();

    if (ci) item.clockIn  = ci;

    if (co) item.clockOut = co;

    if (ci && co) item.status = "MANUALLY_CORRECTED";

  } else if (actionType === "ADD_CLOCK_OUT") {

    const co = document.getElementById("editClockOut")?.value.trim();

    if (co) { item.clockOut = co; item.status = "MANUALLY_CORRECTED"; }

  } else if (actionType === "CHANGE_WORK_MODE") {

    const wm = document.querySelector('[name="editWorkMode"]:checked')?.value;

    if (wm) { item.workMode = wm; item.status = "MANUALLY_CORRECTED"; }

  } else if (actionType === "MARK_LEAVE") {

    const lt = document.getElementById("editLeaveType")?.value;

    item.status       = "ON_LEAVE";

    item.workMode     = null;

    item.clockIn      = "—";

    item.clockOut     = "—";

    item.workingHours = "00h 00m";

  }



  histRemovePanel("histEditModal");

  histRemovePanel("histDetailDrawer");

  updateSummaryCards();

  filterHistoryTable();

  showToast("Attendance corrected and saved.");

}



// ============================================================

// CORRECTION REQUESTS PANEL

// ============================================================

function openHistoryCorrectionModal() {

  histRemovePanel("histCorrectionModal");

  const pending = mockHistoryDataset.filter(r => ["PENDING_REVIEW","MORE_INFO_REQUIRED"].includes(r.correctionStatus));



  const modal = document.createElement("div");

  modal.id = "histCorrectionModal";

  modal.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:10001;display:flex;align-items:flex-start;justify-content:flex-end;`;

  modal.innerHTML = `

    <div style="background:var(--panel-raised); border-left:1px solid var(--panel-border); color:var(--text); width:540px; max-width:95vw; height:100%;

                overflow-y:auto; box-shadow:var(--panel-shadow); animation:histSlideIn 0.25s ease;">

      <div style="padding:24px; border-bottom:1px solid var(--line); display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; background:var(--panel-raised); z-index:2;">

        <div>

          <p style="font-size:0.63rem;font-weight:800;text-transform:uppercase;color:var(--warning);margin:0;">CORRECTION REQUESTS</p>

          <h3 style="margin:4px 0 0;color:var(--text);font-size:1.1rem;font-weight:800;">Pending Review</h3>

        </div>

        <div style="display:flex;align-items:center;gap:10px;">

          <span style="background:var(--warning-soft);color:var(--warning);border:1px solid var(--warning);padding:3px 10px;border-radius:20px;font-size:0.78rem;font-weight:700;">${pending.length} Pending</span>

          <button onclick="document.getElementById('histCorrectionModal').remove()"

                  style="background:none;border:none;color:var(--muted-text);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:4px;">${HIST_ICONS.close}</button>

        </div>

      </div>

      <div style="padding:16px;display:flex;flex-direction:column;gap:12px;">

        ${pending.length === 0 ? `

          <div style="text-align:center;padding:60px 20px;color:var(--muted-text);">

            <div style="color:var(--success);margin-bottom:12px;display:flex;justify-content:center;">

              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>

            </div>

            <p style="font-size:0.9rem;font-weight:600;color:var(--text);">No pending correction requests</p>

            <p style="font-size:0.8rem;margin-top:4px;">All records are up to date.</p>

          </div>` :

          pending.map(item => {

            const isPending = item.correctionStatus === "PENDING_REVIEW";

            const accentColor  = isPending ? "var(--warning)" : "#c084fc";

            const accentBg     = isPending ? "var(--warning-soft)" : "rgba(192,132,252,.1)";

            const accentBorder = isPending ? "var(--warning)" : "rgba(192,132,252,.3)";

            const statusLabel  = isPending ? "Pending Review" : "More Info Req";

            return `

            <div style="background:var(--panel-soft); border:1px solid ${accentBorder}; border-radius:14px; padding:16px;">

              <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px;">

                <div>

                  <div style="font-weight:800;color:var(--text);font-size:0.9rem;">${item.employeeName}</div>

                  <div style="color:var(--muted-text);font-size:0.73rem;margin-top:2px;">${item.employeeId} · ${item.department} · ${item.date}</div>

                </div>

                <span style="background:${accentBg};color:${accentColor};border:1px solid ${accentBorder};padding:3px 8px;border-radius:6px;font-size:0.7rem;font-weight:700;white-space:nowrap;">${statusLabel}</span>

              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;font-size:0.75rem;">

                <div><span style="color:var(--muted-text);">Clock In:</span> <span style="color:var(--success);font-family:monospace;">${item.clockIn}</span></div>

                <div><span style="color:var(--muted-text);">Clock Out:</span> <span style="color:var(--warning);font-family:monospace;">${item.clockOut}</span></div>

                <div><span style="color:var(--muted-text);">Hours:</span> <span style="color:var(--primary);font-weight:700;">${item.workingHours}</span></div>

                <div><span style="color:var(--muted-text);">Status:</span> <span style="color:var(--text);">${STATUS_LABELS[item.status]||item.status}</span></div>

              </div>

              <div style="display:flex;gap:8px;flex-wrap:wrap;">

                <button type="button" style="padding:7px 14px;border-radius:8px;background:rgba(52,211,153,.15);color:var(--success);border:1px solid rgba(52,211,153,.3);font-size:0.75rem;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;"

                        onclick="window.reviewCorrectionRequest('${item.id}','APPROVED')">${HIST_ICONS.checkCircle} Approve</button>

                <button type="button" style="padding:7px 14px;border-radius:8px;background:rgba(248,113,113,.15);color:var(--danger);border:1px solid rgba(248,113,113,.3);font-size:0.75rem;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;"

                        onclick="window.reviewCorrectionRequest('${item.id}','REJECTED')">${HIST_ICONS.xCircle} Reject</button>

                <button type="button" style="padding:7px 14px;border-radius:8px;background:rgba(192,132,252,.15);color:#c084fc;border:1px solid rgba(192,132,252,.3);font-size:0.75rem;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;"

                        onclick="window.reviewCorrectionRequest('${item.id}','MORE_INFO_REQUIRED')">${HIST_ICONS.info} Request Info</button>

                <button type="button" style="padding:7px 14px;border-radius:8px;background:transparent;color:var(--muted-text);border:1px solid var(--line-strong);font-size:0.75rem;font-weight:600;cursor:pointer;"

                        onclick="window.openHistoryDetailDrawer('${item.id}')">View Details</button>

              </div>

            </div>`;

          }).join("")}

      </div>

    </div>`;

  document.body.appendChild(modal);

  modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });

}



function reviewCorrectionRequest(recordId, decision) {

  const item = mockHistoryDataset.find(r => r.id === recordId);

  if (!item) return;

  item.correctionStatus = decision;

  item.lastModified     = `Super Admin · ${histTodayLabel()}`;

  if (decision === "APPROVED") item.status = "MANUALLY_CORRECTED";

  histRemovePanel("histCorrectionModal");

  openHistoryCorrectionModal();   // Re-open refreshed

  updateSummaryCards();

  filterHistoryTable();

  const msgs = { APPROVED:"Correction approved.", REJECTED:"Correction rejected.", MORE_INFO_REQUIRED:"Additional info requested from employee." };

  showToast(msgs[decision] || "Request updated.");

}



// ============================================================

// MANUAL CORRECTION (Header button — pick employee first)

// ============================================================

function openHistoryManualCorrectionModal(recordId = "") {

  if (recordId) { openHistoryEditModal(recordId, "EDIT_TIMES"); return; }

  histRemovePanel("histManualCorrModal");



  const modal = document.createElement("div");

  modal.id = "histManualCorrModal";

  modal.className = "hist-modal-bg";

  modal.innerHTML = `

    <div style="background:var(--panel-raised); border:1px solid var(--panel-border); border-radius:20px; width:100%; max-width:500px;

                box-shadow:var(--shadow-lg); animation:histFadeIn 0.2s ease; color:var(--text);">

      <div style="padding:20px 24px; border-bottom:1px solid var(--line); display:flex; align-items:center; justify-content:space-between;">

        <div>

          <p style="font-size:0.63rem;font-weight:800;text-transform:uppercase;color:var(--primary);margin:0;">MANUAL CORRECTION</p>

          <h3 style="margin:4px 0 0;color:var(--text);font-size:1.05rem;font-weight:800;">Select Record to Correct</h3>

        </div>

        <button onclick="document.getElementById('histManualCorrModal').remove()"

                style="background:none;border:none;color:var(--muted-text);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:4px;">${HIST_ICONS.close}</button>

      </div>

      <div style="padding:16px;max-height:420px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;">

        ${mockHistoryDataset.map(item => `

          <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;

                      border-radius:10px;background:var(--panel-soft);border:1px solid var(--line-strong);cursor:pointer;

                      transition:border 0.15s;"

               onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='var(--line-strong)'"

               onclick="document.getElementById('histManualCorrModal').remove(); window.openHistoryEditModal('${item.id}','EDIT_TIMES');">

            <div style="display:flex;align-items:center;gap:10px;">

              <div style="width:32px;height:32px;border-radius:50%;background:var(--primary-soft);color:var(--primary);font-weight:800;display:flex;align-items:center;justify-content:center;font-size:0.8rem;">${item.employeeName.charAt(0)}</div>

              <div>

                <div style="font-weight:700;color:var(--text);font-size:0.82rem;">${item.employeeName}</div>

                <div style="color:var(--muted-text);font-size:0.7rem;">${item.employeeId} · ${item.date}</div>

              </div>

            </div>

            <div style="text-align:right;">

              <div style="font-size:0.75rem;font-weight:700;color:var(--primary);font-family:monospace;">${item.workingHours}</div>

              <div style="font-size:0.68rem;color:var(--muted-text);">${STATUS_LABELS[item.status]||item.status}</div>

            </div>

          </div>`).join("")}

      </div>

    </div>`;

  document.body.appendChild(modal);

  modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });

}



// ============================================================

// EMPLOYEE SELF-SERVICE ATTENDANCE CORRECTION REQUEST

// ============================================================

function openEmployeeCorrectionRequestModal() {

  histRemovePanel("empCorrectionModal");



  const todayStr = new Date().toISOString().split("T")[0];

  const user = currentUser();



  const modal = document.createElement("div");

  modal.id = "empCorrectionModal";

  modal.className = "hist-modal-bg";

  modal.innerHTML = `

    <div style="background:var(--panel-raised); border:1px solid var(--panel-border); border-radius:20px; width:100%; max-width:490px;

                box-shadow:var(--shadow-lg); animation:histFadeIn 0.2s ease; color:var(--text);">

      <div style="padding:20px 24px; border-bottom:1px solid var(--line); display:flex; align-items:center; justify-content:space-between;">

        <div>

          <p style="font-size:0.63rem;font-weight:800;text-transform:uppercase;color:var(--primary);margin:0;">ATTENDANCE REGULARIZATION</p>

          <h3 style="margin:4px 0 0;color:var(--text);font-size:1.05rem;font-weight:800;">Request Attendance Correction</h3>

        </div>

        <button onclick="document.getElementById('empCorrectionModal').remove()"

                style="background:none;border:none;color:var(--muted-text);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:4px;">${HIST_ICONS.close}</button>

      </div>

      <div style="padding:20px 24px;">

        <div style="background:var(--panel-soft);border:1px solid var(--line-strong);border-radius:10px;padding:12px;margin-bottom:16px;font-size:0.78rem;color:var(--muted-text);">

          Submitting request as <strong style="color:var(--text);">${user.name}</strong> (${appState.currentEmployee?.employeeId || "DR-001"})

        </div>

        <div style="margin-bottom:12px;">

          <label style="font-size:0.75rem;font-weight:700;color:var(--muted-text);display:block;margin-bottom:4px;">Date <span style="color:var(--danger);">*</span></label>

          <input id="reqCorrDate" type="date" class="hist-modal-input" max="${todayStr}" value="${todayStr}" />

        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">

          <div>

            <label style="font-size:0.75rem;font-weight:700;color:var(--muted-text);display:block;margin-bottom:4px;">Clock In Time</label>

            <input id="reqCorrClockIn" type="text" class="hist-modal-input" placeholder="e.g. 09:00 AM" value="09:00 AM" />

          </div>

          <div>

            <label style="font-size:0.75rem;font-weight:700;color:var(--muted-text);display:block;margin-bottom:4px;">Clock Out Time</label>

            <input id="reqCorrClockOut" type="text" class="hist-modal-input" placeholder="e.g. 06:00 PM" value="06:00 PM" />

          </div>

        </div>

        <div style="margin-bottom:12px;">

          <label style="font-size:0.75rem;font-weight:700;color:var(--muted-text);display:block;margin-bottom:4px;">Work Mode</label>

          <select id="reqCorrWorkMode" class="hist-modal-input">

            <option value="OFFICE">Office</option>

            <option value="WFH">WFH</option>

          </select>

        </div>

        <div style="margin-bottom:16px;">

          <label style="font-size:0.75rem;font-weight:700;color:var(--muted-text);display:block;margin-bottom:4px;">

            Reason for Regularization <span style="color:var(--danger);">*</span>

          </label>

          <textarea id="reqCorrReason" class="hist-modal-input" rows="3"

                    placeholder="Provide detailed explanation (e.g. Missed punch due to client site visit)..." style="resize:vertical;"></textarea>

        </div>

        <div style="display:flex;gap:10px;">

          <button type="button" class="hist-modal-btn-primary" style="flex:1;"

                  onclick="window.submitEmployeeCorrectionRequest()">Submit Correction Request</button>

          <button type="button" class="hist-modal-btn-secondary"

                  onclick="document.getElementById('empCorrectionModal').remove()">Cancel</button>

        </div>

      </div>

    </div>`;

  document.body.appendChild(modal);

  modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });

}



function submitEmployeeCorrectionRequest() {

  const reqDateVal = document.getElementById("reqCorrDate")?.value;

  const clockIn = document.getElementById("reqCorrClockIn")?.value.trim() || "09:00 AM";

  const clockOut = document.getElementById("reqCorrClockOut")?.value.trim() || "06:00 PM";

  const workMode = document.getElementById("reqCorrWorkMode")?.value || "OFFICE";

  const reason = document.getElementById("reqCorrReason")?.value.trim() || "";



  if (!reason || reason.length < 5) {

    showToast("Please enter a valid reason (at least 5 characters).");

    return;

  }



  const d = reqDateVal ? new Date(reqDateVal + "T00:00:00") : new Date();

  const dateStr = histFmtDate(d);

  const user = currentUser();

  const empId = appState.currentEmployee?.employeeId || "DR-001";

  const recId = `ATT-HIST-${Date.now()}`;



  mockHistoryDataset.unshift({

    id: recId,

    employeeName: user.name,

    employeeId: empId,

    department: "Management",

    date: dateStr,

    workMode: workMode,

    clockIn: clockIn,

    clockOut: clockOut,

    workingHours: "09h 00m",

    status: "MISSING_CLOCK_OUT",

    verification: "NOT_VERIFIED",

    correctionStatus: "PENDING_REVIEW",

    lastModified: `${user.name} · ${histTodayLabel()}`

  });



  histRemovePanel("empCorrectionModal");

  updateSummaryCards();

  filterHistoryTable();

  showToast("Attendance correction request submitted for HR approval.");

}



// ============================================================

// WINDOW EXPORTS

// ============================================================

window.filterHistoryTable              = filterHistoryTable;

window.debounceHistorySearch           = debounceHistorySearch;

window.switchHistoryTab                = switchHistoryTab;

window.navigateHistoryPeriod           = navigateHistoryPeriod;

window.filterHistoryCard               = filterHistoryCard;

window.clearHistoryCardFilter          = clearHistoryCardFilter;

window.resetHistoryFilters             = resetHistoryFilters;

window.exportHistoryReportCSV          = exportHistoryReportCSV;

window.openHistoryCorrectionModal      = openHistoryCorrectionModal;

window.hideGlobalDropdown              = hideGlobalDropdown;

window.reviewCorrectionRequest         = reviewCorrectionRequest;

window.openHistoryManualCorrectionModal= openHistoryManualCorrectionModal;

window.openEmployeeCorrectionRequestModal = openEmployeeCorrectionRequestModal;

window.submitEmployeeCorrectionRequest = submitEmployeeCorrectionRequest;

window.openHistoryDetailDrawer         = openHistoryDetailDrawer;

window.openHistoryEditModal            = openHistoryEditModal;

window.openHistoryAuditDrawer          = openHistoryAuditDrawer;

window.submitHistoryCorrection         = submitHistoryCorrection;

window.validateCorrectionReason        = validateCorrectionReason;

window.handleCustomDateChange          = handleCustomDateChange;

window.applyCustomDateRange            = applyCustomDateRange;

window.clearCustomDateRange            = clearCustomDateRange;

window.updateSummaryCards              = updateSummaryCards;

window.updateNavControls               = updateNavControls;

window.setupHistoryStyles              = setupHistoryStyles;

window.setupHistoryDropdownClose       = setupHistoryDropdownClose;

window.toggleHistoryEditDropdown       = toggleHistoryEditDropdown;

window.toggleTodayEditDropdown         = toggleTodayEditDropdown;

window.openTodayEmployeeDetailModal    = openTodayEmployeeDetailModal;

window.openTodayEditAttendanceModal    = openTodayEditAttendanceModal;

window.submitTodayAttendanceCorrection = submitTodayAttendanceCorrection;

window.openTodayAuditHistoryDrawer      = openTodayAuditHistoryDrawer;



window.handleQuickAction        = handleQuickAction;

window.openLeaveModal           = openLeaveModal;

window.openTicketModal          = openTicketModal;

window.checkIn                  = checkIn;

window.checkOut                 = checkOut;

window.showToast                = showToast;

window.apiRequest               = apiRequest;

window.scaffoldAction           = scaffoldAction;

window.recordWorkflowAudit      = recordWorkflowAudit;

window.saveCompanySettings      = saveCompanySettings;

window.handleDashboardFilterChange = handleDashboardFilterChange;

window.deactivateEmployee       = deactivateEmployee;

window.getEmployeeAttendanceStatus = getEmployeeAttendanceStatus;


window.showAttendanceRulesModal = showAttendanceRulesModal;

window.openPayslipModal         = openPayslipModal;


window.bypassLoginWithMock      = bypassLoginWithMock;



// ============================================================

// TODAY'S TEAM ATTENDANCE MODALS & ACTION HANDLERS

// ============================================================

function openTodayEmployeeDetailModal(empId) {

  const item = employees.find(e => e.id === empId);

  if (!item) return;

  histRemovePanel("todayDetailDrawer");



  const todayStr = new Date().toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });

  let checkIn = item.checkInTime || "—";

  let checkOut = item.checkOutTime || "—";

  let attendance = item.attendance || "Not Started";



  if (item.id === "DR-001") {

    if (appState.checkedIn) {

      checkIn = appState.clockInTime ? new Date(appState.clockInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : "08:50 AM";

      checkOut = "—";

      attendance = appState.wfh ? "WFH" : "Office";

    } else if (appState.clockInTime && appState.clockOutTime) {

      checkIn = new Date(appState.clockInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

      checkOut = new Date(appState.clockOutTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

      attendance = appState.wfh ? "WFH" : "Office";

    }

  }



  const drawer = document.createElement("div");

  drawer.id = "todayDetailDrawer";

  drawer.className = "hist-drawer-bg";

  drawer.style.animation = "histSlideIn 0.25s ease";

  drawer.innerHTML = `

    <div style="padding:24px; border-bottom:1px solid var(--line); display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; background:var(--panel-raised); z-index:2;">

      <div>

        <p style="font-size:0.65rem; font-weight:800; text-transform:uppercase; color:var(--primary); margin:0;">TODAY'S ATTENDANCE</p>

        <h3 style="margin:4px 0 0; color:var(--text); font-size:1.1rem; font-weight:800;">${item.name}</h3>

      </div>

      <button onclick="document.getElementById('todayDetailDrawer').remove()"

              style="background:none;border:none;color:var(--muted-text);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:4px;">${HIST_ICONS.close}</button>

    </div>

    <div style="padding:20px; display:flex; flex-direction:column; gap:14px;">



      <div style="background:var(--panel-soft); border:1px solid var(--line-strong); border-radius:12px; padding:16px;">

        <p style="font-size:0.63rem; font-weight:800; text-transform:uppercase; color:var(--muted-text); margin:0 0 10px;">EMPLOYEE PROFILE</p>

        ${histDetailRow("Employee ID", item.id)}

        ${histDetailRow("Department", item.dept)}

        ${histDetailRow("Designation", item.designation || "N/A")}

        ${histDetailRow("Assigned Shift", item.shift || "09:00 AM - 06:00 PM")}

      </div>



      <div style="background:var(--panel-soft); border:1px solid var(--line-strong); border-radius:12px; padding:16px;">

        <p style="font-size:0.63rem; font-weight:800; text-transform:uppercase; color:var(--muted-text); margin:0 0 10px;">TODAY'S ACTIVITY (${todayStr})</p>

        ${histDetailRow("Clock In Time", `<span style="color:var(--success); font-family:monospace;">${checkIn}</span>`)}

        ${histDetailRow("Clock Out Time", `<span style="color:var(--warning); font-family:monospace;">${checkOut}</span>`)}

        ${histDetailRow("Current Status", attendance)}

      </div>



      <div style="display:flex; gap:8px; margin-top:8px;">

        ${canAdministerEmployee(item) ? `<button type="button" class="hist-modal-btn-primary" style="flex:1; display:inline-flex; align-items:center; justify-content:center;"

                onclick="window.openTodayEditAttendanceModal('${item.id}','EDIT_TIMES')">${HIST_ICONS.pencil} Edit Attendance</button>` : `<span class="muted">Super Admin manages this attendance record.</span>`}

        <button type="button" class="hist-modal-btn-secondary"

                onclick="document.getElementById('todayDetailDrawer').remove()">Close</button>

      </div>

    </div>`;

  document.body.appendChild(drawer);

}



function openTodayEditAttendanceModal(empId, actionType) {
  if (!requireEmployeeAdministration(empId)) return;

  document.querySelectorAll(".today-edit-dropdown").forEach(d => (d.style.display = "none"));

  const item = employees.find(e => e.id === empId);

  if (!item) return;

  histRemovePanel("todayEditModal");



  const TITLES = {

    EDIT_TIMES: "Edit Attendance",

    ADD_CLOCK_OUT: "Add Missing Clock-Out",

    CHANGE_WORK_MODE: "Change Work Mode",

    MARK_LEAVE: "Mark as Leave"

  };



  let formHtml = "";

  if (actionType === "EDIT_TIMES") {

    formHtml = `

      <label style="font-size:0.75rem;font-weight:700;color:var(--muted-text);display:block;margin-bottom:4px;">Clock In Time</label>

      <input id="todayClockIn" type="text" class="hist-modal-input" placeholder="e.g. 09:00 AM" value="${item.checkInTime || '09:00 AM'}" style="margin-bottom:12px;" />

      <label style="font-size:0.75rem;font-weight:700;color:var(--muted-text);display:block;margin-bottom:4px;">Clock Out Time</label>

      <input id="todayClockOut" type="text" class="hist-modal-input" placeholder="e.g. 06:00 PM" value="${item.checkOutTime || ''}" />`;

  } else if (actionType === "ADD_CLOCK_OUT") {

    formHtml = `

      <label style="font-size:0.75rem;font-weight:700;color:var(--muted-text);display:block;margin-bottom:4px;">Clock Out Time</label>

      <input id="todayClockOut" type="text" class="hist-modal-input" placeholder="e.g. 06:00 PM" value="${item.checkOutTime || '06:00 PM'}" />`;

  } else if (actionType === "CHANGE_WORK_MODE") {

    formHtml = `

      <label style="font-size:0.75rem;font-weight:700;color:var(--muted-text);display:block;margin-bottom:8px;">Work Mode</label>

      <div style="display:flex;gap:10px;">

        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:12px 16px;border-radius:10px;border:1px solid ${item.attendance==="Office"?"var(--primary)":"var(--line-strong)"};background:${item.attendance==="Office"?"var(--primary-soft)":"transparent"};flex:1;">

          <input type="radio" name="todayWorkMode" value="Office" ${item.attendance!=="WFH"?"checked":""} style="accent-color:var(--primary);">

          <span style="color:var(--text);font-weight:700;display:flex;align-items:center;">${HIST_ICONS.building} Office</span>

        </label>

        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:12px 16px;border-radius:10px;border:1px solid ${item.attendance==="WFH"?"#22d3ee":"var(--line-strong)"};background:${item.attendance==="WFH"?"rgba(34,211,238,.1)":"transparent"};flex:1;">

          <input type="radio" name="todayWorkMode" value="WFH" ${item.attendance==="WFH"?"checked":""} style="accent-color:#22d3ee;">

          <span style="color:var(--text);font-weight:700;display:flex;align-items:center;">${HIST_ICONS.home} WFH</span>

        </label>

      </div>`;

  } else if (actionType === "MARK_LEAVE") {

    formHtml = `

      <label style="font-size:0.75rem;font-weight:700;color:var(--muted-text);display:block;margin-bottom:4px;">Leave Type</label>

      <select id="todayLeaveType" class="hist-modal-input">

        <option value="Casual Leave">Casual Leave</option>

        <option value="Sick Leave">Sick Leave</option>

        <option value="Privilege Leave">Privilege Leave</option>

        <option value="LWP">Leave Without Pay (LWP)</option>

      </select>`;

  }



  const modal = document.createElement("div");

  modal.id = "todayEditModal";

  modal.className = "hist-modal-bg";

  modal.innerHTML = `

    <div style="background:var(--panel-raised); border:1px solid var(--panel-border); border-radius:20px; width:100%; max-width:490px;

                box-shadow:var(--shadow-lg); animation:histFadeIn 0.2s ease; color:var(--text);">

      <div style="padding:20px 24px; border-bottom:1px solid var(--line); display:flex; align-items:center; justify-content:space-between;">

        <div>

          <p style="font-size:0.63rem;font-weight:800;text-transform:uppercase;color:var(--primary);margin:0;">TODAY'S ATTENDANCE CORRECTION</p>

          <h3 style="margin:4px 0 0;color:var(--text);font-size:1.05rem;font-weight:800;">${TITLES[actionType]}</h3>

        </div>

        <button onclick="document.getElementById('todayEditModal').remove()"

                style="background:none;border:none;color:var(--muted-text);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:4px;">${HIST_ICONS.close}</button>

      </div>

      <div style="padding:20px 24px;">

        <div style="background:var(--panel-soft);border:1px solid var(--line-strong);border-radius:10px;padding:12px;margin-bottom:16px;font-size:0.78rem;color:var(--muted-text);">

          <strong style="color:var(--text);">${item.name}</strong> (${item.id}) · Assigned Shift: ${item.shift || '09:00 AM - 06:00 PM'}

        </div>

        <div style="margin-bottom:16px;">${formHtml}</div>

        <label style="font-size:0.75rem;font-weight:700;color:var(--muted-text);display:block;margin-bottom:4px;">

          Reason for Edit <span style="color:var(--danger);">*</span>

        </label>

        <textarea id="todayCorrectionReason" class="hist-modal-input" rows="3"

                  placeholder="Reason for editing today's attendance..." style="resize:vertical;"></textarea>

        <div style="display:flex;gap:10px;margin-top:16px;">

          <button type="button" class="hist-modal-btn-primary" style="flex:1;"

                  onclick="window.submitTodayAttendanceCorrection('${empId}','${actionType}')">Save Changes</button>

          <button type="button" class="hist-modal-btn-secondary"

                  onclick="document.getElementById('todayEditModal').remove()">Cancel</button>

        </div>

      </div>

    </div>`;

  document.body.appendChild(modal);

  modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });

}



function submitTodayAttendanceCorrection(empId, actionType) {
  if (!requireEmployeeAdministration(empId)) return;

  const item = employees.find(e => e.id === empId);

  if (!item) return;



  const reason = document.getElementById("todayCorrectionReason")?.value || "";

  if (!reason.trim()) {

    showToast("Please provide a reason for editing attendance");

    return;

  }



  if (actionType === "EDIT_TIMES") {

    const inVal = document.getElementById("todayClockIn")?.value || "";

    const outVal = document.getElementById("todayClockOut")?.value || "";

    if (inVal) item.checkInTime = inVal;

    if (outVal) item.checkOutTime = outVal;

    if (inVal && outVal) item.attendance = "Office";

  } else if (actionType === "ADD_CLOCK_OUT") {

    const outVal = document.getElementById("todayClockOut")?.value || "";

    if (outVal) item.checkOutTime = outVal;

  } else if (actionType === "CHANGE_WORK_MODE") {

    const mode = document.querySelector('input[name="todayWorkMode"]:checked')?.value || "Office";

    item.attendance = mode;

  } else if (actionType === "MARK_LEAVE") {

    item.attendance = "On Leave";

    item.checkInTime = null;

    item.checkOutTime = null;

  }



  if (item.id === "DR-001") {

    if (item.attendance === "On Leave") {

      appState.checkedIn = false;

      appState.clockInTime = null;

      appState.clockOutTime = null;

    } else {

      appState.checkedIn = true;

      appState.wfh = item.attendance === "WFH";

    }

  }



  document.getElementById("todayEditModal")?.remove();

  renderAttendance();

  showToast(`Attendance updated for ${item.name}`);

}



function openTodayAuditHistoryDrawer(empId) {

  document.querySelectorAll(".today-edit-dropdown").forEach(d => (d.style.display = "none"));

  const item = employees.find(e => e.id === empId);

  if (!item) return;

  histRemovePanel("todayAuditDrawer");



  const todayStr = new Date().toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });

  const drawer = document.createElement("div");

  drawer.id = "todayAuditDrawer";

  drawer.className = "hist-drawer-bg";

  drawer.style.zIndex = "10001";

  drawer.style.animation = "histSlideIn 0.25s ease";

  drawer.innerHTML = `

    <div style="padding:24px; border-bottom:1px solid var(--line); display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; background:var(--panel-raised); z-index:2;">

      <div>

        <p style="font-size:0.65rem; font-weight:800; text-transform:uppercase; color:var(--primary); margin:0;">TODAY'S AUDIT LOG</p>

        <h3 style="margin:4px 0 0; color:var(--text); font-size:1.05rem;">${item.name} · ${todayStr}</h3>

      </div>

      <button onclick="document.getElementById('todayAuditDrawer').remove()"

              style="background:none;border:none;color:var(--muted-text);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:4px;">${HIST_ICONS.close}</button>

    </div>

    <div style="padding:24px;">

      <div style="background:var(--panel-soft); border:1px solid var(--line-strong); border-radius:10px; padding:12px; margin-bottom:16px;">

        <div style="font-weight:700; color:var(--text); font-size:0.82rem;">Today's Record Active</div>

        <div style="color:var(--muted-text); font-size:0.75rem; margin-top:4px;">Shift: <strong>${item.shift || '09:00 AM - 06:00 PM'}</strong> · Status: <strong>${item.attendance}</strong></div>

        <div style="color:var(--muted-text); font-size:0.75rem; margin-top:2px;">Clock In: <strong>${item.checkInTime || '—'}</strong> · Clock Out: <strong>${item.checkOutTime || '—'}</strong></div>

      </div>

    </div>`;

  document.body.appendChild(drawer);

}



window.addEventListener("DOMContentLoaded", init);
