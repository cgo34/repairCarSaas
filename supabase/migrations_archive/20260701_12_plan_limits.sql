-- =============================================================================
-- 20260701_12_plan_limits.sql
-- 1. New plan limit: max quote -> invoice conversions per calendar month.
-- 2. FREE limits: garages 1, quotes 10/month, invoices 5/month, conversions 3/month.
-- 3. Server-side enforcement (before insert triggers). Reads are never blocked.
-- Limit value null = unlimited. Demo organizations are not limited.
-- Idempotent. Apply after 20260701_10.
-- =============================================================================

insert into public.features (key, type, name, description, is_addon) values
  ('max_conversions_per_month', 'limit', 'Conversions devis → facture / mois',
   'Devis convertis en facture par mois calendaire', false)
on conflict (key) do nothing;

insert into public.plan_features (plan_id, feature_key, value)
select p.id, v.feature_key, v.value
from public.subscription_plans p
join (values
  ('FREE',    'max_garages',               '1'::jsonb),
  ('FREE',    'max_quotes_per_month',      '10'::jsonb),
  ('FREE',    'max_invoices_per_month',    '5'::jsonb),
  ('FREE',    'max_conversions_per_month', '3'::jsonb),
  ('PREMIUM', 'max_conversions_per_month', 'null'::jsonb)
) as v(plan_code, feature_key, value) on p.code = v.plan_code
on conflict (plan_id, feature_key) do update set value = excluded.value;

-- Effective limit of an organization for a feature (null = unlimited / not defined)
create or replace function public.org_limit(p_organization_id uuid, p_feature text)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select nullif(e.value::text, 'null')::integer
  from public.organization_effective_features e
  where e.organization_id = p_organization_id and e.feature_key = p_feature;
$$;

revoke execute on function public.org_limit(uuid, text) from public, anon;
grant execute on function public.org_limit(uuid, text) to authenticated;

create or replace function public.enforce_plan_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_limit   integer;
  v_count   bigint;
  v_month   timestamptz := date_trunc('month', now());
  v_demo    boolean;
begin
  select o.is_demo into v_demo from public.organizations o where o.id = new.organization_id;
  if coalesce(v_demo, false) then
    return new;
  end if;

  if tg_table_name = 'garages' then
    v_limit := public.org_limit(new.organization_id, 'max_garages');
    if v_limit is not null then
      select count(*) into v_count from public.garages where organization_id = new.organization_id;
      if v_count >= v_limit then
        raise exception 'PLAN_LIMIT_GARAGES: limite de % garage(s) atteinte pour votre plan', v_limit
          using errcode = 'P0001';
      end if;
    end if;

  elsif tg_table_name = 'quotes' then
    v_limit := public.org_limit(new.organization_id, 'max_quotes_per_month');
    if v_limit is not null then
      select count(*) into v_count from public.quotes
       where organization_id = new.organization_id and created_at >= v_month;
      if v_count >= v_limit then
        raise exception 'PLAN_LIMIT_QUOTES: limite de % devis par mois atteinte pour votre plan', v_limit
          using errcode = 'P0001';
      end if;
    end if;

  elsif tg_table_name = 'invoices' then
    v_limit := public.org_limit(new.organization_id, 'max_invoices_per_month');
    if v_limit is not null then
      select count(*) into v_count from public.invoices
       where organization_id = new.organization_id and created_at >= v_month;
      if v_count >= v_limit then
        raise exception 'PLAN_LIMIT_INVOICES: limite de % facture(s) par mois atteinte pour votre plan', v_limit
          using errcode = 'P0001';
      end if;
    end if;

    -- An invoice created from a quote is a conversion
    if new.quote_id is not null then
      v_limit := public.org_limit(new.organization_id, 'max_conversions_per_month');
      if v_limit is not null then
        select count(*) into v_count from public.invoices
         where organization_id = new.organization_id and quote_id is not null and created_at >= v_month;
        if v_count >= v_limit then
          raise exception 'PLAN_LIMIT_CONVERSIONS: limite de % conversion(s) devis en facture par mois atteinte pour votre plan', v_limit
            using errcode = 'P0001';
        end if;
      end if;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_enforce_limit_garages on public.garages;
create trigger trg_enforce_limit_garages before insert on public.garages
  for each row execute function public.enforce_plan_limit();

drop trigger if exists trg_enforce_limit_quotes on public.quotes;
create trigger trg_enforce_limit_quotes before insert on public.quotes
  for each row execute function public.enforce_plan_limit();

drop trigger if exists trg_enforce_limit_invoices on public.invoices;
create trigger trg_enforce_limit_invoices before insert on public.invoices
  for each row execute function public.enforce_plan_limit();
