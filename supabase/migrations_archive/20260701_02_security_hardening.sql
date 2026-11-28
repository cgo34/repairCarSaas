-- Phase 3: SQL / RLS hardening.
-- Idempotent. Run the audit (supabase/audit/20260701_security_audit.sql) first
-- and review it. Apply manually in the SQL Editor; never auto-grants super_admin.

begin;

-- ---------------------------------------------------------------------------
-- 0. platform_role + is_super_admin()
-- ---------------------------------------------------------------------------
alter table public.users
  add column if not exists platform_role text not null default 'user';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.users'::regclass and conname = 'users_platform_role_check'
  ) then
    alter table public.users
      add constraint users_platform_role_check check (platform_role in ('user', 'super_admin'));
  end if;
end $$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.users u
    where u.id = auth.uid() and u.platform_role = 'super_admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- 1. public.users: no client INSERT, restricted UPDATE columns
--    (rows are created by the on_auth_user_created trigger only)
-- ---------------------------------------------------------------------------
do $$
declare r record;
begin
  for r in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'users' and cmd = 'INSERT'
  loop
    execute format('drop policy %I on public.users', r.policyname);
  end loop;
end $$;

revoke insert, delete, truncate, references, trigger on public.users from anon, authenticated;
revoke update on public.users from anon, authenticated;
-- is_blocked, platform_role, id and percentage_commission are NOT updatable by clients
grant update (first_name, last_name, full_name, phone, email, profile_picture_url) on public.users to authenticated;

-- Existing SELECT / UPDATE (own row) policies on users are kept as audited.

-- ---------------------------------------------------------------------------
-- 2. organization_members: no client INSERT, restricted UPDATE
--    (created by the Edge Function with service_role or provision_organization)
-- ---------------------------------------------------------------------------
do $$
declare r record;
begin
  for r in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'organization_members' and cmd = 'INSERT'
  loop
    execute format('drop policy %I on public.organization_members', r.policyname);
  end loop;
end $$;

revoke insert, truncate, references, trigger on public.organization_members from anon, authenticated;
revoke update on public.organization_members from anon, authenticated;
-- user_id and organization_id are immutable for clients
grant update (role, percentage_commission, status) on public.organization_members to authenticated;

create or replace function public.guard_organization_member_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- service_role / postgres (no end-user JWT) are trusted
  if auth.uid() is null then
    return new;
  end if;

  if new.role is distinct from old.role then
    if not exists (
      select 1 from public.organization_members m
      where m.user_id = auth.uid()
        and m.organization_id = old.organization_id
        and m.role = 'admin'
        and m.status = 'active'
    ) then
      raise exception 'Only an organization admin can change a role' using errcode = '42501';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_guard_organization_member_update on public.organization_members;
create trigger trg_guard_organization_member_update
  before update on public.organization_members
  for each row execute function public.guard_organization_member_update();

-- ---------------------------------------------------------------------------
-- 3. set_user_blocked: super_admin, or org admin/manager for a user that
--    belongs ONLY to organizations they administer; never self, never an admin
--    (unless super_admin).
-- ---------------------------------------------------------------------------
create or replace function public.set_user_blocked(target_user_id uuid, blocked boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  if not public.is_super_admin() then
    if target_user_id = auth.uid() then
      raise exception 'Cannot block yourself' using errcode = '42501';
    end if;

    -- target must be a member of at least one org the caller administers...
    if not exists (
      select 1
      from public.organization_members t
      join public.organization_members c on c.organization_id = t.organization_id
      where t.user_id = target_user_id
        and c.user_id = auth.uid()
        and c.status = 'active'
        and c.role in ('admin', 'manager')
        and t.role <> 'admin'
    ) then
      raise exception 'Not allowed' using errcode = '42501';
    end if;

    -- ...and must not belong to an organization the caller does not manage
    if exists (
      select 1 from public.organization_members t
      where t.user_id = target_user_id
        and not exists (
          select 1 from public.organization_members c
          where c.user_id = auth.uid() and c.organization_id = t.organization_id
            and c.status = 'active' and c.role in ('admin', 'manager')
        )
    ) then
      raise exception 'User belongs to other organizations' using errcode = '42501';
    end if;
  end if;

  update public.users set is_blocked = blocked where id = target_user_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. Function privileges (targeted: RLS helper functions must stay executable)
-- ---------------------------------------------------------------------------
-- is_organization_admin already has search_path=public (body unqualified): left untouched.

revoke execute on function public.set_user_blocked(uuid, boolean) from public, anon;
grant execute on function public.set_user_blocked(uuid, boolean) to authenticated;

revoke execute on function public.is_super_admin() from public, anon;
grant execute on function public.is_super_admin() to authenticated;

revoke execute on function public.is_organization_admin(uuid) from public, anon;
grant execute on function public.is_organization_admin(uuid) to authenticated;

revoke execute on function public.provision_organization(text) from public, anon;
grant execute on function public.provision_organization(text) to authenticated;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.guard_organization_member_update() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 5. Remaining dangerous privileges on every public table
-- ---------------------------------------------------------------------------
do $$
declare t record;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('revoke truncate, references, trigger on public.%I from anon, authenticated', t.tablename);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- 6. Reference tables: readable by authenticated, writable by super_admin only,
--    never deletable by clients.
-- ---------------------------------------------------------------------------
do $$
declare tbl text;
begin
  foreach tbl in array array['body_parts', 'body_materials', 'repair_types', 'document_statuses'] loop
    if to_regclass('public.' || tbl) is not null then
      execute format('alter table public.%I enable row level security', tbl);

      if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = tbl and cmd = 'SELECT') then
        execute format('create policy %I on public.%I for select to authenticated using (true)', tbl || '_read', tbl);
      end if;

      execute format('revoke insert, update, delete on public.%I from anon, authenticated', tbl);
      execute format('grant insert, update on public.%I to authenticated', tbl);

      execute format('drop policy if exists %I on public.%I', tbl || '_super_admin_insert', tbl);
      execute format('create policy %I on public.%I for insert to authenticated with check (public.is_super_admin())',
        tbl || '_super_admin_insert', tbl);
      execute format('drop policy if exists %I on public.%I', tbl || '_super_admin_update', tbl);
      execute format('create policy %I on public.%I for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin())',
        tbl || '_super_admin_update', tbl);
    end if;
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- 7. users.id -> auth.users(id) ON DELETE CASCADE (NOT VALID: existing orphans
--    are tolerated; clean them with the audit query #10 then VALIDATE).
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.users'::regclass and confrelid = 'auth.users'::regclass and contype = 'f'
  ) then
    alter table public.users
      add constraint users_id_auth_users_fkey
      foreign key (id) references auth.users (id) on delete cascade not valid;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 8. Findings of the audit (policies that were wide open)
-- ---------------------------------------------------------------------------
create or replace function public.is_organization_member(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = target_organization_id
      and m.user_id = auth.uid()
      and m.status = 'active'
  );
$$;

revoke execute on function public.is_organization_member(uuid) from public, anon;
grant execute on function public.is_organization_member(uuid) to authenticated;

-- 8a. subscriptions: clients must not create their own (free upgrade to PREMIUM).
--     Subscriptions are created by provision_organization / Stripe webhook (service_role).
drop policy if exists organization_members_can_create_subscriptions on public.subscriptions;
revoke insert, update, delete on public.subscriptions from anon, authenticated;

-- 8b. quotes / invoices had RLS disabled: enable, scoped to the organization.
alter table public.quotes enable row level security;
alter table public.invoices enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array['quotes', 'invoices'] loop
    execute format('drop policy if exists %I on public.%I', tbl || '_org_select', tbl);
    execute format('create policy %I on public.%I for select to authenticated using (public.is_organization_member(organization_id))', tbl || '_org_select', tbl);
    execute format('drop policy if exists %I on public.%I', tbl || '_org_insert', tbl);
    execute format('create policy %I on public.%I for insert to authenticated with check (public.is_organization_member(organization_id))', tbl || '_org_insert', tbl);
    execute format('drop policy if exists %I on public.%I', tbl || '_org_update', tbl);
    execute format('create policy %I on public.%I for update to authenticated using (public.is_organization_member(organization_id)) with check (public.is_organization_member(organization_id))', tbl || '_org_update', tbl);
    execute format('drop policy if exists %I on public.%I', tbl || '_org_delete', tbl);
    execute format('create policy %I on public.%I for delete to authenticated using (public.is_organization_member(organization_id))', tbl || '_org_delete', tbl);
    execute format('revoke all on public.%I from anon', tbl);
  end loop;
end $$;

-- 8c. quote_details / invoice_details: "ALL ... true" gave every authenticated user full access.
drop policy if exists "All operations on quote_details for authenticated" on public.quote_details;
drop policy if exists "All operations on invoice_details for authenticated" on public.invoice_details;

drop policy if exists quote_details_org_all on public.quote_details;
create policy quote_details_org_all on public.quote_details
  for all to authenticated
  using (exists (select 1 from public.quotes q where q.id = quote_id and public.is_organization_member(q.organization_id)))
  with check (exists (select 1 from public.quotes q where q.id = quote_id and public.is_organization_member(q.organization_id)));
-- invoice_details keeps its existing per-operation organization policies.

-- 8d. garage_members had RLS disabled.
alter table public.garage_members enable row level security;

drop policy if exists garage_members_read on public.garage_members;
create policy garage_members_read on public.garage_members
  for select to authenticated
  using (
    exists (
      select 1 from public.organization_members om
      where om.id = garage_members.organization_member_id
        and (om.user_id = auth.uid() or public.is_organization_admin(om.organization_id))
    )
  );

drop policy if exists garage_members_admin_write on public.garage_members;
create policy garage_members_admin_write on public.garage_members
  for all to authenticated
  using (
    exists (
      select 1 from public.organization_members om
      where om.id = garage_members.organization_member_id
        and public.is_organization_admin(om.organization_id)
    )
  )
  with check (
    exists (
      select 1 from public.organization_members om
      where om.id = garage_members.organization_member_id
        and public.is_organization_admin(om.organization_id)
    )
  );
revoke all on public.garage_members from anon;

-- 8e. anon never needs table access (all policies are for authenticated; the
--     grants were the Supabase defaults, RLS being the only barrier).
do $$
declare t record;
begin
  for t in select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
           where n.nspname = 'public' and c.relkind in ('r', 'v', 'm', 'p') loop
    execute format('revoke all on public.%I from anon', t.relname);
  end loop;
end $$;

-- 8f. views run with the owner's rights and bypass RLS unless security_invoker.
do $$
begin
  if to_regclass('public.organization_effective_features') is not null then
    alter view public.organization_effective_features set (security_invoker = true);
    revoke truncate, references, trigger, insert, update, delete on public.organization_effective_features from authenticated;
  end if;
end $$;

commit;

-- After cleaning orphans:
-- alter table public.users validate constraint users_id_auth_users_fkey;
