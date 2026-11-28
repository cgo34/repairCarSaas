-- One-off: delete the quote(s) of the legacy organization "CGO34's workspace".
-- Run in the Supabase SQL Editor. Run the preview first and check it before the delete.

-- 0. Preview
select o.id as organization_id, o.name, q.id as quote_id, q.created_at
from public.organizations o
join public.quotes q on q.organization_id = o.id
where o.id = '83f7bb3c-6126-4619-82ef-efe92d79a54e';

-- 1. Delete (details first, then the quotes), only if the organization has no invoice
do $$
declare
  v_org uuid;
  v_invoices int;
begin
  select id into v_org from public.organizations where id = '83f7bb3c-6126-4619-82ef-efe92d79a54e';
  if v_org is null then
    raise exception 'Organization not found';
  end if;

  select count(*) into v_invoices from public.invoices where organization_id = v_org;
  if v_invoices > 0 then
    raise exception 'Organization has % invoice(s), aborting', v_invoices;
  end if;

  delete from public.quote_details
   where quote_id in (select id from public.quotes where organization_id = v_org);
  delete from public.quotes where organization_id = v_org;
end;
$$;

-- 2. Verify (expected: 0)
select count(*) as remaining_quotes
from public.quotes q
join public.organizations o on o.id = q.organization_id
where o.id = '83f7bb3c-6126-4619-82ef-efe92d79a54e';
