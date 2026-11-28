-- Post-hardening fixes found during manual testing.
begin;

-- 1. Admins edit name/email of members of their organization.
-- Before, only "update own profile" existed: the update silently affected 0 rows.
-- Column-level grants still restrict writable columns (no is_blocked / platform_role).
drop policy if exists "Admins can update organization users" on public.users;
create policy "Admins can update organization users" on public.users
  for update to authenticated
  using (
    exists (
      select 1 from public.organization_members om
      where om.user_id = users.id
        and public.is_organization_admin(om.organization_id)
    )
  )
  with check (
    exists (
      select 1 from public.organization_members om
      where om.user_id = users.id
        and public.is_organization_admin(om.organization_id)
    )
  );

-- 2. Invoices converted from a quote lost their garage_id (the mapper only
-- read invoice.garage.id). Backfill from the source quote.
update public.invoices i
set garage_id = q.garage_id
from public.quotes q
where q.id = i.quote_id
  and i.garage_id is null
  and q.garage_id is not null;

commit;
