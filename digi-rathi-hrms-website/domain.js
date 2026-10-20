/* Pure business rules shared by the local workspace and regression tests. */
(function(root){
  'use strict';
  const P=typeof module==='object'?require('./attendance-policy.js'):root.AttendancePolicy;
  const requireValue=(condition,message)=>{if(!condition)throw new Error(message);};
  function isoDate(value){
    if(value instanceof Date){if(Number.isNaN(value.getTime()))return '';return `${value.getFullYear()}-${String(value.getMonth()+1).padStart(2,'0')}-${String(value.getDate()).padStart(2,'0')}`;}
    const s=String(value||'').trim();let y,m,d;
    let match=s.match(/^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/);
    if(match)[,y,m,d]=match;else {match=s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);if(match)[,d,m,y]=match;else return '';}
    const date=new Date(Number(y),Number(m)-1,Number(d));
    return date.getFullYear()===Number(y)&&date.getMonth()+1===Number(m)&&date.getDate()===Number(d)?`${y}-${m}-${d}`:'';
  }
  function date(value){const iso=isoDate(value);return iso?`${iso.slice(8,10)}/${iso.slice(5,7)}/${iso.slice(0,4)}`:'—';}
  function reason(value,min=5){const text=String(value||'').trim();requireValue(text.length>=min&&text.length<=500,`Enter ${min}–500 characters for the reason or feedback.`);return text;}
  function time(value){const m=String(value||'').trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);if(!m)return null;let h=+m[1],n=+m[2];if(n>59||h>23||m[3]&&(h<1||h>12))return null;if(m[3])h=h%12+(m[3].toUpperCase()==='PM'?12:0);return h*60+n;}
  const clock=n=>`${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
  function correction(values){const day=isoDate(values.date),start=time(values.clockIn),end=time(values.clockOut);requireValue(day,'Enter a valid date in DD/MM/YYYY format.');requireValue(day<=isoDate(new Date()),'Attendance corrections cannot be future dated.');requireValue(start!==null&&end!==null,'Enter valid clock-in and clock-out times.');requireValue(end>start,'Clock-out must be after clock-in on the same day.');requireValue(Date.parse(day+'T'+clock(end)+':00+05:30')<=Date.now(),'Corrections cannot propose future punch times in company time.');requireValue(['OFFICE','WFH'].includes(values.workMode),'Choose Office or Work from home.');return {...values,date:day,clockIn:clock(start),clockOut:clock(end),reason:reason(values.reason),workingHours:`${String(Math.floor((end-start)/60)).padStart(2,'0')}h ${String((end-start)%60).padStart(2,'0')}m`};}
  function decideCorrection(request,decision,note,version,record){
    requireValue(request.version===version&&request.status==='PENDING_REVIEW','This request has already changed. Reopen it before making a decision.');
    requireValue(['APPROVED','REJECTED','MORE_INFO_REQUIRED'].includes(decision),'Choose a valid decision.');note=reason(note);
    if(decision==='APPROVED'){
      const proposed=correction({...request.proposed,date:request.date,reason:request.reason});
      requireValue(!record||record.status!=='ON_LEAVE','Full-day leave conflicts with this correction. Resolve the leave first.');
      if(record&&request.original)for(const key of ['clockIn','clockOut','workMode'])requireValue((record[key]||'')===(request.original[key]||''),'Attendance changed after this request. Ask the employee to resubmit.');
      if(record)Object.assign(record,{clockIn:proposed.clockIn,clockOut:proposed.clockOut,workMode:proposed.workMode,workingHours:proposed.workingHours,status:'MANUALLY_CORRECTED'});
    }
    request.status=decision;request.version++;request.decisionNote=note;return request;
  }
  function assetTransition(asset,action,{employeeId,note,condition}={}){
    note=reason(note);
    if(action==='assign'){requireValue(asset.status==='Available','Only available assets can be assigned.');requireValue(employeeId,'Choose an employee.');asset.employeeId=employeeId;asset.status='Assigned';}
    else if(action==='return'){requireValue(asset.status==='Assigned','Only assigned assets can be returned.');asset.employeeId=null;asset.status=condition==='Damaged'?'Maintenance':'Available';}
    else if(action==='maintain'){requireValue(asset.status==='Available','Return assigned equipment before starting maintenance.');asset.status='Maintenance';}
    else if(action==='restore'){requireValue(asset.status==='Maintenance','Only equipment in maintenance can be restored.');asset.status='Available';}
    else if(action==='retire'){requireValue(['Available','Maintenance'].includes(asset.status),'Return the asset before retiring it.');asset.status='Retired';}
    else throw new Error('Unsupported asset action.');return {note,status:asset.status};
  }
  function ticketTransition(ticket,status,note){
    const transitions={Open:['In progress'], 'In progress':['Resolved'],Resolved:['Closed','Open'],Closed:['Open']};
    requireValue(transitions[ticket.status]?.includes(status),'This ticket status changed. Reopen the ticket to continue.');
    if(status==='In progress')requireValue(ticket.assigneeId,'Assign an owner before starting work.');
    note=reason(note);ticket.status=status;ticket.resolution=status==='Resolved'?note:ticket.resolution;return note;
  }
  function structure(values){
    const name=String(values.name||'').trim(),basicPct=Number(values.basicPct),hraPct=Number(values.hraPct),specialPct=Number(values.specialPct);
    requireValue(name.length>=3&&name.length<=100,'Structure name must contain 3–100 characters.');
    requireValue([basicPct,hraPct,specialPct].every(v=>Number.isFinite(v)&&v>=0&&v<=100),'Each salary component must be between 0 and 100%.');
    requireValue(Math.abs(basicPct+hraPct+specialPct-100)<.001,'Basic, HRA and special allowance must add up to 100%.');
    return {name,basicPct,hraPct,specialPct,description:String(values.description||'').trim(),hasEpf:!!values.hasEpf,hasEsic:!!values.hasEsic,hasPt:!!values.hasPt};
  }
  function weekOff(value,schedules=[]){
    const iso=isoDate(value);if(!iso)return false;const d=new Date(iso+'T12:00:00'),day=d.getDay();if(day===0)return true;if(day!==6)return false;
    const policy=[...schedules].filter(s=>s.effective<=iso).sort((a,b)=>b.effective.localeCompare(a.effective))[0]||{pattern:'ALL',fifth:false};
    const ordinal=Math.floor((d.getDate()-1)/7)+1;
    return policy.pattern==='ALL'||policy.pattern==='ODD'&&[1,3].includes(ordinal)||policy.pattern==='EVEN'&&[2,4].includes(ordinal)||ordinal===5&&['ODD','EVEN'].includes(policy.pattern)&&policy.fifth;
  }
  function lwpDays(requests,employeeId,month,year,leaveTypes=[],holidays=[],schedules=[]){
    const last=new Date(year,month,0).getDate(),daily=new Map();
    for(const r of requests){if(![r.employeeId,r.employeeCode].includes(employeeId)||r.isPaid!==false||r.status!=='APPROVED')continue;
      const start=isoDate(r.startDate),end=isoDate(r.endDate);if(!start||!end||end<start)continue;
      const policy=leaveTypes.find(t=>t.id===r.leaveTypeId);
      for(let day=1;day<=last;day++){const d=`${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;if(d>=start&&d<=end){
        const weekDay=new Date(year,month-1,day).getDay();
        if(policy&&weekOff(d,schedules)&&policy.weekendsBetweenLeave!=='CONSIDERED'&&!policy.countWeekends)continue;
        if(policy&&holidays.some(h=>h.date===d&&h.isActive!==false)&&policy.holidaysBetweenLeave!=='CONSIDERED'&&!policy.countHolidays)continue;
        const amount=r.dayType&&r.dayType!=='FULL_DAY'?.5:1;daily.set(d,Math.min(1,(daily.get(d)||0)+amount));}}
    }
    return [...daily.values()].reduce((a,b)=>a+b,0);
  }
  function payroll(emp,store,requests=[]){
    const existing=store.lockedItems?.find(x=>x.employeeId===emp.employeeId);if(store.currentRunStatus==='FINALIZED'&&existing)return {...existing};
    const daysInMonth=new Date(store.selectedYear,store.selectedMonth,0).getDate(),struct=store.structures.find(s=>s.id===emp.structureId);requireValue(struct,'Assign a valid salary structure first.');
    const baseGross=Number(emp.monthlyGross),basic=Math.round(baseGross*struct.basicPct/100),hra=Math.round(baseGross*struct.hraPct/100),special=baseGross-basic-hra;
    const lost=lwpDays(requests,emp.employeeId,store.selectedMonth,store.selectedYear,store.leaveTypes||[],store.holidays||[],store.weekendSchedules||[]),lwpDeduction=Math.round(baseGross*lost/daysInMonth);
    const excludedDates=[];for(const r of requests)if([r.employeeId,r.employeeCode].includes(emp.employeeId)&&['APPROVED','CANCELLATION_REQUESTED'].includes(r.status)){const start=isoDate(r.startDate),end=isoDate(r.endDate);for(let n=1;n<=daysInMonth;n++){const day=store.selectedYear+'-'+String(store.selectedMonth).padStart(2,'0')+'-'+String(n).padStart(2,'0');if(start&&day>=start&&day<=end)excludedDates.push(day);}}
    const cycleStart=store.selectedYear+'-'+String(store.selectedMonth).padStart(2,'0')+'-01',p=store.attendancePolicy&&(!store.attendancePolicy.effective||store.attendancePolicy.effective<=cycleStart)?store.attendancePolicy:P.defaults;
    const late=P.monthly({records:store.attendanceRecords||[],employeeId:emp.employeeId,month:store.selectedMonth,year:store.selectedYear,shift:store.employeeShifts?.[emp.employeeId],policy:p,excludedDates,isOff:day=>weekOff(day,store.weekendSchedules||[])||(store.holidays||[]).some(h=>h.isActive!==false&&isoDate(h.date)===day)}),lateDeduction=Math.round(baseGross*late.deductionDays/daysInMonth),payableDays=Math.max(0,daysInMonth-lost-late.deductionDays);
    const adjs=store.adjustments.filter(a=>a.employeeId===emp.employeeId&&a.month===store.selectedMonth&&a.year===store.selectedYear);
    const sum=type=>adjs.filter(a=>a.type===type).reduce((a,b)=>a+Number(b.amount),0),bonus=sum('BONUS'),reimbursement=sum('REIMBURSEMENT'),overtime=sum('OVERTIME'),adhocDeduction=sum('DEDUCTION');
    const grossPay=baseGross+bonus+overtime+reimbursement,config=store.statutoryConfig,earnedBasic=basic*payableDays/daysInMonth;
    const epfWages=config.epfEnforceCeiling?Math.min(earnedBasic,config.epfWageCeiling):earnedBasic;
    const epfEmployee=config.epfEnabled&&struct.hasEpf?Math.round(epfWages*config.epfRateEe):0,epfEmployer=config.epfEnabled&&struct.hasEpf?Math.round(epfWages*config.epfRateEr):0;
    const esicBase=Math.max(0,grossPay-lwpDeduction-lateDeduction-reimbursement),esicApplies=config.esicEnabled&&struct.hasEsic&&baseGross<=config.esicThreshold;
    const esicEmployee=esicApplies?Math.round(esicBase*config.esicRateEe):0,esicEmployer=esicApplies?Math.round(esicBase*config.esicRateEr):0;
    const pt=config.ptEnabled&&struct.hasPt&&payableDays>0?(store.selectedMonth===2?config.ptFeb:config.ptMonthly):0;
    const tds=Number(emp.monthlyTds||0),totalDeductions=lwpDeduction+lateDeduction+epfEmployee+esicEmployee+pt+tds+adhocDeduction;
    return {...emp,baseGross,daysInMonth,payableDays,lwpDays:lost,basic,hra,special,bonus,reimbursement,overtime,grossPay,lwpDeduction,lateDeduction,lateDays:late.lateDays,lateLopDays:late.deductionDays,epfEmployee,epfEmployer,esicEmployee,esicEmployer,pt,tds,adhocDeduction,totalDeductions,netPay:grossPay-totalDeductions,totalCtcMonth:grossPay-lwpDeduction-lateDeduction+epfEmployer+esicEmployer,isOnHold:store.onHoldEmployees.has(emp.employeeId),status:store.onHoldEmployees.has(emp.employeeId)?'ON_HOLD':store.currentRunStatus};
  }
  function adminRole(value){return String(value||'').trim().toUpperCase().replaceAll(' ','_');}
  function accessRole(value){
    const roles=(Array.isArray(value)?value:[value]).map(adminRole);
    return roles.includes('SUPER_ADMIN')?'Super Admin':roles.includes('HR_ADMIN')?'HR Admin':'Employee';
  }
  const selfPermissions=['ATTENDANCE_READ_SELF','ATTENDANCE_CLOCK','LEAVE_APPLY','DOCUMENT_READ_SELF'];
  function accessPermissions(role,permissions=[]){return [...new Set(permissions)].filter(p=>accessRole(role)!=='Employee'||selfPermissions.includes(p));}
  function canAssignAccess(actor,requested,target){
    const role=adminRole(actor),choice=adminRole(requested),existing=adminRole(target);
    if(existing==='SUPER_ADMIN')return role==='SUPER_ADMIN'&&choice==='SUPER_ADMIN';
    return role==='SUPER_ADMIN'&&['HR_ADMIN','EMPLOYEE'].includes(choice)||role==='HR_ADMIN'&&choice==='EMPLOYEE'&&existing!=='HR_ADMIN';
  }
  function canAdminister(role,actorId,target){
    if(!target||!target.id||!actorId)return false;
    const actor=adminRole(role),protectedRole=['HR_ADMIN','SUPER_ADMIN'].includes(adminRole(target.role));
    return actor==='SUPER_ADMIN'||actor==='HR_ADMIN'&&!protectedRole&&String(target.id)!==String(actorId);
  }
  const api={accessRole,accessPermissions,canAssignAccess,adminRole,canAdminister,requireValue,isoDate,date,reason,time,clock,correction,decideCorrection,assetTransition,ticketTransition,structure,weekOff,lwpDays,payroll};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HRDomain=api;
})(typeof window==='undefined'?this:window);
