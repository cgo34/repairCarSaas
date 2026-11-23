-- ============================================================
-- Migration : technician_garage_access
-- Description : Table de liaison technicien <-> garage
--               Permet d'assigner des garages spécifiques
--               à un technicien
-- ============================================================

CREATE TABLE IF NOT EXISTS public.technician_garage_access (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  garage_id  UUID NOT NULL REFERENCES public.garages(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT technician_garage_access_unique UNIQUE (user_id, garage_id)
);

-- ── RLS ────────────────────────────────────────────────────────────────────
ALTER TABLE public.technician_garage_access ENABLE ROW LEVEL SECURITY;

-- Admin : accès complet
CREATE POLICY "Admins can manage technician garage access"
  ON public.technician_garage_access
  FOR ALL
  USING     ((auth.jwt() ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

-- Technicien : lecture de ses propres accès
CREATE POLICY "Technicians can view own garage access"
  ON public.technician_garage_access
  FOR SELECT
  USING (auth.uid() = user_id);

-- ── Index ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_technician_garage_access_user_id
  ON public.technician_garage_access(user_id);

CREATE INDEX IF NOT EXISTS idx_technician_garage_access_garage_id
  ON public.technician_garage_access(garage_id);
