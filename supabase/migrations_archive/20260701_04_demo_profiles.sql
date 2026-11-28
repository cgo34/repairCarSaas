-- =============================================================================
-- 20260701_04_demo_profiles.sql
-- Demo profile switcher for super_admin.
--
-- A super_admin has no organization of its own scope. To explore the product it
-- "acts as" one demo profile (organization + role). Switching is server
-- enforced: the RPCs below are the ONLY way to change the caller's demo
-- membership, and they check is_super_admin() themselves.
--
-- Mechanism: the super_admin gets a regular organization_members row in the
-- chosen demo organization (role = profile role, status = active). Existing RLS
-- (is_organization_member) then applies unchanged. Other demo memberships are
-- archived. Real (non-demo) memberships are never touched.
--
-- Idempotent. To be applied manually in the Supabase SQL Editor, after
-- 20260701_02 and 20260701_03.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.demo_profiles (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  role            text not null check (role in ('admin', 'manager', 'technician')),
  label           text not null,
  created_at      timestamptz not null default now(),
  unique (organization_id, role)
);

create table if not exists public.demo_profile_context (
  user_id         uuid primary key references public.users(id) on delete cascade,
  profile_id      uuid not null references public.demo_profiles(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  role            text not null,
  updated_at      timestamptz not null default now()
);

create table if not exists public.profile_switch_log (
  id              bigint generated always as identity primary key,
  user_id         uuid not null references public.users(id) on delete cascade,
  action          text not null check (action in ('switch', 'clear')),
  profile_id      uuid references public.demo_profiles(id) on delete set null,
  organization_id uuid references public.organizations(id) on delete set null,
  role            text,
  created_at      timestamptz not null default now()
);

alter table public.demo_profiles        enable row level security;
alter table public.demo_profile_context enable row level security;
alter table public.profile_switch_log   enable row level security;

drop policy if exists demo_profiles_super_admin_select on public.demo_profiles;
create policy demo_profiles_super_admin_select on public.demo_profiles
  for select to authenticated using (public.is_super_admin());

drop policy if exists demo_profile_context_own_select on public.demo_profile_context;
create policy demo_profile_context_own_select on public.demo_profile_context
  for select to authenticated using (user_id = auth.uid() and public.is_super_admin());

drop policy if exists profile_switch_log_super_admin_select on public.profile_switch_log;
create policy profile_switch_log_super_admin_select on public.profile_switch_log
  for select to authenticated using (public.is_super_admin());

-- Read-only for clients; writes only through the SECURITY DEFINER RPCs below
revoke all on public.demo_profiles, public.demo_profile_context, public.profile_switch_log from anon, authenticated;
grant select on public.demo_profiles, public.demo_profile_context, public.profile_switch_log to authenticated;

-- ---------------------------------------------------------------------------
-- 2. A super_admin may change member roles (needed to act as another role).
--    Same guard as 20260701_02, plus the super_admin exception.
-- ---------------------------------------------------------------------------
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
    if not public.is_super_admin() and not exists (
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

revoke execute on function public.guard_organization_member_update() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. RPCs (super_admin only, enforced server-side)
-- ---------------------------------------------------------------------------

-- 3a. Available profiles with their organization and plan
create or replace function public.list_demo_profiles()
returns table (
  profile_id        uuid,
  organization_id   uuid,
  organization_name text,
  plan_code         text,
  role              text,
  label             text
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  return query
  select p.id, p.organization_id, o.name, sp.code, p.role, p.label
  from public.demo_profiles p
  join public.organizations o on o.id = p.organization_id
  left join public.subscriptions s on s.organization_id = o.id
  left join public.subscription_plans sp on sp.id = s.plan_id
  order by o.name,
           case p.role when 'admin' then 1 when 'manager' then 2 else 3 end;
end;
$$;

-- 3b. Current context of the caller
create or replace function public.get_demo_profile_context()
returns table (profile_id uuid, organization_id uuid, role text)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  return query
  select c.profile_id, c.organization_id, c.role
  from public.demo_profile_context c
  where c.user_id = auth.uid();
end;
$$;

-- 3c. Switch to a demo profile
create or replace function public.switch_demo_profile(p_profile_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid     uuid := auth.uid();
  v_profile public.demo_profiles%rowtype;
  v_member  uuid;
begin
  if v_uid is null or not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  select * into v_profile from public.demo_profiles where id = p_profile_id;
  if not found then
    raise exception 'Demo profile not found' using errcode = 'P0002';
  end if;

  -- Archive the caller's memberships in OTHER demo organizations only
  update public.organization_members m
     set status = 'archived'
   where m.user_id = v_uid
     and m.organization_id <> v_profile.organization_id
     and m.status = 'active'
     and exists (select 1 from public.demo_profiles d where d.organization_id = m.organization_id);

  -- Stable membership per demo organization (keeps created_by/assigned ids valid)
  select id into v_member
  from public.organization_members
  where user_id = v_uid and organization_id = v_profile.organization_id
  limit 1;

  if v_member is null then
    insert into public.organization_members (user_id, organization_id, role, status)
    values (v_uid, v_profile.organization_id, v_profile.role, 'active');
  else
    update public.organization_members
       set role = v_profile.role, status = 'active'
     where id = v_member;
  end if;

  insert into public.demo_profile_context (user_id, profile_id, organization_id, role, updated_at)
  values (v_uid, v_profile.id, v_profile.organization_id, v_profile.role, now())
  on conflict (user_id) do update
    set profile_id = excluded.profile_id,
        organization_id = excluded.organization_id,
        role = excluded.role,
        updated_at = now();

  insert into public.profile_switch_log (user_id, action, profile_id, organization_id, role)
  values (v_uid, 'switch', v_profile.id, v_profile.organization_id, v_profile.role);
end;
$$;

-- 3d. Leave the demo context (back to the global super_admin context)
create or replace function public.clear_demo_profile()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null or not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  update public.organization_members m
     set status = 'archived'
   where m.user_id = v_uid
     and m.status = 'active'
     and exists (select 1 from public.demo_profiles d where d.organization_id = m.organization_id);

  delete from public.demo_profile_context where user_id = v_uid;

  insert into public.profile_switch_log (user_id, action)
  values (v_uid, 'clear');
end;
$$;

revoke execute on function public.list_demo_profiles()       from public, anon;
revoke execute on function public.get_demo_profile_context() from public, anon;
revoke execute on function public.switch_demo_profile(uuid)  from public, anon;
revoke execute on function public.clear_demo_profile()       from public, anon;
grant execute on function public.list_demo_profiles()       to authenticated;
grant execute on function public.get_demo_profile_context() to authenticated;
grant execute on function public.switch_demo_profile(uuid)  to authenticated;
grant execute on function public.clear_demo_profile()       to authenticated;
