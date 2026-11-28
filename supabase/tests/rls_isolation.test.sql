-- RLS isolation between organizations.
-- Fixtures are fictional and rolled back at the end of the file.
-- Queries run as the `authenticated` role are captured into temp tables, and
-- assertions are made as the owner role so pgTAP internals stay accessible.
begin;
select plan(11);

-- Fixtures (as postgres)
insert into auth.users (id, email) values
  ('a0000000-0000-0000-0000-00000000000a', 'user-a@test.invalid'),
  ('b0000000-0000-0000-0000-00000000000b', 'user-b@test.invalid');

insert into public.organizations (id, name, owner_user_id) values
  ('a1000000-0000-0000-0000-00000000000a', 'Org A', 'a0000000-0000-0000-0000-00000000000a'),
  ('b1000000-0000-0000-0000-00000000000b', 'Org B', 'b0000000-0000-0000-0000-00000000000b');

insert into public.organization_members (id, user_id, organization_id, role, status) values
  ('a2000000-0000-0000-0000-00000000000a', 'a0000000-0000-0000-0000-00000000000a', 'a1000000-0000-0000-0000-00000000000a', 'admin', 'active'),
  ('b2000000-0000-0000-0000-00000000000b', 'b0000000-0000-0000-0000-00000000000b', 'b1000000-0000-0000-0000-00000000000b', 'admin', 'active');

insert into public.quotes (id, organization_id, created_by_member_id) values
  ('a3000000-0000-0000-0000-00000000000a', 'a1000000-0000-0000-0000-00000000000a', 'a2000000-0000-0000-0000-00000000000a'),
  ('b3000000-0000-0000-0000-00000000000b', 'b1000000-0000-0000-0000-00000000000b', 'b2000000-0000-0000-0000-00000000000b');

insert into public.garages (id, name, organization_id) values
  ('a4000000-0000-0000-0000-00000000000a', 'Garage A', 'a1000000-0000-0000-0000-00000000000a'),
  ('b4000000-0000-0000-0000-00000000000b', 'Garage B', 'b1000000-0000-0000-0000-00000000000b');

-- Signup trigger and RLS coverage
select is(
  (select count(*)::int from public.users where id in ('a0000000-0000-0000-0000-00000000000a', 'b0000000-0000-0000-0000-00000000000b')),
  2,
  'inserting into auth.users creates the public.users profile'
);

select is_empty(
  $$ select c.relname
     from pg_class c
     join pg_namespace n on n.oid = c.relnamespace
     where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity $$,
  'every table in public has row level security enabled'
);

-- Acting as user A
select set_config('request.jwt.claims', '{"sub":"a0000000-0000-0000-0000-00000000000a","role":"authenticated"}', true);
set local role authenticated;

create temp table as_a on commit drop as
select
  (select count(*) from public.organizations)::int                                                           as orgs,
  (select count(*) from public.quotes)::int                                                                  as quotes,
  (select count(*) from public.quotes where organization_id = 'b1000000-0000-0000-0000-00000000000b')::int  as foreign_quotes,
  (select count(*) from public.garages)::int                                                                 as garages,
  (select count(*) from public.garages where organization_id = 'b1000000-0000-0000-0000-00000000000b')::int as foreign_garages,
  (select count(*) from public.organization_members where organization_id = 'b1000000-0000-0000-0000-00000000000b')::int as foreign_members;

create temp table as_a_writes (insert_denied boolean, update_rows int, delete_rows int) on commit drop;
do $$
declare
  v_denied boolean := false;
  v_updated int;
  v_deleted int;
begin
  begin
    insert into public.quotes (organization_id, created_by_member_id)
    values ('b1000000-0000-0000-0000-00000000000b', 'b2000000-0000-0000-0000-00000000000b');
  exception when insufficient_privilege then
    v_denied := true;
  end;

  update public.quotes set quote_number = 'HACKED'
  where id = 'b3000000-0000-0000-0000-00000000000b';
  get diagnostics v_updated = row_count;

  delete from public.quotes where id = 'b3000000-0000-0000-0000-00000000000b';
  get diagnostics v_deleted = row_count;

  insert into as_a_writes values (v_denied, v_updated, v_deleted);
end;
$$;

reset role;

select is((select orgs from as_a), 1, 'user A sees only its own organization');
select is((select quotes from as_a), 1, 'user A sees only its own quotes');
select is((select foreign_quotes from as_a), 0, 'user A cannot read quotes of organization B');
select is((select garages from as_a), 1, 'user A sees only its own garages');
select is((select foreign_garages from as_a), 0, 'user A cannot read garages of organization B');
select is((select foreign_members from as_a), 0, 'user A cannot read members of organization B');
select ok((select insert_denied from as_a_writes), 'user A cannot insert a quote into organization B');
select is((select update_rows + delete_rows from as_a_writes), 0, 'user A cannot update or delete quotes of organization B');

-- Anonymous visitors
set local role anon;
create temp table as_anon on commit drop as
select (select count(*) from public.quotes)::int as quotes;
reset role;

select is((select quotes from as_anon), 0, 'anonymous role sees no quotes');

select * from finish();
rollback;
