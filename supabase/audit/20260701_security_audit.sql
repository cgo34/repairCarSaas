-- READ-ONLY security audit. Run each block in the Supabase SQL Editor and
-- keep the output: it is the source of truth the repo migrations do not reflect.

-- 1. RLS status per table
select c.relname as table_name, c.relrowsecurity as rls_enabled, c.relforcerowsecurity as rls_forced
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r'
order by c.relname;

-- 2. All policies
select tablename, policyname, cmd, roles, permissive, qual, with_check
from pg_policies where schemaname = 'public'
order by tablename, cmd, policyname;

-- 3. Table privileges granted to API roles
select table_name, grantee, string_agg(privilege_type, ', ' order by privilege_type) as privileges
from information_schema.role_table_grants
where table_schema = 'public' and grantee in ('anon', 'authenticated', 'PUBLIC')
group by table_name, grantee
order by table_name, grantee;

-- 4. Column-level INSERT/UPDATE grants
select table_name, grantee, privilege_type, string_agg(column_name, ', ' order by column_name) as columns
from information_schema.column_privileges
where table_schema = 'public' and grantee in ('anon', 'authenticated')
  and privilege_type in ('INSERT', 'UPDATE')
group by table_name, grantee, privilege_type
order by table_name, grantee;

-- 5. Functions: security definer, search_path, who can execute
select p.proname, p.prosecdef as security_definer, p.proconfig as config,
       has_function_privilege('anon', p.oid, 'EXECUTE') as anon_exec,
       has_function_privilege('authenticated', p.oid, 'EXECUTE') as auth_exec
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
order by p.proname;

-- 6. Triggers
select event_object_table, trigger_name, event_manipulation, action_statement
from information_schema.triggers
where trigger_schema in ('public', 'auth')
order by event_object_table, trigger_name;

-- 7. Foreign keys to auth.users
select conrelid::regclass as table_name, conname, confdeltype as on_delete
from pg_constraint
where contype = 'f' and confrelid = 'auth.users'::regclass;

-- 8. user_profiles shape
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public' and table_name = 'user_profiles'
order by ordinal_position;

-- 9. Existing super admins (must be explicit and few)
select id, email, platform_role from public.users where platform_role = 'super_admin';

-- 10. Orphans (public.users without auth.users)
select u.id, u.email from public.users u left join auth.users a on a.id = u.id where a.id is null;
