-- ============================================================
-- Script de création des tables manquantes
-- Projet : RepairCarSaaS — Nouveau Supabase afeqjyfntwujsyqpuimi
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- ============================================================

-- Extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- 1. repair_types
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.repair_types (
  id   uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code text,
  name text
);

-- ------------------------------------------------------------
-- 2. quote_details
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quote_details (
  id                 uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id           uuid REFERENCES public.quotes(id) ON DELETE CASCADE,
  body_part_id       uuid REFERENCES public.body_parts(id),
  body_material_id   uuid REFERENCES public.body_materials(id),
  repair_type_id     uuid REFERENCES public.repair_types(id),
  impact_count_25    numeric,
  impact_count_35    numeric,
  dent_removal_price numeric,
  price              numeric
);

-- ------------------------------------------------------------
-- 3. invoice_details
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.invoice_details (
  id                 uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id         uuid REFERENCES public.invoices(id) ON DELETE CASCADE,
  body_part_id       uuid REFERENCES public.body_parts(id),
  body_material_id   uuid REFERENCES public.body_materials(id),
  repair_type_id     uuid REFERENCES public.repair_types(id),
  impact_count_25    numeric,
  impact_count_35    numeric,
  dent_removal_price numeric,
  price              numeric
);

-- ------------------------------------------------------------
-- 4. setting_price_diameter_coefficient
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.setting_price_diameter_coefficient (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid REFERENCES public.users(id),
  diameter   numeric,
  coefficient numeric
);

-- ------------------------------------------------------------
-- 5. setting_price_impact_count_to_ut
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.setting_price_impact_count_to_ut (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          uuid REFERENCES public.users(id),
  impact_count_min numeric,
  impact_count_max numeric,
  unit_time        numeric
);

-- ------------------------------------------------------------
-- 6. setting_price_body_material_coefficient
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.setting_price_body_material_coefficient (
  body_material_id     uuid NOT NULL REFERENCES public.body_materials(id),
  user_id              uuid NOT NULL REFERENCES public.users(id),
  material_coefficient numeric,
  PRIMARY KEY (body_material_id, user_id)
);

-- ------------------------------------------------------------
-- 7. setting_price_body_part_coefficient
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.setting_price_body_part_coefficient (
  body_part_id            uuid NOT NULL REFERENCES public.body_parts(id),
  user_id                 uuid NOT NULL REFERENCES public.users(id),
  difficulty_coefficient  numeric,
  PRIMARY KEY (body_part_id, user_id)
);

-- ------------------------------------------------------------
-- 8. setting_price_repair_type_coefficient
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.setting_price_repair_type_coefficient (
  repair_type_id         uuid NOT NULL REFERENCES public.repair_types(id),
  user_id                uuid NOT NULL REFERENCES public.users(id),
  repair_type_coefficient numeric,
  PRIMARY KEY (repair_type_id, user_id)
);

-- ------------------------------------------------------------
-- 9. Fonction ensure_user_profile
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.ensure_user_profile(
  user_id  uuid,
  email    text,
  full_name text,
  role     text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (user_id, email, full_name, role)
  ON CONFLICT (id) DO UPDATE
    SET email     = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        role      = EXCLUDED.role;
END;
$$;

-- ------------------------------------------------------------
-- VERIFICATION — liste les tables créées
-- ------------------------------------------------------------
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'repair_types',
    'quote_details',
    'invoice_details',
    'setting_price_diameter_coefficient',
    'setting_price_impact_count_to_ut',
    'setting_price_body_material_coefficient',
    'setting_price_body_part_coefficient',
    'setting_price_repair_type_coefficient'
  )
ORDER BY table_name;
