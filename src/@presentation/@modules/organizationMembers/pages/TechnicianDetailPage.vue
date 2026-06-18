<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-4"
      style="max-width: 1100px;"
    >
      <!-- Loading -->
      <div
        v-if="state.loading.value"
        class="d-flex justify-center align-center"
        style="height: 300px;"
      >
        <v-progress-circular
          indeterminate
          color="primary"
        />
      </div>

      <template v-else-if="state.technician.value">
        <!-- Header -->
        <div class="d-flex align-center gap-4 mb-6">
          <v-avatar
            color="primary"
            size="56"
          >
            <span class="text-h6 font-weight-bold text-white">
              {{ initials(state.technician.value.fullName) }}
            </span>
          </v-avatar>
          <div>
            <h1 class="text-h5 font-weight-bold mb-0">
              {{ state.technician.value.fullName }}
            </h1>
            <p class="text-body-2 text-medium-emphasis mb-0">
              {{ state.technician.value.email }}
            </p>
          </div>
          <v-spacer />
          <v-chip
            :color="state.technician.value.isBlocked ? 'error' : 'success'"
            variant="tonal"
          >
            {{ state.technician.value.isBlocked ? 'Bloqué' : 'Actif' }}
          </v-chip>
          <v-btn
            :color="state.technician.value.isBlocked ? 'success' : 'error'"
            variant="flat"
            size="small"
            :prepend-icon="state.technician.value.isBlocked ? 'mdi-lock-open' : 'mdi-lock'"
            @click="toggleBlock"
          >
            {{ state.technician.value.isBlocked ? 'Débloquer' : 'Bloquer' }}
          </v-btn>
        </div>

        <!-- Stats -->
        <v-row
          dense
          class="mb-4"
        >
          <v-col
            cols="12"
            sm="4"
          >
            <v-card
              variant="outlined"
              class="text-center pa-4"
            >
              <div class="text-h4 font-weight-bold text-primary">
                {{ state.stats.value?.quotesInProgress ?? '—' }}
              </div>
              <div class="text-body-2 text-medium-emphasis mt-1">
                Devis en cours
              </div>
            </v-card>
          </v-col>
          <v-col
            cols="12"
            sm="4"
          >
            <v-card
              variant="outlined"
              class="text-center pa-4"
            >
              <div class="text-h4 font-weight-bold text-primary">
                {{ state.stats.value?.invoicesCount ?? '—' }}
              </div>
              <div class="text-body-2 text-medium-emphasis mt-1">
                Factures
              </div>
            </v-card>
          </v-col>
          <v-col
            cols="12"
            sm="4"
          >
            <v-card
              variant="outlined"
              class="text-center pa-4"
            >
              <div class="text-h4 font-weight-bold text-success">
                {{ formatCurrency(state.stats.value?.commissionDue) }}
              </div>
              <div class="text-body-2 text-medium-emphasis mt-1">
                Commission due
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Devis liés au technicien -->
        <v-card
          variant="outlined"
          class="mb-4"
        >
          <v-card-title class="text-subtitle-1 font-weight-bold pa-4 pb-2">
            Devis liés au technicien
          </v-card-title>
          <v-divider />
          <v-data-table
            :headers="quoteHeaders"
            :items="state.quotes.value"
            :items-per-page="10"
            hover
          >
            <!-- N° devis -->
            <template #item.quoteNumber="{ item }">
              <span class="text-body-2 font-weight-medium">{{ item.quoteNumber }}</span>
            </template>

            <!-- Véhicule -->
            <template #item.car="{ item }">
              <div class="text-body-2">
                {{ item.carBrand }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ item.carImmatriculation }}
              </div>
            </template>

            <!-- Date -->
            <template #item.startDate="{ item }">
              <span class="text-body-2">{{ formatDate(item.startDate) }}</span>
            </template>

            <!-- Montant HT -->
            <template #item.totalHt="{ item }">
              <span class="text-body-2 font-weight-medium">{{ formatCurrency(item.totalHt) }}</span>
            </template>

            <!-- Commission % -->
            <template #item.commissionRate="{ item }">
              <div
                class="d-flex align-center gap-1"
                style="min-width: 120px;"
              >
                <v-text-field
                  :model-value="getRate(item)"
                  type="number"
                  density="compact"
                  variant="outlined"
                  hide-details
                  min="0"
                  max="100"
                  style="width: 80px;"
                  @update:model-value="val => setLocalRate(item.id!, Number(val))"
                />
                <span class="text-body-2">%</span>
              </div>
            </template>

            <!-- Commission due -->
            <template #item.commissionDue="{ item }">
              <span class="text-body-2 font-weight-medium text-success">
                {{ formatCurrency(calcCommission(item)) }}
              </span>
            </template>

            <!-- Statut paiement -->
            <template #item.commissionPaid="{ item }">
              <v-chip
                size="x-small"
                :color="item.commissionPaid ? 'success' : 'warning'"
                variant="tonal"
              >
                {{ item.commissionPaid ? 'Payé' : 'En attente' }}
              </v-chip>
            </template>

            <!-- Actions -->
            <template #item.actions="{ item }">
              <div class="d-flex gap-1">
                <v-btn
                  v-if="!item.commissionPaid"
                  size="small"
                  color="success"
                  variant="tonal"
                  prepend-icon="mdi-check"
                  @click="markPaid(item)"
                >
                  Payé
                </v-btn>
                <v-btn
                  size="small"
                  color="primary"
                  variant="text"
                  icon
                  @click="saveRate(item)"
                >
                  <v-icon size="18">
                    mdi-content-save
                  </v-icon>
                  <v-tooltip activator="parent">
                    Enregistrer le taux
                  </v-tooltip>
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card>

        <!-- Garages assignés -->
        <v-card variant="outlined">
          <v-card-title class="text-subtitle-1 font-weight-bold pa-4 pb-2 d-flex align-center">
            Garages assignés
            <v-spacer />
            <v-btn
              size="small"
              color="primary"
              variant="tonal"
              prepend-icon="mdi-plus"
              @click="garageDialog = true"
            >
              Assigner
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-4">
            <div
              v-if="state.assignedGarages.value.length"
              class="d-flex flex-wrap gap-2"
            >
              <v-chip
                v-for="garage in state.assignedGarages.value"
                :key="garage.id"
                closable
                color="primary"
                variant="tonal"
                @click:close="state.removeGarage(garage.id!)"
              >
                {{ garage.name }}
              </v-chip>
            </div>
            <p
              v-else
              class="text-body-2 text-medium-emphasis mb-0"
            >
              Aucun garage assigné.
            </p>
          </v-card-text>
        </v-card>
      </template>

      <!-- Dialog assignation garage -->
      <AssignGarageDialog
        v-model="garageDialog"
        :technician-name="state.technician.value?.fullName ?? ''"
        :all-garages="allGarages"
        :assigned-garages="state.assignedGarages.value"
        @assign-garage="state.assignGarage($event)"
        @remove-garage="state.removeGarage($event)"
      />
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';
import AssignGarageDialog from '@/@presentation/@modules/technicians/components/AssignGarageDialog.vue';
import { IUseTechnicianDetailState } from '@/@presentation/types/composables/IUseTechnicianDetailState';
import { IGarageUseCase } from '@/@domain/useCases/IGarageUseCase';
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { GarageDto } from '@/@application/dtos/GarageDto';
import { QuoteDto } from '@/@application/dtos/QuoteDto';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';

const route = useRoute();
const state = container.get<IUseTechnicianDetailState>(SYMBOLS.States.TechnicianDetailState);
const garageUseCase = container.get<IGarageUseCase>(SYMBOLS.UseCases.Garage);
const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);

const garageDialog = ref(false);
const allGarages = ref<GarageDto[]>([]);

// Taux locaux (avant sauvegarde)
const localRates = ref<Record<string, number>>({});

const quoteHeaders = [
  { title: 'N° Devis', key: 'quoteNumber', sortable: true },
  { title: 'Véhicule', key: 'car', sortable: false },
  { title: 'Date', key: 'startDate', sortable: true },
  { title: 'Montant HT', key: 'totalHt', sortable: true },
  { title: 'Commission %', key: 'commissionRate', sortable: false },
  { title: 'Commission due', key: 'commissionDue', sortable: false },
  { title: 'Paiement', key: 'commissionPaid', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
];

function initials(name: string) {
  return name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() ?? '?';
}

function formatCurrency(val?: number) {
  if (val === undefined || val === null) return '—';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val);
}

function formatDate(date?: string) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('fr-FR');
}

// Taux effectif : local override > commissionRate du devis > base technicien
function getRate(quote: QuoteDto): number {
  if (localRates.value[quote.id!] !== undefined) return localRates.value[quote.id!];
  if (quote.commissionRate !== null && quote.commissionRate !== undefined) return quote.commissionRate;
  return state.technician.value?.percentageCommission ?? 0;
}

function setLocalRate(id: string, val: number) {
  localRates.value[id] = val;
}

function calcCommission(quote: QuoteDto): number {
  const rate = getRate(quote);
  const ht = quote.totalHt ?? 0;
  return Math.round((ht * rate) / 100 * 100) / 100;
}

async function saveRate(quote: QuoteDto) {
  const rate = localRates.value[quote.id!] ?? quote.commissionRate ?? null;
  await state.updateCommission(quote.id!, rate, quote.commissionPaid ?? false);
  delete localRates.value[quote.id!];
}

async function markPaid(quote: QuoteDto) {
  const rate = getRate(quote);
  await state.updateCommission(quote.id!, rate, true);
}

async function toggleBlock() {
  if (state.technician.value?.isBlocked) {
    await state.unblockTechnician();
  } else {
    await state.blockTechnician();
  }
}

onMounted(async () => {
  const id = route.params.id as string;
  const organizationId = authState.userContext.value?.organization.id ?? '';
  const [, garages] = await Promise.all([
    state.init(id),
    garageUseCase.getGaragesByOrganizationId(organizationId),
  ]);
  allGarages.value = garages;
});
</script>
