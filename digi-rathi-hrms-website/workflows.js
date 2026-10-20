const workflowDefinitions = {
  onboard: {
    title: "Employee Onboard",
    subtitle: "Create the employee profile, access and onboarding email",
    steps: ["Personal & Emergency", "Employment & Salary", "Bank & Assets", "Documents & Review"]
  },
  department: {
    title: "Create Department",
    subtitle: "Set ownership, reporting and department policies",
    steps: ["Basic Details", "Ownership & Policies", "Review & Create"]
  },
  payroll: {
    title: "Generate Payroll",
    subtitle: "Build, review and finalize the monthly payroll cycle",
    steps: ["Period & Filters", "Payroll Preview", "Finalize"]
  },
  document: {
    title: "Generate Document",
    subtitle: "Create, review and securely share an employee document",
    steps: ["Document Setup", "Preview & Edit", "Generate & Share"]
  },
  leaveCalendar: {
    title: "Leave Calendar",
    subtitle: "Approved leave, requests, holidays and work-from-home days",
    steps: ["Calendar"]
  },
  report: {
    title: "Export Report",
    subtitle: "Choose filters, preview the result and generate a file",
    steps: ["Configure & Export"]
  },
  attendanceSettings: {
    title: "Attendance Settings",
    subtitle: "Configure Office GPS Coordinates and IP restrictions",
    steps: ["GPS & IP Configuration"]
  },
  attendanceRules: {
    title: "Attendance Rules & Policies",
    subtitle: "Configured guidelines, boundaries and late arrival rules",
    steps: ["Rules & Policies"]
  },
  holidayList: {
    title: "Holiday List Configuration",
    subtitle: "Manage company holidays and scheduled non-working days",
    steps: ["Manage Holidays"]
  },
  leaveApproval: {
    title: "Leave Request Decision",
    subtitle: "Review leave application and record decision",
    steps: ["Review Details", "Submit Decision"]
  }
};

let workflowState = null;

function openWorkflow(type, options = {}) {
  if(type==='onboard' && options.employeeId && !options.viewOnly && !requireEmployeeAdministration(options.employeeId))return;
  const requiredPermissions = {
    onboard: ["EMPLOYEE_CREATE"], department: [options.departmentId ? "DEPARTMENT_UPDATE" : "DEPARTMENT_CREATE"],
    payroll: ["PAYROLL_GENERATE"], document: ["DOCUMENT_GENERATE"], leaveCalendar: ["LEAVE_APPLY", "LEAVE_READ_TEAM", "LEAVE_READ_ALL"],
    report: ["REPORT_EXPORT"], attendanceSettings: ["SETTINGS_UPDATE"], attendanceRules: ["ATTENDANCE_READ_SELF"],
    holidayList: ["SETTINGS_UPDATE", "ATTENDANCE_READ_SELF"], leaveApproval: ["LEAVE_APPROVE", "LEAVE_APPROVE_ALL"]
  };
  if (!appState.backendConnected || !requiredPermissions[type]?.some((permission) => hasPermission(permission))) {
    showToast("You do not have permission to access this action.");
    return;
  }

  const previousDraft = type === "onboard" && options.resumeDraft !== false ? appState.onboardingDraft : null;
  if(type === 'holidayList' && !hasPermission('SETTINGS_UPDATE')) options = {...options,viewOnly:true};
  workflowState = {
    type,
    step: Number(options.startStep || 0),
    data: previousDraft ? structuredClone(previousDraft.data) : defaultWorkflowData(type, options),
    assets: previousDraft ? structuredClone(previousDraft.assets || []) : [],
    files: {},
    uploadTokens: previousDraft ? structuredClone(previousDraft.uploadTokens || {}) : {},
    options,
    loading: false,
    success: null,
    calendarView: "month",
    calendarData: null,
    calendarLoading: type === "leaveCalendar",
    backendPayrollRun: null,
    backendReportPreview: null,
    validationMessage: ""
  };
  if (type === "department" && options.departmentId) loadDepartmentForEdit(options.departmentId);
  if (type === "onboard" && options.employeeId) loadEmployeeForEdit(options.employeeId);
  const modal = document.querySelector("#workflowModal");
  modal.showModal();
  renderWorkflow();
  if (type === "leaveCalendar") loadLeaveCalendarData();
}

function defaultWorkflowData(type, options) {
  const today = new Date().toISOString().slice(0, 10);
  if (type === "onboard") return {
    employeeId: nextEmployeeId(), employeeStatus: "Active", employmentType: "Full-time", shift: "Day Shift",
    joiningDate: today, role: "EMPLOYEE", gender: "", profilePhoto: "", aadhaarUpload: "", panUpload: "",
    resumeUpload: "", educationUpload: "", otherEarnings: "0", manualDeductions: "0"
  };
  if (type === "department") return { status: "Active", workingShift: "Day Shift", weeklyOffPattern: "Saturday, Sunday" };
  if (type === "payroll") {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return { payrollMonth: String(month), payrollYear: String(year), cycleStart: `${year}-${String(month).padStart(2, "0")}-01`,
      cycleEnd: `${year}-${String(month).padStart(2, "0")}-30`, paymentDate: `${year}-${String(month).padStart(2, "0")}-31`,
      department: "All departments", employeeFilter: "All employees", includeAttendance: true, includeLwp: true,
      includeOvertime: true, includeLateDeductions: true, includeManualDeductions: true };
  }
  if (type === "document") return { documentType: "Appointment Letter", employee: linkedEmployees()[0] ? `${linkedEmployees()[0].name} (${linkedEmployees()[0].id})` : "", template: "Digi Rathi Standard Letterhead",
    issueDate: today, effectiveDate: today, signatory: "", emailToEmployee: true, saveToProfile: true };
  if (type === "leaveCalendar") {
    const date = new Date(); const month = String(date.getMonth() + 1).padStart(2, "0");
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    return { calendarStart: `${date.getFullYear()}-${month}-01`, calendarEnd: `${date.getFullYear()}-${month}-${String(monthEnd).padStart(2, "0")}`,
      calendarDepartment: roleCalendarDepartments()[0], calendarEmployee: roleCalendarEmployees()[0], calendarLeaveType: "All leave types",
      calendarStatus: "All statuses", calendarShowWfh: true, calendarShowHolidays: true, calendarMyTeam: false };
  }
  if (type === "report") return { reportType: options.reportType || defaultReportType(), startDate: options.startDate || `${new Date().getFullYear()}-01-01`,
    endDate: options.endDate || today, department: "All departments", employee: "All employees",
    status: "All statuses", format: "PDF", includeSummaryCharts: true, includeEmployeeDetails: true,
    includeAuditTrail: false, fileName: `digi-rathi-${(options.reportType || "report").toLowerCase().replaceAll("_", "-")}` };
  if (type === "attendanceSettings") return { lat: appState.officeSettings.lat, lng: appState.officeSettings.lng, ip: appState.officeSettings.ip };
  if (type === "holidayList") return { holidays: structuredClone(appState.companyHolidays), date: today, name: "", type: "National", editIndex: -1 };
  if (type === "leaveApproval") {
    const idx = options.requestIndex;
    const req = appState.leaveRequests[idx];
    if (req) return { leaveType: req[0], dates: req[1], duration: req[2], status: req[3], employee: req[4] || "-", employeeCode: req[5] || "-", decision: options.decision || "APPROVED", decisionNotes: "" };
  }
  return {};
}

function renderWorkflow() {
  const definition = workflowDefinitions[workflowState.type];
  const content = document.querySelector("#workflowContent");
  if (workflowState.loading) {
    content.innerHTML = workflowLoading(definition);
    refreshIcons();
    return;
  }
  if (workflowState.success) {
    content.innerHTML = workflowSuccess(definition, workflowState.success);
    bindWorkflowEvents();
    refreshIcons();
    return;
  }

  const isEdit = workflowState.type === "onboard" && workflowState.options.employeeId;
  const title = isEdit ? "Edit Employee Profile" : definition.title;
  const subtitle = isEdit ? "Update details for this employee profile" : definition.subtitle;
  const steps = isEdit ? definition.steps.slice(0, 8) : definition.steps;

  content.innerHTML = `
    <div class="workflow-shell">
      <header class="workflow-header">
        <div><h2 id="workflowTitle">${title}</h2><p>${subtitle}</p></div>
        <button class="icon-button" type="button" data-workflow-action="cancel" aria-label="Close workflow"><i data-lucide="x"></i></button>
      </header>
      ${steps.length > 1 ? workflowProgress(steps) : ""}
      <main class="workflow-body">
        ${workflowState.validationMessage ? `<div class="workflow-alert"><i data-lucide="circle-alert"></i><span>${workflowState.validationMessage}</span></div>` : ""}
        ${workflowState.options.viewOnly ? `<fieldset disabled style="border:none; padding:0; margin:0; display:contents;">${workflowStepContent()}</fieldset>` : workflowStepContent()}
      </main>
      ${workflowFooter()}
    </div>`;
  bindWorkflowEvents();
  refreshIcons();
  requestAnimationFrame(() => document.querySelector("#workflowContent input:not([type='hidden']), #workflowContent select, #workflowContent button")?.focus());
}

function workflowProgress(steps) {
  return `<div class="workflow-progress" aria-label="Workflow progress">${steps.map((label, index) => `
    <div class="workflow-step-indicator ${index === workflowState.step ? "is-current" : index < workflowState.step ? "is-complete" : ""}" aria-current="${index === workflowState.step ? "step" : "false"}">
      <span>${index < workflowState.step ? `<i data-lucide="check"></i>` : index + 1}</span><span>${label}</span>
    </div>`).join("")}</div>`;
}

function workflowStepContent() {
  return ({
    onboard: renderOnboardStep,
    department: renderDepartmentStep,
    payroll: renderPayrollStep,
    document: renderDocumentStep,
    leaveCalendar: renderLeaveCalendar,
    report: renderReportStep,
    attendanceSettings: renderAttendanceSettingsStep,
    attendanceRules: renderAttendanceRulesStep,
    holidayList: renderHolidayListStep,
    leaveApproval: renderLeaveApprovalStep
  })[workflowState.type]();
}

function workflowFooter() {
  if (workflowState.type === "leaveCalendar" || workflowState.type === "attendanceRules") return `
    <footer class="workflow-footer"><button class="secondary-button" type="button" data-workflow-action="cancel">Close</button></footer>`;
  if (workflowState.options.viewOnly) return `<footer class="workflow-footer"><span class="footer-spacer"></span><button class="primary-button" type="button" data-workflow-action="cancel">Close</button></footer>`;
  const definition = workflowDefinitions[workflowState.type];
  const isEdit = workflowState.type === "onboard" && workflowState.options.employeeId;
  const steps = isEdit ? definition.steps.slice(0, 8) : definition.steps;
  const last = workflowState.step === steps.length - 1;
  const reviewStep = workflowState.type === "onboard" && workflowState.step === 7;
  const submitLabel = workflowState.type === "onboard" ? (isEdit ? "Update Profile" : "Onboard & Send Email")
    : workflowState.type === "department" ? (workflowState.options.departmentId ? "Update Department" : "Create Department")
    : workflowState.type === "payroll" ? "Finalize Payroll"
    : workflowState.type === "document" ? "Generate PDF"
    : workflowState.type === "attendanceSettings" ? "Save Settings"
    : workflowState.type === "holidayList" ? "Save Holiday List"
    : workflowState.type === "leaveApproval" ? "Submit Decision"
    : "Export File";
  return `<footer class="workflow-footer">
    <button class="secondary-button" type="button" data-workflow-action="cancel">Cancel</button>
    ${workflowState.step > 0 ? `<button class="secondary-button" type="button" data-workflow-action="back"><i data-lucide="arrow-left"></i>Back</button>` : ""}
    <span class="footer-spacer"></span>
    ${["onboard", "department", "payroll", "document"].includes(workflowState.type) ? `<button class="secondary-button" type="button" data-workflow-action="save-draft">Save Draft</button>` : ""}
    ${last ? `<button class="primary-button" type="button" data-workflow-action="submit">${submitLabel}</button>`
      : `<button class="primary-button" type="button" data-workflow-action="next">${reviewStep && !isEdit ? "Continue to Email" : workflowState.type === "payroll" && workflowState.step === 0 ? "Preview Payroll" : workflowState.type === "document" && workflowState.step === 0 ? "Preview" : "Next"}<i data-lucide="arrow-right"></i></button>`}
  </footer>`;
}

function section(title, description, body) {
  return `<section class="workflow-section"><div class="workflow-section-head"><h3>${title}</h3><p>${description}</p></div>${body}</section>`;
}

function textField(label, name, options = {}) {
  const value = workflowState.data[name] ?? options.value ?? "";
  const oninput = options.digitsOnly ? 'oninput="this.value = this.value.replace(/[^0-9]/g, \'\')"' : (options.oninput ? `oninput="${options.oninput}"` : "");
  const inputmode = options.digitsOnly ? 'inputmode="numeric"' : "";
  const attrs = [options.required !== false ? "required" : "", options.readonly ? "readonly" : "", options.min ? `min="${options.min}"` : "",
    options.max ? `max="${options.max}"` : "", options.pattern ? `pattern="${options.pattern}"` : "", options.placeholder ? `placeholder="${options.placeholder}"` : "",
    oninput, inputmode].filter(Boolean).join(" ");
  return `<label class="field ${options.full ? "full-span" : ""}"><span>${label}${options.optional ? " <small>(optional)</small>" : ""}</span>
    <input type="${options.type || "text"}" name="${name}" value="${escapeAttr(value)}" ${attrs} />${options.help ? `<small>${options.help}</small>` : ""}</label>`;
}

function selectField(label, name, values, options = {}) {
  const current = workflowState.data[name] ?? options.value ?? "";
  return `<label class="field ${options.full ? "full-span" : ""}"><span>${label}${options.optional ? " <small>(optional)</small>" : ""}</span><select name="${name}" ${options.required === false ? "" : "required"}>
    ${options.placeholder ? `<option value="">${options.placeholder}</option>` : ""}
    ${values.map((value) => { const item = typeof value === "string" ? { value, label: value } : value; return `<option value="${escapeAttr(item.value)}" ${String(item.value) === String(current) ? "selected" : ""}>${item.label}</option>`; }).join("")}
  </select></label>`;
}

function employeeLookupField(label, name, options = {}) {
  const current = workflowState.data[name] || "";
  const values = linkedEmployees().filter((item) => item.status === "Active")
    .map((item) => `${item.name} - ${item.id} - ${item.designation || "Employee"} - ${item.role || "Employee"}`);
  const listId = `${name}Options`;
  return `<label class="field"><span>${label}${options.optional ? " <small>(optional)</small>" : ""}</span>
    <input name="${name}" list="${listId}" value="${escapeAttr(current)}" ${options.required === false ? "" : "required"} placeholder="Search active employee" autocomplete="off" />
    <datalist id="${listId}">${values.map((value) => `<option value="${escapeAttr(value)}"></option>`).join("")}</datalist>
    <small>Search by employee name or ID</small></label>`;
}

function textareaField(label, name, options = {}) {
  return `<label class="field ${options.full === false ? "" : "full-span"}"><span>${label}${options.optional ? " <small>(optional)</small>" : ""}</span><textarea name="${name}" rows="${options.rows || 3}" ${options.required === false ? "" : "required"} placeholder="${options.placeholder || ""}">${escapeHtml(workflowState.data[name] || "")}</textarea></label>`;
}

function uploadField(label, name, accept, required = true) {
  const fileName = workflowState.data[name] || "";
  return `<label class="field upload-field"><span>${label}${required ? "" : " <small>(optional)</small>"}</span><span>${fileName ? escapeHtml(fileName) : "Choose a secure file"}</span>
    <input type="file" name="${name}" accept="${accept}" ${required && !workflowState.uploadTokens[name] ? "required" : ""} data-file-field="${name}" /></label>`;
}

function checkboxField(label, name) {
  return `<label class="workflow-check"><input type="checkbox" name="${name}" ${workflowState.data[name] ? "checked" : ""} /><span>${label}</span></label>`;
}

function calculateShiftDuration(startHour, startMin, startAmpm, endHour, endMin, endAmpm) {
  let startH = parseInt(startHour, 10) || 9;
  const startM = parseInt(startMin, 10) || 0;
  const sA = (startAmpm || "AM").toUpperCase();
  if (sA === "PM" && startH < 12) startH += 12;
  if (sA === "AM" && startH === 12) startH = 0;

  let endH = parseInt(endHour, 10) || 6;
  const endM = parseInt(endMin, 10) || 0;
  const eA = (endAmpm || "PM").toUpperCase();
  if (eA === "PM" && endH < 12) endH += 12;
  if (eA === "AM" && endH === 12) endH = 0;

  let startMins = startH * 60 + startM;
  let endMins = endH * 60 + endM;

  if (endMins <= startMins) {
    endMins += 24 * 60; // Overnight shift
  }

  const totalMins = endMins - startMins;
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  return { totalMins, hours, mins };
}

function shiftSelectorField() {
  const currentShift = workflowState.data.shift || "09:00 AM - 06:00 PM";

  const match = currentShift.match(/(\d+):(\d+)\s*(AM|PM)\s*-\s*(\d+):(\d+)\s*(AM|PM)/i)
    || currentShift.match(/(\d+):(\d+)\s*(AM|PM)\s*to\s*(\d+):(\d+)\s*(AM|PM)/i);

  let startH = "09", startM = "00", startA = "AM";
  let endH = "06", endM = "00", endA = "PM";

  if (match) {
    startH = String(match[1]).padStart(2, "0");
    startM = String(match[2]).padStart(2, "0");
    startA = match[3].toUpperCase();
    endH = String(match[4]).padStart(2, "0");
    endM = String(match[5]).padStart(2, "0");
    endA = match[6].toUpperCase();
  }

  const hoursList = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  const minsList = ["00", "15", "30", "45"];

  const duration = calculateShiftDuration(startH, startM, startA, endH, endM, endA);

  let durationBadgeHtml = "";
  if (duration.totalMins === 540) {
    durationBadgeHtml = `<span class="status success" style="padding: 4px 10px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 4px;"><i data-lucide="check-circle" style="width:14px;height:14px;"></i> Shift Duration: 9 Hours (Standard 9-hour logging time complete)</span>`;
  } else if (duration.totalMins < 540) {
    const diff = 540 - duration.totalMins;
    const diffH = Math.floor(diff / 60);
    const diffM = diff % 60;
    const diffText = diffH > 0 ? `${diffH}h ${diffM}m` : `${diffM} mins`;
    durationBadgeHtml = `<span class="status warning" style="padding: 4px 10px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 4px;"><i data-lucide="clock" style="width:14px;height:14px;"></i> Shift Duration: ${duration.hours}h ${duration.mins}m (${diffText} short of standard 9-hour shift)</span>`;
  } else {
    const diff = duration.totalMins - 540;
    const diffH = Math.floor(diff / 60);
    const diffM = diff % 60;
    const diffText = diffH > 0 ? `${diffH}h ${diffM}m` : `${diffM} mins`;
    durationBadgeHtml = `<span class="status success" style="padding: 4px 10px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 4px;"><i data-lucide="clock" style="width:14px;height:14px;"></i> Shift Duration: ${duration.hours}h ${duration.mins}m (${diffText} overtime included)</span>`;
  }

  const initialCombined = `${startH}:${startM} ${startA} - ${endH}:${endM} ${endA}`;
  workflowState.data.shift = initialCombined;

  return `
    <div class="field full-span" style="background: var(--panel-soft); padding: 14px 16px; border-radius: 12px; border: 1px solid var(--panel-border);">
      <span style="font-weight: 600; font-size: 0.85rem; margin-bottom: 10px; display: block; color: var(--text);">
        Working Shift Timing (Select Start & End Time)
      </span>
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <div style="display: flex; gap: 6px; align-items: center;">
          <span style="font-size: 0.8rem; color: var(--muted-text); font-weight: 500;">From:</span>
          <select name="shiftStartHour" class="analysis-select" style="padding: 4px 8px;">
            ${hoursList.map((h) => `<option value="${h}" ${h === startH ? "selected" : ""}>${h}</option>`).join("")}
          </select>
          <span>:</span>
          <select name="shiftStartMin" class="analysis-select" style="padding: 4px 8px;">
            ${minsList.map((m) => `<option value="${m}" ${m === startM ? "selected" : ""}>${m}</option>`).join("")}
          </select>
          <select name="shiftStartAmpm" class="analysis-select" style="padding: 4px 8px;">
            <option value="AM" ${startA === "AM" ? "selected" : ""}>AM</option>
            <option value="PM" ${startA === "PM" ? "selected" : ""}>PM</option>
          </select>
        </div>

        <span style="font-weight: 600; color: var(--muted-text);">to</span>

        <div style="display: flex; gap: 6px; align-items: center;">
          <span style="font-size: 0.8rem; color: var(--muted-text); font-weight: 500;">To:</span>
          <select name="shiftEndHour" class="analysis-select" style="padding: 4px 8px;">
            ${hoursList.map((h) => `<option value="${h}" ${h === endH ? "selected" : ""}>${h}</option>`).join("")}
          </select>
          <span>:</span>
          <select name="shiftEndMin" class="analysis-select" style="padding: 4px 8px;">
            ${minsList.map((m) => `<option value="${m}" ${m === endM ? "selected" : ""}>${m}</option>`).join("")}
          </select>
          <select name="shiftEndAmpm" class="analysis-select" style="padding: 4px 8px;">
            <option value="AM" ${endA === "AM" ? "selected" : ""}>AM</option>
            <option value="PM" ${endA === "PM" ? "selected" : ""}>PM</option>
          </select>
        </div>

        <input type="hidden" name="shift" value="${escapeAttr(initialCombined)}" />
      </div>

      <div id="shiftDurationBadge" style="margin-top: 12px;">
        ${durationBadgeHtml}
      </div>
    </div>
  `;
}

function onboardAccessField() {
  const target=workflowState.options.employeeId?administrativeEmployee(workflowState.options.employeeId):null;
  if(target?.role==='Super Admin')return '<label class="field">Type of access<input value="Super Admin" readonly aria-readonly="true"><small>Super Admin access is preserved.</small></label>';
  if(appState.role==='Super Admin')return selectField('Type of access','role',[{value:'EMPLOYEE',label:'Employee'},{value:'HR_ADMIN',label:'HR Admin'}],{help:'Managers use Employee access. Only Super Admin can assign HR Admin access.'});
  return '<label class="field">Type of access<input value="Employee" readonly aria-readonly="true"><small>Only Super Admin can assign HR Admin access.</small></label>';
}

function renderOnboardStep() {
  const step = workflowState.step;
  
  if (step === 0) {
    return `<form id="workflowForm">
      ${section("Personal Details", "Employee identity, contact information, and address fields.", `
        <div class="workflow-grid">
          ${textField("Full Name", "fullName", { placeholder: "Employee full name" })}
          ${uploadField("Profile Photo", "profilePhoto", "image/png,image/jpeg", false)}
          ${textField("Date of Birth", "dateOfBirth", { type: "date" })}
          ${selectField("Gender", "gender", ["Female", "Male", "Non-binary", "Prefer not to say"], { placeholder: "Select gender" })}
          ${textField("Mobile Number", "mobileNumber", { type: "tel", pattern: "[0-9]{10}", help: "10 digits mobile number", digitsOnly: true })}
          ${textField("Personal Email", "personalEmail", { type: "email" })}
          ${textareaField("Current Address", "currentAddress")}
          ${textareaField("Permanent Address", "permanentAddress")}
        </div>
      `)}
      ${section("Emergency Contact", "Primary contact details for emergency scenarios.", `
        <div class="workflow-grid">
          ${textField("Contact Name", "emergencyContactName")}
          ${textField("Relationship", "emergencyRelationship")}
          ${textField("Mobile Number", "emergencyMobile", { type: "tel", pattern: "[0-9]{10}", help: "10 digits mobile number", digitsOnly: true })}
          ${textField("Alternate Mobile Number", "emergencyAlternateMobile", { type: "tel", required: false, optional: true, digitsOnly: true })}
        </div>
      `)}
    </form>`;
  }
  
  if (step === 1) {
    const departments = appState.departments.filter((item) => item.status === "Active").map((item) => ({ value: item.name, label: `${item.name} (${item.code})` }));
    departments.push({ value: "__new__", label: "+ Add New Department" });
    
    return `<form id="workflowForm">
      ${section("Employment Details", "Assign position, access role, department, and work shifts.", `
        <div class="workflow-grid">
          ${textField("Employee ID", "employeeId", { readonly: true, help: "Auto-generated" })}
          ${textField("Official Email", "officialEmail", { type: "email", help: "Enter the employee’s actual email address" })}
          ${selectField("Department", "department", departments, { placeholder: "Select department" })}
          ${textField("Designation", "designation")}
          ${selectField("Reporting Manager", "reportingManager", ["No reporting manager", ...linkedEmployees().filter((item) => item.status === "Active").map((item) => `${item.name} (${item.id})`)])}
          ${onboardAccessField()}
          ${selectField("Employment Type", "employmentType", ["Full-time", "Intern", "Contract"])}
          ${textField("Joining Date", "joiningDate", { type: "date" })}
          ${textField("Probation End Date", "probationEndDate", { type: "date", required: false, optional: true })}
          ${shiftSelectorField()}
          ${textField("Employee Status", "employeeStatus", { readonly: true })}
        </div>
      `)}
      ${section("Salary & Compensation", "Configure basic earnings, allowances, deductions, and compute monthly CTC.", `
        <div class="workflow-grid three">
          ${textField("Basic Salary", "basicSalary", { type: "number", min: "0" })}
          ${textField("HRA", "hra", { type: "number", min: "0" })}
          ${textField("Special Allowance", "specialAllowance", { type: "number", min: "0" })}
          ${textField("Other Earnings", "otherEarnings", { type: "number", min: "0", required: false, optional: true })}
          ${textField("Manual Deductions", "manualDeductions", { type: "number", min: "0", required: false, optional: true })}
          ${textField("Monthly CTC", "monthlyCtc", { type: "number", min: "0", help: "Calculated automatically" })}
        </div>
      `)}
    </form>`;
  }
  
  if (step === 2) {
    return `<form id="workflowForm">
      ${section("Bank Details", "Restricted banking information for direct deposit deposits.", `
        <div class="workflow-grid">
          ${textField("Bank Name", "bankName")}
          ${textField("Account Holder Name", "accountHolderName", { value: workflowState.data.fullName || "" })}
          ${textField("Account Number", "accountNumber", { pattern: "[0-9]{9,18}", help: "Digits only (9-18 numbers)", digitsOnly: true })}
          ${textField("IFSC Code", "ifscCode", { pattern: "[A-Z]{4}0[A-Z0-9]{6}" })}
          ${textField("Branch Name", "branchName")}
          ${textField("UPI ID", "upiId", { required: false, optional: true })}
        </div>
      `)}
      ${section("Asset Assignment", "Optionally allocate equipment issued during onboarding.", `
        <div class="asset-editor" id="assetEditor">
          ${workflowState.assets.length ? workflowState.assets.map(assetRow).join("") : `<div class="empty-state"><i data-lucide="laptop"></i><strong>No assets assigned</strong><span>Allocated equipment will appear here.</span></div>`}
          <button class="secondary-button" type="button" data-workflow-action="add-asset" style="margin-top:12px;"><i data-lucide="plus"></i>Add Asset</button>
        </div>
      `)}
    </form>`;
  }
  
  // Step 3: Documents, Onboarding Link checkbox, and Review Summary
  const summaryHtml = renderOnboardSummary();
  return `<form id="workflowForm">
    ${section("Government Documents", "Secure identity cards, resume, and educational files.", `
      <div class="workflow-grid">
        ${textField("Aadhaar Number", "aadhaarNumber", { pattern: "[0-9]{12}", help: "12 digits", digitsOnly: true })}
        ${textField("PAN Number", "panNumber", { pattern: "[A-Z]{5}[0-9]{4}[A-Z]", help: "5 letters, 4 digits, then 1 letter" })}
        ${uploadField("Aadhaar Card File", "aadhaarUpload", "application/pdf,image/png,image/jpeg")}
        ${uploadField("PAN Card File", "panUpload", "application/pdf,image/png,image/jpeg")}
        ${uploadField("Resume File", "resumeUpload", "application/pdf,.doc,.docx")}
        ${uploadField("Educational Certificates", "educationUpload", "application/pdf,image/png,image/jpeg", false)}
      </div>
      <div style="margin-top:20px; border-top:1px solid var(--line); padding-top:20px;">
        ${checkboxField("Send account credentials & password setup link to official email address upon completion", "sendOnboardingEmail")}
      </div>
    `)}
  </form>
  ${section("Onboarding Summary Review", "Please verify all sections before creating the profile.", summaryHtml)}`;
}

function assetRow(asset, index) {
  const types = ["Laptop", "Monitor", "Keyboard", "Mouse", "Headphones", "ID Card", "Office Access Card / RFID", "Charger", "Other"];
  return `<div class="asset-row" data-asset-index="${index}">
    ${selectFieldInline("Asset", "assetType", types, asset.assetType)}${inputInline("Asset ID", "assetId", asset.assetId, true)}${inputInline("Serial Number", "serialNumber", asset.serialNumber, true)}${inputInline("Notes", "notes", asset.notes, true, "asset-notes")}
    <button class="icon-button" type="button" data-workflow-action="remove-asset" data-index="${index}" aria-label="Remove asset"><i data-lucide="trash-2"></i></button>
  </div>`;
}

function inputInline(label, name, value = "", optional = false, className = "") {
  return `<label class="field ${className}">${label}${optional ? " <small>(optional)</small>" : ""}<input name="${name}" value="${escapeAttr(value || "")}" ${optional ? "" : "required"}></label>`;
}
function selectFieldInline(label, name, values, current) {
  return `<label class="field">${label}<select name="${name}" required>${values.map((value) => `<option ${value === current ? "selected" : ""}>${value}</option>`).join("")}</select></label>`;
}

function renderOnboardSummary() {
  const blocks = [
    ["Personal & Emergency", 0, [["Name", "fullName"], ["DOB", "dateOfBirth"], ["Mobile", "mobileNumber"], ["Personal Email", "personalEmail"], ["Emergency Contact", "emergencyContactName"]]],
    ["Employment & Salary", 1, [["Employee ID", "employeeId"], ["Official Email", "officialEmail"], ["Department", "department"], ["Designation", "designation"], ["Type of access", "role"], ["Monthly CTC", "monthlyCtc"]]],
    ["Bank & Assets", 2, [["Bank Name", "bankName"], ["Account Number", "accountNumber"], ["IFSC Code", "ifscCode"], ["Assigned Assets", "__assets"]]],
    ["Documents Info", 3, [["Aadhaar Number", "aadhaarNumber"], ["PAN Number", "panNumber"]]]
  ];
  const editBtn = (step) => workflowState.options.viewOnly ? "" : `<button class="text-button" type="button" data-workflow-action="edit-step" data-step="${step}">Edit</button>`;
  return `<div class="summary-grid">${blocks.map(([title, step, rows]) => `<div class="summary-block"><div class="panel-head"><h4>${title}</h4>${editBtn(step)}</div><div class="summary-list">${rows.map(([label, key]) => `<div><span>${label}</span><strong>${key === "__assets" ? (workflowState.assets || []).length : safeValue(key)}</strong></div>`).join("")}</div></div>`).join("")}</div>`;
}

function renderDepartmentStep() {
  const step = workflowState.step;
  const editing = !!workflowState.options.departmentId;
  if (step === 0) return section("Basic Details", "Define a unique department identity and reporting position.", `<form id="workflowForm" class="workflow-grid">
    ${textField("Department Name", "departmentName")}${textField("Department Code", "departmentCode", { pattern: "[A-Z0-9-]{2,20}", help: "Auto-generated, uppercase and unique" })}
    ${textareaField("Description", "departmentDescription")}${selectField("Parent Department", "parentDepartment", ["None", ...appState.departments.filter((item) => item.id !== workflowState.options.departmentId).map((item) => item.name)], { required: false, optional: true })}
    ${selectField("Status", "departmentStatus", ["Active", "Inactive", "Draft"])}${textField("Department Email", "departmentEmail", { type: "email", required: false, optional: true })}
    ${textField("Office Location", "officeLocation", { required: false, optional: true })}${textField("Cost Center Code", "costCenterCode", { required: false, optional: true })}
    ${editing ? `<div class="full-span">${checkboxField("Confirm Department Code change when active employee records use this department", "confirmDepartmentCodeChange")}</div>` : ""}
  </form>`);
  if (step === 1) return section("Ownership & Policies", "Choose active employees who own approvals and reviews.", `<form id="workflowForm" class="workflow-grid">
    ${employeeLookupField("Department Head", "departmentHead", { required: false, optional: true })}
    ${employeeLookupField("Leave Approval Owner", "leaveApprovalOwner", { required: false, optional: true })}
    ${employeeLookupField("Attendance Reviewer", "attendanceReviewer", { required: false, optional: true })}
    ${employeeLookupField("Payroll Reviewer", "payrollReviewer", { required: false, optional: true })}
    ${selectField("Working Shift", "workingShift", ["Day Shift", "Night Shift", "Custom"])}${selectField("Weekly Off Pattern", "weeklyOffPattern", ["Saturday, Sunday", "Sunday", "Rotational", "Custom"])}
    ${employeeLookupField("Help Desk Category Owner", "helpDeskOwner", { required: false, optional: true })}
    ${textareaField("Notes", "departmentNotes", { required: false, optional: true })}
  </form>`);
  return section("Review & Create", `Confirm the ${editing ? "updated" : "new"} department configuration.`, `<div class="summary-grid">
    ${summaryBlock("Basic Details", [["Name", "departmentName"], ["Code", "departmentCode"], ["Parent", "parentDepartment"], ["Status", "departmentStatus"], ["Location", "officeLocation"]])}
    ${summaryBlock("Ownership & Policies", [["Department Head", "departmentHead"], ["Leave Owner", "leaveApprovalOwner"], ["Attendance", "attendanceReviewer"], ["Payroll", "payrollReviewer"], ["Shift", "workingShift"], ["Weekly Off", "weeklyOffPattern"]])}
    ${editing && !workflowState.options.viewOnly ? `<div class="summary-block full-span"><h4>Department controls</h4><div class="inline-group">${appState.backendPermissions.includes("DEPARTMENT_ARCHIVE") ? `<button class="secondary-button" type="button" data-workflow-action="archive-department">Archive Department</button>` : ""}${appState.backendPermissions.includes("DEPARTMENT_DELETE") ? `<button class="danger-button" type="button" data-workflow-action="delete-department">Delete Department</button>` : ""}</div><p class="muted" style="margin:10px 0 0">Departments with active employees cannot be deleted and must be archived.</p></div>` : ""}
  </div>`);
}

function renderPayrollStep() {
  if (workflowState.step === 0) return section("Payroll Period & Filters", "Choose the cycle, employees and data sources for this payroll run.", `<form id="workflowForm" class="workflow-grid three">
    ${selectField("Payroll Month", "payrollMonth", Array.from({ length: 12 }, (_, index) => ({ value: String(index + 1), label: new Date(2026, index).toLocaleString("en-IN", { month: "long" }) })))}
    ${textField("Payroll Year", "payrollYear", { type: "number", min: "2024" })}${textField("Salary Payment Date", "paymentDate", { type: "date" })}
    ${textField("Cycle Start Date", "cycleStart", { type: "date" })}${textField("Cycle End Date", "cycleEnd", { type: "date" })}
    ${selectField("Department", "department", ["All departments", ...appState.departments.filter((item) => item.status === "Active").map((item) => item.name)])}
    ${selectField("Employees", "employeeFilter", ["All employees", "Selected employees"])}
    <label class="field full-span">Selected employees <small>(used when selected employees is chosen)</small>
      <select name="selectedEmployeeIds" multiple size="${Math.min(5, Math.max(2, employees.filter((item) => item.status === "Active").length))}">
        ${employees.filter((item) => item.status === "Active" && item.backendId).map((item) => `<option value="${item.backendId}" ${(workflowState.data.selectedEmployeeIds || []).map(String).includes(String(item.backendId)) ? "selected" : ""}>${escapeHtml(item.name)} - ${escapeHtml(item.id)}</option>`).join("")}
      </select>
    </label>
    <div class="full-span inline-group">${checkboxField("Include Attendance Data", "includeAttendance")}${checkboxField("Include LWP Deductions", "includeLwp")}${checkboxField("Include Late Deductions", "includeLateDeductions")}${checkboxField("Include Overtime Pay", "includeOvertime")}${checkboxField("Include Manual Deductions", "includeManualDeductions")}</div>
    ${textareaField("Notes", "payrollNotes", { required: false, optional: true })}
  </form>`);
  const rows = payrollPreviewRows();
  if (workflowState.step === 1) return section("Employee Payroll Preview", "Review calculated values and edit adjustments before finalizing.", `<div class="workflow-alert" style="border-color:var(--line-strong);background:var(--panel-soft)"><i data-lucide="info"></i><span>Preview generated from attendance, LWP, overtime and employee salary structures. Finalization remains locked until this preview is reviewed.</span></div>
    <div class="table-wrap"><table><thead><tr><th>Employee</th><th>Basic</th><th>HRA</th><th>Special</th><th>Overtime</th><th>LWP</th><th>Late Deduct</th><th>Manual</th><th>Gross</th><th>Net</th><th>Status</th></tr></thead><tbody>${rows.map((row, index) => `<tr><td><strong>${row.employee}</strong></td><td>${money(row.basic)}</td><td>${money(row.hra)}</td><td>${money(row.special)}</td><td><input class="table-input" type="number" min="0" value="${row.overtime}" data-payroll-index="${index}" data-payroll-field="overtime"></td><td><input class="table-input" type="number" min="0" value="${row.lwp}" data-payroll-index="${index}" data-payroll-field="lwp"></td><td><strong>${money(row.lateDeduction)}</strong></td><td><input class="table-input" type="number" min="0" value="${row.manual}" data-payroll-index="${index}" data-payroll-field="manual"></td><td>${money(row.gross)}</td><td>${money(row.net)}</td><td>${badge("Preview", "warning")}</td></tr>`).join("")}</tbody></table></div>`);
  const total = rows.reduce((sum, row) => sum + row.net, 0);
  return section("Finalize Payroll", "Finalized payroll becomes locked. Only Super Admin can unlock it.", `<div class="summary-grid">
    ${summaryBlock("Payroll Cycle", [["Month", "payrollMonth"], ["Year", "payrollYear"], ["Cycle Start", "cycleStart"], ["Cycle End", "cycleEnd"], ["Payment Date", "paymentDate"]])}
    <div class="summary-block"><h4>Final Summary</h4><div class="summary-list"><div><span>Employees</span><strong>${rows.length}</strong></div><div><span>Department</span><strong>${safeValue("department")}</strong></div><div><span>Net payroll</span><strong>${money(total)}</strong></div><div><span>Status</span><strong>Ready to finalize</strong></div></div></div>
  </div>`);
}

function payrollPreviewRows() {
  // Preview values are populated only by the authenticated backend response.
  return Array.isArray(workflowState.data.payrollRows) ? workflowState.data.payrollRows : [];
}

function renderDocumentStep() {
  const types = ["Appointment Letter", "Experience Letter", "Promotion Letter", "Salary Revision Letter", "Warning Letter", "Termination Letter", "Internship Certificate", "Salary Slip", "Custom Template"];
  const templateOptions = [
    { value: "Digi Rathi Standard Letterhead", label: "Digi Rathi Standard Letterhead" },
    { value: "Employment Letter v2", label: "Employment Letter v2" },
    { value: "Performance & Revision", label: "Performance & Revision" },
    ...appState.documentTemplates.map((item) => ({ value: `DOCX:${item.id}`, label: `${item.name} (DOCX v${item.version})` }))
  ];
  if (workflowState.step === 0 && !linkedEmployees().length) return section("Document Setup", "Create an employee profile before generating a document.", `<div class="empty-state compact"><i data-lucide="user-round-x"></i><h3>No employee profiles available</h3><p>Documents can only be generated for employees stored in the secured HRMS database.</p>${appState.backendPermissions.includes("EMPLOYEE_CREATE") ? `<button class="primary-button" type="button" data-workflow-action="start-onboard"><i data-lucide="user-plus"></i>Employee Onboard</button>` : ""}</div>`);
  if (workflowState.step === 0) return section("Document Setup", "Select the employee, template and delivery options.", `<form id="workflowForm" class="workflow-grid">
    ${selectField("Document Type", "documentType", types)}${selectField("Select Employee", "employee", linkedEmployees().map((item) => `${item.name} (${item.id})`))}
    ${selectField("Select Template", "template", templateOptions)}${textField("Issue Date", "issueDate", { type: "date" })}
    ${textField("Effective Date", "effectiveDate", { type: "date", required: false, optional: true })}${textField("Authorized Signatory", "signatory")}
    <div class="full-span inline-group">${checkboxField("Email to Employee", "emailToEmployee")}${checkboxField("Save to Employee Profile", "saveToProfile")}</div>
    ${textareaField("Notes / Custom Message", "documentNotes", { required: false, optional: true })}
    <div class="template-upload full-span">
      <div><strong>Upload a DOCX template</strong><span>Use the supported placeholders in a Microsoft Word document.</span></div>
      <input type="text" name="templateUploadName" placeholder="Template name" aria-label="Template name" />
      <label class="upload-field compact">Choose DOCX<input type="file" id="documentTemplateFile" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" /></label>
      <button class="secondary-button" type="button" data-workflow-action="upload-template"><i data-lucide="upload"></i>Upload</button>
    </div>
  </form>`);
  if (workflowState.step === 1) {
    if (!workflowState.data.documentContent) workflowState.data.documentContent = defaultDocumentContent();
    return section("Preview & Edit", "Placeholders are filled from the employee profile. Edit the content before finalizing.", `<div class="workflow-alert" style="border-color:var(--line-strong);background:var(--panel-soft)"><i data-lucide="braces"></i><span>Supported DOCX placeholders include {{EmployeeName}}, {{EmployeeID}}, {{Department}}, {{Designation}}, {{JoiningDate}}, {{CurrentDate}}, {{Salary}}, {{CompanyName}} and {{HRName}}.</span></div><form id="workflowForm" class="workflow-grid"><label class="field full-span">Generated Content<textarea name="documentContent" rows="13" required>${escapeHtml(workflowState.data.documentContent)}</textarea></label></form>`);
  }
  const sensitive = ["Warning Letter", "Termination Letter"].includes(workflowState.data.documentType);
  return section("Generate & Share", "Confirm versioning, profile storage and email delivery.", `<div class="summary-grid">
    ${summaryBlock("Document", [["Type", "documentType"], ["Employee", "employee"], ["Template", "__documentTemplate"], ["Issue Date", "issueDate"], ["Signatory", "signatory"]])}
    <div class="summary-block"><h4>Delivery</h4><div class="summary-list"><div><span>Save to profile</span><strong>${workflowState.data.saveToProfile ? "Yes" : "No"}</strong></div><div><span>Email employee</span><strong>${workflowState.data.emailToEmployee ? "Yes" : "No"}</strong></div><div><span>Version</span><strong>New version</strong></div><div><span>Visibility</span><strong>${sensitive ? "Draft until finalized and shared" : "Visible after generation"}</strong></div></div></div>
  </div>`);
}

function renderLeaveCalendar() {
  const views = ["month", "week", "list"];
  return section("Leave Calendar", "Visibility follows your role and reporting hierarchy.", `<div class="calendar-toolbar">
    <div class="calendar-tabs">${views.map((view) => `<button class="secondary-button ${workflowState.calendarView === view ? "is-active" : ""}" type="button" data-calendar-view="${view}">${capitalize(view)}</button>`).join("")}</div>
    <span style="flex:1"></span><button class="primary-button" type="button" data-workflow-action="apply-leave"><i data-lucide="calendar-plus"></i>Apply Leave</button><button class="secondary-button" type="button" data-workflow-action="export-calendar"><i data-lucide="download"></i>Export Calendar</button>
  </div><form id="workflowForm" class="workflow-grid three" style="margin-top:14px">
    ${textField("Start Date", "calendarStart", { type: "date" })}${textField("End Date", "calendarEnd", { type: "date" })}${selectField("Department", "calendarDepartment", roleCalendarDepartments(), { required: false })}
    ${selectField("Employee", "calendarEmployee", roleCalendarEmployees(), { required: false })}${selectField("Leave Type", "calendarLeaveType", ["All leave types", "Casual Leave", "Privilege Leave", "Sick Leave", "WFH", "Half Day", "Comp Off", "Birthday Leave", ...(["Super Admin", "HR Admin", "Employee"].includes(appState.role) ? ["Period Leave"] : [])], { required: false })}
    ${selectField("Status", "calendarStatus", ["All statuses", "Approved", "Pending", ...(appState.role === "Super Admin" || appState.role === "HR Admin" ? ["Rejected"] : [])], { required: false })}
    <div class="full-span inline-group">${checkboxField("Show WFH", "calendarShowWfh")}${checkboxField("Show Holidays", "calendarShowHolidays")}${["Super Admin", "HR Admin"].includes(appState.role) ? checkboxField("My team only", "calendarMyTeam") : ""}</div>
  </form>${calendarContent()}${leaveDetailPanel()}`);
}

function calendarContent() {
  if (workflowState.calendarLoading) return `<div class="workflow-loading compact"><span class="loading-mark"><i data-lucide="loader-circle"></i></span><h3>Loading calendar</h3><p class="muted">Applying your role and reporting scope.</p></div>`;
  const response = workflowState.calendarData || { events: [], holidays: [], wfh: [] };
  const selectedType = workflowState.data.calendarLeaveType || "All leave types";
  const selectedStatus = workflowState.data.calendarStatus || "All statuses";
  const selectedDepartment = workflowState.data.calendarDepartment || "All departments";
  const selectedEmployee = workflowState.data.calendarEmployee || "All employees";
  const leaveEvents = response.events.filter((event) =>
    (selectedType === "All leave types" || normalizeCode(selectedType) === normalizeCode(event.leaveType)) &&
    (selectedStatus === "All statuses" || selectedStatus.toUpperCase() === event.status) &&
    (selectedDepartment === "All departments" || selectedDepartment === event.department) &&
    (["All employees", "My team"].includes(selectedEmployee) || selectedEmployee === event.employee) &&
    (!workflowState.data.calendarMyTeam || event.reportingManagerEmployeeId === appState.backendUser.employeeId) &&
    (workflowState.data.calendarShowWfh || event.leaveType !== "WFH"));
  const events = leaveEvents.flatMap((event) => dateRange(event.startDate, event.endDate).map((date) => ({
    id: event.id, date, day: Number(date.slice(-2)), label: `${event.employee} - ${humanizeCode(event.leaveType)}`,
    type: event.status === "PENDING" ? "pending" : event.status === "REJECTED" ? "rejected" : "", detail: event
  })));
  if (workflowState.data.calendarShowWfh && ["All leave types", "WFH"].includes(selectedType)) {
    (response.wfh || []).filter((event) =>
      (selectedStatus === "All statuses" || selectedStatus.toUpperCase() === event.status) &&
      (selectedDepartment === "All departments" || selectedDepartment === event.department) &&
      (["All employees", "My team"].includes(selectedEmployee) || selectedEmployee === event.employee) &&
      (!workflowState.data.calendarMyTeam || event.reportingManagerEmployeeId === appState.backendUser.employeeId))
      .forEach((event) => events.push({ id: `wfh-${event.id}`, date: event.date, day: Number(event.date.slice(-2)),
        label: `${event.employee} - WFH`, type: "wfh", detail: { ...event, eventType: "WFH" } }));
  }
  if (workflowState.data.calendarShowHolidays) response.holidays.forEach((holiday) => events.push({
    id: `holiday-${holiday.id}`, date: holiday.date, day: Number(holiday.date.slice(-2)), label: holiday.name, type: "holiday", detail: holiday
  }));
  events.sort((a, b) => a.date.localeCompare(b.date));
  if (!events.length) return `<div class="empty-state compact"><i data-lucide="calendar-x"></i><h3>No calendar events</h3><p>No leave or holidays match the current filters.</p></div>`;
  if (workflowState.calendarView === "list") return `<div class="mini-list" style="margin-top:16px">${events.map((item) => `<button class="mini-item" type="button" data-workflow-action="leave-detail" data-leave-id="${item.id}"><time><strong>${String(item.day).padStart(2, "0")}</strong><span>${new Date(`${item.date}T00:00:00`).toLocaleString("en-IN", { month: "short" })}</span></time><div><strong>${escapeHtml(item.label)}</strong><span class="muted">${item.type === "holiday" ? "Company holiday" : humanizeCode(item.detail.status)}</span></div><i data-lucide="chevron-right"></i></button>`).join("")}</div>`;
  const allDates = dateRange(workflowState.data.calendarStart, workflowState.data.calendarEnd);
  const dates = workflowState.calendarView === "week" ? allDates.slice(0, 7) : allDates;
  return `<div class="calendar-grid">${dates.map((date) => `<div class="calendar-day"><strong>${new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</strong>${events.filter((event) => event.date === date).map((event) => `<button class="calendar-event ${event.type}" type="button" data-workflow-action="leave-detail" data-leave-id="${event.id}">${escapeHtml(event.label)}</button>`).join("")}</div>`).join("")}</div>`;
}

async function loadLeaveCalendarData() {
  const start = workflowState.data.calendarStart;
  const end = workflowState.data.calendarEnd;
  if (!start || !end || end < start) { workflowState.calendarLoading = false; workflowState.validationMessage = "Choose a valid calendar date range."; renderWorkflow(); return; }
  try {
    const response = await apiRequest(`/api/v1/leave/calendar?start=${start}&end=${end}`);
    if (!workflowState || workflowState.type !== "leaveCalendar") return;
    workflowState.calendarData = response;
    workflowState.calendarLoading = false;
    renderWorkflow();
  } catch (error) {
    if (!workflowState || workflowState.type !== "leaveCalendar") return;
    workflowState.calendarLoading = false;
    workflowState.validationMessage = error.message;
    renderWorkflow();
  }
}

function dateRange(start, end) {
  const values = [];
  for (let date = new Date(`${start}T00:00:00`), last = new Date(`${end}T00:00:00`); date <= last; date.setDate(date.getDate() + 1)) {
    values.push(date.toISOString().slice(0, 10));
  }
  return values;
}

function humanizeCode(value) {
  return String(value || "").toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeCode(value) {
  return String(value || "").trim().toUpperCase().replaceAll(" ", "_");
}

function leaveDetailPanel() {
  const event = workflowState.leaveDetail;
  if (!event) return "";
  if (event.eventType === "WFH") return `<aside class="leave-detail-panel"><div class="panel-head"><div><p class="eyebrow">Work from home</p><h3>${escapeHtml(event.employee)}</h3></div><button class="icon-button" type="button" data-workflow-action="close-leave-detail" aria-label="Close details"><i data-lucide="x"></i></button></div><div class="summary-list"><div><span>Date</span><strong>${escapeHtml(event.date)}</strong></div><div><span>Department</span><strong>${escapeHtml(event.department || "-")}</strong></div><div><span>Status</span><strong>${escapeHtml(humanizeCode(event.status))}</strong></div><div><span>Clock in</span><strong>${event.checkInAt ? new Date(event.checkInAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "-"}</strong></div><div><span>Clock out</span><strong>${event.checkOutAt ? new Date(event.checkOutAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "Active"}</strong></div></div></aside>`;
  if (!event.leaveType) return `<aside class="leave-detail-panel"><div class="panel-head"><div><p class="eyebrow">Company holiday</p><h3>${escapeHtml(event.name)}</h3></div><button class="icon-button" type="button" data-workflow-action="close-leave-detail" aria-label="Close details"><i data-lucide="x"></i></button></div><div class="summary-list"><div><span>Date</span><strong>${escapeHtml(event.date)}</strong></div><div><span>Type</span><strong>${escapeHtml(humanizeCode(event.type))}</strong></div></div></aside>`;
  const own = event.employeeId === appState.backendUser.employeeId;
  const canApprove = canAdministerEmployee(event) && ["LEAVE_APPROVE", "LEAVE_APPROVE_ALL"].some((permission) => appState.backendPermissions.includes(permission)) && event.status === "PENDING";
  return `<aside class="leave-detail-panel"><div class="panel-head"><div><p class="eyebrow">Leave details</p><h3>${escapeHtml(event.employee)}</h3></div><button class="icon-button" type="button" data-workflow-action="close-leave-detail" aria-label="Close details"><i data-lucide="x"></i></button></div>
    ${event.conflict ? `<div class="workflow-alert"><i data-lucide="users"></i><span>Another team member has overlapping leave.</span></div>` : ""}
    <div class="summary-list"><div><span>Leave type</span><strong>${escapeHtml(humanizeCode(event.leaveType))}</strong></div><div><span>Dates</span><strong>${event.startDate} to ${event.endDate}</strong></div><div><span>Duration</span><strong>${event.duration} day(s)</strong></div><div><span>Half-day</span><strong>${event.halfDay ? "Yes" : "No"}</strong></div><div><span>Reason</span><strong>${escapeHtml(event.reason)}</strong></div><div><span>Status</span><strong>${escapeHtml(humanizeCode(event.status))}</strong></div><div><span>Approver</span><strong>${escapeHtml(event.approver || "Pending")}</strong></div><div><span>Submitted</span><strong>${new Date(event.submittedAt).toLocaleString("en-IN")}</strong></div><div><span>Decision notes</span><strong>${escapeHtml(event.decisionNotes || "-")}</strong></div></div>
    <div class="audit-timeline"><span></span><div><strong>Request submitted</strong><small>${new Date(event.submittedAt).toLocaleString("en-IN")}</small></div>${event.status !== "PENDING" ? `<span></span><div><strong>${escapeHtml(humanizeCode(event.status))}</strong><small>${escapeHtml(event.decisionNotes || "Decision recorded")}</small></div>` : ""}</div>
    <div class="inline-group">${canApprove ? `<button class="primary-button" type="button" data-workflow-action="decide-leave" data-decision="APPROVED">Approve</button><button class="danger-button" type="button" data-workflow-action="decide-leave" data-decision="REJECTED">Reject</button>` : ""}${own && event.status !== "CANCELLED" ? `<button class="secondary-button" type="button" data-workflow-action="cancel-leave">Cancel Leave</button>` : ""}</div>
  </aside>`;
}

function renderReportLivePreview() {
  const type = workflowState.data.reportType || "EMPLOYEE_REPORT";
  const format = workflowState.data.format || "PDF";
  const start = workflowState.data.startDate || "";
  const end = workflowState.data.endDate || "";
  
  const headersMap = {
    "EMPLOYEE_REPORT": ["ID", "Name", "Department", "Role", "Status"],
    "ATTENDANCE_REPORT": ["Date", "Employee", "Clock In", "Clock Out", "Status"],
    "LEAVE_REPORT": ["Employee", "Leave Type", "Start Date", "End Date", "Status"],
    "PAYROLL_REPORT": ["Employee", "Month/Year", "Basic", "Deductions", "Net Salary"],
    "ASSET_REPORT": ["Asset", "Asset ID", "Assigned To", "Assigned Date", "Status"],
    "PERFORMANCE_REPORT": ["Employee", "Period", "Rating", "Reviewer", "Status"],
    "HELP_DESK_REPORT": ["ID", "Subject", "Category", "Priority", "Status"],
    "DOCUMENT_REPORT": ["Document Type", "Employee", "Date", "Format", "Status"]
  };
  
  const emptyReportRows = {
    "EMPLOYEE_REPORT": [],
    "ATTENDANCE_REPORT": [],
    "LEAVE_REPORT": [],
    "PAYROLL_REPORT": [],
    "ASSET_REPORT": [],
    "PERFORMANCE_REPORT": [],
    "HELP_DESK_REPORT": [],
    "DOCUMENT_REPORT": []
  };

  const headers = headersMap[type] || headersMap["EMPLOYEE_REPORT"];
  const rows = emptyReportRows[type] || emptyReportRows["EMPLOYEE_REPORT"];
  
  return `
    <div class="summary-block" style="flex: 1; display: flex; flex-direction: column;">
      <div class="panel-head" style="margin-bottom: 12px;">
        <h4>Live Export Preview</h4>
        <span class="status success" style="text-transform: uppercase; font-size: 0.7rem; font-weight: 600;">${format} Format</span>
      </div>
      <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; font-size: 0.8rem; margin-bottom: 12px; border: 1px dashed var(--line);">
        <div><strong>Range:</strong> ${start || "Any"} to ${end || "Any"}</div>
        <div><strong>Scope:</strong> ${safeValue("department")} · ${safeValue("employee")}</div>
      </div>
      <div class="table-wrap" style="flex: 1; max-height: 180px; overflow-y: auto;">
        <table style="font-size: 0.8rem;">
          <thead>
            <tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      </div>
      <div style="margin-top: 12px; font-size: 0.78rem; color: var(--muted-text); text-align: center;">
        Showing top mock results matching active filters.
      </div>
    </div>
  `;
}

function renderReportStep() {
  const formatOptions = ["PDF", "Excel", "CSV", "Print"];
  
  const formContent = `
    <form id="workflowForm" class="workflow-grid">
      <div class="full-span">
        ${selectField("Report Category", "reportType", allowedReportTypes().map((type) => ({ value: type, label: humanizeStatus(type) })))}
      </div>
      ${textField("Start Date", "startDate", { type: "date" })}
      ${textField("End Date", "endDate", { type: "date" })}
      ${selectField("Department", "department", roleCalendarDepartments())}
      ${selectField("Employee Scope", "employee", roleCalendarEmployees())}
      ${selectField("File Format", "format", formatOptions)}
      ${textField("File Name", "fileName", { placeholder: "e.g. employee-report" })}
      <div class="full-span" style="display: flex; gap: 24px; align-items: center; margin-top: 8px; flex-wrap: wrap;">
        ${checkboxField("Include Summary Charts", "includeSummaryCharts")}
        ${checkboxField("Include Employee Details", "includeEmployeeDetails")}
        ${appState.role === "Super Admin" ? checkboxField("Include Audit Trail", "includeAuditTrail") : ""}
      </div>
    </form>
  `;

  return section("Export Parameters", "Filter and structure data rows before generating the export file.", formContent);
}

function bindWorkflowEvents() {
  const root = document.querySelector("#workflowContent");
  root.querySelectorAll("[data-workflow-action]").forEach((button) => button.addEventListener("click", () => handleWorkflowAction(button.dataset.workflowAction, button)));
  root.querySelectorAll("[data-calendar-view]").forEach((button) => button.addEventListener("click", () => { collectWorkflowData(false); workflowState.calendarView = button.dataset.calendarView; renderWorkflow(); }));
  root.querySelectorAll("[data-file-field]").forEach((input) => input.addEventListener("change", () => {
    const file = input.files?.[0] || null;
    workflowState.files[input.dataset.fileField] = file;
    if (file) delete workflowState.uploadTokens[input.dataset.fileField];
    workflowState.data[input.dataset.fileField] = file?.name || "";
    const span = input.parentElement.querySelector("span"); if (span) span.textContent = workflowState.data[input.dataset.fileField] || "Choose a secure file";
  }));
  root.querySelector("input[name='departmentName']")?.addEventListener("input", (event) => {
    const code = root.querySelector("input[name='departmentCode']");
    if (code && (!code.value || code.dataset.auto !== "false")) { code.value = departmentCode(event.target.value); code.dataset.auto = "true"; }
  });
  root.querySelector("input[name='departmentCode']")?.addEventListener("input", (event) => { event.target.value = event.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""); event.target.dataset.auto = "false"; });
  root.querySelector("select[name='department']")?.addEventListener("change", (event) => {
    if (workflowState.type === "onboard" && event.target.value === "__new__") {
      collectWorkflowData(false); appState.onboardingDraft = { data: structuredClone(workflowState.data), assets: structuredClone(workflowState.assets) };
      document.querySelector("#workflowModal").close(); openWorkflow("department", { returnTo: "onboard" });
    }
  });
  root.querySelectorAll("[data-payroll-field]").forEach((input) => input.addEventListener("change", () => updatePayrollAdjustment(input)));
  if (workflowState.type === "leaveCalendar") root.querySelector("#workflowForm")?.addEventListener("change", (event) => {
    collectWorkflowData(false);
    if (["calendarStart", "calendarEnd"].includes(event.target.name)) {
      workflowState.calendarLoading = true; renderWorkflow(); loadLeaveCalendarData();
    } else renderWorkflow();
  });
  if (workflowState.type === "report") root.querySelector("#workflowForm")?.addEventListener("change", () => {
    collectWorkflowData(false);
    renderWorkflow();
  });
  if (workflowState.type === "onboard" && workflowState.step === 1) {
    const calc = () => {
      const basic = Number(root.querySelector("input[name='basicSalary']")?.value || 0);
      const hra = Number(root.querySelector("input[name='hra']")?.value || 0);
      const allowance = Number(root.querySelector("input[name='specialAllowance']")?.value || 0);
      const other = Number(root.querySelector("input[name='otherEarnings']")?.value || 0);
      const deduct = Number(root.querySelector("input[name='manualDeductions']")?.value || 0);
      const ctc = root.querySelector("input[name='monthlyCtc']");
      if (ctc) ctc.value = basic + hra + allowance + other - deduct;
    };
    root.querySelectorAll("input[name='basicSalary'], input[name='hra'], input[name='specialAllowance'], input[name='otherEarnings'], input[name='manualDeductions']").forEach((input) => {
      input.addEventListener("input", calc);
    });

    const shiftHandler = () => {
      const startH = root.querySelector("select[name='shiftStartHour']")?.value || "09";
      const startM = root.querySelector("select[name='shiftStartMin']")?.value || "00";
      const startA = root.querySelector("select[name='shiftStartAmpm']")?.value || "AM";
      const endH = root.querySelector("select[name='shiftEndHour']")?.value || "06";
      const endM = root.querySelector("select[name='shiftEndMin']")?.value || "00";
      const endA = root.querySelector("select[name='shiftEndAmpm']")?.value || "PM";

      const combined = `${startH}:${startM} ${startA} - ${endH}:${endM} ${endA}`;
      const hiddenInput = root.querySelector("input[name='shift']");
      if (hiddenInput) hiddenInput.value = combined;
      workflowState.data.shift = combined;

      const duration = calculateShiftDuration(startH, startM, startA, endH, endM, endA);
      const badgeContainer = root.querySelector("#shiftDurationBadge");
      if (badgeContainer) {
        if (duration.totalMins === 540) {
          badgeContainer.innerHTML = `<span class="status success" style="padding: 4px 10px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 4px;"><i data-lucide="check-circle" style="width:14px;height:14px;"></i> Shift Duration: 9 Hours (Standard 9-hour logging time complete)</span>`;
        } else if (duration.totalMins < 540) {
          const diff = 540 - duration.totalMins;
          const diffH = Math.floor(diff / 60);
          const diffM = diff % 60;
          const diffText = diffH > 0 ? `${diffH}h ${diffM}m` : `${diffM} mins`;
          badgeContainer.innerHTML = `<span class="status warning" style="padding: 4px 10px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 4px;"><i data-lucide="clock" style="width:14px;height:14px;"></i> Shift Duration: ${duration.hours}h ${duration.mins}m (${diffText} short of standard 9-hour shift)</span>`;
        } else {
          const diff = duration.totalMins - 540;
          const diffH = Math.floor(diff / 60);
          const diffM = diff % 60;
          const diffText = diffH > 0 ? `${diffH}h ${diffM}m` : `${diffM} mins`;
          badgeContainer.innerHTML = `<span class="status success" style="padding: 4px 10px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 4px;"><i data-lucide="clock" style="width:14px;height:14px;"></i> Shift Duration: ${duration.hours}h ${duration.mins}m (${diffText} overtime included)</span>`;
        }
        refreshIcons();
      }
    };

    root.querySelectorAll("select[name='shiftStartHour'], select[name='shiftStartMin'], select[name='shiftStartAmpm'], select[name='shiftEndHour'], select[name='shiftEndMin'], select[name='shiftEndAmpm']").forEach((select) => {
      select.addEventListener("change", shiftHandler);
    });
  }
}

async function handleWorkflowAction(action, button) {
  if (action === "cancel") { document.querySelector("#workflowModal").close(); workflowState = null; return; }
  if (action === "back") { collectWorkflowData(false); workflowState.validationMessage = ""; workflowState.step -= 1;
    if (workflowState.type === "payroll" && workflowState.step === 0) workflowState.backendPayrollRun = null;
    renderWorkflow(); return; }
  if (action === "next") {
    if (!collectWorkflowData(true)) return;
    if (!customWorkflowValidation()) return;
    if (workflowState.type === "payroll" && workflowState.step === 0) { await preparePayrollPreview(); return; }
    if (workflowState.type === "document" && workflowState.step === 0) { await prepareDocumentPreview(); return; }
    if (workflowState.type === "report" && workflowState.step === 0) { await prepareReportPreview(); return; }
    if (workflowState.type === "payroll" && workflowState.step === 1) collectPayrollAdjustments();
    workflowState.validationMessage = ""; workflowState.step += 1; recordWorkflowAudit("STEP_COMPLETED"); renderWorkflow(); return;
  }
  if (action === "edit-step") { collectWorkflowData(false); workflowState.step = Number(button.dataset.step); renderWorkflow(); return; }
  if (action === "save-draft") { collectWorkflowData(false); await saveWorkflowDraft(button); return; }
  if (action === "add-asset") { collectWorkflowData(false); collectAssets(); workflowState.assets.push({ assetType: "Laptop", assetId: "", serialNumber: "", notes: "" }); renderWorkflow(); return; }
  if (action === "remove-asset") { collectWorkflowData(false); collectAssets(); workflowState.assets.splice(Number(button.dataset.index), 1); renderWorkflow(); return; }
  if (action === "add-holiday-entry") {
    const form = document.querySelector("#workflowForm");
    if (form && form.reportValidity()) {
      const date = form.querySelector("[name='date']").value;
      const name = form.querySelector("[name='name']").value;
      const type = form.querySelector("[name='type']").value;
      const idx = workflowState.data.editIndex;
      if (idx >= 0) {
        workflowState.data.holidays[idx] = { date, name, type };
        workflowState.data.editIndex = -1;
      } else {
        workflowState.data.holidays.push({ date, name, type });
      }
      workflowState.data.date = new Date().toISOString().slice(0, 10);
      workflowState.data.name = "";
      workflowState.data.type = "National";
      renderWorkflow();
    }
    return;
  }
  if (action === "edit-holiday-entry") {
    const idx = Number(button.dataset.index);
    const entry = workflowState.data.holidays[idx];
    if (entry) {
      workflowState.data.date = entry.date;
      workflowState.data.name = entry.name;
      workflowState.data.type = entry.type;
      workflowState.data.editIndex = idx;
      renderWorkflow();
    }
    return;
  }
  if (action === "delete-holiday-entry") {
    const idx = Number(button.dataset.index);
    workflowState.data.holidays.splice(idx, 1);
    renderWorkflow();
    return;
  }
  if (action === "submit") { if (collectWorkflowData(true) && customWorkflowValidation()) submitWorkflow(); return; }
  if (action === "apply-leave") { document.querySelector("#workflowModal").close(); openLeaveModal(); return; }
  if (action === "export-calendar") { collectWorkflowData(false); const startDate = workflowState.data.calendarStart; const endDate = workflowState.data.calendarEnd; document.querySelector("#workflowModal").close(); openWorkflow("report", { reportType: "LEAVE_REPORT", startDate, endDate }); return; }
  if (action === "leave-detail") { showLeaveDetail(button.dataset.leaveId); return; }
  if (action === "close-leave-detail") { workflowState.leaveDetail = null; renderWorkflow(); return; }
  if (action === "decide-leave") { await decideLeave(button.dataset.decision); return; }
  if (action === "cancel-leave") { await cancelLeave(); return; }
  if (action === "archive-department") { await archiveDepartment(); return; }
  if (action === "delete-department") { await deleteDepartment(); return; }
  if (action === "close-success") { document.querySelector("#workflowModal").close(); workflowState = null; return; }
  if (action === "return-onboard") { document.querySelector("#workflowModal").close(); openWorkflow("onboard"); return; }
  if (action === "start-onboard") { document.querySelector("#workflowModal").close(); openWorkflow("onboard"); return; }
  if (action === "generate-payslips") { await generatePayslips(); return; }
  if (action === "upload-template") { await uploadDocumentTemplate(button); return; }
}

function collectWorkflowData(validate) {
  const form = document.querySelector("#workflowForm");
  if (!form) { if (workflowState.type === "onboard" && workflowState.step === 5) collectAssets(); return true; }
  if (validate && !form.reportValidity()) { workflowState.validationMessage = "Complete all required fields before continuing."; return false; }
  [...form.elements].forEach((element) => {
    if (!element.name || element.type === "file") return;
    workflowState.data[element.name] = element.type === "checkbox" ? element.checked
      : element.multiple ? [...element.selectedOptions].map((option) => option.value) : element.value;
  });
  return true;
}

function collectAssets() {
  workflowState.assets = [...document.querySelectorAll(".asset-row")].map((row) => ({
    assetType: row.querySelector("[name='assetType']")?.value || "", assetId: row.querySelector("[name='assetId']")?.value || "",
    serialNumber: row.querySelector("[name='serialNumber']")?.value || "", notes: row.querySelector("[name='notes']")?.value || ""
  }));
}

function collectPayrollAdjustments() {
  document.querySelectorAll("[data-payroll-field]").forEach((input) => updatePayrollAdjustment(input));
}

async function preparePayrollPreview() {
  workflowState.loading = true;
  workflowState.validationMessage = "";
  renderWorkflow();
  try {
    let run = await apiRequest("/api/v1/payroll/generate", { method: "POST", body: JSON.stringify(payrollBackendPayload(workflowState.data)) });
    run = await apiRequest(`/api/v1/payroll/${run.id}/preview`, { method: "POST" });
    workflowState.backendPayrollRun = run;
    workflowState.data.payrollRows = run.items.map((item) => ({ backendItemId: item.id, employeeId: item.employeeId,
      employee: item.employee, basic: Number(item.basicSalary), hra: Number(item.hra), special: Number(item.specialAllowance),
      overtime: Number(item.overtimePay), lwp: Number(item.lwpDeduction), manual: Number(item.manualDeduction),
      gross: Number(item.grossSalary), net: Number(item.netSalary) }));
    workflowState.step = 1;
    recordWorkflowAudit("PAYROLL_PREVIEWED", { payrollRunId: run.id });
  } catch (error) {
    workflowState.validationMessage = error.message;
  } finally {
    workflowState.loading = false;
    renderWorkflow();
  }
}

async function prepareDocumentPreview() {
  workflowState.loading = true;
  workflowState.validationMessage = "";
  renderWorkflow();
  try {
    const preview = await apiRequest("/api/v1/documents/preview", { method: "POST",
      body: JSON.stringify(documentBackendPayload(workflowState.data)) });
    workflowState.data.documentContent = preview.renderedContent;
    workflowState.step = 1;
    recordWorkflowAudit("DOCUMENT_PREVIEWED", { employee: workflowState.data.employee });
  } catch (error) {
    workflowState.validationMessage = error.message;
  } finally {
    workflowState.loading = false;
    renderWorkflow();
  }
}

async function prepareReportPreview() {
  workflowState.loading = true;
  workflowState.validationMessage = "";
  renderWorkflow();
  try {
    workflowState.backendReportPreview = await apiRequest("/api/v1/reports/preview", { method: "POST",
      body: JSON.stringify(reportBackendPayload(workflowState.data)) });
    workflowState.step = 1;
    recordWorkflowAudit("REPORT_PREVIEWED", { estimatedRecords: workflowState.backendReportPreview.estimatedRecords });
  } catch (error) {
    workflowState.validationMessage = error.message;
  } finally {
    workflowState.loading = false;
    renderWorkflow();
  }
}

function customWorkflowValidation() {
  const data = workflowState.data;
  if (workflowState.type === "onboard" && workflowState.step === 2 && data.probationEndDate && data.probationEndDate < data.joiningDate) return workflowError("Probation end date cannot be before the joining date.");
  if (workflowState.type === "onboard" && workflowState.step === 6) {
    const earnings = Number(data.basicSalary || 0) + Number(data.hra || 0) + Number(data.specialAllowance || 0) + Number(data.otherEarnings || 0);
    if (Number(data.monthlyCtc) < earnings - Number(data.manualDeductions || 0)) return workflowError("Monthly CTC cannot be lower than calculated net earnings.");
  }
  if (workflowState.type === "department" && workflowState.step === 0) {
    const duplicate = appState.departments.find((item) => item.id !== workflowState.options.departmentId && (item.name.toLowerCase() === data.departmentName.toLowerCase() || item.code === data.departmentCode));
    if (duplicate) return workflowError("Department name and code must be unique.");
    if (data.parentDepartment === data.departmentName) return workflowError("A department cannot be its own parent.");
  }
  if (workflowState.type === "department" && workflowState.step === 1 && data.departmentStatus !== "Draft" && (!data.departmentHead || data.departmentHead.startsWith("Save without"))) return workflowError("Select an active Department Head or change the status to Draft.");
  if (["payroll", "report"].includes(workflowState.type) && workflowState.step === 0 && data.endDate && data.startDate && data.endDate < data.startDate) return workflowError("End date cannot be before start date.");
  if (workflowState.type === "payroll" && workflowState.step === 0 && data.cycleEnd < data.cycleStart) return workflowError("Payroll cycle end date cannot be before the start date.");
  return true;
}

function workflowError(message) { workflowState.validationMessage = message; renderWorkflow(); return false; }

async function saveWorkflowDraft(button) {
  const type = workflowState.type;
  const originalLabel = button.innerHTML;
  button.disabled = true;
  button.innerHTML = `<i data-lucide="loader-circle"></i>Saving`;
  refreshIcons();
  try {
    let backendReference = null;
    if (type === "department") {
      if (!workflowState.data.departmentName || !workflowState.data.departmentCode) throw new Error("Department name and code are required to save a draft.");
      const payload = departmentBackendPayload(workflowState.data); payload.status = "DRAFT";
      const method = workflowState.options.departmentId ? "PUT" : "POST";
      const path = workflowState.options.departmentId ? `/api/v1/departments/${workflowState.options.departmentId}` : "/api/v1/departments";
      backendReference = await apiRequest(path, { method, body: JSON.stringify(payload) });
      workflowState.options.departmentId = backendReference.id;
      upsertDepartment(backendReference);
    } else if (type === "payroll" && !workflowState.backendPayrollRun) {
      workflowState.backendPayrollRun = await apiRequest("/api/v1/payroll/generate", { method: "POST", body: JSON.stringify(payrollBackendPayload(workflowState.data)) });
      backendReference = workflowState.backendPayrollRun;
    } else if (type === "document") {
      backendReference = await apiRequest("/api/v1/documents?draft=true", { method: "POST", body: JSON.stringify(documentBackendPayload(workflowState.data)) });
    } else if (type === "onboard") {
      await uploadPendingOnboardingFiles();
    }
    const saved = { data: structuredClone(workflowState.data), assets: structuredClone(workflowState.assets),
      fileNames: Object.fromEntries(Object.entries(workflowState.files).map(([key, file]) => [key, file?.name || ""])),
      uploadTokens: structuredClone(workflowState.uploadTokens),
      backendReferenceId: backendReference?.id || workflowState.backendPayrollRun?.id || null };
    await apiRequest(`/api/v1/workflow-drafts/${type}`, { method: "PUT", body: JSON.stringify({ payload: saved }) });
    if (type === "onboard") appState.onboardingDraft = saved;
    recordWorkflowAudit("DRAFT_SAVED", { backendReferenceId: saved.backendReferenceId });
    showToast(`${workflowDefinitions[type].title} draft saved securely`);
  } catch (error) {
    workflowState.validationMessage = error.message;
    renderWorkflow();
    return;
  }
  button.disabled = false;
  button.innerHTML = originalLabel;
  refreshIcons();
}

function canSaveEmployeeWorkflow() {
  if(workflowState?.type!=='onboard')return true;
  const {options,data}=workflowState;
  if(options.viewOnly)return false;
  if(options.employeeId && !requireEmployeeAdministration(options.employeeId))return false;
  const target=options.employeeId?administrativeEmployee(options.employeeId):null;
  if(!HRDomain.canAssignAccess(appState.role,data.role,target?.role)){showToast('Choose Employee access, or ask Super Admin to assign HR Admin access.','danger');return false;}
  const duplicate=employees.find(p=>p.id===data.employeeId && String(p.backendId)!==String(options.employeeId));
  if(duplicate){showToast('This employee ID is already in use.','danger');return false;}
  return true;
}

async function submitWorkflow() {
  if(!canSaveEmployeeWorkflow())return;
  workflowState.loading = true; renderWorkflow();
  const type = workflowState.type;
  let payload = buildWorkflowPayload();
  let backendResult = null;
  try {
    if (appState.backendConnected && type === "onboard") payload = await buildBackendOnboardPayload();
    backendResult = await submitWorkflowToBackend(type, payload);
    await apiRequest(`/api/v1/workflow-drafts/${type}`, { method: "DELETE" });
  }
  catch (error) {
    workflowState.loading = false; workflowState.validationMessage = error.message; renderWorkflow(); return;
  }
  await new Promise((resolve) => window.setTimeout(resolve, 700));
  finalizeLocalWorkflow(type, backendResult);
  workflowState.loading = false;
  workflowState.backendResult = backendResult;
  workflowState.success = successDetails(type, backendResult);
  recordWorkflowAudit("SUBMITTED", payload);
  renderWorkflow();
}

function finalizeLocalWorkflow(type, backendResult) {
  if(type==='onboard'&&!canSaveEmployeeWorkflow())return false;
  if(!canSaveEmployeeWorkflow())return;
  if (type === "attendanceSettings") {
    appState.officeSettings = { lat: Number(workflowState.data.lat), lng: Number(workflowState.data.lng), ip: workflowState.data.ip };
    if (appState.activeView === "attendance") renderAttendance();
    return;
  }
  if (type === "onboard") {
    const isEdit = workflowState.options.employeeId;
    const record = backendResult?.employee || backendResult;
    const item = {
      backendId: record?.id || workflowState.options.employeeId,
      id: record?.employeeId || workflowState.data.employeeId,
      name: record?.fullName || workflowState.data.fullName,
      dept: record?.department || workflowState.data.department,
      role: roleLabel(workflowState.data.role),
      designation: record?.designation || workflowState.data.designation,
      phone: record?.mobileNumber || workflowState.data.mobileNumber,
      officialEmail: record?.officialEmail || workflowState.data.officialEmail,
      manager: record?.reportingManager || workflowState.data.reportingManager?.split(" (")[0] || "-",
      status: record?.status ? humanizeStatus(record.status) : "Active",
      attendance: "Not Started",
      shift: record?.shift || workflowState.data.shift || "09:00 AM - 06:00 PM",
      checkInTime: record?.checkInTime || workflowState.data.checkInTime || null
    };
    if (isEdit) {
      const idx = employees.findIndex((e) => String(e.backendId) === String(workflowState.options.employeeId));
      if (idx >= 0) {
        item.attendance = employees[idx].attendance;
        item.checkInTime = employees[idx].checkInTime;
        item.status = employees[idx].status; // preserve active status
        employees[idx] = {...employees[idx], ...item};
      } else {
        employees.push(item);
      }
    } else {
      employees.push(item);
    }
    appState.onboardingDraft = null; renderEmployees();
  }
  if (type === "department") {
    upsertDepartment(backendResult);
  }
  if (type === "payroll" && backendResult) {
    const index = appState.payrollRuns.findIndex((item) => item.id === backendResult.id);
    if (index >= 0) appState.payrollRuns[index] = backendResult; else appState.payrollRuns.push(backendResult);
    renderPayroll();
  }
  if (type === "document" && backendResult) {
    const record = { id: backendResult.id, type: humanizeStatus(backendResult.documentType), employee: backendResult.employee,
      format: "PDF", status: humanizeStatus(backendResult.status), emailStatus: humanizeStatus(backendResult.emailStatus),
      downloadUrl: backendResult.downloadUrl };
    const index = documents.findIndex((item) => item.id === record.id);
    if (index >= 0) documents[index] = record; else documents.unshift(record);
    renderDocuments();
  }
  if (type === "holidayList") {
    appState.companyHolidays = structuredClone(workflowState.data.holidays);
    if (appState.activeView === "dashboard") renderDashboard();
    if (appState.activeView === "leave") renderLeave();
  }
  if (type === "leaveApproval") {
    const idx = workflowState.options.requestIndex;
    const req = appState.leaveRequests[idx];
    if (req) {
      const decision = workflowState.data.decision;
      const statusClass = decision === "APPROVED" ? "success" : "danger";
      req[3] = `<span class="status ${statusClass}">${capitalize(decision.toLowerCase())}</span>`;
      if (decision === "APPROVED") {
        const empName = req[4];
        const emp = employees.find((e) => e.name === empName);
        if (emp) {
          emp.attendance = "On Leave";
        }
      }
    }
    if (appState.activeView === "leave") renderLeave();
    if (appState.activeView === "dashboard") renderDashboard();
  }
}

function upsertDepartment(backendResult) {
  const existing = appState.departments.find((item) => item.id === (backendResult?.id || workflowState.options.departmentId));
  const value = { id: backendResult?.id || existing?.id || Date.now(), name: backendResult?.name || workflowState.data.departmentName,
    code: backendResult?.code || workflowState.data.departmentCode,
    description: backendResult?.description ?? workflowState.data.departmentDescription ?? "",
    parentId: backendResult?.parentDepartmentId ?? existing?.parentId ?? null,
    headId: backendResult?.departmentHeadEmployeeId ?? employeeIdFromLookup(workflowState.data.departmentHead),
    head: backendResult?.departmentHead || workflowState.data.departmentHead?.replace(/ - DR-.*/, "") || "Unassigned",
    employees: backendResult?.employeeCount ?? existing?.employees ?? 0,
    parent: backendResult?.parentDepartment || workflowState.data.parentDepartment || "None",
    status: humanizeCode(backendResult?.status || workflowState.data.departmentStatus),
    departmentEmail: backendResult?.departmentEmail ?? workflowState.data.departmentEmail ?? "",
    officeLocation: backendResult?.officeLocation ?? workflowState.data.officeLocation ?? "",
    costCenterCode: backendResult?.costCenterCode ?? workflowState.data.costCenterCode ?? "",
    workingShift: backendResult?.workingShift ?? workflowState.data.workingShift ?? "Day Shift",
    weeklyOffPattern: backendResult?.weeklyOffPattern ?? workflowState.data.weeklyOffPattern ?? "Saturday, Sunday",
    notes: backendResult?.notes ?? workflowState.data.departmentNotes ?? "",
    leaveApprovalOwnerId: backendResult?.leaveApprovalOwnerId ?? employeeIdFromLookup(workflowState.data.leaveApprovalOwner),
    attendanceReviewerId: backendResult?.attendanceReviewerId ?? employeeIdFromLookup(workflowState.data.attendanceReviewer),
    payrollReviewerId: backendResult?.payrollReviewerId ?? employeeIdFromLookup(workflowState.data.payrollReviewer),
    helpDeskCategoryOwnerId: backendResult?.helpDeskCategoryOwnerId ?? employeeIdFromLookup(workflowState.data.helpDeskOwner),
    created: existing?.created || new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) };
  if (existing) Object.assign(existing, value); else appState.departments.push(value);
  if (canAccess("settings")) renderSettings();
  return value;
}

function employeeIdFromLookup(value) {
  return linkedEmployees().find((item) => String(value || "").startsWith(item.name))?.backendId || null;
}

function workflowLoading(definition) {
  return `<div class="workflow-shell"><header class="workflow-header"><div><h2>${definition.title}</h2><p>Processing your request</p></div></header><main class="workflow-body"><div class="workflow-loading"><span class="loading-mark"><i data-lucide="loader-circle"></i></span><h3>Please wait</h3><p class="muted">Validating permissions, saving records and writing the audit log.</p></div></main></div>`;
}

function workflowSuccess(definition, success) {
  const artifactDownload = ["report", "document"].includes(workflowState.type) && workflowState.backendResult?.downloadUrl
    ? `<a class="secondary-button" href="${window.HRMS_API_BASE || "http://127.0.0.1:8080"}${workflowState.backendResult.downloadUrl}" target="_blank" rel="noopener"><i data-lucide="download"></i>Download</a>` : "";
  return `<div class="workflow-shell"><header class="workflow-header"><div><h2 id="workflowTitle">${definition.title}</h2><p>Completed successfully</p></div><button class="icon-button" type="button" data-workflow-action="close-success" aria-label="Close"><i data-lucide="x"></i></button></header><main class="workflow-body"><div class="workflow-success"><span class="success-mark"><i data-lucide="check"></i></span><h3>${success.title}</h3><p class="muted">${success.message}</p><div class="summary-block" style="min-width:min(430px,100%)"><div class="summary-list">${success.rows.map(([label, value]) => `<div><span>${label}</span><strong>${escapeHtml(String(value))}</strong></div>`).join("")}</div></div><div class="inline-group"><button class="primary-button" type="button" data-workflow-action="close-success">Done</button>${workflowState.type === "payroll" ? `<button class="secondary-button" type="button" data-workflow-action="generate-payslips"><i data-lucide="files"></i>Generate Payslips</button>` : ""}${artifactDownload}${workflowState.options.returnTo === "onboard" ? `<button class="secondary-button" type="button" data-workflow-action="return-onboard">Return to Employee Onboard</button>` : ""}</div></div></main></div>`;
}

function successDetails(type, backendResult) {
  if (type === "attendanceSettings") return {
    title: "Settings Saved",
    message: "Office location rules have been updated and are now active.",
    rows: [["Latitude", workflowState.data.lat], ["Longitude", workflowState.data.lng], ["IP Address", workflowState.data.ip]]
  };
  if (type === "holidayList") return {
    title: "Holiday List Configured",
    message: "Company holidays have been successfully updated.",
    rows: [["Total Holidays", workflowState.data.holidays.length]]
  };
  if (type === "leaveApproval") return {
    title: "Decision Submitted",
    message: "The leave request status has been updated.",
    rows: [["Employee", workflowState.data.employee], ["Decision", workflowState.data.decision], ["Notes", workflowState.data.decisionNotes || "None"]]
  };
  if (type === "onboard") {
    if (workflowState.options.employeeId) {
      const record = backendResult?.employee || backendResult;
      return {
        title: "Employee profile updated successfully",
        message: "The employee profile has been successfully saved.",
        rows: [
          ["Employee", workflowState.data.fullName],
          ["Employee ID", record?.employeeId || workflowState.data.employeeId],
          ["Official email", record?.officialEmail || workflowState.data.officialEmail]
        ]
      };
    }
    return { title: "Employee onboarded successfully", message: "The employee profile is active and a secure password setup link has been prepared.", rows: [["Employee", workflowState.data.fullName], ["Employee ID", backendResult?.employee?.employeeId || workflowState.data.employeeId], ["Official email", backendResult?.employee?.officialEmail || workflowState.data.officialEmail], ["Email status", backendResult?.emailQueued ? "Queued" : "Setup link created; email delivery is not configured"]] };
  }
  if (type === "department") return { title: workflowState.options.departmentId ? "Department updated successfully" : "Department created successfully", message: "The department is now available in onboarding, profiles, reports and filters.", rows: [["Department", workflowState.data.departmentName], ["Code", workflowState.data.departmentCode], ["Head", workflowState.data.departmentHead || "Unassigned"], ["Status", workflowState.data.departmentStatus]] };
  if (type === "payroll") return { title: "Payroll finalized successfully", message: "The payroll is locked. Payslips can now be generated.", rows: [["Cycle", `${workflowState.data.payrollMonth}/${workflowState.data.payrollYear}`], ["Employees", payrollPreviewRows().length], ["Net payroll", money(payrollPreviewRows().reduce((sum, row) => sum + row.net, 0))], ["Status", "Finalized and locked"]] };
  if (type === "document") {
    const emailStatus = ({ SENT: "Sent", FAILED: "Failed", NOT_CONFIGURED: "Email service not configured", NOT_REQUESTED: "Not requested", PROCESSING: "Processing" })[backendResult?.emailStatus]
      || (workflowState.data.emailToEmployee ? "Status unavailable" : "Not requested");
    return { title: "Document generated successfully", message: "A versioned PDF was created and the selected profile and email actions were processed.", rows: [["Document", workflowState.data.documentType], ["Employee", workflowState.data.employee], ["Profile", workflowState.data.saveToProfile ? "Saved" : "Not saved"], ["Email", emailStatus]] };
  }
  return { title: "Report generated successfully", message: "The export is ready to download and has been added to the audit log.", rows: [["File name", reportFileName()], ["Format", workflowState.data.format], ["Generated by", currentUser().name], ["Generated", new Date().toLocaleString("en-IN")]] };
}

function buildWorkflowPayload() {
  if (workflowState.type === "onboard") return { ...workflowState.data, assets: workflowState.assets, audit: { actor: currentUser().id, action: "EMPLOYEE_ONBOARD" } };
  return { ...workflowState.data, audit: { actor: currentUser().id, action: `${workflowState.type.toUpperCase()}_SUBMIT` } };
}

async function submitWorkflowToBackend(type, payload) {
  if (!appState.backendConnected) throw new Error("Please login again.");
  const routes = {
    onboard: (type === "onboard" && workflowState.options.employeeId) ? `/api/v1/employees/${workflowState.options.employeeId}` : "/api/v1/employees/onboard",
    department: (type === "department" && workflowState.options.departmentId) ? `/api/v1/departments/${workflowState.options.departmentId}` : "/api/v1/departments",
    payroll: "/api/v1/payroll/generate",
    document: "/api/v1/documents",
    report: "/api/v1/reports/export",
    attendanceSettings: "/api/v1/attendance/settings"
  };
  const method = ((type === "department" && workflowState.options.departmentId) || (type === "onboard" && workflowState.options.employeeId)) ? "PUT" : "POST";
  const backendPayload = type === "department" ? departmentBackendPayload(payload)
    : type === "payroll" ? payrollBackendPayload(payload)
    : type === "document" ? documentBackendPayload(payload)
    : type === "report" ? reportBackendPayload(payload) : payload;
  if (["holidayList", "leaveApproval"].includes(type)) {
    throw new Error('This workflow has no connected backend endpoint. No changes were saved.');
  }
  if (type === "payroll") {
    let result = workflowState.backendPayrollRun;
    if (!result) {
      result = await apiRequest(routes[type], { method, body: JSON.stringify(backendPayload) });
      result = await apiRequest(`/api/v1/payroll/${result.id}/preview`, { method: "POST" });
    }
    for (const row of payrollPreviewRows()) {
      const item = result.items.find((value) => value.id === row.backendItemId || value.employeeId === row.employeeId);
      if (!item) continue;
      result = await apiRequest(`/api/v1/payroll/${result.id}/items/${item.id}`, { method: "PATCH",
        body: JSON.stringify({ overtimePay: row.overtime, lwpDeduction: row.lwp, manualDeduction: row.manual }) });
    }
    result = await apiRequest(`/api/v1/payroll/${result.id}/finalize`, { method: "POST" });
    workflowState.backendPayrollRun = result;
    return result;
  }
  let result = await apiRequest(routes[type], { method, body: JSON.stringify(backendPayload) });
  if (type === "document") {
    result = await apiRequest(`/api/v1/documents/${result.id}/finalize?share=${!!workflowState.data.saveToProfile}&email=${!!workflowState.data.emailToEmployee}`, { method: "POST" });
  }
  return result;
}

async function buildBackendOnboardPayload() {
  if(!canSaveEmployeeWorkflow())throw new Error('You cannot assign the selected type of access.');
  await uploadPendingOnboardingFiles();
  if(!canSaveEmployeeWorkflow())throw new Error('Your access changed before this employee could be saved.');
  const tokens = { ...workflowState.uploadTokens };
  const data = workflowState.data;
  const department = appState.departments.find((item) => item.name === data.department);
  const managerId = String(data.reportingManager || "").match(/DR-([0-9]+)/)?.[0];
  const manager = employees.find((item) => item.id === managerId);
  return {
    personal: { fullName: data.fullName, dateOfBirth: data.dateOfBirth, gender: data.gender, mobileNumber: data.mobileNumber,
      personalEmail: data.personalEmail, currentAddress: data.currentAddress, permanentAddress: data.permanentAddress,
      profilePhotoUploadToken: tokens.profilePhoto || null },
    government: { aadhaarNumber: data.aadhaarNumber, panNumber: data.panNumber,
      uploads: [["AADHAAR_CARD", "aadhaarUpload"], ["PAN_CARD", "panUpload"], ["RESUME", "resumeUpload"], ["EDUCATIONAL_CERTIFICATES", "educationUpload"]]
        .filter(([, field]) => tokens[field]).map(([documentType, field]) => ({ documentType, uploadToken: tokens[field] })) },
    employment: { employeeId: data.employeeId, officialEmail: data.officialEmail, departmentId: department?.id,
      designation: data.designation, reportingManagerId: manager?.backendId || null, role: data.role,
      employmentType: ({ "Full-time": "FULL_TIME", Intern: "INTERN", Contract: "CONTRACT" })[data.employmentType],
      joiningDate: data.joiningDate, probationEndDate: data.probationEndDate || null, shift: data.shift, employeeStatus: "ACTIVE" },
    bank: { bankName: data.bankName, accountHolderName: data.accountHolderName, accountNumber: data.accountNumber,
      ifscCode: data.ifscCode, branchName: data.branchName, upiId: data.upiId || null },
    emergency: { contactName: data.emergencyContactName, relationship: data.emergencyRelationship,
      mobileNumber: data.emergencyMobile, alternateMobileNumber: data.emergencyAlternateMobile || null },
    assets: workflowState.assets.map((asset) => ({ assetType: asset.assetType, assetId: asset.assetId || null,
      serialNumber: asset.serialNumber || null, notes: asset.notes || null })),
    salary: { basicSalary: Number(data.basicSalary), hra: Number(data.hra), specialAllowance: Number(data.specialAllowance),
      otherEarnings: Number(data.otherEarnings || 0), manualDeductions: Number(data.manualDeductions || 0), monthlyCtc: Number(data.monthlyCtc) }
  };
}

async function uploadPendingOnboardingFiles() {
  for (const [field, file] of Object.entries(workflowState.files)) {
    if (!file) continue;
    const form = new FormData(); form.append("file", file);
    workflowState.uploadTokens[field] = (await apiRequest("/api/v1/employees/onboard/uploads", { method: "POST", body: form })).uploadToken;
    workflowState.files[field] = null;
  }
}

function departmentBackendPayload(data) {
  const employeeId = (name) => employees.find((item) => String(name || "").startsWith(item.name))?.backendId || null;
  return { name: data.departmentName, code: data.departmentCode, description: data.departmentDescription || null,
    parentDepartmentId: appState.departments.find((item) => item.name === data.parentDepartment)?.id || null,
    departmentHeadEmployeeId: employeeId(data.departmentHead), departmentEmail: data.departmentEmail || null,
    officeLocation: data.officeLocation || null, costCenterCode: data.costCenterCode || null, workingShift: data.workingShift,
    weeklyOffPattern: data.weeklyOffPattern, leaveApprovalOwnerId: employeeId(data.leaveApprovalOwner),
    attendanceReviewerId: employeeId(data.attendanceReviewer), payrollReviewerId: employeeId(data.payrollReviewer),
    helpDeskCategoryOwnerId: employeeId(data.helpDeskOwner), notes: data.departmentNotes || null,
    status: String(data.departmentStatus || "DRAFT").toUpperCase(),
    confirmCodeChange: !!data.confirmDepartmentCodeChange };
}

function payrollBackendPayload(data) {
  return { payrollMonth: Number(data.payrollMonth), payrollYear: Number(data.payrollYear), cycleStart: data.cycleStart,
    cycleEnd: data.cycleEnd, paymentDate: data.paymentDate,
    departmentId: appState.departments.find((item) => item.name === data.department)?.id || null,
    employeeIds: data.employeeFilter === "Selected employees" ? (data.selectedEmployeeIds || []).map(Number) : [],
    includeAttendance: !!data.includeAttendance, includeLwp: !!data.includeLwp, includeOvertime: !!data.includeOvertime,
    includeManualDeductions: !!data.includeManualDeductions, notes: data.payrollNotes || null };
}

function documentBackendPayload(data) {
  const employeeId = employees.find((item) => String(data.employee).includes(item.id))?.backendId;
  if (!employeeId) throw new Error("Select an employee linked to the HRMS before generating this document.");
  const templateId = String(data.template || "").startsWith("DOCX:") ? Number(String(data.template).slice(5)) : null;
  return { documentType: data.documentType.toUpperCase().replaceAll(" ", "_"),
    employeeId,
    template: templateId ? null : data.template, templateId, issueDate: data.issueDate, effectiveDate: data.effectiveDate || null,
    signatory: data.signatory, emailToEmployee: !!data.emailToEmployee, saveToProfile: !!data.saveToProfile,
    notes: data.documentNotes || null, editableContent: data.documentContent || null };
}

async function uploadDocumentTemplate(button) {
  collectWorkflowData(false);
  const file = document.querySelector("#documentTemplateFile")?.files?.[0];
  const name = String(workflowState.data.templateUploadName || "").trim();
  if (!name || !file) { workflowState.validationMessage = "Enter a template name and choose a DOCX file."; renderWorkflow(); return; }
  if (!file.name.toLowerCase().endsWith(".docx")) { workflowState.validationMessage = "Only Microsoft Word DOCX templates are supported."; renderWorkflow(); return; }
  button.disabled = true;
  button.innerHTML = `<i data-lucide="loader-circle"></i>Uploading`;
  refreshIcons();
  try {
    const form = new FormData();
    form.append("name", name);
    form.append("documentType", workflowState.data.documentType.toUpperCase().replaceAll(" ", "_"));
    form.append("file", file);
    const uploaded = await apiRequest("/api/v1/documents/templates", { method: "POST", body: form });
    appState.documentTemplates = await apiRequest("/api/v1/documents/templates");
    workflowState.data.template = `DOCX:${uploaded.id}`;
    workflowState.data.templateUploadName = "";
    workflowState.validationMessage = "";
    recordWorkflowAudit("DOCUMENT_TEMPLATE_UPLOADED", { templateId: uploaded.id, version: uploaded.version });
    showToast("DOCX template uploaded");
    renderWorkflow();
  } catch (error) {
    workflowState.validationMessage = error.message;
    renderWorkflow();
  }
}

async function generatePayslips() {
  const runId = workflowState.backendPayrollRun?.id;
  if (!runId) return;
  const button = document.querySelector("[data-workflow-action='generate-payslips']");
  button.disabled = true;
  try {
    const result = await apiRequest(`/api/v1/payroll/${runId}/payslips`, { method: "POST" });
    showToast(`${result.generated} payslips generated`);
    button.innerHTML = `<i data-lucide="check"></i>Payslips Generated`;
    refreshIcons();
  } catch (error) {
    button.disabled = false;
  }
}

function reportBackendPayload(data) {
  return { reportType: data.reportType, startDate: data.startDate, endDate: data.endDate,
    departmentId: appState.departments.find((item) => item.name === data.department)?.id || null,
    employeeId: employees.find((item) => item.name === data.employee)?.backendId || null, status: data.status,
    format: data.format === "Excel" ? "EXCEL" : data.format.toUpperCase(), includeSummaryCharts: !!data.includeSummaryCharts,
    includeEmployeeDetails: !!data.includeEmployeeDetails, includeAuditTrail: !!data.includeAuditTrail, fileName: data.fileName };
}

function recordWorkflowAudit(action, payload = null) {
  appState.workflowAudit.push({ actor: currentUser().id, role: appState.role, workflow: workflowState.type, action,
    step: workflowState.step + 1, timestamp: new Date().toISOString(), payload });
}

function updatePayrollAdjustment(input) {
  const row = payrollPreviewRows()[Number(input.dataset.payrollIndex)];
  row[input.dataset.payrollField] = Math.max(0, Number(input.value || 0));
  row.gross = row.basic + row.hra + row.special + row.overtime;
  row.net = Math.max(0, row.gross - row.lwp - row.lateDeduction - row.manual);
}

async function loadEmployeeForEdit(id) {
  try {
    workflowState.loading = true;
    renderWorkflow();
    const item = await apiRequest(`/api/v1/employees/${id}`);
    const departmentName = appState.departments.find((d) => d.id === item.employment?.departmentId)?.name || "";
    const managerEmp = employees.find((e) => e.backendId === item.employment?.reportingManagerId);
    const managerValue = managerEmp ? `${managerEmp.name} (${managerEmp.id})` : "No reporting manager";
    
    Object.assign(workflowState.data, {
      fullName: item.personal?.fullName || "",
      dateOfBirth: item.personal?.dateOfBirth || "",
      gender: item.personal?.gender || "",
      mobileNumber: item.personal?.mobileNumber || "",
      personalEmail: item.personal?.personalEmail || "",
      currentAddress: item.personal?.currentAddress || "",
      permanentAddress: item.personal?.permanentAddress || "",
      
      aadhaarNumber: item.government?.aadhaarNumber || "",
      panNumber: item.government?.panNumber || "",
      
      employeeId: item.employment?.employeeId || "",
      officialEmail: item.employment?.officialEmail || "",
      department: departmentName,
      designation: item.employment?.designation || "",
      reportingManager: managerValue,
      role: HRDomain.adminRole(HRDomain.accessRole(item.employment?.role)),
      employmentType: ({ "FULL_TIME": "Full-time", "INTERN": "Intern", "CONTRACT": "Contract" })[item.employment?.employmentType] || "Full-time",
      joiningDate: item.employment?.joiningDate || "",
      probationEndDate: item.employment?.probationEndDate || "",
      shift: item.employment?.shift || "Day Shift",
      
      bankName: item.bank?.bankName || "",
      accountHolderName: item.bank?.accountHolderName || "",
      accountNumber: item.bank?.accountNumber || "",
      ifscCode: item.bank?.ifscCode || "",
      branchName: item.bank?.branchName || "",
      upiId: item.bank?.upiId || "",
      
      emergencyContactName: item.emergency?.contactName || "",
      emergencyRelationship: item.emergency?.relationship || "",
      emergencyMobile: item.emergency?.mobileNumber || "",
      emergencyAlternateMobile: item.emergency?.alternateMobileNumber || "",
      
      basicSalary: item.salary?.basicSalary || "0",
      hra: item.salary?.hra || "0",
      specialAllowance: item.salary?.specialAllowance || "0",
      otherEarnings: item.salary?.otherEarnings || "0",
      manualDeductions: item.salary?.manualDeductions || "0",
      monthlyCtc: item.salary?.monthlyCtc || "0"
    });
    
    workflowState.assets = (item.assets || []).map((asset) => ({
      assetType: asset.assetType,
      assetId: asset.assetId || "",
      serialNumber: asset.serialNumber || "",
      notes: asset.notes || ""
    }));

    const govUploads = item.government?.uploads || [];
    govUploads.forEach((u) => {
      if (u.documentType === "AADHAAR_CARD") workflowState.data.aadhaarUpload = "Aadhaar Card Uploaded";
      if (u.documentType === "PAN_CARD") workflowState.data.panUpload = "PAN Card Uploaded";
      if (u.documentType === "RESUME") workflowState.data.resumeUpload = "Resume Uploaded";
      if (u.documentType === "EDUCATIONAL_CERTIFICATES") workflowState.data.educationUpload = "Certificates Uploaded";
    });
    
    workflowState.loading = false;
    renderWorkflow();
  } catch (error) {
    workflowError(error.message);
  }
}

function loadDepartmentForEdit(id) {
  const item = appState.departments.find((department) => department.id === id);
  if (!item) return;
  const employeeName = (backendId) => linkedEmployees().find((employee) => employee.backendId === backendId)?.name || "";
  const head = linkedEmployees().find((employee) => employee.backendId === item.headId);
  Object.assign(workflowState.data, { departmentName: item.name, departmentCode: item.code, departmentDescription: item.description,
    departmentHead: head ? `${head.name} - ${head.id} - ${head.role}` : "Save without head (Draft)",
    parentDepartment: item.parent, departmentStatus: item.status, departmentEmail: item.departmentEmail,
    officeLocation: item.officeLocation, costCenterCode: item.costCenterCode, workingShift: item.workingShift,
    weeklyOffPattern: item.weeklyOffPattern, leaveApprovalOwner: employeeName(item.leaveApprovalOwnerId),
    attendanceReviewer: employeeName(item.attendanceReviewerId), payrollReviewer: employeeName(item.payrollReviewerId),
    helpDeskOwner: employeeName(item.helpDeskCategoryOwnerId), departmentNotes: item.notes || "" });
}

async function archiveDepartment() {
  const item = appState.departments.find((department) => department.id === workflowState.options.departmentId);
  if (!item) return;
  if (!window.confirm(`Archive ${item.name}? It will no longer be available for new employees.`)) return;
  try {
    const result = await apiRequest(`/api/v1/departments/${item.id}/archive`, { method: "PATCH" });
    item.status = humanizeCode(result.status); workflowState.data.departmentStatus = item.status;
    recordWorkflowAudit("DEPARTMENT_ARCHIVED", { departmentId: item.id });
    if (canAccess("settings")) renderSettings(); showToast("Department archived"); renderWorkflow();
  } catch (error) { workflowError(error.message); }
}

async function deleteDepartment() {
  const item = appState.departments.find((department) => department.id === workflowState.options.departmentId);
  if (!item) return;
  if (item.employees > 0) { workflowError("Department has active employees and can only be archived."); return; }
  if (!window.confirm(`Delete ${item.name}? This action cannot be undone.`)) return;
  try {
    await apiRequest(`/api/v1/departments/${item.id}`, { method: "DELETE" });
    appState.departments = appState.departments.filter((department) => department.id !== item.id);
    recordWorkflowAudit("DEPARTMENT_DELETED", { departmentId: item.id });
    document.querySelector("#workflowModal").close(); if (canAccess("settings")) renderSettings(); showToast("Department deleted");
  } catch (error) { workflowError(error.message); }
}

function showLeaveDetail(id) {
  const response = workflowState.calendarData || { events: [], holidays: [], wfh: [] };
  workflowState.leaveDetail = String(id).startsWith("holiday-")
    ? response.holidays.find((item) => String(item.id) === String(id).replace("holiday-", ""))
    : String(id).startsWith("wfh-")
      ? { ...response.wfh.find((item) => String(item.id) === String(id).replace("wfh-", "")), eventType: "WFH" }
      : response.events.find((item) => String(item.id) === String(id));
  renderWorkflow();
}

async function decideLeave(decision) {
  const event = workflowState.leaveDetail;
  if (!event || !requireEmployeeAdministration(event)) return;
  try {
    const updated = await apiRequest(`/api/v1/leave/${event.id}/approve`, { method: "POST",
      body: JSON.stringify({ decision, notes: decision === "APPROVED" ? "Approved from leave calendar" : "Rejected from leave calendar" }) });
    const index = workflowState.calendarData.events.findIndex((item) => item.id === updated.id);
    workflowState.calendarData.events[index] = updated; workflowState.leaveDetail = updated;
    showToast(`Leave ${decision.toLowerCase()}`); renderWorkflow();
  } catch (error) { workflowError(error.message); }
}

async function cancelLeave() {
  const event = workflowState.leaveDetail;
  if (!event || !window.confirm("Cancel this leave request?")) return;
  try {
    const updated = await apiRequest(`/api/v1/leave/${event.id}/cancel`, { method: "POST" });
    const index = workflowState.calendarData.events.findIndex((item) => item.id === updated.id);
    workflowState.calendarData.events[index] = updated; workflowState.leaveDetail = updated;
    showToast("Leave cancelled"); renderWorkflow();
  } catch (error) { workflowError(error.message); }
}

function summaryBlock(title, rows) {
  return `<div class="summary-block"><h4>${title}</h4><div class="summary-list">${rows.map(([label, key]) => `<div><span>${label}</span><strong>${key === "__dateRange" ? `${safeValue("startDate")} to ${safeValue("endDate")}` : safeValue(key)}</strong></div>`).join("")}</div></div>`;
}

function safeValue(key) {
  if (key === "__documentTemplate") return escapeHtml(documentTemplateLabel(workflowState.data.template));
  const value = key==='role'?roleLabel(workflowState.data[key]):workflowState.data[key];
  return escapeHtml(value === undefined || value === null || value === "" ? "-" : String(value));
}
function documentTemplateLabel(value) {
  const id = String(value || "").startsWith("DOCX:") ? Number(String(value).slice(5)) : null;
  const template = appState.documentTemplates.find((item) => item.id === id);
  return template ? `${template.name} (DOCX v${template.version})` : value || "-";
}
function nextEmployeeId() { const highest = employees.map((item) => Number(String(item.id).replace("DR-", ""))).filter(Number.isFinite).reduce((max, value) => Math.max(max, value), 0); return `DR-${String(highest + 1).padStart(3, "0")}`; }
function linkedEmployees() { return employees.filter((item) => item.backendId); }
function slugName(name) { return name.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim().replace(/\s+/g, "."); }
function departmentCode(name) { const words = name.toUpperCase().replace(/[^A-Z0-9 ]/g, "").trim().split(/\s+/).filter((word) => !["AND", "OF", "THE", "TEAM"].includes(word)); if (words.length > 1) return words.map((word) => word[0]).join("").slice(0, 6); return (words[0] || "").slice(0, 4); }
function roleLabel(role) { return HRDomain.accessRole(role); }
function defaultDocumentContent() { const employee = workflowState.data.employee?.split(" (")[0] || "Employee"; return `Digi Rathi\n\n${workflowState.data.documentType}\n\nDear ${employee},\n\nThis document is issued by Digi Rathi effective ${workflowState.data.effectiveDate || workflowState.data.issueDate}.\n\nRegards,\n${workflowState.data.signatory}`; }
function defaultReportType() { return HRDomain.accessRole(appState.role) === "Employee" ? "ATTENDANCE_REPORT" : "EMPLOYEE_REPORT"; }
function allowedReportTypes() { const all = ["ATTENDANCE_REPORT", "LEAVE_REPORT", "PAYROLL_REPORT", "EMPLOYEE_REPORT", "ASSET_REPORT", "PERFORMANCE_REPORT", "HELP_DESK_REPORT", "DOCUMENT_REPORT"]; if (["Super Admin", "HR Admin"].includes(appState.role)) return all; return ["ATTENDANCE_REPORT", "LEAVE_REPORT", "DOCUMENT_REPORT"]; }
function roleCalendarDepartments() { return ["Super Admin", "HR Admin"].includes(appState.role) ? ["All departments", ...appState.departments.filter((item) => item.status === "Active").map((item) => item.name)] : [currentUser().department]; }
function roleCalendarEmployees() { if (["Super Admin", "HR Admin"].includes(appState.role)) return ["All employees", ...employees.map((item) => item.name)]; return [currentUser().name]; }
function estimatedReportCount() { return workflowState.backendReportPreview?.estimatedRecords ?? 0; }
function reportScopeLabel() { return HRDomain.accessRole(appState.role) === "Employee" ? "Own records only" : "Authorized organization data"; }
function reportFileName() { const ext = ({ PDF: "pdf", Excel: "xlsx", CSV: "csv", Print: "html" })[workflowState.data.format] || "pdf"; return `${String(workflowState.data.fileName || "digi-rathi-report").replace(/\.(pdf|xlsx|csv|html)$/i, "")}.${ext}`; }
function money(value) { return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value || 0)); }
function capitalize(value) { return value.charAt(0).toUpperCase() + value.slice(1); }
function escapeAttr(value) { return escapeHtml(String(value)).replaceAll("`", "&#96;"); }

function reportBackendPayload(payload) {
  return { reportType: payload.reportType, startDate: payload.startDate, endDate: payload.endDate, department: payload.department, employee: payload.employee, status: payload.status, format: payload.format, includeSummaryCharts: payload.includeSummaryCharts, includeEmployeeDetails: payload.includeEmployeeDetails, includeAuditTrail: payload.includeAuditTrail };
}

function renderAttendanceSettingsStep() {
  return section("Location Rules", "Define the exact boundary where employees can clock in using 'Office' mode.", `
    <div class="grid two-col">
      ${textField("Office Latitude", "lat", { type: "number", step: "any", required: true })}
      ${textField("Office Longitude", "lng", { type: "number", step: "any", required: true })}
    </div>
    ${textField("Office IP Address", "ip", { placeholder: "e.g. 192.168.1.100", required: true, help: "Employees must be connected to a network with this public IP." })}
  `);
}

function renderAttendanceRulesStep() {
  const policy = appState.attendanceLatePolicy || { gracePeriodMins: 30, requiredWorkingHours: 9, lateDaysThreshold: 4, penaltyAction: "Full Day" };
  const lat = appState.officeSettings?.lat ?? 0;
  const lng = appState.officeSettings?.lng ?? 0;
  const ip = appState.officeSettings?.ip || "Not configured";
  
  return section("Corporate Attendance Rules & Policies", "Review the currently configured workplace parameters", `
    <div class="mini-list">
      <div class="mini-item"><span class="list-icon violet"><i data-lucide="map-pin-check"></i></span><div><strong>Office Coordinates & IP</strong><span class="muted">Lat: ${lat}, Lng: ${lng} | IP: ${ip}</span></div><span class="status warning">Verified</span></div>
      <div class="mini-item"><span class="list-icon green"><i data-lucide="house"></i></span><div><strong>WFH Remote Mode</strong><span class="muted">Allows remote login. No GPS/IP verification required.</span></div><span class="status success">Remote</span></div>
      <div class="mini-item"><span class="list-icon orange"><i data-lucide="timer-reset"></i></span><div><strong>Auto Clock-out</strong><span class="muted">Automatically clocked out at 11:59 PM if forgotten.</span></div><span class="status neutral">Policy</span></div>
      <div class="mini-item"><span class="list-icon violet"><i data-lucide="timer"></i></span><div><strong>Late Check-in Grace Period</strong><span class="muted">${policy.gracePeriodMins} minutes grace time allowed. Late badge is applied after this.</span></div><span class="status success">Active</span></div>
      <div class="mini-item"><span class="list-icon green"><i data-lucide="clock"></i></span><div><strong>Required Shift Hours</strong><span class="muted">Employees must complete a minimum of ${policy.requiredWorkingHours} hours working time daily.</span></div><span class="status success">Mandatory</span></div>
      <div class="mini-item"><span class="list-icon orange"><i data-lucide="alert-triangle"></i></span><div><strong>Late Check-in Penalty Policy</strong><span class="muted">If an employee is late ${policy.lateDaysThreshold} days, they are marked as ${policy.penaltyAction} Absent.</span></div><span class="status warning">Deduction</span></div>
    </div>
  `);
}

function renderHolidayListStep() {
  const step = workflowState.step;
  const holidays = workflowState.data.holidays || [];
  if(workflowState.options.viewOnly) return section('Company holidays','Published dates for your reference.',`<div class="mini-list">${holidays.map(h=>`<div class="mini-item"><strong>${escapeHtml(h.name)}</strong><span>${escapeHtml(h.date)}</span></div>`).join('') || '<p>No holidays are configured.</p>'}</div>`);
  
  if (step === 0) {
    const editIndex = workflowState.data.editIndex;
    const isEdit = editIndex >= 0;
    const dateVal = workflowState.data.date || "";
    const nameVal = workflowState.data.name || "";
    const typeVal = workflowState.data.type || "National";
    
    const formHtml = `
      <form id="workflowForm" class="workflow-grid" onsubmit="return false;">
        <label class="field">Date
          <input type="date" name="date" value="${escapeAttr(dateVal)}" required />
        </label>
        <label class="field">Holiday Name
          <input type="text" name="name" value="${escapeAttr(nameVal)}" placeholder="e.g. Independence Day" required />
        </label>
        <label class="field">Type
          <select name="type" required>
            <option value="National" ${typeVal === "National" ? "selected" : ""}>National</option>
            <option value="Regional" ${typeVal === "Regional" ? "selected" : ""}>Regional</option>
            <option value="Company" ${typeVal === "Company" ? "selected" : ""}>Company</option>
          </select>
        </label>
        <div style="display: flex; align-items: flex-end; padding-bottom: 2px;">
          <button class="primary-button" type="button" data-workflow-action="add-holiday-entry">
            <i data-lucide="${isEdit ? "save" : "plus"}"></i> ${isEdit ? "Update Entry" : "Add Holiday"}
          </button>
        </div>
      </form>
    `;
    
    const rowsHtml = holidays.length
      ? holidays.map((h, i) => `
          <tr>
            <td><strong>${h.date}</strong></td>
            <td>${escapeHtml(h.name)}</td>
            <td><span class="status ${h.type === "National" ? "success" : "neutral"}">${h.type}</span></td>
            <td>
              ${actionsCell([
                `<button class="text-button" type="button" data-workflow-action="edit-holiday-entry" data-index="${i}">Edit</button>`,
                `<button class="text-button danger-text" type="button" data-workflow-action="delete-holiday-entry" data-index="${i}">Delete</button>`
              ])}
            </td>
          </tr>
        `).join("")
      : `<tr><td colspan="4" class="muted" style="text-align:center; padding: 20px;">No holidays configured. Add one using the form above.</td></tr>`;
      
    const tableHtml = `
      <div class="table-wrap" style="margin-top: 20px;">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Holiday Name</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
    
    return section("Manage Holiday List", "Configure company-wide public holidays.", formHtml + tableHtml);
  }
  
  const listItems = holidays.map((h) => `
    <div class="mini-item">
      <span class="list-icon violet"><i data-lucide="calendar"></i></span>
      <div>
        <strong>${h.name}</strong>
        <span class="muted">${h.date} · ${h.type}</span>
      </div>
    </div>
  `).join("");
  
  return section("Review & Save Holidays", "Confirm the list of holidays before writing to settings.", `
    <div class="summary-grid">
      <div class="summary-block full-span">
        <h4>Holiday List Summary</h4>
        <div class="mini-list" style="margin-top: 10px; max-height: 250px; overflow-y: auto;">
          ${listItems || `<div class="empty-state"><p class="muted">No holidays to save.</p></div>`}
        </div>
      </div>
    </div>
  `);
}

function renderLeaveApprovalStep() {
  const step = workflowState.step;
  
  if (step === 0) {
    return section("Review Request Details", "Review leave category, duration and reasons.", `
      <div class="summary-grid">
        <div class="summary-block full-span">
          <h4>Leave Information</h4>
          <div class="summary-list">
            <div><span>Employee Name</span><strong>${escapeHtml(workflowState.data.employee)}</strong></div>
            <div><span>Employee Code</span><strong>${escapeHtml(workflowState.data.employeeCode)}</strong></div>
            <div><span>Leave Type</span><strong>${escapeHtml(workflowState.data.leaveType)}</strong></div>
            <div><span>Requested Dates</span><strong>${escapeHtml(workflowState.data.dates)}</strong></div>
            <div><span>Duration</span><strong>${escapeHtml(workflowState.data.duration)}</strong></div>
            <div><span>Current Status</span><strong>${workflowState.data.status}</strong></div>
          </div>
        </div>
      </div>
    `);
  }
  
  return section("Record Approval Decision", "Choose to approve or reject the request and include notes.", `
    <form id="workflowForm" class="workflow-grid">
      ${selectField("Decision", "decision", [
        { value: "APPROVED", label: "Approve Leave" },
        { value: "REJECTED", label: "Reject Leave" }
      ])}
      ${textareaField("Decision Notes / Feedback", "decisionNotes", {
        placeholder: "e.g. Approved. Team coverage is sufficient.",
        required: false
      })}
    </form>
  `);
}

window.openWorkflow = openWorkflow;

