<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-3 pa-sm-4"
    >
      <!-- FILTER BAR -->
      <div class="v-row quote-page-filters">
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
            <!-- MOBILE SELECTION BAR -->
            <transition name="slide-up">
              <div
                v-if="selectedQuotes.length > 0 && mobile"
                class="selection-bar-mobile px-3 py-2 d-flex align-center gap-2"
              >
                <span class="text-body-2 font-weight-medium">
                  {{ selectedQuotes.length }} sélectionné(s)
                </span>

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
      </div>

      <!-- TABLE -->
       
      <div class="d-flex mb-2">
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
          variant="flat"
          :size="mobile ? 'small' : 'default'"
          @click="onAddQuote"
        >
          <span class="d-none d-sm-inline">
            Ajouter un Devis
          </span>

          <span class="d-sm-none">
            Nouveau
          </span>
        </v-btn>
      </div>
      
      <v-data-table
        v-model="selectedQuotes"
        :headers="activeHeaders"
        :items="filteredQuotes"
        :sort-by="[{ key: 'createdAt', order: 'desc' }]"
        show-select
        item-value="id"
        return-object
        no-data-text="Aucun devis trouvé"
        class="text-subtitle-2"
      >
        <!-- NUMBER -->
        <template #item.quoteNumber="{ value }">
          <span class="font-weight-semibold text-primary">
            #{{ value }}
          </span>
        </template>

        <!-- DATE -->
        <template #item.createdAt="{ value }">
          <span class="text-no-wrap">
            {{
              value
                ? new Date(value).toLocaleDateString('fr-FR')
                : ''
            }}
          </span>
        </template>

        <!-- GARAGE -->
        <template #item.garage="{ value }">
          {{ value?.name }}
        </template>

        <!-- STATUS -->
        <template #item.status="{ value }">
          <v-chip
            :text="statusLabel(value.code)"
            :color="statusColor(value.code)"
            variant="tonal"
            size="small"
          />
        </template>

        <!-- TECHNICIAN -->
        <template #item.technician="{ item }">
          <div class="d-flex align-center ga-2 text-no-wrap">
            <!-- <v-avatar
                size="28"
                color="primary"
                variant="tonal"
              >
                <span class="text-caption font-weight-bold">
                  {{
                    `${item.assignedMember?.users?.first_name?.[0] ?? ''}${item.assignedMember?.users?.last_name?.[0] ?? ''}`
                  }}
                </span>
              </v-avatar> -->

            <span>
              {{
                `${item.assignedMember?.users?.first_name ?? ''} ${item.assignedMember?.users?.last_name ?? ''}`.trim()
              }}
            </span>
          </div>
        </template>

        <!-- SENT -->
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

        <!-- TOTAL -->
        <template #item.total="{ item }">
          <span class="text-no-wrap">
            {{
              item.totalHt
                ? `${item.totalHt} €`
                : item.isForfait
                  ? `${item.forfaitAmount ?? 0} €`
                  : '0 €'
            }}
          </span>
        </template>

        <!-- ACTIONS -->
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
                  @click="onEditQuote(item.id)"
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
      </v-data-table>
    </v-container>
  </MainLayout>

  <!-- SNACKBAR -->
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    timeout="4000"
    location="bottom right"
  >
    {{ snackbar.message }}
  </v-snackbar>

  <!-- DELETE DIALOG -->
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
import { useRouter } from 'vue-router';

const regionManager = container.get<IRegionManager>(
  SYMBOLS.Managers.regionManager
);

const authState = container.get<IAuthState>(
  SYMBOLS.States.AuthState
);

const useQuoteState = container.get<IUseQuotesState>(
  SYMBOLS.States.Quote.GetQuotesUseCase
);

const generatePdfUseCase =
  container.get<IGenerateQuotePdfUseCase>(
    SYMBOLS.UseCases.Quote.GenerateQuotePdfUseCase
  );

const companySettingsUseCase =
  container.get<ICompanySettingsUseCase>(
    SYMBOLS.UseCases.CompanySettings
  );

const router = useRouter();

const { mobile } = useDisplay();

const {
  init,
  quotes,
  deleteQuote
} = useQuoteState;

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

const selectedQuotes =
  ref<QuoteViewModel[]>([]);

const downloading = ref(false);

const deleteQuoteConfirmDialogRef =
  ref<ConfirmDialogExposed>();

const _quoteIdToDelete =
  ref<string | undefined>();

const _company =
  ref<CompanySettingsDto | null>(null);

const desktopHeaders = [
  { title: 'Numéro', align: 'start' as const, key: 'quoteNumber' },
  { title: 'Date', key: 'createdAt' },
  { title: 'Statut', key: 'status' },
  { title: 'Modèle', key: 'carBrand' },
  { title: 'Garage', key: 'garage.name' },
  { title: 'Technicien', key: 'technician' },
  { title: 'Envoyé', key: 'sent' },
  { title: 'Total', align: 'end' as const, key: 'total', minWidth: 140 },
  { title: 'Actions', sortable: false, key: 'actions', minWidth: 200 },
];

const mobileHeaders = [
  { title: 'N°', align: 'start' as const, key: 'quoteNumber' },
  { title: 'Date', key: 'createdAt' },
  { title: 'Statut', key: 'status' },
  { title: 'Total', align: 'end' as const, key: 'total', minWidth: 120 },
  { title: '', sortable: false, key: 'actions' },
];

const activeHeaders = computed(() =>
  mobile.value
    ? mobileHeaders
    : desktopHeaders
);

const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
});

const showSnack = (
  message: string,
  color = 'success'
) => {
  snackbar.message = message;
  snackbar.color = color;
  snackbar.show = true;
};

const onBulkDownload = async () => {
  if (!selectedQuotes.value.length) {
    return;
  }

  downloading.value = true;

  try {
    const zip = new JSZip();

    let success = 0;

    for (const quote of selectedQuotes.value) {
      try {
        const dto =
          QuoteMapper.viewToDto(quote);

        const lines =
          (quote.lineItems ?? [])
            .map(LineItemMapper.viewToDto);

        const url =
          await generatePdfUseCase.execute(
            dto,
            lines,
            _company.value
          );

        const blob =
          await fetch(url)
            .then(r => r.blob());

        zip.file(
          `devis-${quote.quoteNumber}.pdf`,
          blob
        );

        URL.revokeObjectURL(url);

        success++;
      } catch (e) {
        console.error(
          `Erreur PDF devis ${quote.quoteNumber}:`,
          e
        );
      }
    }

    if (success === 0) {
      showSnack(
        "Aucun PDF n'a pu être généré.",
        'error'
      );

      return;
    }

    const zipBlob =
      await zip.generateAsync({
        type: 'blob'
      });

    const link =
      document.createElement('a');

    link.href =
      URL.createObjectURL(zipBlob);

    link.download =
      `devis_${new Date()
        .toISOString()
        .split('T')[0]}.zip`;

    link.click();

    URL.revokeObjectURL(link.href);

    showSnack(
      `${success} devis téléchargé(s) dans le ZIP.`
    );

    selectedQuotes.value = [];
  } finally {
    downloading.value = false;
  }
};

const onAddQuote = () => {
  router.push('/quotes/add');
};

const onSendBtnClick = (
  quoteId: string | undefined
) => {
  if (!quoteId) {
    return;
  }
};

const onViewPdfBtnClick = (
  quoteId: string | undefined
) => {
  if (!quoteId) {
    return;
  }

  router.push(`/quotes/${quoteId}/view`);
};

const onEditQuote = (
  quoteId: string | undefined
) => {
  if (!quoteId) {
    return;
  }

  router.push(`/quotes/${quoteId}/edit/`);
};

const onDeleteBtnClick = (
  quoteId: string | undefined
) => {
  if (!quoteId) {
    return;
  }

  _quoteIdToDelete.value = quoteId;

  deleteQuoteConfirmDialogRef
    .value
    ?.open();
};

const onConfirmDeleteQuote = () => {
  if (_quoteIdToDelete.value) {
    deleteQuote(
      _quoteIdToDelete.value
    );
  }
};

const statusColor = (s?: string) => ({
  invoiced: 'secondary',
  processing: 'blue',
  pending: 'orange',
  validated: 'success',
  accepted: 'success',
  refused: 'error',
  signed: 'success',
  sent: 'blue',
  draft: 'grey',
  cancel: 'error'
} as Record<string, string>)[s ?? '']
  ?? 'default';

const statusLabel = (s?: string) => ({
  invoiced: 'Facturé',
  processing: 'En cours',
  pending: 'En attente',
  validated: 'Payé',
  accepted: 'Accepté',
  refused: 'Refusé',
  signed: 'Signé',
  sent: 'Envoyé',
  draft: 'Brouillon',
  cancel: 'Annulé'
} as Record<string, string>)[s ?? '']
  ?? (s ?? '');

onMounted(async () => {
  const userId =
    authState.user?.value?.id;

  await Promise.all([
    init(),

    userId
      ? companySettingsUseCase
          .getByUserId(userId)
          .then(c => {
            _company.value = c;
          })
      : Promise.resolve(),
  ]);
});
</script>

<style scoped>
.quote-page-filters {
  position: sticky;

  top: 80px;

  z-index: 5;

  padding-bottom: 12px;
  margin-bottom: 12px;

  background: rgb(var(--v-theme-lightprimary), 1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.selection-bar-mobile {
  border-top:
    1px solid rgba(var(--v-border-color), 0.12);

  background:
    rgba(var(--v-theme-primary), 0.05);
}

.quote-toolbar-icon {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 12px;

  background:
    rgba(var(--v-theme-primary), 0.08);

  color:
    rgb(var(--v-theme-primary));
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition:
    all 0.2s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;

  transform:
    translateY(8px);
}
</style>