<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-0 create-quote-container"
    >
      <!-- ───── Header ───── -->
      <div class="page-header px-4 pt-4 pb-3">
        <div class="d-flex align-center gap-2">
          <v-btn
            icon
            variant="text"
            size="small"
            @click="$router.back()"
          >
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <div>
            <div class="text-h6 font-weight-bold">
              Nouveau devis
            </div>
            <div
              v-if="quoteInformations.number"
              class="text-caption text-medium-emphasis"
            >
              {{ quoteInformations.number }}
            </div>
          </div>
        </div>
      </div>

      <v-form
        ref="form"
        class="px-3 pb-28"
      >
        <!-- ───── Section 1 : Dates ───── -->
        <div class="section-card mb-4">
          <div class="section-header mb-3">
            <div class="section-icon">
              <v-icon
                size="18"
                color="primary"
              >
                mdi-calendar-outline
              </v-icon>
            </div>
            <span class="text-subtitle-2 font-weight-semibold">Dates du devis</span>
          </div>
          <v-row dense>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="quoteInformations.date"
                label="Date de création"
                type="date"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                :model-value="expirationDate"
                label="Valide jusqu'au"
                type="date"
                variant="outlined"
                density="comfortable"
                readonly
                hide-details="auto"
              />
            </v-col>
          </v-row>
        </div>

        <!-- ───── Section 2 : Technicien ───── -->
        <div class="section-card mb-4">
          <div class="section-header mb-3">
            <div class="section-icon">
              <v-icon
                size="18"
                color="primary"
              >
                mdi-account-wrench-outline
              </v-icon>
            </div>
            <span class="text-subtitle-2 font-weight-semibold">Technicien</span>
          </div>
          <v-autocomplete
            :model-value="selectedTechnician"
            :items="technicians"
            :item-title="item => `${item.users.first_name} ${item.users.last_name}`"
            item-value="id"
            return-object
            label="Sélectionner un technicien"
            variant="outlined"
            density="comfortable"
            clearable
            hide-details="auto"
            prepend-inner-icon="mdi-account-search-outline"
            @update:model-value="onSelectTechnician"
          >
            <template #item="{ props: itemProps, item }">
              <v-list-item v-bind="itemProps">
                <template #prepend>
                  <v-avatar
                    color="primary"
                    size="36"
                  >
                    <span class="text-caption font-weight-bold text-white">
                      {{ initials(item.raw.users.first_name + ' ' + item.raw.users.last_name) }}
                    </span>
                  </v-avatar>
                </template>
              </v-list-item>
            </template>
            <template #selection="{ item }">
              <div class="d-flex align-center gap-2">
                <v-avatar
                  color="primary"
                  size="24"
                >
                  <span
                    style="font-size:10px"
                    class="text-white"
                  >{{ initials(item.raw.users.first_name + ' ' + item.raw.users.last_name) }}</span>
                </v-avatar>
                <span>{{ item.raw.users.first_name }} {{ item.raw.users.last_name }}</span>
              </div>
            </template>
          </v-autocomplete>
        </div>

        <!-- ───── Section 3 : Client / Garage ───── -->
        <div class="section-card mb-4">
          <div class="section-header mb-3">
            <div class="section-icon">
              <v-icon
                size="18"
                color="primary"
              >
                mdi-garage-open-variant
              </v-icon>
            </div>
            <span class="text-subtitle-2 font-weight-semibold">Client / Garage</span>
          </div>

          <v-autocomplete
            :model-value="selectedGarage"
            :items="garages"
            item-title="name"
            item-value="id"
            return-object
            label="Sélectionner un garage"
            variant="outlined"
            density="comfortable"
            clearable
            hide-details="auto"
            prepend-inner-icon="mdi-store-search-outline"
            @update:model-value="onSelectGarage"
          >
            <template #item="{ props: itemProps, item }">
              <v-list-item
                v-bind="itemProps"
                :subtitle="item.raw.city ?? ''"
              >
                <template #prepend>
                  <v-icon color="primary">
                    mdi-garage-variant
                  </v-icon>
                </template>
              </v-list-item>
            </template>
          </v-autocomplete>

          <v-btn
            variant="tonal"
            color="primary"
            size="small"
            class="mt-2"
            prepend-icon="mdi-plus"
            @click="onEditCustomerBtnClick"
          >
            Nouveau client
          </v-btn>

          <v-expand-transition>
            <div
              v-if="selectedGarage"
              class="mt-3"
            >
              <v-card
                variant="tonal"
                color="primary"
                rounded="lg"
                class="pa-3"
              >
                <div class="d-flex align-center gap-2 mb-1">
                  <v-icon
                    size="18"
                    color="primary"
                  >
                    mdi-map-marker-outline
                  </v-icon>
                  <span class="text-body-2 font-weight-medium">{{ selectedGarage.name }}</span>
                </div>
                <div
                  v-if="selectedGarage.address"
                  class="text-caption text-medium-emphasis"
                >
                  {{ selectedGarage.address }}<span v-if="selectedGarage.zipCode">, {{ selectedGarage.zipCode }}</span><span v-if="selectedGarage.city"> {{ selectedGarage.city }}</span>
                </div>
                <div
                  v-if="selectedGarage.percentageCommission"
                  class="mt-1"
                >
                  <v-chip
                    size="x-small"
                    color="orange"
                    variant="tonal"
                  >
                    Commission {{ selectedGarage.percentageCommission }}%
                  </v-chip>
                </div>
              </v-card>
            </div>
          </v-expand-transition>
        </div>

        <!-- ───── Section 4 : Véhicule ───── -->
        <div class="section-card mb-4">
          <div class="section-header mb-3">
            <div class="section-icon">
              <v-icon
                size="18"
                color="primary"
              >
                mdi-car-outline
              </v-icon>
            </div>
            <span class="text-subtitle-2 font-weight-semibold">Véhicule</span>
          </div>

          <v-autocomplete
            :model-value="selectedVehicle"
            :items="vehiclesList"
            :item-title="v => v.immatriculation + ' — ' + v.marque + (v.annee ? ' ' + v.annee : '')"
            item-value="id"
            return-object
            label="Véhicule existant (optionnel)"
            variant="outlined"
            density="comfortable"
            clearable
            :disabled="!selectedGarage"
            :no-data-text="selectedGarage ? 'Aucun véhicule trouvé' : 'Sélectionnez d\'abord un garage'"
            hide-details="auto"
            prepend-inner-icon="mdi-car-search-outline"
            class="mb-3"
            @update:model-value="onSelectVehicle"
          />

          <div class="text-caption text-medium-emphasis mb-3 d-flex align-center gap-1">
            <v-icon size="14">
              mdi-information-outline
            </v-icon>
            Ou renseignez manuellement :
          </div>

          <v-row dense>
            <v-col
              cols="12"
              sm="4"
            >
              <v-text-field
                v-model="carInformations.immatriculation"
                label="Immatriculation"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                prepend-inner-icon="mdi-card-text-outline"
                @update:model-value="onCarImmatriculationUpdated"
              />
            </v-col>
            <v-col
              cols="12"
              sm="4"
            >
              <v-text-field
                v-model="carInformations.brand"
                label="Marque"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                prepend-inner-icon="mdi-car-info"
                @update:model-value="onCarBrandUpdated"
              />
            </v-col>
            <v-col
              cols="12"
              sm="4"
            >
              <v-text-field
                v-model="carInformations.dateEntryCirculation"
                label="Année"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                prepend-inner-icon="mdi-calendar-range-outline"
                @update:model-value="onCarYearUpdated"
              />
            </v-col>
          </v-row>
        </div>

        <!-- ───── Section 5 : Options ───── -->
        <div class="section-card mb-4">
          <div class="section-header mb-3">
            <div class="section-icon">
              <v-icon
                size="18"
                color="primary"
              >
                mdi-tune-variant
              </v-icon>
            </div>
            <span class="text-subtitle-2 font-weight-semibold">Options</span>
          </div>

          <div class="mb-3">
            <div class="text-caption text-medium-emphasis mb-1 font-weight-medium">
              Pays &amp; TVA
            </div>
            <CountrySelect
              :model-value="selectedCountry"
              @select="onSelectCountry"
            />
          </div>

          <v-divider class="my-3" />

          <div class="d-flex align-center justify-space-between py-2">
            <div>
              <div class="text-body-2 font-weight-medium">
                Mode forfait
              </div>
              <div class="text-caption text-medium-emphasis">
                Remplacer les lignes par un montant fixe
              </div>
            </div>
            <v-switch
              :model-value="isForfait"
              color="primary"
              inset
              hide-details
              @update:model-value="onUpdateIsForfait"
            />
          </div>

          <v-expand-transition>
            <div
              v-if="isForfait"
              class="pb-2"
            >
              <v-text-field
                :model-value="forfaitAmount"
                label="Montant du forfait (€)"
                type="number"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                prepend-inner-icon="mdi-currency-eur"
                @update:model-value="onUpdateForfaitAmount"
              />
            </div>
          </v-expand-transition>

          <template v-if="!isForfait">
            <v-divider class="my-1" />
            <div class="d-flex align-center justify-space-between py-2">
              <div>
                <div class="text-body-2 font-weight-medium">
                  Prix unitaires visibles
                </div>
                <div class="text-caption text-medium-emphasis">
                  Afficher le détail sur le devis
                </div>
              </div>
              <v-switch
                :model-value="isDisplayUnitPrice"
                color="primary"
                inset
                hide-details
                @update:model-value="onUpdateIsDisplayUnitPrice"
              />
            </div>

            <v-divider class="my-1" />
            <div class="d-flex align-center justify-space-between py-2">
              <div>
                <div class="text-body-2 font-weight-medium">
                  Commission hors dégarnissage
                </div>
                <div class="text-caption text-medium-emphasis">
                  Exclure le dégarnissage de la base de commission
                </div>
              </div>
              <v-switch
                :model-value="isComputeCommissionWithoutDentRemoval"
                color="primary"
                inset
                hide-details
                @update:model-value="onUpdateIsComputeCommissionWithoutDentRemoval"
              />
            </div>
          </template>
        </div>
      </v-form>

      <!-- ───── Bottom sticky action ───── -->
      <div class="sticky-bottom-bar">
        <v-btn
          color="primary"
          size="large"
          block
          rounded="lg"
          :loading="loading"
          prepend-icon="mdi-file-document-plus-outline"
          elevation="0"
          @click="onSaveBtnClick"
        >
          Créer le devis
        </v-btn>
      </div>
    </v-container>
  </MainLayout>

  <GarageDialog
    ref="garageDialogRef"
    title="Nouveau client"
    persistent
    :max-width="500"
    @validated="onGarageValidated"
  />
</template>

<script setup lang="ts">
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';
import CountrySelect from '@/@presentation/components/CountrySelect.vue';
import { GarageDialogExposed } from '@/@presentation/components/GarageDialog';
import GarageDialog from '@/@presentation/components/GarageDialog.vue';
import { IUseCreateQuoteState } from '@/@presentation/types/composables/IUseCreateQuoteState';
import { CountryViewModel } from '@/@presentation/types/models/CountryViewModel';
import { GarageViewModel } from '@/@presentation/types/models/GarageViewModel';
import { UserViewModel } from '@/@presentation/types/models/UserViewModel';
import { VehicleViewModel } from '@/@presentation/types/models/VehicleViewModel';
import router from '@/router';
import { computed, onMounted, ref } from 'vue';

// ─── State ────────────────────────────────────────────────────────────────────
const useCreateQuoteState = container.get<IUseCreateQuoteState>(SYMBOLS.States.Quote.CreateQuoteState);

const {
  init,
  quote,
  quoteInformations,
  expirationDate,
  technicians,
  garages,
  selectedTechnician,
  selectedGarage,
  selectGarage,
  vehicles,
  selectedVehicle,
  selectVehicle,
  selectTechnician,
  setGarage,
  carInformations,
  setCarImmatriculation,
  setCarBrand,
  setCarDateEntryCirculation,
  isForfait,
  isDisplayUnitPrice,
  isComputeCommissionWithoutDentRemoval,
  setForfaitAmount,
  forfaitAmount,
  setIsForfait,
  setIsDisplayUnitPrice,
  setIsComputeCommissionWithoutDentRemoval,
  selectCountry,
  selectedCountry,
  save,
} = useCreateQuoteState;

const loading = ref(false);
const garageDialogRef = ref<GarageDialogExposed>();
const vehiclesList = computed(() => vehicles.value);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const initials = (name: string) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

// ─── Handlers ─────────────────────────────────────────────────────────────────
const onSelectTechnician = (technician: UserViewModel) => selectTechnician(technician);
const onSelectGarage = (garage: GarageViewModel) => selectGarage(garage);
const onSelectVehicle = (vehicle: VehicleViewModel | undefined) => selectVehicle(vehicle);
const onEditCustomerBtnClick = () => garageDialogRef.value?.open();
const onGarageValidated = (garage: GarageViewModel) => setGarage(garage);
const onCarImmatriculationUpdated = (value: string) => setCarImmatriculation(value);
const onCarBrandUpdated = (value: string) => setCarBrand(value);
const onCarYearUpdated = (value: string) => setCarDateEntryCirculation(value);
const onUpdateIsForfait = (value: boolean | null) => setIsForfait(value ?? false);
const onUpdateForfaitAmount = (value: string | number | null) => setForfaitAmount(Number(value) || 0);
const onUpdateIsDisplayUnitPrice = (value: boolean | null) => setIsDisplayUnitPrice(value ?? true);
const onUpdateIsComputeCommissionWithoutDentRemoval = (value: boolean | null) => setIsComputeCommissionWithoutDentRemoval(value ?? true);
const onSelectCountry = (country: CountryViewModel | undefined) => {
  if (country) selectCountry(country);
};

const onSaveBtnClick = async () => {
  loading.value = true;
  try {
    await save();
    router.push(`/quotes/${quote.value.id}/edit`);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await init();
});
</script>

<style scoped>
.create-quote-container {
  min-height: 100dvh;
  background: rgb(var(--v-theme-background));
}

/* Header */
.page-header {
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
  position: sticky;
  top: 0;
  z-index: 10;
}

/* Section cards */
.section-card {
  background: rgb(var(--v-theme-surface));
  border-radius: 16px;
  padding: 16px;
  border: 1px solid rgba(var(--v-border-color), 0.08);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(var(--v-theme-primary), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Sticky bottom */
.sticky-bottom-bar {
  position: sticky;
  bottom: 0;
  z-index: 10;
  padding: 12px 16px;
  padding-bottom: max(12px, env(safe-area-inset-bottom));
  background: rgb(var(--v-theme-surface));
  border-top: 1px solid rgba(var(--v-border-color), 0.12);
}

/* Spacing below form to not be hidden by sticky bar */
.pb-28 {
  padding-bottom: 80px;
}
</style>
