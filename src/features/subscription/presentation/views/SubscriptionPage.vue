<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-0"
    >
      <!-- HEADER -->
      <div class="mb-4">
        <div class="text-h5 font-weight-bold">
          {{ t('subscription.page.title') }}
        </div>
        <div class="text-body-2 text-medium-emphasis">
          {{ t('subscription.page.subtitle') }}
        </div>
      </div>

      <v-alert
        v-if="nearLimitLabels.length"
        type="warning"
        variant="tonal"
        density="comfortable"
        class="mb-4"
        :title="t('subscription.page.alert.title')"
        :text="t('subscription.page.alert.text', { items: nearLimitLabels.join(', ') })"
      />

      <!-- KPI CARDS -->
      <v-row
        class="mb-4"
        dense
      >
        <v-col
          v-for="kpi in kpis"
          :key="kpi.label"
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
              :color="kpi.color"
              variant="tonal"
              size="48"
              rounded="lg"
            >
              <v-icon :icon="kpi.icon" />
            </v-avatar>
            <div class="flex-grow-1">
              <div class="stat-label">
                {{ kpi.label }}
              </div>
              <div class="stat-value">
                {{ kpi.value }}
              </div>
              <div class="stat-sub">
                {{ kpi.caption }}
              </div>
              <v-progress-linear
                v-if="kpi.progress !== undefined"
                :model-value="kpi.progress"
                :color="kpi.barColor"
                height="6"
                rounded
                class="my-2"
              />
              <router-link
                v-if="kpi.link"
                :to="kpi.link.to"
                class="text-primary text-body-2 text-decoration-none d-inline-flex align-center ga-1 mt-1"
              >
                {{ kpi.link.label }}
                <v-icon
                  v-if="kpi.link.arrow"
                  size="16"
                >
                  mdi-arrow-right
                </v-icon>
              </router-link>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <!-- OFFRE ACTUELLE -->
      <v-card
        flat
        border
        class="mb-4 pa-5"
      >
        <div class="text-subtitle-1 font-weight-bold mb-4">
          {{ t('subscription.page.currentPlan') }}
        </div>
        <v-row align="center">
          <!-- Gauche : logo + description + bouton -->
          <v-col
            cols="12"
            md="4"
          >
            <div class="d-flex align-center ga-4 mb-3">
              <v-avatar
                color="blue-darken-3"
                size="64"
                rounded="lg"
              >
                <v-icon
                  color="white"
                  size="32"
                >
                  mdi-car
                </v-icon>
              </v-avatar>
              <div>
                <div class="d-flex align-center ga-2 mb-1">
                  <span class="text-h6 font-weight-bold">{{ isFreePlan ? t('subscription.page.plan.freeName') : t('subscription.page.plan.essentialName') }}</span>
                  <v-chip
                    size="x-small"
                    color="primary"
                    variant="tonal"
                  >
                    {{ isFreePlan ? t('subscription.page.plan.freeBadge') : t('subscription.page.plan.essentialBadge') }}
                  </v-chip>
                </div>
                <div class="text-body-2 text-medium-emphasis">
                  {{ isFreePlan ? t('subscription.page.plan.freeDescription') : t('subscription.page.plan.essentialDescription') }}
                </div>
                <v-btn
                  class="mt-3"
                  variant="flat"
                  color="primary"
                  size="small"
                >
                  {{ t('subscription.page.changePlan') }}
                </v-btn>
              </div>
            </div>
          </v-col>

          <!-- Milieu : tarification -->
          <v-col
            cols="12"
            md="4"
          >
            <div class="text-h6 font-weight-bold mb-1">
              {{ t('subscription.page.pricing') }}
            </div>
            <div class="text-h4 font-weight-bold mb-1">
              {{ isFreePlan ? formatCurrency(0) : formatCurrency(15) }}
            </div>
            <div class="text-caption text-medium-emphasis mb-1">
              <template v-if="isFreePlan">
                <div>{{ t('subscription.page.seatsIncluded', { count: seatsLimit }) }}</div>
                <div class="text-no-wrap">
                  {{ t('subscription.page.extraSeatPrice', { price: formatCurrency(15) }) }}
                </div>
              </template>
              <template v-else>
                {{ t('subscription.page.perUserMonth') }}
              </template>
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ isFreePlan ? t('subscription.page.noBilling') : t('subscription.page.monthlyBilling') }}
            </div>
          </v-col>

          <v-divider
            vertical
            class="hidden-sm-and-down mx-2"
          />

          <!-- Droite : détails -->
          <v-col
            cols="12"
            md="3"
          >
            <div
              v-for="detail in offerDetails"
              :key="detail.label"
              class="d-flex align-center ga-3 mb-2"
            >
              <v-icon
                size="18"
                color="primary"
              >
                {{ detail.icon }}
              </v-icon>
              <span
                class="text-body-2 text-medium-emphasis"
                style="min-width: 160px"
              >{{ detail.label }}</span>
              <span class="text-body-2 font-weight-medium">{{ detail.value }}</span>
            </div>
          </v-col>
        </v-row>
      </v-card>

      <!-- INCLUS DANS VOTRE OFFRE -->
      <v-card
        flat
        border
        class="mb-4 pa-5"
      >
        <div class="text-subtitle-1 font-weight-bold mb-4">
          {{ t('subscription.page.included') }}
        </div>
        <div class="included-list">
          <div
            v-for="item in includedFeatures"
            :key="item.key"
            class="d-flex align-center ga-2 text-body-2 mb-2"
          >
            <v-icon
              size="18"
              :color="item.enabled ? 'success' : 'grey'"
            >
              {{ item.enabled ? 'mdi-check-circle' : 'mdi-close-circle-outline' }}
            </v-icon>
            <span :class="item.enabled ? '' : 'text-medium-emphasis text-decoration-line-through'">{{ item.label }}</span>
            <v-chip
              v-if="!item.enabled"
              size="x-small"
              color="warning"
              variant="tonal"
            >
              Premium
            </v-chip>
          </div>
        </div>
      </v-card>

      <!-- PLAN FREE : COMPARATIF DES OFFRES + AIDE -->
      <template v-if="isFreePlan">
        <v-card
          flat
          border
          class="mb-4 pa-5"
        >
          <div class="text-subtitle-1 font-weight-bold mb-4">
            {{ t('subscription.page.compare') }}
          </div>
          <v-table density="comfortable">
            <thead>
              <tr>
                <th />
                <th class="text-center">
                  Free
                  <v-chip
                    size="x-small"
                    color="primary"
                    variant="tonal"
                    class="ml-1"
                  >
                    {{ t('subscription.page.yourPlan') }}
                  </v-chip>
                </th>
                <th class="text-center">
                  Premium · {{ formatCurrency(49) }}{{ t('subscription.page.perMonthShort') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in compareRows"
                :key="row.label"
              >
                <td>{{ row.label }}</td>
                <td class="text-center">
                  <v-icon
                    v-if="typeof row.free === 'boolean'"
                    size="18"
                    :color="row.free ? 'success' : 'grey'"
                  >
                    {{ row.free ? 'mdi-check' : 'mdi-close' }}
                  </v-icon>
                  <span v-else>{{ row.free }}</span>
                </td>
                <td class="text-center">
                  <v-icon
                    v-if="typeof row.premium === 'boolean'"
                    size="18"
                    :color="row.premium ? 'success' : 'grey'"
                  >
                    {{ row.premium ? 'mdi-check' : 'mdi-close' }}
                  </v-icon>
                  <span v-else>{{ row.premium }}</span>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>

        <v-card
          flat
          border
          class="pa-4 d-flex align-center justify-space-between"
        >
          <div>
            <div class="text-subtitle-2 font-weight-bold mb-1">
              {{ t('subscription.page.help.title') }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ t('subscription.page.help.text') }}
            </div>
          </div>
          <v-btn
            variant="text"
            color="primary"
            size="small"
            prepend-icon="mdi-headset"
          >
            {{ t('subscription.page.help.contact') }}
          </v-btn>
        </v-card>
      </template>

      <!-- HISTORIQUE + MODE DE PAIEMENT + AIDE -->
      <v-row v-else>
        <!-- Historique de factures -->
        <v-col
          cols="12"
          md="8"
        >
          <v-card
            flat
            border
            class="pa-4"
          >
            <div class="text-subtitle-1 font-weight-bold mb-3">
              {{ t('subscription.page.invoices.title') }}
            </div>
            <v-table density="compact">
              <thead>
                <tr>
                  <th class="text-body-2">
                    {{ t('subscription.page.invoices.date') }}
                  </th>
                  <th class="text-body-2">
                    {{ t('subscription.page.invoices.number') }}
                  </th>
                  <th class="text-body-2">
                    {{ t('subscription.page.invoices.period') }}
                  </th>
                  <th class="text-body-2">
                    {{ t('subscription.page.invoices.amount') }}
                  </th>
                  <th class="text-body-2">
                    {{ t('subscription.page.invoices.status') }}
                  </th>
                  <th class="text-body-2">
                    {{ t('subscription.page.invoices.action') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="facture in factures"
                  :key="facture.id"
                >
                  <td class="text-body-2">
                    {{ facture.date }}
                  </td>
                  <td class="text-body-2">
                    {{ facture.numero }}
                  </td>
                  <td class="text-body-2">
                    {{ facture.periode }}
                  </td>
                  <td class="text-body-2">
                    {{ facture.montant }}
                  </td>
                  <td>
                    <v-chip
                      size="small"
                      color="success"
                      variant="tonal"
                    >
                      {{ t('subscription.page.invoices.paid') }}
                    </v-chip>
                  </td>
                  <td>
                    <v-btn
                      icon
                      size="small"
                      variant="text"
                    >
                      <v-icon size="18">
                        mdi-download
                      </v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
            <a class="text-primary text-body-2 text-decoration-none d-flex align-center ga-1 mt-3">
              {{ t('subscription.page.invoices.viewAll') }} <v-icon size="16">mdi-arrow-right</v-icon>
            </a>
          </v-card>
        </v-col>

        <!-- Colonne droite -->
        <v-col
          cols="12"
          md="4"
        >
          <!-- Mode de paiement -->
          <v-card
            flat
            border
            class="pa-4 mb-4"
          >
            <div class="text-subtitle-1 font-weight-bold mb-3">
              {{ t('subscription.page.payment.title') }}
            </div>
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center ga-3">
                <v-card
                  flat
                  border
                  class="pa-2"
                  rounded="lg"
                >
                  <v-icon color="blue-darken-2">
                    mdi-credit-card-outline
                  </v-icon>
                </v-card>
                <div>
                  <div class="text-body-2 font-weight-medium">
                    Visa **** **** **** 4242
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ t('subscription.page.payment.expires', { date: '06/2027' }) }}
                  </div>
                </div>
              </div>
              <v-btn
                variant="outlined"
                color="primary"
                size="small"
              >
                {{ t('subscription.page.payment.update') }}
              </v-btn>
            </div>
          </v-card>

          <!-- Besoin d'aide -->
          <v-card
            flat
            border
            class="pa-4"
          >
            <div class="d-flex align-start justify-space-between">
              <div>
                <div class="text-subtitle-2 font-weight-bold mb-1">
                  {{ t('subscription.page.help.title') }}
                </div>
                <div class="text-caption text-medium-emphasis mb-3">
                  {{ t('subscription.page.help.text') }}
                </div>
                <v-btn
                  variant="text"
                  color="primary"
                  size="small"
                  prepend-icon="mdi-headset"
                >
                  {{ t('subscription.page.help.contact') }}
                </v-btn>
              </div>
              <v-icon
                size="64"
                color="blue-lighten-3"
              >
                mdi-car-wrench
              </v-icon>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- FOOTER -->
      <div
        v-if="!isFreePlan"
        class="text-caption text-center text-medium-emphasis mt-6 d-flex align-center justify-center ga-1"
      >
        <v-icon size="14">
          mdi-shield-check-outline
        </v-icon>
        {{ t('subscription.page.secure') }}
      </div>
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '@/app/layouts/MainLayout.vue'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatCurrency, formatDate } from '@/app/i18n/formatters'
import { useSubscriptionSeats } from '@/features/subscription/composition/useSubscriptionSeats'

const { t } = useI18n()

const longDate = (value: string) => formatDate(value, { day: 'numeric', month: 'long', year: 'numeric' })
const shortDate = (value: string) => formatDate(value, { day: 'numeric', month: 'short', year: 'numeric' })

const invoiceSamples = [
  { id: 1, date: '2025-05-15', numero: 'FAC-2025-0005', from: '2025-04-15', to: '2025-05-14' },
  { id: 2, date: '2025-04-15', numero: 'FAC-2025-0004', from: '2025-03-15', to: '2025-04-14' },
  { id: 3, date: '2025-03-15', numero: 'FAC-2025-0003', from: '2025-02-15', to: '2025-03-14' },
  { id: 4, date: '2025-02-15', numero: 'FAC-2025-0002', from: '2025-01-15', to: '2025-02-14' },
  { id: 5, date: '2025-01-15', numero: 'FAC-2025-0001', from: '2024-12-15', to: '2025-01-14' },
]

const factures = computed(() => invoiceSamples.map(invoice => ({
  id: invoice.id,
  numero: invoice.numero,
  date: shortDate(invoice.date),
  periode: `${shortDate(invoice.from)} – ${shortDate(invoice.to)}`,
  montant: formatCurrency(120),
})))

const offerDetails = computed(() => [
  { icon: 'mdi-calendar-outline',       label: t('subscription.page.details.type'), value: isFreePlan.value ? t('subscription.page.details.free') : t('subscription.page.details.monthly') },
  { icon: 'mdi-calendar-start-outline', label: t('subscription.page.details.start'),      value: longDate('2025-03-15') },
  { icon: 'mdi-calendar-end-outline',   label: t('subscription.page.details.end'),        value: isFreePlan.value ? t('subscription.page.details.none') : longDate('2025-06-14') },
  { icon: 'mdi-clock-outline',          label: t('subscription.page.details.nextDebit'), value: isFreePlan.value ? t('subscription.page.details.noneMasc') : longDate('2025-06-15') },
])

const {
  seatsUsed, seatsLimit, garagesUsed, garagesLimit,
  quotesUsed, quotesLimit, invoicesUsed, invoicesLimit, conversionsUsed, conversionsLimit,
  features, isFreePlan, load,
} = useSubscriptionSeats()

const NEAR_LIMIT_PERCENT = 80

const quotaKpi = (label: string, icon: string, used: number, limit: number, caption: string) => {
  const percent = limit > 0 ? Math.min(100, (used / limit) * 100) : undefined
  const barColor = percent === undefined ? 'primary' : percent >= 100 ? 'error' : percent >= NEAR_LIMIT_PERCENT ? 'warning' : 'primary'
  return {
    label,
    icon,
    color: barColor,
    value: limit > 0 ? `${used} / ${limit}` : `${used} · ${t('subscription.page.kpi.unlimited')}`,
    caption,
    progress: percent,
    barColor,
    link: undefined as { label: string; to: string; arrow: boolean } | undefined,
  }
}

const kpis = computed(() => [
  {
    ...quotaKpi(t('subscription.page.kpi.users'), 'mdi-account-group-outline', seatsUsed.value, seatsLimit.value, t('subscription.page.kpi.activeUsers')),
    link: { label: t('subscription.page.kpi.manageUsers'), to: '/organization/members', arrow: true },
  },
  quotaKpi(t('subscription.page.kpi.garages'), 'mdi-warehouse', garagesUsed.value, garagesLimit.value, t('subscription.page.kpi.garagesLimit')),
  quotaKpi(t('subscription.page.kpi.quotesMonth'), 'mdi-file-document-edit-outline', quotesUsed.value, quotesLimit.value, t('subscription.page.kpi.createdThisMonth')),
  quotaKpi(t('subscription.page.kpi.invoicesMonth'), 'mdi-file-document-outline', invoicesUsed.value, invoicesLimit.value, t('subscription.page.kpi.createdThisMonth')),
    quotaKpi(t('subscription.page.kpi.conversionsMonth'), 'mdi-swap-horizontal', conversionsUsed.value, conversionsLimit.value, t('subscription.page.kpi.convertedThisMonth')),
])

const nearLimitLabels = computed(() =>
  kpis.value.filter(kpi => (kpi.progress ?? 0) >= NEAR_LIMIT_PERCENT).map(kpi => kpi.label.toLowerCase()),
)

// null = illimité
const limitText = (key: string, singular: string, plural: string) => {
  const value = features.value[key]
  if (typeof value === 'number') return `${value} ${value > 1 ? plural : singular}`
  return `${t('subscription.page.kpi.unlimited')} ${plural}`
}

const includedFeatures = computed(() => [
  { key: 'max_seats', enabled: true, label: limitText('max_seats', t('subscription.page.feature.user'), t('subscription.page.feature.users')) },
  { key: 'max_garages', enabled: true, label: limitText('max_garages', t('subscription.page.feature.garage'), t('subscription.page.feature.garages')) },
  { key: 'max_quotes_per_month', enabled: true, label: `${limitText('max_quotes_per_month', t('subscription.page.feature.quote'), t('subscription.page.feature.quotes'))} ${t('subscription.page.feature.perMonth')}` },
  { key: 'max_invoices_per_month', enabled: true, label: `${limitText('max_invoices_per_month', t('subscription.page.feature.invoice'), t('subscription.page.feature.invoices'))} ${t('subscription.page.feature.perMonth')}` },
  { key: 'quote_to_invoice', enabled: features.value.quote_to_invoice === true, label: t('subscription.page.feature.quoteToInvoice') },
  { key: 'max_conversions_per_month', enabled: features.value.quote_to_invoice === true, label: `${limitText('max_conversions_per_month', t('subscription.page.feature.conversion'), t('subscription.page.feature.conversions'))} ${t('subscription.page.feature.perMonth')}` },
  { key: 'quote_email_sending', enabled: features.value.quote_email_sending === true, label: t('subscription.page.feature.emailSending') },
  { key: 'invoice_email_sending', enabled: features.value.invoice_email_sending === true, label: t('subscription.page.feature.invoiceEmailSending') },
  { key: 'car_view', enabled: features.value.car_view === true, label: t('subscription.page.feature.carView') },
].sort((a, b) => Number(b.enabled) - Number(a.enabled)))

const unlimited = computed(() => t('subscription.page.kpi.unlimited'))
const compareRows = computed(() => [
  { label: t('subscription.page.feature.users'), free: 2, premium: 10 },
  { label: t('subscription.page.feature.garages'), free: 1, premium: unlimited.value },
  { label: t('subscription.page.kpi.quotesMonth'), free: 10, premium: unlimited.value },
  { label: t('subscription.page.kpi.invoicesMonth'), free: 5, premium: unlimited.value },
  { label: t('subscription.page.kpi.conversionsMonth'), free: 3, premium: unlimited.value },
  { label: t('subscription.page.feature.emailSending'), free: false, premium: true },
  { label: t('subscription.page.feature.invoiceEmailSending'), free: false, premium: true },
  { label: t('subscription.page.feature.carView'), free: false, premium: true },
])

onMounted(load)</script>

<style scoped>
.included-list {
  column-count: 2;
  column-gap: 32px;
}

.included-list > div {
  break-inside: avoid;
}

@media (max-width: 959px) {
  .included-list {
    column-count: 1;
  }
}
</style>