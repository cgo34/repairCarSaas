<template>
  <MainLayout>
    <v-container fluid class="pa-0">

      <!-- HEADER -->
      <div class="d-flex align-start justify-space-between mb-5">
        <div>
          <h1 class="text-h5 font-weight-bold mb-0" style="font-family:'Space Grotesk',sans-serif">
            Surveillance grêle
          </h1>
          <p class="text-body-2 text-medium-emphasis mb-0">
            France · {{ alerts.length }} département{{ alerts.length > 1 ? 's' : '' }} surveillé{{ alerts.length > 1 ? 's' : '' }}
            <span v-if="lastChecked" class="ml-1">· mis à jour {{ lastChecked }}</span>
          </p>
        </div>
        <v-btn
          variant="outlined"
          prepend-icon="mdi-refresh"
          :loading="loading"
          @click="fetchAlerts"
        >
          Actualiser
        </v-btn>
      </div>

      <!-- KPI CARDS -->
      <v-row dense class="mb-5">
        <v-col cols="6" sm="3">
          <v-card flat border class="pa-4">
            <p class="text-caption text-medium-emphasis mb-1">Alertes actives</p>
            <div class="text-h5 font-weight-bold mb-1" :class="countActive > 0 ? 'text-error' : ''" style="font-family:'Space Grotesk',sans-serif">
              {{ countActive }}
            </div>
            <v-chip size="x-small" :color="countActive > 0 ? 'error' : 'default'" variant="tonal">
              grêle confirmée
            </v-chip>
          </v-card>
        </v-col>
        <v-col cols="6" sm="3">
          <v-card flat border class="pa-4">
            <p class="text-caption text-medium-emphasis mb-1">Risque élevé</p>
            <div class="text-h5 font-weight-bold mb-1" :class="countHigh > 0 ? 'text-warning' : ''" style="font-family:'Space Grotesk',sans-serif">
              {{ countHigh }}
            </div>
            <v-chip size="x-small" :color="countHigh > 0 ? 'warning' : 'default'" variant="tonal">
              orages intenses
            </v-chip>
          </v-card>
        </v-col>
        <v-col cols="6" sm="3">
          <v-card flat border class="pa-4">
            <p class="text-caption text-medium-emphasis mb-1">Risque modéré</p>
            <div class="text-h5 font-weight-bold mb-1" style="font-family:'Space Grotesk',sans-serif">
              {{ countModerate }}
            </div>
            <v-chip size="x-small" color="default" variant="tonal">
              averses/orages
            </v-chip>
          </v-card>
        </v-col>
        <v-col cols="6" sm="3">
          <v-card flat border class="pa-4">
            <p class="text-caption text-medium-emphasis mb-1">Sans risque</p>
            <div class="text-h5 font-weight-bold mb-1 text-success" style="font-family:'Space Grotesk',sans-serif">
              {{ countNone }}
            </div>
            <v-chip size="x-small" color="success" variant="tonal">
              temps calme
            </v-chip>
          </v-card>
        </v-col>
      </v-row>

      <!-- FILTRES -->
      <v-card flat border class="mb-5">
        <v-tabs v-model="activeTab" color="primary" density="compact">
          <v-tab value="all">Tous ({{ alerts.length }})</v-tab>
          <v-tab value="alert">
            <v-badge
              v-if="countActive > 0"
              :content="countActive"
              color="error"
              inline
              class="mr-1"
            />
            Alertes actives
          </v-tab>
          <v-tab value="risk">Risque élevé ({{ countHigh }})</v-tab>
          <v-tab value="none">Sans risque</v-tab>
        </v-tabs>

        <v-divider />

        <!-- SEARCH -->
        <div class="pa-3">
          <v-text-field
            v-model="search"
            density="compact"
            variant="outlined"
            placeholder="Rechercher un département..."
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
            class="max-w-400"
          />
        </div>

        <!-- TABLE -->
        <v-table density="compact" hover>
          <thead>
            <tr>
              <th class="text-left" style="width:80px">Code</th>
              <th class="text-left">Département</th>
              <th class="text-left">Niveau de risque</th>
              <th class="text-left" style="width:120px">CAPE (J/kg)</th>
              <th class="text-left">Dernière vérification</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="5" class="text-center pa-6">
                <v-progress-circular indeterminate color="primary" size="32" />
              </td>
            </tr>
            <tr v-else-if="filteredAlerts.length === 0">
              <td colspan="5" class="text-center text-medium-emphasis pa-6">
                Aucun département trouvé
              </td>
            </tr>
            <tr v-for="alert in filteredAlerts" :key="alert.id">
              <td>
                <span class="font-weight-medium text-body-2">{{ alert.departmentCode }}</span>
              </td>
              <td>
                <span class="text-body-2">{{ alert.departmentName }}</span>
              </td>
              <td>
                <div class="d-flex align-center gap-2">
                  <span
                    v-if="alert.riskLevel === 'active'"
                    class="blink-dot blink-dot--red"
                  />
                  <span
                    v-else-if="alert.riskLevel === 'high'"
                    class="blink-dot blink-dot--orange"
                  />
                  <v-chip
                    size="x-small"
                    :color="riskColor(alert.riskLevel)"
                    variant="tonal"
                  >
                    {{ riskLabel(alert.riskLevel) }}
                  </v-chip>
                </div>
              </td>
              <td>
                <span class="text-body-2 text-medium-emphasis">
                  {{ alert.capeValue != null ? Math.round(alert.capeValue) : '—' }}
                </span>
              </td>
              <td>
                <span class="text-caption text-medium-emphasis">
                  {{ formatDate(alert.lastCheckedAt) }}
                </span>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>

    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';
import { useHailMonitoringState } from '../composables/useHailMonitoringState';
import type { HailRiskLevel } from '@/@application/dtos/hail/HailAlertDto';

const { alerts, loading, fetchAlerts } = useHailMonitoringState();

const activeTab = ref('all');
const search = ref('');

const countActive   = computed(() => alerts.value.filter(a => a.riskLevel === 'active').length);
const countHigh     = computed(() => alerts.value.filter(a => a.riskLevel === 'high').length);
const countModerate = computed(() => alerts.value.filter(a => a.riskLevel === 'moderate').length);
const countNone     = computed(() => alerts.value.filter(a => a.riskLevel === 'none').length);

const lastChecked = computed(() => {
  const latest = alerts.value.find(a => a.lastCheckedAt);
  if (!latest) return null;
  return formatDate(latest.lastCheckedAt);
});

const filteredAlerts = computed(() => {
  let result = alerts.value;

  if (activeTab.value === 'alert')  result = result.filter(a => a.riskLevel === 'active');
  if (activeTab.value === 'risk')   result = result.filter(a => a.riskLevel === 'high');
  if (activeTab.value === 'none')   result = result.filter(a => a.riskLevel === 'none');

  if (search.value) {
    const q = search.value.toLowerCase();
    result = result.filter(a =>
      a.departmentName.toLowerCase().includes(q) ||
      a.departmentCode.toLowerCase().includes(q)
    );
  }

  // Trier : actif > élevé > modéré > rien
  const order: Record<string, number> = { active: 0, high: 1, moderate: 2, none: 3 };
  return [...result].sort((a, b) => order[a.riskLevel] - order[b.riskLevel]);
});

function riskColor(level: HailRiskLevel): string {
  switch (level) {
    case 'active':   return 'error';
    case 'high':     return 'warning';
    case 'moderate': return 'info';
    default:         return 'success';
  }
}

function riskLabel(level: HailRiskLevel): string {
  switch (level) {
    case 'active':   return '⚡ Grêle active';
    case 'high':     return '🔴 Risque élevé';
    case 'moderate': return '🟡 Risque modéré';
    default:         return '🟢 Aucun risque';
  }
}

function formatDate(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

onMounted(fetchAlerts);
</script>

<style scoped>
.max-w-400 {
  max-width: 400px;
}

/* Point clignotant rouge (grêle active) */
.blink-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.blink-dot--red {
  background-color: rgb(var(--v-theme-error));
  animation: blink-pulse 1s infinite;
}

.blink-dot--orange {
  background-color: rgb(var(--v-theme-warning));
  animation: blink-pulse 1.5s infinite;
}

@keyframes blink-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.3; transform: scale(0.7); }
}
</style>
