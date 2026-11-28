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
            {{ t('garages.title') }}
          </div>
          <div class="text-body-2 text-medium-emphasis">
            {{ t('garages.subtitle') }}
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
              :disabled="garagesLimitReached"
              v-bind="props"
            >
              {{ t('garages.add') }}
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
                      :label="t('garages.form.name')"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="selectedGarageForm.phone"
                      :label="t('garages.form.phone')"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="selectedGarageForm.email"
                      :label="t('garages.form.email')"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      v-model="selectedGarageForm.address"
                      :label="t('garages.form.address')"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="selectedGarageForm.zip_code"
                      :label="t('garages.form.zipCode')"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="selectedGarageForm.city"
                      :label="t('garages.form.city')"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      v-model.number="selectedGarageForm.percentageCommission"
                      :label="t('garages.form.commission')"
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
                {{ t('common.cancel') }}
              </v-btn>

              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="
                  onSaveEditDialogBtnClick
                "
              >
                {{ t('common.save') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

      <PlanLimitAlert
        class="mb-4"
        limit-key="max_garages"
        kind="garages"
        :used="garages.length"
      />

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

      <v-card
        variant="flat"
        class="bg-surface border"
      >
        <div class="pa-4 d-flex flex-wrap ga-3">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            :placeholder="t('garages.searchPlaceholder')"
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
          :items-per-page-text="t('common.table.itemsPerPage')"
          :no-data-text="t('garages.empty')"
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
              {{ getGarageStatus(item) === 'active' ? t('garages.status.active') : t('garages.status.archived') }}
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
                    :aria-label="t('garages.actions.label')"
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
                    :title="t('garages.actions.edit')"
                    @click="onEditBtnClick(item)"
                  />
                  <v-divider class="my-1" />
                  <v-list-item
                    prepend-icon="mdi-delete-outline"
                    :title="t('garages.actions.delete')"
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
        :title="t('garages.delete.title')"
        :confirm-label="t('common.delete')"
        :message="confirmMessage"
        :cancel-label="t('common.cancel')"
        type="warning"
        @confirm="onConfirmDelete"
        @cancel="pendingGarage = null"
      />

      <v-snackbar
        v-model="snackbar.show"
        color="error"
        timeout="5000"
      >
        {{ snackbar.message }}
      </v-snackbar>
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { useGaragesPageDependencies } from '@/features/garages/composition/useGaragesPageDependencies';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import PlanLimitAlert from '@/features/featureAccess/presentation/components/PlanLimitAlert.vue';
import { useFeatureAccess } from '@/features/featureAccess/composition/useFeatureAccess';
import { planLimitMessage } from '@/features/featureAccess/presentation/utils/planLimitMessage';



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
const { t } = useI18n();
const { isLimitReached } = useFeatureAccess();

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

const garagesLimitReached = computed(() => isLimitReached('max_garages', garages.value.length));

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

const headers = computed(() => [
  { title: t('garages.table.garage'), align: 'start', key: 'name' },
  { title: t('garages.table.contact'), key: 'phone' },
  { title: t('garages.form.address'), key: 'address' },
  { title: t('garages.form.zipCode'), key: 'zip_code' },
  { title: t('garages.form.city'), key: 'city' },
  { title: t('garages.table.commission'), key: 'percentageCommission', align: 'end' },
  { title: t('garages.table.status'), key: 'archived_at' },
  { title: '', key: 'actions', sortable: false, align: 'end', width: 56 },
] as const);

const search = ref<string | null>('');
const cityFilter = ref<string>('all');
const statusFilter = ref<string>('all');

const statusFilterOptions = computed(() => [
  { title: t('garages.filters.allStatuses'), value: 'all' },
  { title: t('garages.status.active'), value: 'active' },
  { title: t('garages.status.archived'), value: 'archived' },
]);

const cityFilterOptions = computed(() => [
  { title: t('garages.filters.allCities'), value: 'all' },
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
    { label: t('garages.stats.garages'), value: list.length, icon: 'mdi-warehouse', color: 'primary' },
    { label: t('garages.stats.active'), value: list.length - archived, icon: 'mdi-check-circle-outline', color: 'success' },
    { label: t('garages.stats.archived'), value: archived, icon: 'mdi-archive-outline', color: 'grey' },
    { label: t('garages.stats.avgCommission'), value: `${Math.round(avg * 10) / 10} %`, icon: 'mdi-percent-outline', color: 'warning' },
  ];
});

/**
 * ============================================================
 * FORM
 * ============================================================
 */

const formTitle = computed(() =>
  selectedGarageForm.value?.id
    ? t('garages.dialog.edit')
    : t('garages.dialog.new')
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

const snackbar = reactive({ show: false, message: '' });

const onSaveEditDialogBtnClick =
  async () => {
    try {
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
    } catch (e) {
      snackbar.message = planLimitMessage(e, t) ?? (e instanceof Error ? e.message : String(e));
      snackbar.show = true;
      return;
    }

    dialog.value = false;
  };

const confirmDialogRef = ref<ConfirmDialogExposed>();
const pendingGarage = ref<GarageViewModel | null>(null);
const confirmMessage = computed(() =>
  t('garages.delete.message', { name: pendingGarage.value?.name ?? '' })
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
