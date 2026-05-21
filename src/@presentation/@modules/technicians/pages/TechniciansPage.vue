<template>
  <MainLayout>
    <v-container fluid class="pa-4">

      <!-- Header -->
      <div class="d-flex align-center gap-3 mb-6">
        <div>
          <h1 class="text-h5 font-weight-bold mb-1">Techniciens</h1>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Gestion et statistiques des techniciens
          </p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="state.loading.value" class="d-flex justify-center align-center" style="height: 300px;">
        <v-progress-circular indeterminate color="primary" />
      </div>

      <!-- Table -->
      <v-card v-else variant="outlined">
        <v-data-table
          :headers="headers"
          :items="state.technicians.value"
          :items-per-page="10"
          hover
          class="text-subtitle-2"
        >
          <!-- Nom -->
          <template #item.fullName="{ item }">
            <div class="d-flex align-center gap-2 py-2">
              <v-avatar color="primary" size="34">
                <span class="text-caption font-weight-bold text-white">
                  {{ initials(item.fullName) }}
                </span>
              </v-avatar>
              <div>
                <div class="text-body-2 font-weight-medium">{{ item.fullName }}</div>
                <div class="text-caption text-medium-emphasis">{{ item.email }}</div>
              </div>
            </div>
          </template>

          <!-- Rôle -->
          <template #item.role="{ item }">
            <v-chip size="x-small" :color="item.role === 'independant_technician' ? 'orange' : 'green'" variant="tonal">
              {{ item.role === 'independant_technician' ? 'Indépendant' : 'Technicien' }}
            </v-chip>
          </template>

          <!-- Devis en cours -->
          <template #item.quotesInProgress="{ item }">
            <span class="text-body-2">{{ getStats(item.id)?.quotesInProgress ?? '—' }}</span>
          </template>

          <!-- Factures -->
          <template #item.invoicesCount="{ item }">
            <span class="text-body-2">{{ getStats(item.id)?.invoicesCount ?? '—' }}</span>
          </template>

          <!-- Commission -->
          <template #item.commissionDue="{ item }">
            <span class="text-body-2 font-weight-medium">
              {{ formatCurrency(getStats(item.id)?.commissionDue) }}
            </span>
          </template>

          <!-- Statut -->
          <template #item.isBlocked="{ item }">
            <v-chip
              size="x-small"
              :color="item.isBlocked ? 'error' : 'success'"
              variant="tonal"
            >
              {{ item.isBlocked ? 'Bloqué' : 'Actif' }}
            </v-chip>
          </template>

          <!-- Actions -->
          <template #item.actions="{ item }">
            <div class="d-flex gap-1">
              <v-btn
                icon
                size="small"
                variant="text"
                :to="`/technicians/${item.id}`"
              >
                <v-icon size="18">mdi-eye</v-icon>
                <v-tooltip activator="parent">Voir le détail</v-tooltip>
              </v-btn>
              <v-btn
                icon
                size="small"
                variant="text"
                :color="item.isBlocked ? 'success' : 'error'"
                @click="toggleBlock(item)"
              >
                <v-icon size="18">{{ item.isBlocked ? 'mdi-lock-open' : 'mdi-lock' }}</v-icon>
                <v-tooltip activator="parent">
                  {{ item.isBlocked ? 'Débloquer' : 'Bloquer' }}
                </v-tooltip>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card>

    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';
import { IUseTechniciansState } from '@/@presentation/types/composables/IUseTechniciansState';
import { UserViewModel } from '@/@presentation/types/models/UserViewModel';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';

const state = container.get<IUseTechniciansState>(SYMBOLS.States.TechniciansState);

const headers = [
  { title: 'Nom', key: 'fullName', sortable: true },
  { title: 'Rôle', key: 'role', sortable: false },
  { title: 'Devis en cours', key: 'quotesInProgress', sortable: false },
  { title: 'Factures', key: 'invoicesCount', sortable: false },
  { title: 'Commission due', key: 'commissionDue', sortable: false },
  { title: 'Statut', key: 'isBlocked', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
];

function initials(name: string) {
  return name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() ?? '?';
}

function getStats(id: string): { quotesInProgress: number; invoicesCount: number; commissionDue: number } | undefined {
  const s = state.stats.value;
  return s ? s[id] : undefined;
}

function formatCurrency(val?: number) {
  if (val === undefined || val === null) return '—';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val);
}

async function toggleBlock(technician: UserViewModel) {
  if (technician.isBlocked) {
    await state.unblockTechnician(technician.id);
  } else {
    await state.blockTechnician(technician.id);
  }
}

onMounted(() => state.init());
</script>
