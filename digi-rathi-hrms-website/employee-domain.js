/* Personal workspace rules. All attendance instants use the company timezone. */
(function(root){
  'use strict';
  const D=typeof module==='object'?require('./domain.js'):root.HRDomain;
  const zone='Asia/Kolkata',pending=['PENDING_APPROVAL','MORE_INFORMATION_REQUIRED'];
  function timestamp(value){if(value===null||value===undefined||value==='')return null;const n=value instanceof Date?value.getTime():typeof value==='number'?value:Date.parse(value);return Number.isFinite(n)?n:null;}
  function companyDate(value=Date.now()){const n=timestamp(value);if(n===null)return '';const parts=new Intl.DateTimeFormat('en-GB',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(n),get=k=>parts.find(p=>p.type===k).value;return `${get('year')}-${get('month')}-${get('day')}`;}
  function companyTime(value){const n=timestamp(value);return n===null?'—':new Intl.DateTimeFormat('en-GB',{timeZone:zone,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(n);}
  function addDays(day,n){const date=new Date(day+'T12:00:00Z');date.setUTCDate(date.getUTCDate()+n);return date.toISOString().slice(0,10);}
  function instant(day,time){const m=D.time(time);return D.isoDate(day)&&m!==null?Date.parse(`${day}T${D.clock(m)}:00+05:30`):null;}
  function shift(day,value){const times=String(value||'').match(/\d{1,2}:\d{2}(?:\s*[AP]M)?/gi);if(!times||times.length!==2)return null;const a=D.time(times[0]),b=D.time(times[1]);if(a===null||b===null||a===b)return null;return {start:instant(day,D.clock(a)),end:instant(b<a?addDays(day,1):day,D.clock(b)),minutes:(b-a+1440)%1440};}
  function normalize(record,shiftValue,now=Date.now()){
    if(!record)return {date:companyDate(now),checkInAt:null,checkOutAt:null,mode:'OFFICE'};
    const date=D.isoDate(record.date)||companyDate(record.checkInAt)||companyDate(now),start=timestamp(record.checkInAt)??instant(date,record.clockIn),end=timestamp(record.checkOutAt)??instant(date,record.clockOut);
    const window=shift(date,shiftValue);const out=end!==null&&start!==null&&end<start&&window&&companyDate(window.end)>date?end+86400000:end;
    return {...record,date,checkInAt:start,checkOutAt:out,mode:record.mode||record.workMode||'OFFICE'};
  }
  function attendance(record,{now=Date.now(),fullLeave=false,off=false,shiftValue=''}={}){
    const r=normalize(record,shiftValue,now),start=r.checkInAt,end=r.checkOutAt,window=shift(r.date,shiftValue);
    let state='READY';
    if(end!==null&&(start===null||end<start)||start!==null&&start>now||end!==null&&end>now)state='INVALID';
    else if(fullLeave&&(start!==null||end!==null))state='CONFLICT';
    else if(end!==null&&start!==null)state='COMPLETE';
    else if(start!==null)state=now-start>86400000?'MISSING_OUT':'ACTIVE';
    else if(fullLeave)state='LEAVE';
    else if(off)state='OFF';
    const minutes=start!==null?Math.max(0,Math.floor(((end??now)-start)/60000)):0;
    const issue=state==='INVALID'?(start!==null&&start>now||end!==null&&end>now?'A recorded punch is later than the current company time.':start===null?'A clock-out is recorded without a clock-in.':'Clock-out is earlier than clock-in.'):state==='CONFLICT'?'A recorded punch overlaps approved full-day leave.':state==='MISSING_OUT'?'This shift has been open for more than 24 hours.':'';
    return {record:r,state,issue,minutes,duration:D.clock(minutes),shift:window,progress:window?Math.min(100,Math.round(minutes/window.minutes*100)):0,canIn:state==='READY'||state==='OFF',canOut:state==='ACTIVE'};
  }
  function owns(record,id){return !!id&&!!record&&[record.employeeId,record.employeeCode,record.requesterId].some(v=>v!==undefined&&String(v)===String(id));}
  function balance(id,type,balances,requests,excludeId){const b=balances.find(r=>owns(r,id)&&r.leaveTypeId===type),reserved=requests.filter(r=>r.id!==excludeId&&owns(r,id)&&r.leaveTypeId===type&&pending.includes(r.status)).reduce((n,r)=>n+Number(r.totalDays||0),0);return {assigned:!!b,available:b?Number(b.availableBalance):0,reserved,remaining:b?Number(b.availableBalance)-reserved:0,used:b?Number(b.used||0):0};}
  function overlaps(requests,id,start,end,dayType,excludeId){return requests.some(r=>r.id!==excludeId&&owns(r,id)&&[...pending,'APPROVED','CANCELLATION_REQUESTED'].includes(r.status)&&r.startDate<=end&&r.endDate>=start&&(dayType==='FULL_DAY'||!r.dayType||r.dayType==='FULL_DAY'||r.dayType===dayType));}
  function slips(store,id){const selected=store.selectedYear+'-'+store.selectedMonth,cycles={...(store.cycles||{}),[selected]:store};return Object.entries(cycles).flatMap(([key,c])=>{if(c.currentRunStatus!=='FINALIZED'||!c.payslipsPublished)return [];const item=c.lockedItems?.find(r=>r.employeeId===id&&!r.isOnHold);return item?[{key,item,year:Number(key.split('-')[0]),month:Number(key.split('-')[1])}]:[];}).sort((a,b)=>b.year-a.year||b.month-a.month);}
  function notificationVisible(item,role,id){return Array.isArray(item.roles)&&item.roles.includes(role)&&(!!item.recipientId?item.recipientId===id:item.audience==='company'||['Super Admin','HR Admin'].includes(role));}
  function selfPayroll(store,id){
    if(!id)return {profile:null,structure:null,monthlyGross:null,components:[],bank:null,slips:[]};
    const profile=store.profiles?.find(p=>p.employeeId!==null&&p.employeeId!==undefined&&String(p.employeeId)===String(id))||null;
    const structure=profile?store.structures?.find(s=>s.id===profile.structureId)||null:null;
    const gross=profile?.monthlyGross,monthlyGross=gross!==null&&gross!==undefined&&gross!==''&&Number.isFinite(Number(gross))&&Number(gross)>=0?Number(gross):null;
    const valid=structure&&['basicPct','hraPct','specialPct'].every(k=>Number.isFinite(Number(structure[k]))&&Number(structure[k])>=0)&&Math.abs(Number(structure.basicPct)+Number(structure.hraPct)+Number(structure.specialPct)-100)<.001;
    const basic=valid&&monthlyGross!==null?Math.round(monthlyGross*Number(structure.basicPct)/100):null,hra=valid&&monthlyGross!==null?Math.round(monthlyGross*Number(structure.hraPct)/100):null;
    const components=basic===null?[]:[{name:'Basic salary',percent:Number(structure.basicPct),amount:basic},{name:'House rent allowance',percent:Number(structure.hraPct),amount:hra},{name:'Special allowance',percent:Number(structure.specialPct),amount:monthlyGross-basic-hra}];
    return {profile,structure,monthlyGross,components,bank:profile?.bankDetails||null,slips:slips(store,id)};
  }
  function maskedAccount(value){const account=String(value||'').trim();return account.length>4?'•••• •••• '+account.slice(-4):account?'••••':'Not provided';}
  function rupeesInWords(value){
    const number=Number(value);if(!Number.isFinite(number)||Math.abs(number)>999999999999)return 'Amount unavailable';
    const ones=['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'],tens=['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
    const words=n=>{if(n<20)return ones[n];if(n<100)return tens[Math.floor(n/10)]+(n%10?' '+ones[n%10]:'');for(const [scale,label] of [[10000000,'Crore'],[100000,'Lakh'],[1000,'Thousand'],[100,'Hundred']])if(n>=scale)return words(Math.floor(n/scale))+' '+label+(n%scale?' '+words(n%scale):'');};
    const amount=Math.round(Math.abs(number)*100),rupees=Math.floor(amount/100),paise=amount%100;
    return (number<0?'Minus ':'')+'Rupees '+words(rupees)+(paise?' and '+words(paise)+' Paise':'')+' Only';
  }
  const api={zone,timestamp,companyDate,companyTime,addDays,instant,shift,normalize,attendance,owns,balance,overlaps,slips,notificationVisible,selfPayroll,maskedAccount,rupeesInWords};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.EmployeeDomain=api;
})(typeof window==='undefined'?this:window);
