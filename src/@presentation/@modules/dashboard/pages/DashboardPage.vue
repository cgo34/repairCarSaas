<template>
  <MainLayout>
    <v-container fluid>
      <!-- Row 1 : Devis KPIs -->
      <v-row>
        <v-col
          cols="12"
          sm="3"
        >
          <DashboardStatCard
            title="Total Devis"
            :value="loading ? '...' : totalQuotes"
            :amount="loading ? '' : totalQuotesHt"
            icon="FileTextIcon"
            color="primary"
          />
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <DashboardStatCard
            title="Devis en cours"
            :value="loading ? '...' : quotesProcessing"
            :amount="loading ? '' : quotesProcessingHt"
            icon="ClockIcon"
            color="warning"
          />
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <DashboardStatCard
            title="Devis finalisés"
            :value="loading ? '...' : quotesFinalized"
            :amount="loading ? '' : quotesFinalizedHt"
            icon="CheckCircleIcon"
            color="success"
          />
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <DashboardStatCard
            title="Devis acceptés"
            :value="loading ? '...' : quotesAccepted"
            :amount="loading ? '' : quotesAcceptedHt"
            icon="ThumbsUpIcon"
            color="info"
          />
        </v-col>
      </v-row>

      <!-- Row 2 : Factures KPIs -->
      <v-row>
        <v-col
          cols="12"
          sm="3"
        >
          <DashboardStatCard
            title="Total Factures"
            :value="loading ? '...' : totalInvoices"
            :amount="loading ? '' : totalInvoicesHt"
            icon="ReceiptIcon"
            color="primary"
          />
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <DashboardStatCard
            title="Factures en attente"
            :value="loading ? '...' : invoicesPending"
            :amount="loading ? '' : invoicesPendingHt"
            icon="HourglassIcon"
            color="warning"
          />
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <DashboardStatCard
            title="Factures validées"
            :value="loading ? '...' : invoicesValidated"
            :amount="loading ? '' : invoicesValidatedHt"
            icon="BadgeCheckIcon"
            color="success"
          />
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <DashboardStatCard
            title="Factures envoyées"
            :value="loading ? '...' : invoicesSent"
            :amount="loading ? '' : invoicesSentHt"
            icon="SendIcon"
            color="info"
          />
        </v-col>
      </v-row>

      <!-- Row 3 : Garages / Utilisateurs -->
      <v-row>
        <v-col
          cols="12"
          sm="6"
        >
          <DashboardStatCard
            title="Total Garages"
            :value="loading ? '...' : totalGarages"
            icon="BuildingStoreIcon"
            color="warning"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <DashboardStatCard
            title="Total Utilisateurs"
            :value="loading ? '...' : totalUsers"
            icon="UserIcon"
            color="primary"
          />
        </v-col>
      </v-row>

      <!-- Row 4 : Derniers devis -->
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-card
            outlined
            class="rounded-lg"
          >
            <v-card-title class="text-h6">
              Derniers devis
            </v-card-title>
            <v-card-text class="pa-0">
              <v-table density="compact">
                <thead>
                  <tr>
                    <th>N°</th>
                    <th>Garage</th>
                    <th>Immat.</th>
                    <th>Statut</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="loading">
                    <td
                      colspan="5"
                      class="text-center py-4"
                    >
                      Chargement…
                    </td>
                  </tr>
                  <tr v-else-if="recentQuotes.length === 0">
                    <td
                      colspan="5"
                      class="text-center py-4 text-disabled"
                    >
                      Aucun devis
                    </td>
                  </tr>
                  <tr
                    v-for="q in recentQuotes"
                    :key="q.id"
                  >
                    <td>{{ q.quoteNumber }}</td>
                    <td>{{ q.garage?.name ?? q.garageName ?? '—' }}</td>
                    <td>{{ q.carImmatriculation ?? '—' }}</td>
                    <td>
                      <v-chip
                        size="x-small"
                        :color="quoteStatusColor(q.status?.code)"
                      >
                        {{ q.status?.label ?? q.status?.code ?? '—' }}
                      </v-chip>
                    </td>
                    <td>
                      <v-btn
                        size="x-small"
                        variant="text"
                        color="primary"
                        :to="`/quotes/edit/${q.id}`"
                      >
                        Voir
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Row 4 : Dernières factures -->
        <v-col
          cols="12"
          md="6"
        >
          <v-card
            outlined
            class="rounded-lg"
          >
            <v-card-title class="text-h6">
              Dernières factures
            </v-card-title>
            <v-card-text class="pa-0">
              <v-table density="compact">
                <thead>
                  <tr>
                    <th>N°</th>
                    <th>Garage</th>
                    <th>Immat.</th>
                    <th>Statut</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="loading">
                    <td
                      colspan="5"
                      class="text-center py-4"
                    >
                      Chargement…
                    </td>
                  </tr>
                  <tr v-else-if="recentInvoices.length === 0">
                    <td
                      colspan="5"
                      class="text-center py-4 text-disabled"
                    >
                      Aucune facture
                    </td>
                  </tr>
                  <tr
                    v-for="inv in recentInvoices"
                    :key="inv.id"
                  >
                    <td>{{ inv.invoiceNumber }}</td>
                    <td>{{ inv.garage?.name ?? inv.garageName ?? '—' }}</td>
                    <td>{{ inv.carImmatriculation ?? '—' }}</td>
                    <td>
                      <v-chip
                        size="x-small"
                        :color="invoiceStatusColor(inv.status)"
                      >
                        {{ inv.status }}
                      </v-chip>
                    </td>
                    <td>
                      <v-btn
                        size="x-small"
                        variant="text"
                        color="primary"
                        :to="`/invoices/edit/${inv.id}`"
                      >
                        Voir
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { useAdminDashboardState } from '@/@presentation/@modules/dashboard/composables/useAdminDashboardState';
import DashboardStatCard from '@/@presentation/@ui/components/DashboardStatCard.vue';
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';
import { onMounted } from 'vue';
import { useAuthState } from '../../auth/composables/useAuthState';

const { userContext } = useAuthState();

const {
  totalUsers,
  totalGarages,
  totalQuotes,
  totalQuotesHt,
  quotesProcessing,
  quotesProcessingHt,
  quotesFinalized,
  quotesFinalizedHt,
  quotesAccepted,
  quotesAcceptedHt,
  recentQuotes,
  totalInvoices,
  totalInvoicesHt,
  invoicesPending,
  invoicesPendingHt,
  invoicesValidated,
  invoicesValidatedHt,
  invoicesSent,
  invoicesSentHt,
  recentInvoices,
  loading,
  fetchDashboardStats,
} = useAdminDashboardState();

const quoteStatusColor = (code: string | undefined) => {
  switch (code) {
    case 'processing': return 'warning';
    case 'finalized': return 'info';
    case 'accepted': return 'success';
    case 'refused': return 'error';
    case 'cancelled': return 'grey';
    default: return 'default';
  }
};

const invoiceStatusColor = (status: string | undefined) => {
  switch (status) {
    case 'pending': return 'warning';
    case 'draft': return 'grey';
    case 'validated': return 'info';
    case 'accepted': return 'success';
    case 'signed': return 'success';
    case 'sent': return 'primary';
    case 'cancel': return 'error';
    default: return 'default';
  }
};

onMounted(async () => {
  await fetchDashboardStats();
});
</script>
