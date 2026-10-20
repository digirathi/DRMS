/* Employee payroll reads owned records only. Administrator payroll stays separate. */
(() => {
  'use strict';
  const D=HRDomain,E=EmployeeDomain,U=HRWorkspaceUI,e=escapeHtml;
  const sections=[['slips','Salary Slips','receipt-text','Published monthly statements'],['structure','Salary Structure','chart-pie','Your assigned compensation'],['bank','Bank Account','landmark','Salary payment details']];
  const state={section:'slips',slip:null,sample:false,reveal:false,employeeId:null};
  const employee=()=>!!appState.backendUser&&D.accessRole(appState.role)==='Employee';
  const cash=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
  const period=slip=>new Intl.DateTimeFormat('en-GB',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(Date.UTC(slip.year,slip.month-1,1)));
  function model(){U.permitted(employee());return E.selfPayroll(payrollStore,U.me().id);}
  function syncActor(){const id=U.me().id;if(state.employeeId!==id){Object.assign(state,{employeeId:id,section:'slips',slip:null,sample:false,reveal:false});}}
  const empty=(title,text,icon)=>`<div class="ep-empty">${U.icon(icon)}<h3>${e(title)}</h3><p>${e(text)}</p>${appState.isMockBypass?U.button('Contact HR','ep-help','',false,'message-square'):''}</div>`;
  const amount=n=>new Intl.NumberFormat('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(n)||0);
  const validStatement=r=>['grossPay','totalDeductions','netPay'].every(k=>r[k]!==null&&r[k]!==undefined&&r[k]!==''&&Number.isFinite(Number(r[k])))&&Number(r.grossPay)>=0&&Number(r.totalDeductions)>=0&&Math.abs(Number(r.grossPay)-Number(r.totalDeductions)-Number(r.netPay))<.02;
  function slipMarkup(slip,sample=false){
    const r=slip.item,company=appState.companySettings||{},logo=document.querySelector('.sidebar-brand img')?.src||'assets/digi-rathi-logo-cropped.png';
    const identity=rows=>`<dl>${rows.map(([key,value])=>`<div><dt>${e(key)}</dt><dd>${e(value===null||value===undefined||value===''?'—':value)}</dd></div>`).join('')}</dl>`;
    const left=[['Name',r.name],['Designation',r.designation],['Department',r.department],['Location',r.location],['Effective work days',r.payableDays],['LOP days',r.lwpDays]];
    const right=[['Employee ID',r.employeeId],['PAN No.',r.statutory?.pan||r.pan],['UAN',r.statutory?.uan||r.uan]];
    const earnings=[['Basic',r.basic],['HRA',r.hra],['Special allowance',r.special],['Bonus',r.bonus],['Overtime',r.overtime],['Reimbursement',r.reimbursement]],deductions=[['PF employee',r.epfEmployee],['Professional tax',r.pt],['ESIC employee',r.esicEmployee],['TDS',r.tds],['Loss of pay',r.lwpDeduction],['Late attendance',r.lateDeduction||0],['Other deductions',r.adhocDeduction]];
    const payTable=(title,rows,totalLabel,total)=>`<div><table><thead><tr><th>${title}</th><th>Amount (₹)</th></tr></thead><tbody>${rows.map(([name,value])=>`<tr><td>${e(name)}</td><td>${amount(value)}</td></tr>`).join('')}</tbody><tfoot><tr><td>${totalLabel}</td><td>${amount(total)}</td></tr></tfoot></table></div>`;
    return `<article class="ep-payslip-paper" id="epSlipPaper" aria-label="${sample?'Salary slip format preview':'Salary slip for '+e(period(slip))}">${sample?'<p class="ep-paper-preview">FORMAT PREVIEW · Sample details only · This is not a published salary slip</p>':''}<header class="ep-paper-head"><img class="ep-paper-logo" src="${e(logo)}" alt="Company logo"><h2>${e(company.companyName||'Digi Rathi')}</h2>${company.officeAddress?`<p>${e(company.officeAddress)}</p>`:''}${company.cin?`<p>CIN: ${e(company.cin)}</p>`:''}</header><h3 class="ep-paper-title">Payslip for the Month of ${e(period(slip))}</h3><div class="ep-paper-details">${identity(left)}${identity(right)}</div><div class="ep-paper-pay">${payTable('Earnings',earnings,'Total earnings',r.grossPay)}${payTable('Deductions',deductions,'Total deductions',r.totalDeductions)}</div><div class="ep-paper-net"><div><span>PF employer</span><span>${amount(r.epfEmployer)}</span></div><div><span>Net pay for the month</span><strong>${amount(r.netPay)}</strong></div></div><p class="ep-paper-words">(${e(E.rupeesInWords(r.netPay))})</p><footer class="ep-paper-footer">This is a system-generated payslip and does not require a signature.</footer></article>`;
  }
  function salarySlips(data){
    const heading='<header class="ep-section-head"><div><h3>Salary Slips</h3><p>Only finalized, published statements for your employee ID appear here.</p></div></header>';
    if(!data.slips.length&&!state.sample)return heading+empty('No salary slips published yet','HR must finalize and publish a payroll cycle before your salary slip becomes available. Draft and held statements are not shown.','receipt-text');
    if(data.slips.length)state.sample=false;
    const slip=data.slips.find(s=>s.key===state.slip)||data.slips[0];state.slip=slip.key;
    if(!validStatement(slip.item))return heading+empty('Salary slip needs review','The published statement contains incomplete or inconsistent totals. Ask HR to review it before printing.','circle-alert');
    const index=data.slips.findIndex(s=>s.key===slip.key),years=[...new Set(data.slips.map(s=>String(s.year)))],months=data.slips.filter(s=>s.year===slip.year);
    const nav=(label,action,disabled,icon)=>U.button(label,action,'',false,icon).replace('<button ',`<button ${disabled?'disabled ':''}`);
    return heading+`<div class="ep-slip-toolbar"><label>Year<select id="epYear" aria-label="Payslip year" ${state.sample?'disabled':''}>${U.options(state.sample?[String(slip.year)]:years,String(slip.year))}</select></label><label>Month<select id="epMonth" aria-label="Payslip month" ${state.sample?'disabled':''}>${U.options((state.sample?[slip]:months).map(s=>[s.key,new Intl.DateTimeFormat('en-GB',{month:'long',timeZone:'UTC'}).format(new Date(Date.UTC(s.year,s.month-1,1)))]),slip.key)}</select></label><div class="ep-period-nav">${nav('Previous','ep-slip-prev',state.sample||index>=data.slips.length-1,'chevron-left')}${nav('Next','ep-slip-next',state.sample||index<=0,'chevron-right')}</div>${U.button(state.sample?'Print sample format':'Print / Save PDF','ep-slip-print','',false,'printer')}</div>${state.sample?'<p class="ep-sample-note">Layout preview only. The employee details and zero amounts below are placeholders. Your actual statement appears here after publication.</p>':'<p class="ep-caption">Available months contain published salary slips only. Publication does not confirm a salary transfer.</p>'}<p class="ep-paper-mobile-hint">Swipe horizontally inside the paper to view the complete statement.</p><div class="ep-paper-scroller" tabindex="0" role="region" aria-label="Scrollable salary slip">${slipMarkup(slip,state.sample)}</div>`;
  }
  function salaryStructure(data){
    const {profile,structure,monthlyGross,components}=data;
    if(!profile||!structure)return `<header class="ep-section-head"><div><h3>Salary Structure</h3><p>Your assigned earnings breakdown.</p></div></header>${empty('Salary structure not assigned','No compensation structure is linked to your employee ID. Contact HR to add or confirm your salary details.','chart-pie')}`;
    if(!components.length)return empty('Salary details need review','Your assigned compensation is incomplete. HR needs to confirm the monthly gross and salary components.','circle-alert');
    return `<header class="ep-section-head"><div><span class="ew-eyebrow">Assigned structure</span><h3>${e(structure.name)}</h3><p>${e(structure.description||'Your fixed monthly earnings breakdown.')}</p></div><span class="ep-badge">Managed by HR</span></header><div class="ep-amounts"><div><span>Monthly gross</span><strong>${cash(monthlyGross)}</strong></div><div><span>Annual gross</span><strong>${cash(monthlyGross*12)}</strong></div></div><div class="ep-component-table" role="region" aria-label="Salary components" tabindex="0"><table><thead><tr><th>Component</th><th>Share</th><th>Monthly amount</th></tr></thead><tbody>${components.map(c=>`<tr><td>${e(c.name)}</td><td>${c.percent}%</td><td>${cash(c.amount)}</td></tr>`).join('')}<tr class="ep-total"><th scope="row">Total earnings</th><td>100%</td><td>${cash(monthlyGross)}</td></tr></tbody></table></div><p class="ep-caption">Gross earnings are before deductions. Annual gross excludes employer contributions and variable pay. Your published salary slip shows the actual pay for each month.</p><div class="module-actions">${U.button('Ask HR about compensation','ep-help','',false,'message-square')}</div>`;
  }
  function bankAccount(data){
    const bank=data.bank;
    if(!bank||!Object.values(bank).some(v=>v!==null&&v!==undefined&&String(v).trim()))return `<header class="ep-section-head"><div><h3>Bank Account</h3><p>The account held on your payroll profile.</p></div></header>${empty('No bank account added','Your payroll profile does not contain bank account details. Ask HR to add or verify your salary payment account.','landmark')}`;
    const account=String(bank.accountNumber||'').trim();
    return `<header class="ep-section-head"><div><h3>Bank Account</h3><p>Salary payment details on file. This does not indicate bank verification.</p></div><span class="ep-badge">Private to your account</span></header><div class="ep-bank-number"><span>Account number</span><strong>${e(state.reveal?account||'Not provided':E.maskedAccount(account))}</strong>${account?`<button type="button" class="secondary-button" data-module-action="ep-bank-toggle" aria-pressed="${state.reveal}">${U.icon(state.reveal?'eye-off':'eye')}${state.reveal?'Hide account number':'Show account number'}</button>`:''}</div>${U.details([['Bank name',bank.bankName||'Not provided'],['Account holder',bank.accountHolderName||bank.holderName||'Not provided'],['IFSC',bank.ifsc||'Not provided'],['Account type',bank.accountType||'Not provided']])}<p class="ep-caption">Bank changes are managed by HR. Do not include a full account number, PIN, password, or OTP in a support ticket.</p><div class="module-actions">${U.button('Request bank detail update','ep-help','',false,'message-square')}</div>`;
  }
  function render(){
    if(!employee())return;
    const root=document.getElementById('payroll');if(!root)return;
    syncActor();const data=appState.isMockBypass?model():null;
    const content=!data?empty('Payroll service unavailable','Your payroll service is not connected. Salary and bank records cannot be loaded yet.','cloud-off'):state.section==='slips'?salarySlips(data):state.section==='structure'?salaryStructure(data):bankAccount(data);
    root.innerHTML=`<div class="employee-payroll"><header class="ep-page-head"><div><span class="ew-eyebrow">Employee self-service</span><h2>My payroll</h2><p>Salary statements, compensation and bank details for ${e(U.me().name)}.</p></div><span class="ep-badge">${U.icon('shield-check')}${e(U.me().id)}</span></header><div class="ep-tabs" role="tablist" aria-label="My payroll sections">${sections.map(([id,label,icon,desc])=>`<button id="ep-tab-${id}" type="button" role="tab" aria-selected="${state.section===id}" aria-controls="epPanel" tabindex="${state.section===id?'0':'-1'}" data-module-action="ep-tab" data-id="${id}">${U.icon(icon)}<span><strong>${label}</strong><small>${desc}</small></span></button>`).join('')}</div>${appState.isMockBypass?'<p class="ep-demo">Demo workspace · Only records linked to your employee ID are shown. Changes reset on reload.</p>':''}<section class="ep-panel" id="epPanel" role="tabpanel" aria-labelledby="ep-tab-${state.section}" tabindex="0">${content}</section></div>`;
    document.getElementById('epYear')?.addEventListener('change',ev=>{state.slip=model().slips.find(s=>String(s.year)===ev.target.value)?.key||null;render();});
    document.getElementById('epMonth')?.addEventListener('change',ev=>{ownSlip(ev.target.value);state.slip=ev.target.value;render();});
    root.querySelector('.ep-tabs')?.addEventListener('keydown',ev=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(ev.key)||ev.target.getAttribute('role')!=='tab')return;ev.preventDefault();const index=sections.findIndex(s=>s[0]===state.section),next=ev.key==='Home'?0:ev.key==='End'?2:(index+(ev.key==='ArrowRight'?1:2))%3;selectSection(sections[next][0]);});
    refreshIcons();
  }
  function selectSection(section){U.permitted(employee());D.requireValue(sections.some(s=>s[0]===section),'Choose a valid payroll section.');syncActor();state.section=section;state.reveal=false;render();document.getElementById('ep-tab-'+section)?.focus();}
  function open(section='slips'){U.permitted(employee());syncActor();state.section=section;state.reveal=false;U.actions.close();setView('payroll');render();}
  function ownSlip(key){const slip=model().slips.find(s=>s.key===key);D.requireValue(slip,'This salary slip is not available for your account.');return slip;}
  function printSlip(){
    U.permitted(employee());const slip=state.sample?sampleSlip():ownSlip(state.slip);D.requireValue(validStatement(slip.item),'This statement needs review before printing.');const css=new URL('employee-payroll.css',window.location.href).href,popup=window.open('','_blank');
    D.requireValue(popup,'Allow the print window to open, then try again.');
    popup.document.open();popup.document.write(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${e(state.sample?'Sample payslip format':'Payslip '+period(slip))}</title><link rel="stylesheet" href="${e(css)}"><style>body{margin:0;background:#fff}.ep-payslip-paper{min-width:0;max-width:none;border:0;padding:0;width:100%}</style></head><body>${slipMarkup(slip,state.sample)}<script>window.addEventListener('load',()=>window.print());<\/script></body></html>`);popup.document.close();
  }
  function openSlip(key){ownSlip(key);syncActor();state.slip=key;state.sample=false;open();}
  Object.assign(U.actions,{
    'ep-tab':selectSection,
    'ep-bank-toggle':()=>{syncActor();D.requireValue(model().bank?.accountNumber,'No account number is recorded.');state.reveal=!state.reveal;render();},
    'ep-slip-open':key=>{ownSlip(key);U.actions['ew-payslip'](key);},
    'ep-slip-download':key=>{ownSlip(key);U.actions['ew-slip-download'](key);},
    'ep-slip-prev':()=>{const data=model(),i=data.slips.findIndex(s=>s.key===state.slip);D.requireValue(i>=0&&i<data.slips.length-1,'No earlier published salary slip.');state.slip=data.slips[i+1].key;render();},
    'ep-slip-next':()=>{const data=model(),i=data.slips.findIndex(s=>s.key===state.slip);D.requireValue(i>0,'No later published salary slip.');state.slip=data.slips[i-1].key;render();},
    'ep-slip-print':printSlip,
    'ep-help':()=>{U.permitted(employee());U.actions['ticket-new']();const category=document.querySelector('#moduleDialog [name="category"]'),subject=document.querySelector('#moduleDialog [name="title"]');if(category)category.value='Payroll query';if(subject)subject.value=state.section==='bank'?'Bank account update request':state.section==='structure'?'Salary structure query':'Salary slip query';}
  });
  const originalRender=window.renderPayroll,originalSuite=window.renderPayrollSuite,originalView=window.setView,originalHistory=U.actions['ew-payslips'];
  window.renderPayroll=function(...args){if(employee())return render();state.reveal=false;state.employeeId=null;return originalRender.apply(this,args);};
  window.renderPayrollSuite=function(...args){if(employee())return render();state.reveal=false;state.employeeId=null;return originalSuite.apply(this,args);};
  window.setView=function(view,...args){if(view!=='payroll')state.reveal=false;const result=originalView.call(this,view,...args);if(view==='payroll'&&appState.activeView==='payroll'&&employee())render();return result;};
  U.actions['ew-payslips']=()=>employee()?open():originalHistory();
  const originalSlip=U.actions['ew-payslip'];
  U.actions['ew-payslip']=key=>employee()?openSlip(key):originalSlip(key);
  const originalEmployeePayslips=window.openEmployeePayslips;
  window.openEmployeePayslips=()=>employee()?open():originalEmployeePayslips();
  window.EmployeePayroll={render,open,selectSection,model};
})();
