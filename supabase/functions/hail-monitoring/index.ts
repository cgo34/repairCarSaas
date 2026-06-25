import { serve } from 'https://deno.land/std/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Codes WMO correspondant à de la grêle ou risque élevé
const HAIL_CODES = [96, 99];           // orage avec grêle
const STORM_CODES = [95, 96, 99];      // orage (tous types)
const SHOWER_CODES = [80, 81, 82];     // averses

function getRiskLevel(weatherCode: number, maxCape: number): 'none' | 'moderate' | 'high' | 'active' {
  if (HAIL_CODES.includes(weatherCode)) return 'active';
  if (weatherCode === 95 && maxCape > 800) return 'high';
  if (STORM_CODES.includes(weatherCode) || maxCape > 1500) return 'high';
  if (SHOWER_CODES.includes(weatherCode) || maxCape > 500) return 'moderate';
  return 'none';
}

function getCurrentHourIndex(times: string[]): number {
  const now = new Date();
  const nowHour = now.toISOString().slice(0, 13); // "2025-06-25T14"
  const idx = times.findIndex(t => t.startsWith(nowHour));
  return idx >= 0 ? idx : 0;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // 1. Récupère tous les départements
    const { data: departments, error: deptError } = await supabase
      .from('hail_departments')
      .select('id, code, name, lat, lon');

    if (deptError || !departments) {
      throw new Error(`Failed to fetch departments: ${deptError?.message}`);
    }

    console.log(`Processing ${departments.length} departments...`);

    // 2. Traitement par batches de 10 pour respecter l'API Open-Meteo
    const BATCH_SIZE = 10;
    const results: { department_id: string; risk_level: string; cape_value: number; weather_code: number; vigilance_level: string }[] = [];

    for (let i = 0; i < departments.length; i += BATCH_SIZE) {
      const batch = departments.slice(i, i + BATCH_SIZE);

      await Promise.all(batch.map(async (dept) => {
        try {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${dept.lat}&longitude=${dept.lon}&hourly=cape,weathercode&current_weather=true&forecast_days=1&timezone=Europe%2FParis`;
          const response = await fetch(url);

          if (!response.ok) {
            console.warn(`Open-Meteo error for dept ${dept.code}: ${response.status}`);
            return;
          }

          const data = await response.json();

          const hourlyTimes: string[] = data.hourly?.time ?? [];
          const hourlyWeatherCodes: number[] = data.hourly?.weathercode ?? [];
          const hourlyCape: number[] = data.hourly?.cape ?? [];

          const currentIdx = getCurrentHourIndex(hourlyTimes);

          // Code météo courant (fallback sur current_weather)
          const weatherCode: number = hourlyWeatherCodes[currentIdx] ?? data.current_weather?.weathercode ?? 0;

          // CAPE max sur les 3 prochaines heures
          const capeSlice = hourlyCape.slice(currentIdx, currentIdx + 3).filter(v => v != null);
          const maxCape: number = capeSlice.length > 0 ? Math.max(...capeSlice) : 0;

          const riskLevel = getRiskLevel(weatherCode, maxCape);

          results.push({
            department_id: dept.id,
            risk_level: riskLevel,
            cape_value: maxCape,
            weather_code: weatherCode,
            vigilance_level: 'none', // Météo-France vigilances = future enhancement
          });
        } catch (err) {
          console.warn(`Error processing dept ${dept.code}:`, err);
        }
      }));

      // Petite pause entre les batches pour éviter le rate limiting
      if (i + BATCH_SIZE < departments.length) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    // 3. Upsert dans hail_alerts
    if (results.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'No results to upsert' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const upsertData = results.map(r => ({
      ...r,
      last_checked_at: new Date().toISOString(),
    }));

    const { error: upsertError } = await supabase
      .from('hail_alerts')
      .upsert(upsertData, { onConflict: 'department_id' });

    if (upsertError) {
      throw new Error(`Upsert failed: ${upsertError.message}`);
    }

    const activeCount = results.filter(r => r.risk_level === 'active').length;
    const highCount   = results.filter(r => r.risk_level === 'high').length;
    const modCount    = results.filter(r => r.risk_level === 'moderate').length;

    console.log(`Done. active=${activeCount} high=${highCount} moderate=${modCount}`);

    return new Response(
      JSON.stringify({
        success: true,
        processed: results.length,
        active: activeCount,
        high: highCount,
        moderate: modCount,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('hail-monitoring error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})
