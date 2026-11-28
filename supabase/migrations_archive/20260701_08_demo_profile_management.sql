-- =============================================================================
-- 20260701_08_demo_profile_management.sql
-- Lets a super_admin add / remove switch profiles of an EXISTING demo
-- organization (an organization that already has at least one demo_profiles
-- row). One profile per (organization, role), as enforced by the table.
--
-- Idempotent. To be applied manually in the Supabase SQL Editor, after _04.
-- =============================================================================

create or replace function public.create_demo_profile(
  p_organization_id uuid,
  p_role            text,
  p_label           text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
begin
  if auth.uid() is null or not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  if p_role not in ('admin', 'manager', 'technician') then
    raise exception 'Invalid role' using errcode = '22023';
  end if;

  if not exists (select 1 from public.demo_profiles d where d.organization_id = p_organization_id) then
    raise exception 'Not a demo organization' using errcode = '42501';
  end if;

  insert into public.demo_profiles (organization_id, role, label)
  values (p_organization_id, p_role, coalesce(nullif(trim(p_label), ''), initcap(p_role)))
  returning id into v_id;

  return v_id;
end;
$$;

create or replace function public.delete_demo_profile(p_profile_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_org uuid;
begin
  if auth.uid() is null or not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  select organization_id into v_org from public.demo_profiles where id = p_profile_id;
  if v_org is null then
    raise exception 'Demo profile not found' using errcode = 'P0002';
  end if;

  -- Keep at least one profile so the organization stays a demo organization
  if (select count(*) from public.demo_profiles where organization_id = v_org) <= 1 then
    raise exception 'Cannot delete the last profile of a demo organization' using errcode = '23514';
  end if;

  delete from public.demo_profiles where id = p_profile_id;
end;
$$;

revoke execute on function public.create_demo_profile(uuid, text, text) from public, anon;
revoke execute on function public.delete_demo_profile(uuid)             from public, anon;
grant execute on function public.create_demo_profile(uuid, text, text) to authenticated;
grant execute on function public.delete_demo_profile(uuid)             to authenticated;
