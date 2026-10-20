-- HRMS is served through its authenticated Edge API. No raw application tables
-- are exposed to browser clients. Supabase Auth and Storage remain managed services.
create schema if not exists hrms_private;
revoke all on schema hrms_private from public, anon, authenticated;
grant usage on schema hrms_private to service_role;
set search_path = hrms_private, pg_catalog;

create table employees(
 id text primary key, auth_user_id uuid unique references auth.users(id),
 name text not null check(length(name) between 2 and 100),email text unique not null check(email=lower(email)),
 role text not null check(role in ('SUPER_ADMIN','HR_ADMIN','EMPLOYEE')),
 department text not null,designation text not null,shift text not null,
 monthly_gross numeric(14,2) not null default 0 check(monthly_gross>=0),
 active integer not null default 1 check(active in (0,1)),version integer not null default 1,
 phone text not null default '',avatar_path text,structure_id text
);
create table accounts(employee_id text primary key references employees(id),salt text,password_hash text,
 must_change_password integer not null default 0 check(must_change_password in (0,1)),temp_expires bigint,credential_version integer not null default 1);
create table sessions(token_hash text primary key,employee_id text not null references employees(id),csrf text not null,
 expires bigint not null,auth_tokens text not null,credential_version integer not null);
create index sessions_employee on sessions(employee_id);
create index sessions_expiry on sessions(expires);
create table invitations(token_hash text primary key,employee_id text not null references employees(id),expires bigint not null,used integer not null default 0);
create index invitations_employee on invitations(employee_id);
create table policies(id bigint generated always as identity primary key,kind text not null check(kind in ('late','office','weekend')),effective date not null,payload jsonb not null);
create index policies_effective on policies(kind,effective desc,id desc);
create table attendance(id text primary key,employee_id text not null references employees(id),date date not null,
 check_in timestamptz not null,check_out timestamptz,mode text not null check(mode in ('OFFICE','WFH')),
 verification text not null,shift text not null,version integer not null default 1,
 unique(employee_id,date),check(check_out is null or check_out>check_in));
create unique index attendance_one_open_shift on attendance(employee_id) where check_out is null;
create index attendance_date on attendance(date desc);
create table corrections(id text primary key,employee_id text not null references employees(id),date date not null,
 record_version integer,original jsonb not null,proposed jsonb not null,reason text not null check(length(trim(reason)) between 5 and 500),
 status text not null default 'PENDING_REVIEW' check(status in ('PENDING_REVIEW','APPROVED','REJECTED')),decision_note text,version integer not null default 1,created_at timestamptz not null);
create unique index correction_one_pending on corrections(employee_id,date) where status='PENDING_REVIEW';
create index corrections_employee_date on corrections(employee_id,date);
create table onboarding_mail(employee_id text primary key references employees(id),status text not null,attempt_id text not null,attempted_at bigint not null,sent_at bigint,error_code text);
create table audit(id bigint generated always as identity primary key,actor text,action text not null,target text not null,detail jsonb not null,at timestamptz not null);
create index audit_actor_time on audit(actor,at desc);
create table leave_types(id text primary key,payload jsonb not null,version integer not null default 1);
create table leave_balances(employee_id text not null references employees(id),type_id text not null references leave_types(id),year integer not null,
 opening numeric(6,2) not null check(opening>=0),used numeric(6,2) not null default 0 check(used>=0),version integer not null default 1,primary key(employee_id,type_id,year));
create index balances_type_year on leave_balances(type_id,year);
create table leave_requests(id text primary key,employee_id text not null references employees(id),type_id text not null references leave_types(id),
 start_date date not null,end_date date not null,day_type text not null check(day_type in ('FULL','FIRST_HALF','SECOND_HALF')),
 days numeric(6,2) not null check(days>0),year integer not null,is_paid integer not null check(is_paid in (0,1)),
 status text not null check(status in ('PENDING_APPROVAL','APPROVED','REJECTED','CANCELLATION_REQUESTED','CANCELLED')),
 reason text not null check(length(trim(reason)) between 5 and 500),decision_note text,version integer not null default 1,created_at timestamptz not null,policy_snapshot jsonb not null,dates jsonb not null,
 check(end_date>=start_date));
create index leave_requests_employee_year on leave_requests(employee_id,year,status);
create index leave_requests_type on leave_requests(type_id);
create table leave_absence(employee_id text not null references employees(id),date date not null,request_id text not null references leave_requests(id),primary key(employee_id,date));
create index leave_absence_request on leave_absence(request_id);
create table leaveauditlog(id bigint generated always as identity primary key,actor text not null,action text not null,target text not null,detail jsonb not null,at timestamptz not null);
create index leave_audit_target_time on leaveauditlog(target,at desc);
create table salary_slips(id text primary key,employee_id text not null references employees(id),year integer not null,month integer not null check(month between 1 and 12),
 status text not null default 'DRAFT' check(status in ('DRAFT','FINALIZED')),snapshot jsonb not null,signature text not null,version integer not null default 1,
 finalized_at timestamptz,finalized_by text references employees(id),unique(employee_id,year,month));
create index salary_slips_finalizer on salary_slips(finalized_by);
create table email_outbox(id text primary key,event_key text not null,recipient_id text not null references employees(id),recipient_email text not null,
 kind text not null,payload jsonb not null,status text not null default 'PENDING' check(status in ('PENDING','SENDING','SENT','FAILED','CANCELLED')),
 attempts integer not null default 0,next_attempt bigint not null,locked_until bigint,lease_token text,sent_at bigint,error_code text,created_at bigint not null,unique(event_key,recipient_id));
create index outbox_due on email_outbox(status,next_attempt);
create index outbox_recipient_time on email_outbox(recipient_id,created_at desc);
create table notification_settings(id integer primary key check(id=1),payload jsonb not null);
create table gateway_settings(id integer primary key check(id=1),secret_hash text not null check(length(secret_hash)=64));
create table auth_limits(key_hash text primary key,tick bigint not null,attempts integer not null);
create index auth_limits_tick on auth_limits(tick);
create table password_resets(token_hash text primary key,employee_id text not null references employees(id),expires bigint not null,used integer not null default 0,created_at bigint not null);
create index password_resets_employee on password_resets(employee_id,created_at desc);
create table company_settings(id integer primary key check(id=1),name text not null default 'Digi Rathi',phone text not null default '',address text not null default '',logo_path text,version integer not null default 1);
insert into company_settings(id) values(1);
create table salary_structures(id text primary key,name text not null,basic_pct numeric(5,2) not null,hra_pct numeric(5,2) not null,special_pct numeric(5,2) not null,
 description text not null default '',version integer not null default 1,check(basic_pct>=0 and hra_pct>=0 and special_pct>=0 and basic_pct+hra_pct+special_pct=100));
alter table employees add constraint employee_structure_fk foreign key(structure_id) references salary_structures(id);
create index employees_structure on employees(structure_id);
create table bank_requests(id text primary key,employee_id text not null references employees(id),encrypted_details text not null,
 masked text not null,status text not null default 'PENDING' check(status in ('PENDING','APPROVED','REJECTED')),reason text not null,decision_note text,version integer not null default 1,created_at timestamptz not null);
create index bank_requests_employee on bank_requests(employee_id,created_at desc);
create unique index bank_request_pending on bank_requests(employee_id) where status='PENDING';
create table bank_accounts(employee_id text primary key references employees(id),encrypted_details text not null,masked text not null,version integer not null default 1,updated_at timestamptz not null);
create table assets(id text primary key,name text not null,serial text unique not null,category text not null,status text not null default 'Available' check(status in ('Available','Assigned','Maintenance','Retired')),employee_id text references employees(id),version integer not null default 1,purchased date not null,history jsonb not null default '[]');
create unique index assets_serial_case on assets(lower(serial));
create index assets_employee on assets(employee_id);
create table tickets(id text primary key,requester_id text not null references employees(id),title text not null,description text not null,category text not null,priority text not null check(priority in ('Low','Normal','High','Urgent')),
 status text not null default 'Open' check(status in ('Open','In progress','Resolved','Closed')),assignee_id text references employees(id),resolution text not null default '',version integer not null default 1,created_at timestamptz not null,updated_at timestamptz not null);
create index tickets_requester_time on tickets(requester_id,created_at desc);
create index tickets_assignee on tickets(assignee_id);
create table ticket_comments(id text primary key,ticket_id text not null references tickets(id),actor text not null references employees(id),body text not null,internal integer not null default 0 check(internal in (0,1)),created_at timestamptz not null);
create index ticket_comments_ticket_time on ticket_comments(ticket_id,created_at);
create index ticket_comments_actor on ticket_comments(actor);
create table holidays(id text primary key,date date unique not null,name text not null,version integer not null default 1);

create function immutable_audit() returns trigger language plpgsql security invoker set search_path='' as $$ begin raise exception 'Audit records are immutable'; end; $$;
revoke execute on function immutable_audit() from public,anon,authenticated;
create trigger audit_no_update before update or delete on audit for each row execute function immutable_audit();
create trigger leave_audit_no_update before update or delete on leaveauditlog for each row execute function immutable_audit();
create function immutable_slip() returns trigger language plpgsql security invoker set search_path='' as $$ begin if old.status='FINALIZED' then raise exception 'Finalized salary slips are immutable'; end if; if TG_OP='DELETE' then return old; end if; return new; end; $$;
revoke execute on function immutable_slip() from public,anon,authenticated;
create trigger slip_no_update before update or delete on salary_slips for each row execute function immutable_slip();

-- Every application table is denied to raw client roles, even if this private
-- schema is accidentally added to Data API exposure later. API ACLs use fresh
-- database roles, not user-editable JWT metadata. Only the Edge server connects.
do $$ declare r record; begin for r in select tablename from pg_tables where schemaname='hrms_private' loop
 execute format('alter table hrms_private.%I enable row level security',r.tablename);
 execute format('revoke all on hrms_private.%I from public, anon, authenticated',r.tablename);
 execute format('grant all on hrms_private.%I to service_role',r.tablename);
 end loop; end $$;
grant usage,select on all sequences in schema hrms_private to service_role;
alter default privileges in schema hrms_private revoke all on tables from public,anon,authenticated;
alter default privileges in schema hrms_private revoke execute on functions from public,anon,authenticated;

insert into notification_settings values(1,'{"enabled":true,"day":30,"hour":10,"minute":0,"audience":"ALL","timezone":"Asia/Kolkata","february":"LAST_DAY"}');
-- Authenticated application routes check file ownership before using Storage.
-- Direct browser uploads/downloads are denied; no public bucket is created.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
 ('employee-avatars','employee-avatars',false,1048576,array['image/jpeg','image/png','image/webp']),
 ('company-branding','company-branding',false,1048576,array['image/jpeg','image/png','image/webp']),
 ('salary-slips','salary-slips',false,5242880,array['application/pdf']),
 ('helpdesk-attachments','helpdesk-attachments',false,5242880,array['application/pdf','image/jpeg','image/png','image/webp']);

create extension if not exists pg_cron with schema pg_catalog;
create function schedule_attendance_reminders(p_now timestamptz default now()) returns integer
language plpgsql security invoker set search_path='' as $$
declare cfg jsonb; local_now timestamp; cycle date; target date; affected integer;
begin
 select payload into cfg from hrms_private.notification_settings where id=1;
 if not coalesce((cfg->>'enabled')::boolean,true) then return 0; end if;
 local_now:=p_now at time zone 'Asia/Kolkata';cycle:=date_trunc('month',local_now)::date;
 target:=least(cycle+29,(cycle+interval '1 month - 1 day')::date);
 if local_now<target+make_time((cfg->>'hour')::int,(cfg->>'minute')::int,0) then return 0; end if;
 insert into hrms_private.email_outbox(id,event_key,recipient_id,recipient_email,kind,payload,next_attempt,created_at)
 select gen_random_uuid()::text,'attendance-reminder:'||to_char(cycle,'YYYY-MM'),e.id,e.email,'ATTENDANCE_REMINDER',
 jsonb_build_object('year',extract(year from cycle)::int,'month',extract(month from cycle)::int,'path','/?view=attendance','period',to_char(cycle,'YYYY-MM')),
 (extract(epoch from p_now)*1000)::bigint,(extract(epoch from p_now)*1000)::bigint
 from hrms_private.employees e join hrms_private.accounts a on a.employee_id=e.id
 where e.active=1 and a.must_change_password=0 and (cfg->>'audience'='ALL' or e.role<>'EMPLOYEE')
 and not exists(select 1 from hrms_private.salary_slips s where s.employee_id=e.id and s.year=extract(year from cycle) and s.month=extract(month from cycle) and s.status='FINALIZED')
 on conflict(event_key,recipient_id) do nothing;
 get diagnostics affected=row_count;return affected;
end $$;
revoke execute on function schedule_attendance_reminders(timestamptz) from public,anon,authenticated;
grant execute on function schedule_attendance_reminders(timestamptz) to service_role;
-- Check once per minute so administrator-configured send times and catch-up are honored.
select cron.schedule('hrms-attendance-reminders','* * * * *','select hrms_private.schedule_attendance_reminders();');

insert into hrms_private.leave_types(id,payload) values('annual','{"name":"Annual leave","code":"AL","description":"","isPaid":true,"displayColor":"#5146d9","leavesAllowedPerYear":0,"weekendsBetweenLeave":"NOT_CONSIDERED","holidaysBetweenLeave":"NOT_CONSIDERED","creditableOnAccrualBasis":false,"accrualFrequency":"YEARLY","accrualAmount":0,"allowedUnderProbation":true,"allowedUnderNoticePeriod":true,"encashmentEnabled":false,"encashmentMinBalance":0,"encashmentMaxDays":0,"carryForwardEnabled":false,"maximumCarryForward":0,"carryForwardExpiryDays":0,"maxLeavesAllowedInMonth":null,"continuousLeavesAllowed":null,"negativeLeavesAllowed":false,"negativeBalanceLimit":0,"futureDatedLeavesAllowed":true,"futureDatedAllowedAfterDays":0,"backdatedLeavesAllowed":true,"backdatedAllowedUpToDays":30,"applyLeavesForNextYearTill":null,"active":true}');

insert into hrms_private.leave_types(id,payload) values('unpaid','{"name":"Unpaid leave","code":"LWP","description":"","isPaid":false,"displayColor":"#5146d9","leavesAllowedPerYear":0,"weekendsBetweenLeave":"NOT_CONSIDERED","holidaysBetweenLeave":"NOT_CONSIDERED","creditableOnAccrualBasis":false,"accrualFrequency":"YEARLY","accrualAmount":0,"allowedUnderProbation":true,"allowedUnderNoticePeriod":true,"encashmentEnabled":false,"encashmentMinBalance":0,"encashmentMaxDays":0,"carryForwardEnabled":false,"maximumCarryForward":0,"carryForwardExpiryDays":0,"maxLeavesAllowedInMonth":null,"continuousLeavesAllowed":null,"negativeLeavesAllowed":false,"negativeBalanceLimit":0,"futureDatedLeavesAllowed":true,"futureDatedAllowedAfterDays":0,"backdatedLeavesAllowed":true,"backdatedAllowedUpToDays":30,"applyLeavesForNextYearTill":null,"active":true}');
