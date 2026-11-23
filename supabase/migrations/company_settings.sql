-- ============================================================
-- Migration : company_settings
-- Description : Paramètres de l'entreprise (infos légales,
--               coordonnées, bancaires, conditions de paiement)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.company_settings (
  id                    UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id               UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Identité légale
  company_name          TEXT,
  legal_form            TEXT,
  siren                 TEXT,
  siret                 TEXT,
  tva_number            TEXT,
  capital               TEXT,

  -- Coordonnées
  address               TEXT,
  zip_code              TEXT,
  city                  TEXT,
  country               TEXT        DEFAULT 'France',
  phone                 TEXT,
  email                 TEXT,
  website               TEXT,

  -- Coordonnées bancaires
  iban                  TEXT,
  bic                   TEXT,

  -- Conditions de paiement
  payment_delay         INTEGER     DEFAULT 30,
  late_payment_penalty  TEXT,
  recovery_fee          TEXT,

  -- Timestamps
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now(),

  -- Un seul enregistrement par utilisateur
  CONSTRAINT company_settings_user_id_unique UNIQUE (user_id)
);

-- ── RLS ────────────────────────────────────────────────────────
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own company settings"
  ON public.company_settings
  FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── Trigger updated_at ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER company_settings_updated_at
  BEFORE UPDATE ON public.company_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
