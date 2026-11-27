-- =============================================================================
-- 20260701_17_plan_change_safety.sql
-- Safe plan editing for the super admin screen:
--   * plan_change_log                   : audit trail (who / when / old -> new / impact)
--   * plan_change_impact(...)           : organizations on a plan + organizations
--                                         that reach/exceed a new limit (or lose a feature)
--   * preview_plan_changes(changes)     : impact of a batch of changes, nothing written
--   * apply_plan_changes(changes)       : applies a batch in ONE transaction + logs it
--   * list_plan_change_log(limit)       : journal for the UI
-- changes = [{ "plan_id": uuid, "feature_key": text, "value": true|false|int|null }]
-- All SECURITY DEFINER and restricted to is_super_admin(). Demo organizations
-- are ignored in impact counts. Idempotent. Apply after 20260701_16.
-- =============================================================================

create table if not exists public.plan_change_log (
  id              uuid primary key default gen_random_uuid(),
  changed_at      timestamptz not null default now(),
  changed_by      uuid,
  plan_id         uuid not null references public.subscription_plans(id) on delete cascade,
  plan_code       text not null,
  feature_key     text not null,
  old_value       jsonb,
  new_value       jsonb,
  orgs_on_plan    integer not null default 0,
  orgs_affected   integer not null default 0
);

alter table public.plan_change_log enable row level security;
revoke all on public.plan_change_log from anon, authenticated;

create or replace function public.plan_change_impact(
  p_plan_id uuid,
  p_key     text,
  p_new     jsonb
)
returns table (orgs_on_plan integer, orgs_affected integer)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_type  text;
  v_old   jsonb;
  v_on    integer;
  v_aff   integer := 0;
  v_n     integer;
  v_orgs  uuid[];
  v_month timestamptz := date_trunc('month', now());
begin
  if not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  select f.type into v_type from public.features f where f.key = p_key;
  select pf.value into v_old from public.plan_features pf
   where pf.plan_id = p_plan_id and pf.feature_key = p_key;

  v_orgs := array(
    select distinct s.organization_id
      from public.subscriptions s
      join public.organizations o on o.id = s.organization_id
     where s.plan_id = p_plan_id
       and s.status = 'active'
       and (s.end_date is null or s.end_date > now())
       and not coalesce(o.is_demo, false)
  );
  v_on := coalesce(array_length(v_orgs, 1), 0);

  if v_type = 'boolean' then
    if coalesce(v_old, 'false'::jsonb) = 'true'::jsonb and p_new = 'false'::jsonb then
      v_aff := v_on;
    end if;
  elsif p_new is not null and jsonb_typeof(p_new) = 'number' then
    v_n := (p_new::text)::integer;
    if p_key = 'max_garages' then
      select count(*) into v_aff from unnest(v_orgs) as po(organization_id)
       where (select count(*) from public.garages g where g.organization_id = po.organization_id) >= v_n;
    elsif p_key = 'max_quotes_per_month' then
      select count(*) into v_aff from unnest(v_orgs) as po(organization_id)
       where (select count(*) from public.quotes q
               where q.organization_id = po.organization_id and q.created_at >= v_month) >= v_n;
    elsif p_key = 'max_invoices_per_month' then
      select count(*) into v_aff from unnest(v_orgs) as po(organization_id)
       where (select count(*) from public.invoices i
               where i.organization_id = po.organization_id and i.created_at >= v_month) >= v_n;
    elsif p_key = 'max_conversions_per_month' then
      select count(*) into v_aff from unnest(v_orgs) as po(organization_id)
       where (select count(*) from public.invoices i
               where i.organization_id = po.organization_id and i.quote_id is not null
                 and i.created_at >= v_month) >= v_n;
    end if;
  end if;

  return query select v_on, v_aff;
end;
$$;

create or replace function public.preview_plan_changes(p_changes jsonb)
returns table (
  plan_id       uuid,
  plan_code     text,
  feature_key   text,
  feature_name  text,
  feature_type  text,
  old_value     jsonb,
  new_value     jsonb,
  orgs_on_plan  integer,
  orgs_affected integer,
  is_risky      boolean
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  ch      jsonb;
  v_plan  uuid;
  v_key   text;
  v_new   jsonb;
  v_old   jsonb;
  v_type  text;
  v_on    integer;
  v_aff   integer;
  v_risky boolean;
begin
  if not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  for ch in select * from jsonb_array_elements(coalesce(p_changes, '[]'::jsonb)) loop
    v_plan := (ch->>'plan_id')::uuid;
    v_key  := ch->>'feature_key';
    v_new  := coalesce(ch->'value', 'null'::jsonb);

    select f.type into v_type from public.features f where f.key = v_key;
    select pf.value into v_old from public.plan_features pf
     where pf.plan_id = v_plan and pf.feature_key = v_key;
    if v_old is null and v_type = 'boolean' then v_old := 'false'::jsonb; end if;
    if v_old is null and v_type = 'limit'   then v_old := '0'::jsonb;     end if;

    if v_old = v_new then continue; end if;

    select i.orgs_on_plan, i.orgs_affected into v_on, v_aff
      from public.plan_change_impact(v_plan, v_key, v_new) i;

    if v_type = 'boolean' then
      v_risky := v_old = 'true'::jsonb and v_new = 'false'::jsonb;
    else
      v_risky := jsonb_typeof(v_new) = 'number'
             and (jsonb_typeof(v_old) = 'null' or (v_new::text)::numeric < (v_old::text)::numeric);
    end if;

    return query
    select v_plan, p.code::text, v_key, f.name::text, v_type, v_old, v_new,
           v_on, v_aff, (v_risky and v_on > 0)
      from public.subscription_plans p, public.features f
     where p.id = v_plan and f.key = v_key;
  end loop;
end;
$$;

create or replace function public.apply_plan_changes(p_changes jsonb)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  r       record;
  v_count integer := 0;
begin
  if not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  for r in select * from public.preview_plan_changes(p_changes) loop
    perform public.set_plan_feature(r.plan_id, r.feature_key, r.new_value);

    insert into public.plan_change_log
      (changed_by, plan_id, plan_code, feature_key, old_value, new_value, orgs_on_plan, orgs_affected)
    values
      (auth.uid(), r.plan_id, r.plan_code, r.feature_key, r.old_value, r.new_value, r.orgs_on_plan, r.orgs_affected);

    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;

create or replace function public.list_plan_change_log(p_limit integer default 50)
returns table (
  id            uuid,
  changed_at    timestamptz,
  changed_by    text,
  plan_code     text,
  feature_key   text,
  feature_name  text,
  old_value     jsonb,
  new_value     jsonb,
  orgs_on_plan  integer,
  orgs_affected integer
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
  select l.id, l.changed_at,
         (select u.email::text from auth.users u where u.id = l.changed_by),
         l.plan_code, l.feature_key, f.name::text,
         l.old_value, l.new_value, l.orgs_on_plan, l.orgs_affected
    from public.plan_change_log l
    left join public.features f on f.key = l.feature_key
   order by l.changed_at desc
   limit greatest(1, least(coalesce(p_limit, 50), 500));
end;
$$;

revoke execute on function public.plan_change_impact(uuid, text, jsonb) from public, anon;
revoke execute on function public.preview_plan_changes(jsonb) from public, anon;
revoke execute on function public.apply_plan_changes(jsonb) from public, anon;
revoke execute on function public.list_plan_change_log(integer) from public, anon;
grant execute on function public.plan_change_impact(uuid, text, jsonb) to authenticated;
grant execute on function public.preview_plan_changes(jsonb) to authenticated;
grant execute on function public.apply_plan_changes(jsonb) to authenticated;
grant execute on function public.list_plan_change_log(integer) to authenticated;

-- list_platform_plans now also returns the number of (non-demo) organizations per plan
drop function if exists public.list_platform_plans();
create function public.list_platform_plans()
returns table (
  plan_id          uuid,
  plan_code        text,
  plan_name        text,
  price_cents      integer,
  orgs_count       integer,
  feature_key      text,
  feature_type     text,
  feature_name     text,
  feature_description text,
  is_addon         boolean,
  has_value        boolean,
  value            jsonb
)
language plpgsql
stable
security definer
set search_path = ''
as $fn$
begin
  if not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  return query
  select
    p.id,
    p.code::text,
    p.name::text,
    p.price_cents::integer,
    (select count(distinct s.organization_id)::integer
       from public.subscriptions s
       join public.organizations o on o.id = s.organization_id
      where s.plan_id = p.id and s.status = 'active'
        and (s.end_date is null or s.end_date > now())
        and not coalesce(o.is_demo, false)),
    f.key,
    f.type,
    f.name,
    f.description,
    f.is_addon,
    pf.plan_id is not null,
    pf.value
  from public.subscription_plans p
  cross join public.features f
  left join public.plan_features pf
    on pf.plan_id = p.id and pf.feature_key = f.key
  order by p.price_cents, p.code, f.is_addon, f.key;
end;
$fn$;

revoke execute on function public.list_platform_plans() from public, anon;
grant execute on function public.list_platform_plans() to authenticated;