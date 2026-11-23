-- Ajout de la colonne percentage_commission sur la table users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS percentage_commission numeric DEFAULT 0;

NOTIFY pgrst, 'reload schema';
