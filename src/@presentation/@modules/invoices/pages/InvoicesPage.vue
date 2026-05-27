<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-3 pa-sm-4"
    >
      <div class="d-flex mb-3 pb-1 align-center justify-space-between gap-2">
        <div class="d-flex align-center gap-2">
          <v-btn
            icon
            variant="text"
            :class="[{ 'bg-primary text-white': showFilters }, { 'bg-transparent text-primary': !showFilters }]"
            @click="showFilters = !showFilters"
          >
            <v-icon>mdi-filter-cog-outline</v-icon>
          </v-btn>
          <span
            v-if="filterCount > 0"
            class="text-caption font-weight-medium"
            style="margin-left: 8px;"
          >
            {{ filterCount === 1 ? '1 filtre sélectionné' : filterCount + ' filtres sélectionnés' }}
          </span>
          <v-btn
            v-if="filterCount > 0"
            icon
            size="small"
            variant="text"
            color="grey-darken-2"
            style="margin-left: 2px; display: flex; align-items: center; justify-content: center; height: 24px; width: 24px;"
            title="Réinitialiser les filtres"
            @click="clearFilter"
          >
            <v-icon size="18">
              mdi-close-circle
            </v-icon>
          </v-btn>
        </div>
        <div class="d-flex gap-2">
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
                  :disabled="selectedInvoices.length === 0"
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
            @click="onAddInvoice"
          >
            <span class="d-none d-sm-inline">
              Ajouter une Facture
            </span>

            <span class="d-sm-none">
              Nouvelle
            </span>
          </v-btn>
        </div>
      </div>

      <!-- FILTER BAR (toggle) -->
      <transition name="fade">
        <div
          v-if="showFilters"
          class="v-row invoice-page-filters"
        >
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
              <transition name="slide-up">
                <div
                  v-if="selectedInvoices.length > 0 && mobile"
                  class="selection-bar-mobile px-3 py-2 d-flex align-center gap-2"
                >
                  <span class="text-body-2 font-weight-medium">
                    {{ selectedInvoices.length }} sélectionné(s)
                  </span>

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
            </template>
          </PeriodFilterBar>
        </div>
      </transition>

      <v-data-table
        v-model="selectedInvoices"
        :headers="activeHeaders"
        :items="filteredInvoices"
        :sort-by="[{ key: 'createdAt', order: 'desc' }]"
        show-select
        item-value="id"
        return-object
        no-data-text="Aucune facture trouvée"
        class="text-subtitle-2"
      >
        <template #item.invoiceNumber="{ value }">
          <span class="font-weight-semibold text-primary">
            #{{ value }}
          </span>
        </template>

        <template #item.createdAt="{ value }">
          <span class="text-no-wrap">
            {{
              value
                ? new Date(value).toLocaleDateString('fr-FR')
                : ''
            }}
          </span>
        </template>

        <template #item.garage="{ value }">
          {{ value?.name }}
        </template>

        <template #item.status="{ value }">
          <v-chip
            :text="statusLabel(getStatusCode(value))"
            :color="statusColor(getStatusCode(value))"
            variant="tonal"
            size="small"
          />
        </template>

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

        <template #item.actions="{ item }">
          <div class="tw-flex tw-items-center tw-gap-1">
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
// Calcule le nombre de filtres actifs (dateFrom/dateTo)
const filterCount = computed(() => {
  // Considère la période comme un seul filtre si au moins une date est renseignée
  return (dateFrom.value || dateTo.value) ? 1 : 0;
});
const showFilters = ref(false);
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { CompanySettingsDto } from '@/@application/dtos/CompanySettingsDto';
import { ICompanySettingsUseCase } from '@/@domain/useCases/ICompanySettingsUseCase';
import { IGenerateInvoicePdfUseCase } from '@/@domain/useCases/invoices/IGenerateInvoicePdfUseCase';
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
import { useDisplay } from 'vuetify';
import { useRouter } from 'vue-router';

const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
const useInvoiceState = container.get<IUseInvoicesState>(SYMBOLS.States.Invoice.GetInvoicesUseCase);
const generatePdfUseCase = container.get<IGenerateInvoicePdfUseCase>(SYMBOLS.UseCases.Invoice.GenerateInvoicePdfUseCase);
const companySettingsUseCase = container.get<ICompanySettingsUseCase>(SYMBOLS.UseCases.CompanySettings);

const router = useRouter();
const { mobile } = useDisplay();

const {
  init,
  invoices,
  deleteInvoice
} = useInvoiceState;

const {
  dateFrom,
  dateTo,
  activePreset,
  datePresets,
  filteredItems: filteredInvoices,
  applyPreset,
  clearFilter,
  hasActiveFilter,
} = usePeriodFilter({
  items: invoices,
  getDate: invoice => invoice.createdAt,
});

const selectedInvoices = ref<InvoiceViewModel[]>([]);
const downloading = ref(false);
const _company = ref<CompanySettingsDto | null>(null);

const deleteInvoiceConfirmDialogRef = ref<ConfirmDialogExposed>();
const _invoiceToDelete = ref<string | undefined>();

const desktopHeaders = [
  { title: 'Numéro', align: 'start' as const, key: 'invoiceNumber' },
  { title: 'Date', align: 'start' as const, key: 'createdAt' },
  { title: 'Statut', align: 'start' as const, key: 'status' },
  { title: 'Modèle', key: 'carBrand' },
  { title: 'Garage', key: 'garage.name' },
  { title: 'Technicien', key: 'technician' },
  { title: 'Envoyé', key: 'sent' },
  { title: 'Total', align: 'end' as const, key: 'total', minWidth: 140 },
  { title: 'Actions', sortable: false, key: 'actions', minWidth: 200 },
];

const mobileHeaders = [
  { title: 'N°', align: 'start' as const, key: 'invoiceNumber' },
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

const getStatusCode = (status: unknown): string | undefined => {
  if (!status) {
    return undefined;
  }

  if (typeof status === 'string') {
    return status;
  }

  if (
    typeof status === 'object' &&
    'code' in status
  ) {
    return String((status as { code?: string }).code);
  }

  return undefined;
};

const onBulkDownload = async () => {
  if (!selectedInvoices.value.length) {
    return;
  }

  downloading.value = true;

  try {
    const zip = new JSZip();
    let success = 0;

    for (const invoice of selectedInvoices.value) {
      try {
        const dto = InvoiceMapper.viewToDto(invoice);
        const lines = (invoice.lineItems ?? []).map(LineItemMapper.viewToDto);

        const url = await generatePdfUseCase.execute(
          dto,
          lines,
          _company.value
        );

        const blob = await fetch(url).then(r => r.blob());

        zip.file(
          `facture-${invoice.invoiceNumber}.pdf`,
          blob
        );

        URL.revokeObjectURL(url);

        success++;
      } catch (e) {
        console.error(
          `Erreur PDF facture ${invoice.invoiceNumber}:`,
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

    const zipBlob = await zip.generateAsync({
      type: 'blob'
    });

    const link = document.createElement('a');

    link.href = URL.createObjectURL(zipBlob);
    link.download = `factures_${new Date().toISOString().split('T')[0]}.zip`;
    link.click();

    URL.revokeObjectURL(link.href);

    showSnack(
      `${success} facture(s) téléchargée(s) dans le ZIP.`
    );

    selectedInvoices.value = [];
  } finally {
    downloading.value = false;
  }
};

const onAddInvoice = () => {
  router.push('/invoices/new');
};

const onSendBtnClick = (
  invoiceId: string | undefined
) => {
  if (!invoiceId) {
    return;
  }

  // router.push(`/invoices/${invoiceId}/send/`);
};

const onViewPdfBtnClick = (
  invoiceId: string | undefined
) => {
  if (!invoiceId) {
    return;
  }

  router.push(`/invoices/view/${invoiceId}`);
};

const onEditInvoice = (
  invoiceId: string | undefined
) => {
  if (!invoiceId) {
    return;
  }

  router.push(`/invoices/edit/${invoiceId}`);
};

const onDeleteBtnClick = (
  invoiceId: string | undefined
) => {
  if (!invoiceId) {
    return;
  }

  _invoiceToDelete.value = invoiceId;

  deleteInvoiceConfirmDialogRef
    .value
    ?.open();
};

const onConfirmDeleteInvoice = () => {
  if (_invoiceToDelete.value) {
    deleteInvoice(_invoiceToDelete.value);
  }
};

const statusColor = (s?: string) => ({
  processing: 'blue',
  pending: 'orange',
  finalized: 'success',
  validated: 'success',
  accepted: 'success',
  refused: 'error',
  cancelled: 'error',
  signed: 'success',
  sent: 'blue',
  draft: 'grey',
  cancel: 'error'
} as Record<string, string>)[s ?? ''] ?? 'default';

const statusLabel = (s?: string) => ({
  processing: 'En cours',
  pending: 'En attente',
  finalized: 'Payé',
  validated: 'Payé',
  accepted: 'Accepté',
  refused: 'Refusé',
  cancelled: 'Annulé',
  signed: 'Signé',
  sent: 'Envoyé',
  draft: 'Brouillon',
  cancel: 'Annulé'
} as Record<string, string>)[s ?? ''] ?? (s ?? '');

onMounted(async () => {
  const userId = authState.user?.value?.id;

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
.invoice-page-filters {
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

.invoice-toolbar-icon {
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