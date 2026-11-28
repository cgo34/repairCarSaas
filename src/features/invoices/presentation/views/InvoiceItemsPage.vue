<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-0 pt-4 items-invoice-container"
      :class="{ 'is-dark': isDark }"
    >
      <div class="page-header mx-3 mb-3 px-4 py-3 d-flex align-center justify-space-between flex-wrap ga-3">
        <div class="d-flex align-center ga-4 min-w-0">
          <v-btn
            icon
            variant="flat"
            size="small"
            class="header-back"
            @click="onBackBtnClick"
          >
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <span class="text-h6 font-weight-bold">
            {{ t('invoices.view.title', { number: invoiceInformations.number || '' }) }}
          </span>
          <v-chip
            :color="statusColor(invoiceStatus)"
            size="small"
            variant="tonal"
            rounded="pill"
          >
            {{ statusLabel(invoiceStatus) }}
          </v-chip>
        </div>
        <div class="d-flex ga-3">
          <v-btn
            variant="outlined"
            height="40"
            class="px-5 header-btn"
            prepend-icon="mdi-file-pdf-box"
            @click="onViewPdfBtnClick"
          >
            {{ t('invoices.actions.viewPdf') }}
          </v-btn>
          <v-btn
            variant="outlined"
            height="40"
            class="px-5 header-btn"
            prepend-icon="mdi-pencil-outline"
            @click="onEditInvoiceBtnClick"
          >
            {{ t('invoices.items.editInvoice') }}
          </v-btn>
        </div>
      </div>

      <v-row class="px-3 pb-6">
        <v-col
          cols="12"
          md="8"
        >
          <!-- Même panneau que pour les devis : liste / vue voiture -->
          <DocumentItemsPanel
            :title="t('invoices.form.items')"
            forfait-message="Cette facture est au forfait : aucun élément détaillé n'est nécessaire."
            :lines="invoiceLines"
            :body-parts="bodyParts"
            :available-body-parts="availableBodyParts"
            :is-forfait="isForfait"
            :is-read-only="isReadOnly"
            :car-view-enabled="can('car_view')"
            :currency="currency"
            :on-add="addLine"
            :on-update="updateLine"
            :on-remove="removeLine"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <div class="section-card recap-card">
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

            <div class="totals-list">
              <div class="total-row">
                <span class="text-body-2 text-medium-emphasis">{{ t('common.totals.exclTax') }}</span>
                <span class="text-body-2 font-weight-bold">
                  {{ regionManager.formatNumber(subtotal) }} {{ currency }}
                </span>
              </div>
              <template v-if="!isForfait">
                <div class="total-row">
                  <span class="text-body-2 text-medium-emphasis">{{ t('common.totals.totalStripping') }}</span>
                  <span class="text-body-2 font-weight-bold">
                    {{ regionManager.formatNumber(totalDegarnissage) }} {{ currency }}
                  </span>
                </div>
                <div class="total-row">
                  <span class="text-body-2 text-medium-emphasis">{{ t('common.totals.exclTaxPlusStripping') }}</span>
                  <span class="text-body-2 font-weight-bold">
                    {{ regionManager.formatNumber(subTotalWithDegarnissage) }} {{ currency }}
                  </span>
                </div>
              </template>
              <div class="total-row">
                <span class="text-body-2 text-medium-emphasis">{{ t('common.totals.vat', { rate: selectedCountry?.taxRate || 0 }) }}</span>
                <span class="text-body-2 font-weight-bold">
                  {{ regionManager.formatNumber(totalTaxRate) }} {{ currency }}
                </span>
              </div>
              <div
                v-if="selectedGarage?.percentageCommission"
                class="total-row text-orange"
              >
                <span class="text-body-2">{{ t('common.totals.commission', { rate: selectedGarage.percentageCommission }) }}</span>
                <span class="text-body-2 font-weight-bold">
                  {{ regionManager.formatNumber(totalCommission) }} {{ currency }}
                </span>
              </div>
              <div class="total-row total-final mt-2 pt-3">
                <span class="text-subtitle-2 font-weight-bold">{{ t('common.totals.inclTax') }}</span>
                <span class="text-h5 font-weight-black text-primary">
                  {{ regionManager.formatNumber(total) }} {{ currency }}
                </span>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { getSelectedInvoiceGuid } from '@/features/invoices/presentation/utils/invoiceSelection';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useTheme } from 'vuetify';
import MainLayout from '@/app/layouts/MainLayout.vue';
import { useEditInvoicePageDependencies } from '@/features/invoices/composition/useEditInvoicePageDependencies';
import { useFeatureAccess } from '@/features/featureAccess/composition/useFeatureAccess';
import DocumentItemsPanel from '@/features/lineItems/presentation/components/DocumentItemsPanel.vue';

const router = useRouter();
const { t } = useI18n();
const theme = useTheme();
const isDark = computed(() => theme.current.value.dark);
const { regionManager, useEditInvoiceState } = useEditInvoicePageDependencies();
const { can } = useFeatureAccess();

const {
  init,
  invoiceInformations,
  invoiceStatus,
  invoiceLines,
  addLine,
  updateLine,
  removeLine,
  availableBodyParts,
  bodyParts,
  isForfait,
  isReadOnly,
  selectedCountry,
  selectedGarage,
  subtotal,
  totalDegarnissage,
  subTotalWithDegarnissage,
  totalTaxRate,
  totalCommission,
  total,
} = useEditInvoiceState;

const currency = computed(() => selectedCountry.value?.currencySymbol || '€');

const getInvoiceId = () => getSelectedInvoiceGuid() ?? '';

const statusColor = (status?: string) => ({
  pending: 'orange',
  validated: 'success',
  draft: 'grey',
  cancel: 'error',
} as Record<string, string>)[status ?? ''] ?? 'default';

const statusLabel = (status?: string) => ({
  pending: t('invoices.status.awaitingPayment'),
  validated: t('invoices.status.paid'),
  draft: t('invoices.status.draft'),
  cancel: t('invoices.status.cancelled'),
} as Record<string, string>)[status ?? ''] ?? (status ?? '');

const onBackBtnClick = () => router.push('/invoices');
const onEditInvoiceBtnClick = () => router.push('/invoices/edit');
const onViewPdfBtnClick = () => router.push('/invoices/preview');

onMounted(async () => {
  await init(getInvoiceId());
});
</script>

<style scoped>
.items-invoice-container {
  --q-bg: #f4f5fa;
  --q-card: #fff;
  --q-border: #e6e8f0;
  --q-border-strong: #d5d8e3;
  --q-soft: #eef0f4;
  --q-text: #1f2330;
  --q-muted: #6b7080;
  --q-faint: #9a9eae;
  --q-part: rgb(160 165 180 / 12%);

  min-height: 100dvh;
  background: var(--q-bg);
}

.items-invoice-container.is-dark {
  --q-bg: transparent;
  --q-card: rgb(var(--v-theme-surface));
  --q-border: rgb(255 255 255 / 6%);
  --q-border-strong: rgb(255 255 255 / 20%);
  --q-soft: rgb(255 255 255 / 10%);
  --q-text: rgb(255 255 255 / 92%);
  --q-muted: rgb(255 255 255 / 70%);
  --q-faint: rgb(255 255 255 / 50%);
  --q-part: rgb(255 255 255 / 6%);
}

.page-header {
  background: var(--q-card);
  border: 1px solid var(--q-border);
  border-radius: 14px;
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

.header-btn:hover {
  background: var(--q-soft);
}

.header-back {
  background: var(--q-soft) !important;
  color: var(--q-muted);
  box-shadow: none;
}

.section-card {
  background: var(--q-card);
  border-radius: 14px;
  padding: 20px;
  border: 1px solid var(--q-border);
}

.recap-card {
  position: sticky;
  top: 16px;
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
  background: rgb(var(--v-theme-primary), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.totals-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}

.total-final {
  border-top: 1px dashed var(--q-border-strong);
}
</style>
