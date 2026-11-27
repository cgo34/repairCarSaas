-- =============================================================================
-- 20260701_14_grant_feature.sql
-- 1. New add-on feature: invoice_email_sending (FREE = false, PREMIUM = true).
-- 2. Super admin: offer a boolean add-on feature to an organization for a limited
--    time (or unlimited). Stored in organization_features (source = 'gift'), so it
--    expires on its own through organization_effective_features.
-- Idempotent. Apply after 20260701_10.
-- =============================================================================

insert into public.features (key, type, name, description, is_addon) values
  ('invoice_email_sending', 'boolean', 'Envoi des factures par email', 'Envoyer les factures par email depuis l''application', true)
on conflict (key) do nothing;

update public.features
   set name = 'Envoi des devis par email',
       description = 'Envoyer les devis par email depuis l''application'
 where key = 'quote_email_sending';

insert into public.plan_features (plan_id, feature_key, value)
select p.id, 'invoice_email_sending',
       case p.code when 'PREMIUM' then 'true'::jsonb else 'false'::jsonb end
from public.subscription_plans p
where p.code in ('FREE', 'PREMIUM')
on conflict (plan_id, feature_key) do nothing;

create or replace function public.grant_feature(
  p_organization_id uuid,
  p_feature_key     text,
  p_duration        text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_expires timestamptz;
begin
  if not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  if not exists (
    select 1 from public.features f
     where f.key = p_feature_key and f.type = 'boolean' and f.is_addon
  ) then
    raise exception 'Feature not offerable: %', p_feature_key using errcode = '22023';
  end if;

  v_expires := case p_duration
    when 'minutes5'  then now() + interval '5 minutes'
    when 'week'      then now() + interval '7 days'
    when 'month'     then now() + interval '1 month'
    when 'unlimited' then null
    else null
  end;

  if p_duration not in ('minutes5', 'week', 'month', 'unlimited') then
    raise exception 'Invalid duration: %', p_duration using errcode = '22023';
  end if;

  -- One active gift per organization and feature: replace the previous one
  delete from public.organization_features
   where organization_id = p_organization_id
     and feature_key = p_feature_key
     and source = 'gift';

  insert into public.organization_features
    (organization_id, feature_key, value, source, starts_at, expires_at, granted_by, note)
  values
    (p_organization_id, p_feature_key, 'true'::jsonb, 'gift', now(), v_expires, auth.uid(), 'Offert par le super admin');
end;
$$;

revoke execute on function public.grant_feature(uuid, text, text) from public, anon;
grant execute on function public.grant_feature(uuid, text, text) to authenticated;
