alter table hrms_private.accounts add column login_id text;
alter table hrms_private.accounts add constraint accounts_login_id_format check(login_id is null or login_id ~ '^[a-z][a-z0-9._-]{2,63}$');
create unique index accounts_login_id_unique on hrms_private.accounts(lower(login_id)) where login_id is not null;
