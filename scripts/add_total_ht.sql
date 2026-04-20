ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS total_ht numeric DEFAULT 0;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS total_ht numeric DEFAULT 0;
NOTIFY pgrst, 'reload schema';
