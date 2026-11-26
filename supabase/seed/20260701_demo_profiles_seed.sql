-- =============================================================================
-- Demo organizations + demo profiles (manual seed, idempotent).
--
-- Prerequisites:
--   * migration 20260701_04_demo_profiles.sql applied
--   * the two demo accounts have signed up AND logged in once (so that
--     provision_organization created their organization):
--       therealhiphop34+demofree@gmail.com
--       therealhiphop34+demopremium@gmail.com
--
-- Result: "Demo Free" (FREE plan) and "Demo Premium" (PREMIUM plan), each with
-- three demo profiles (admin, manager, technician) selectable by a super_admin.
-- =============================================================================
do $$
declare
  v_free_org     uuid;
  v_premium_org  uuid;
  v_premium_plan uuid;
begin
  select o.id into v_free_org
  from public.organizations o
  join public.users u on u.id = o.owner_user_id
  where u.email = 'therealhiphop34+demofree@gmail.com'
  order by o.created_at limit 1;

  select o.id into v_premium_org
  from public.organizations o
  join public.users u on u.id = o.owner_user_id
  where u.email = 'therealhiphop34+demopremium@gmail.com'
  order by o.created_at limit 1;

  if v_free_org is null then
    raise exception 'Demo Free organization not found: log in once with therealhiphop34+demofree@gmail.com';
  end if;
  if v_premium_org is null then
    raise exception 'Demo Premium organization not found: log in once with therealhiphop34+demopremium@gmail.com';
  end if;

  select id into v_premium_plan from public.subscription_plans where code = 'PREMIUM' limit 1;
  if v_premium_plan is null then
    raise exception 'PREMIUM plan not found';
  end if;

  update public.organizations set name = 'Demo Free',    updated_at = now() where id = v_free_org;
  update public.organizations set name = 'Demo Premium', updated_at = now() where id = v_premium_org;

  update public.subscriptions
     set plan_id = v_premium_plan, source = 'manual', status = 'active', end_date = null
   where organization_id = v_premium_org;

  insert into public.demo_profiles (organization_id, role, label)
  select o.org_id, r.role, o.org_label || ' – ' || r.role_label
  from (values (v_free_org, 'Demo Free'), (v_premium_org, 'Demo Premium')) as o(org_id, org_label)
  cross join (values ('admin', 'Admin'), ('manager', 'Manager'), ('technician', 'Technician')) as r(role, role_label)
  where r.role <> 'manager' or o.org_id = v_premium_org
  on conflict (organization_id, role) do update set label = excluded.label;
end $$;

-- Check (read-only)
select p.label, p.role, o.name, sp.code as plan
from public.demo_profiles p
join public.organizations o on o.id = p.organization_id
left join public.subscriptions s on s.organization_id = o.id
left join public.subscription_plans sp on sp.id = s.plan_id
order by o.name, p.role;
