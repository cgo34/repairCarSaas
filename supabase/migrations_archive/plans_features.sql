-- Catalogue des fonctionnalités, plans et grants par organisation.
-- À exécuter manuellement dans Supabase (SQL editor).

-- 1. Catalogue des features
create table if not exists public.features (
  key         text primary key,
  type        text not null check (type in ('boolean', 'limit')),
  name        text not null,
  description text,
  is_addon    boolean not null default false,
  stripe_price_id text,
  created_at  timestamptz not null default now()
);

-- 2. Valeurs par plan (une ligne par plan x feature)
-- value : true/false pour boolean, nombre pour limit, null = illimité
create table if not exists public.plan_features (
  plan_id     uuid not null references public.subscription_plans(id) on delete cascade,
  feature_key text not null references public.features(key) on delete cascade,
  value       jsonb,
  primary key (plan_id, feature_key)
);

-- 3. Grants spécifiques à une organisation (achat, cadeau, essai, support)
create table if not exists public.organization_features (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  feature_key     text not null references public.features(key) on delete cascade,
  value           jsonb,
  source          text not null check (source in ('purchase', 'gift', 'trial', 'support')),
  starts_at       timestamptz not null default now(),
  expires_at      timestamptz,
  stripe_subscription_item_id text,
  granted_by      uuid,
  note            text,
  created_at      timestamptz not null default now()
);

create index if not exists organization_features_org_idx
  on public.organization_features (organization_id, feature_key);

-- 4. Origine de l'abonnement
alter table public.subscriptions
  add column if not exists source text not null default 'stripe'
  check (source in ('stripe', 'manual', 'trial'));
update public.subscriptions set source = 'manual' where stripe_subscription_id is null;

-- 5. Seed : features
insert into public.features (key, type, name, description, is_addon) values
  ('max_seats',              'limit',   'Sièges',                  'Nombre de membres (admin, manager, technicien)', true),
  ('max_garages',            'limit',   'Garages',                 'Nombre de garages enregistrés', false),
  ('max_quotes_per_month',   'limit',   'Devis / mois',            'Devis créés par mois calendaire', false),
  ('max_invoices_per_month', 'limit',   'Factures / mois',         'Factures créées par mois calendaire', false),
  ('quote_email_sending',    'boolean', 'Envoi des devis par email','Envoyer devis et factures depuis l''application', true),
  ('car_view',               'boolean', 'Vue voiture',             'Vue voiture dans l''édition des devis et factures', true),
  ('quote_to_invoice',       'boolean', 'Conversion en facture',   'Convertir un devis en facture', false)
on conflict (key) do nothing;

-- 6. Plan Premium
insert into public.subscription_plans (name, price_cents, description, code)
select 'premium', 4900, 'Plan premium : toutes les fonctionnalités', 'PREMIUM'
where not exists (select 1 from public.subscription_plans where code = 'PREMIUM');

-- 7. Seed : valeurs par plan
insert into public.plan_features (plan_id, feature_key, value)
select p.id, v.feature_key, v.value
from public.subscription_plans p
join (values
  ('FREE',    'max_seats',              '2'::jsonb),
  ('FREE',    'max_garages',            '5'::jsonb),
  ('FREE',    'max_quotes_per_month',   '5'::jsonb),
  ('FREE',    'max_invoices_per_month', '5'::jsonb),
  ('FREE',    'quote_email_sending',    'false'::jsonb),
  ('FREE',    'car_view',               'false'::jsonb),
  ('FREE',    'quote_to_invoice',       'true'::jsonb),
  ('PREMIUM', 'max_seats',              '10'::jsonb),
  ('PREMIUM', 'max_garages',            'null'::jsonb),
  ('PREMIUM', 'max_quotes_per_month',   'null'::jsonb),
  ('PREMIUM', 'max_invoices_per_month', 'null'::jsonb),
  ('PREMIUM', 'quote_email_sending',    'true'::jsonb),
  ('PREMIUM', 'car_view',               'true'::jsonb),
  ('PREMIUM', 'quote_to_invoice',       'true'::jsonb)
) as v(plan_code, feature_key, value) on p.code = v.plan_code
on conflict (plan_id, feature_key) do nothing;

-- 8. Vue des droits effectifs par organisation
-- Règle : boolean = plan OU grant actif ; limit = illimité si l'un est null,
-- sinon plan + somme des grants actifs.
create or replace view public.organization_effective_features
with (security_invoker = true) as
with org_plan as (
  select s.organization_id, s.plan_id
  from public.subscriptions s
  where s.status = 'active'
    and (s.end_date is null or s.end_date > now())
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

-- 9. RLS : lecture du catalogue pour les utilisateurs connectés, écriture réservée au service role
alter table public.features enable row level security;
alter table public.plan_features enable row level security;
alter table public.organization_features enable row level security;

create policy features_read on public.features for select to authenticated using (true);
create policy plan_features_read on public.plan_features for select to authenticated using (true);
create policy organization_features_read on public.organization_features for select to authenticated
  using (organization_id in (select organization_id from public.organization_members where user_id = auth.uid()));

-- ============================================================
-- EXEMPLES (à lancer manuellement, SQL editor)
-- ============================================================
-- Offrir le plan Premium 1 an à une organisation :
--   update public.subscriptions
--   set plan_id = (select id from public.subscription_plans where code = 'PREMIUM'),
--       source = 'manual', end_date = now() + interval '1 year'
--   where organization_id = '<ORG_ID>';
--
-- Offrir uniquement l'envoi par email, 6 mois :
--   insert into public.organization_features (organization_id, feature_key, value, source, expires_at, note)
--   values ('<ORG_ID>', 'quote_email_sending', 'true', 'gift', now() + interval '6 months', 'Cadeau');
--
-- Offrir 3 sièges supplémentaires :
--   insert into public.organization_features (organization_id, feature_key, value, source, note)
--   values ('<ORG_ID>', 'max_seats', '3', 'gift', 'Sièges offerts');
