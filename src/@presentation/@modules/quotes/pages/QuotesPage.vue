<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-3 pa-sm-4"
    >
      <!-- ── HEADER PAGE ─────────────────────────────────────── -->


      <!-- ── FILTER CARD ─────────────────────────────────────── -->
      <PeriodFilterBar
        v-model:date-from="dateFrom"
        v-model:date-to="dateTo"
        v-model:active-preset="activePreset"
        :date-presets="datePresets"
        :has-active-filter="hasActiveFilter"
        @preset-change="applyPreset"
        @clear="clearFilter"
      >
        <template #bottom-bar>
          <!-- Barre sélection mobile -->
          <transition name="slide-up">
            <div
              v-if="selectedQuotes.length > 0 && mobile"
              class="selection-bar-mobile px-3 py-2 d-flex align-center gap-2"
            >
              <span class="text-body-2 font-weight-medium">{{ selectedQuotes.length }} sélectionné(s)</span>
              <v-spacer />
              <v-btn
                variant="text"
                size="small"
                @click="selectedQuotes = []"
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
        </template>
      </PeriodFilterBar>

      <!-- ── TABLE ───────────────────────────────────────────── -->
      <v-card
        flat
        rounded="lg"
        border
      >
        <v-data-table
          v-model="selectedQuotes"
          :headers="activeHeaders"
          :items="filteredQuotes"
          :sort-by="[{ key: 'createdAt', order: 'desc' }]"
          show-select
          item-value="id"
          return-object
          no-data-text="Aucun devis trouvé"
        >
          <template #top>
            <v-toolbar flat>
              <v-toolbar-title>
                <v-icon
                  color="medium-emphasis"
                  icon="mdi-book-multiple"
                  size="x-small"
                  start
                />

                Gestion des devis

                <span class="text-caption text-medium-emphasis ml-4">
                  {{ filteredQuotes.length }} devis<span v-if="hasActiveFilter"> · période sélectionnée</span>
                </span>
                
                <span
                  v-if="selectedQuotes.length > 0"
                  class="text-body-2 text-medium-emphasis ml-2"
                >({{ selectedQuotes.length }} sélectionné(s))</span>
              </v-toolbar-title>

              <div>
                <transition name="fade">
                  <div
                    v-if="!mobile"
                    class="d-flex align-center gap-2"
                  >
                    <v-btn
                      color="primary"
                      variant="flat"
                      prepend-icon="mdi-download-multiple"
                      rounded="lg"
                      :loading="downloading"
                      :disabled="selectedQuotes.length === 0"
                      @click="onBulkDownload"
                    >
                      Télécharger ZIP
                    </v-btn>
                  </div>
                </transition>
              </div>

              
              <v-btn
                class="ml-2"
                color="primary"
                prepend-icon="mdi-plus"
                rounded="lg"
                variant="flat"
                :size="mobile ? 'small' : 'default'"
                @click="onAddQuote"
              >
                <span class="d-none d-sm-inline">Ajouter un Devis</span>
                <span class="d-sm-none">Nouveau</span>
              </v-btn>
            </v-toolbar>
          </template>
          <template #item.quoteNumber="{ value }">
            <span class="font-weight-semibold text-primary">#{{ value }}</span>
          </template>

          <template #item.createdAt="{ value }">
            <span class="text-no-wrap">{{ value ? value.split('T')[0].split('-').reverse().join('/') : '' }}</span>
          </template>

          <template #item.garage="{ value }">
            {{ value?.name }}
          </template>

          <template #item.status="{ value }">
            <v-chip
              :text="statusLabel(value.code)"
              :color="statusColor(value.code)"
              size="small"
            />
          </template>

          <template #item.total="{ item }">
            <span class="font-weight-medium">
              {{ item.totalHt ? `${item.totalHt} €` : (item.isForfait ? `${item.forfaitAmount ?? 0} €` : '0 €') }}
            </span>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex align-center">
              <v-btn
                icon
                variant="text"
                size="small"
                title="Aperçu PDF"
                @click="onViewPdfBtnClick(item.id)"
              >
                <v-icon>mdi-file-pdf-box</v-icon>
              </v-btn>
              <v-btn
                icon="mdi-pencil"
                size="x-small"
                variant="text"
                @click="onEditQuote(item.id)"
              />
              <v-btn
                icon="mdi-delete"
                size="x-small"
                variant="text"
                color="error"
                :disabled="item.status.code === 'accepted' || item.status.code === 'invoiced' || item.status.code === 'cancelled'"
                @click="onDeleteBtnClick(item.id)"
              />
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
import { IRegionManager } from '@/@core/managers/interfaces/IRegionManager';
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
import { useDisplay } from 'vuetify';
import { useRoute, useRouter } from 'vue-router';

// #region -> DEPENDENCIES
const regionManager = container.get<IRegionManager>(SYMBOLS.Managers.regionManager);
const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
const useQuoteState = container.get<IUseQuotesState>(SYMBOLS.States.Quote.GetQuotesUseCase);
const generatePdfUseCase = container.get<IGenerateQuotePdfUseCase>(SYMBOLS.UseCases.Quote.GenerateQuotePdfUseCase);
const companySettingsUseCase = container.get<ICompanySettingsUseCase>(SYMBOLS.UseCases.CompanySettings);
// #endregion

// #region -> STATE
const router = useRouter();
const route = useRoute();
const { mobile } = useDisplay();
const { init, quotes, deleteQuote } = useQuoteState;
const {
  dateFrom,
  dateTo,
  activePreset,
  datePresets,
  filteredItems: filteredQuotes,
  applyPreset,
  clearFilter,
  hasActiveFilter,
} = usePeriodFilter({
  items: quotes,
  getDate: (quote) => quote.createdAt,
});
// #endregion

// #region -> REFS
const selectedQuotes = ref<QuoteViewModel[]>([]);
const downloading = ref(false);
const deleteQuoteConfirmDialogRef = ref<ConfirmDialogExposed>();
const _quoteIdToDelete = ref<string | undefined>();
const _company = ref<CompanySettingsDto | null>(null);
// #endregion

const desktopHeaders = [
  { title: 'Numéro', align: 'start' as const, key: 'quoteNumber' },
  { title: 'Date', align: 'start' as const, key: 'createdAt' },
  { title: 'Statut', align: 'start' as const, key: 'status' },
  { title: 'Modèle', key: 'carBrand' },
  { title: 'Garage', key: 'garage.name' },
  { title: 'Technicien', key: 'technician.fullName' },
  { title: 'Total', key: 'total' },
  { title: 'Actions', sortable: false, key: 'actions' },
];

const mobileHeaders = [
  { title: 'N°', align: 'start' as const, key: 'quoteNumber' },
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
  if (!selectedQuotes.value.length) return;
  downloading.value = true;
  try {
    const zip = new JSZip();
    let success = 0;
    for (const quote of selectedQuotes.value) {
      try {
        const dto   = QuoteMapper.viewToDto(quote);
        const lines = (quote.lineItems ?? []).map(LineItemMapper.viewToDto);
        const url   = await generatePdfUseCase.execute(dto, lines, _company.value);
        const blob  = await fetch(url).then(r => r.blob());
        zip.file(`devis-${quote.quoteNumber}.pdf`, blob);
        URL.revokeObjectURL(url);
        success++;
      } catch (e) {
        console.error(`Erreur PDF devis ${quote.quoteNumber}:`, e);
      }
    }
    if (success === 0) { showSnack("Aucun PDF n'a pu être généré.", 'error'); return; }
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = `devis_${new Date().toISOString().split('T')[0]}.zip`;
    link.click();
    URL.revokeObjectURL(link.href);
    showSnack(`${success} devis téléchargé(s) dans le ZIP.`);
    selectedQuotes.value = [];
  } finally {
    downloading.value = false;
  }
};


const onAddQuote = () => {
  router.push('/quotes/add');
}

const onViewPdfBtnClick = (quoteId: string | undefined) => {
  if (!quoteId) {
    return;
  }
  
  router.push(`/quotes/${quoteId}/view`)
};

const onEditQuote = (quoteId: string | undefined) => {
  if (!quoteId) {
    return;
  }

  router.push(`/quotes/${quoteId}/edit/`);
}

const onDeleteBtnClick = (quoteId: string | undefined) => {
  if (!quoteId) {
    return;
  }

  _quoteIdToDelete.value = quoteId;
  deleteQuoteConfirmDialogRef.value?.open();
};

const onConfirmDeleteQuote = () => {
  if (_quoteIdToDelete.value) {
    deleteQuote(_quoteIdToDelete.value);
  }
};

const statusColor = (s?: string) => ({ invoiced: 'red', processing: 'blue', pending: 'orange', validated: 'success', accepted: 'success', signed: 'success', sent: 'blue', draft: 'grey', cancel: 'error' } as Record<string,string>)[s ?? ''] ?? 'default';
const statusLabel = (s?: string) => ({ invoiced: 'Facturé', processing: 'En cours', pending: 'En attente', validated: 'Payé', accepted: 'Accepté', signed: 'Signé', sent: 'Envoyé', draft: 'Brouillon', cancel: 'Annulé' } as Record<string,string>)[s ?? ''] ?? (s ?? '');

onMounted(async () => {
  const userId = authState.user?.value?.id;
  await Promise.all([
    init(),
    userId ? companySettingsUseCase.getByUserId(userId).then(c => { _company.value = c; }) : Promise.resolve(),
  ]);
});
</script>

<style scoped>
.selection-bar-mobile {
  border-top: 1px solid rgba(var(--v-border-color), 0.12);
  background: rgba(var(--v-theme-primary), 0.05);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.2s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(8px); }
</style>
