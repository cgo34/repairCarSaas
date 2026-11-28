-- ============================================================
-- Migration : quotes_add_accepted_converted_at
-- Description : Dates d'acceptation et de conversion en facture
--               d'un devis (historique de la page de visualisation)
-- ============================================================

ALTER TABLE public.quotes
  ADD COLUMN IF NOT EXISTS accepted_at  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS converted_at TIMESTAMPTZ;

-- Reprise des devis existants : date de conversion approximée par la date de facturation
UPDATE public.quotes q
SET converted_at = COALESCE(
  (SELECT MIN(i.created_at) FROM public.invoices i WHERE i.quote_id = q.id),
  q.created_at
)
WHERE q.convert_to_invoice = true AND q.converted_at IS NULL;
