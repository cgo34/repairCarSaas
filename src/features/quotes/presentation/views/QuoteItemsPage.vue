<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-0 pt-4 items-quote-container"
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
          <div class="d-flex flex-column">
            <span class="text-h6 font-weight-bold">
              Devis n° {{ quoteInformations.number || '' }}
            </span>
          </div>
          <v-chip
            v-if="quoteInformations.status"
            :color="statusColor(quoteInformations.status?.code, quoteInformations.isSent)"
            size="small"
            variant="tonal"
            rounded="pill"
          >
            {{ statusLabel(quoteInformations.status?.code, quoteInformations.isSent) }}
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
            Voir le PDF
          </v-btn>
          <v-btn
            variant="outlined"
            height="40"
            class="px-5 header-btn"
            prepend-icon="mdi-pencil-outline"
            @click="onEditQuoteBtnClick"
          >
            Modifier le devis
          </v-btn>
        </div>
      </div>

      <v-row class="px-3 pb-6">
        <v-col
          cols="12"
          md="8"
        >
          <DocumentItemsPanel
            title="Éléments du devis"
            forfait-message="Ce devis est au forfait : aucun élément détaillé n'est nécessaire."
            :lines="quoteLines"
            :body-parts="bodyParts"
            :available-body-parts="availableBodyParts"
            :is-forfait="isForfait"
            :is-read-only="isReadOnly"
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
              <span class="text-subtitle-1 font-weight-bold">Récapitulatif</span>
            </div>

            <div class="totals-list">
              <div class="total-row">
                <span class="text-body-2 text-medium-emphasis">Total H.T</span>
                <span class="text-body-2 font-weight-bold">
                  {{ regionManager.formatNumber(subtotal) }} {{ currency }}
                </span>
              </div>
              <template v-if="!isForfait">
                <div class="total-row">
                  <span class="text-body-2 text-medium-emphasis">Total dégarnissage</span>
                  <span class="text-body-2 font-weight-bold">
                    {{ regionManager.formatNumber(totalDegarnissage) }} {{ currency }}
                  </span>
                </div>
                <div class="total-row">
                  <span class="text-body-2 text-medium-emphasis">H.T + Dégarnissage</span>
                  <span class="text-body-2 font-weight-bold">
                    {{ regionManager.formatNumber(subTotalWithDegarnissage) }} {{ currency }}
                  </span>
                </div>
              </template>
              <div class="total-row">
                <span class="text-body-2 text-medium-emphasis">TVA ({{ selectedCountry?.taxRate || 0 }}%)</span>
                <span class="text-body-2 font-weight-bold">
                  {{ regionManager.formatNumber(totalTaxRate) }} {{ currency }}
                </span>
              </div>
              <div
                v-if="selectedGarage?.percentageCommission"
                class="total-row text-orange"
              >
                <span class="text-body-2">Commission ({{ selectedGarage.percentageCommission }}%)</span>
                <span class="text-body-2 font-weight-bold">
                  {{ regionManager.formatNumber(totalCommission) }} {{ currency }}
                </span>
              </div>
              <div class="total-row total-final mt-2 pt-3">
                <span class="text-subtitle-2 font-weight-bold">Total TTC</span>
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
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTheme } from 'vuetify';
import MainLayout from '@/app/layouts/MainLayout.vue';
import DocumentItemsPanel from '@/features/lineItems/presentation/components/DocumentItemsPanel.vue';
import { useEditQuotePageDependencies } from '@/features/quotes/composition/useEditQuotePageDependencies';
import { getSelectedQuoteGuid } from '@/features/quotes/presentation/utils/quoteSelection';

const router = useRouter();
const theme = useTheme();
const isDark = computed(() => theme.current.value.dark);
const { regionManager, useEditQuoteState } = useEditQuotePageDependencies();

const {
  init,
  quoteInformations,
  quoteLines,
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
} = useEditQuoteState;

const currency = computed(() => selectedCountry.value?.currencySymbol || '€');

const OPEN_STATUS_CODES = ['draft', 'pending', ''];

const statusColor = (code?: string, isSent?: boolean) => {
  if (OPEN_STATUS_CODES.includes(code ?? '')) return isSent ? 'warning' : 'default';
  switch (code) {
    case 'accepted': return 'success';
    case 'refused':
    case 'cancelled': return 'error';
    case 'invoiced': return 'blue';
    default: return 'default';
  }
};

const statusLabel = (code?: string, isSent?: boolean) => {
  if (OPEN_STATUS_CODES.includes(code ?? '')) return isSent ? 'En attente' : 'Brouillon';
  switch (code) {
    case 'accepted': return 'Accepté';
    case 'refused': return 'Refusé';
    case 'cancelled': return 'Annulé';
    case 'invoiced': return 'Facturé';
    default: return code ?? '';
  }
};

const onBackBtnClick = () => router.push('/quotes');
const onEditQuoteBtnClick = () => router.push('/quotes/edit');
const onViewPdfBtnClick = () => router.push('/quotes/preview');

onMounted(async () => {
  const quoteId = getSelectedQuoteGuid();
  if (!quoteId) {
    router.replace('/quotes');
    return;
  }
  await init(quoteId);
});
</script>

<style scoped>
.items-quote-container {
  --q-bg: #f4f5fa;
  --q-card: #fff;
  --q-border: #e6e8f0;
  --q-border-strong: #d5d8e3;
  --q-soft: #eef0f4;
  --q-text: #1f2330;
  --q-muted: #6b7080;
  --q-faint: #9a9eae;
  --q-part: rgba(160, 165, 180, 0.12);
  min-height: 100dvh;
  background: var(--q-bg);
}

.items-quote-container.is-dark {
  --q-bg: transparent;
  --q-card: rgb(var(--v-theme-surface));
  --q-border: rgba(255, 255, 255, 0.06);
  --q-border-strong: rgba(255, 255, 255, 0.2);
  --q-soft: rgba(255, 255, 255, 0.1);
  --q-text: rgba(255, 255, 255, 0.92);
  --q-muted: rgba(255, 255, 255, 0.7);
  --q-faint: rgba(255, 255, 255, 0.5);
  --q-part: rgba(255, 255, 255, 0.06);
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
  background: rgba(var(--v-theme-primary), 0.1);
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
