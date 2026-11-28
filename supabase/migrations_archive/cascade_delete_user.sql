-- Ajouter ON DELETE CASCADE sur toutes les FK qui bloquent la suppression d'un utilisateur

-- organization_members → auth.users
ALTER TABLE public.organization_members
  DROP CONSTRAINT IF EXISTS organization_members_user_id_fkey,
  ADD CONSTRAINT organization_members_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- organizations → auth.users (owner)
ALTER TABLE public.organizations
  DROP CONSTRAINT IF EXISTS organizations_owner_user_id_fkey,
  ADD CONSTRAINT organizations_owner_user_id_fkey
    FOREIGN KEY (owner_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- public.users → auth.users
ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_id_fkey,
  ADD CONSTRAINT users_id_fkey
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
