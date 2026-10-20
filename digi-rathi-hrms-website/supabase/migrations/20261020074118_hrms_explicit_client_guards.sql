-- Explicitly deny raw client access. The authenticated Edge API enforces HR ACLs.
do $$ declare r record; begin for r in select tablename from pg_tables where schemaname='hrms_private' loop execute format('create policy client_access_denied on hrms_private.%I for all to anon, authenticated using (false) with check (false)',r.tablename); end loop; end $$;
