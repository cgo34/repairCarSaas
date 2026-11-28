-- ============================================================
-- Migration : hail_monitoring
-- Description : Surveillance grêle par département (France)
--               Données globales mises à jour par cron toutes les heures
-- ============================================================

-- ── Table : département de référence (liste fixe) ──────────────────────────
CREATE TABLE IF NOT EXISTS public.hail_departments (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code         VARCHAR(3)  NOT NULL UNIQUE,  -- ex: '69', '2A', '971'
  name         VARCHAR(100) NOT NULL,
  lat          DECIMAL(8,4) NOT NULL,
  lon          DECIMAL(8,4) NOT NULL,
  country_code VARCHAR(2)  NOT NULL DEFAULT 'FR'
);

-- ── Table : alertes grêle (mise à jour horaire par cron) ───────────────────
CREATE TABLE IF NOT EXISTS public.hail_alerts (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  department_id   UUID NOT NULL REFERENCES public.hail_departments(id) ON DELETE CASCADE,
  risk_level      VARCHAR(10) NOT NULL DEFAULT 'none'
                    CHECK (risk_level IN ('none', 'moderate', 'high', 'active')),
  cape_value      DECIMAL(8,2),
  weather_code    INTEGER,
  vigilance_level VARCHAR(10) DEFAULT 'none'
                    CHECK (vigilance_level IN ('none', 'yellow', 'orange', 'red')),
  last_checked_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT hail_alerts_department_unique UNIQUE (department_id)
);

-- ── Table : villes custom surveillées par organisation ─────────────────────
CREATE TABLE IF NOT EXISTS public.monitored_locations (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  city_name       VARCHAR(100) NOT NULL,
  lat             DECIMAL(8,4) NOT NULL,
  lon             DECIMAL(8,4) NOT NULL,
  country_code    VARCHAR(2)  NOT NULL DEFAULT 'FR',
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ── RLS : données météo globales (lecture publique pour tous les connectés) ─
ALTER TABLE public.hail_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hail_alerts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitored_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read hail departments"
  ON public.hail_departments FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read hail alerts"
  ON public.hail_alerts FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Service role can upsert hail alerts"
  ON public.hail_alerts FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Org members can manage their monitored locations"
  ON public.monitored_locations FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid()
    )
  );

-- ── Index ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_hail_alerts_department_id
  ON public.hail_alerts(department_id);

CREATE INDEX IF NOT EXISTS idx_hail_alerts_risk_level
  ON public.hail_alerts(risk_level);

CREATE INDEX IF NOT EXISTS idx_monitored_locations_org_id
  ON public.monitored_locations(organization_id);

-- ── Seed : 96 départements métropolitains + 5 DOM ─────────────────────────
INSERT INTO public.hail_departments (code, name, lat, lon) VALUES
  ('01',  'Ain',                       46.1100,  5.3600),
  ('02',  'Aisne',                     49.5700,  3.6200),
  ('03',  'Allier',                    46.3500,  3.3100),
  ('04',  'Alpes-de-Haute-Provence',   44.0600,  6.2300),
  ('05',  'Hautes-Alpes',              44.6500,  6.3500),
  ('06',  'Alpes-Maritimes',           43.9200,  7.1900),
  ('07',  'Ardèche',                   44.7500,  4.3500),
  ('08',  'Ardennes',                  49.6900,  4.6700),
  ('09',  'Ariège',                    42.9300,  1.5500),
  ('10',  'Aube',                      48.3000,  4.0700),
  ('11',  'Aude',                      43.1700,  2.3500),
  ('12',  'Aveyron',                   44.2800,  2.5700),
  ('13',  'Bouches-du-Rhône',          43.5500,  5.3600),
  ('14',  'Calvados',                  49.0900, -0.3600),
  ('15',  'Cantal',                    45.0700,  2.6800),
  ('16',  'Charente',                  45.6500,  0.1600),
  ('17',  'Charente-Maritime',         45.7500, -0.6700),
  ('18',  'Cher',                      47.0700,  2.4300),
  ('19',  'Corrèze',                   45.3500,  1.8900),
  ('2A',  'Corse-du-Sud',              41.8600,  9.0100),
  ('2B',  'Haute-Corse',               42.3900,  9.2100),
  ('21',  'Côte-d''Or',                47.4000,  4.7700),
  ('22',  'Côtes-d''Armor',            48.4600, -2.9500),
  ('23',  'Creuse',                    46.0500,  2.0300),
  ('24',  'Dordogne',                  45.1000,  0.7400),
  ('25',  'Doubs',                     47.1200,  6.3800),
  ('26',  'Drôme',                     44.7100,  5.1400),
  ('27',  'Eure',                      49.0700,  1.1800),
  ('28',  'Eure-et-Loir',             48.4400,  1.3700),
  ('29',  'Finistère',                 48.2300, -4.0700),
  ('30',  'Gard',                      43.9500,  4.1600),
  ('31',  'Haute-Garonne',             43.3700,  1.2500),
  ('32',  'Gers',                      43.6500,  0.5900),
  ('33',  'Gironde',                   44.8400, -0.5800),
  ('34',  'Hérault',                   43.5900,  3.2500),
  ('35',  'Ille-et-Vilaine',           48.1400, -1.5900),
  ('36',  'Indre',                     46.6800,  1.5100),
  ('37',  'Indre-et-Loire',            47.3000,  0.6800),
  ('38',  'Isère',                     45.1900,  5.7100),
  ('39',  'Jura',                      46.6700,  5.5600),
  ('40',  'Landes',                    43.9400, -0.7500),
  ('41',  'Loir-et-Cher',              47.5900,  1.3400),
  ('42',  'Loire',                     45.7200,  4.0200),
  ('43',  'Haute-Loire',               45.0800,  3.8800),
  ('44',  'Loire-Atlantique',          47.3500, -1.5500),
  ('45',  'Loiret',                    47.9000,  2.1600),
  ('46',  'Lot',                       44.6200,  1.6800),
  ('47',  'Lot-et-Garonne',            44.3500,  0.4600),
  ('48',  'Lozère',                    44.5100,  3.5000),
  ('49',  'Maine-et-Loire',            47.4600, -0.5500),
  ('50',  'Manche',                    49.1200, -1.3100),
  ('51',  'Marne',                     49.0500,  4.3700),
  ('52',  'Haute-Marne',               48.1100,  5.3100),
  ('53',  'Mayenne',                   48.1500, -0.6100),
  ('54',  'Meurthe-et-Moselle',        48.6800,  6.1800),
  ('55',  'Meuse',                     49.1600,  5.3700),
  ('56',  'Morbihan',                  47.8600, -2.8100),
  ('57',  'Moselle',                   49.1200,  6.7100),
  ('58',  'Nièvre',                    47.1100,  3.5000),
  ('59',  'Nord',                      50.4600,  3.0800),
  ('60',  'Oise',                      49.4200,  2.3900),
  ('61',  'Orne',                      48.5500,  0.0800),
  ('62',  'Pas-de-Calais',             50.5200,  2.1400),
  ('63',  'Puy-de-Dôme',               45.7200,  3.1800),
  ('64',  'Pyrénées-Atlantiques',      43.2800, -0.5600),
  ('65',  'Hautes-Pyrénées',           43.1100,  0.1700),
  ('66',  'Pyrénées-Orientales',       42.6500,  2.4700),
  ('67',  'Bas-Rhin',                  48.5400,  7.5600),
  ('68',  'Haut-Rhin',                 47.9800,  7.3400),
  ('69',  'Rhône',                     45.7400,  4.6200),
  ('70',  'Haute-Saône',               47.6300,  6.0900),
  ('71',  'Saône-et-Loire',            46.6500,  4.7000),
  ('72',  'Sarthe',                    48.0000,  0.1900),
  ('73',  'Savoie',                    45.4700,  6.4300),
  ('74',  'Haute-Savoie',              45.9200,  6.4700),
  ('75',  'Paris',                     48.8600,  2.3500),
  ('76',  'Seine-Maritime',            49.6900,  0.9000),
  ('77',  'Seine-et-Marne',            48.6300,  2.9900),
  ('78',  'Yvelines',                  48.7800,  1.7500),
  ('79',  'Deux-Sèvres',               46.5500, -0.3300),
  ('80',  'Somme',                     49.9200,  2.3200),
  ('81',  'Tarn',                      43.7100,  2.1400),
  ('82',  'Tarn-et-Garonne',           44.0800,  1.3100),
  ('83',  'Var',                       43.4500,  6.2200),
  ('84',  'Vaucluse',                  44.0500,  5.1600),
  ('85',  'Vendée',                    46.6700, -1.4100),
  ('86',  'Vienne',                    46.5800,  0.3400),
  ('87',  'Haute-Vienne',              45.8500,  1.3100),
  ('88',  'Vosges',                    48.1700,  6.4900),
  ('89',  'Yonne',                     47.8000,  3.5700),
  ('90',  'Territoire de Belfort',     47.6400,  6.8600),
  ('91',  'Essonne',                   48.5300,  2.2500),
  ('92',  'Hauts-de-Seine',            48.8400,  2.1900),
  ('93',  'Seine-Saint-Denis',         48.9300,  2.4700),
  ('94',  'Val-de-Marne',              48.7800,  2.4700),
  ('95',  'Val-d''Oise',               49.0800,  2.1100),
  ('971', 'Guadeloupe',                16.2700, -61.5500),
  ('972', 'Martinique',                14.6400, -61.0200),
  ('973', 'Guyane',                     3.9300, -53.1300),
  ('974', 'La Réunion',               -21.1100,  55.5300),
  ('976', 'Mayotte',                  -12.8200,  45.1500)
ON CONFLICT (code) DO NOTHING;

-- ── Seed : initialiser hail_alerts à 'none' pour chaque département ────────
INSERT INTO public.hail_alerts (department_id, risk_level, vigilance_level)
SELECT id, 'none', 'none'
FROM public.hail_departments
ON CONFLICT (department_id) DO NOTHING;
