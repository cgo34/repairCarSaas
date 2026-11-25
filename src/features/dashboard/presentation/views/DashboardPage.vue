<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-0"
    >
      <HailAlertWidget
        compact
        class="mb-4"
      />

      <!-- Compteurs -->
      <v-row>
        <v-col
          v-for="c in counters"
          :key="c.title"
          cols="6"
          md="3"
        >
          <v-card
            variant="flat"
            class="bg-surface border rounded-lg pa-3 d-flex align-center ga-3"
          >
            <v-avatar
              :color="c.color"
              variant="tonal"
              size="36"
            >
              <v-icon
                :icon="c.icon"
                size="20"
              />
            </v-avatar>
            <div>
              <div class="stat-value">
                {{ loading ? '…' : c.value }}
              </div>
              <div class="stat-sub">
                {{ c.title }}
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Montants -->
      <v-row>
        <v-col
          v-for="h in heroCards"
          :key="h.title"
          cols="12"
          md="4"
        >
          <v-card
            variant="flat"
            class="bg-surface border rounded-lg pa-4 h-100 d-flex align-center ga-4"
          >
            <v-avatar
              :color="h.color"
              variant="tonal"
              size="48"
            >
              <v-icon
                :icon="h.icon"
                size="26"
              />
            </v-avatar>
            <div>
              <div class="stat-label">
                {{ h.title }}
              </div>
              <div class="stat-value">
                {{ loading ? '…' : h.value }}
              </div>
              <div class="stat-sub">
                {{ h.caption }}
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          cols="12"
          md="8"
          class="d-flex flex-column ga-4"
        >
          <v-card
            variant="flat"
            class="bg-surface border rounded-lg h-100"
          >
            <v-card-title class="text-subtitle-1 font-weight-bold pt-4">
              {{ t('dashboard.recent') }}
            </v-card-title>
            <v-tabs
              v-model="tab"
              color="primary"
            >
              <v-tab value="quotes">
                {{ t('dashboard.tabs.quotes', { count: totalQuotes }) }}
              </v-tab>
              <v-tab value="invoices">
                {{ t('dashboard.tabs.invoices', { count: totalInvoices }) }}
              </v-tab>
            </v-tabs>
            <v-divider />
            <v-table hover>
              <thead>
                <tr>
                  <th>{{ t('dashboard.table.number') }}</th>
                  <th>{{ t('dashboard.table.client') }}</th>
                  <th>{{ t('dashboard.table.vehicle') }}</th>
                  <th>{{ t('dashboard.table.date') }}</th>
                  <th>{{ t('dashboard.table.technician') }}</th>
                  <th class="text-right">
                    {{ t('dashboard.table.amountHt') }}
                  </th>
                  <th>{{ t('dashboard.table.sent') }}</th>
                  <th>{{ t('dashboard.table.status') }}</th>
                  <th
                    v-if="tab === 'quotes'"
                    class="text-center"
                  >
                    {{ t('dashboard.table.converted') }}
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                <tr v-if="loading">
                  <td
                    :colspan="tab === 'quotes' ? 10 : 9"
                    class="text-center py-4"
                  >
                    {{ t('dashboard.loading') }}
                  </td>
                </tr>
                <tr v-else-if="rows.length === 0">
                  <td
                    :colspan="tab === 'quotes' ? 10 : 9"
                    class="text-center py-4 text-disabled"
                  >
                    {{ tab === 'quotes' ? t('dashboard.noQuote') : t('dashboard.noInvoice') }}
                  </td>
                </tr>
                <tr
                  v-for="r in rows"
                  :key="r.id"
                  style="cursor: pointer"
                  @click="onRowClick($event, r)"
                >
                  <td class="font-weight-medium text-primary">
                    {{ r.number }}
                  </td>
                  <td class="font-weight-medium">
                    {{ r.garage }}
                  </td>
                  <td class="text-medium-emphasis">
                    {{ r.vehicle }}
                  </td>
                  <td>{{ r.date }}</td>
                  <td>
                    <div class="d-flex align-center ga-2">
                      <v-avatar
                        size="26"
                        :color="r.techColor"
                        variant="tonal"
                      >
                        <span style="font-size:10px; font-weight:700">{{ r.techInitials }}</span>
                      </v-avatar>
                      <span>{{ r.techName }}</span>
                    </div>
                  </td>
                  <td class="text-right font-weight-medium">
                    {{ euro(r.amount) }}
                  </td>
                  <!-- Envoyé : date d'envoi (avant le statut, ordre chronologique) -->
                  <td>
                    <v-chip
                      v-if="r.sentAt"
                      size="small"
                      variant="tonal"
                      rounded="pill"
                      color="primary"
                      prepend-icon="mdi-send-check"
                    >
                      {{ r.sentAt }}
                    </v-chip>
                    <span
                      v-else
                      class="text-disabled"
                    >{{ t('dashboard.table.notSent') }}</span>
                  </td>
                  <!-- Statut du devis / de la facture -->
                  <td>
                    <v-chip
                      size="small"
                      variant="tonal"
                      rounded="pill"
                      :color="r.color"
                    >
                      {{ r.status }}
                    </v-chip>
                  </td>
                  <td
                    v-if="tab === 'quotes'"
                    class="text-center"
                  >
                    <v-avatar
                      size="26"
                      :color="r.converted ? 'success' : 'default'"
                      variant="tonal"
                      :title="r.converted ? t('dashboard.table.converted') : t('dashboard.table.notConverted')"
                    >
                      <v-icon
                        size="16"
                        :icon="r.converted ? 'mdi-check' : 'mdi-close'"
                      />
                    </v-avatar>
                  </td>
                  <td class="text-right">
                    <v-menu v-if="tab === 'quotes'">
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
                        <v-list-item
                          prepend-icon="mdi-file-pdf-box"
                          :title="t('dashboard.actions.viewPdf')"
                          @click="openQuote(r.id, '/quotes/preview')"
                        />
                        <v-list-item
                          v-if="!r.locked"
                          prepend-icon="mdi-pencil-outline"
                          :title="t('dashboard.actions.editQuote')"
                          @click="openQuote(r.id, '/quotes/edit')"
                        />
                        <v-list-item
                          v-if="!r.locked"
                          prepend-icon="mdi-format-list-bulleted-square"
                          :title="t('dashboard.actions.addItems')"
                          @click="openQuote(r.id, '/quotes/edit/items')"
                        />
                      </v-list>
                    </v-menu>
                    <v-btn
                      v-else
                      size="small"
                      variant="text"
                      color="primary"
                      @click="openInvoice(r.id, r.to)"
                    >
                      {{ t('dashboard.actions.view') }}
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
            <div class="pa-3 text-right">
              <v-btn
                variant="text"
                color="primary"
                :to="tab === 'quotes' ? '/quotes' : '/invoices'"
              >
                {{ t('dashboard.seeAll') }}
              </v-btn>
            </div>
          </v-card>
          <v-card
            variant="flat"
            class="bg-surface border rounded-lg pa-4"
          >
            <div class="text-subtitle-1 font-weight-bold mb-2">
              {{ t('dashboard.company.summary') }}
            </div>
            <v-row>
              <v-col
                v-for="r in summaryRows"
                :key="r.label"
                cols="12"
                sm="6"
              >
                <div class="d-flex justify-space-between py-2 border-b text-body-2">
                  <span class="text-medium-emphasis">{{ r.label }}</span>
                  <strong :class="r.value ? '' : 'text-medium-emphasis'">{{ r.value || t('dashboard.company.notProvided') }}</strong>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          md="4"
          class="d-flex flex-column ga-4"
        >
          <v-card
            variant="flat"
            class="bg-surface border rounded-lg pa-4 flex-grow-1"
          >
            <div class="text-subtitle-1 font-weight-bold">
              {{ t('dashboard.organization.title') }}
            </div>
            <div class="text-body-2 text-medium-emphasis">
              {{ organizationName }}
            </div>

            <div class="text-overline text-medium-emphasis mt-4">
              {{ t('dashboard.organization.quickAccess') }}
            </div>
            <v-list
              density="compact"
              class="pa-0"
            >
              <v-list-item
                v-for="s in shortcuts"
                :key="s.to"
                :to="s.to"
                :prepend-icon="s.icon"
                :title="s.title"
                rounded
              >
                <template
                  v-if="s.count !== undefined"
                  #append
                >
                  <v-chip
                    size="x-small"
                    variant="tonal"
                  >
                    {{ s.count }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>

            <template v-if="missingProfileFields.length">
              <div class="text-overline text-medium-emphasis mt-4">
                {{ t('dashboard.organization.toComplete') }}
              </div>
              <v-list
                density="compact"
                class="pa-0"
              >
                <v-list-item
                  v-for="m in missingProfileFields"
                  :key="m"
                  to="/organization/profile"
                  :title="m"
                  rounded
                >
                  <template #append>
                    <v-chip
                      size="x-small"
                      color="warning"
                      variant="tonal"
                    >
                      {{ t('dashboard.organization.missing') }}
                    </v-chip>
                  </template>
                </v-list-item>
              </v-list>
            </template>
          </v-card>
          <v-card
            variant="flat"
            class="bg-surface border rounded-lg pa-4"
          >
            <div class="text-subtitle-1 font-weight-bold mb-2">
              {{ t('dashboard.subscription.title') }}
            </div>
            <div class="d-flex justify-space-between py-2 border-b text-body-2">
              <span class="text-medium-emphasis">{{ t('dashboard.subscription.plan') }}</span>
              <v-chip
                size="small"
                variant="tonal"
                :color="isFreePlan ? 'grey' : 'success'"
              >
                {{ planName }}
              </v-chip>
            </div>
            <div class="d-flex justify-space-between py-2 text-body-2">
              <span class="text-medium-emphasis">{{ t('dashboard.subscription.users') }}</span>
              <strong>{{ seatsUsed }} / {{ seatsLimit || '—' }}</strong>
            </div>
            <v-progress-linear
              :model-value="seatsLimit ? Math.min(100, (seatsUsed / seatsLimit) * 100) : 0"
              :color="seatLimitReached ? 'warning' : 'primary'"
              rounded
              height="8"
              class="mb-2"
            />
            <div
              v-if="seatLimitReached"
              class="text-caption text-warning mb-3"
            >
              {{ t('dashboard.subscription.limitReached') }}<span v-if="extraSeatPrice"> · {{ t('dashboard.subscription.extraSeat', { price: euro(extraSeatPrice) }) }}</span>
            </div>
            <v-btn
              class="mt-2"
              block
              variant="outlined"
              color="primary"
              to="/subscription"
            >
              {{ t('dashboard.subscription.manage') }}
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatCurrency, formatDate } from '@/app/i18n/formatters';
import { useRouter } from 'vue-router';
import MainLayout from '@/app/layouts/MainLayout.vue';
import { setSelectedQuoteGuid } from '@/features/quotes/presentation/utils/quoteSelection';
import { setSelectedInvoiceGuid } from '@/features/invoices/presentation/utils/invoiceSelection';
import { useAdminDashboardState } from '@/features/dashboard/composition/useAdminDashboardState';
import { quoteStatusChip, invoiceStatusChip } from '@/features/dashboard/presentation/labels/documentStatusLabels';
import HailAlertWidget from '@/features/dashboard/presentation/components/HailAlertWidget.vue';
import { useAuthState } from '@/features/auth/composition/useAuthState';

useAuthState();
const { t } = useI18n();

const router = useRouter();
const openQuote = (id: string | undefined, path: string) => {
  if (!id) return;
  setSelectedQuoteGuid(id);
  router.push(path);
};

const openInvoice = (id: string | undefined, path: string) => {
  if (!id) return;
  setSelectedInvoiceGuid(id);
  router.push(path);
};

const onRowClick = (e: MouseEvent, r: { id?: string; to: string; locked: boolean }) => {
  if ((e.target as HTMLElement).closest('button, a, .v-menu')) return;
  if (tab.value === 'quotes') openQuote(r.id, r.locked ? '/quotes/view' : '/quotes/edit');
  else openInvoice(r.id, r.to);
};
const {
  totalUsers,
  totalGarages,
  totalQuotes,
  quotesProcessing,
  quotesFinalized,
  recentQuotes,
  totalInvoices,
  invoicesPending,
  invoicesValidated,
  recentInvoices,
  paidAmount,
  unpaidAmount,
  unpaidCount,
  unpaidSentCount,
  unpaidUnsentCount,
  openQuotesAmount,
  openQuotesProcessingCount,
  openQuotesAcceptedCount,
  organizationName,
  planName,
  isFreePlan,
  seatsLimit,
  seatsUsed,
  seatLimitReached,
  extraSeatPrice,
  missingProfileFields,
  companySummary,
  loading,
  fetchDashboardStats,
} = useAdminDashboardState();

const tab = ref<'quotes' | 'invoices'>('quotes');

const euro = (n: number) =>
  formatCurrency(n);



const heroCards = computed(() => [
  {
    title: t('dashboard.hero.received'),
    value: euro(paidAmount.value),
    caption: t('dashboard.hero.paidInvoices', invoicesValidated.value),
    icon: 'mdi-cash-check',
    color: 'success',
  },
  {
    title: t('dashboard.hero.toCollect'),
    value: euro(unpaidAmount.value),
    caption: `${t('dashboard.hero.unpaidInvoices', unpaidCount.value)} · ${t('dashboard.hero.sentCount', unpaidSentCount.value)}, ${t('dashboard.hero.toSend', { count: unpaidUnsentCount.value })}`,
    icon: 'mdi-clock-outline',
    color: 'warning',
  },
  {
    title: t('dashboard.hero.quotes'),
    value: euro(openQuotesAmount.value),
    caption: `${t('dashboard.hero.inProgress', { count: openQuotesProcessingCount.value })} · ${t('dashboard.hero.acceptedCount', openQuotesAcceptedCount.value)}`,
    icon: 'mdi-file-document-outline',
    color: 'info',
  },
]);

const counters = computed(() => [
  { title: t('dashboard.counters.quotesPending'), value: quotesProcessing.value, icon: 'mdi-clock-outline', color: 'warning' },
  { title: t('dashboard.counters.quotesFinalized'), value: quotesFinalized.value, icon: 'mdi-check-circle-outline', color: 'info' },
  { title: t('dashboard.counters.invoicesPending'), value: invoicesPending.value, icon: 'mdi-receipt-text-clock-outline', color: 'warning' },
  { title: t('dashboard.counters.invoicesPaid'), value: invoicesValidated.value, icon: 'mdi-check-decagram-outline', color: 'success' },
]);

const shortcuts = computed(() => [
  { title: t('dashboard.shortcuts.users'), icon: 'mdi-account-group-outline', to: '/organization/members', count: totalUsers.value },
  { title: t('dashboard.shortcuts.garages'), icon: 'mdi-store-outline', to: '/organization/garages', count: totalGarages.value },
  { title: t('dashboard.shortcuts.settings'), icon: 'mdi-cog-outline', to: '/organization/profile', count: undefined },
  { title: t('dashboard.shortcuts.pricing'), icon: 'mdi-tag-outline', to: '/organization/pricing', count: undefined },
]);

const TECH_COLORS = ['#2B54E0', '#15915F', '#F5871F', '#D8443A', '#9AA2B1'];

const shortDate = (d?: string | Date | null) =>
  d ? formatDate(d, { day: 'numeric', month: 'long' }) : '—';

type CommonSource = {
  carBrand?: string;
  carImmatriculation?: string;
  createdAt?: string | Date;
  isSent?: boolean;
  sentAt?: string | Date | null;
  assignedMember?: { users?: { first_name?: string; last_name?: string } };
};

const commonColumns = (s: CommonSource) => {
  const first = s.assignedMember?.users?.first_name ?? '';
  const last = s.assignedMember?.users?.last_name ?? '';
  const initials = `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase() || '?';
  const hash = initials.charCodeAt(0) + (initials.charCodeAt(1) || 0);
  return {
    vehicle: [s.carBrand, s.carImmatriculation].filter(Boolean).join(' · ') || '—',
    date: shortDate(s.createdAt),
    techInitials: initials,
    techName: first || last ? `${first}${last ? ` ${last[0]}.` : ''}` : '—',
    techColor: TECH_COLORS[hash % TECH_COLORS.length],
    sentAt: s.isSent ? shortDate(s.sentAt) : '',
  };
};

const rows = computed(() =>
  tab.value === 'quotes'
    ? recentQuotes.value.map(q => {
      const chip = quoteStatusChip(q.status?.code);
      return {
        id: q.id,
        number: q.quoteNumber,
        garage: q.garage?.name ?? q.garageName ?? '—',
        ...commonColumns(q),
        status: chip.label,
        color: chip.color,
        amount: q.totalHt ?? 0,
        to: '/quotes/edit',
        converted: Boolean(q.convertToInvoice),
        locked: Boolean(q.convertToInvoice) || ['accepted', 'signed', 'validated', 'invoiced'].includes(q.status?.code ?? ''),
      };
    })
    : recentInvoices.value.map(i => {
      const chip = invoiceStatusChip(i.status);
      return {
        id: i.id,
        number: i.invoiceNumber,
        garage: i.garage?.name ?? i.garageName ?? '—',
        ...commonColumns(i),
        status: chip.label,
        color: chip.color,
        amount: i.totalHt ?? 0,
        to: '/invoices/edit',
        converted: false,
        locked: false,
      };
    })
);

const summaryRows = computed(() => [
  { label: 'SIREN', value: companySummary.value.siren },
  { label: t('dashboard.company.address'), value: companySummary.value.address },
  { label: 'SIRET', value: companySummary.value.siret },
  { label: 'IBAN', value: companySummary.value.iban },
  { label: t('dashboard.company.vatNumber'), value: companySummary.value.tva },
  { label: t('dashboard.company.paymentDelay'), value: companySummary.value.paymentDelay },
]);
onMounted(async () => {
  await fetchDashboardStats();
});
</script>
