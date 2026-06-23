<template>
  <MainLayout>
    <v-container fluid class="pa-4 pa-sm-6">

      <!-- HEADER -->
      <div class="d-flex align-start justify-space-between mb-5">
        <div>
          <h1 class="text-h5 font-weight-bold mb-0" style="font-family:'Space Grotesk',sans-serif">Devis</h1>
          <p class="text-body-2 text-medium-emphasis mb-0">
            {{ monthLabel }} · {{ quotes.length }} devis
          </p>
        </div>
        <div class="d-flex gap-2">
          <v-btn
            variant="outlined"
            prepend-icon="mdi-download-outline"
            :disabled="selectedQuotes.length === 0"
            :loading="downloading"
            @click="onBulkDownload"
          >
            Exporter
          </v-btn>
          <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" @click="onAddQuote">
            Nouveau devis
          </v-btn>
        </div>
      </div>

      <!-- KPI CARDS -->
      <v-row dense class="mb-5">
        <v-col cols="12" sm="6" md="3">
          <v-card flat border class="pa-4">
            <p class="text-caption text-medium-emphasis mb-1">Montant accepté · {{ currentMonthShort }}</p>
            <div class="text-h5 font-weight-bold mb-1" style="font-family:'Space Grotesk',sans-serif">
              {{ formatCurrency(kpiAccepteAmount) }}
            </div>
            <v-chip size="x-small" color="success" variant="tonal" prepend-icon="mdi-check-circle">
              ce mois
            </v-chip>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card flat border class="pa-4">
            <p class="text-caption text-medium-emphasis mb-1">En attente de réponse</p>
            <div class="text-h5 font-weight-bold mb-1" style="font-family:'Space Grotesk',sans-serif">
              {{ formatCurrency(kpiEnAttenteAmount) }}
            </div>
            <p class="text-caption text-medium-emphasis mb-0">
              {{ kpiEnAttenteCount }} devis envoyé{{ kpiEnAttenteCount > 1 ? 's' : '' }}
            </p>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card flat border class="pa-4">
            <p class="text-caption text-medium-emphasis mb-1">Acceptés ce mois</p>
            <div class="text-h5 font-weight-bold mb-1" style="font-family:'Space Grotesk',sans-serif">
              {{ kpiAccepteCount }}
            </div>
            <p class="text-caption text-medium-emphasis mb-0">devis signés ou validés</p>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card flat border class="pa-4" :style="kpiRefuseCount > 0 ? 'border-color: #D8443A !important;' : ''">
            <p class="text-caption text-medium-emphasis mb-1">Refusés</p>
            <div
              class="text-h5 font-weight-bold mb-1"
              :class="kpiRefuseCount > 0 ? 'text-error' : ''"
              style="font-family:'Space Grotesk',sans-serif"
            >
              {{ kpiRefuseCount }}
            </div>
            <v-chip v-if="kpiRefuseCount > 0" size="x-small" color="error" variant="tonal">
              {{ kpiRefuseCount }} à traiter
            </v-chip>
            <p v-else class="text-caption text-medium-emphasis mb-0">Aucun devis refusé</p>
          </v-card>
        </v-col>
      </v-row>

      <!-- TABS + FILTRE -->
      <div class="d-flex align-center justify-space-between mb-2">
        <div class="d-flex align-center gap-1 flex-wrap">
          <v-btn
            v-for="tab in tabs"
            :key="tab.key"
            :variant="activeTab === tab.key ? 'flat' : 'text'"
            :color="activeTab === tab.key ? (tab.key === 'refused' ? 'error' : 'primary') : 'default'"
            size="small"
            rounded="pill"
            class="tab-btn"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
            <span class="ml-1 text-caption">· {{ tab.count }}</span>
          </v-btn>
        </div>
        <v-btn variant="outlined" size="small" prepend-icon="mdi-tune" @click="showFilters = !showFilters">
          Filtrer
        </v-btn>
      </div>

      <!-- FILTRE PÉRIODE (collapse) -->
      <transition name="fade">
        <div v-if="showFilters" class="mb-3">
          <PeriodFilterBar
            v-model:date-from="dateFrom"
            v-model:date-to="dateTo"
            v-model:active-preset="activePreset"
            :date-presets="datePresets"
            :has-active-filter="hasActiveFilter"
            @preset-change="applyPreset"
            @clear="clearFilter"
          />
        </div>
      </transition>

      <!-- TABLE -->
      <v-data-table
        v-model="selectedQuotes"
        :headers="tableHeaders"
        :items="displayedQuotes"
        :sort-by="[{ key: 'createdAt', order: 'desc' }]"
        show-select
        item-value="id"
        return-object
        no-data-text="Aucun devis trouvé"
        hover
        class="quotes-table"
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
            <v-avatar size="26" :color="techColor(item)">
              <span class="text-caption font-weight-bold text-white" style="font-size:10px">
                {{ techInitials(item) }}
              </span>
            </v-avatar>
            <span class="text-body-2">{{ techShortName(item) }}</span>
          </div>
        </template>

        <!-- MONTANT HT -->
        <template #item.total="{ item }">
          <span class="font-weight-medium" style="font-family:'Space Grotesk',sans-serif">
            {{ formatCurrency(amount(item)) }}
          </span>
        </template>

        <!-- STATUT -->
        <template #item.status="{ item }">
          <v-chip
            :color="chipColor(item)"
            variant="tonal"
            size="small"
            label
          >
            <span class="chip-dot" :style="`background:${chipDotColor(item)}`" />
            {{ chipLabel(item) }}
          </v-chip>
        </template>

        <!-- ACTIONS -->
        <template #item.actions="{ item }">
          <v-menu>
            <template #activator="{ props }">
              <v-btn size="small" variant="text" icon="mdi-dots-vertical" v-bind="props" />
            </template>
            <v-list density="compact">
              <v-list-item @click="onSendBtnClick(item.id)">
                <template #prepend><v-icon size="16" color="success" class="mr-2">mdi-send</v-icon></template>
                <v-list-item-title>Envoyer</v-list-item-title>
              </v-list-item>
              <v-list-item @click="onViewPdfBtnClick(item.id)">
                <template #prepend><v-icon size="16" color="primary" class="mr-2">mdi-file-pdf-box</v-icon></template>
                <v-list-item-title>Voir PDF</v-list-item-title>
              </v-list-item>
              <v-list-item @click="onEditQuote(item.id)">
                <template #prepend><v-icon size="16" color="warning" class="mr-2">mdi-pencil</v-icon></template>
                <v-list-item-title>Modifier</v-list-item-title>
              </v-list-item>
              <v-list-item @click="onConvertToInvoice(item.id)">
                <template #prepend><v-icon size="16" color="info" class="mr-2">mdi-receipt-text-check</v-icon></template>
                <v-list-item-title>Facturer</v-list-item-title>
              </v-list-item>
              <v-divider />
              <v-list-item @click="onDeleteBtnClick(item.id)">
                <template #prepend><v-icon size="16" color="error" class="mr-2">mdi-delete</v-icon></template>
                <v-list-item-title class="text-error">Supprimer</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>

    </v-container>
  </MainLayout>

  <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="4000" location="bottom right">
    {{ snackbar.message }}
  </v-snackbar>

  <ConfirmDialog
    ref="deleteQuoteConfirmDialogRef"
    title="Supprimer le devis"
    message="Ce devis sera supprimé définitivement. Continuer ?"
    confirm-label="Supprimer"
    cancel-label="Annuler"
    type="warning"
    @confirm="onConfirmDeleteQuote"
  />
</template>

<script setup lang="ts">
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { CompanySettingsDto } from '@/@application/dtos/CompanySettingsDto';
import { ICompanySettingsUseCase } from '@/@domain/useCases/ICompanySettingsUseCase';
import { IGenerateQuotePdfUseCase } from '@/@domain/useCases/quotes/IGenerateQuotePdfUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';
import { ConfirmDialogExposed } from '@/@presentation/components/ConfirmDialog';
import ConfirmDialog from '@/@presentation/components/ConfirmDialog.vue';
import PeriodFilterBar from '@/@presentation/components/PeriodFilterBar.vue';
import { usePeriodFilter } from '@/@presentation/composables/usePeriodFilter';
import { LineItemMapper } from '@/@presentation/mappers/LineItemMapper';
import { QuoteMapper } from '@/@presentation/mappers/QuoteMapper';
import { IUseQuotesState } from '@/@presentation/types/composables/IUseQuotesState';
import { QuoteViewModel } from '@/@presentation/types/models/QuoteViewModel';
import JSZip from 'jszip';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
const useQuoteState = container.get<IUseQuotesState>(SYMBOLS.States.Quote.GetQuotesUseCase);
const generatePdfUseCase = container.get<IGenerateQuotePdfUseCase>(SYMBOLS.UseCases.Quote.GenerateQuotePdfUseCase);
const companySettingsUseCase = container.get<ICompanySettingsUseCase>(SYMBOLS.UseCases.CompanySettings);

const router = useRouter();
const { init, quotes, deleteQuote, sendQuote, convertToInvoice } = useQuoteState;

const {
  dateFrom, dateTo, activePreset, datePresets,
  filteredItems: periodFiltered,
  applyPreset, clearFilter, hasActiveFilter,
} = usePeriodFilter({ items: quotes, getDate: quote => quote.createdAt });

const selectedQuotes = ref<QuoteViewModel[]>([]);
const downloading = ref(false);
const showFilters = ref(false);
const activeTab = ref<'all' | 'draft' | 'sent' | 'accepted' | 'refused'>('all');
const _company = ref<CompanySettingsDto | null>(null);
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

const isAccepted    = (q: QuoteViewModel) => ['accepted', 'signed', 'validated', 'invoiced'].includes(getStatusCode(q.status) ?? '');
const isDraft       = (q: QuoteViewModel) => getStatusCode(q.status) === 'draft';
const isRefused     = (q: QuoteViewModel) => ['refused', 'cancel'].includes(getStatusCode(q.status) ?? '');
const isSentPending = (q: QuoteViewModel) => q.isSent && !isAccepted(q) && !isRefused(q);
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

const tabs = computed(() => [
  { key: 'all',      label: 'Tous',       count: tabSource.value.length },
  { key: 'draft',    label: 'Brouillons', count: tabSource.value.filter(isDraft).length },
  { key: 'sent',     label: 'Envoyés',    count: tabSource.value.filter(isSentPending).length },
  { key: 'accepted', label: 'Acceptés',   count: tabSource.value.filter(isAccepted).length },
  { key: 'refused',  label: 'Refusés',    count: tabSource.value.filter(isRefused).length },
]);

const displayedQuotes = computed(() => {
  const src = tabSource.value;
  switch (activeTab.value) {
    case 'draft':    return src.filter(isDraft);
    case 'sent':     return src.filter(isSentPending);
    case 'accepted': return src.filter(isAccepted);
    case 'refused':  return src.filter(isRefused);
    default:         return src;
  }
});

const TECH_COLORS = ['#2B54E0','#15915F','#F5871F','#D8443A','#9AA2B1'];
const techFirstName = (item: any) => item.assignedMember?.users?.first_name ?? '';
const techLastName  = (item: any) => item.assignedMember?.users?.last_name  ?? '';
const techInitials  = (item: any) => `${techFirstName(item)[0] ?? ''}${techLastName(item)[0] ?? ''}`.toUpperCase() || '?';
const techShortName = (item: any) => {
  const f = techFirstName(item);
  const l = techLastName(item);
  if (!f && !l) return '—';
  return `${f}${l ? ' ' + l[0] + '.' : ''}`;
};
const techColor = (item: any) => {
  const key = techInitials(item);
  const hash = key.charCodeAt(0) + (key.charCodeAt(1) || 0);
  return TECH_COLORS[hash % TECH_COLORS.length];
};

const chipInfo = (q: QuoteViewModel): { label: string; color: string } => {
  if (isRefused(q))     return { label: 'Refusé',    color: 'error'     };
  if (isAccepted(q)) {
    const code = getStatusCode(q.status);
    if (code === 'invoiced') return { label: 'Facturé', color: 'secondary' };
    return { label: 'Accepté', color: 'success' };
  }
  if (isSentPending(q)) return { label: 'Envoyé',    color: 'primary'   };
  if (isDraft(q))       return { label: 'Brouillon', color: 'default'   };
  const code = getStatusCode(q.status) ?? '';
  const labels: Record<string, string> = { processing: 'En cours', pending: 'En attente', signed: 'Signé' };
  return { label: labels[code] ?? code, color: 'default' };
};
const chipLabel    = (q: QuoteViewModel) => chipInfo(q).label;
const chipColor    = (q: QuoteViewModel) => chipInfo(q).color;
const chipDotColor = (q: QuoteViewModel) => {
  const map: Record<string, string> = { success: '#15915F', primary: '#2B54E0', error: '#D8443A', secondary: '#9AA2B1' };
  return map[chipInfo(q).color] ?? '#9AA2B1';
};

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val);

const formatDateShort = (d?: string) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
};

const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const now = new Date();
const monthLabel        = computed(() => `${MONTHS[now.getMonth()]} ${now.getFullYear()}`);
const currentMonthShort = MONTHS[now.getMonth()].toLowerCase();

const tableHeaders = [
  { title: 'N° DEVIS',   key: 'quoteNumber', sortable: true  },
  { title: 'CLIENT',     key: 'client',      sortable: false },
  { title: 'VÉHICULE',   key: 'vehicle',     sortable: false },
  { title: 'DATE',       key: 'createdAt',   sortable: true  },
  { title: 'TECHNICIEN', key: 'technician',  sortable: false },
  { title: 'MONTANT HT', key: 'total',       align: 'end' as const, sortable: true },
  { title: 'STATUT',     key: 'status',      sortable: false },
  { title: '',           key: 'actions',     sortable: false },
];

const onAddQuote        = () => router.push('/quotes/add');
const onEditQuote       = (id?: string) => id && router.push(`/quotes/${id}/edit/`);
const onViewPdfBtnClick = (id?: string) => id && router.push(`/quotes/${id}/view`);
const onDeleteBtnClick  = (id?: string) => { if (!id) return; _quoteIdToDelete.value = id; deleteQuoteConfirmDialogRef.value?.open(); };
const onConfirmDeleteQuote = () => { if (_quoteIdToDelete.value) deleteQuote(_quoteIdToDelete.value); };

const onSendBtnClick = async (quoteId?: string) => {
  if (!quoteId) return;
  try {
    await sendQuote(quoteId);
    showSnack('Devis envoyé avec succès !');
  } catch {
    showSnack("Erreur lors de l'envoi du devis.", 'error');
  }
};

const onConvertToInvoice = async (quoteId?: string) => {
  if (!quoteId) return;
  try {
    const invoiceId = await convertToInvoice(quoteId);
    showSnack('Devis converti en facture !');
    router.push(`/invoices/edit/${invoiceId}`);
  } catch {
    showSnack('Erreur lors de la conversion en facture.', 'error');
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
        zip.file(`devis-${quote.quoteNumber}.pdf`, await fetch(url).then(r => r.blob()));
        URL.revokeObjectURL(url);
        success++;
      } catch (e) { console.error(`Erreur PDF devis ${quote.quoteNumber}:`, e); }
    }
    if (success === 0) { showSnack("Aucun PDF n'a pu être généré.", 'error'); return; }
    const link = document.createElement('a');
    link.href = URL.createObjectURL(await zip.generateAsync({ type: 'blob' }));
    link.download = `devis_${new Date().toISOString().split('T')[0]}.zip`;
    link.click();
    URL.revokeObjectURL(link.href);
    showSnack(`${success} devis téléchargé(s).`);
    selectedQuotes.value = [];
  } finally { downloading.value = false; }
};

onMounted(async () => {
  const userId = authState.user?.value?.id;
  await Promise.all([
    init(),
    userId ? companySettingsUseCase.getByUserId(userId).then(c => { _company.value = c; }) : Promise.resolve(),
  ]);
});
</script>

<style scoped>
.tab-btn { font-size: 0.8125rem; font-weight: 500; }

.chip-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 5px;
}

.quotes-table :deep(thead th) {
  font-size: 0.7rem !important;
  font-weight: 600 !important;
  letter-spacing: 0.06em !important;
  text-transform: uppercase !important;
  color: rgb(var(--v-theme-lightText)) !important;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>