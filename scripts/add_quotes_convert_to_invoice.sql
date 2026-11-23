-- Marque les devis convertis en facture (le statut 'invoiced' n'est plus utilisé).
alter table public.quotes
  add column if not exists convert_to_invoice boolean not null default false;

-- Reprise de l'existant : devis ayant déjà une facture, ou ancien statut 'invoiced'.
update public.quotes q
set convert_to_invoice = true
where exists (select 1 from public.invoices i where i.quote_id = q.id)
   or q.status_id in (select id from public.document_statuses where code = 'invoiced');

-- Un devis converti reste "accepté".
update public.quotes
set status_id = (select id from public.document_statuses where code = 'accepted' limit 1)
where status_id in (select id from public.document_statuses where code = 'invoiced');
