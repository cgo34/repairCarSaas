-- =============================================================================
-- 20260701_11_expire_subscriptions.sql
-- Really downgrade expired subscriptions to the FREE plan (instead of only
-- computing it at read time), and schedule it every minute with pg_cron.
-- Idempotent. Apply after 20260701_10.
-- =============================================================================

create or replace function public.expire_subscriptions()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_free_id uuid;
  v_count   integer;
begin
  select id into v_free_id from public.subscription_plans where code = 'FREE';
  if v_free_id is null then
    return 0;
  end if;

  update public.subscriptions s
     set plan_id    = v_free_id,
         status     = 'active',
         source     = 'manual',
         end_date   = null
   where s.end_date is not null
     and s.end_date <= now()
     and s.plan_id <> v_free_id;

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke execute on function public.expire_subscriptions() from public, anon, authenticated;

create extension if not exists pg_cron;

do $$
begin
  if exists (select 1 from cron.job where jobname = 'expire_subscriptions') then
    perform cron.unschedule('expire_subscriptions');
  end if;
  perform cron.schedule('expire_subscriptions', '* * * * *', 'select public.expire_subscriptions()');
end;
$$;

-- Catch up immediately on already expired rows
select public.expire_subscriptions();
