<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-0 mt-4 create-invoice-container"
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
            {{ t('invoices.create.title') }}
          </div>
          <div class="text-caption text-medium-emphasis">
            {{ t('invoices.create.numberHint') }}
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
      </div>

      <PlanLimitAlert
        class="mx-3 mb-3"
        limit-key="max_invoices_per_month"
        kind="invoices"
        :used="invoicesUsed"
      />

      <v-form
        ref="form"
        class="px-3 pt-3 pb-28"
      >
        <v-row>
          <v-col
            cols="12"
            md="8"
          >
            <!-- ── Origine de la facture ── -->
            <div class="section-card mb-4">
              <div class="section-header mb-3">
                <div class="section-icon">
                  <v-icon
                    size="18"
                    color="primary"
                  >
                    mdi-receipt-text-outline
                  </v-icon>
                </div>
                <span class="text-subtitle-1 font-weight-bold">{{ t('invoices.create.source') }}</span>
              </div>
              <div class="source-choices">
                <div
                  class="source-choice"
                  :class="{ 'is-active': invoiceSource === 'free' }"
                  @click="invoiceSource = 'free'"
                >
                  <v-icon size="18">
                    mdi-pencil-outline
                  </v-icon>
                  {{ t('invoices.create.freeInvoice') }}
                </div>
                <div
                  class="source-choice"
                  :class="{ 'is-active': invoiceSource === 'quote' }"
                  @click="onSelectSource('quote')"
                >
                  <v-icon size="18">
                    mdi-file-document-outline
                  </v-icon>
                  {{ t('invoices.create.fromQuote') }}
                </div>
              </div>
              <div class="text-caption text-medium-emphasis mt-2">
                {{ t('invoices.create.sourceHint') }}
              </div>
            </div>

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
                <span class="text-subtitle-1 font-weight-bold">{{ t('invoices.form.dates') }}</span>
              </div>
              <v-row dense>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="invoiceInformations.date"
                    :label="t('invoices.form.invoiceDate')"
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
                    :label="t('invoices.form.dueDate')"
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
                    <span class="text-subtitle-1 font-weight-bold">{{ t('invoices.form.technician') }}</span>
                  </div>
                  <v-autocomplete
                    :model-value="selectedTechnician"
                    :items="technicians"
                    :item-title="item => `${item.users.first_name} ${item.users.last_name}`"
                    item-value="id"
                    return-object
                    :label="t('invoices.form.selectTechnician')"
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
                <!-- ── Client / Garage (même rendu que la page devis) ── -->
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
                    <span class="text-subtitle-1 font-weight-bold">{{ t('invoices.create.garage') }}</span>
                  </div>
                  <v-autocomplete
                    :model-value="selectedGarage"
                    :items="garages"
                    item-title="name"
                    item-value="id"
                    return-object
                    :label="t('invoices.form.selectGarage')"
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
                  <div class="text-caption text-medium-emphasis mt-2">
                    {{ t('invoices.create.commissionLine', { rate: commissionRate, code: selectedCountry?.code || 'FR', vat: selectedCountry?.taxRate ? `${selectedCountry.taxRate} %` : t('invoices.create.vatNotApplicable') }) }}
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
                <span class="text-subtitle-1 font-weight-bold">{{ t('invoices.form.vehicleInfo') }}</span>
              </div>
              <v-row dense>
                <v-col
                  cols="12"
                  sm="4"
                >
                  <v-text-field
                    v-model="carInformations.immatriculation"
                    :label="t('invoices.form.plate')"
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
                    :label="t('invoices.form.brand')"
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
                    :label="t('invoices.form.year')"
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
            <div class="section-card mb-4">
              <div class="section-header mb-3">
                <div class="section-icon">
                  <v-icon
                    size="18"
                    color="primary"
                  >
                    mdi-format-list-bulleted
                  </v-icon>
                </div>
                <span class="text-subtitle-1 font-weight-bold">{{ t('invoices.form.items') }}</span>
                <v-spacer />
                <v-chip
                  size="x-small"
                  variant="tonal"
                  color="primary"
                  class="mr-2"
                >
                  0
                </v-chip>
              </div>
              <div class="empty-items text-center py-6 text-medium-emphasis">
                <div class="text-body-2">
                  {{ t('invoices.create.noItems') }}
                </div>
                <div class="text-body-2">
                  {{ t('invoices.create.saveThenAdd') }}
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
                  <span class="text-subtitle-1 font-weight-bold">{{ t('invoices.form.invoiceStatus') }}</span>
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
                  {{ t('invoices.form.sendToClient') }}
                </v-btn>
                <div class="text-caption text-medium-emphasis mt-2">
                  {{ t('invoices.create.saveThenAddBeforeSend') }}
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
                  <span class="text-subtitle-1 font-weight-bold">{{ t('invoices.form.options') }}</span>
                </div>

                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis mb-1 font-weight-medium">
                    {{ t('invoices.form.countryVat') }}
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
                      {{ t('invoices.form.flatRate') }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ t('invoices.form.flatRateHint') }}
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

                <template v-if="!isForfait">
                  <v-divider class="my-1" />
                  <div class="d-flex align-center justify-space-between py-2">
                    <div>
                      <div class="text-body-2 font-weight-medium">
                        {{ t('invoices.form.unitPrices') }}
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        {{ t('invoices.form.unitPricesHint') }}
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
                        {{ t('invoices.form.commissionExclStripping') }}
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        {{ t('invoices.form.commissionExclStrippingHint') }}
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

              <!-- ── Récapitulatif (vide tant que le brouillon n'a pas d'éléments) ── -->
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
                <div class="recap-total text-primary mb-2">
                  {{ zero }}
                </div>
                <div class="recap-divider" />
                <div class="totals-list">
                  <div class="total-row text-medium-emphasis">
                    <span>{{ t('common.totals.exclTax') }}</span><span>{{ zero }}</span>
                  </div>
                  <div class="total-row text-medium-emphasis">
                    <span>{{ t('common.totals.stripping') }}</span><span>{{ zero }}</span>
                  </div>
                  <div class="total-row text-medium-emphasis">
                    <span>{{ t('common.totals.exclTaxPlusStripping') }}</span><span>{{ zero }}</span>
                  </div>
                  <div class="total-row text-medium-emphasis">
                    <span>{{ t('common.totals.vat', { rate: selectedCountry?.taxRate || 0 }) }}</span><span>{{ zero }}</span>
                  </div>
                  <div class="total-row text-orange">
                    <span>{{ t('common.totals.commission', { rate: commissionRate }) }}</span><span>{{ zero }}</span>
                  </div>
                </div>
                <div class="recap-divider" />
                <div class="total-row font-weight-bold">
                  <span>{{ t('invoices.form.technicianNet') }}</span><span>{{ zero }}</span>
                </div>

                <div class="d-none d-md-flex flex-column ga-2 mt-3">
                  <v-btn
                    color="primary"
                    size="large"
                    :loading="loading"
                    prepend-icon="mdi-content-save-outline"
                    @click="onSaveBtnClick"
                  >
                    {{ t('invoices.form.saveDraft') }}
                  </v-btn>
                  <v-btn
                    variant="outlined"
                    class="cancel-btn"
                    @click="$router.back()"
                  >
                    {{ t('common.cancel') }}
                  </v-btn>
                </div>
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
          prepend-icon="mdi-content-save-outline"
          elevation="0"
          @click="onSaveBtnClick"
        >
          {{ t('invoices.form.saveDraft') }}
        </v-btn>
      </div>
    </v-container>
  </MainLayout>

  <SelectQuoteDialog
    v-model="quoteDialog"
    @converted="onQuoteConverted"
    @error="onQuoteError"
  />

  <v-snackbar
    v-model="snackbar.show"
    color="error"
    timeout="4000"
    location="bottom right"
  >
    {{ snackbar.message }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { setSelectedInvoiceGuid } from '@/features/invoices/presentation/utils/invoiceSelection';
import { useCreateInvoicePageDependencies } from '@/features/invoices/composition/useCreateInvoicePageDependencies';
import MainLayout from '@/app/layouts/MainLayout.vue';
import CountrySelect from '@/features/countries/presentation/components/CountrySelect.vue';
import SelectQuoteDialog from '@/features/invoices/presentation/components/SelectQuoteDialog.vue';
import { CountryViewModel } from '@/features/countries/presentation/models/CountryViewModel';
import { GarageViewModel } from '@/features/garages/presentation/models/GarageViewModel';
import { OrganizationMemberViewModel } from '@/features/organizations/presentation/models/OrganizationMemberViewmodel';
import router from '@/app/router/index';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useTheme } from 'vuetify';
import { useI18n } from 'vue-i18n';
import PlanLimitAlert from '@/features/featureAccess/presentation/components/PlanLimitAlert.vue';
import { useFeatureAccess } from '@/features/featureAccess/composition/useFeatureAccess';
import { usePlanUsage } from '@/features/featureAccess/composition/usePlanUsage';
import { planLimitMessage } from '@/features/featureAccess/presentation/utils/planLimitMessage';
import { intlLocale } from '@/app/i18n/formatters';

const { useCreateInvoiceState } = useCreateInvoicePageDependencies();
const { t } = useI18n();
const { isLimitReached, limitOf, isLoading: featuresLoading } = useFeatureAccess();
const { invoicesUsed, load: loadPlanUsage } = usePlanUsage();
const isDark = computed(() => useTheme().current.value.dark);

const {
  init,
  invoice,
  invoiceInformations,
  expirationDate,
  technicians,
  garages,
  selectedTechnician,
  selectedGarage,
  selectGarage,
  selectTechnician,
  carInformations,
  setCarImmatriculation,
  setCarBrand,
  setCarDateEntryCirculation,
  isForfait,
  isDisplayUnitPrice,
  isComputeCommissionWithoutDentRemoval,
  setIsForfait,
  setIsDisplayUnitPrice,
  setIsComputeCommissionWithoutDentRemoval,
  selectCountry,
  selectedCountry,
  save,
  error,
} = useCreateInvoiceState;

const loading = ref(false);
const snackbar = reactive({ show: false, message: '' });
// Choix d'origine : "devis" ouvre la modale de sélection ; fermée sans choix, on revient à "libre"
const invoiceSource = ref<'free' | 'quote'>('free');
const quoteDialog = ref(false);
const onSelectSource = (source: 'free' | 'quote') => {
  invoiceSource.value = source;
  quoteDialog.value = source === 'quote';
};
watch(quoteDialog, open => { if (!open) invoiceSource.value = 'free'; });
// La conversion crée directement la facture brouillon : on l'ouvre pour la compléter
const onQuoteConverted = (invoiceId: string) => {
  quoteDialog.value = false;
  setSelectedInvoiceGuid(invoiceId);
  router.push('/invoices/edit');
};
const onQuoteError = (message: string) => {
  snackbar.message = message;
  snackbar.show = true;
};
const commissionRate = computed(() => selectedGarage.value?.percentageCommission ?? 0);
const zero = computed(() => `${(0).toLocaleString(intlLocale(), { minimumFractionDigits: 2 })} ${selectedCountry.value?.currencySymbol || '€'}`);

const initials = (name: string) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

const onSelectTechnician = (t: OrganizationMemberViewModel) => selectTechnician(t);
const onSelectGarage = (g: GarageViewModel) => selectGarage(g);
const onCarImmatriculationUpdated = (v: string) => setCarImmatriculation(v);
const onCarBrandUpdated = (v: string) => setCarBrand(v);
const onCarYearUpdated = (v: string) => setCarDateEntryCirculation(v);
const onUpdateIsForfait = (v: boolean | null) => setIsForfait(v ?? false);
const onUpdateIsDisplayUnitPrice = (v: boolean | null) => setIsDisplayUnitPrice(v ?? true);
const onUpdateIsComputeCommissionWithoutDentRemoval = (v: boolean | null) => setIsComputeCommissionWithoutDentRemoval(v ?? true);
const onSelectCountry = (c: CountryViewModel | undefined) => { if (c) selectCountry(c); };

// Crée le brouillon puis ouvre la page d'édition, où les éléments pourront être gérés
const onSaveBtnClick = async () => {
  if (!featuresLoading.value && isLimitReached('max_invoices_per_month', invoicesUsed.value)) {
    snackbar.message = t('common.planLimit.invoices', { limit: limitOf('max_invoices_per_month') });
    snackbar.show = true;
    return;
  }
  loading.value = true;
  try {
    await save();
    if (error.value) throw error.value;
    if (invoice.value?.id) setSelectedInvoiceGuid(invoice.value.id);
    router.push('/invoices/edit');
  } catch (e) {
    snackbar.message = planLimitMessage(e, t) ?? (e instanceof Error ? e.message : t('invoices.create.createError'));
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
.create-invoice-container {
  --q-bg: #f4f5fa;
  --q-card: #fff;
  --q-border: #e6e8f0;
  --q-border-strong: #d5d8e3;
  --q-soft: #eef0f4;
  --q-muted: #4b5563;
  --q-text: #1f2330;
  min-height: 100dvh;
  background: var(--q-bg) !important;
}

.create-invoice-container.is-dark {
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

.header-btn {
  border-radius: 10px;
  border: 1px solid var(--q-border-strong);
  background: var(--q-card);
  color: var(--q-text);
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
}

.source-choices {
  display: flex;
  gap: 8px;
}

.source-choice {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid var(--q-border-strong);
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.source-choice.is-active {
  background: rgba(var(--v-theme-primary), 0.12);
  border-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-primary));
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
