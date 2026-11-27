-- =============================================================================
-- list_platform_users: include demo organizations and the super admin.
--
-- * One row per user (distinct on u.id), demo organizations included.
-- * New column is_demo: true when the user's organization is a demo one.
-- * Super admin accounts are listed once, with role 'super_admin' and no
--   organization (their borrowed demo memberships are not shown).
-- The front hides demo rows with the "Masquer les démos" switch.
-- Idempotent.
-- =============================================================================
drop function if exists public.list_platform_users();

create or replace function public.list_platform_users()
returns table (
  id                  uuid,
  full_name           text,
  email               text,
  is_blocked          boolean,
  role                text,
  organization_name   text,
  organizations_count bigint,
  created_at          timestamptz,
  is_demo             boolean
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  return query
  select * from (
    select distinct on (u.id)
      u.id,
      coalesce(nullif(u.full_name, ''), nullif(trim(coalesce(u.first_name, '') || ' ' || coalesce(u.last_name, '')), ''))::text as full_name,
      u.email::text,
      u.is_blocked,
      m.role::text as role,
      o.name::text as organization_name,
      (select count(*) from public.organization_members mm where mm.user_id = u.id) as organizations_count,
      au.created_at,
      coalesce(o.is_demo, false) as is_demo
    from public.users u
    join public.organization_members m on m.user_id = u.id
    join public.organizations o on o.id = m.organization_id
    left join auth.users au on au.id = u.id
    where u.platform_role <> 'super_admin'
    order by u.id, o.created_at
  ) members
  union all
  select
    u.id,
    coalesce(nullif(u.full_name, ''), nullif(trim(coalesce(u.first_name, '') || ' ' || coalesce(u.last_name, '')), ''))::text,
    u.email::text,
    u.is_blocked,
    'super_admin'::text,
    null::text,
    0::bigint,
    au.created_at,
    false
  from public.users u
  left join auth.users au on au.id = u.id
  where u.platform_role = 'super_admin';
end;
$$;

revoke execute on function public.list_platform_users() from public, anon;
grant execute on function public.list_platform_users() to authenticated;

notify pgrst, 'reload schema';
