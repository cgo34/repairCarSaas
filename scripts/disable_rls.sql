-- Désactive RLS sur toutes les tables de settings (dev uniquement)
ALTER TABLE public.setting_price_diameter_coefficient    DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.setting_price_impact_count_to_ut      DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.setting_price_body_material_coefficient DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.setting_price_body_part_coefficient   DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.setting_price_repair_type_coefficient DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_types                          DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_details                         DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_details                       DISABLE ROW LEVEL SECURITY;
