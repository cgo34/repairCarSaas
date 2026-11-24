<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-0"
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
        <v-card
          variant="flat"
          class="bg-surface border pa-5 mb-4 d-flex align-center ga-4"
        >
          <v-btn
            icon="mdi-arrow-left"
            variant="text"
            aria-label="Retour"
            @click="router.back()"
          />
          <v-avatar
            color="primary"
            variant="tonal"
            size="56"
          >
            <span
              v-if="displayName(state.technician.value)"
              class="text-h6 font-weight-bold"
            >
              {{ initials(displayName(state.technician.value)) }}
            </span>
            <v-icon
              v-else
              size="28"
            >
              mdi-account
            </v-icon>
          </v-avatar>
          <div>
            <div class="d-flex align-center ga-3">
              <h1 class="text-h5 font-weight-bold mb-0">
                {{ displayName(state.technician.value) || state.technician.value.email }}
              </h1>
              <v-chip
                :color="state.technician.value.isBlocked ? 'error' : 'success'"
                variant="tonal"
                size="small"
              >
                {{ state.technician.value.isBlocked ? 'Bloqué' : 'Actif' }}
              </v-chip>
            </div>
            <p
              v-if="displayName(state.technician.value)"
              class="text-body-2 text-medium-emphasis mb-0 mt-1"
            >
              <v-icon size="14">
                mdi-email-outline
              </v-icon>
              {{ state.technician.value.email }}
            </p>
          </div>
          <v-spacer />
          <v-btn
            :color="state.technician.value.isBlocked ? 'success' : 'error'"
            variant="outlined"
            size="small"
            :prepend-icon="state.technician.value.isBlocked ? 'mdi-lock-open' : 'mdi-lock'"
            @click="requestToggleBlock"
          >
            {{ state.technician.value.isBlocked ? 'Débloquer' : 'Bloquer' }}
          </v-btn>
        </v-card>

        <!-- Stats -->
        <v-row
          dense
          class="mb-4"
        >
          <v-col
            v-for="stat in statCards"
            :key="stat.label"
            cols="12"
            sm="6"
            md="3"
          >
            <v-card
              variant="flat"
              class="bg-surface border pa-4 d-flex align-center ga-3"
            >
              <v-avatar
                :color="stat.color"
                variant="tonal"
                rounded="lg"
                size="40"
              >
                <v-icon size="20">
                  {{ stat.icon }}
                </v-icon>
              </v-avatar>
              <div>
                <div
                  class="stat-value"
                  :class="`text-${stat.color}`"
                >
                  {{ stat.value }}
                </div>
                <div class="stat-sub">
                  {{ stat.label }}
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col
            cols="12"
            lg="9"
          >
            <!-- Devis / Factures -->
            <v-card
              variant="flat"
              class="bg-surface border"
            >
              <v-tabs
                v-model="tab"
                color="primary"
              >
                <v-tab value="quotes">
                  Devis
                  <v-chip
                    size="x-small"
                    class="ml-2"
                  >
                    {{ state.quotes.value.length }}
                  </v-chip>
                </v-tab>
                <v-tab value="invoices">
                  Factures
                  <v-chip
                    size="x-small"
                    class="ml-2"
                  >
                    {{ state.invoices.value.length }}
                  </v-chip>
                </v-tab>
              </v-tabs>
              <v-divider />
              <div class="pa-4 pb-0 d-flex flex-wrap ga-3">
                <v-text-field
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                  placeholder="Rechercher un numéro, un véhicule…"
                  density="compact"
                  variant="outlined"
                  hide-details
                  clearable
                  style="max-width: 320px;"
                />
                <v-select
                  v-model="paymentFilter"
                  :items="paymentOptions"
                  density="compact"
                  variant="outlined"
                  hide-details
                  style="max-width: 220px;"
                />
              </div>
              <v-data-table
                :headers="headers"
                :items="rows"
                :search="search ?? undefined"
                item-value="id"
                :items-per-page="10"
                items-per-page-text="Lignes par page"
                no-data-text="Aucun document"
                hover
              >
                <!-- N° document -->
                <template #item.number="{ item }">
                  <span class="text-body-2 font-weight-medium">{{ item.number }}</span>
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
                    class="d-flex align-center ga-1"
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
                      @update:model-value="val => setLocalRate(item.id, Number(val))"
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
                  <div class="d-flex ga-1 justify-end">
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
          </v-col>

          <v-col
            cols="12"
            lg="3"
          >
            <!-- Garages assignés -->
            <v-card
              variant="flat"
              class="bg-surface border"
            >
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
              <v-list
                v-if="state.assignedGarages.value.length"
                density="compact"
              >
                <v-list-item
                  v-for="garage in state.assignedGarages.value"
                  :key="garage.id"
                  :title="garage.name"
                >
                  <template #prepend>
                    <v-avatar
                      size="32"
                      rounded="lg"
                      color="primary"
                      variant="tonal"
                      class="mr-3"
                    >
                      <v-icon size="18">
                        mdi-warehouse
                      </v-icon>
                    </v-avatar>
                  </template>
                  <template #append>
                    <v-btn
                      icon
                      size="x-small"
                      variant="text"
                      @click="requestRemoveGarage(garage.id!)"
                    >
                      <v-icon size="16">
                        mdi-close
                      </v-icon>
                      <v-tooltip activator="parent">
                        Retirer
                      </v-tooltip>
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>
              <p
                v-else
                class="text-body-2 text-medium-emphasis pa-4 mb-0"
              >
                Aucun garage assigné.
              </p>
            </v-card>
          </v-col>
        </v-row>
      </template>

      <!-- Snackbar feedback -->
      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        timeout="3000"
        location="bottom right"
      >
        {{ snackbar.message }}
      </v-snackbar>

      <!-- Dialog assignation garage -->
      <AssignGarageDialog
        v-model="garageDialog"
        :technician-name="displayName(state.technician.value) || (state.technician.value?.email ?? '')"
        :all-garages="allGarages"
        :assigned-garages="state.assignedGarages.value"
        @assign-garages="assignGarages"
      />
      <ConfirmDialog
        ref="confirmDialogRef"
        :title="confirmState.title"
        :message="confirmState.message"
        :confirm-label="confirmState.confirmLabel"
        cancel-label="Annuler"
        type="warning"
        @confirm="onConfirmAction"
        @cancel="pendingAction = null"
      />
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { useTechnicianDetailPageDependencies } from '@/features/technicians/composition/useTechnicianDetailPageDependencies';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainLayout from '@/app/layouts/MainLayout.vue';
import AssignGarageDialog from '@/features/technicians/presentation/components/AssignGarageDialog.vue';
import ConfirmDialog from '@/shared/presentation/ui/components/ConfirmDialog.vue';
import type { ConfirmDialogExposed } from '@/shared/presentation/ui/components/ConfirmDialog';
import { GarageDto } from '@/features/garages/application/dtos/GarageDto';

interface CommissionRow {
  id: string;
  number: string;
  carBrand?: string;
  carImmatriculation?: string;
  startDate?: string;
  totalHt?: number;
  commissionRate?: number | null;
  commissionPaid?: boolean;
}

const route = useRoute();
const router = useRouter();
const { state, garageUseCase, authState } = useTechnicianDetailPageDependencies();

const garageDialog = ref(false);
const snackbar = reactive({ show: false, message: '', color: 'success' });
const showSnack = (message: string, color = 'success') => { snackbar.message = message; snackbar.color = color; snackbar.show = true; };
const allGarages = ref<GarageDto[]>([]);

const tab = ref<'quotes' | 'invoices'>('quotes');
const search = ref<string | null>('');
const paymentFilter = ref<'all' | 'pending' | 'paid'>('all');
const paymentOptions = [
  { title: 'Tous les paiements', value: 'all' },
  { title: 'En attente', value: 'pending' },
  { title: 'Payé', value: 'paid' },
];

// Taux locaux (avant sauvegarde)
const localRates = ref<Record<string, number>>({});

const headers = computed(() => [
  { title: tab.value === 'quotes' ? 'N° Devis' : 'N° Facture', key: 'number', sortable: true },
  { title: 'Véhicule', key: 'car', sortable: false },
  { title: 'Date', key: 'startDate', sortable: true },
  { title: 'Montant HT', key: 'totalHt', sortable: true },
  { title: 'Commission %', key: 'commissionRate', sortable: false },
  { title: 'Commission due', key: 'commissionDue', sortable: false },
  { title: 'Paiement', key: 'commissionPaid', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
]);

const quoteRows = computed<CommissionRow[]>(() =>
  state.quotes.value.map(q => ({
    id: q.id ?? '',
    number: q.quoteNumber,
    carBrand: q.carBrand,
    carImmatriculation: q.carImmatriculation,
    startDate: q.startDate,
    totalHt: q.totalHt,
    commissionRate: q.commissionRate,
    commissionPaid: q.commissionPaid,
  }))
);

const invoiceRows = computed<CommissionRow[]>(() =>
  state.invoices.value.map(i => ({
    id: i.id ?? '',
    number: i.invoiceNumber,
    carBrand: i.carBrand,
    carImmatriculation: i.carImmatriculation,
    startDate: i.startDate,
    totalHt: i.totalHt,
    commissionRate: i.commissionRate,
    commissionPaid: i.commissionPaid,
  }))
);

const rows = computed(() => {
  const source = tab.value === 'quotes' ? quoteRows.value : invoiceRows.value;
  if (paymentFilter.value === 'all') return source;
  const wantPaid = paymentFilter.value === 'paid';
  return source.filter(r => !!r.commissionPaid === wantPaid);
});

const paidCommission = computed(() =>
  invoiceRows.value
    .filter(r => r.commissionPaid)
    .reduce((sum, r) => sum + calcCommission(r), 0)
);

const statCards = computed(() => [
  { label: 'Devis en cours', value: state.stats.value?.quotesInProgress ?? '—', icon: 'mdi-file-document-outline', color: 'primary' },
  { label: 'Factures', value: state.stats.value?.invoicesCount ?? '—', icon: 'mdi-receipt-text-outline', color: 'info' },
  { label: 'Commission due', value: formatCurrency(state.stats.value?.commissionDue), icon: 'mdi-currency-eur', color: 'success' },
  { label: 'Commission payée', value: formatCurrency(paidCommission.value), icon: 'mdi-check-circle-outline', color: 'warning' },
]);

function displayName(t: { full_name?: string; first_name?: string; last_name?: string } | null): string {
  if (!t) return '';
  if (t.full_name) return t.full_name;
  return [t.first_name, t.last_name].filter(Boolean).join(' ');
}

function initials(name: string) {
  return name?.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() ?? '';
}

function formatCurrency(val?: number) {
  if (val === undefined || val === null) return '—';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val);
}

function formatDate(date?: string) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('fr-FR');
}

// Taux effectif : local override > commissionRate du document > base technicien
function getRate(row: CommissionRow): number {
  if (localRates.value[row.id] !== undefined) return localRates.value[row.id];
  if (row.commissionRate !== null && row.commissionRate !== undefined) return row.commissionRate;
  return state.technician.value?.percentageCommission ?? 0;
}

function setLocalRate(id: string, val: number) {
  localRates.value[id] = val;
}

function calcCommission(row: CommissionRow): number {
  const rate = getRate(row);
  const ht = row.totalHt ?? 0;
  return Math.round((ht * rate) / 100 * 100) / 100;
}

function persistCommission(row: CommissionRow, rate: number | null, paid: boolean) {
  return tab.value === 'quotes'
    ? state.updateCommission(row.id, rate, paid)
    : state.updateInvoiceCommission(row.id, rate, paid);
}

async function saveRate(row: CommissionRow) {
  const rate = localRates.value[row.id] ?? row.commissionRate ?? null;
  await persistCommission(row, rate, row.commissionPaid ?? false);
  delete localRates.value[row.id];
}

async function markPaid(row: CommissionRow) {
  await persistCommission(row, getRate(row), true);
}

const confirmDialogRef = ref<ConfirmDialogExposed>();
const confirmState = reactive({ title: '', message: '', confirmLabel: 'Confirmer' });
const pendingAction = ref<(() => void | Promise<void>) | null>(null);

function askConfirmation(title: string, message: string, confirmLabel: string, action: () => void | Promise<void>) {
  Object.assign(confirmState, { title, message, confirmLabel });
  pendingAction.value = action;
  confirmDialogRef.value?.open();
}

async function onConfirmAction() {
  const action = pendingAction.value;
  pendingAction.value = null;
  await action?.();
}

async function assignGarages(garageIds: string[]) {
  try {
    for (const garageId of garageIds) {
      await state.assignGarage(garageId);
    }
  } catch {
    showSnack("Erreur lors de l'assignation des garages.", 'error');
  }
}

function requestToggleBlock() {
  const name = displayName(state.technician.value) || (state.technician.value?.email ?? 'ce membre');
  if (state.technician.value?.isBlocked) {
    askConfirmation('Débloquer le membre', `${name} retrouvera l'accès à l'application. Continuer ?`, 'Débloquer', toggleBlock);
  } else {
    askConfirmation('Bloquer le membre', `${name} n'aura plus accès à l'application. Continuer ?`, 'Bloquer', toggleBlock);
  }
}

function requestRemoveGarage(garageId: string) {
  const garage = state.assignedGarages.value.find(g => g.id === garageId);
  askConfirmation(
    'Retirer le garage',
    `Le garage ${garage?.name ?? ''} ne sera plus assigné à ce membre. Continuer ?`,
    'Retirer',
    () => state.removeGarage(garageId),
  );
}

async function toggleBlock() {
  try {
    if (state.technician.value?.isBlocked) {
      await state.unblockTechnician();
      showSnack('Technicien débloqué avec succès.');
    } else {
      await state.blockTechnician();
      showSnack('Technicien bloqué avec succès.');
    }
  } catch {
    showSnack('Erreur lors de la modification du statut.', 'error');
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
