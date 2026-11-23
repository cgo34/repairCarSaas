<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-0"
    >
      <!-- HEADER -->
      <div class="mb-4">
        <div class="text-h5 font-weight-bold">
          Mon abonnement
        </div>
        <div class="text-body-2 text-medium-emphasis">
          Gérez votre abonnement, mettez à jour vos informations de paiement et consultez l'historique de vos factures.
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
              <div class="text-body-2 text-medium-emphasis">
                {{ kpi.label }}
              </div>
              <div class="text-h5 font-weight-bold">
                {{ kpi.value }}
              </div>
              <div class="text-caption text-medium-emphasis">
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
          Votre offre actuelle
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
                  <span class="text-h6 font-weight-bold">{{ isFreePlan ? 'Offre Free' : 'Offre Essentielle' }}</span>
                  <v-chip
                    size="x-small"
                    color="primary"
                    variant="tonal"
                  >
                    {{ isFreePlan ? 'Offre gratuite' : 'Offre de base' }}
                  </v-chip>
                </div>
                <div class="text-body-2 text-medium-emphasis">
                  {{ isFreePlan ? 'Offre d\'inscription avec fonctionnalités limitées.' : 'Toutes les fonctionnalités essentielles pour gérer vos devis, factures et garages.' }}
                </div>
                <v-btn
                  class="mt-3"
                  variant="outlined"
                  color="default"
                  size="small"
                >
                  Changer d'offre
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
              Tarification
            </div>
            <div class="text-h4 font-weight-bold mb-1">
              {{ isFreePlan ? '0,00 €' : '15,00 €' }}
            </div>
            <div class="text-caption text-medium-emphasis mb-1">
              {{ isFreePlan ? `${seatsLimit} utilisateurs inclus · 15,00 € / utilisateur supplémentaire` : 'par utilisateur / mois' }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ isFreePlan ? 'Sans facturation' : 'Facturation mensuelle' }}
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
            Comparer les offres
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
                  {{ plan.code === 'FREE' ? 'Votre offre' : 'Bientôt disponible' }}
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
              Besoin d'aide ?
            </div>
            <div class="text-caption text-medium-emphasis">
              Notre équipe est là pour vous accompagner.
            </div>
          </div>
          <v-btn
            variant="text"
            color="primary"
            size="small"
            prepend-icon="mdi-headset"
          >
            Contacter le support
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
              Historique de factures
            </div>
            <v-table density="compact">
              <thead>
                <tr>
                  <th class="text-body-2">
                    Date
                  </th>
                  <th class="text-body-2">
                    N° de facture
                  </th>
                  <th class="text-body-2">
                    Période
                  </th>
                  <th class="text-body-2">
                    Montant HT
                  </th>
                  <th class="text-body-2">
                    Statut
                  </th>
                  <th class="text-body-2">
                    Action
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
                      Payée
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
              Voir toutes les factures <v-icon size="16">mdi-arrow-right</v-icon>
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
              Mode de paiement
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
                    Expire 06/2027
                  </div>
                </div>
              </div>
              <v-btn
                variant="outlined"
                color="primary"
                size="small"
              >
                Mettre à jour
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
                  Besoin d'aide ?
                </div>
                <div class="text-caption text-medium-emphasis mb-3">
                  Notre équipe est là pour vous accompagner.
                </div>
                <v-btn
                  variant="text"
                  color="primary"
                  size="small"
                  prepend-icon="mdi-headset"
                >
                  Contacter le support
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
        Paiement 100% sécurisé. Vos données sont protégées.
      </div>
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '@/app/layouts/MainLayout.vue'
import { computed, onMounted, ref } from 'vue'
import { useSubscriptionSeats } from '@/features/subscription/composition/useSubscriptionSeats'

const factures = ref([
  { id: 1, date: '15 mai 2025',  numero: 'FAC-2025-0005', periode: '15 avr. – 14 mai 2025',  montant: '120,00 €' },
  { id: 2, date: '15 avr. 2025', numero: 'FAC-2025-0004', periode: '15 mars – 14 avr. 2025', montant: '120,00 €' },
  { id: 3, date: '15 mars 2025', numero: 'FAC-2025-0003', periode: '15 févr. – 14 mars 2025', montant: '120,00 €' },
  { id: 4, date: '15 févr. 2025',numero: 'FAC-2025-0002', periode: '15 janv. – 14 févr. 2025',montant: '120,00 €' },
  { id: 5, date: '15 janv. 2025',numero: 'FAC-2025-0001', periode: '15 déc. – 14 janv. 2025', montant: '120,00 €' },
])

const offerDetails = computed(() => [
  { icon: 'mdi-calendar-outline',       label: 'Type d\'abonnement', value: isFreePlan.value ? 'Gratuit' : 'Mensuel' },
  { icon: 'mdi-calendar-start-outline', label: 'Date de début',      value: '15 mars 2025'  },
  { icon: 'mdi-calendar-end-outline',   label: 'Date de fin',        value: isFreePlan.value ? 'Aucune' : '14 juin 2025' },
  { icon: 'mdi-clock-outline',          label: 'Prochain prélèvement', value: isFreePlan.value ? 'Aucun' : '15 juin 2025' },
])

const plans = [
  { code: 'FREE', name: 'Free', price: '0 €', unit: 'pour toujours', badge: 'Offre actuelle', features: ['3 utilisateurs inclus', 'Devis & factures', 'Garages illimités'] },
  { code: 'ESSENTIAL', name: 'Essentielle', price: '15 €', unit: 'par utilisateur / mois', features: ['Utilisateurs illimités', 'Devis & factures', 'Support par e-mail'] },
  { code: 'PREMIUM', name: 'Premium', price: '25 €', unit: 'par utilisateur / mois', features: ['Tout Essentielle', 'Statistiques avancées', 'Support prioritaire'] },
]

const { seatsUsed, seatsLimit, seatsPercent, seatLimitReached, isFreePlan, load } = useSubscriptionSeats()

// Seule la jauge d'utilisateurs est réelle ; le reste est mocké en attendant l'intégration de paiement.
const kpis = computed(() => [
  {
    label: 'Utilisateurs',
    icon: 'mdi-account-group-outline',
    color: 'primary',
    value: `${seatsUsed.value} / ${seatsLimit.value || '—'}`,
    caption: 'utilisateurs actifs',
    progress: seatsPercent.value,
    link: { label: 'Gérer les utilisateurs', to: '/organization/members', arrow: true },
  },
  {
    label: 'Utilisateur supplémentaire',
    icon: 'mdi-tag-outline',
    color: 'success',
    value: '15,00 €',
    caption: isFreePlan.value && seatsLimit.value
      ? `par mois, au-delà de ${seatsLimit.value} utilisateurs inclus`
      : 'par utilisateur / mois',
  },
  ...(isFreePlan.value
    ? [
      {
        label: 'Garages',
        icon: 'mdi-warehouse',
        color: 'warning',
        value: 'Illimités',
        caption: 'aucune limite de garages',
      },
      {
        label: 'Facturation',
        icon: 'mdi-file-document-outline',
        color: 'purple',
        value: 'Aucune',
        caption: 'Plan gratuit · 0,00 € / mois',
      },
    ]
    : [
      {
        label: 'Coût mensuel',
        icon: 'mdi-file-document-outline',
        color: 'purple',
        value: '120,00 €',
        caption: 'HT / mois',
        link: { label: 'Voir le détail', to: '/subscription' },
      },
      {
        label: 'Prochain prélèvement',
        icon: 'mdi-calendar-outline',
        color: 'warning',
        value: '15 juin 2025',
        caption: '120,00 € HT',
        link: { label: 'Voir le mode de paiement', to: '/subscription' },
      },
    ]),
])

onMounted(load)</script>