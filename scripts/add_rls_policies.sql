-- ============================================================
-- Politiques RLS pour les tables nouvellement créées
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- ============================================================

-- ------------------------------------------------------------
-- repair_types — lecture publique (référentiel)
-- ------------------------------------------------------------
CREATE POLICY "Authenticated users can read repair_types"
  ON public.repair_types FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert repair_types"
  ON public.repair_types FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update repair_types"
  ON public.repair_types FOR UPDATE
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete repair_types"
  ON public.repair_types FOR DELETE
  TO authenticated USING (true);

-- ------------------------------------------------------------
-- quote_details — accès par propriétaire
-- ------------------------------------------------------------
CREATE POLICY "All operations on quote_details for authenticated"
  ON public.quote_details FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- ------------------------------------------------------------
-- invoice_details — accès par propriétaire
-- ------------------------------------------------------------
CREATE POLICY "All operations on invoice_details for authenticated"
  ON public.invoice_details FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- ------------------------------------------------------------
-- setting_price_diameter_coefficient
-- ------------------------------------------------------------
CREATE POLICY "All operations on diameter_coefficient for authenticated"
  ON public.setting_price_diameter_coefficient FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- ------------------------------------------------------------
-- setting_price_impact_count_to_ut
-- ------------------------------------------------------------
CREATE POLICY "All operations on impact_count_to_ut for authenticated"
  ON public.setting_price_impact_count_to_ut FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- ------------------------------------------------------------
-- setting_price_body_material_coefficient
-- ------------------------------------------------------------
CREATE POLICY "All operations on body_material_coefficient for authenticated"
  ON public.setting_price_body_material_coefficient FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- ------------------------------------------------------------
-- setting_price_body_part_coefficient
-- ------------------------------------------------------------
CREATE POLICY "All operations on body_part_coefficient for authenticated"
  ON public.setting_price_body_part_coefficient FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- ------------------------------------------------------------
-- setting_price_repair_type_coefficient
-- ------------------------------------------------------------
CREATE POLICY "All operations on repair_type_coefficient for authenticated"
  ON public.setting_price_repair_type_coefficient FOR ALL
  TO authenticated USING (true) WITH CHECK (true);
