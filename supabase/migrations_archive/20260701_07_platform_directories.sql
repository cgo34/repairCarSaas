-- =============================================================================
-- 20260701_07_platform_directories.sql
-- Super_admin directories: organizations and users listing.
-- Demo organizations and super_admin accounts are excluded.
-- Apply after 20260701_06. Idempotent.
-- =============================================================================

drop function if exists public.list_platform_organizations();

create or replace function public.list_platform_organizations()
returns table (
  id                  uuid,
  name                text,
  created_at          timestamptz,
  plan_code           text,
  subscription_status text,
  members_count       bigint,
  garages_count       bigint,
  quotes_count        bigint,
  invoices_count      bigint
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
  select
    o.id,
    o.name::text,
    o.created_at,
    sp.code::text,
    s.status::text,
    (select count(*) from public.organization_members m
       where m.organization_id = o.id and m.status = 'active'
         and m.user_id not in (select su.id from public.users su where su.platform_role = 'super_admin')),
    (select count(*) from public.garages g where g.organization_id = o.id),
    (select count(*) from public.quotes q where q.organization_id = o.id),
    (select count(*) from public.invoices i where i.organization_id = o.id)
  from public.organizations o
  left join public.subscriptions s on s.organization_id = o.id
  left join public.subscription_plans sp on sp.id = s.plan_id
  where o.id not in (select dp.organization_id from public.demo_profiles dp)
  order by o.created_at desc;
end;
$$;

revoke execute on function public.list_platform_organizations() from public, anon;
grant execute on function public.list_platform_organizations() to authenticated;

drop function if exists public.list_platform_users();

create or replace function public.list_platform_users()
returns table (
  id                 uuid,
  full_name          text,
  email              text,
  is_blocked         boolean,
  role               text,
  organization_name  text,
  organizations_count bigint,
  created_at         timestamptz
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
  select distinct on (u.id)
    u.id,
    coalesce(nullif(u.full_name, ''), nullif(trim(coalesce(u.first_name, '') || ' ' || coalesce(u.last_name, '')), ''))::text,
    u.email::text,
    u.is_blocked,
    m.role::text,
    o.name::text,
    (select count(*) from public.organization_members mm
       where mm.user_id = u.id
         and mm.organization_id not in (select dp.organization_id from public.demo_profiles dp)),
    au.created_at
  from public.users u
  join public.organization_members m on m.user_id = u.id
  join public.organizations o on o.id = m.organization_id
  left join auth.users au on au.id = u.id
  where u.platform_role <> 'super_admin'
    and o.id not in (select dp.organization_id from public.demo_profiles dp)
  order by u.id, o.created_at;
end;
$$;

revoke execute on function public.list_platform_users() from public, anon;
grant execute on function public.list_platform_users() to authenticated;
