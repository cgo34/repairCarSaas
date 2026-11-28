-- Nettoyage des statuts : ajoute draft/pending, migre devis + factures, supprime processing/finalized.
begin;

insert into document_statuses (code, label)
select v.code, v.label
from (values ('draft', 'Draft'), ('pending', 'Pending')) as v(code, label)
where not exists (select 1 from document_statuses d where d.code = v.code);

-- Devis : non envoyés -> draft, envoyés -> pending (accepted/refused/invoiced/cancelled inchangés)
update quotes
set status_id = (select id from document_statuses where code = 'draft')
where is_sent = false
  and status_id in (select id from document_statuses where code in ('processing', 'finalized'));

update quotes
set status_id = (select id from document_statuses where code = 'pending')
where is_sent = true
  and status_id in (select id from document_statuses where code in ('processing', 'finalized'));

-- Factures : processing -> pending, finalized -> paid
update invoices
set status_id = (select id from document_statuses where code = 'pending')
where status_id = (select id from document_statuses where code = 'processing');

update invoices
set status_id = (select id from document_statuses where code = 'paid')
where status_id = (select id from document_statuses where code = 'finalized');

-- Suppression uniquement si plus aucune référence
delete from document_statuses d
where d.code in ('processing', 'finalized')
  and not exists (select 1 from quotes q where q.status_id = d.id)
  and not exists (select 1 from invoices i where i.status_id = d.id);

commit;
