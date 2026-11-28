-- ============================================================
-- Migration : company_settings_add_logo
-- Description : Ajout de la colonne logo_url sur company_settings
-- ============================================================

ALTER TABLE public.company_settings
  ADD COLUMN IF NOT EXISTS logo_url TEXT;
