-- =============================================================================
-- 20260701_16_platform_plans.sql
-- Super admin: list the plans with their feature values and edit them.
--   * list_platform_plans()                       -> one row per plan x feature
--   * set_plan_feature(plan_id, feature_key, value) -> upsert one plan value
-- Both are SECURITY DEFINER and restricted to is_super_admin().
-- Value semantics (plan_features.value): boolean -> true/false,
-- limit -> non-negative integer, 'null'::jsonb -> unlimited.
-- Idempotent. Apply after 20260701_14.
-- =============================================================================

create or replace function public.list_platform_plans()
returns table (
  plan_id          uuid,
  plan_code        text,
  plan_name        text,
  price_cents      integer,
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
as $$
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
$$;

create or replace function public.set_plan_feature(
  p_plan_id     uuid,
  p_feature_key text,
  p_value       jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_type  text;
  v_value jsonb;
begin
  if not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  if not exists (select 1 from public.subscription_plans where id = p_plan_id) then
    raise exception 'Unknown plan' using errcode = '22023';
  end if;

  select f.type into v_type from public.features f where f.key = p_feature_key;
  if v_type is null then
    raise exception 'Unknown feature: %', p_feature_key using errcode = '22023';
  end if;

  if v_type = 'boolean' then
    if p_value is null or jsonb_typeof(p_value) <> 'boolean' then
      raise exception 'Boolean value expected for %', p_feature_key using errcode = '22023';
    end if;
    v_value := p_value;
  else
    if p_value is null or jsonb_typeof(p_value) = 'null' then
      v_value := 'null'::jsonb;
    elsif jsonb_typeof(p_value) = 'number'
      and (p_value::text)::numeric >= 0
      and (p_value::text)::numeric = trunc((p_value::text)::numeric) then
      v_value := p_value;
    else
      raise exception 'Non-negative integer or null expected for %', p_feature_key using errcode = '22023';
    end if;
  end if;

  insert into public.plan_features (plan_id, feature_key, value)
  values (p_plan_id, p_feature_key, v_value)
  on conflict (plan_id, feature_key) do update set value = excluded.value;
end;
$$;

revoke execute on function public.list_platform_plans() from public, anon;
grant execute on function public.list_platform_plans() to authenticated;
revoke execute on function public.set_plan_feature(uuid, text, jsonb) from public, anon;
grant execute on function public.set_plan_feature(uuid, text, jsonb) to authenticated;
