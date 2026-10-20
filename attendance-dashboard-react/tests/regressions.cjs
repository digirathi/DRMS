const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const Module=require('node:module');const ts=require('typescript');
require.extensions['.ts']=(module,file)=>module._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText,file);
const resolve=Module._resolveFilename;Module._resolveFilename=function(name,...rest){return resolve.call(this,name.startsWith('@/')?path.join(__dirname,'../src',name.slice(2)):name,...rest);};
const {NextRequest}=require('next/server');const {readDemoIdentity}=require('../src/middleware/demoIdentity.ts');
const data=require('../src/data/mockLeave.ts'),attendance=require('../src/data/mockAttendance.ts');
const approve=require('../src/app/api/admin/leave/requests/[requestId]/approve/route.ts').POST;
const cancel=require('../src/app/api/admin/leave/requests/[requestId]/cancel/route.ts').POST;
const reject=require('../src/app/api/admin/leave/requests/[requestId]/reject/route.ts').POST;
const payroll=require('../src/app/api/admin/payroll/export/bank-payout/route.ts').GET;
const user={id:'test-admin',name:'QA Admin',role:'SUPER_ADMIN'};
function request(body={},role=user.role){return new NextRequest('http://127.0.0.1/api/admin/leave/requests/test',{method:'POST',headers:{'content-type':'application/json','x-user-mock':JSON.stringify({...user,role})},body:JSON.stringify(body)});}
function fixture(status='PENDING_APPROVAL'){
 process.env.NODE_ENV='development';process.env.HRMS_ENABLE_DEMO_AUTH='true';
 data.mockLeaveRequests.splice(0,data.mockLeaveRequests.length,{id:'test',employeeId:'qa',employeeName:'QA Employee',department:'QA',leaveTypeId:'qa-type',leaveTypeName:'Annual',dayType:'FULL_DAY',startDate:'2026-11-02',endDate:'2026-11-03',totalDays:2,status,version:1});
 data.mockLeaveBalances.splice(0,data.mockLeaveBalances.length,{id:'qa-balance',employeeId:'qa',leaveTypeId:'qa-type',availableBalance:status==='PENDING_APPROVAL'?10:8,used:status==='PENDING_APPROVAL'?0:2,pending:status==='PENDING_APPROVAL'?2:0});
 data.mockLeaveTypes.splice(0,data.mockLeaveTypes.length,{id:'qa-type',allowNegativeBalance:false});attendance.mockAttendanceHistoryRecords.length=0;
}
const context={params:{requestId:'test'}};
test('production and default development never accept mock admin identities',async()=>{
 process.env.NODE_ENV='production';process.env.HRMS_ENABLE_DEMO_AUTH='true';assert.equal(readDemoIdentity(request()),undefined);assert.equal((await payroll(request())).status,403);
 assert.equal((await approve(request(),context)).status,403);
 process.env.NODE_ENV='development';delete process.env.HRMS_ENABLE_DEMO_AUTH;assert.equal(readDemoIdentity(request()),undefined);
});
test('leave module rejects HR even in explicitly enabled demo mode',async()=>{fixture();const r=await approve(request({},'HR'),context);assert.equal(r.status,403);assert.deepEqual(await r.json(),{success:false,message:'You do not have permission to access leave management.'});});
test('two concurrent approvals deduct once and only one succeeds',async()=>{fixture();const responses=await Promise.all([approve(request(),context),approve(request(),context)]);assert.deepEqual(responses.map(r=>r.status).sort(),[200,409]);assert.equal(data.mockLeaveBalances[0].availableBalance,8);assert.equal(attendance.mockAttendanceHistoryRecords.length,2);assert.ok(attendance.mockAttendanceHistoryRecords.every(r=>r.status==='ON_LEAVE'));});
test('activity on the last selected date blocks full-day approval',async()=>{fixture();attendance.mockAttendanceHistoryRecords.push({employeeId:'qa',date:'2026-11-03',clockInAt:'2026-11-03T09:00:00Z'});assert.equal((await approve(request(),context)).status,400);assert.equal(data.mockLeaveBalances[0].availableBalance,10);});
test('approved cancellation restores quota once across the full date range',async()=>{fixture();await approve(request(),context);const responses=await Promise.all([cancel(request(),context),cancel(request(),context)]);assert.deepEqual(responses.map(r=>r.status).sort(),[200,409]);assert.equal(data.mockLeaveBalances[0].availableBalance,10);assert.ok(attendance.mockAttendanceHistoryRecords.every(r=>r.status==='NOT_CLOCKED_IN'));});
test('cancelling pending leave never credits unconsumed quota',async()=>{fixture();assert.equal((await cancel(request(),context)).status,200);assert.equal(data.mockLeaveBalances[0].availableBalance,10);assert.equal(data.mockLeaveBalances[0].pending,0);});
test('half-day approval preserves clock activity',async()=>{fixture();Object.assign(data.mockLeaveRequests[0],{dayType:'FIRST_HALF',totalDays:.5});attendance.mockAttendanceHistoryRecords.push({employeeId:'qa',date:'2026-11-02',status:'CLOCKED_IN',clockInAt:'2026-11-02T13:00:00Z'});assert.equal((await approve(request(),context)).status,200);assert.equal(attendance.mockAttendanceHistoryRecords[0].status,'CLOCKED_IN');});
test('invalid rejection reason leaves request and balance unchanged',async()=>{fixture();for(const reason of ['',4,'    ', 'x'.repeat(501)])assert.equal((await reject(request({rejectionReason:reason}),context)).status,400);assert.equal(data.mockLeaveRequests[0].status,'PENDING_APPROVAL');});
test('rejecting a cancellation retains previously approved leave and quota',async()=>{fixture('CANCELLATION_REQUESTED');assert.equal((await reject(request({rejectionReason:'Please retain the original leave'}),context)).status,200);assert.equal(data.mockLeaveRequests[0].status,'APPROVED');assert.equal(data.mockLeaveBalances[0].availableBalance,8);});
