<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-0 mt-4 create-quote-container"
      :class="{ 'is-dark': isDark }"
    >
      <!-- ── Header ── -->
      <div class="page-header mx-3 mb-3 px-4 py-3 d-flex align-center gap-3">
        <v-btn
          icon
          variant="outlined"
          size="small"
          class="header-back"
          @click="$router.back()"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <div class="ml-3">
          <div class="text-h6 font-weight-bold">
            {{ t('quotes.list.newQuote') }}
          </div>
          <div
            v-if="quoteInformations.number"
            class="text-caption text-medium-emphasis"
          >
            {{ quoteInformations.number }}
          </div>
        </div>
        <v-chip
          class="ml-3"
          size="small"
          variant="tonal"
          color="grey"
        >
          Brouillon
        </v-chip>
        <v-spacer />
        <v-btn
          class="d-none d-md-flex"
          color="primary"
          rounded="lg"
          elevation="0"
          :loading="loading"
          prepend-icon="mdi-content-save-outline"
          @click="onSaveBtnClick"
        >
          {{ t('quotes.create.submit') }}
        </v-btn>
      </div>

      <PlanLimitAlert
        class="mx-3 mb-3"
        limit-key="max_quotes_per_month"
        kind="quotes"
        :used="quotesUsed"
      />

      <v-form
        ref="form"
        class="px-3 pt-3 pb-28"
      >
        <v-row>
          <!-- ═════════════ Colonne gauche ═════════════ -->
          <v-col
            cols="12"
            md="8"
          >
            <!-- ── Dates ── -->
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
                <span class="text-subtitle-1 font-weight-bold">{{ t('quotes.edit.dates') }}</span>
              </div>
              <v-row dense>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="quoteInformations.date"
                    :label="t('quotes.create.startDate')"
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
                    :label="t('quotes.edit.validUntil')"
                    type="date"
                    variant="outlined"
                    density="comfortable"
                    readonly
                    hide-details="auto"
                  />
                </v-col>
              </v-row>
            </div>

            <v-row class="equal-height-row">
              <v-col
                cols="12"
                md="6"
                class="d-flex"
              >
                <!-- ── Technicien ── -->
                <div class="section-card mb-4 flex-grow-1">
                  <div class="section-header mb-3">
                    <div class="section-icon">
                      <v-icon
                        size="18"
                        color="primary"
                      >
                        mdi-account-wrench-outline
                      </v-icon>
                    </div>
                    <span class="text-subtitle-1 font-weight-bold">{{ t('quotes.view.technician') }}</span>
                  </div>
                  <v-autocomplete
                    :model-value="selectedTechnician"
                    :items="technicians"
                    :item-title="item => `${item.users.first_name} ${item.users.last_name}`"
                    item-value="id"
                    return-object
                    :label="t('quotes.edit.selectTechnician')"
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
              </v-col>

              <v-col
                cols="12"
                md="6"
                class="d-flex"
              >
                <!-- ── Client / Garage ── -->
                <div class="section-card mb-4 flex-grow-1">
                  <div class="section-header mb-3">
                    <div class="section-icon">
                      <v-icon
                        size="18"
                        color="primary"
                      >
                        mdi-garage
                      </v-icon>
                    </div>
                    <span class="text-subtitle-1 font-weight-bold">{{ t('quotes.create.garage') }}</span>
                  </div>
                  <v-autocomplete
                    :model-value="selectedGarage"
                    :items="garages"
                    item-title="name"
                    item-value="id"
                    return-object
                    :label="t('quotes.edit.selectGarage')"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    hide-details="auto"
                    prepend-inner-icon="mdi-garage"
                    @update:model-value="onSelectGarage"
                  >
                    <template #item="{ props: itemProps, item }">
                      <v-list-item
                        v-bind="itemProps"
                        :subtitle="[item.raw.address, item.raw.zip_code, item.raw.city].filter(Boolean).join(' ')"
                      >
                        <template #prepend>
                          <v-icon color="primary">
                            mdi-garage
                          </v-icon>
                        </template>
                      </v-list-item>
                    </template>
                    <template #selection="{ item }">
                      <span>{{ item.raw.name }}</span>
                      <span
                        v-if="item.raw.city"
                        class="text-medium-emphasis ml-1"
                      >· {{ item.raw.city }}</span>
                    </template>
                  </v-autocomplete>
                  <div class="d-flex align-center flex-wrap ga-2 mt-2">
                    <v-btn
                      variant="tonal"
                      color="primary"
                      size="x-small"
                      prepend-icon="mdi-plus"
                      @click="onEditCustomerBtnClick"
                    >
                      {{ t('quotes.create.newClient') }}
                    </v-btn>
                    <span class="text-caption text-medium-emphasis">
                      {{ t('quotes.edit.commission', { rate: commissionRate }) }} · {{ selectedCountry?.code || 'FR' }} · {{ selectedCountry?.taxRate ? t('common.totals.vat', { rate: selectedCountry.taxRate }) : t('quotes.create.vatNotApplicable') }}
                    </span>
                  </div>
                </div>
              </v-col>
            </v-row>

            <!-- ── Véhicule ── -->
            <div class="section-card mb-4">
              <div class="section-header mb-3">
                <div class="section-icon">
                  <v-icon
                    size="18"
                    color="primary"
                  >
                    mdi-car
                  </v-icon>
                </div>
                <span class="text-subtitle-1 font-weight-bold">{{ t('quotes.create.vehicleInfo') }}</span>
              </div>
              <v-row dense>
                <v-col
                  cols="12"
                  sm="4"
                >
                  <v-text-field
                    v-model="carInformations.immatriculation"
                    :label="t('quotes.edit.plate')"
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
                    :label="t('quotes.edit.brand')"
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
                    :label="t('quotes.edit.year')"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    prepend-inner-icon="mdi-calendar-range-outline"
                    @update:model-value="onCarYearUpdated"
                  />
                </v-col>
              </v-row>
            </div>

            <!-- ── Éléments : ajoutés après l'enregistrement du brouillon ── -->
            <div
              v-if="!isForfait"
              class="section-card mb-4"
            >
              <div class="section-header mb-3">
                <div class="section-icon">
                  <v-icon
                    size="18"
                    color="primary"
                  >
                    mdi-format-list-bulleted
                  </v-icon>
                </div>
                <span class="text-subtitle-1 font-weight-bold">{{ t('quotes.items.title') }}</span>
                <v-spacer />
                <v-chip
                  size="x-small"
                  variant="tonal"
                  color="primary"
                >
                  0
                </v-chip>
              </div>
              <div class="empty-items text-center py-6 text-medium-emphasis">
                <div class="text-body-2">
                  {{ t('quotes.create.noItems') }}
                </div>
                <div class="text-body-2">
                  {{ t('quotes.create.noItemsHint') }}
                </div>
              </div>
            </div>
          </v-col>

          <!-- ═════════════ Colonne droite ═════════════ -->
          <v-col
            cols="12"
            md="4"
          >
            <div class="side-sticky">
              <!-- ── Statut ── -->
              <div class="section-card mb-4">
                <div class="section-header mb-3">
                  <div class="section-icon">
                    <v-icon
                      size="18"
                      color="primary"
                    >
                      mdi-flag-outline
                    </v-icon>
                  </div>
                  <span class="text-subtitle-1 font-weight-bold">{{ t('quotes.edit.quoteStatus') }}</span>
                  <v-spacer />
                  <v-chip
                    size="small"
                    variant="tonal"
                    color="grey"
                  >
                    Brouillon
                  </v-chip>
                </div>
                <v-btn
                  color="primary"
                  block
                  prepend-icon="mdi-send-outline"
                  disabled
                >
                  {{ t('quotes.edit.sendToGarage') }}
                </v-btn>
                <div class="text-caption text-medium-emphasis mt-2">
                  {{ t('quotes.create.sendHint') }}
                </div>
              </div>

              <!-- ── Options ── -->
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
                  <span class="text-subtitle-1 font-weight-bold">{{ t('quotes.edit.options') }}</span>
                </div>

                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis mb-1 font-weight-medium">
                    {{ t('quotes.edit.countryVat') }}
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
                      {{ t('quotes.edit.flatRate') }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ t('quotes.edit.flatRateHint') }}
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
                      :label="`Montant du forfait (${selectedCountry?.currencySymbol || '€'})`"
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
                        {{ t('quotes.edit.unitPrices') }}
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        {{ t('quotes.edit.unitPricesHint') }}
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
                        {{ t('quotes.edit.commissionExclStripping') }}
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        {{ t('quotes.edit.commissionExclStrippingHint') }}
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

              <!-- ── Récapitulatif (vide tant que le devis n'a pas d'éléments) ── -->
              <div class="section-card mb-4">
                <div class="section-header mb-3">
                  <div class="section-icon">
                    <v-icon
                      size="18"
                      color="primary"
                    >
                      mdi-calculator-variant-outline
                    </v-icon>
                  </div>
                  <span class="text-subtitle-1 font-weight-bold">{{ t('common.totals.summary') }}</span>
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ t('common.totals.inclTax') }}
                </div>
                <div class="recap-total text-primary">
                  {{ forfaitTotal }}
                </div>
                <v-divider class="my-3" />

                <div class="totals-list">
                  <div class="total-row">
                    <span class="text-body-2 text-medium-emphasis">{{ t('common.totals.exclTax') }}</span>
                    <span class="text-body-2 font-weight-medium">{{ forfaitTotal }}</span>
                  </div>
                  <template v-if="!isForfait">
                    <div class="total-row">
                      <span class="text-body-2 text-medium-emphasis">{{ t('common.totals.totalStripping') }}</span>
                      <span class="text-body-2 font-weight-medium">{{ zero }}</span>
                    </div>
                    <div class="total-row">
                      <span class="text-body-2 text-medium-emphasis">{{ t('common.totals.exclTaxPlusStripping') }}</span>
                      <span class="text-body-2 font-weight-medium">{{ zero }}</span>
                    </div>
                  </template>
                  <div class="total-row">
                    <span class="text-body-2 text-medium-emphasis">TVA ({{ selectedCountry?.taxRate || 0 }}%)</span>
                    <span class="text-body-2 font-weight-medium">{{ zero }}</span>
                  </div>
                  <div
                    v-if="commissionRate"
                    class="total-row text-orange"
                  >
                    <span class="text-body-2">Commission ({{ commissionRate }}%)</span>
                    <span class="text-body-2 font-weight-medium">{{ zero }}</span>
                  </div>
                  <template v-if="commissionRate">
                    <v-divider class="my-2" />
                    <div class="total-row">
                      <span class="text-body-2 font-weight-bold">{{ t('quotes.edit.technicianNet') }}</span>
                      <span class="text-body-2 font-weight-bold">{{ forfaitTotal }}</span>
                    </div>
                  </template>
                </div>

                <v-btn
                  class="d-none d-md-flex mt-4"
                  color="primary"
                  size="large"
                  block
                  rounded="lg"
                  elevation="0"
                  :loading="loading"
                  prepend-icon="mdi-content-save-outline"
                  @click="onSaveBtnClick"
                >
                  {{ t('quotes.create.submit') }}
                </v-btn>
                <v-btn
                  class="d-none d-md-flex mt-2"
                  variant="outlined"
                  block
                  rounded="lg"
                  @click="$router.back()"
                >
                  Annuler
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-form>

      <!-- Barre d'action mobile -->
      <div class="sticky-bottom-bar d-md-none">
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
          {{ t('quotes.create.submit') }}
        </v-btn>
      </div>
    </v-container>
    <v-snackbar
      v-model="snackbar.show"
      color="error"
      :timeout="5000"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </MainLayout>

  <GarageDialog
    ref="garageDialogRef"
    :title="t('quotes.create.newClient')"
    persistent
    :max-width="500"
    @validated="onGarageValidated"
  />
</template>

<script setup lang="ts">
import { useCreateQuotePageDependencies } from '@/features/quotes/composition/useCreateQuotePageDependencies';
import MainLayout from '@/app/layouts/MainLayout.vue';
import CountrySelect from '@/features/countries/presentation/components/CountrySelect.vue';
import { GarageDialogExposed } from '@/features/garages/presentation/components/GarageDialog';
import GarageDialog from '@/features/garages/presentation/components/GarageDialog.vue';
import { CountryViewModel } from '@/features/countries/presentation/models/CountryViewModel';
import { GarageViewModel } from '@/features/garages/presentation/models/GarageViewModel';
import { OrganizationMemberViewModel } from '@/features/organizations/presentation/models/OrganizationMemberViewmodel';
import router from '@/app/router/index';
import { setSelectedQuoteGuid } from '@/features/quotes/presentation/utils/quoteSelection';
import { computed, onMounted, reactive, ref } from 'vue';
import { useTheme } from 'vuetify';
import { useI18n } from 'vue-i18n';
import PlanLimitAlert from '@/features/featureAccess/presentation/components/PlanLimitAlert.vue';
import { useFeatureAccess } from '@/features/featureAccess/composition/useFeatureAccess';
import { usePlanUsage } from '@/features/featureAccess/composition/usePlanUsage';
import { planLimitMessage } from '@/features/featureAccess/presentation/utils/planLimitMessage';

// ─── State ────────────────────────────────────────────────────────────────────
const { useCreateQuoteState } = useCreateQuotePageDependencies();
const { t } = useI18n();
const { isLimitReached, limitOf, isLoading: featuresLoading } = useFeatureAccess();
const { quotesUsed, load: loadPlanUsage } = usePlanUsage();
const isDark = computed(() => useTheme().current.value.dark);

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
  error,
} = useCreateQuoteState;

const loading = ref(false);
const snackbar = reactive({ show: false, message: '' });
const garageDialogRef = ref<GarageDialogExposed>();

// ─── Helpers ──────────────────────────────────────────────────────────────────
const currency = computed(() => selectedCountry.value?.currencySymbol || '€');
const commissionRate = computed(() => selectedGarage.value?.percentageCommission ?? 0);
const formatAmount = (value: number) => `${value.toFixed(2).replace('.', ',')} ${currency.value}`;
const zero = computed(() => formatAmount(0));
// En mode forfait, le seul montant connu avant création est le forfait saisi
const forfaitTotal = computed(() => formatAmount(isForfait.value ? Number(forfaitAmount.value) || 0 : 0));

const initials = (name: string) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

// ─── Handlers ─────────────────────────────────────────────────────────────────
const onSelectTechnician = (technician: OrganizationMemberViewModel) => selectTechnician(technician);
const onSelectGarage = (garage: GarageViewModel) => selectGarage(garage);
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

// Crée le devis puis ouvre la gestion des éléments (ou la liste en mode forfait)
const onSaveBtnClick = async () => {
  if (!featuresLoading.value && isLimitReached('max_quotes_per_month', quotesUsed.value)) {
    snackbar.message = t('common.planLimit.quotes', { limit: limitOf('max_quotes_per_month') });
    snackbar.show = true;
    return;
  }
  loading.value = true;
  try {
    await save();
    if (error.value) throw error.value;
    if (quote.value?.id) {
      setSelectedQuoteGuid(quote.value.id);
      router.push(isForfait.value ? '/quotes' : '/quotes/items');
    }
  } catch (e) {
    snackbar.message = planLimitMessage(e, t) ?? (e instanceof Error ? e.message : String(e ?? t('quotes.create.submit')));
    snackbar.show = true;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await Promise.all([init(), loadPlanUsage()]);
});
</script>

<style scoped>
.create-quote-container {
  --q-bg: #f4f5fa;
  --q-card: #fff;
  --q-border: #e6e8f0;
  --q-border-strong: #d5d8e3;
  --q-soft: #eef0f4;
  --q-muted: #4b5563;
  --q-text: #1f2330;
  min-height: 100dvh;
  background: var(--q-bg);
}

.create-quote-container.is-dark {
  --q-text: rgba(255, 255, 255, 0.92);
  --q-bg: transparent;
  --q-card: rgb(var(--v-theme-surface));
  --q-border: rgba(255, 255, 255, 0.06);
  --q-border-strong: rgba(255, 255, 255, 0.2);
  --q-soft: rgba(255, 255, 255, 0.1);
  --q-muted: rgba(255, 255, 255, 0.7);
}

.header-back {
  background: var(--q-soft) !important;
  border-color: var(--q-border) !important;
  color: var(--q-muted);
}

.page-header {
  background: var(--q-card);
  border: 1px solid var(--q-border);
  border-radius: 14px;
  position: sticky;
  top: 8px;
  z-index: 10;
}

.section-card {
  background: var(--q-card);
  border-radius: 14px;
  padding: 16px;
  border: 1px solid var(--q-border);
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

.empty-items {
  border: 1px dashed var(--q-border-strong);
  border-radius: 12px;
}

.recap-total {
  font-size: 30px;
  font-weight: 800;
  line-height: 1.2;
}

.totals-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  font-size: 14px;
}

.recap-divider {
  border-top: 1px dashed var(--q-border-strong);
  margin: 8px 0;
}

.cancel-btn {
  border-color: var(--q-border-strong);
  color: var(--q-text);
}

.sticky-bottom-bar {
  position: sticky;
  bottom: 0;
  z-index: 10;
  padding: 12px 16px;
  padding-bottom: max(12px, env(safe-area-inset-bottom));
  background: rgb(var(--v-theme-surface));
  border-top: 1px solid rgba(var(--v-border-color), 0.12);
}

.equal-height-row > .v-col {
  display: flex;
}

.equal-height-row > .v-col > .section-card {
  flex: 1;
}

.side-sticky {
  position: sticky;
  top: 88px;
}

.pb-28 {
  padding-bottom: 16px;
}
</style>
