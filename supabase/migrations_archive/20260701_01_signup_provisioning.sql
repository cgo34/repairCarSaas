-- Phase 1 + 2 : trigger de profil + provisionnement atomique d'une organisation.
-- Idempotent. A appliquer manuellement sur la base distante (SQL Editor).

-- ---------------------------------------------------------------------------
-- 1. handle_new_user : contrat de metadonnees first_name / last_name / fullName
--    Le trigger ne cree QUE le profil metier (pas d'organisation, pas d'abonnement).
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_first text := NULLIF(btrim(COALESCE(NEW.raw_user_meta_data ->> 'first_name', '')), '');
  v_last  text := NULLIF(btrim(COALESCE(NEW.raw_user_meta_data ->> 'last_name', '')), '');
  v_full  text := NULLIF(btrim(COALESCE(NEW.raw_user_meta_data ->> 'fullName', '')), '');
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    v_first,
    v_last,
    COALESCE(v_full, NULLIF(btrim(COALESCE(v_first, '') || ' ' || COALESCE(v_last, '')), ''), '')
  );

  RETURN NEW;
END;
$function$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. provision_organization : organisation + membre admin + plan Free, atomique.
--    L'identite vient de auth.uid() ; aucun id / role / plan n'est accepte du client.
--    Idempotent : si l'utilisateur possede deja une organisation, elle est retournee.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.provision_organization(p_name text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_uid     uuid := auth.uid();
  v_org_id  uuid;
  v_plan_id uuid;
  v_name    text := NULLIF(btrim(COALESCE(p_name, '')), '');
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated' USING ERRCODE = '28000';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = v_uid) THEN
    RAISE EXCEPTION 'User profile not found' USING ERRCODE = 'P0002';
  END IF;

  -- Reprise : organisation deja provisionnee
  SELECT id INTO v_org_id
  FROM public.organizations
  WHERE owner_user_id = v_uid
  ORDER BY created_at
  LIMIT 1;

  IF v_org_id IS NULL THEN
    INSERT INTO public.organizations (name, owner_user_id, created_at, updated_at)
    VALUES (COALESCE(v_name, 'Mon espace'), v_uid, now(), now())
    RETURNING id INTO v_org_id;
  END IF;

  INSERT INTO public.organization_members (user_id, organization_id, role, status)
  SELECT v_uid, v_org_id, 'admin', 'active'
  WHERE NOT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE user_id = v_uid AND organization_id = v_org_id
  );

  IF NOT EXISTS (SELECT 1 FROM public.subscriptions WHERE organization_id = v_org_id) THEN
    SELECT id INTO v_plan_id FROM public.subscription_plans WHERE code = 'FREE' LIMIT 1;
    IF v_plan_id IS NULL THEN
      RAISE EXCEPTION 'FREE plan not found' USING ERRCODE = 'P0002';
    END IF;

    -- source laisse a sa valeur par defaut, comme le code applicatif precedent
    INSERT INTO public.subscriptions (organization_id, plan_id, status, start_date)
    VALUES (v_org_id, v_plan_id, 'active', now());
  END IF;

  RETURN v_org_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.provision_organization(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.provision_organization(text) TO authenticated;
