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
            Devis
          </h1>
          <p class="text-body-2 text-medium-emphasis mb-0">
            {{ monthLabel }} · {{ quotes.length }} devis
          </p>
        </div>
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-plus"
          @click="onAddQuote"
        >
          Nouveau devis
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
                Montant accepté · {{ currentMonthShort }}
              </div>
              <div class="stat-value">
                {{ formatCurrency(kpiAccepteAmount) }}
              </div>
              <div class="stat-sub">
                accepté ce mois
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
                En attente de réponse
              </div>
              <div class="stat-value">
                {{ formatCurrency(kpiEnAttenteAmount) }}
              </div>
              <div class="stat-sub">
                {{ kpiEnAttenteCount }} devis envoyé{{ kpiEnAttenteCount > 1 ? 's' : '' }}
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
                Acceptés ce mois
              </div>
              <div class="stat-value">
                {{ kpiAccepteCount }}
              </div>
              <div class="stat-sub">
                devis signés ou validés
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
                Refusés
              </div>
              <div
                class="stat-value"
                :class="kpiRefuseCount > 0 ? 'text-error' : ''"
              >
                {{ kpiRefuseCount }}
              </div>
              <div class="stat-sub">
                {{ kpiRefuseCount > 0 ? `${kpiRefuseCount} à traiter` : 'Aucun devis refusé' }}
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
            placeholder="Rechercher un devis, un client…"
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
              label="Du"
              type="date"
              density="compact"
              variant="outlined"
              hide-details
              style="max-width: 160px;"
            />
            <v-text-field
              v-model="dateTo"
              label="Au"
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
            Réinitialiser
          </v-btn>
          <v-spacer />
          <v-btn
            variant="outlined"
            prepend-icon="mdi-download-outline"
            :disabled="selectedQuotes.length === 0"
            :loading="downloading"
            @click="onBulkDownload"
          >
            Exporter
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
          no-data-text="Aucun devis trouvé"
          hover
          :row-props="rowProps"
          class="quotes-table"
          items-per-page-text="Lignes par page"
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
              Modifié · à renvoyer
            </v-chip>
            <span
              v-else
              class="text-body-2 text-disabled"
            >
              Non envoyé
            </span>
          </template>

          <!-- CONVERTI -->
          <template #item.converted="{ item }">
            <v-avatar
              size="26"
              :color="isConverted(item) ? 'success' : 'default'"
              variant="tonal"
              :title="isConverted(item) ? 'Converti en facture' : 'Non converti en facture'"
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
              title="Consulter"
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
                  title="Envoyer"
                  @click="onSendBtnClick(item.id)"
                />
                <v-list-item
                  prepend-icon="mdi-file-pdf-box"
                  title="Voir PDF"
                  @click="onViewPdfBtnClick(item.id)"
                />
                <v-list-item
                  v-if="!isLocked(item)"
                  prepend-icon="mdi-pencil-outline"
                  title="Modifier le devis"
                  @click="onEditQuote(item.id)"
                />
                <v-list-item
                  v-if="!isLocked(item)"
                  prepend-icon="mdi-format-list-bulleted-square"
                  title="Ajouter des éléments"
                  @click="onEditItems(item.id)"
                />
                <v-divider
                  v-if="canAccept(item) || canRefuse(item) || canConvert(item)"
                  class="my-1"
                />
                <v-list-item
                  v-if="canAccept(item)"
                  prepend-icon="mdi-check-circle-outline"
                  title="Marquer accepté"
                  @click="onSetStatus(item.id, 'accepted')"
                />
                <v-list-item
                  v-if="canRefuse(item)"
                  prepend-icon="mdi-close-circle-outline"
                  title="Marquer refusé"
                  @click="onSetStatus(item.id, 'refused')"
                />
                <v-list-item
                  v-if="canConvert(item)"
                  prepend-icon="mdi-receipt-text-check-outline"
                  title="Convertir en facture"
                  @click="onConvertToInvoice(item.id)"
                />
                <template v-if="!isLocked(item)">
                  <v-divider class="my-1" />
                  <v-list-item
                    prepend-icon="mdi-delete-outline"
                    title="Supprimer"
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
    title="Supprimer le devis"
    message="Ce devis sera supprimé définitivement. Continuer ?"
    confirm-label="Supprimer"
    cancel-label="Annuler"
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
import { EMPTY_QUOTE_ERROR } from '@/features/quotes/application/useCases/SendQuoteUseCase';

  const { authState, useQuoteState, generatePdfUseCase, organizationProfileUseCase } = useQuotesPageDependencies();

const router = useRouter();
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
const sentOptions = [
  { title: 'Envoyés / non envoyés', value: 'all' },
  { title: 'Envoyés', value: 'sent' },
  { title: 'Non envoyés', value: 'notSent' },
];
const convertedOptions = [
  { title: 'Convertis / non convertis', value: 'all' },
  { title: 'Convertis en facture', value: 'converted' },
  { title: 'Non convertis', value: 'notConverted' },
];
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
  { key: 'all',      label: 'Tous',       count: tabSource.value.length },
  { key: 'draft',    label: 'Brouillons',  count: tabSource.value.filter(isDraft).length },
  { key: 'pending',  label: 'En attente',  count: tabSource.value.filter(isSentPending).length },
  { key: 'accepted', label: 'Acceptés',   count: tabSource.value.filter(isAccepted).length },
  { key: 'refused',  label: 'Refusés',    count: tabSource.value.filter(isRefused).length },
]);

const quoteGarageName = (q: QuoteViewModel) => q.garage?.name ?? '';

const statusOptions = computed(() => tabs.value.map(tab => ({ title: `${tab.key === 'all' ? 'Tous les statuts' : tab.label} · ${tab.count}`, value: tab.key })));
const garageOptions = computed(() => [
  { title: 'Tous les garages', value: 'all' },
  ...[...new Set(quotes.value.map(quoteGarageName).filter(Boolean))].sort().map(name => ({ title: name, value: name })),
]);
const periodOptions = [
  ...datePresets.map(preset => ({ title: preset.key === 'all' ? 'Toutes les dates' : preset.label, value: preset.key })),
  { title: 'Personnalisée', value: 'custom' as const },
];

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
  if (isRefused(q))     return { label: 'Refusé',    color: 'error'     };
  if (isAccepted(q)) {
    return { label: 'Accepté', color: 'success' };
  }
  if (isSentPending(q)) return { label: 'En attente', color: 'warning' };
  return { label: 'Brouillon', color: 'default' };
};
const chipLabel    = (q: QuoteViewModel) => chipInfo(q).label;
const chipColor    = (q: QuoteViewModel) => chipInfo(q).color;

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
  { title: 'ENVOYÉ',     key: 'sentAt',      sortable: false },
  { title: 'STATUT',     key: 'status',      sortable: false },
  { title: 'CONVERTI EN FACTURE', key: 'converted',   sortable: false, align: 'center' as const },
  { title: '',           key: 'actions',     sortable: false },
];

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
    showSnack('Devis envoyé avec succès !');
  } catch (e) {
    showSnack(e instanceof Error && e.message === EMPTY_QUOTE_ERROR ? e.message : "Erreur lors de l'envoi du devis.", 'error');
  }
};

const onSetStatus = async (quoteId: string | undefined, statusCode: 'accepted' | 'refused') => {
  if (!quoteId) return;
  try {
    await setStatus(quoteId, statusCode);
    showSnack(statusCode === 'accepted' ? 'Devis marqué comme accepté.' : 'Devis marqué comme refusé.');
  } catch {
    showSnack('Erreur lors du changement de statut.', 'error');
  }
};

const onConvertToInvoice = async (quoteId?: string) => {
  if (!quoteId) return;
  try {
    const invoiceId = await convertToInvoice(quoteId);
    showSnack('Devis converti en facture !');
    setSelectedInvoiceGuid(invoiceId);
    router.push('/invoices/edit');
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
        zip.file(`devis-${quote.quoteNumber}.pdf`, await (await fetch(url)).blob());
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
