/* Shared attendance rules. Browser previews and the local server use the same calculations. */
(function(root){
  'use strict';
  const fail=(ok,message)=>{if(!ok)throw new Error(message);};
  const defaults={gracePeriodMins:30,requiredWorkingHours:9,lateDaysThreshold:4,penaltyAction:'Full Day',deductionsEnabled:false};
  function policy(v={}){
    const p={gracePeriodMins:Number(v.gracePeriodMins),requiredWorkingHours:Number(v.requiredWorkingHours),lateDaysThreshold:Number(v.lateDaysThreshold),penaltyAction:v.penaltyAction,deductionsEnabled:v.deductionsEnabled===true};
    fail(Number.isInteger(p.gracePeriodMins)&&p.gracePeriodMins>=0&&p.gracePeriodMins<=120,'Grace period must be 0–120 whole minutes.');
    fail(Number.isFinite(p.requiredWorkingHours)&&p.requiredWorkingHours>=1&&p.requiredWorkingHours<=24,'Shift duration must be 1–24 hours.');
    fail(Number.isInteger(p.lateDaysThreshold)&&p.lateDaysThreshold>=1&&p.lateDaysThreshold<=5,'Late-day limit must be 1–5 whole days.');
    fail(['Half Day','Full Day'].includes(p.penaltyAction),'Choose a half-day or full-day deduction.');return p;
  }
  function time(v){const m=String(v||'').match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);if(!m)return null;let h=+m[1],n=+m[2];if(n>59||h>23||m[3]&&(h<1||h>12))return null;if(m[3])h=h%12+(m[3].toUpperCase()==='PM'?12:0);return h*60+n;}
  function shiftStart(v){const m=String(v||'').match(/\d{1,2}:\d{2}(?:\s*[AP]M)?/i);return m?time(m[0]):null;}
  function companyDate(now=Date.now()){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);}
  function dayStatus(row,p,shift){
    const shiftTimes=String(shift||'').match(/\d{1,2}:\d{2}(?:\s*[AP]M)?/gi),start=shiftStart(shift),shiftEnd=shiftTimes?.[1]?time(shiftTimes[1]):null,inside=time(row.clockIn),outside=time(row.clockOut);
    if(start===null||inside===null)return {late:false,complete:false,short:false,minutes:0};
    const stamp=v=>typeof v==='number'?v:Date.parse(v),duration=row.checkInAt&&row.checkOutAt?(stamp(row.checkOutAt)-stamp(row.checkInAt))/60000:outside===null||outside<inside&&!(shiftEnd!==null&&shiftEnd<start)?null:(outside-inside+1440)%1440;
    const complete=duration!==null&&duration>0&&duration<=24*60;
    const delta=inside-start+(shiftEnd!==null&&shiftEnd<start&&inside<shiftEnd?1440:0);
    const late=delta>p.gracePeriodMins;
    return {late,complete,short:complete&&duration<p.requiredWorkingHours*60,minutes:complete?duration:0};
  }
  function monthly({records=[],employeeId,month,year,shift,policy:p=defaults,excludedDates=[],isOff=()=>false,now=Date.now()}){
    const prefix=year+'-'+String(month).padStart(2,'0')+'-',days=new Map(),excluded=new Set(excludedDates),today=companyDate(now),pending=['PENDING_REVIEW','MORE_INFO_REQUIRED','MORE_INFORMATION_REQUIRED'];
    for(const r of records){if(!r||Array.isArray(r)||String(r.employeeId)!==String(employeeId)||!/^\d{4}-\d{2}-\d{2}$/.test(r.date||'')||!r.date.startsWith(prefix)||r.date>today)continue;
      const prior=days.get(r.date);if(!prior)days.set(r.date,r);else if(['clockIn','clockOut'].some(k=>time(prior[k])!==time(r[k])))days.set(r.date,{...prior,conflict:true});
    }
    const lateDates=[],pendingDates=[],shortDates=[];
    for(const [date,r] of days){if(excluded.has(date)||isOff(date)||r.status==='ON_LEAVE')continue;const status=dayStatus(r,p,r.shift||shift);if(r.conflict||pending.includes(r.correctionStatus)||!status.complete){pendingDates.push(date);continue;}if(status.late)lateDates.push(date);if(status.short)shortDates.push(date);}
    lateDates.sort();const groups=Math.floor(lateDates.length/p.lateDaysThreshold),deductionDays=p.deductionsEnabled?groups*(p.penaltyAction==='Half Day'?.5:1):0;
    return {lateDays:lateDates.length,lateDates,shortDates,pendingDates,groups,deductionDays,remaining:p.lateDaysThreshold-lateDates.length%p.lateDaysThreshold};
  }
  function validIp(value){
    const v4=s=>/^\d{1,3}(\.\d{1,3}){3}$/.test(s)&&s.split('.').every(n=>Number(n)<=255&&(n==='0'||!n.startsWith('0')));
    if(v4(value))return true;let s=String(value);if(s.includes('.')){const at=s.lastIndexOf(':');if(!v4(s.slice(at+1)))return false;s=s.slice(0,at+1)+'0:0';}
    if(!/^[0-9a-f:]+$/i.test(s)||s.includes(':::')||s.split('::').length>2)return false;const groups=s.split(':').filter(Boolean);return groups.every(g=>g.length<=4)&&(s.includes('::')?groups.length<8:groups.length===8&&!s.startsWith(':')&&!s.endsWith(':'));
  }
  function office(v){
    const r={requireGps:v.requireGps===true,requireIp:v.requireIp===true,lat:Number(v.lat||0),lng:Number(v.lng||0),radiusMeters:Number(v.radiusMeters===undefined?150:v.radiusMeters),maxAccuracyMeters:Number(v.maxAccuracyMeters===undefined?100:v.maxAccuracyMeters),ips:String(v.ips||'').split(',').map(x=>x.trim()).filter(Boolean)};
    if(r.requireGps){fail(v.lat!==undefined&&v.lng!==undefined&&v.lat!==null&&v.lng!==null&&String(v.lat).trim()!==''&&String(v.lng).trim()!=='','Enter the office latitude and longitude.');fail(Number.isFinite(r.lat)&&r.lat>=-90&&r.lat<=90&&Number.isFinite(r.lng)&&r.lng>=-180&&r.lng<=180,'Enter valid office coordinates.');fail(Number.isFinite(r.radiusMeters)&&r.radiusMeters>=25&&r.radiusMeters<=5000,'Office radius must be 25–5,000 metres.');fail(Number.isFinite(r.maxAccuracyMeters)&&r.maxAccuracyMeters>=10&&r.maxAccuracyMeters<=1000,'GPS accuracy limit must be 10–1,000 metres.');}
    fail(!r.requireIp||r.ips.length>0,'Enter at least one office IP address.');fail(r.ips.every(validIp),'Enter valid IPv4 or IPv6 addresses, separated by commas.');return r;
  }
  function distance(a,b,c,d){const rad=x=>x*Math.PI/180,x=Math.sin(rad(c-a)/2)**2+Math.cos(rad(a))*Math.cos(rad(c))*Math.sin(rad(d-b)/2)**2;return 6371000*2*Math.atan2(Math.sqrt(x),Math.sqrt(Math.max(0,1-x)));}
  function verifyOffice(settings,position,observedIp,now=Date.now()){
    fail(settings.requireGps||settings.requireIp,'Office verification is not configured. Ask Super Admin to configure GPS or network verification before using WFO.');
    if(settings.requireIp)fail(settings.ips.includes(observedIp),'Your connection is outside the approved office network. Use the office network or request a correction.');
    if(settings.requireGps){fail(position&&['latitude','longitude','accuracy','timestamp'].every(k=>Number.isFinite(position[k])),'A fresh GPS position is required for WFO.');fail(position.latitude>=-90&&position.latitude<=90&&position.longitude>=-180&&position.longitude<=180,'GPS coordinates are invalid.');fail(position.accuracy>=0&&position.accuracy<=settings.maxAccuracyMeters,'GPS accuracy is too low. Retry outdoors or near a window.');fail(now-position.timestamp<=120000&&position.timestamp-now<=30000,'Your location expired. Retry clock-in.');fail(distance(settings.lat,settings.lng,position.latitude,position.longitude)+position.accuracy<=settings.radiusMeters,'Your location cannot be confirmed inside the office boundary. Move closer to the office and retry.');}
    return settings.requireGps?(settings.requireIp?'IP_AND_GPS_VERIFIED':'GPS_VERIFIED'):'IP_VERIFIED';
  }
  const api={defaults,policy,time,shiftStart,dayStatus,monthly,office,distance,verifyOffice,companyDate};if(typeof module==='object')module.exports=api;else root.AttendancePolicy=api;
})(typeof window==='undefined'?this:window);
