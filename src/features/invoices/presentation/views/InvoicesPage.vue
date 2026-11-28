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
            {{ t('invoices.list.title') }}
          </h1>
          <p class="text-body-2 text-medium-emphasis mb-0">
            {{ t('invoices.list.summary', { month: monthLabel, count: invoices.length }) }}
          </p>
        </div>
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-plus"
          :disabled="invoicesLimitReached"
          @click="onAddInvoice"
        >
          {{ t('invoices.list.newInvoice') }}
        </v-btn>
      </div>

      <PlanLimitAlert
        class="mb-5"
        limit-key="max_invoices_per_month"
        kind="invoices"
        :used="invoicesUsed"
      />

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
              <v-icon icon="mdi-cash-check" />
            </v-avatar>
            <div>
              <div class="stat-label">
                {{ t('invoices.kpi.collectedAmount', { month: currentMonthShort }) }}
              </div>
              <div class="stat-value">
                {{ formatCurrency(kpiCaEncaisse) }}
              </div>
              <div class="stat-sub">
                {{ t('invoices.kpi.collectedSub') }}
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
                {{ t('invoices.kpi.pending') }}
              </div>
              <div class="stat-value">
                {{ formatCurrency(kpiEnAttente) }}
              </div>
              <div class="stat-sub">
                {{ t('invoices.kpi.sentCount', kpiEnAttenteCount) }}
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
                {{ t('invoices.kpi.paidMonth') }}
              </div>
              <div class="stat-value">
                {{ kpiPayees }}
              </div>
              <div class="stat-sub">
                {{ t('invoices.kpi.settled') }}
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
            :style="kpiLateInvoices.length > 0 ? 'border-color: rgb(var(--v-theme-error)) !important;' : ''"
          >
            <v-avatar
              color="error"
              variant="tonal"
              size="48"
              rounded="lg"
            >
              <v-icon icon="mdi-alert-circle-outline" />
            </v-avatar>
            <div>
              <div class="stat-label">
                {{ t('invoices.kpi.late') }}
              </div>
              <div
                class="stat-value"
                :class="kpiLateInvoices.length > 0 ? 'text-error' : ''"
              >
                {{ formatCurrency(kpiEnRetardMontant) }}
              </div>
              <div class="stat-sub">
                {{ kpiLateInvoices.length > 0 ? t('invoices.kpi.toChase', { count: kpiLateInvoices.length }) : t('invoices.kpi.noneLate') }}
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
            :placeholder="t('invoices.list.search')"
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
            v-if="can('invoice_email_sending')"
            v-model="sentFilter"
            :items="sentOptions"
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
            v-if="hasActiveFilter || activeTab !== 'all' || search || garageFilter !== 'all' || sentFilter !== 'all'"
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
            :disabled="selectedInvoices.length === 0"
            :loading="downloading"
            @click="onBulkDownload"
          >
            {{ t('common.export') }}
          </v-btn>
        </div>
        <v-divider />
        <!-- TABLE -->
        <v-data-table
          v-model="selectedInvoices"
          :headers="tableHeaders"
          :items="displayedInvoices"
          :sort-by="[{ key: 'createdAt', order: 'desc' }]"
          show-select
          item-value="id"
          return-object
          :no-data-text="t('invoices.list.noData')"
          :items-per-page-text="t('common.table.itemsPerPage')"
          hover
          class="invoices-table"
          @click:row="onRowClick"
        >
          <!-- N° FACTURE -->
          <template #item.invoiceNumber="{ item }">
            <span
              class="font-weight-medium text-primary"
              style="cursor:pointer; font-family:'Space Grotesk',sans-serif"
              @click="onEditInvoice(item.id)"
            >
              {{ item.invoiceNumber }}
            </span>
          </template>

          <!-- CLIENT -->
          <template #item.client="{ item }">
            <div class="font-weight-medium">
              {{ item.garage?.name ?? item.garageName ?? '—' }}
            </div>
            <div
              v-if="item.garage?.zip_code || item.garage?.city"
              class="text-caption text-medium-emphasis"
            >
              {{ [item.garage?.zip_code, item.garage?.city].filter(Boolean).join(' ') }}
            </div>
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

          <!-- MONTANT TTC -->
          <template #item.total="{ item }">
            <span
              class="font-weight-medium"
              style="font-family:'Space Grotesk',sans-serif"
            >
              {{ formatCurrency(item.totalHt ?? (item.isForfait ? (item.forfaitAmount ?? 0) : 0)) }}
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

          <!-- ENVOYÉE -->
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
            <span
              v-else
              class="text-body-2 text-disabled"
            >
              {{ t('invoices.list.notSent') }}
            </span>
          </template>

          <!-- ACTIONS -->
          <template #item.actions="{ item }">
            <v-menu>
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
                <!-- Pas de suppression : une facture est un document comptable -->
                <v-list-item
                  prepend-icon="mdi-send-outline"
                  :title="t('invoices.actions.send')"
                  :subtitle="can('invoice_email_sending') ? undefined : t('common.featureGate.premiumTitle')"
                  :disabled="!can('invoice_email_sending')"
                  @click="onSendBtnClick(item.id)"
                />
                <v-list-item
                  prepend-icon="mdi-file-pdf-box"
                  :title="t('invoices.actions.viewPdf')"
                  @click="onViewPdfBtnClick(item.id)"
                />
                <v-list-item
                  :prepend-icon="isDraft(item) ? 'mdi-pencil-outline' : 'mdi-eye-outline'"
                  :title="isDraft(item) ? t('invoices.actions.edit') : t('invoices.actions.view')"
                  @click="isDraft(item) ? onEditInvoice(item.id) : onViewInvoice(item.id)"
                />
                <v-list-item
                  v-if="canMarkPaid(item)"
                  prepend-icon="mdi-cash-check"
                  :title="t('invoices.actions.markPaid')"
                  @click="onMarkPaid(item.id)"
                />
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
</template>

<script setup lang="ts">
import { setSelectedInvoiceGuid } from '@/features/invoices/presentation/utils/invoiceSelection';
import { useInvoicesPageDependencies } from '@/features/invoices/composition/useInvoicesPageDependencies';
import { OrganizationProfileDto } from '@/features/organizations/application/dtos/OrganizationProfileDto';
import MainLayout from '@/app/layouts/MainLayout.vue';
import PlanLimitAlert from '@/features/featureAccess/presentation/components/PlanLimitAlert.vue';
import { usePlanUsage } from '@/features/featureAccess/composition/usePlanUsage';
import { usePeriodFilter } from '@/shared/presentation/composables/usePeriodFilter';
import { InvoiceMapper } from '@/features/invoices/presentation/mappers/InvoiceMapper';
import { LineItemMapper } from '@/features/lineItems/presentation/mappers/LineItemMapper';
import { InvoiceViewModel } from '@/features/invoices/presentation/models/InvoiceViewModel';
import JSZip from 'jszip';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { capitalize, formatCurrency, formatDate } from '@/app/i18n/formatters';
import { useRouter } from 'vue-router';
import { useFeatureAccess } from '@/features/featureAccess/composition/useFeatureAccess';

  const { authState, useInvoiceState, generatePdfUseCase, organizationProfileUseCase, sendInvoiceUseCase } = useInvoicesPageDependencies();
const { can, isLimitReached } = useFeatureAccess();

const router = useRouter();
const { t } = useI18n();
const { init, invoices, markAsPaid } = useInvoiceState;

const {
  dateFrom, dateTo, activePreset, datePresets,
  filteredItems: periodFiltered,
  applyPreset, clearFilter, hasActiveFilter,
} = usePeriodFilter({ items: invoices, getDate: invoice => invoice.createdAt });

const selectedInvoices = ref<InvoiceViewModel[]>([]);
const downloading = ref(false);
const search = ref<string | null>('');
const garageFilter = ref('all');
type InvoiceTab = 'all' | 'pending' | 'paid' | 'late';
const activeTab = ref<InvoiceTab>('all');
const sentFilter = ref<'all' | 'sent' | 'notSent'>('all');
const sentOptions = computed(() => [
  { title: t('invoices.list.sent.all'), value: 'all' },
  { title: t('invoices.list.sent.sent'), value: 'sent' },
  { title: t('invoices.list.sent.notSent'), value: 'notSent' },
]);
const _company = ref<OrganizationProfileDto | null>(null);

const snackbar = reactive({ show: false, message: '', color: 'success' });
const showSnack = (message: string, color = 'success') => {
  snackbar.message = message; snackbar.color = color; snackbar.show = true;
};

// ─── Helpers statut ───────────────────────────────────────────
const getStatusCode = (status: unknown): string | undefined => {
  if (!status) return undefined;
  if (typeof status === 'string') return status;
  if (typeof status === 'object' && 'code' in status)
    return String((status as { code?: string }).code);
  return undefined;
};

const isDraft  = (inv: InvoiceViewModel) => getStatusCode(inv.status) === 'draft';
const isPaid   = (inv: InvoiceViewModel) => ['paid','validated','accepted','signed'].includes(getStatusCode(inv.status) ?? '');
const isCancelled = (inv: InvoiceViewModel) => ['cancel', 'cancelled'].includes(getStatusCode(inv.status) ?? '');
const isSentUnpaid = (inv: InvoiceViewModel) => inv.isSent && !isPaid(inv);
const isLate   = (inv: InvoiceViewModel) => {
  if (!inv.isSent || isPaid(inv) || isCancelled(inv) || !inv.sentAt) return false;
  return (Date.now() - new Date(inv.sentAt).getTime()) / 86_400_000 > 30;
};
// Un brouillon n'est pas encore « en attente de paiement »
const isPending = (inv: InvoiceViewModel) => !isDraft(inv) && !isPaid(inv) && !isCancelled(inv) && !isLate(inv);
const canMarkPaid = (inv: InvoiceViewModel) => !isDraft(inv) && !isPaid(inv) && !isCancelled(inv);
const isThisMonth = (inv: InvoiceViewModel) => {
  if (!inv.createdAt) return false;
  const d = new Date(inv.createdAt);
  return d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear();
};

// ─── KPIs ─────────────────────────────────────────────────────
const amount = (inv: InvoiceViewModel) => inv.totalHt ?? (inv.isForfait ? (inv.forfaitAmount ?? 0) : 0);

const kpiCaEncaisse     = computed(() => invoices.value.filter(inv => isPaid(inv) && isThisMonth(inv)).reduce((s, i) => s + amount(i), 0));
const kpiEnAttente      = computed(() => invoices.value.filter(isSentUnpaid).reduce((s, i) => s + amount(i), 0));
const kpiEnAttenteCount = computed(() => invoices.value.filter(isSentUnpaid).length);
const kpiPayees         = computed(() => invoices.value.filter(inv => isPaid(inv) && isThisMonth(inv)).length);
const kpiLateInvoices   = computed(() => invoices.value.filter(isLate));
const kpiEnRetardMontant= computed(() => kpiLateInvoices.value.reduce((s, i) => s + amount(i), 0));

// ─── Onglets ──────────────────────────────────────────────────
const tabSource = computed(() => hasActiveFilter.value ? periodFiltered.value : invoices.value);

const tabs = computed<{ key: InvoiceTab; label: string; count: number }[]>(() => [
  { key: 'all',     label: t('invoices.list.tabs.all'), count: tabSource.value.length },
  { key: 'pending', label: t('invoices.list.tabs.pending'), count: tabSource.value.filter(isPending).length },
  { key: 'paid',  label: t('invoices.list.tabs.paid'), count: tabSource.value.filter(isPaid).length },
  { key: 'late',  label: t('invoices.list.tabs.late'), count: tabSource.value.filter(isLate).length },
]);

const statusOptions = computed(() => tabs.value.map(tab => ({ title: `${tab.key === 'all' ? t('invoices.list.allStatuses') : tab.label} · ${tab.count}`, value: tab.key })));
const periodOptions = computed(() => [
  ...datePresets.map(preset => ({ title: preset.key === 'all' ? t('common.period.allDates') : preset.label, value: preset.key })),
  { title: t('common.period.custom'), value: 'custom' as const },
]);

const invoiceGarageName = (inv: InvoiceViewModel) => inv.garage?.name ?? inv.garageName ?? '';

const garageOptions = computed(() => [
  { title: t('invoices.list.allGarages'), value: 'all' },
  ...[...new Set(invoices.value.map(invoiceGarageName).filter(Boolean))].sort().map(name => ({ title: name, value: name })),
]);

const resetFilters = () => {
  garageFilter.value = 'all';
  sentFilter.value = 'all';
  activeTab.value = 'all';
  clearFilter();
};

const matchesSearch = (inv: InvoiceViewModel) => {
  const term = (search.value ?? '').trim().toLowerCase();
  if (!term) return true;
  const haystack = [
    inv.invoiceNumber,
    inv.garage?.name ?? inv.garageName,
    inv.carBrand,
    inv.carImmatriculation,
    techFirstName(inv),
    techLastName(inv),
  ].filter(Boolean).join(' ').toLowerCase();
  return haystack.includes(term);
};

const displayedInvoices = computed(() => {
  const src = tabSource.value.filter(inv => matchesSearch(inv)
    && (garageFilter.value === 'all' || invoiceGarageName(inv) === garageFilter.value)
    && (sentFilter.value === 'all' || Boolean(inv.isSent) === (sentFilter.value === 'sent')));
  switch (activeTab.value) {
    case 'pending': return src.filter(isPending);
    case 'paid':  return src.filter(isPaid);
    case 'late':  return src.filter(isLate);
    default:      return src;
  }
});

// ─── Technicien ───────────────────────────────────────────────
const TECH_COLORS = ['#0070FD','#15915F','#F5871F','#D8443A','#9AA2B1'];
type TechSource = Pick<InvoiceViewModel, 'assignedMember'> & {
  technician?: { first_name?: string; last_name?: string };
};
const techFirstName = (item: TechSource) => item.assignedMember?.users?.first_name ?? item.technician?.first_name ?? '';
const techLastName  = (item: TechSource) => item.assignedMember?.users?.last_name  ?? item.technician?.last_name  ?? '';
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

// ─── Chip statut ──────────────────────────────────────────────
const chipInfo = (item: InvoiceViewModel): { label: string; color: string } => {
  if (isCancelled(item))    return { label: t('invoices.status.cancelled'), color: 'default' };
  if (isDraft(item))        return { label: t('invoices.status.draft'), color: 'default' };
  if (isLate(item))         return { label: t('invoices.status.late'), color: 'error' };
  if (isPaid(item))         return { label: t('invoices.status.paid'), color: 'success' };
  return { label: t('invoices.status.pending'), color: 'warning' };
};
const chipLabel    = (item: InvoiceViewModel) => chipInfo(item).label;
const chipColor    = (item: InvoiceViewModel) => chipInfo(item).color;

// ─── Formatage ────────────────────────────────────────────────
const formatDateShort = (d?: string) => {
  if (!d) return '—';
  return formatDate(d, { day: 'numeric', month: 'long' });
};

const now = new Date();
const monthLabel        = computed(() => capitalize(formatDate(now, { month: 'long', year: 'numeric' })));
const currentMonthShort = computed(() => formatDate(now, { month: 'long' }).toLowerCase());

// ─── Table headers ────────────────────────────────────────────
const tableHeaders = computed(() => [
  { title: t('invoices.list.headers.invoiceNumber'),   key: 'invoiceNumber', sortable: true, width: '9%' },
  { title: t('invoices.list.headers.client'),       key: 'client',        sortable: false, width: '22%' },
  { title: t('invoices.list.headers.vehicle'),     key: 'vehicle',       sortable: false, width: '18%' },
  { title: t('invoices.list.headers.date'),         key: 'createdAt',     sortable: true, width: '11%' },
  { title: t('invoices.list.headers.technician'),   key: 'technician',    sortable: false, width: '14%' },
  { title: t('invoices.list.headers.totalInclTax'),  key: 'total',         align: 'end' as const, sortable: true, width: '10%' },
  ...(can('invoice_email_sending')
    ? [{ title: t('invoices.list.headers.sent'), key: 'sentAt', sortable: false, width: '10%' }]
    : []),
  { title: t('invoices.list.headers.status'),       key: 'status',        sortable: false, width: '9%' },
  { title: '',             key: 'actions',       sortable: false, width: '3%' },
]);

// ─── Actions ──────────────────────────────────────────────────
const onAddInvoice     = () => router.push('/invoices/new');
// The selected invoice is stored in localStorage instead of the URL
const openInvoice = (id: string | undefined, path: string) => {
  if (!id) return;
  setSelectedInvoiceGuid(id);
  router.push(path);
};
const onEditInvoice    = (id?: string) => openInvoice(id, '/invoices/edit');
const onViewInvoice    = (id?: string) => openInvoice(id, '/invoices/view');
const onViewPdfBtnClick= (id?: string) => openInvoice(id, '/invoices/preview');
// Clic sur une ligne : édition d'un brouillon, consultation en lecture seule sinon (sauf clic sur checkbox / bouton / lien)
const onRowClick = (_e: Event, { item }: { item: InvoiceViewModel }) => {
  if ((_e.target as HTMLElement).closest('.v-selection-control, button, a')) return;
  if (isDraft(item)) onEditInvoice(item.id);
  else onViewInvoice(item.id);
};

const onMarkPaid = async (id?: string) => {
  if (!id) return;
  try {
    await markAsPaid(id);
    showSnack(t('invoices.messages.markedPaid'));
  } catch {
    showSnack(t('invoices.messages.statusError'), 'error');
  }
};

const onSendBtnClick = async (id?: string) => {
  if (!id) return;
  try {
    await sendInvoiceUseCase.execute(id);
    showSnack(t('invoices.messages.sent'));
    await init();
  } catch {
    showSnack(t('invoices.messages.sendError'), 'error');
  }
};

const onBulkDownload = async () => {
  if (!selectedInvoices.value.length) return;
  downloading.value = true;
  try {
    const zip = new JSZip();
    let success = 0;
    for (const invoice of selectedInvoices.value) {
      try {
        const dto = InvoiceMapper.viewToDto(invoice);
        const lines = (invoice.lineItems ?? []).map(LineItemMapper.viewToDto);
        const url = await generatePdfUseCase.execute(dto, lines, _company.value);
        zip.file(`facture-${invoice.invoiceNumber}.pdf`, await (await fetch(url)).blob());
        URL.revokeObjectURL(url);
        success++;
      } catch (e) { console.error(`Erreur PDF facture ${invoice.invoiceNumber}:`, e); }
    }
    if (success === 0) { showSnack(t('invoices.messages.noPdf'), 'error'); return; }
    const link = document.createElement('a');
    link.href = URL.createObjectURL(await zip.generateAsync({ type: 'blob' }));
    link.download = `factures_${new Date().toISOString().split('T')[0]}.zip`;
    link.click();
    URL.revokeObjectURL(link.href);
    showSnack(t('invoices.messages.downloaded', success));
    selectedInvoices.value = [];
  } finally { downloading.value = false; }
};

const { invoicesUsed, load: loadPlanUsage } = usePlanUsage();
const invoicesLimitReached = computed(() => isLimitReached('max_invoices_per_month', invoicesUsed.value));

onMounted(async () => {
  const organizationId = authState.userContext?.value?.organization?.id;
  await Promise.all([
    init(),
    loadPlanUsage(),
    organizationId ? organizationProfileUseCase.getProfile(organizationId).then(c => { _company.value = c; }) : Promise.resolve(),
  ]);
});
</script>

<style scoped>

.invoices-table :deep(thead th) {
  font-size: 0.7rem !important;
  font-weight: 600 !important;
  letter-spacing: 0.06em !important;
  text-transform: uppercase !important;
  white-space: nowrap;
  color: rgb(var(--v-theme-lightText)) !important;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
