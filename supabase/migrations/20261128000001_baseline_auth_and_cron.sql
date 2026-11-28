-- Complements the public-schema baseline with objects that live outside
-- `public` and are therefore not part of the dump: the auth.users trigger
-- and the pg_cron job. Idempotent.
-- Remote projects already have these objects; this migration is only
-- replayed on fresh databases (CI, local `supabase db reset`).

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create extension if not exists pg_cron;

do $$
begin
  if exists (select 1 from cron.job where jobname = 'expire_subscriptions') then
    perform cron.unschedule('expire_subscriptions');
  end if;
  perform cron.schedule('expire_subscriptions', '* * * * *', 'select public.expire_subscriptions()');
end;
$$;
