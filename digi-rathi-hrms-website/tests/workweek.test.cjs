const test=require('node:test'),assert=require('node:assert/strict'),D=require('../domain.js');
const policy=(pattern,fifth=false,effective='2026-01-01')=>[{pattern,fifth,effective}];
test('weekend patterns use the ordinal Saturday within each month',()=>{
 for(const [date,odd,even] of [['2026-08-01',true,false],['2026-08-08',false,true],['2026-08-15',true,false],['2026-08-22',false,true],['2026-08-29',false,false]]){assert.equal(D.weekOff(date,policy('ODD')),odd);assert.equal(D.weekOff(date,policy('EVEN')),even);}
 assert.equal(D.weekOff('2026-08-29',policy('EVEN',true)),true);
 assert.equal(D.weekOff('2026-08-29',policy('SUNDAY',true)),false);
 assert.equal(D.weekOff('2026-08-30',policy('EVEN')),true);
 assert.equal(D.weekOff('2026-08-28',policy('ALL')),false);
});
test('schedule changes only apply from their effective date',()=>{
 const schedules=[{effective:'1900-01-01',pattern:'ALL'},...policy('EVEN',false,'2026-08-10')];
 assert.equal(D.weekOff('2026-08-01',schedules),true);
 assert.equal(D.weekOff('2026-08-15',schedules),false);
 assert.equal(D.weekOff('2026-08-22',schedules),true);
});
test('configured Saturdays affect unpaid leave consistently with excluded weekends',()=>{
 const requests=[{employeeId:'E1',isPaid:false,status:'APPROVED',startDate:'2026-08-01',endDate:'2026-08-31',dayType:'FULL_DAY',leaveTypeId:'unpaid'}];
 const types=[{id:'unpaid',weekendsBetweenLeave:'NOT_CONSIDERED',holidaysBetweenLeave:'NOT_CONSIDERED'}];
 assert.equal(D.lwpDays(requests,'E1',8,2026,types,[],policy('ALL')),21);
 assert.equal(D.lwpDays(requests,'E1',8,2026,types,[],policy('ODD')),24);
 assert.equal(D.lwpDays(requests,'E1',8,2026,types,[],policy('ODD',true)),23);
 assert.equal(D.lwpDays(requests,'E1',8,2026,types,[{date:'2026-08-03',isActive:true}],policy('ODD')),23);
});
