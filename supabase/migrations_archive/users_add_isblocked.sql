-- ============================================================
-- Migration : users_add_isblocked
-- Description : Ajout de la colonne is_blocked sur public.users
--               Permet de bloquer l'accès d'un technicien
-- ============================================================

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false NOT NULL;
