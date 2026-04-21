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
            Gestion des Devis
          </h1>
          <p class="text-caption text-medium-emphasis mt-n1">
            {{ filteredQuotes.length }} devis<span v-if="dateFrom || dateTo"> · période sélectionnée</span>
          </p>
        </div>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          rounded="lg"
          :size="mobile ? 'small' : 'default'"
          @click="onAddQuote"
        >
          <span class="d-none d-sm-inline">Ajouter un Devis</span>
          <span class="d-sm-none">Nouveau</span>
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
                v-if="selectedQuotes.length > 0 && !mobile"
                class="d-flex align-center gap-2"
              >
                <span class="text-body-2 text-medium-emphasis">{{ selectedQuotes.length }} sélectionné(s)</span>
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
                  @click="selectedQuotes = []"
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
      </v-card>

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
          <template #item.quoteNumber="{ value }">
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
                :disabled="item.status.code === 'accepted' || item.status.code === 'cancelled'"
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
import { IGenerateQuotePdfUseCase } from '@/@domain/useCases/quotes/IGenerateQuotePdfUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';
import { ConfirmDialogExposed } from '@/@presentation/components/ConfirmDialog';
import ConfirmDialog from '@/@presentation/components/ConfirmDialog.vue';
import { LineItemMapper } from '@/@presentation/mappers/LineItemMapper';
import { QuoteMapper } from '@/@presentation/mappers/QuoteMapper';
import { IUseQuotesState } from '@/@presentation/types/composables/IUseQuotesState';
import { QuoteViewModel } from '@/@presentation/types/models/QuoteViewModel';
import JSZip from 'jszip';
import { computed, onMounted, reactive, ref } from 'vue';
import { useDisplay } from 'vuetify';
import { useRouter } from 'vue-router';

// #region -> DEPENDENCIES
const regionManager = container.get<IRegionManager>(SYMBOLS.Managers.regionManager);
const useQuoteState = container.get<IUseQuotesState>(SYMBOLS.States.Quote.GetQuotesUseCase);
const generatePdfUseCase = container.get<IGenerateQuotePdfUseCase>(SYMBOLS.UseCases.Quote.GenerateQuotePdfUseCase);
// #endregion

// #region -> STATE
const router = useRouter();
const { mobile } = useDisplay();
const { init, quotes, deleteQuote } = useQuoteState;
// #endregion

// #region -> REFS
const selectedQuotes = ref<QuoteViewModel[]>([]);
const downloading = ref(false);
const dateFrom = ref('');
const dateTo = ref('');
const activePreset = ref<string>('all');
const deleteQuoteConfirmDialogRef = ref<ConfirmDialogExposed>();
const _quoteIdToDelete = ref<string | undefined>();
// #endregion

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

const filteredQuotes = computed(() => {
  if (!dateFrom.value && !dateTo.value) return quotes.value;
  return quotes.value.filter(q => {
    const d = q.createdAt ? new Date(q.createdAt).toISOString().split('T')[0] : '';
    if (dateFrom.value && d < dateFrom.value) return false;
    if (dateTo.value   && d > dateTo.value)   return false;
    return true;
  });
});

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
        const url   = await generatePdfUseCase.execute(dto, lines);
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

onMounted(async () => { await init(); });
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
