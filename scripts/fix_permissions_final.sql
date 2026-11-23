-- Fix complet : désactive RLS + accorde tous les droits aux 3 rôles Supabase

DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'setting_price_diameter_coefficient',
    'setting_price_impact_count_to_ut',
    'setting_price_body_material_coefficient',
    'setting_price_body_part_coefficient',
    'setting_price_repair_type_coefficient',
    'repair_types',
    'quote_details',
    'invoice_details'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY', t);
    EXECUTE format('GRANT ALL PRIVILEGES ON public.%I TO anon', t);
    EXECUTE format('GRANT ALL PRIVILEGES ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL PRIVILEGES ON public.%I TO service_role', t);
  END LOOP;
END;
$$;

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
