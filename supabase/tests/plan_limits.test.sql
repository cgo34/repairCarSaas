-- Plan quotas enforced by the enforce_plan_limit trigger (FREE plan:
-- 1 garage, 10 quotes per month). Fixtures are rolled back at the end.
begin;
select plan(5);

insert into auth.users (id, email) values
  ('c0000000-0000-0000-0000-00000000000c', 'owner@test.invalid');

insert into public.organizations (id, name, owner_user_id) values
  ('c1000000-0000-0000-0000-00000000000c', 'Free org', 'c0000000-0000-0000-0000-00000000000c');

insert into public.organization_members (id, user_id, organization_id, role, status) values
  ('c2000000-0000-0000-0000-00000000000c', 'c0000000-0000-0000-0000-00000000000c', 'c1000000-0000-0000-0000-00000000000c', 'admin', 'active');

insert into public.subscriptions (organization_id, plan_id, status, source, start_date)
select 'c1000000-0000-0000-0000-00000000000c', id, 'active', 'manual', now()
from public.subscription_plans where code = 'FREE';

select is(
  public.org_limit('c1000000-0000-0000-0000-00000000000c', 'max_garages'),
  1,
  'FREE plan allows 1 garage'
);

-- Garages
select lives_ok(
  $$ insert into public.garages (name, organization_id) values ('G1', 'c1000000-0000-0000-0000-00000000000c') $$,
  'first garage is accepted'
);

select throws_like(
  $$ insert into public.garages (name, organization_id) values ('G2', 'c1000000-0000-0000-0000-00000000000c') $$,
  'PLAN_LIMIT_GARAGES%',
  'second garage is rejected on the FREE plan'
);

-- Quotes
insert into public.quotes (organization_id, created_by_member_id)
select 'c1000000-0000-0000-0000-00000000000c', 'c2000000-0000-0000-0000-00000000000c'
from generate_series(1, 10);

select throws_like(
  $$ insert into public.quotes (organization_id, created_by_member_id)
     values ('c1000000-0000-0000-0000-00000000000c', 'c2000000-0000-0000-0000-00000000000c') $$,
  'PLAN_LIMIT_QUOTES%',
  '11th quote of the month is rejected on the FREE plan'
);

-- Demo organizations are exempt from limits
update public.organizations set is_demo = true where id = 'c1000000-0000-0000-0000-00000000000c';

select lives_ok(
  $$ insert into public.garages (name, organization_id) values ('G3', 'c1000000-0000-0000-0000-00000000000c') $$,
  'demo organizations bypass plan limits'
);

select * from finish();
rollback;
