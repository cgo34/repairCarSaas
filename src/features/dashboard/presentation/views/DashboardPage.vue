<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-0"
    >
      <div class="mb-4">
        <h1 class="text-h4 font-weight-bold">
          Bonjour{{ firstName ? ` ${firstName}` : '' }} 👋
        </h1>
        <div class="text-body-2 text-medium-emphasis">
          Voici l'activité de votre organisation.
        </div>
      </div>

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
              <div class="text-h6 font-weight-bold">
                {{ loading ? '…' : c.value }}
              </div>
              <div class="text-caption text-medium-emphasis">
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
              <div class="text-subtitle-2 text-medium-emphasis">
                {{ h.title }}
              </div>
              <div class="text-h4 font-weight-bold">
                {{ loading ? '…' : h.value }}
              </div>
              <div class="text-caption text-medium-emphasis">
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
            <v-card-title class="text-h6 pt-4">
              Activité récente
            </v-card-title>
            <v-tabs
              v-model="tab"
              color="primary"
            >
              <v-tab value="quotes">
                Devis ({{ totalQuotes }})
              </v-tab>
              <v-tab value="invoices">
                Factures ({{ totalInvoices }})
              </v-tab>
            </v-tabs>
            <v-divider />
            <v-table>
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Garage</th>
                  <th>Immat.</th>
                  <th>Statut</th>
                  <th class="text-right">
                    Montant
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                <tr v-if="loading">
                  <td
                    colspan="6"
                    class="text-center py-4"
                  >
                    Chargement…
                  </td>
                </tr>
                <tr v-else-if="rows.length === 0">
                  <td
                    colspan="6"
                    class="text-center py-4 text-disabled"
                  >
                    {{ tab === 'quotes' ? 'Aucun devis' : 'Aucune facture' }}
                  </td>
                </tr>
                <tr
                  v-for="r in rows"
                  :key="r.id"
                >
                  <td>{{ r.number }}</td>
                  <td>{{ r.garage }}</td>
                  <td>{{ r.immat }}</td>
                  <td>
                    <v-chip
                      size="small"
                      variant="tonal"
                      :color="r.color"
                    >
                      {{ r.status }}
                    </v-chip>
                  </td>
                  <td class="text-right">
                    {{ euro(r.amount) }}
                  </td>
                  <td class="text-right">
                    <v-btn
                      size="small"
                      variant="text"
                      color="primary"
                      :to="r.to"
                    >
                      Voir
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
                Tout voir →
              </v-btn>
            </div>
          </v-card>
          <v-card
            variant="flat"
            class="bg-surface border rounded-lg pa-4"
          >
            <div class="text-h6 mb-2">
              Résumé de l'entreprise
            </div>
            <v-row dense>
              <v-col
                v-for="r in summaryRows"
                :key="r.label"
                cols="12"
                sm="6"
              >
                <div class="d-flex justify-space-between py-2 border-b text-body-2">
                  <span class="text-medium-emphasis">{{ r.label }}</span>
                  <strong :class="r.value ? '' : 'text-medium-emphasis'">{{ r.value || 'Non renseigné' }}</strong>
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
            <div class="text-h6">
              Mon organisation
            </div>
            <div class="text-body-2 text-medium-emphasis">
              {{ organizationName }}
            </div>

            <div class="text-overline text-medium-emphasis mt-4">
              Accès rapide
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
                À compléter
              </div>
              <v-list
                density="compact"
                class="pa-0"
              >
                <v-list-item
                  v-for="m in missingProfileFields"
                  :key="m"
                  to="/organization/settings"
                  :title="m"
                  rounded
                >
                  <template #append>
                    <v-chip
                      size="x-small"
                      color="warning"
                      variant="tonal"
                    >
                      Manquant
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
            <div class="text-h6 mb-2">
              Mon abonnement
            </div>
            <div class="d-flex justify-space-between py-2 border-b text-body-2">
              <span class="text-medium-emphasis">Plan</span>
              <v-chip
                size="small"
                variant="tonal"
                :color="isFreePlan ? 'grey' : 'success'"
              >
                {{ planName }}
              </v-chip>
            </div>
            <div class="d-flex justify-space-between py-2 text-body-2">
              <span class="text-medium-emphasis">Utilisateurs</span>
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
              Limite atteinte<span v-if="extraSeatPrice"> · siège supplémentaire : {{ euro(extraSeatPrice) }}</span>
            </div>
            <v-btn
              class="mt-2"
              block
              variant="outlined"
              to="/subscription"
            >
              Gérer l'abonnement
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import MainLayout from '@/app/layouts/MainLayout.vue';
import { useAdminDashboardState } from '@/features/dashboard/composition/useAdminDashboardState';
import { quoteStatusChip, invoiceStatusChip } from '@/features/dashboard/presentation/labels/documentStatusLabels';
import HailAlertWidget from '@/features/dashboard/presentation/components/HailAlertWidget.vue';
import { useAuthState } from '@/features/auth/composition/useAuthState';

useAuthState();

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
  firstName,
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
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);

const plural = (n: number, word: string) => `${n} ${word}${n > 1 ? 's' : ''}`;

const heroCards = computed(() => [
  {
    title: 'Paiements reçus',
    value: euro(paidAmount.value),
    caption: `${plural(invoicesValidated.value, 'facture')} ${invoicesValidated.value > 1 ? 'payées' : 'payée'}`,
    icon: 'mdi-cash-check',
    color: 'success',
  },
  {
    title: 'À encaisser',
    value: euro(unpaidAmount.value),
    caption: `${plural(unpaidCount.value, 'facture')} ${unpaidCount.value > 1 ? 'non payées' : 'non payée'} · ${unpaidSentCount.value} envoyée${unpaidSentCount.value > 1 ? 's' : ''}, ${unpaidUnsentCount.value} à envoyer`,
    icon: 'mdi-clock-outline',
    color: 'warning',
  },
  {
    title: 'Devis',
    value: euro(openQuotesAmount.value),
    caption: `${openQuotesProcessingCount.value} en cours · ${openQuotesAcceptedCount.value} accepté${openQuotesAcceptedCount.value > 1 ? 's' : ''}`,
    icon: 'mdi-file-document-outline',
    color: 'info',
  },
]);

const counters = computed(() => [
  { title: 'Devis en attente', value: quotesProcessing.value, icon: 'mdi-clock-outline', color: 'warning' },
  { title: 'Devis finalisés', value: quotesFinalized.value, icon: 'mdi-check-circle-outline', color: 'info' },
  { title: 'Factures en attente', value: invoicesPending.value, icon: 'mdi-receipt-text-clock-outline', color: 'warning' },
  { title: 'Factures payées', value: invoicesValidated.value, icon: 'mdi-check-decagram-outline', color: 'success' },
]);

const shortcuts = computed(() => [
  { title: 'Utilisateurs', icon: 'mdi-account-group-outline', to: '/organization/members', count: totalUsers.value },
  { title: 'Garages', icon: 'mdi-store-outline', to: '/organization/garages', count: totalGarages.value },
  { title: 'Paramètres', icon: 'mdi-cog-outline', to: '/organization/settings', count: undefined },
  { title: 'Tarification', icon: 'mdi-tag-outline', to: '/organization/pricing/general', count: undefined },
]);

const rows = computed(() =>
  tab.value === 'quotes'
    ? recentQuotes.value.map(q => {
      const chip = quoteStatusChip(q.status?.code);
      return {
        id: q.id,
        number: q.quoteNumber,
        garage: q.garage?.name ?? q.garageName ?? '—',
        immat: q.carImmatriculation ?? '—',
        status: chip.label,
        color: chip.color,
        amount: q.totalHt ?? 0,
        to: `/quotes/edit/${q.id}`,
      };
    })
    : recentInvoices.value.map(i => {
      const chip = invoiceStatusChip(i.status);
      return {
        id: i.id,
        number: i.invoiceNumber,
        garage: i.garage?.name ?? i.garageName ?? '—',
        immat: i.carImmatriculation ?? '—',
        status: chip.label,
        color: chip.color,
        amount: i.totalHt ?? 0,
        to: `/invoices/edit/${i.id}`,
      };
    })
);

const summaryRows = computed(() => [
  { label: 'SIREN', value: companySummary.value.siren },
  { label: 'Adresse', value: companySummary.value.address },
  { label: 'SIRET', value: companySummary.value.siret },
  { label: 'IBAN', value: companySummary.value.iban },
  { label: 'N° TVA', value: companySummary.value.tva },
  { label: 'Délai de paiement', value: companySummary.value.paymentDelay },
]);
onMounted(async () => {
  await fetchDashboardStats();
});
</script>
