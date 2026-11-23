-- ============================================================
-- Priorité 1 : Table vehicles + immatriculation sur quotes/invoices
-- Exécuter dans : Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Créer la table vehicles
CREATE TABLE IF NOT EXISTS public.vehicles (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         uuid REFERENCES public.users(id) ON DELETE CASCADE,
  garage_id       uuid REFERENCES public.garages(id) ON DELETE CASCADE,
  marque          text,
  annee           int,
  immatriculation text,
  created_at      timestamptz DEFAULT now()
);

-- 2. Ajouter car_immatriculation sur quotes (car_id stockait l'immat par erreur)
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS car_immatriculation text;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS vehicle_id uuid REFERENCES public.vehicles(id);
UPDATE public.quotes SET car_immatriculation = car_id WHERE car_immatriculation IS NULL AND car_id IS NOT NULL;

-- 3. Ajouter car_immatriculation sur invoices
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS car_immatriculation text;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS vehicle_id uuid REFERENCES public.vehicles(id);
UPDATE public.invoices SET car_immatriculation = car_id WHERE car_immatriculation IS NULL AND car_id IS NOT NULL;

-- 4. Permissions
ALTER TABLE public.vehicles DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.vehicles TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 5. Recharger le cache PostgREST
NOTIFY pgrst, 'reload schema';

-- Vérification
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'vehicles';
