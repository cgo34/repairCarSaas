<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-3 pa-sm-4"
    >
      <!-- ── HEADER PAGE ─────────────────────────────────────── -->
      <div class="d-flex align-center justify-space-between mb-4">
        <div>
          <h1 class="text-h6 font-weight-bold">
            Gestion des Factures
          </h1>
          <p class="text-caption text-medium-emphasis mt-n1">
            {{ filteredInvoices.length }} facture(s)<span v-if="dateFrom || dateTo"> · période sélectionnée</span>
          </p>
        </div>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          rounded="lg"
          :size="mobile ? 'small' : 'default'"
          @click="onAddInvoice"
        >
          <span class="d-none d-sm-inline">Ajouter une Facture</span>
          <span class="d-sm-none">Nouvelle</span>
        </v-btn>
      </div>

      <!-- ── FILTER CARD ─────────────────────────────────────── -->
      <v-card
        flat
        rounded="lg"
        border
        class="mb-3"
      >
        <div class="px-3 pt-3 pb-2">
          <!-- Presets scroll horizontal sur mobile -->
          <div class="preset-scroll mb-2">
            <v-btn
              v-for="preset in datePresets"
              :key="preset.key"
              size="small"
              :variant="activePreset === preset.key ? 'flat' : 'tonal'"
              :color="activePreset === preset.key ? 'primary' : 'default'"
              rounded="lg"
              class="mr-1 flex-shrink-0"
              @click="applyPreset(preset.key)"
            >
              {{ preset.label }}
            </v-btn>
          </div>

          <!-- Date pickers + actions sélection desktop -->
          <div class="d-flex align-center flex-wrap gap-2">
            <v-text-field
              v-model="dateFrom"
              label="Du"
              type="date"
              density="compact"
              variant="outlined"
              hide-details
              :style="mobile ? 'flex:1;min-width:130px' : 'max-width:160px'"
              @update:model-value="activePreset = 'custom'"
            />
            <v-text-field
              v-model="dateTo"
              label="Au"
              type="date"
              density="compact"
              variant="outlined"
              hide-details
              :style="mobile ? 'flex:1;min-width:130px' : 'max-width:160px'"
              @update:model-value="activePreset = 'custom'"
            />
            <v-btn
              v-if="dateFrom || dateTo"
              icon="mdi-close"
              size="small"
              variant="text"
              @click="clearFilter"
            />
            <v-spacer v-if="!mobile" />
            <transition name="fade">
              <div
                v-if="selectedInvoices.length > 0 && !mobile"
                class="d-flex align-center gap-2"
              >
                <span class="text-body-2 text-medium-emphasis">{{ selectedInvoices.length }} sélectionnée(s)</span>
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
        </div>

        <!-- Barre sélection mobile -->
        <transition name="slide-up">
          <div
            v-if="selectedInvoices.length > 0 && mobile"
            class="selection-bar-mobile px-3 py-2 d-flex align-center gap-2"
          >
            <span class="text-body-2 font-weight-medium">{{ selectedInvoices.length }} sélectionnée(s)</span>
            <v-spacer />
            <v-btn
              variant="text"
              size="small"
              @click="selectedInvoices = []"
            >
              Annuler
            </v-btn>
            <v-btn
              color="primary"
              variant="flat"
              size="small"
              prepend-icon="mdi-download-multiple"
              :loading="downloading"
              rounded="lg"
              @click="onBulkDownload"
            >
              ZIP
            </v-btn>
          </div>
        </transition>
      </v-card>

      <!-- ── TABLE ───────────────────────────────────────────── -->
      <v-card
        flat
        rounded="lg"
        border
      >
        <v-data-table
          v-model="selectedInvoices"
          :headers="activeHeaders"
          :items="filteredInvoices"
          :sort-by="[{ key: 'createdAt', order: 'desc' }]"
          show-select
          item-value="id"
          return-object
          no-data-text="Aucune facture trouvée"
        >
          <template #item.invoiceNumber="{ value }">
            <span class="font-weight-semibold text-primary">#{{ value }}</span>
          </template>

          <template #item.createdAt="{ value }">
            <span class="text-no-wrap">{{ regionManager.formatDate(value) }}</span>
          </template>

          <template #item.garage="{ value }">
            {{ value?.name }}
          </template>

          <template #item.status="{ value }">
            <v-chip
              :text="statusLabel(value)"
              :color="statusColor(value)"
              size="small"
            />
          </template>

          <template #item.technician="{ item }">
            {{
              `${item.assignedMember?.users?.first_name ?? ''} ${item.assignedMember?.users?.last_name ?? ''}`.trim()
            }}
          </template>

          <template #item.sent="{ item }">
            <div class="tw-flex tw-items-center tw-gap-2">
              <v-chip
                :color="item.isSent ? 'success' : 'error'"
                variant="tonal"
                size="small"
              >
                <v-icon start>
                  {{
                    item.isSent
                      ? 'mdi-check-circle'
                      : 'mdi-close-circle'
                  }}
                </v-icon>

                {{
                  item.isSent && item.sentAt
                    ? new Date(item.sentAt).toLocaleDateString('fr-FR')
                    : 'Non envoyé'
                }}
              </v-chip>
            </div>
          </template>

          <template #item.total="{ item }">
            <span class="font-weight-medium">
              {{ item.totalHt ? `${item.totalHt} €` : (item.isForfait ? `${item.forfaitAmount ?? 0} €` : '0 €') }}
            </span>
          </template>

          <!-- <template #item.actions="{ item }">
            <div class="d-flex align-center">
              <v-btn icon="mdi-pencil" size="x-small" variant="text" @click="onEditInvoice(item)" />
              <v-btn icon="mdi-delete" size="x-small" variant="text" color="error" @click="onDeleteBtnClick(item.id)" />
            </div>
          </template> -->

          
          <template #item.actions="{ item }">
            <div class="tw-flex tw-items-center tw-gap-1">
              <!-- SEND -->
              <v-tooltip text="Envoyer">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon
                    variant="text"
                    size="small"
                    color="success"
                    @click="onSendBtnClick(item.id)"
                  >
                    <v-icon size="18">
                      mdi-send
                    </v-icon>
                  </v-btn>
                </template>
              </v-tooltip>

              <!-- PDF -->
              <v-tooltip text="Voir">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon
                    variant="text"
                    size="small"
                    color="primary"
                    @click="onViewPdfBtnClick(item.id)"
                  >
                    <v-icon size="18">
                      mdi-file-pdf-box
                    </v-icon>
                  </v-btn>
                </template>
              </v-tooltip>

              <!-- EDIT -->
              <v-tooltip text="Modifier">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon
                    variant="text"
                    size="small"
                    color="warning"
                    @click="onEditInvoice(item.id)"
                  >
                    <v-icon size="18">
                      mdi-pencil
                    </v-icon>
                  </v-btn>
                </template>
              </v-tooltip>

              <!-- DELETE -->
              <v-tooltip text="Supprimer">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon
                    variant="text"
                    size="small"
                    color="error"
                    @click="onDeleteBtnClick(item.id)"
                  >
                    <v-icon size="18">
                      mdi-trash-can-outline
                    </v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
            </div>
          </template>

          <template #bottom="{ pageCount, page, itemsPerPage, setItemsPerPage, prevPage, nextPage }">
            <div class="d-flex align-center justify-end flex-wrap gap-2 px-3 py-2">
              <span class="text-caption text-medium-emphasis">Lignes par page</span>
              <v-select
                :model-value="itemsPerPage"
                :items="[10, 25, 50, { value: -1, title: 'Tout' }]"
                density="compact"
                variant="outlined"
                hide-details
                style="max-width:90px"
                @update:model-value="setItemsPerPage"
              />
              <span class="text-caption text-medium-emphasis">Page {{ page }} / {{ pageCount }}</span>
              <div class="d-flex">
                <v-btn
                  icon="mdi-chevron-left"
                  size="x-small"
                  variant="text"
                  :disabled="page <= 1"
                  @click="prevPage"
                />
                <v-btn
                  icon="mdi-chevron-right"
                  size="x-small"
                  variant="text"
                  :disabled="page >= pageCount"
                  @click="nextPage"
                />
              </div>
            </div>
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
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { CompanySettingsDto } from '@/@application/dtos/CompanySettingsDto';
import { ICompanySettingsUseCase } from '@/@domain/useCases/ICompanySettingsUseCase';
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
import { useDisplay } from 'vuetify';
import { useRouter } from 'vue-router';

const regionManager = container.get<IRegionManager>(SYMBOLS.Managers.regionManager);
const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
const useInvoiceState = container.get<IUseInvoicesState>(SYMBOLS.States.Invoice.GetInvoicesUseCase);
const generatePdfUseCase = container.get<IGenerateInvoicePdfUseCase>(SYMBOLS.UseCases.Invoice.GenerateInvoicePdfUseCase);
const companySettingsUseCase = container.get<ICompanySettingsUseCase>(SYMBOLS.UseCases.CompanySettings);
const { init, invoices, deleteInvoice } = useInvoiceState;

const router = useRouter();
const { mobile } = useDisplay();

const selectedInvoices = ref<InvoiceViewModel[]>([]);
const downloading = ref(false);
const _company = ref<CompanySettingsDto | null>(null);

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

const desktopHeaders = [
  { title: 'Numéro', align: 'start' as const, key: 'invoiceNumber' },
  { title: 'Date', align: 'start' as const, key: 'createdAt' },
  { title: 'Statut', align: 'start' as const, key: 'status' },
  { title: 'Modèle', key: 'carBrand' },
  { title: 'Garage', key: 'garage.name' },
  { title: 'Technicien', key: 'technician' },
  { title: 'Envoyé', key: 'sent' },
  { title: 'Total', key: 'total' },
  { title: 'Actions', sortable: false, key: 'actions' },
];

const mobileHeaders = [
  { title: 'N°', align: 'start' as const, key: 'invoiceNumber' },
  { title: 'Date', key: 'createdAt' },
  { title: 'Statut', key: 'status' },
  { title: 'Total', key: 'total' },
  { title: '', sortable: false, key: 'actions' },
];

const activeHeaders = computed(() => mobile.value ? mobileHeaders : desktopHeaders);

const snackbar = reactive({ show: false, message: '', color: 'success' });
const showSnack = (message: string, color = 'success') => {
  snackbar.message = message; snackbar.color = color; snackbar.show = true;
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
        const url   = await generatePdfUseCase.execute(dto, lines, _company.value);
        const blob  = await fetch(url).then(r => r.blob());
        zip.file(`facture-${invoice.invoiceNumber}.pdf`, blob);
        URL.revokeObjectURL(url);
        success++;
      } catch (e) {
        console.error(`Erreur PDF facture ${invoice.invoiceNumber}:`, e);
      }
    }
    if (success === 0) { showSnack("Aucun PDF n'a pu être généré.", 'error'); return; }
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

const deleteInvoiceConfirmDialogRef = ref<ConfirmDialogExposed>();
const _invoiceToDelete = ref<string | undefined>();

const onAddInvoice           = () => router.push('/invoices/new');

const onSendBtnClick = (invoiceId: string | undefined) => {
  if (!invoiceId) {
    return;
  }

  // router.push(`/invoices/${invoiceId}/send/`);
};

const onViewPdfBtnClick = (invoiceId: string | undefined) => {
  if (!invoiceId) {
    return;
  }
  
  router.push(`/invoices/view/${invoiceId}`)
};

const onEditInvoice          = (id: string) => router.push(`/invoices/edit/${id}`);
const onDeleteBtnClick       = (id?: string) => { if (!id) return; _invoiceToDelete.value = id; deleteInvoiceConfirmDialogRef.value?.open(); };
const onConfirmDeleteInvoice = () => { if (_invoiceToDelete.value) deleteInvoice(_invoiceToDelete.value); };

const statusColor = (s?: string) => ({ pending: 'orange', validated: 'success', accepted: 'success', signed: 'success', sent: 'blue', draft: 'grey', cancel: 'error' } as Record<string,string>)[s ?? ''] ?? 'default';
const statusLabel = (s?: string) => ({ pending: 'En attente', validated: 'Payé', accepted: 'Accepté', signed: 'Signé', sent: 'Envoyé', draft: 'Brouillon', cancel: 'Annulé' } as Record<string,string>)[s ?? ''] ?? (s ?? '');

onMounted(async () => {
  const userId = authState.user?.value?.id;
  await Promise.all([
    init(),
    userId ? companySettingsUseCase.getByUserId(userId).then(c => { _company.value = c; }) : Promise.resolve(),
  ]);
});
</script>

<style scoped>
.preset-scroll {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 4px;
  padding-bottom: 4px;
  scrollbar-width: none;
}
.preset-scroll::-webkit-scrollbar { display: none; }

.selection-bar-mobile {
  border-top: 1px solid rgba(var(--v-border-color), 0.12);
  background: rgba(var(--v-theme-primary), 0.05);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.2s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(8px); }
</style>
