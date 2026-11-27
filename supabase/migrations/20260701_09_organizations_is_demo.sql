-- =============================================================================
-- 20260701_09_organizations_is_demo.sql
-- Explicit demo flag on organizations, exposed in the platform directory.
-- Demo organizations are listed (flagged) instead of being hidden.
-- Apply after 20260701_08. Idempotent.
-- =============================================================================

alter table public.organizations
  add column if not exists is_demo boolean not null default false;

update public.organizations
   set is_demo = true
 where id in (select dp.organization_id from public.demo_profiles dp)
   and is_demo = false;

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
  invoices_count      bigint,
  is_demo             boolean,
  members_limit       integer,
  garages_limit       integer,
  quotes_limit        integer,
  invoices_limit      integer,
  quotes_month_count  bigint,
  invoices_month_count bigint
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

  -- Limits come from the effective features (plan fallback + gifts); null = unlimited
  return query
  select
    o.id,
    o.name::text,
    o.created_at,
    (case when s.end_date is null or s.end_date > now() then sp.code else 'FREE' end)::text,
    s.status::text,
    (select count(*) from public.organization_members m
       where m.organization_id = o.id and m.status = 'active'
         and m.user_id not in (select su.id from public.users su where su.platform_role = 'super_admin')),
    (select count(*) from public.garages g where g.organization_id = o.id),
    (select count(*) from public.quotes q where q.organization_id = o.id),
    (select count(*) from public.invoices i where i.organization_id = o.id),
    o.is_demo,
    (select nullif(e.value::text, 'null')::integer from public.organization_effective_features e
       where e.organization_id = o.id and e.feature_key = 'max_seats'),
    (select nullif(e.value::text, 'null')::integer from public.organization_effective_features e
       where e.organization_id = o.id and e.feature_key = 'max_garages'),
    (select nullif(e.value::text, 'null')::integer from public.organization_effective_features e
       where e.organization_id = o.id and e.feature_key = 'max_quotes_per_month'),
    (select nullif(e.value::text, 'null')::integer from public.organization_effective_features e
       where e.organization_id = o.id and e.feature_key = 'max_invoices_per_month'),
    (select count(*) from public.quotes q
       where q.organization_id = o.id and q.created_at >= date_trunc('month', now())),
    (select count(*) from public.invoices i
       where i.organization_id = o.id and i.created_at >= date_trunc('month', now()))
  from public.organizations o
  left join public.subscriptions s on s.organization_id = o.id
  left join public.subscription_plans sp on sp.id = s.plan_id
  order by o.created_at desc;
end;
$$;

revoke execute on function public.list_platform_organizations() from public, anon;
grant execute on function public.list_platform_organizations() to authenticated;

-- Dashboard stats: exclude demo organizations through the explicit flag
drop function if exists public.get_platform_stats();

create or replace function public.get_platform_stats()
returns table (
  organizations_total  bigint,
  free_organizations   bigint,
  premium_organizations bigint,
  new_organizations_30d bigint,
  users_total          bigint,
  new_users_30d        bigint,
  blocked_users        bigint,
  mrr_cents            bigint,
  quotes_total         bigint,
  invoices_total       bigint,
  signups_6m           jsonb,
  near_quota_organizations bigint,
  expiring_subscriptions bigint,
  recent_organizations jsonb
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
  with real_orgs as (
    select o.id, o.name, o.created_at
    from public.organizations o
    where not o.is_demo
  ),
  org_plan as (
    -- an expired subscription counts as FREE (no revenue)
    select r.id,
           case when s.end_date is null or s.end_date > now() then sp.code else 'FREE' end as code,
           case when s.end_date is null or s.end_date > now() then sp.price_cents else 0 end as price_cents,
           s.status
    from real_orgs r
    left join public.subscriptions s on s.organization_id = r.id
    left join public.subscription_plans sp on sp.id = s.plan_id
  ),
  real_users as (
    select distinct u.id, u.is_blocked
    from public.users u
    join public.organization_members m on m.user_id = u.id
    join real_orgs r on r.id = m.organization_id
    where u.platform_role <> 'super_admin'
  )
  select
    (select count(*) from real_orgs),
    (select count(*) from org_plan where code = 'FREE'),
    (select count(*) from org_plan where code = 'PREMIUM'),
    (select count(*) from real_orgs where created_at >= now() - interval '30 days'),
    (select count(*) from real_users),
    (select count(*) from real_users ru
       join auth.users au on au.id = ru.id
       where au.created_at >= now() - interval '30 days'),
    (select count(*) from real_users where is_blocked),
    (select coalesce(sum(price_cents), 0)::bigint from org_plan where status = 'active'),
    (select count(*) from public.quotes q where q.organization_id in (select id from real_orgs)),
    (select count(*) from public.invoices i where i.organization_id in (select id from real_orgs)),
    coalesce((
      select jsonb_agg(jsonb_build_object('month', to_char(g.m, 'YYYY-MM'), 'count', (
        select count(*) from real_orgs r where date_trunc('month', r.created_at) = g.m
      )) order by g.m)
      from generate_series(
        date_trunc('month', now()) - interval '5 months',
        date_trunc('month', now()),
        interval '1 month'
      ) as g(m)
    ), '[]'::jsonb),
    (select count(*)
       from public.subscriptions s
       join real_orgs r on r.id = s.organization_id
       join public.organization_effective_features ef
         on ef.organization_id = r.id and ef.feature_key = 'max_seats'
       where s.status = 'active'
         and nullif(ef.value::text, 'null') is not null
         and (select count(*) from public.organization_members m
                where m.organization_id = r.id and m.status = 'active'
                  and m.user_id not in (select su.id from public.users su where su.platform_role = 'super_admin')
             ) >= nullif(ef.value::text, 'null')::integer * 0.8),
    (select count(*)
       from public.subscriptions s
       join real_orgs r on r.id = s.organization_id
       where s.status = 'active'
         and s.end_date is not null
         and s.end_date >= now()
         and s.end_date <= now() + interval '7 days'),
    coalesce((
      select jsonb_agg(x order by x.created_at desc)
      from (
        select o.id, o.name, o.created_at, o.is_demo,
          case when s.end_date is null or s.end_date > now() then sp.code else 'FREE' end as plan,
          (select count(*) from public.organization_members m
             where m.organization_id = o.id and m.status = 'active'
               and m.user_id not in (select su.id from public.users su where su.platform_role = 'super_admin')
          ) as members_count,
          (select count(*) from public.garages g where g.organization_id = o.id) as garages_count
        from public.organizations o
        left join public.subscriptions s on s.organization_id = o.id
        left join public.subscription_plans sp on sp.id = s.plan_id
        order by o.created_at desc
        limit 10
      ) x
    ), '[]'::jsonb);
end;
$$;

revoke execute on function public.get_platform_stats() from public, anon;
grant execute on function public.get_platform_stats() to authenticated;
