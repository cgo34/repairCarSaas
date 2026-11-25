<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-0"
    >
      <!-- HEADER -->
      <div class="d-flex align-start justify-space-between mb-5">
        <div>
          <h1
            class="text-h5 font-weight-bold mb-0"
            style="font-family:'Space Grotesk',sans-serif"
          >
            {{ t('quotes.list.title') }}
          </h1>
          <p class="text-body-2 text-medium-emphasis mb-0">
            {{ t('quotes.list.summary', { month: monthLabel, count: quotes.length }) }}
          </p>
        </div>
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-plus"
          @click="onAddQuote"
        >
          {{ t('quotes.list.newQuote') }}
        </v-btn>
      </div>

      <!-- KPI CARDS -->
      <v-row
        dense
        class="mb-5"
      >
        <v-col
          cols="12"
          sm="6"
          md="3"
        >
          <v-card
            flat
            border
            class="pa-4 h-100 d-flex align-center ga-4"
          >
            <v-avatar
              color="success"
              variant="tonal"
              size="48"
              rounded="lg"
            >
              <v-icon icon="mdi-file-check-outline" />
            </v-avatar>
            <div>
              <div class="stat-label">
                {{ t('quotes.kpi.acceptedAmount', { month: currentMonthShort }) }}
              </div>
              <div class="stat-value">
                {{ formatCurrency(kpiAccepteAmount) }}
              </div>
              <div class="stat-sub">
                {{ t('quotes.kpi.acceptedSub') }}
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col
          cols="12"
          sm="6"
          md="3"
        >
          <v-card
            flat
            border
            class="pa-4 h-100 d-flex align-center ga-4"
          >
            <v-avatar
              color="warning"
              variant="tonal"
              size="48"
              rounded="lg"
            >
              <v-icon icon="mdi-clock-outline" />
            </v-avatar>
            <div>
              <div class="stat-label">
                {{ t('quotes.kpi.pending') }}
              </div>
              <div class="stat-value">
                {{ formatCurrency(kpiEnAttenteAmount) }}
              </div>
              <div class="stat-sub">
                {{ t('quotes.kpi.sentCount', kpiEnAttenteCount) }}
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col
          cols="12"
          sm="6"
          md="3"
        >
          <v-card
            flat
            border
            class="pa-4 h-100 d-flex align-center ga-4"
          >
            <v-avatar
              color="primary"
              variant="tonal"
              size="48"
              rounded="lg"
            >
              <v-icon icon="mdi-check-circle-outline" />
            </v-avatar>
            <div>
              <div class="stat-label">
                {{ t('quotes.kpi.acceptedMonth') }}
              </div>
              <div class="stat-value">
                {{ kpiAccepteCount }}
              </div>
              <div class="stat-sub">
                {{ t('quotes.kpi.signedOrValidated') }}
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col
          cols="12"
          sm="6"
          md="3"
        >
          <v-card
            flat
            border
            class="pa-4 h-100 d-flex align-center ga-4"
            :style="kpiRefuseCount > 0 ? 'border-color: rgb(var(--v-theme-error)) !important;' : ''"
          >
            <v-avatar
              color="error"
              variant="tonal"
              size="48"
              rounded="lg"
            >
              <v-icon icon="mdi-close-circle-outline" />
            </v-avatar>
            <div>
              <div class="stat-label">
                {{ t('quotes.kpi.refused') }}
              </div>
              <div
                class="stat-value"
                :class="kpiRefuseCount > 0 ? 'text-error' : ''"
              >
                {{ kpiRefuseCount }}
              </div>
              <div class="stat-sub">
                {{ kpiRefuseCount > 0 ? t('quotes.kpi.toProcess', { count: kpiRefuseCount }) : t('quotes.kpi.noneRefused') }}
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-card
        variant="flat"
        class="bg-surface border"
      >
        <div class="pa-4 d-flex flex-wrap align-center ga-3">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            :placeholder="t('quotes.list.search')"
            density="compact"
            variant="outlined"
            hide-details
            clearable
            style="max-width: 320px;"
          />
          <v-select
            v-model="activeTab"
            :items="statusOptions"
            density="compact"
            variant="outlined"
            hide-details
            style="max-width: 200px;"
          />
          <v-select
            v-model="garageFilter"
            :items="garageOptions"
            density="compact"
            variant="outlined"
            hide-details
            style="max-width: 200px;"
          />
          <v-select
            v-model="sentFilter"
            :items="sentOptions"
            density="compact"
            variant="outlined"
            hide-details
            style="max-width: 220px;"
          />
          <v-select
            v-model="convertedFilter"
            :items="convertedOptions"
            density="compact"
            variant="outlined"
            hide-details
            style="max-width: 220px;"
          />
          <v-select
            :model-value="activePreset"
            :items="periodOptions"
            density="compact"
            variant="outlined"
            hide-details
            style="max-width: 200px;"
            @update:model-value="applyPreset"
          />
          <template v-if="activePreset === 'custom'">
            <v-text-field
              v-model="dateFrom"
              :label="t('common.period.from')"
              type="date"
              density="compact"
              variant="outlined"
              hide-details
              style="max-width: 160px;"
            />
            <v-text-field
              v-model="dateTo"
              :label="t('common.period.to')"
              type="date"
              density="compact"
              variant="outlined"
              hide-details
              style="max-width: 160px;"
            />
          </template>
          <v-btn
            v-if="hasActiveFilter || activeTab !== 'all' || search || garageFilter !== 'all' || sentFilter !== 'all' || convertedFilter !== 'all'"
            variant="text"
            size="small"
            @click="resetFilters"
          >
            {{ t('common.reset') }}
          </v-btn>
          <v-spacer />
          <v-btn
            variant="outlined"
            prepend-icon="mdi-download-outline"
            :disabled="selectedQuotes.length === 0"
            :loading="downloading"
            @click="onBulkDownload"
          >
            {{ t('common.export') }}
          </v-btn>
        </div>
        <v-divider />

        <!-- TABLE -->
        <v-data-table
          v-model="selectedQuotes"
          :headers="tableHeaders"
          :items="displayedQuotes"
          :sort-by="[{ key: 'createdAt', order: 'desc' }]"
          :items-per-page="25"
          show-select
          item-value="id"
          return-object
          :no-data-text="t('quotes.list.noData')"
          hover
          :row-props="rowProps"
          class="quotes-table"
          :items-per-page-text="t('common.table.itemsPerPage')"
          @click:row="onRowClick"
        >
          <!-- N° DEVIS -->
          <template #item.quoteNumber="{ item }">
            <span
              class="font-weight-medium text-primary"
              style="cursor:pointer; font-family:'Space Grotesk',sans-serif"
              @click="onEditQuote(item.id)"
            >
              {{ item.quoteNumber }}
            </span>
          </template>

          <!-- CLIENT -->
          <template #item.client="{ item }">
            <span class="font-weight-medium">
              {{ item.garage?.name ?? '—' }}
            </span>
          </template>

          <!-- VÉHICULE -->
          <template #item.vehicle="{ item }">
            <span class="text-medium-emphasis text-body-2">
              {{ [item.carBrand, item.carImmatriculation].filter(Boolean).join(' · ') || '—' }}
            </span>
          </template>

          <!-- DATE -->
          <template #item.createdAt="{ item }">
            <span class="text-body-2">{{ formatDateShort(item.createdAt) }}</span>
          </template>

          <!-- TECHNICIEN -->
          <template #item.technician="{ item }">
            <div class="d-flex align-center ga-2">
              <v-avatar
                size="26"
                :color="techColor(item)"
                variant="tonal"
              >
                <span
                  class="text-caption font-weight-bold"
                  style="font-size:10px"
                >
                  {{ techInitials(item) }}
                </span>
              </v-avatar>
              <span class="text-body-2">{{ techShortName(item) }}</span>
            </div>
          </template>

          <!-- MONTANT HT -->
          <template #item.total="{ item }">
            <span
              class="font-weight-medium"
              style="font-family:'Space Grotesk',sans-serif"
            >
              {{ formatCurrency(amount(item)) }}
            </span>
          </template>

          <!-- STATUT -->
          <template #item.status="{ item }">
            <v-chip
              :color="chipColor(item)"
              variant="tonal"
              size="small"
              rounded="pill"
            >
              {{ chipLabel(item) }}
            </v-chip>
          </template>

          <!-- ENVOYÉ -->
          <template #item.sentAt="{ item }">
            <v-chip
              v-if="item.isSent"
              color="primary"
              variant="tonal"
              size="small"
              rounded="pill"
              prepend-icon="mdi-send-check"
            >
              {{ formatDateShort(item.sentAt as unknown as string) }}
            </v-chip>
            <v-chip
              v-else-if="item.sentAt && isOpen(item)"
              color="warning"
              variant="tonal"
              size="small"
              rounded="pill"
              prepend-icon="mdi-send-clock-outline"
            >
              {{ t('quotes.list.modifiedResend') }}
            </v-chip>
            <span
              v-else
              class="text-body-2 text-disabled"
            >
              {{ t('quotes.list.notSent') }}
            </span>
          </template>

          <!-- CONVERTI -->
          <template #item.converted="{ item }">
            <v-avatar
              size="26"
              :color="isConverted(item) ? 'success' : 'default'"
              variant="tonal"
              :title="isConverted(item) ? t('quotes.list.converted') : t('quotes.list.notConverted')"
            >
              <v-icon
                size="16"
                :icon="isConverted(item) ? 'mdi-check' : 'mdi-close'"
              />
            </v-avatar>
          </template>

          <!-- ACTIONS -->
          <template #item.actions="{ item }">
            <v-btn
              v-if="isConverted(item)"
              size="small"
              variant="text"
              icon="mdi-eye-outline"
              :title="t('quotes.actions.view')"
              @click.stop="onViewQuote(item.id)"
            />
            <v-menu v-else>
              <template #activator="{ props }">
                <v-btn
                  size="small"
                  variant="text"
                  icon="mdi-dots-vertical"
                  v-bind="props"
                />
              </template>
              <v-list
                density="compact"
                min-width="200"
              >
                <!-- Envoi impossible sans élément : montant nul = devis vide -->
                <v-list-item
                  v-if="amount(item) > 0"
                  prepend-icon="mdi-send-outline"
                  :title="t('quotes.actions.send')"
                  @click="onSendBtnClick(item.id)"
                />
                <v-list-item
                  prepend-icon="mdi-file-pdf-box"
                  :title="t('quotes.actions.viewPdf')"
                  @click="onViewPdfBtnClick(item.id)"
                />
                <v-list-item
                  v-if="!isLocked(item)"
                  prepend-icon="mdi-pencil-outline"
                  :title="t('quotes.actions.edit')"
                  @click="onEditQuote(item.id)"
                />
                <v-list-item
                  v-if="!isLocked(item)"
                  prepend-icon="mdi-format-list-bulleted-square"
                  :title="t('quotes.actions.addItems')"
                  @click="onEditItems(item.id)"
                />
                <v-divider
                  v-if="canAccept(item) || canRefuse(item) || canConvert(item)"
                  class="my-1"
                />
                <v-list-item
                  v-if="canAccept(item)"
                  prepend-icon="mdi-check-circle-outline"
                  :title="t('quotes.actions.markAccepted')"
                  @click="onSetStatus(item.id, 'accepted')"
                />
                <v-list-item
                  v-if="canRefuse(item)"
                  prepend-icon="mdi-close-circle-outline"
                  :title="t('quotes.actions.markRefused')"
                  @click="onSetStatus(item.id, 'refused')"
                />
                <v-list-item
                  v-if="canConvert(item)"
                  prepend-icon="mdi-receipt-text-check-outline"
                  :title="t('quotes.actions.convertToInvoice')"
                  @click="onConvertToInvoice(item.id)"
                />
                <template v-if="!isLocked(item)">
                  <v-divider class="my-1" />
                  <v-list-item
                    prepend-icon="mdi-delete-outline"
                    :title="t('common.delete')"
                    base-color="error"
                    @click="onDeleteBtnClick(item.id)"
                  />
                </template>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </MainLayout>

  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    timeout="4000"
    location="bottom right"
  >
    {{ snackbar.message }}
  </v-snackbar>

  <ConfirmDialog
    ref="deleteQuoteConfirmDialogRef"
    :title="t('quotes.delete.title')"
    :message="t('quotes.delete.message')"
    :confirm-label="t('common.delete')"
    :cancel-label="t('common.cancel')"
    type="warning"
    @confirm="onConfirmDeleteQuote"
  />
</template>

<script setup lang="ts">
import { setSelectedInvoiceGuid } from '@/features/invoices/presentation/utils/invoiceSelection';
import { useQuotesPageDependencies } from '@/features/quotes/composition/useQuotesPageDependencies';
import { OrganizationProfileDto } from '@/features/organizations/application/dtos/OrganizationProfileDto';
import MainLayout from '@/app/layouts/MainLayout.vue';
import { ConfirmDialogExposed } from '@/shared/presentation/ui/components/ConfirmDialog';
import ConfirmDialog from '@/shared/presentation/ui/components/ConfirmDialog.vue';
import { usePeriodFilter } from '@/shared/presentation/composables/usePeriodFilter';
import { LineItemMapper } from '@/features/lineItems/presentation/mappers/LineItemMapper';
import { QuoteMapper } from '@/features/quotes/presentation/mappers/QuoteMapper';
import { setSelectedQuoteGuid } from '@/features/quotes/presentation/utils/quoteSelection';
import { QuoteViewModel } from '@/features/quotes/presentation/models/QuoteViewModel';
import JSZip from 'jszip';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { capitalize, formatCurrency, formatDate } from '@/app/i18n/formatters';
import { EMPTY_QUOTE_ERROR } from '@/features/quotes/application/useCases/SendQuoteUseCase';

  const { authState, useQuoteState, generatePdfUseCase, organizationProfileUseCase } = useQuotesPageDependencies();

const router = useRouter();
const { t } = useI18n();
const { init, quotes, deleteQuote, sendQuote, setStatus, convertToInvoice } = useQuoteState;

const {
  dateFrom, dateTo, activePreset, datePresets,
  filteredItems: periodFiltered,
  applyPreset, clearFilter, hasActiveFilter,
} = usePeriodFilter({ items: quotes, getDate: quote => quote.createdAt });

const selectedQuotes = ref<QuoteViewModel[]>([]);
const downloading = ref(false);
const search = ref<string | null>('');
const garageFilter = ref('all');
const activeTab = ref<'all' | 'draft' | 'pending' | 'accepted' | 'refused'>('all');
const sentFilter = ref<'all' | 'sent' | 'notSent'>('all');
const convertedFilter = ref<'all' | 'converted' | 'notConverted'>('all');
const sentOptions = computed(() => [
  { title: t('quotes.list.sent.all'), value: 'all' },
  { title: t('quotes.list.sent.sent'), value: 'sent' },
  { title: t('quotes.list.sent.notSent'), value: 'notSent' },
]);
const convertedOptions = computed(() => [
  { title: t('quotes.list.convertedFilter.all'), value: 'all' },
  { title: t('quotes.list.convertedFilter.converted'), value: 'converted' },
  { title: t('quotes.list.convertedFilter.notConverted'), value: 'notConverted' },
]);
const _company = ref<OrganizationProfileDto | null>(null);
const deleteQuoteConfirmDialogRef = ref<ConfirmDialogExposed>();
const _quoteIdToDelete = ref<string | undefined>();

const snackbar = reactive({ show: false, message: '', color: 'success' });
const showSnack = (message: string, color = 'success') => {
  snackbar.message = message; snackbar.color = color; snackbar.show = true;
};

const getStatusCode = (status: unknown): string | undefined => {
  if (!status) return undefined;
  if (typeof status === 'string') return status;
  if (typeof status === 'object' && 'code' in status)
    return String((status as { code?: string }).code);
  return undefined;
};

// --- Règles métier d'affichage (cycle de vie d'un devis) ---
// Brouillon -> Envoyé -> Accepté/Refusé -> Converti en facture (verrouillé)
// Accepté (ou statut équivalent, y compris converti)
const isAccepted    = (q: QuoteViewModel) => ['accepted', 'signed', 'validated', 'invoiced'].includes(getStatusCode(q.status) ?? '');
// 'invoiced' is a legacy status: conversion is now tracked by convertToInvoice
const isConverted   = (q: QuoteViewModel) => Boolean(q.convertToInvoice) || getStatusCode(q.status) === 'invoiced';
// Convertible : accepté et pas encore converti
const canConvert    = (q: QuoteViewModel) => isAccepted(q) && !isConverted(q);
// Accepter / refuser : uniquement un devis déjà envoyé (la décision vient du client)
const canAccept     = (q: QuoteViewModel) => Boolean(q.isSent) && !isAccepted(q) && !isConverted(q);
const canRefuse     = (q: QuoteViewModel) => Boolean(q.isSent) && !isRefused(q) && !isConverted(q);
const isRefused     = (q: QuoteViewModel) => ['refused', 'cancel'].includes(getStatusCode(q.status) ?? '');
// Ouvert : ni accepté ni refusé (donc brouillon ou en attente de réponse)
const isOpen        = (q: QuoteViewModel) => !isAccepted(q) && !isRefused(q);
const isDraft       = (q: QuoteViewModel) => isOpen(q) && !q.isSent;
const isSentPending = (q: QuoteViewModel) => isOpen(q) && Boolean(q.isSent);
// Verrouillé : plus de modification, ajout d'éléments ni suppression
const isLocked      = (q: QuoteViewModel) => isAccepted(q) || isConverted(q);
const isThisMonth   = (q: QuoteViewModel) => {
  if (!q.createdAt) return false;
  const d = new Date(q.createdAt);
  return d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear();
};

const amount = (q: QuoteViewModel) => q.totalHt ?? (q.isForfait ? (q.forfaitAmount ?? 0) : 0);

const kpiAccepteAmount   = computed(() => quotes.value.filter(q => isAccepted(q) && isThisMonth(q)).reduce((s, q) => s + amount(q), 0));
const kpiAccepteCount    = computed(() => quotes.value.filter(q => isAccepted(q) && isThisMonth(q)).length);
const kpiEnAttenteAmount = computed(() => quotes.value.filter(isSentPending).reduce((s, q) => s + amount(q), 0));
const kpiEnAttenteCount  = computed(() => quotes.value.filter(isSentPending).length);
const kpiRefuseCount     = computed(() => quotes.value.filter(isRefused).length);

const tabSource = computed(() => hasActiveFilter.value ? periodFiltered.value : quotes.value);

const tabs = computed<{ key: typeof activeTab.value; label: string; count: number }[]>(() => [
  { key: 'all',      label: t('quotes.list.tabs.all'), count: tabSource.value.length },
  { key: 'draft',    label: t('quotes.list.tabs.draft'), count: tabSource.value.filter(isDraft).length },
  { key: 'pending',  label: t('quotes.list.tabs.pending'), count: tabSource.value.filter(isSentPending).length },
  { key: 'accepted', label: t('quotes.list.tabs.accepted'), count: tabSource.value.filter(isAccepted).length },
  { key: 'refused',  label: t('quotes.list.tabs.refused'), count: tabSource.value.filter(isRefused).length },
]);

const quoteGarageName = (q: QuoteViewModel) => q.garage?.name ?? '';

const statusOptions = computed(() => tabs.value.map(tab => ({ title: `${tab.key === 'all' ? t('quotes.list.allStatuses') : tab.label} · ${tab.count}`, value: tab.key })));
const garageOptions = computed(() => [
  { title: t('quotes.list.allGarages'), value: 'all' },
  ...[...new Set(quotes.value.map(quoteGarageName).filter(Boolean))].sort().map(name => ({ title: name, value: name })),
]);
const periodOptions = computed(() => [
  ...datePresets.map(preset => ({ title: preset.key === 'all' ? t('common.period.allDates') : preset.label, value: preset.key })),
  { title: t('common.period.custom'), value: 'custom' as const },
]);

const resetFilters = () => {
  search.value = '';
  activeTab.value = 'all';
  garageFilter.value = 'all';
  sentFilter.value = 'all';
  convertedFilter.value = 'all';
  clearFilter();
};

const matchesSearch = (q: QuoteViewModel) => {
  const term = (search.value ?? '').trim().toLowerCase();
  if (!term) return true;
  const haystack = [
    q.quoteNumber,
    quoteGarageName(q),
    q.carBrand,
    q.carImmatriculation,
    techFirstName(q),
    techLastName(q),
  ].filter(Boolean).join(' ').toLowerCase();
  return haystack.includes(term);
};

const displayedQuotes = computed(() => {
  const src = tabSource.value.filter(q =>
    matchesSearch(q)
    && (garageFilter.value === 'all' || quoteGarageName(q) === garageFilter.value)
    && (sentFilter.value === 'all' || Boolean(q.isSent) === (sentFilter.value === 'sent'))
    && (convertedFilter.value === 'all' || isConverted(q) === (convertedFilter.value === 'converted')));
  switch (activeTab.value) {
    case 'draft':    return src.filter(isDraft);
    case 'pending':  return src.filter(isSentPending);
    case 'accepted': return src.filter(isAccepted);
    case 'refused':  return src.filter(isRefused);
    default:         return src;
  }
});

const TECH_COLORS = ['#2B54E0','#15915F','#F5871F','#D8443A','#9AA2B1'];
type TechSource = Pick<QuoteViewModel, 'assignedMember'>;
const techFirstName = (item: TechSource) => item.assignedMember?.users?.first_name ?? '';
const techLastName  = (item: TechSource) => item.assignedMember?.users?.last_name  ?? '';
const techInitials  = (item: TechSource) => `${techFirstName(item)[0] ?? ''}${techLastName(item)[0] ?? ''}`.toUpperCase() || '?';
const techShortName = (item: TechSource) => {
  const f = techFirstName(item);
  const l = techLastName(item);
  if (!f && !l) return '—';
  return `${f}${l ? ' ' + l[0] + '.' : ''}`;
};
const techColor = (item: TechSource) => {
  const key = techInitials(item);
  const hash = key.charCodeAt(0) + (key.charCodeAt(1) || 0);
  return TECH_COLORS[hash % TECH_COLORS.length];
};

const chipInfo = (q: QuoteViewModel): { label: string; color: string } => {
  if (isRefused(q))     return { label: t('quotes.status.refused'), color: 'error'     };
  if (isAccepted(q)) {
    return { label: t('quotes.status.accepted'), color: 'success' };
  }
  if (isSentPending(q)) return { label: t('quotes.status.pending'), color: 'warning' };
  return { label: t('quotes.status.draft'), color: 'default' };
};
const chipLabel    = (q: QuoteViewModel) => chipInfo(q).label;
const chipColor    = (q: QuoteViewModel) => chipInfo(q).color;

const formatDateShort = (d?: string) => {
  if (!d) return '—';
  return formatDate(d, { day: 'numeric', month: 'long' });
};

const now = new Date();
const monthLabel        = computed(() => capitalize(formatDate(now, { month: 'long', year: 'numeric' })));
const currentMonthShort = computed(() => formatDate(now, { month: 'long' }).toLowerCase());

const tableHeaders = computed(() => [
  { title: t('quotes.list.headers.quoteNumber'),   key: 'quoteNumber', sortable: true  },
  { title: t('quotes.list.headers.client'),     key: 'client',      sortable: false },
  { title: t('quotes.list.headers.vehicle'),   key: 'vehicle',     sortable: false },
  { title: t('quotes.list.headers.date'),       key: 'createdAt',   sortable: true  },
  { title: t('quotes.list.headers.technician'), key: 'technician',  sortable: false },
  { title: t('quotes.list.headers.totalExclTax'), key: 'total',       align: 'end' as const, sortable: true },
  { title: t('quotes.list.headers.sent'),     key: 'sentAt',      sortable: false },
  { title: t('quotes.list.headers.status'),     key: 'status',      sortable: false },
  { title: t('quotes.list.headers.converted'), key: 'converted',   sortable: false, align: 'center' as const },
  { title: '',           key: 'actions',     sortable: false },
]);

const onAddQuote        = () => router.push('/quotes/new');
const openQuote = (id: string, path: string) => {
  setSelectedQuoteGuid(id);
  router.push(path);
};
const onEditQuote = (id?: string) => {
  if (id) openQuote(id, '/quotes/edit');
};
const onEditItems = (id?: string) => {
  if (id) openQuote(id, '/quotes/edit/items');
};
const onViewQuote = (id?: string) => {
  if (id) openQuote(id, '/quotes/view');
};
const onViewPdfBtnClick = (id?: string) => {
  if (id) openQuote(id, '/quotes/preview');
};
const rowProps = () => ({ style: 'cursor: pointer' });
const onRowClick = (e: Event, { item }: { item: QuoteViewModel }) => {
  if ((e.target as HTMLElement).closest('.v-selection-control, button, a')) return;
  if (isLocked(item)) onViewQuote(item.id);
  else onEditQuote(item.id);
};
const onDeleteBtnClick  = (id?: string) => { if (!id) return; _quoteIdToDelete.value = id; deleteQuoteConfirmDialogRef.value?.open(); };
const onConfirmDeleteQuote = () => { if (_quoteIdToDelete.value) deleteQuote(_quoteIdToDelete.value); };

const onSendBtnClick = async (quoteId?: string) => {
  if (!quoteId) return;
  try {
    await sendQuote(quoteId);
    showSnack(t('quotes.messages.sent'));
  } catch (e) {
    showSnack(e instanceof Error && e.message === EMPTY_QUOTE_ERROR ? t('quotes.messages.emptyQuote') : t('quotes.messages.sendError'), 'error');
  }
};

const onSetStatus = async (quoteId: string | undefined, statusCode: 'accepted' | 'refused') => {
  if (!quoteId) return;
  try {
    await setStatus(quoteId, statusCode);
    showSnack(statusCode === 'accepted' ? t('quotes.messages.markedAccepted') : t('quotes.messages.markedRefused'));
  } catch {
    showSnack(t('quotes.messages.statusError'), 'error');
  }
};

const onConvertToInvoice = async (quoteId?: string) => {
  if (!quoteId) return;
  try {
    const invoiceId = await convertToInvoice(quoteId);
    showSnack(t('quotes.messages.converted'));
    setSelectedInvoiceGuid(invoiceId);
    router.push('/invoices/edit');
  } catch {
    showSnack(t('quotes.messages.convertError'), 'error');
  }
};

const onBulkDownload = async () => {
  if (!selectedQuotes.value.length) return;
  downloading.value = true;
  try {
    const zip = new JSZip();
    let success = 0;
    for (const quote of selectedQuotes.value) {
      try {
        const dto = QuoteMapper.viewToDto(quote);
        const lines = (quote.lineItems ?? []).map(LineItemMapper.viewToDto);
        const url = await generatePdfUseCase.execute(dto, lines, _company.value);
        zip.file(`devis-${quote.quoteNumber}.pdf`, await (await fetch(url)).blob());
        URL.revokeObjectURL(url);
        success++;
      } catch (e) { console.error(`Erreur PDF devis ${quote.quoteNumber}:`, e); }
    }
    if (success === 0) { showSnack(t('quotes.messages.noPdf'), 'error'); return; }
    const link = document.createElement('a');
    link.href = URL.createObjectURL(await zip.generateAsync({ type: 'blob' }));
    link.download = `devis_${new Date().toISOString().split('T')[0]}.zip`;
    link.click();
    URL.revokeObjectURL(link.href);
    showSnack(t('quotes.messages.downloaded', success));
    selectedQuotes.value = [];
  } finally { downloading.value = false; }
};

onMounted(async () => {
  const organizationId = authState.userContext?.value?.organization?.id;
  await Promise.all([
    init(),
    organizationId ? organizationProfileUseCase.getProfile(organizationId).then(c => { _company.value = c; }) : Promise.resolve(),
  ]);
});
</script>

<style scoped>

.quotes-table :deep(thead th) {
  font-size: 0.7rem !important;
  font-weight: 600 !important;
  letter-spacing: 0.06em !important;
  text-transform: uppercase !important;
  color: rgb(var(--v-theme-lightText)) !important;
}

</style>
