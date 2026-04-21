-- Migration future : table company_profiles
-- Actuellement les données sont stockées en localStorage (useCompanyProfile.ts)
-- Exécuter ce script pour migrer vers Supabase

CREATE TABLE IF NOT EXISTS company_profiles (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Identité légale
  company_name  TEXT NOT NULL DEFAULT '',
  legal_form    TEXT NOT NULL DEFAULT 'EI',
  capital       TEXT,
  siren         CHAR(9),
  siret         CHAR(14),
  tva_number    TEXT,

  -- Coordonnées
  address       TEXT NOT NULL DEFAULT '',
  zip_code      TEXT NOT NULL DEFAULT '',
  city          TEXT NOT NULL DEFAULT '',
  country       TEXT NOT NULL DEFAULT 'FR',
  phone         TEXT,
  email         TEXT,
  website       TEXT,

  -- Bancaire
  iban          TEXT,
  bic           TEXT,

  -- Facturation
  payment_delay         INTEGER NOT NULL DEFAULT 30,
  late_payment_penalty  TEXT DEFAULT '3 fois le taux légal en vigueur',
  recovery_fee          TEXT DEFAULT '40 €',

  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id)
);

-- RLS
ALTER TABLE company_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_profile"
ON company_profiles
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Index
CREATE INDEX IF NOT EXISTS idx_company_profiles_user_id ON company_profiles(user_id);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER company_profiles_updated_at
BEFORE UPDATE ON company_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
