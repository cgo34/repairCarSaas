<template>
  <MainLayout>
    <v-container fluid class="pa-0">

      <!-- HEADER -->
      <div class="d-flex align-start justify-space-between mb-5">
        <div>
          <h1 class="text-h5 font-weight-bold mb-0" style="font-family:'Space Grotesk',sans-serif">Factures</h1>
          <p class="text-body-2 text-medium-emphasis mb-0">
            {{ monthLabel }} · {{ invoices.length }} facture{{ invoices.length > 1 ? 's' : '' }}
          </p>
        </div>
        <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" @click="onAddInvoice">
          Nouvelle facture
        </v-btn>
      </div>

      <!-- KPI CARDS -->
      <v-row dense class="mb-5">
        <v-col cols="6" sm="6" md="3">
          <v-card flat border class="pa-4">
            <p class="text-caption text-medium-emphasis mb-1">CA encaissé · {{ currentMonthShort }}</p>
            <div class="text-h5 font-weight-bold mb-1" style="font-family:'Space Grotesk',sans-serif">
              {{ formatCurrency(kpiCaEncaisse) }}
            </div>
            <v-chip size="x-small" color="success" variant="tonal" prepend-icon="mdi-trending-up">
              ce mois
            </v-chip>
          </v-card>
        </v-col>

        <v-col cols="6" sm="6" md="3">
          <v-card flat border class="pa-4">
            <p class="text-caption text-medium-emphasis mb-1">En attente de paiement</p>
            <div class="text-h5 font-weight-bold mb-1" style="font-family:'Space Grotesk',sans-serif">
              {{ formatCurrency(kpiEnAttente) }}
            </div>
            <p class="text-caption text-medium-emphasis mb-0">
              {{ kpiEnAttenteCount }} facture{{ kpiEnAttenteCount > 1 ? 's' : '' }} envoyée{{ kpiEnAttenteCount > 1 ? 's' : '' }}
            </p>
          </v-card>
        </v-col>

        <v-col cols="6" sm="6" md="3">
          <v-card flat border class="pa-4">
            <p class="text-caption text-medium-emphasis mb-1">Payées ce mois</p>
            <div class="text-h5 font-weight-bold mb-1" style="font-family:'Space Grotesk',sans-serif">
              {{ kpiPayees }}
            </div>
            <p class="text-caption text-medium-emphasis mb-0">factures réglées</p>
          </v-card>
        </v-col>

        <v-col cols="6" sm="6" md="3">
          <v-card flat border class="pa-4" :style="kpiLateInvoices.length > 0 ? 'border-color: #D8443A !important;' : ''">
            <p class="text-caption text-medium-emphasis mb-1">En retard</p>
            <div
              class="text-h5 font-weight-bold mb-1"
              :class="kpiLateInvoices.length > 0 ? 'text-error' : ''"
              style="font-family:'Space Grotesk',sans-serif"
            >
              {{ formatCurrency(kpiEnRetardMontant) }}
            </div>
            <v-chip v-if="kpiLateInvoices.length > 0" size="x-small" color="error" variant="tonal">
              {{ kpiLateInvoices.length }} à relancer
            </v-chip>
            <p v-else class="text-caption text-medium-emphasis mb-0">Aucune facture en retard</p>
          </v-card>
        </v-col>
      </v-row>

      <!-- TABS + FILTRE -->
      <div class="d-flex flex-column-reverse flex-sm-row align-sm-center justify-sm-space-between mb-2 ga-3">
        <div class="d-flex align-center gap-1 flex-wrap">
          <v-btn
            v-for="tab in tabs"
            :key="tab.key"
            :variant="activeTab === tab.key ? 'flat' : 'text'"
            :color="activeTab === tab.key ? (tab.key === 'late' ? 'error' : 'primary') : 'default'"
            size="small"
            rounded="pill"
            class="tab-btn"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
            <span class="ml-1 text-caption">· {{ tab.count }}</span>
          </v-btn>
        </div>
        <div class="d-flex ga-2 justify-end">
          <v-btn
            variant="outlined"
            size="small"
            prepend-icon="mdi-download-outline"
            :disabled="selectedInvoices.length === 0"
            :loading="downloading"
            @click="onBulkDownload"
          >
            Exporter
          </v-btn>
          <v-btn variant="outlined" size="small" prepend-icon="mdi-tune" @click="showFilters = !showFilters">
            Filtrer
          </v-btn>
        </div>
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
        v-model="selectedInvoices"
        :headers="tableHeaders"
        :items="displayedInvoices"
        :sort-by="[{ key: 'createdAt', order: 'desc' }]"
        show-select
        item-value="id"
        return-object
        no-data-text="Aucune facture trouvée"
        hover
        class="invoices-table"
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
          <span class="font-weight-medium">
            {{ item.garage?.name ?? item.garageName ?? '—' }}
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
            >
              <span class="text-caption font-weight-bold text-white" style="font-size:10px">
                {{ techInitials(item) }}
              </span>
            </v-avatar>
            <span class="text-body-2">{{ techShortName(item) }}</span>
          </div>
        </template>

        <!-- MONTANT TTC -->
        <template #item.total="{ item }">
          <span class="font-weight-medium" style="font-family:'Space Grotesk',sans-serif">
            {{ formatCurrency(item.totalHt ?? (item.isForfait ? (item.forfaitAmount ?? 0) : 0)) }}
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
              <v-list-item @click="onEditInvoice(item.id)">
                <template #prepend><v-icon size="16" color="warning" class="mr-2">mdi-pencil</v-icon></template>
                <v-list-item-title>Modifier</v-list-item-title>
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
    ref="deleteInvoiceConfirmDialogRef"
    title="Supprimer la facture"
    message="Cette facture sera supprimée définitivement. Continuer ?"
    confirm-label="Supprimer"
    cancel-label="Annuler"
    type="warning"
    @confirm="onConfirmDeleteInvoice"
  />
</template>

<script setup lang="ts">
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { OrganizationProfileDto } from '@/@application/dtos/OrganizationProfileDto';
import { IOrganizationProfileUseCase } from '@/@domain/useCases/organizations/IOrganizationProfileUseCase';
import { IGenerateInvoicePdfUseCase } from '@/@domain/useCases/invoices/IGenerateInvoicePdfUseCase';
import { ISendInvoiceUseCase } from '@/@domain/useCases/invoices/ISendInvoiceUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';
import { ConfirmDialogExposed } from '@/@presentation/components/ConfirmDialog';
import ConfirmDialog from '@/@presentation/components/ConfirmDialog.vue';
import PeriodFilterBar from '@/@presentation/components/PeriodFilterBar.vue';
import { usePeriodFilter } from '@/@presentation/composables/usePeriodFilter';
import { InvoiceMapper } from '@/@presentation/mappers/InvoiceMapper';
import { LineItemMapper } from '@/@presentation/mappers/LineItemMapper';
import { IUseInvoicesState } from '@/@presentation/types/composables/IUseInvoicesState';
import { InvoiceViewModel } from '@/@presentation/types/models/InvoiceViewModel';
import JSZip from 'jszip';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
const useInvoiceState = container.get<IUseInvoicesState>(SYMBOLS.States.Invoice.GetInvoicesUseCase);
const generatePdfUseCase = container.get<IGenerateInvoicePdfUseCase>(SYMBOLS.UseCases.Invoice.GenerateInvoicePdfUseCase);
const organizationProfileUseCase = container.get<IOrganizationProfileUseCase>(SYMBOLS.UseCases.OrganizationProfileUseCase);
const sendInvoiceUseCase = container.get<ISendInvoiceUseCase>(SYMBOLS.UseCases.Invoice.SendInvoiceUseCase);

const router = useRouter();
const { init, invoices, deleteInvoice } = useInvoiceState;

const {
  dateFrom, dateTo, activePreset, datePresets,
  filteredItems: periodFiltered,
  applyPreset, clearFilter, hasActiveFilter,
} = usePeriodFilter({ items: invoices, getDate: invoice => invoice.createdAt });

const selectedInvoices = ref<InvoiceViewModel[]>([]);
const downloading = ref(false);
const showFilters = ref(false);
const activeTab = ref<'all' | 'draft' | 'sent' | 'paid' | 'late'>('all');
const _company = ref<OrganizationProfileDto | null>(null);
const deleteInvoiceConfirmDialogRef = ref<ConfirmDialogExposed>();
const _invoiceToDelete = ref<string | undefined>();

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

const isPaid   = (inv: InvoiceViewModel) => ['finalized','validated','accepted','signed'].includes(getStatusCode(inv.status) ?? '');
const isDraft  = (inv: InvoiceViewModel) => getStatusCode(inv.status) === 'draft';
const isSentUnpaid = (inv: InvoiceViewModel) => inv.isSent && !isPaid(inv);
const isLate   = (inv: InvoiceViewModel) => {
  if (!inv.isSent || isPaid(inv) || !inv.sentAt) return false;
  return (Date.now() - new Date(inv.sentAt).getTime()) / 86_400_000 > 30;
};
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

const tabs = computed(() => [
  { key: 'all',   label: 'Toutes',    count: tabSource.value.length },
  { key: 'draft', label: 'Brouillons',count: tabSource.value.filter(isDraft).length },
  { key: 'sent',  label: 'Envoyées',  count: tabSource.value.filter(isSentUnpaid).length },
  { key: 'paid',  label: 'Payées',    count: tabSource.value.filter(isPaid).length },
  { key: 'late',  label: 'En retard', count: tabSource.value.filter(isLate).length },
]);

const displayedInvoices = computed(() => {
  const src = tabSource.value;
  switch (activeTab.value) {
    case 'draft': return src.filter(isDraft);
    case 'sent':  return src.filter(isSentUnpaid);
    case 'paid':  return src.filter(isPaid);
    case 'late':  return src.filter(isLate);
    default:      return src;
  }
});

// ─── Technicien ───────────────────────────────────────────────
const TECH_COLORS = ['#2B54E0','#15915F','#F5871F','#D8443A','#9AA2B1'];
const techFirstName = (item: any) => item.assignedMember?.users?.first_name ?? item.technician?.first_name ?? '';
const techLastName  = (item: any) => item.assignedMember?.users?.last_name  ?? item.technician?.last_name  ?? '';
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

// ─── Chip statut ──────────────────────────────────────────────
const chipInfo = (item: InvoiceViewModel): { label: string; color: string } => {
  if (isLate(item))         return { label: 'En retard', color: 'error' };
  if (isPaid(item))         return { label: 'Payée',     color: 'success' };
  if (isSentUnpaid(item))   return { label: 'Envoyée',   color: 'primary' };
  if (isDraft(item))        return { label: 'Brouillon', color: 'default' };
  const code = getStatusCode(item.status) ?? '';
  const labels: Record<string, string> = { processing:'En cours', pending:'En attente', cancelled:'Annulé', cancel:'Annulé', refused:'Refusé' };
  return { label: labels[code] ?? code, color: 'default' };
};
const chipLabel    = (item: InvoiceViewModel) => chipInfo(item).label;
const chipColor    = (item: InvoiceViewModel) => chipInfo(item).color;
const chipDotColor = (item: InvoiceViewModel) => {
  const map: Record<string, string> = { success:'#15915F', primary:'#2B54E0', error:'#D8443A' };
  return map[chipInfo(item).color] ?? '#9AA2B1';
};

// ─── Formatage ────────────────────────────────────────────────
const formatCurrency = (val: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val);

const formatDateShort = (d?: string) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
};

const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const now = new Date();
const monthLabel      = computed(() => `${MONTHS[now.getMonth()]} ${now.getFullYear()}`);
const currentMonthShort = MONTHS[now.getMonth()].toLowerCase();

// ─── Table headers ────────────────────────────────────────────
const tableHeaders = [
  { title: 'N° FACTURE',   key: 'invoiceNumber', sortable: true  },
  { title: 'CLIENT',       key: 'client',        sortable: false },
  { title: 'VÉHICULE',     key: 'vehicle',       sortable: false },
  { title: 'DATE',         key: 'createdAt',     sortable: true  },
  { title: 'TECHNICIEN',   key: 'technician',    sortable: false },
  { title: 'MONTANT TTC',  key: 'total',         align: 'end' as const, sortable: true },
  { title: 'STATUT',       key: 'status',        sortable: false },
  { title: '',             key: 'actions',       sortable: false },
];

// ─── Actions ──────────────────────────────────────────────────
const onAddInvoice     = () => router.push('/invoices/new');
const onEditInvoice    = (id?: string) => id && router.push(`/invoices/edit/${id}`);
const onViewPdfBtnClick= (id?: string) => id && router.push(`/invoices/view/${id}`);
const onDeleteBtnClick = (id?: string) => { if (!id) return; _invoiceToDelete.value = id; deleteInvoiceConfirmDialogRef.value?.open(); };
const onConfirmDeleteInvoice = () => { if (_invoiceToDelete.value) deleteInvoice(_invoiceToDelete.value); };

const onSendBtnClick = async (id?: string) => {
  if (!id) return;
  try {
    await sendInvoiceUseCase.execute(id);
    showSnack('Facture envoyée avec succès.');
    await init();
  } catch {
    showSnack("Erreur lors de l'envoi de la facture.", 'error');
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
        zip.file(`facture-${invoice.invoiceNumber}.pdf`, await fetch(url).then(r => r.blob()));
        URL.revokeObjectURL(url);
        success++;
      } catch (e) { console.error(`Erreur PDF facture ${invoice.invoiceNumber}:`, e); }
    }
    if (success === 0) { showSnack("Aucun PDF n'a pu être généré.", 'error'); return; }
    const link = document.createElement('a');
    link.href = URL.createObjectURL(await zip.generateAsync({ type: 'blob' }));
    link.download = `factures_${new Date().toISOString().split('T')[0]}.zip`;
    link.click();
    URL.revokeObjectURL(link.href);
    showSnack(`${success} facture(s) téléchargée(s).`);
    selectedInvoices.value = [];
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
.tab-btn { font-size: 0.8125rem; font-weight: 500; }

.chip-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 5px;
}

.invoices-table :deep(thead th) {
  font-size: 0.7rem !important;
  font-weight: 600 !important;
  letter-spacing: 0.06em !important;
  text-transform: uppercase !important;
  color: rgb(var(--v-theme-lightText)) !important;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
