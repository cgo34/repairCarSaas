-- max_seats enforced on organization_members (FREE = 2, Premium = 10).
-- Pending members count; blocked/archived do not. Fixtures are rolled back.
begin;
select plan(9);

insert into auth.users (id, email) values
  ('f0000000-0000-0000-0000-000000000001', 'seat1@test.invalid'),
  ('f0000000-0000-0000-0000-000000000002', 'seat2@test.invalid'),
  ('f0000000-0000-0000-0000-000000000003', 'seat3@test.invalid'),
  ('f0000000-0000-0000-0000-000000000004', 'seat4@test.invalid');

insert into public.organizations (id, name, owner_user_id) values
  ('f1000000-0000-0000-0000-000000000001', 'Free org (seats)',    'f0000000-0000-0000-0000-000000000001'),
  ('f1000000-0000-0000-0000-000000000002', 'Premium org (seats)', 'f0000000-0000-0000-0000-000000000004');

insert into public.subscriptions (organization_id, plan_id, status, source, start_date)
select o.id, p.id, 'active', 'manual', now()
from (values
  ('f1000000-0000-0000-0000-000000000001'::uuid, 'FREE'),
  ('f1000000-0000-0000-0000-000000000002'::uuid, 'PREMIUM')
) as o(id, plan_code)
join public.subscription_plans p on p.code = o.plan_code;

select is(
  public.org_limit('f1000000-0000-0000-0000-000000000001', 'max_seats'),
  2,
  'FREE plan allows 2 seats'
);

select lives_ok(
  $$ insert into public.organization_members (id, user_id, organization_id, role, status)
     values ('f2000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001',
             'f1000000-0000-0000-0000-000000000001', 'admin', 'active') $$,
  'first seat is accepted'
);

select lives_ok(
  $$ insert into public.organization_members (id, user_id, organization_id, role, status)
     values ('f2000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002',
             'f1000000-0000-0000-0000-000000000001', 'technician', 'pending') $$,
  'second seat (pending) is accepted'
);

select throws_like(
  $$ insert into public.organization_members (id, user_id, organization_id, role, status)
     values ('f2000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000003',
             'f1000000-0000-0000-0000-000000000001', 'technician', 'active') $$,
  'PLAN_LIMIT_SEATS%',
  'third seat is rejected because the pending member counts'
);

select lives_ok(
  $$ insert into public.organization_members (id, user_id, organization_id, role, status)
     values ('f2000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000003',
             'f1000000-0000-0000-0000-000000000001', 'technician', 'archived') $$,
  'an archived member does not use a seat'
);

select throws_like(
  $$ update public.organization_members set status = 'active'
     where id = 'f2000000-0000-0000-0000-000000000003' $$,
  'PLAN_LIMIT_SEATS%',
  'reactivating an archived member beyond the limit is rejected'
);

select lives_ok(
  $$ update public.organization_members set status = 'active'
     where id = 'f2000000-0000-0000-0000-000000000002' $$,
  'pending -> active does not change the seat count'
);

update public.organizations set is_demo = true where id = 'f1000000-0000-0000-0000-000000000001';

select lives_ok(
  $$ update public.organization_members set status = 'active'
     where id = 'f2000000-0000-0000-0000-000000000003' $$,
  'demo organizations bypass the seat limit'
);

select is(
  public.org_limit('f1000000-0000-0000-0000-000000000002', 'max_seats'),
  10,
  'Premium plan allows 10 seats'
);

select * from finish();
rollback;
