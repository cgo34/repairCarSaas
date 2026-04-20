-- ============================================================
-- FIX COMPLET PERMISSIONS — RepairCarSaaS
-- Exécuter dans : Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Désactiver RLS (Row Level Security) sur toutes les tables concernées
ALTER TABLE public.setting_price_diameter_coefficient    DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.setting_price_impact_count_to_ut      DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.setting_price_body_material_coefficient DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.setting_price_body_part_coefficient   DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.setting_price_repair_type_coefficient DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_types                          DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_details                         DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_details                       DISABLE ROW LEVEL SECURITY;

-- 2. Accès au schéma public
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;

-- 3. Droits complets sur chaque table pour les 3 rôles
GRANT ALL ON public.setting_price_diameter_coefficient    TO anon, authenticated, service_role;
GRANT ALL ON public.setting_price_impact_count_to_ut      TO anon, authenticated, service_role;
GRANT ALL ON public.setting_price_body_material_coefficient TO anon, authenticated, service_role;
GRANT ALL ON public.setting_price_body_part_coefficient   TO anon, authenticated, service_role;
GRANT ALL ON public.setting_price_repair_type_coefficient TO anon, authenticated, service_role;
GRANT ALL ON public.repair_types                          TO anon, authenticated, service_role;
GRANT ALL ON public.quote_details                         TO anon, authenticated, service_role;
GRANT ALL ON public.invoice_details                       TO anon, authenticated, service_role;

-- 4. Droits sur les séquences (pour les colonnes SERIAL/auto-increment)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- 5. Forcer PostgREST à recharger son cache de schéma
NOTIFY pgrst, 'reload schema';

-- ============================================================
-- VERIFICATION — résultat attendu : rowsecurity = false pour chaque table
-- ============================================================
SELECT
  tablename,
  rowsecurity AS rls_active
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'setting_price_diameter_coefficient',
    'setting_price_impact_count_to_ut',
    'setting_price_body_material_coefficient',
    'setting_price_body_part_coefficient',
    'setting_price_repair_type_coefficient',
    'repair_types',
    'quote_details',
    'invoice_details'
  )
ORDER BY tablename;
