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
                :color="seatLimitReached ? 'warning' : 'primary'"
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
            md="5"
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
            md="3"
          >
            <div class="text-body-2 text-medium-emphasis mb-1">
              {{ t('subscription.page.pricing') }}
            </div>
            <div class="text-h4 font-weight-bold mb-1">
              {{ isFreePlan ? formatCurrency(0) : formatCurrency(15) }}
            </div>
            <div class="text-caption text-medium-emphasis mb-1">
              {{ isFreePlan ? t('subscription.page.seatsIncluded', { count: seatsLimit, price: formatCurrency(15) }) : t('subscription.page.perUserMonth') }}
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
          <v-row>
            <v-col
              v-for="plan in plans"
              :key="plan.code"
              cols="12"
              md="4"
            >
              <v-card
                flat
                class="pa-5 h-100 d-flex flex-column"
                :class="plan.code === 'FREE' ? '' : 'border text-medium-emphasis'"
                :style="plan.code === 'FREE'
                  ? 'border: 2px solid rgb(var(--v-theme-primary)); background: rgba(var(--v-theme-primary), 0.08)'
                  : 'background: rgba(var(--v-theme-on-surface), 0.04)'"
              >
                <div class="d-flex align-center justify-space-between">
                  <span class="text-h6 font-weight-bold">{{ plan.name }}</span>
                  <v-chip
                    v-if="plan.badge"
                    size="x-small"
                    :color="plan.code === 'FREE' ? 'primary' : 'warning'"
                    variant="tonal"
                  >
                    {{ plan.badge }}
                  </v-chip>
                </div>
                <div class="text-h4 font-weight-bold mt-2">
                  {{ plan.price }}
                </div>
                <div class="text-caption text-medium-emphasis mb-3">
                  {{ plan.unit }}
                </div>
                <div
                  v-for="feature in plan.features"
                  :key="feature"
                  class="d-flex align-center ga-2 text-body-2 mb-1"
                >
                  <v-icon
                    size="16"
                    color="success"
                  >
                    mdi-check
                  </v-icon>
                  {{ feature }}
                </div>
                <v-spacer />
                <v-btn
                  class="mt-4"
                  block
                  size="small"
                  :disabled="true"
                  variant="outlined"
                >
                  {{ plan.code === 'FREE' ? t('subscription.page.yourPlan') : t('subscription.page.comingSoon') }}
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
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

const plans = computed(() => [
  { code: 'FREE', name: t('subscription.page.plans.free.name'), price: formatCurrency(0), unit: t('subscription.page.plans.free.unit'), badge: t('subscription.page.plans.free.badge'), features: [t('subscription.page.plans.free.f1'), t('subscription.page.plans.quotesInvoices'), t('subscription.page.plans.free.f3')] },
  { code: 'ESSENTIAL', name: t('subscription.page.plans.essential.name'), price: formatCurrency(15), unit: t('subscription.page.perUserMonth'), features: [t('subscription.page.plans.essential.f1'), t('subscription.page.plans.quotesInvoices'), t('subscription.page.plans.essential.f3')] },
  { code: 'PREMIUM', name: t('subscription.page.plans.premium.name'), price: formatCurrency(25), unit: t('subscription.page.perUserMonth'), features: [t('subscription.page.plans.premium.f1'), t('subscription.page.plans.premium.f2'), t('subscription.page.plans.premium.f3')] },
])

const { seatsUsed, seatsLimit, seatsPercent, seatLimitReached, isFreePlan, load } = useSubscriptionSeats()

// Seule la jauge d'utilisateurs est réelle ; le reste est mocké en attendant l'intégration de paiement.
const kpis = computed(() => [
  {
    label: t('subscription.page.kpi.users'),
    icon: 'mdi-account-group-outline',
    color: 'primary',
    value: `${seatsUsed.value} / ${seatsLimit.value || '—'}`,
    caption: t('subscription.page.kpi.activeUsers'),
    progress: seatsPercent.value,
    link: { label: t('subscription.page.kpi.manageUsers'), to: '/organization/members', arrow: true },
  },
  {
    label: t('subscription.page.kpi.extraUser'),
    icon: 'mdi-tag-outline',
    color: 'success',
    value: formatCurrency(15),
    caption: isFreePlan.value && seatsLimit.value
      ? t('subscription.page.kpi.extraUserLimit', { count: seatsLimit.value })
      : t('subscription.page.perUserMonth'),
  },
  ...(isFreePlan.value
    ? [
      {
        label: t('subscription.page.kpi.garages'),
        icon: 'mdi-warehouse',
        color: 'warning',
        value: t('subscription.page.kpi.unlimited'),
        caption: t('subscription.page.kpi.noGarageLimit'),
      },
      {
        label: t('subscription.page.kpi.billing'),
        icon: 'mdi-file-document-outline',
        color: 'purple',
        value: t('subscription.page.kpi.noneFem'),
        caption: t('subscription.page.kpi.freeCaption', { price: formatCurrency(0) }),
      },
    ]
    : [
      {
        label: t('subscription.page.kpi.monthlyCost'),
        icon: 'mdi-file-document-outline',
        color: 'purple',
        value: formatCurrency(120),
        caption: t('subscription.page.kpi.exclTaxMonth'),
        link: { label: t('subscription.page.kpi.seeDetail'), to: '/subscription' },
      },
      {
        label: t('subscription.page.details.nextDebit'),
        icon: 'mdi-calendar-outline',
        color: 'warning',
        value: longDate('2025-06-15'),
        caption: t('subscription.page.kpi.amountExclTax', { amount: formatCurrency(120) }),
        link: { label: t('subscription.page.kpi.seePayment'), to: '/subscription' },
      },
    ]),
])

onMounted(load)</script>