<template>
  <MainLayout>
    <v-container fluid>
      <v-row>
        <v-data-table
          v-model="selectedInvoices"
          :headers="headers"
          :items="filteredInvoices"
          :sort-by="[{ key: 'createdAt', order: 'desc' }]"
          show-select
          item-value="id"
          return-object
        >
          <!-- ── TOP BAR ─────────────────────────────────────── -->
          <template #top>
            <v-toolbar flat class="pb-2">
              <v-toolbar-title>Gestion des factures</v-toolbar-title>
              <v-divider class="mx-4" inset vertical />
              <v-spacer />
              <v-btn color="primary" @click="onAddInvoice">
                Ajouter une facture
              </v-btn>
            </v-toolbar>

            <!-- Barre de filtres -->
            <div class="filter-bar px-4 pb-3">
              <div class="d-flex align-center gap-3 flex-wrap">

                <!-- Raccourcis rapides -->
                <div class="d-flex gap-2">
                  <v-btn
                    v-for="preset in datePresets"
                    :key="preset.key"
                    size="small"
                    :variant="activePreset === preset.key ? 'flat' : 'tonal'"
                    :color="activePreset === preset.key ? 'primary' : 'default'"
                    rounded="lg"
                    @click="applyPreset(preset.key)"
                  >
                    {{ preset.label }}
                  </v-btn>
                </div>

                <v-divider vertical class="mx-1" style="height:32px;" />

                <!-- Plage personnalisée -->
                <v-text-field
                  v-model="dateFrom"
                  label="Du"
                  type="date"
                  density="compact"
                  variant="outlined"
                  hide-details
                  style="max-width:160px;"
                  @update:model-value="activePreset = 'custom'"
                />
                <v-text-field
                  v-model="dateTo"
                  label="Au"
                  type="date"
                  density="compact"
                  variant="outlined"
                  hide-details
                  style="max-width:160px;"
                  @update:model-value="activePreset = 'custom'"
                />

                <v-btn
                  v-if="dateFrom || dateTo"
                  icon="mdi-close"
                  size="small"
                  variant="text"
                  @click="clearFilter"
                />

                <v-spacer />

                <!-- Résumé sélection + téléchargement groupé -->
                <transition name="fade">
                  <div v-if="selectedInvoices.length > 0" class="d-flex align-center gap-2">
                    <span class="text-body-2 text-medium-emphasis">
                      {{ selectedInvoices.length }} sélectionnée(s)
                    </span>
                    <v-btn
                      color="primary"
                      variant="flat"
                      size="small"
                      prepend-icon="mdi-download-multiple"
                      :loading="downloading"
                      rounded="lg"
                      @click="onBulkDownload"
                    >
                      Télécharger ZIP
                    </v-btn>
                    <v-btn
                      variant="text"
                      size="small"
                      @click="selectedInvoices = []"
                    >
                      Tout désélectionner
                    </v-btn>
                  </div>
                </transition>
              </div>

              <!-- Compteur résultats -->
              <div class="mt-2 text-caption text-medium-emphasis">
                {{ filteredInvoices.length }} facture(s)
                <span v-if="dateFrom || dateTo"> sur la période sélectionnée</span>
              </div>
            </div>
          </template>

          <!-- ── Colonnes ────────────────────────────────────── -->
          <template #item.invoiceNumber="{ value }">
            <span class="font-weight-medium">#{{ value }}</span>
          </template>

          <template #item.createdAt="{ value }">
            {{ regionManager.formatDate(value) }}
          </template>

          <template #item.garage="{ value }">
            {{ value?.name }}
          </template>

          <template #item.status="{ value }">
            <v-chip :text="statusLabel(value)" :color="statusColor(value)" size="small" />
          </template>

          <template #item.total="{ item }">
            {{ item.totalHt ? `${item.totalHt} €` : (item.isForfait ? `${item.forfaitAmount ?? 0} €` : '0 €') }}
          </template>

          <template #item.actions="{ item }">
            <v-icon class="me-2" size="small" @click="onEditInvoice(item)">mdi-pencil</v-icon>
            <v-icon size="small" @click="onDeleteBtnClick(item.id)">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </v-row>
    </v-container>
  </MainLayout>

  <!-- Snackbar progression -->
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
import { IRegionManager } from '@/@core/managers/interfaces/IRegionManager';
import { IGenerateInvoicePdfUseCase } from '@/@domain/useCases/invoices/IGenerateInvoicePdfUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';
import { ConfirmDialogExposed } from '@/@presentation/components/ConfirmDialog';
import ConfirmDialog from '@/@presentation/components/ConfirmDialog.vue';
import { InvoiceMapper } from '@/@presentation/mappers/InvoiceMapper';
import { LineItemMapper } from '@/@presentation/mappers/LineItemMapper';
import { IUseInvoicesState } from '@/@presentation/types/composables/IUseInvoicesState';
import { InvoiceViewModel } from '@/@presentation/types/models/InvoiceViewModel';
import JSZip from 'jszip';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const regionManager = container.get<IRegionManager>(SYMBOLS.Managers.regionManager);
const useInvoiceState = container.get<IUseInvoicesState>(SYMBOLS.States.Invoice.GetInvoicesUseCase);
const generatePdfUseCase = container.get<IGenerateInvoicePdfUseCase>(SYMBOLS.UseCases.Invoice.GenerateInvoicePdfUseCase);
const { init, invoices, deleteInvoice } = useInvoiceState;

const router = useRouter();

// ── Sélection ──────────────────────────────────────────────────
const selectedInvoices = ref<InvoiceViewModel[]>([]);
const downloading = ref(false);

// ── Filtres date ───────────────────────────────────────────────
const dateFrom = ref('');
const dateTo = ref('');
const activePreset = ref<string>('all');

const datePresets = [
  { key: 'all',   label: 'Tout' },
  { key: 'today', label: "Aujourd'hui" },
  { key: 'week',  label: 'Cette semaine' },
  { key: 'month', label: 'Ce mois' },
  { key: 'year',  label: 'Cette année' },
];

const applyPreset = (key: string) => {
  activePreset.value = key;
  const now = new Date();
  const fmt = (d: Date) => d.toISOString().split('T')[0];

  if (key === 'all')   { dateFrom.value = ''; dateTo.value = ''; return; }
  if (key === 'today') { dateFrom.value = fmt(now); dateTo.value = fmt(now); return; }
  if (key === 'week')  {
    const mon = new Date(now); mon.setDate(now.getDate() - now.getDay() + 1);
    dateFrom.value = fmt(mon); dateTo.value = fmt(now); return;
  }
  if (key === 'month') {
    dateFrom.value = fmt(new Date(now.getFullYear(), now.getMonth(), 1));
    dateTo.value = fmt(now); return;
  }
  if (key === 'year')  {
    dateFrom.value = fmt(new Date(now.getFullYear(), 0, 1));
    dateTo.value = fmt(now); return;
  }
};

const clearFilter = () => { dateFrom.value = ''; dateTo.value = ''; activePreset.value = 'all'; };

const filteredInvoices = computed(() => {
  if (!dateFrom.value && !dateTo.value) return invoices.value;
  return invoices.value.filter(inv => {
    const d = inv.createdAt ? new Date(inv.createdAt).toISOString().split('T')[0] : '';
    if (dateFrom.value && d < dateFrom.value) return false;
    if (dateTo.value   && d > dateTo.value)   return false;
    return true;
  });
});

// ── Téléchargement groupé ──────────────────────────────────────
const snackbar = reactive({ show: false, message: '', color: 'success' });

const showSnack = (message: string, color = 'success') => {
  snackbar.message = message;
  snackbar.color = color;
  snackbar.show = true;
};

const onBulkDownload = async () => {
  if (!selectedInvoices.value.length) return;
  downloading.value = true;

  try {
    const zip = new JSZip();
    let success = 0;

    for (const invoice of selectedInvoices.value) {
      try {
        const dto   = InvoiceMapper.viewToDto(invoice);
        const lines = (invoice.lineItems ?? []).map(LineItemMapper.viewToDto);
        const url   = await generatePdfUseCase.execute(dto, lines);

        // Blob depuis l'object URL
        const blob = await fetch(url).then(r => r.blob());
        zip.file(`facture-${invoice.invoiceNumber}.pdf`, blob);
        URL.revokeObjectURL(url);
        success++;
      } catch (e) {
        console.error(`Erreur PDF facture ${invoice.invoiceNumber}:`, e);
      }
    }

    if (success === 0) {
      showSnack('Aucun PDF n\'a pu être généré.', 'error');
      return;
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = `factures_${new Date().toISOString().split('T')[0]}.zip`;
    link.click();
    URL.revokeObjectURL(link.href);

    showSnack(`${success} facture(s) téléchargée(s) dans le ZIP.`);
    selectedInvoices.value = [];
  } finally {
    downloading.value = false;
  }
};

// ── Headers ────────────────────────────────────────────────────
const headers = [
  { title: 'Numéro', align: 'start', key: 'invoiceNumber' },
  { title: 'Date', align: 'start', key: 'createdAt' },
  { title: 'Statut', align: 'start', key: 'status' },
  { title: 'Modèle', key: 'carBrand' },
  { title: 'Garage', key: 'garage.name' },
  { title: 'Technicien', key: 'technician.fullName' },
  { title: 'Total', key: 'total' },
  { title: 'Actions', sortable: false, key: 'actions' },
] as const;

// ── CRUD ───────────────────────────────────────────────────────
const deleteInvoiceConfirmDialogRef = ref<ConfirmDialogExposed>();
const _invoiceToDelete = ref<string | undefined>();

const onAddInvoice    = () => router.push('/invoices/new');
const onEditInvoice   = (item: InvoiceViewModel) => router.push(`/invoices/edit/${item.id}`);
const onDeleteBtnClick = (id?: string) => { if (!id) return; _invoiceToDelete.value = id; deleteInvoiceConfirmDialogRef.value?.open(); };
const onConfirmDeleteInvoice = () => { if (_invoiceToDelete.value) deleteInvoice(_invoiceToDelete.value); };

// ── Status helpers ─────────────────────────────────────────────
const statusColor = (s?: string) => ({ pending: 'orange', validated: 'success', accepted: 'success', signed: 'success', sent: 'blue', draft: 'grey', cancel: 'error' } as Record<string,string>)[s ?? ''] ?? 'default';
const statusLabel = (s?: string) => ({ pending: 'En attente', validated: 'Payé', accepted: 'Accepté', signed: 'Signé', sent: 'Envoyé', draft: 'Brouillon', cancel: 'Annulé' } as Record<string,string>)[s ?? ''] ?? (s ?? '');

onMounted(async () => { await init(); });
</script>

<style scoped>
.filter-bar {
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border-bottom: 1px solid rgba(var(--v-border-color), 0.08);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
