-- ============================================================
-- GRANT accès aux tables pour les rôles Supabase
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- ============================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT ALL ON public.repair_types                          TO authenticated;
GRANT ALL ON public.quote_details                         TO authenticated;
GRANT ALL ON public.invoice_details                       TO authenticated;
GRANT ALL ON public.setting_price_diameter_coefficient    TO authenticated;
GRANT ALL ON public.setting_price_impact_count_to_ut      TO authenticated;
GRANT ALL ON public.setting_price_body_material_coefficient TO authenticated;
GRANT ALL ON public.setting_price_body_part_coefficient   TO authenticated;
GRANT ALL ON public.setting_price_repair_type_coefficient TO authenticated;

-- Lecture seule pour anon (référentiels)
GRANT SELECT ON public.repair_types    TO anon;
GRANT SELECT ON public.body_parts      TO anon;
GRANT SELECT ON public.body_materials  TO anon;
