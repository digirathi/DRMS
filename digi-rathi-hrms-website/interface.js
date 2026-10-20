/* Shared presentation behavior for all HRMS modules. */
(() => {
  'use strict';
  matchMedia('(min-width: 1100px)').addEventListener('change', () => closeSidebar());
  closeSidebar();
  window.prepareDemoData = function () {
    const remap = new Map();
    (window.payrollStore?.profiles || []).forEach((profile,index) => {
      if (!employees[index]) employees.push({backendId:index+1,id:`DR-${String(index+1).padStart(3,'0')}`,name:profile.name,dept:profile.department,designation:profile.designation,role:'Employee',manager:'Demo Person 23 (DR-001)',status:'Active',attendance:'Not Started',checkInTime:null,shift:'09:00 AM - 06:00 PM',lateDays:0});
      const employee=employees[index]; remap.set(profile.employeeId,employee);
      Object.assign(profile,{employeeId:employee.id,name:employee.name,department:employee.dept,designation:employee.designation});
    });
    payrollStore.adjustments.forEach(a=>{if(remap.has(a.employeeId))a.employeeId=remap.get(a.employeeId).id;});
    const mapRecord=r=>{const e=remap.get(r.employeeCode)||employees[Number(String(r.employeeId).replace(/\D/g,''))-1];if(e)Object.assign(r,{employeeId:e.id,employeeCode:e.id,employeeName:e.name,department:e.dept});};
    leaveStore.requests.forEach(mapRecord);leaveStore.balances.forEach(mapRecord);leaveStore.auditLogs.forEach(mapRecord);
    ensureAllEmployeeBalancesInitialized();
    employees[0].attendance='Not Started';employees[0].checkInTime=null;
    employees.forEach(e=>{e.attendance=getEmployeeAttendanceStatus(e);});
    mockHistoryDataset.forEach((record,index)=>{const e=employees.find(e=>e.id===record.employeeId)||employees[index%employees.length];Object.assign(record,{employeeId:e.id,employeeName:e.name,department:e.dept,date:getRelativeHistDate(index+1)});});
    appState.companyHolidays=leaveStore.holidays.filter(h=>h.isActive).map(h=>({date:h.date,name:h.name,type:'Company'}));
    appState.departments=[...new Set(employees.map(e=>e.dept))].map((name,index)=>({id:index+1,name,code:name.slice(0,3).toUpperCase(),description:'',parent:name==='Management'?'None':'Management',head:employees.find(e=>e.dept===name)?.name||'',employees:employees.filter(e=>e.dept===name).length,status:'Active',created:'01 Jan 2026'}));
  };
  let scheduled=false;
  window.enhanceInterface=function () {
    scheduled=false;
    document.body.classList.toggle('demo-mode',Boolean(appState.isMockBypass));
    const role=document.querySelector('.role-selector-wrap');if(role)role.hidden=!appState.isMockBypass;
    if(appState.isMockBypass&&!document.querySelector('.preview-banner')){
      const banner=document.createElement('div');banner.className='preview-banner';
      banner.innerHTML='<i data-lucide="flask-conical"></i><span><strong>Demo workspace</strong> · Sample data. Changes reset when you reload.</span><button type="button">Exit demo</button>';
      banner.querySelector('button').addEventListener('click',()=>location.assign(location.pathname));document.querySelector('.topbar').after(banner);
    }
    const palette={'rgb(129, 140, 248)':'--primary','rgb(165, 180, 252)':'--primary','rgb(99, 102, 241)':'--primary','rgb(192, 132, 252)':'--primary','rgb(96, 165, 250)':'--primary','rgb(126, 34, 206)':'--primary','rgb(52, 211, 153)':'--success','rgb(16, 185, 129)':'--success','rgb(74, 222, 128)':'--success','rgb(5, 150, 105)':'--success','rgb(248, 113, 113)':'--danger','rgb(239, 68, 68)':'--danger','rgb(225, 29, 72)':'--danger','rgb(251, 191, 36)':'--warning','rgb(245, 158, 11)':'--warning','rgb(180, 83, 9)':'--warning','rgb(148, 163, 184)':'--muted-text','rgb(34, 211, 238)':'--primary'};
    document.querySelectorAll('.content-view [style], dialog [style], [id^="hist"] [style]').forEach(el=>{
      const s=el.style;
      if(s.display==='grid'&&s.gridTemplateColumns)el.classList.add(/repeat\(7,/.test(s.gridTemplateColumns)?'calendar-grid':'responsive-grid');
      if(s.display==='grid'&&el.children.length&&[...el.children].every(c=>c.classList.contains('stat-card')))el.classList.add('metric-grid');
      if(s.display==='flex'&&s.justifyContent==='space-between')el.classList.add('responsive-flex');
      if(s.position==='fixed'&&(s.width||s.maxWidth))el.classList.add('responsive-drawer');
      if(el.parentElement?.style.position==='fixed'&&(s.maxWidth||parseInt(s.width)>400))el.classList.add('responsive-dialog');
      if(s.display==='flex'&&s.overflowX==='auto')el.classList.add('responsive-tabs');
      if(palette[s.color])s.color=`var(${palette[s.color]})`;
      if(el.tagName==='BUTTON'&&s.background.includes('var(--primary')){s.background='#4f46d8';s.color='#ffffff';}
      if(el.matches('input,select,textarea'))s.minWidth='0';
    });
    document.querySelectorAll('.content-view table, dialog table').forEach(table=>{
      const parent=table.parentElement;
      if(!parent.classList.contains('table-wrap')&&!parent.classList.contains('responsive-table')){
        if(parent.children.length===1)parent.classList.add('responsive-table');
        else{const wrap=document.createElement('div');wrap.className='responsive-table';table.before(wrap);wrap.append(table);}
      }
      table.parentElement.tabIndex=0;table.parentElement.setAttribute('role','region');table.parentElement.setAttribute('aria-label','Scrollable data table');
    });
    document.querySelectorAll('input:not([type=hidden]),select,textarea').forEach(input=>{if(input.getAttribute('aria-label')||input.labels?.length)return;input.setAttribute('aria-label',input.getAttribute('placeholder')||input.previousElementSibling?.textContent?.trim()||input.name||'Choose an option');});
    document.querySelectorAll('.stat-card[onclick]:not(button)').forEach(el=>{if(el.getAttribute('role')==='button')return;el.setAttribute('role','button');el.tabIndex=0;el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click();}});});
    document.querySelectorAll('[onclick*="scaffoldAction"]').forEach(b=>{b.title='This action requires a connected service.';});
    document.querySelectorAll('button').forEach(button=>{
      if(['✕','×'].includes(button.textContent.trim())){button.setAttribute('aria-label','Close');button.innerHTML='<i data-lucide="x"></i>';}
    });
    document.querySelectorAll('svg').forEach(svg=>{if(!svg.hasAttribute('role')&&!svg.getAttribute('aria-label'))svg.setAttribute('aria-hidden','true');});
    document.querySelectorAll('.responsive-dialog,.responsive-drawer').forEach(dialog=>{
      if(!dialog.querySelector('button,input,select'))return;
      dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');
      dialog.setAttribute('aria-label',dialog.querySelector('h2,h3')?.textContent||'Details');
    });
    const fieldNames={attendanceMetricSelect:'Attendance metric',attendancePeriodSelect:'Analysis period'};
    for(const [id,label] of Object.entries(fieldNames))document.getElementById(id)?.setAttribute('aria-label',label);
    refreshIcons();
  };
  const observer=new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&n.tagName.toLowerCase()!=='svg'))&&!scheduled){scheduled=true;requestAnimationFrame(window.enhanceInterface);}});
  observer.observe(document.querySelector('.app-shell'),{childList:true,subtree:true});
  window.enhanceInterface();
  document.addEventListener('keydown',event=>{
    const dialogs=[...document.querySelectorAll('.responsive-dialog,.responsive-drawer')].filter(d=>d.getClientRects().length&&d.querySelector('button'));
    const dialog=dialogs[dialogs.length-1];if(!dialog)return;
    const controls=[...dialog.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]')].filter(e=>e.getClientRects().length);
    if(event.key==='Escape'){const close=dialog.querySelector('[aria-label="Close"],[aria-label="Close modal"],button[onclick*="close"]');if(close){event.preventDefault();close.click();}}
    if(event.key==='Tab'&&controls.length){const first=controls[0],last=controls[controls.length-1];if(event.shiftKey&&(document.activeElement===first||!dialog.contains(document.activeElement))){event.preventDefault();last.focus();}else if(!event.shiftKey&&(document.activeElement===last||!dialog.contains(document.activeElement))){event.preventDefault();first.focus();}}
  });
  for(const name of ['searchPayrollRegister','updateLeaveFilter']){
    const original=window[name];if(typeof original!=='function')continue;
    window[name]=function(...args){const input=document.activeElement;const textEntry=input?.matches('input[type="text"],input[type="search"]');const placeholder=input?.getAttribute('placeholder'),position=textEntry?input.selectionStart:null;const result=original.apply(this,args);if(textEntry&&placeholder){const replacement=[...document.querySelectorAll('input')].find(el=>el.getAttribute('placeholder')===placeholder);if(replacement&&replacement!==input){replacement.replaceWith(input);input.focus();input.setSelectionRange(position,position);}}return result;};
  }
})();
