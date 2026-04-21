-- Autoriser tous les utilisateurs authentifiés à lire les paramètres de prix par défaut
-- (settings appartenant au compte admin de référence DEFAULT_SETTINGS_USER_ID)

DO $$
DECLARE
  default_user_id uuid := '3cece8bf-c899-43d7-8fb7-6c28d92288a3';
BEGIN

  -- setting_price_general
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'setting_price_general' AND policyname = 'read_default_settings'
  ) THEN
    EXECUTE format(
      'CREATE POLICY read_default_settings ON public.setting_price_general
       FOR SELECT TO authenticated
       USING (user_id = %L OR user_id = auth.uid())',
      default_user_id
    );
  END IF;

  -- setting_price_technicity_coefficient
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'setting_price_technicity_coefficient' AND policyname = 'read_default_settings'
  ) THEN
    EXECUTE format(
      'CREATE POLICY read_default_settings ON public.setting_price_technicity_coefficient
       FOR SELECT TO authenticated
       USING (user_id = %L OR user_id = auth.uid())',
      default_user_id
    );
  END IF;

  -- setting_price_body_part_coefficient
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'setting_price_body_part_coefficient' AND policyname = 'read_default_settings'
  ) THEN
    EXECUTE format(
      'CREATE POLICY read_default_settings ON public.setting_price_body_part_coefficient
       FOR SELECT TO authenticated
       USING (user_id = %L OR user_id = auth.uid())',
      default_user_id
    );
  END IF;

  -- setting_price_impact_count_to_ut
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'setting_price_impact_count_to_ut' AND policyname = 'read_default_settings'
  ) THEN
    EXECUTE format(
      'CREATE POLICY read_default_settings ON public.setting_price_impact_count_to_ut
       FOR SELECT TO authenticated
       USING (user_id = %L OR user_id = auth.uid())',
      default_user_id
    );
  END IF;

END $$;
