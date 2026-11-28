-- =============================================================================
-- 20260701_10_grant_premium.sql
-- Super admin action: offer the Premium plan to an organization for a limited
-- duration (1 week, 1 month) or without end date.
-- Also makes an expired subscription fall back to the FREE plan instead of
-- leaving the organization without any plan.
-- Apply after 20260701_09 and plans_features.sql. Idempotent.
-- =============================================================================

-- Effective features: an active subscription whose end_date has passed falls
-- back to the FREE plan.
create or replace view public.organization_effective_features
with (security_invoker = true) as
with org_plan as (
  select s.organization_id,
         case
           when s.end_date is null or s.end_date > now() then s.plan_id
           else (select p.id from public.subscription_plans p where p.code = 'FREE')
         end as plan_id
  from public.subscriptions s
  where s.status = 'active'
),
plan_vals as (
  select op.organization_id, pf.feature_key, pf.value
  from org_plan op
  join public.plan_features pf on pf.plan_id = op.plan_id
),
grants as (
  select * from public.organization_features
  where starts_at <= now() and (expires_at is null or expires_at > now())
),
keys as (
  select organization_id, feature_key from plan_vals
  union
  select organization_id, feature_key from grants
)
select
  k.organization_id,
  k.feature_key,
  f.type,
  case f.type
    when 'boolean' then to_jsonb(
      coalesce((select (pv.value)::text = 'true' from plan_vals pv
                where pv.organization_id = k.organization_id and pv.feature_key = k.feature_key), false)
      or exists (select 1 from grants g
                 where g.organization_id = k.organization_id and g.feature_key = k.feature_key
                   and g.value::text = 'true'))
    else case
      when exists (select 1 from plan_vals pv
                   where pv.organization_id = k.organization_id and pv.feature_key = k.feature_key
                     and pv.value is not null and pv.value::text = 'null')
        or exists (select 1 from grants g
                   where g.organization_id = k.organization_id and g.feature_key = k.feature_key
                     and (g.value is null or g.value::text = 'null'))
      then null
      else to_jsonb(
        coalesce((select (pv.value)::text::numeric from plan_vals pv
                  where pv.organization_id = k.organization_id and pv.feature_key = k.feature_key), 0)
        + coalesce((select sum((g.value)::text::numeric) from grants g
                    where g.organization_id = k.organization_id and g.feature_key = k.feature_key), 0))
    end
  end as value
from keys k
join public.features f on f.key = k.feature_key;

drop function if exists public.grant_premium(uuid, text);

create or replace function public.grant_premium(p_organization_id uuid, p_duration text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_plan_id   uuid;
  v_end_date  timestamptz;
begin
  if not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  if not exists (select 1 from public.organizations o where o.id = p_organization_id) then
    raise exception 'Organization not found' using errcode = 'P0002';
  end if;

  v_end_date := case p_duration
    when 'minute'    then now() + interval '1 minute'
    when 'week'      then now() + interval '7 days'
    when 'month'     then now() + interval '1 month'
    when 'unlimited' then null
    else null
  end;

  if p_duration not in ('minute', 'week', 'month', 'unlimited') then
    raise exception 'Invalid duration: %', p_duration using errcode = '22023';
  end if;

  select p.id into v_plan_id from public.subscription_plans p where p.code = 'PREMIUM';
  if v_plan_id is null then
    raise exception 'PREMIUM plan not found' using errcode = 'P0002';
  end if;

  update public.subscriptions s
     set plan_id    = v_plan_id,
         status     = 'active',
         source     = 'manual',
         start_date = now(),
         end_date   = v_end_date
   where s.organization_id = p_organization_id;

  if not found then
    insert into public.subscriptions (organization_id, plan_id, status, source, start_date, end_date)
    values (p_organization_id, v_plan_id, 'active', 'manual', now(), v_end_date);
  end if;
end;
$$;

revoke execute on function public.grant_premium(uuid, text) from public, anon;
grant execute on function public.grant_premium(uuid, text) to authenticated;
