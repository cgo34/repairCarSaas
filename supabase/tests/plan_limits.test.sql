-- Plan quotas and feature flags enforced in the database (FREE vs Premium).
-- FREE: 1 garage, 10 quotes, 5 invoices, 3 quote->invoice conversions per
-- month; Premium lifts every limit. Fixtures are rolled back at the end.
begin;
select plan(16);

insert into auth.users (id, email) values
  ('c0000000-0000-0000-0000-00000000000c', 'owner-c@test.invalid'),
  ('d0000000-0000-0000-0000-00000000000d', 'owner-d@test.invalid'),
  ('e0000000-0000-0000-0000-00000000000e', 'owner-e@test.invalid');

insert into public.organizations (id, name, owner_user_id) values
  ('c1000000-0000-0000-0000-00000000000c', 'Free org (garages, quotes)', 'c0000000-0000-0000-0000-00000000000c'),
  ('d1000000-0000-0000-0000-00000000000d', 'Free org (invoices)',        'd0000000-0000-0000-0000-00000000000d'),
  ('e1000000-0000-0000-0000-00000000000e', 'Premium org',                'e0000000-0000-0000-0000-00000000000e');

insert into public.organization_members (id, user_id, organization_id, role, status) values
  ('c2000000-0000-0000-0000-00000000000c', 'c0000000-0000-0000-0000-00000000000c', 'c1000000-0000-0000-0000-00000000000c', 'admin', 'active'),
  ('d2000000-0000-0000-0000-00000000000d', 'd0000000-0000-0000-0000-00000000000d', 'd1000000-0000-0000-0000-00000000000d', 'admin', 'active'),
  ('e2000000-0000-0000-0000-00000000000e', 'e0000000-0000-0000-0000-00000000000e', 'e1000000-0000-0000-0000-00000000000e', 'admin', 'active');

insert into public.subscriptions (organization_id, plan_id, status, source, start_date)
select o.id, p.id, 'active', 'manual', now()
from (values
  ('c1000000-0000-0000-0000-00000000000c'::uuid, 'FREE'),
  ('d1000000-0000-0000-0000-00000000000d'::uuid, 'FREE'),
  ('e1000000-0000-0000-0000-00000000000e'::uuid, 'PREMIUM')
) as o(id, plan_code)
join public.subscription_plans p on p.code = o.plan_code;

-- Garages and quotes on FREE
select is(
  public.org_limit('c1000000-0000-0000-0000-00000000000c', 'max_garages'),
  1,
  'FREE plan allows 1 garage'
);

select lives_ok(
  $$ insert into public.garages (name, organization_id) values ('G1', 'c1000000-0000-0000-0000-00000000000c') $$,
  'first garage is accepted'
);

select throws_like(
  $$ insert into public.garages (name, organization_id) values ('G2', 'c1000000-0000-0000-0000-00000000000c') $$,
  'PLAN_LIMIT_GARAGES%',
  'second garage is rejected on the FREE plan'
);

insert into public.quotes (organization_id, created_by_member_id)
select 'c1000000-0000-0000-0000-00000000000c', 'c2000000-0000-0000-0000-00000000000c'
from generate_series(1, 10);

select throws_like(
  $$ insert into public.quotes (organization_id, created_by_member_id)
     values ('c1000000-0000-0000-0000-00000000000c', 'c2000000-0000-0000-0000-00000000000c') $$,
  'PLAN_LIMIT_QUOTES%',
  '11th quote of the month is rejected on the FREE plan'
);

update public.organizations set is_demo = true where id = 'c1000000-0000-0000-0000-00000000000c';

select lives_ok(
  $$ insert into public.garages (name, organization_id) values ('G3', 'c1000000-0000-0000-0000-00000000000c') $$,
  'demo organizations bypass plan limits'
);

-- Invoices and conversions on FREE
insert into public.quotes (organization_id, created_by_member_id)
select 'd1000000-0000-0000-0000-00000000000d', 'd2000000-0000-0000-0000-00000000000d'
from generate_series(1, 4);

select lives_ok(
  $$ insert into public.invoices (organization_id, quote_id, created_by_member_id)
     select 'd1000000-0000-0000-0000-00000000000d', q.id, 'd2000000-0000-0000-0000-00000000000d'
     from public.quotes q where q.organization_id = 'd1000000-0000-0000-0000-00000000000d' limit 3 $$,
  '3 quote conversions are accepted on the FREE plan'
);

select throws_like(
  $$ insert into public.invoices (organization_id, quote_id, created_by_member_id)
     select 'd1000000-0000-0000-0000-00000000000d', q.id, 'd2000000-0000-0000-0000-00000000000d'
     from public.quotes q
     where q.organization_id = 'd1000000-0000-0000-0000-00000000000d'
       and q.id not in (select quote_id from public.invoices where quote_id is not null)
     limit 1 $$,
  'PLAN_LIMIT_CONVERSIONS%',
  '4th conversion of the month is rejected on the FREE plan'
);

select lives_ok(
  $$ insert into public.invoices (organization_id, created_by_member_id)
     select 'd1000000-0000-0000-0000-00000000000d', 'd2000000-0000-0000-0000-00000000000d'
     from generate_series(1, 2) $$,
  'invoices up to the limit of 5 are accepted'
);

select throws_like(
  $$ insert into public.invoices (organization_id, created_by_member_id)
     values ('d1000000-0000-0000-0000-00000000000d', 'd2000000-0000-0000-0000-00000000000d') $$,
  'PLAN_LIMIT_INVOICES%',
  '6th invoice of the month is rejected on the FREE plan'
);

-- Feature flags on FREE (as member of the FREE org)
select set_config('request.jwt.claims', '{"sub":"d0000000-0000-0000-0000-00000000000d","role":"authenticated"}', true);

select is(public.can_use_feature('d1000000-0000-0000-0000-00000000000d', 'quote_email_sending'), false, 'FREE: quote email sending is disabled');
select is(public.can_use_feature('d1000000-0000-0000-0000-00000000000d', 'car_view'), false, 'FREE: car view is disabled');
select is(public.can_use_feature('d1000000-0000-0000-0000-00000000000d', 'quote_to_invoice'), true, 'FREE: quote to invoice is enabled');

-- Premium lifts the limits
select is(
  public.org_limit('e1000000-0000-0000-0000-00000000000e', 'max_garages'),
  null,
  'Premium plan has no garage limit'
);

select lives_ok(
  $$ insert into public.garages (name, organization_id)
     select 'PG' || n, 'e1000000-0000-0000-0000-00000000000e' from generate_series(1, 3) n $$,
  'Premium: several garages are accepted'
);

select lives_ok(
  $$ insert into public.quotes (organization_id, created_by_member_id)
     select 'e1000000-0000-0000-0000-00000000000e', 'e2000000-0000-0000-0000-00000000000e'
     from generate_series(1, 11) $$,
  'Premium: more than 10 quotes per month are accepted'
);

select set_config('request.jwt.claims', '{"sub":"e0000000-0000-0000-0000-00000000000e","role":"authenticated"}', true);

select is(
  public.can_use_feature('e1000000-0000-0000-0000-00000000000e', 'car_view')
    and public.can_use_feature('e1000000-0000-0000-0000-00000000000e', 'invoice_email_sending'),
  true,
  'Premium: car view and invoice email sending are enabled'
);

select * from finish();
rollback;
