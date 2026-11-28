-- =============================================================================
-- 20260701_18_set_organization_demo.sql
-- Lets a super admin flag / unflag an organization as a demo organization.
-- SECURITY DEFINER, restricted to is_super_admin(). Idempotent.
-- =============================================================================

drop function if exists public.set_organization_demo(uuid, boolean);

create or replace function public.set_organization_demo(p_organization_id uuid, p_is_demo boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  update public.organizations o
     set is_demo = coalesce(p_is_demo, false),
         updated_at = now()
   where o.id = p_organization_id;

  if not found then
    raise exception 'Organization not found' using errcode = 'P0002';
  end if;
end;
$$;

revoke execute on function public.set_organization_demo(uuid, boolean) from public, anon;
grant execute on function public.set_organization_demo(uuid, boolean) to authenticated;
