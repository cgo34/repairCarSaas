-- =============================================================================
-- 20260701_05_member_ownership_visibility.sql
-- Member management rules:
--   * technician : cannot edit/delete/block anybody
--   * manager    : sees all members, manages ONLY the members he created
--   * admin      : manages every member of his organization
--   * super_admin accounts are invisible and untouchable for everybody else
--
-- Uses RESTRICTIVE policies, so they are ANDed with the existing permissive
-- policies without needing to know or drop them. Idempotent.
-- Apply after 20260701_04.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Who created a member (set by the create-organization-technician function)
-- ---------------------------------------------------------------------------
alter table public.organization_members
  add column if not exists created_by uuid references public.users(id) on delete set null;

-- ---------------------------------------------------------------------------
-- 2. Helpers (security definer: no RLS recursion)
-- ---------------------------------------------------------------------------
create or replace function public.is_super_admin_user(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.users u
    where u.id = p_user_id and u.platform_role = 'super_admin'
  );
$$;

-- May the caller edit / delete / block this member row?
create or replace function public.can_manage_member(p_member_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    public.is_super_admin()
    or exists (
      select 1
      from public.organization_members t
      join public.organization_members c
        on c.organization_id = t.organization_id
       and c.user_id = auth.uid()
       and c.status = 'active'
      where t.id = p_member_id
        and not public.is_super_admin_user(t.user_id)
        and (
          c.role = 'admin'
          or (c.role = 'manager' and t.created_by = auth.uid() and t.role = 'technician')
        )
    );
$$;

-- May the caller edit this user's profile (public.users row)?
create or replace function public.can_manage_user(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    p_user_id = auth.uid()
    or public.is_super_admin()
    or exists (
      select 1
      from public.organization_members t
      where t.user_id = p_user_id
        and public.can_manage_member(t.id)
    );
$$;

revoke execute on function public.is_super_admin_user(uuid) from public, anon;
revoke execute on function public.can_manage_member(uuid)   from public, anon;
revoke execute on function public.can_manage_user(uuid)     from public, anon;
grant execute on function public.is_super_admin_user(uuid) to authenticated;
grant execute on function public.can_manage_member(uuid)   to authenticated;
grant execute on function public.can_manage_user(uuid)     to authenticated;

-- ---------------------------------------------------------------------------
-- 3. organization_members
-- ---------------------------------------------------------------------------
drop policy if exists om_hide_super_admin  on public.organization_members;
drop policy if exists om_restrict_update   on public.organization_members;
drop policy if exists om_restrict_delete   on public.organization_members;

create policy om_hide_super_admin on public.organization_members
  as restrictive for select to authenticated
  using (
    public.is_super_admin()
    or not public.is_super_admin_user(user_id)
    or user_id = auth.uid()
  );

create policy om_restrict_update on public.organization_members
  as restrictive for update to authenticated
  using (public.can_manage_member(id))
  with check (public.can_manage_member(id));

create policy om_restrict_delete on public.organization_members
  as restrictive for delete to authenticated
  using (public.can_manage_member(id));

-- ---------------------------------------------------------------------------
-- 4. public.users
-- ---------------------------------------------------------------------------
drop policy if exists users_hide_super_admin on public.users;
drop policy if exists users_restrict_update  on public.users;

create policy users_hide_super_admin on public.users
  as restrictive for select to authenticated
  using (
    platform_role <> 'super_admin'
    or id = auth.uid()
    or public.is_super_admin()
  );

create policy users_restrict_update on public.users
  as restrictive for update to authenticated
  using (public.can_manage_user(id))
  with check (public.can_manage_user(id));

-- Managers edit the profile of the technicians they created
drop policy if exists "Managers can update own created users" on public.users;
create policy "Managers can update own created users" on public.users
  for update to authenticated
  using (
    exists (
      select 1 from public.organization_members t
      where t.user_id = users.id and public.can_manage_member(t.id)
    )
  )
  with check (
    exists (
      select 1 from public.organization_members t
      where t.user_id = users.id and public.can_manage_member(t.id)
    )
  );

-- ---------------------------------------------------------------------------
-- 5. set_user_blocked: same ownership rule
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

    -- the caller must manage every membership of the target
    if not exists (
         select 1 from public.organization_members t
         where t.user_id = target_user_id
       )
       or exists (
         select 1 from public.organization_members t
         where t.user_id = target_user_id
           and not public.can_manage_member(t.id)
       ) then
      raise exception 'Not allowed' using errcode = '42501';
    end if;
  end if;

  update public.users set is_blocked = blocked where id = target_user_id;
end;
$$;

revoke execute on function public.set_user_blocked(uuid, boolean) from public, anon;
grant execute on function public.set_user_blocked(uuid, boolean) to authenticated;
