-- ============================================================
-- pg_cron : déclenchement horaire de l'Edge Function hail-monitoring
-- À exécuter dans Supabase SQL Editor (extensions pg_cron requise)
-- ============================================================

-- Activer l'extension pg_cron si pas encore fait
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Supprimer le job si il existe déjà (pour éviter les doublons)
SELECT cron.unschedule('hail-monitoring-hourly')
WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'hail-monitoring-hourly'
);

-- Créer le job : toutes les heures à H+05 (laisser le temps aux données météo d'être à jour)
SELECT cron.schedule(
  'hail-monitoring-hourly',
  '5 * * * *',
  $$
    SELECT net.http_post(
      url    := current_setting('app.supabase_url') || '/functions/v1/hail-monitoring',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.service_role_key') || '"}'::jsonb,
      body   := '{}'::jsonb
    )
  $$
);

-- Vérifier que le job a bien été créé
SELECT jobname, schedule, command FROM cron.job WHERE jobname = 'hail-monitoring-hourly';
