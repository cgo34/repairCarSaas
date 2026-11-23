<template>
  <MainLayout>
    <SubscriptionOverlay
      v-if="isFreePlan"
    />

    <v-container
      fluid
      class="pa-0"
    >
      <!-- ===================================================== -->
      <!-- DIALOG -->
      <!-- ===================================================== -->

      <div class="d-flex align-center mb-4">
        <div>
          <div class="text-h5 font-weight-bold">
            Garages
          </div>
          <div class="text-body-2 text-medium-emphasis">
            Gérez les garages de votre organisation
          </div>
        </div>
        <v-spacer />
        <v-dialog
          v-model="dialog"
          max-width="600px"
        >
          <template #activator="{ props }">
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              v-bind="props"
            >
              Ajouter un garage
            </v-btn>
          </template>

          <v-card>
            <v-card-title>
              <span class="text-h5">
                {{ formTitle }}
              </span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="selectedGarageForm.name"
                      label="Nom du garage"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="selectedGarageForm.phone"
                      label="Téléphone"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="selectedGarageForm.email"
                      label="Email"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      v-model="selectedGarageForm.address"
                      label="Adresse"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="selectedGarageForm.zip_code"
                      label="Code Postal"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="selectedGarageForm.city"
                      label="Ville"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      v-model.number="selectedGarageForm.percentageCommission"
                      label="Commission (%)"
                      type="number"
                      :min="0"
                      :max="100"
                      suffix="%"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer />

              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="
                  onCloseEditDialogBtnClick
                "
              >
                Annuler
              </v-btn>

              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="
                  onSaveEditDialogBtnClick
                "
              >
                Sauvegarder
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

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
              rounded="lg"
              size="40"
              :color="stat.color"
              variant="tonal"
            >
              <v-icon size="20">
                {{ stat.icon }}
              </v-icon>
            </v-avatar>
            <div>
              <div
                class="text-h6 font-weight-bold"
                :class="`text-${stat.color}`"
              >
                {{ stat.value }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ stat.label }}
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-card
        variant="flat"
        class="bg-surface border"
      >
        <div class="pa-4 d-flex flex-wrap ga-3">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            placeholder="Rechercher un nom, une ville…"
            density="compact"
            variant="outlined"
            hide-details
            clearable
            style="max-width: 300px;"
          />
          <v-select
            v-model="cityFilter"
            :items="cityFilterOptions"
            density="compact"
            variant="outlined"
            hide-details
            style="max-width: 180px;"
          />
          <v-select
            v-model="statusFilter"
            :items="statusFilterOptions"
            density="compact"
            variant="outlined"
            hide-details
            style="max-width: 180px;"
          />
        </div>
        <v-divider />
        <v-data-table
          :headers="headers"
          :items="filteredGarages"
          :sort-by="[{ key: 'name', order: 'asc' }]"
          :row-props="{ style: 'cursor: pointer;' }"
          items-per-page-text="Lignes par page"
          no-data-text="Aucun garage"
          hover
          @click:row="onRowClick"
        >
          <template #item.name="{ item }">
            <div class="d-flex align-center ga-3 py-2">
              <v-avatar
                rounded="lg"
                size="36"
                color="primary"
                variant="tonal"
              >
                <v-icon size="20">
                  mdi-warehouse
                </v-icon>
              </v-avatar>
              <div>
                <div class="font-weight-medium">
                  {{ item.name }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ item.code }}
                </div>
              </div>
            </div>
          </template>

          <template #item.phone="{ item }">
            <div>{{ item.phone || '—' }}</div>
            <div class="text-caption text-medium-emphasis">
              {{ item.email }}
            </div>
          </template>

          <template #item.percentageCommission="{ item }">
            {{ item.percentageCommission ? `${item.percentageCommission} %` : '—' }}
          </template>

          <template #item.archived_at="{ item }">
            <v-chip
              :color="getStatusColor(getGarageStatus(item))"
              size="small"
              variant="tonal"
            >
              {{ getGarageStatus(item) === 'active' ? 'Actif' : 'Archivé' }}
            </v-chip>
          </template>

          <template #item.actions="{ item }">
            <div
              class="d-flex justify-end"
              @click.stop
            >
              <v-menu location="bottom end">
                <template #activator="{ props }">
                  <v-btn
                    icon
                    size="small"
                    variant="text"
                    aria-label="Actions"
                    v-bind="props"
                  >
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list
                  density="compact"
                  min-width="200"
                >
                  <v-list-item
                    prepend-icon="mdi-pencil-outline"
                    title="Modifier"
                    @click="onEditBtnClick(item)"
                  />
                  <v-divider class="my-1" />
                  <v-list-item
                    prepend-icon="mdi-delete-outline"
                    title="Supprimer"
                    base-color="error"
                    @click="onDeleteBtnClick(item)"
                  />
                </v-list>
              </v-menu>
            </div>
          </template>
        </v-data-table>
      </v-card>

      <ConfirmDialog
        ref="confirmDialogRef"
        title="Supprimer le garage"
        confirm-label="Supprimer"
        :message="confirmMessage"
        cancel-label="Annuler"
        type="warning"
        @confirm="onConfirmDelete"
        @cancel="pendingGarage = null"
      />
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { useGaragesPageDependencies } from '@/features/garages/composition/useGaragesPageDependencies';
import { computed, onMounted, ref } from 'vue';



import SubscriptionOverlay from '@/features/subscription/presentation/components/SubscriptionOverlay.vue';
import MainLayout from '@/app/layouts/MainLayout.vue';
import ConfirmDialog from '@/shared/presentation/ui/components/ConfirmDialog.vue';
import type { ConfirmDialogExposed } from '@/shared/presentation/ui/components/ConfirmDialog';


import { GarageViewModel } from '@/features/garages/presentation/models/GarageViewModel';

/**
 * ============================================================
 * STATE
 * ============================================================
 */
  const { useGarageState, authState } = useGaragesPageDependencies();


const { isFreePlan } = authState;

const {
  garages,

  selectedGarageForm,

  init,

  selectGarage,

  addGarage,

  updateGarage,

  archiveGarage,

  resetSelectedGarageForm,
} = useGarageState;

/**
 * ============================================================
 * UI
 * ============================================================
 */

const dialog = ref<boolean>(false);

/**
 * ============================================================
 * TABLE
 * ============================================================
 */

const headers = [
  { title: 'Garage', align: 'start', key: 'name' },
  { title: 'Contact', key: 'phone' },
  { title: 'Adresse', key: 'address' },
  { title: 'Code postal', key: 'zip_code' },
  { title: 'Ville', key: 'city' },
  { title: 'Commission', key: 'percentageCommission', align: 'end' },
  { title: 'Statut', key: 'archived_at' },
  { title: '', key: 'actions', sortable: false, align: 'end', width: 56 },
] as const;

const search = ref<string | null>('');
const cityFilter = ref<string>('all');
const statusFilter = ref<string>('all');

const statusFilterOptions = [
  { title: 'Tous les statuts', value: 'all' },
  { title: 'Actif', value: 'active' },
  { title: 'Archivé', value: 'archived' },
];

const cityFilterOptions = computed(() => [
  { title: 'Toutes les villes', value: 'all' },
  ...[...new Set(garages.value.map(g => g.city).filter(Boolean))]
    .sort()
    .map(city => ({ title: city, value: city })),
]);

const filteredGarages = computed(() => {
  const term = (search.value ?? '').trim().toLowerCase();
  return garages.value.filter(g => {
    if (cityFilter.value !== 'all' && g.city !== cityFilter.value) return false;
    if (statusFilter.value !== 'all' && getGarageStatus(g) !== statusFilter.value) return false;
    if (!term) return true;
    return `${g.name} ${g.city ?? ''}`.toLowerCase().includes(term);
  });
});

const statCards = computed(() => {
  const list = garages.value;
  const archived = list.filter(g => g.archived_at).length;
  const avg = list.length
    ? list.reduce((sum, g) => sum + (g.percentageCommission || 0), 0) / list.length
    : 0;
  return [
    { label: 'Garages', value: list.length, icon: 'mdi-warehouse', color: 'primary' },
    { label: 'Actifs', value: list.length - archived, icon: 'mdi-check-circle-outline', color: 'success' },
    { label: 'Archivés', value: archived, icon: 'mdi-archive-outline', color: 'grey' },
    { label: 'Commission moyenne', value: `${Math.round(avg * 10) / 10} %`, icon: 'mdi-percent-outline', color: 'warning' },
  ];
});

/**
 * ============================================================
 * FORM
 * ============================================================
 */

const formTitle = computed(() =>
  selectedGarageForm.value?.id
    ? 'Modifier le Garage'
    : 'Nouveau Garage'
);

const getGarageStatus = (
  garage: GarageViewModel
): 'active' | 'archived' => {
  return garage.archived_at
    ? 'archived'
    : 'active';
};

const getStatusColor = (
  status: string
) => {
  switch (status) {
    case 'active':
      return 'green';

    case 'archived':
      return 'grey';

    default:
      return 'grey';
  }
};

/**
 * ============================================================
 * ACTIONS
 * ============================================================
 */

const onEditBtnClick = (
  item: GarageViewModel
) => {
  selectGarage(item);

  dialog.value = true;
};

const onCloseEditDialogBtnClick =
  () => {
    resetSelectedGarageForm();

    dialog.value = false;
  };

const onSaveEditDialogBtnClick =
  async () => {
    if (
      selectedGarageForm.value?.id
    ) {
      await updateGarage(
        selectedGarageForm.value
      );
    } else {
      await addGarage(
        selectedGarageForm.value
      );
    }

    dialog.value = false;
  };

const confirmDialogRef = ref<ConfirmDialogExposed>();
const pendingGarage = ref<GarageViewModel | null>(null);
const confirmMessage = computed(() =>
  `Êtes-vous sûr de vouloir supprimer le garage "${pendingGarage.value?.name ?? ''}" ?`
);

const onRowClick = (_event: Event, { item }: { item: GarageViewModel }) => {
  onEditBtnClick(item);
};

const onDeleteBtnClick = (item: GarageViewModel) => {
  if (!item.id) return;
  pendingGarage.value = item;
  confirmDialogRef.value?.open();
};

const onConfirmDelete = async () => {
  const garage = pendingGarage.value;
  pendingGarage.value = null;
  if (garage?.id) await archiveGarage(garage.id);
};

/**
 * ============================================================
 * LIFECYCLE
 * ============================================================
 */

onMounted(async () => {
  await init();
});
</script>
