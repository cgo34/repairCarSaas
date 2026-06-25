<template>
  <v-card flat border class="hail-widget" :class="{ 'hail-widget--alert': hasActiveAlerts }">
    <div class="pa-4">

      <!-- Header -->
      <div class="d-flex align-center justify-space-between mb-4">
        <div class="d-flex align-center gap-2">
          <div class="hail-icon-wrapper" :class="{ 'hail-icon-wrapper--pulse': hasActiveAlerts }">
            <v-icon color="warning" size="18">mdi-weather-hail</v-icon>
          </div>
          <span class="text-body-2 font-weight-semibold">Surveillance grêle</span>
          <div v-if="!loading" class="en-direct-badge ml-1">
            <span class="blink-dot blink-dot--green" />
            <span class="text-caption font-weight-medium">EN DIRECT</span>
          </div>
        </div>
        <v-btn variant="text" size="x-small" color="primary" to="/weather" append-icon="mdi-arrow-right">
          Voir tout
        </v-btn>
      </div>

      <!-- Chargement -->
      <div v-if="loading" class="d-flex align-center gap-3 py-4">
        <v-progress-circular indeterminate size="20" width="2" color="primary" />
        <span class="text-caption text-medium-emphasis">Chargement des données météo…</span>
      </div>

      <template v-else>
        <!-- Deux colonnes -->
        <div class="hail-body">

          <!-- Colonne gauche : compteur + barre -->
          <div class="hail-left">
            <div
              class="text-h2 font-weight-bold mb-1"
              :class="hasActiveAlerts ? 'text-error' : 'text-success'"
              style="font-family:'Space Grotesk',sans-serif; line-height:1"
            >
              {{ activeAlerts.length }}
            </div>
            <div class="text-body-2 text-medium-emphasis mb-3">
              département{{ activeAlerts.length > 1 ? 's' : '' }} en alerte
            </div>

            <!-- Barre de répartition -->
            <div class="bar-track mb-1">
              <div v-if="countActive > 0"   class="bar-seg bar-seg--red"    :style="{ flex: countActive }" />
              <div v-if="countHigh > 0"     class="bar-seg bar-seg--orange" :style="{ flex: countHigh }" />
              <div v-if="countModerate > 0" class="bar-seg bar-seg--yellow" :style="{ flex: countModerate }" />
              <div v-if="countNone > 0"     class="bar-seg bar-seg--green"  :style="{ flex: Math.min(countNone, 30) }" />
            </div>
            <div class="d-flex flex-wrap gap-3 text-caption">
              <span v-if="countActive > 0" class="d-flex align-center gap-1">
                <span class="legend-dot legend-dot--red" />
                <span class="text-error font-weight-medium">{{ countActive }} critiques</span>
              </span>
              <span v-if="countHigh > 0" class="d-flex align-center gap-1">
                <span class="legend-dot legend-dot--orange" />
                <span class="text-warning font-weight-medium">{{ countHigh }} élevés</span>
              </span>
              <span v-if="countModerate > 0" class="d-flex align-center gap-1">
                <span class="legend-dot legend-dot--yellow" />
                <span class="text-medium-emphasis">{{ countModerate }} modérés</span>
              </span>
            </div>
          </div>

          <!-- Séparateur vertical -->
          <v-divider vertical class="mx-4" />

          <!-- Colonne droite : zones touchées -->
          <div class="hail-right">
            <div class="mb-2">
              <p class="text-caption font-weight-medium" style="text-transform:uppercase; letter-spacing:.05em; margin:0">
                Zones les plus touchées
              </p>
              <p class="text-caption text-disabled" style="margin:0">dernières 24h</p>
            </div>

            <div v-if="!hasActiveAlerts" class="d-flex align-center gap-2 py-2">
              <v-icon color="success" size="16">mdi-check-circle</v-icon>
              <span class="text-body-2 text-medium-emphasis">Aucune alerte en cours</span>
            </div>

            <div v-else class="zones-grid">
              <div
                v-for="alert in activeAlerts.slice(0, 4)"
                :key="alert.id"
                class="zone-item"
              >
                <div class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center gap-2">
                    <span class="dept-code">{{ alert.departmentCode }}</span>
                    <div>
                      <div class="text-body-2" style="line-height:1.2">{{ alert.departmentName }}</div>
                      <div class="text-caption text-disabled">{{ timeAgo(alert.lastCheckedAt) }}</div>
                    </div>
                  </div>
                  <v-chip size="x-small" :color="riskColor(alert.riskLevel)" variant="tonal" class="ml-2">
                    {{ riskLabel(alert.riskLevel) }}
                  </v-chip>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Footer -->
        <v-divider class="mt-3 mb-2" />
        <div class="text-caption text-disabled d-flex align-center gap-1">
          <v-icon size="12">mdi-clock-outline</v-icon>
          <span>{{ formatCheckedAt ? `Mis à jour ${formatCheckedAt}` : 'Non synchronisé' }}</span>
          <span>·</span>
          <span>source Open-Meteo</span>
          <template v-if="activeAlerts.length > 4">
            <span>·</span>
            <span>+ {{ activeAlerts.length - 4 }} autres départements</span>
          </template>
        </div>
      </template>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useHailMonitoringState } from '@/@presentation/@modules/weather/composables/useHailMonitoringState';
import { timeAgo } from '@/@presentation/utils/timeAgo';
import type { HailRiskLevel } from '@/@application/dtos/hail/HailAlertDto';

const { alerts, activeAlerts, hasActiveAlerts, loading, fetchAlerts } = useHailMonitoringState();

const countActive   = computed(() => alerts.value.filter(a => a.riskLevel === 'active').length);
const countHigh     = computed(() => alerts.value.filter(a => a.riskLevel === 'high').length);
const countModerate = computed(() => alerts.value.filter(a => a.riskLevel === 'moderate').length);
const countNone     = computed(() => alerts.value.filter(a => a.riskLevel === 'none').length);

const formatCheckedAt = computed(() => {
  const latest = alerts.value.find(a => a.lastCheckedAt);
  if (!latest) return null;
  const d = new Date(latest.lastCheckedAt);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month} à ${hours}:${mins}`;
});

function riskColor(level: HailRiskLevel): string {
  const map: Record<HailRiskLevel, string> = { active: 'error', high: 'warning', moderate: 'orange', none: 'success' };
  return map[level];
}

function riskLabel(level: HailRiskLevel): string {
  const map: Record<HailRiskLevel, string> = { active: 'Critique', high: 'Élevé', moderate: 'Modéré', none: 'OK' };
  return map[level];
}

onMounted(fetchAlerts);
</script>

<style scoped>
.hail-widget {
  transition: border-color 0.3s ease;
}
.hail-widget--alert {
  border-color: rgb(var(--v-theme-error)) !important;
}

/* Layout deux colonnes */
.hail-body {
  display: flex;
  align-items: flex-start;
}
.hail-left {
  flex: 0 0 220px;
  min-width: 180px;
}
.hail-right {
  flex: 1;
  min-width: 0;
}

/* Barre de répartition */
.bar-track {
  display: flex;
  height: 8px;
  border-radius: 6px;
  overflow: hidden;
  gap: 2px;
}
.bar-seg { border-radius: 3px; }
.bar-seg--red    { background: rgb(var(--v-theme-error)); }
.bar-seg--orange { background: rgb(var(--v-theme-warning)); }
.bar-seg--yellow { background: #f59e0b; }
.bar-seg--green  { background: rgba(var(--v-theme-success), 0.25); }

/* Zones */
.zones-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 16px;
}
.zone-item {
  padding: 4px 0;
}

/* Icône */
.hail-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: rgba(var(--v-theme-warning), 0.12);
  flex-shrink: 0;
}
.hail-icon-wrapper--pulse {
  animation: icon-pulse 2s ease-in-out infinite;
}
@keyframes icon-pulse {
  0%, 100% { background: rgba(var(--v-theme-warning), 0.10); }
  50%       { background: rgba(var(--v-theme-warning), 0.25); }
}

/* Légende points colorés */
.legend-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.legend-dot--red    { background: rgb(var(--v-theme-error)); }
.legend-dot--orange { background: rgb(var(--v-theme-warning)); }
.legend-dot--yellow { background: #f59e0b; }

/* Badge EN DIRECT */
.en-direct-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 2px 8px;
  border-radius: 20px;
  border: 1px solid rgba(var(--v-theme-success), 0.3);
  background: rgba(var(--v-theme-success), 0.08);
  color: rgb(var(--v-theme-success));
}
.blink-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.blink-dot--green {
  background-color: rgb(var(--v-theme-success));
  animation: blink-pulse 1.5s infinite;
}
@keyframes blink-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.2; }
}

/* Code département */
.dept-code {
  font-size: 0.75rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  min-width: 26px;
}

/* Mobile : passer en une colonne */
@media (max-width: 600px) {
  .hail-body { flex-direction: column; }
  .hail-left { flex: none; width: 100%; margin-bottom: 16px; }
  .zones-grid { grid-template-columns: 1fr; }
}
</style>
