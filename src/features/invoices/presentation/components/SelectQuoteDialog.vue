<template>
  <v-dialog
    :model-value="modelValue"
    max-width="680"
    scrollable
    @update:model-value="onUpdateModelValue"
  >
    <v-card rounded="xl">
      <v-card-title class="d-flex align-center pa-5 pb-2">
        <div>
          <div class="text-h6 font-weight-bold">
            {{ t('invoices.selectQuote.title') }}
          </div>
          <div class="text-caption text-medium-emphasis">
            {{ t('invoices.selectQuote.subtitle') }}
          </div>
        </div>
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          :disabled="converting"
          @click="close"
        />
      </v-card-title>

      <div class="px-5 pb-3">
        <v-text-field
          v-model="search"
          :placeholder="t('invoices.selectQuote.search')"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
          autofocus
        />
      </div>

      <v-divider />

      <v-card-text class="pa-3 quote-list">
        <div
          v-if="loading"
          class="text-center py-10"
        >
          <v-progress-circular
            indeterminate
            color="primary"
          />
        </div>
        <div
          v-else-if="!filteredQuotes.length"
          class="text-center py-10 text-medium-emphasis"
        >
          <v-icon
            size="40"
            class="mb-2"
          >
            mdi-file-search-outline
          </v-icon>
          <div class="text-body-2">
            {{ search ? t('invoices.selectQuote.noMatch') : t('invoices.selectQuote.noneAccepted') }}
          </div>
        </div>
        <v-list
          v-else
          class="pa-0"
          bg-color="transparent"
        >
          <v-list-item
            v-for="quote in filteredQuotes"
            :key="quote.id"
            class="quote-row mb-2"
            :class="{ 'is-selected': selectedId === quote.id }"
            rounded="lg"
            @click="selectedId = quote.id ?? null"
          >
            <template #prepend>
              <v-avatar
                color="primary"
                variant="tonal"
                size="40"
                class="mr-3"
              >
                <v-icon>mdi-file-document-outline</v-icon>
              </v-avatar>
            </template>
            <v-list-item-title class="font-weight-bold">
              {{ quote.quoteNumber }}
              <span class="text-medium-emphasis font-weight-regular">
                · {{ quote.garage?.name || quote.garageName || t('invoices.selectQuote.noGarage') }}
              </span>
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ vehicleLabel(quote) }} · {{ formatDate(quote.createdAt) }}
            </v-list-item-subtitle>
            <template #append>
              <div class="text-right mr-3">
                <div class="font-weight-bold">
                  {{ formatCurrency(amount(quote)) }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  HT
                </div>
              </div>
              <v-icon
                :color="selectedId === quote.id ? 'primary' : undefined"
                :icon="selectedId === quote.id ? 'mdi-radiobox-marked' : 'mdi-radiobox-blank'"
              />
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <div class="text-caption text-medium-emphasis">
          {{ t('invoices.selectQuote.available', filteredQuotes.length) }}
        </div>
        <v-spacer />
        <v-btn
          variant="text"
          :disabled="converting"
          @click="close"
        >
          {{ t('common.cancel') }}
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :disabled="!selectedId"
          :loading="converting"
          @click="onConfirm"
        >
          {{ t('invoices.selectQuote.create') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatCurrency as formatMoney, formatDate as formatIntlDate } from '@/app/i18n/formatters';
import { useSelectQuoteDialogDependencies } from '@/features/invoices/composition/useSelectQuoteDialogDependencies';
import { QuoteViewModel } from '@/features/quotes/presentation/models/QuoteViewModel';

const { t } = useI18n();
const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'converted', invoiceId: string): void;
  (e: 'error', message: string): void;
}>();

const { useQuoteState } = useSelectQuoteDialogDependencies();
const { init, quotes, convertToInvoice } = useQuoteState;

const search = ref<string | null>('');
const selectedId = ref<string | null>(null);
const loading = ref(false);
const converting = ref(false);

const getStatusCode = (status: unknown): string | undefined => {
  if (!status) return undefined;
  if (typeof status === 'string') return status;
  if (typeof status === 'object' && 'code' in status) return String((status as { code?: string }).code);
  return undefined;
};

// Convertible : accepté et pas encore converti (même règle que la liste des devis)
const isConvertible = (q: QuoteViewModel) =>
  getStatusCode(q.status) === 'accepted' && !q.convertToInvoice;

const amount = (q: QuoteViewModel) => q.totalHt ?? (q.isForfait ? (q.forfaitAmount ?? 0) : 0);
const vehicleLabel = (q: QuoteViewModel) =>
  [q.carImmatriculation, q.carBrand].filter(Boolean).join(' · ') || t('invoices.selectQuote.noVehicle');
const formatCurrency = (v: number) => formatMoney(v);
const formatDate = (d?: string) => (d ? formatIntlDate(d) : '—');

const filteredQuotes = computed(() => {
  const term = (search.value ?? '').trim().toLowerCase();
  return quotes.value
    .filter(isConvertible)
    .filter(q => {
      if (!term) return true;
      return [q.quoteNumber, q.garage?.name, q.garageName, q.carImmatriculation, q.carBrand]
        .some(v => v?.toLowerCase().includes(term));
    });
});

const close = () => emit('update:modelValue', false);
const onUpdateModelValue = (v: boolean) => { if (!converting.value) emit('update:modelValue', v); };

// Convertit le devis choisi puis laisse la page parente ouvrir la facture brouillon
const onConfirm = async () => {
  if (!selectedId.value) return;
  converting.value = true;
  try {
    const invoiceId = await convertToInvoice(selectedId.value);
    emit('converted', invoiceId);
  } catch (e) {
    emit('error', e instanceof Error ? e.message : t('invoices.selectQuote.error'));
  } finally {
    converting.value = false;
  }
};

// Recharge la liste à chaque ouverture pour ne proposer que des devis à jour
watch(() => props.modelValue, async open => {
  if (!open) return;
  search.value = '';
  selectedId.value = null;
  loading.value = true;
  try { await init(); } finally { loading.value = false; }
});
</script>

<style scoped>
.quote-list {
  max-height: 420px;
}

.quote-row {
  border: 1px solid rgba(var(--v-border-color), 0.12);
  cursor: pointer;
}

.quote-row:hover {
  background: rgba(var(--v-theme-primary), 0.05);
}

.quote-row.is-selected {
  border-color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.08);
}
</style>
