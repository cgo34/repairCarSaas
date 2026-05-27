<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-4 pa-sm-6"
    >
      <!-- KPI CARDS -->
      <v-row
        class="mb-4"
        dense
      >
        <!-- Utilisateurs -->
        <v-col
          cols="12"
          md="3"
        >
          <v-card
            flat
            border
            class="pa-4"
          >
            <div class="d-flex align-center ga-3 mb-2">
              <v-avatar
                color="blue-lighten-4"
                size="40"
                rounded="lg"
              >
                <v-icon color="primary">
                  mdi-account-group-outline
                </v-icon>
              </v-avatar>
              <span class="text-body-2 text-medium-emphasis">Utilisateurs</span>
            </div>
            <div class="text-h4 font-weight-bold mb-1">
              8 / 15
            </div>
            <div class="text-caption text-medium-emphasis mb-3">
              utilisateurs actifs
            </div>
            <v-progress-linear
              :model-value="53"
              height="6"
              color="primary"
              rounded
              bg-color="blue-lighten-4"
              class="mb-3"
            />
            <a class="text-primary text-body-2 text-decoration-none d-flex align-center ga-1">
              Gérer les utilisateurs <v-icon size="16">mdi-arrow-right</v-icon>
            </a>
          </v-card>
        </v-col>

        <!-- Prix par utilisateur -->
        <v-col
          cols="12"
          md="3"
        >
          <v-card
            flat
            border
            class="pa-4"
          >
            <div class="d-flex align-center ga-3 mb-2">
              <v-avatar
                color="green-lighten-4"
                size="40"
                rounded="lg"
              >
                <v-icon color="success">
                  mdi-tag-outline
                </v-icon>
              </v-avatar>
              <span class="text-body-2 text-medium-emphasis">Prix par utilisateur</span>
            </div>
            <div class="text-h4 font-weight-bold mb-1">
              15,00 €
            </div>
            <div class="text-caption text-medium-emphasis d-flex align-center ga-1">
              par utilisateur / mois
              <v-icon
                size="14"
                color="medium-emphasis"
              >
                mdi-information-outline
              </v-icon>
            </div>
          </v-card>
        </v-col>

        <!-- Coût mensuel -->
        <v-col
          cols="12"
          md="3"
        >
          <v-card
            flat
            border
            class="pa-4"
          >
            <div class="d-flex align-center ga-3 mb-2">
              <v-avatar
                color="purple-lighten-4"
                size="40"
                rounded="lg"
              >
                <v-icon color="purple">
                  mdi-file-document-outline
                </v-icon>
              </v-avatar>
              <span class="text-body-2 text-medium-emphasis">Coût mensuel</span>
            </div>
            <div class="text-h4 font-weight-bold mb-1">
              120,00 €
            </div>
            <div class="text-caption text-medium-emphasis mb-3">
              HT / mois
            </div>
            <a class="text-primary text-body-2 text-decoration-none">Voir le détail</a>
          </v-card>
        </v-col>

        <!-- Prochain prélèvement -->
        <v-col
          cols="12"
          md="3"
        >
          <v-card
            flat
            border
            class="pa-4"
          >
            <div class="d-flex align-center ga-3 mb-2">
              <v-avatar
                color="orange-lighten-4"
                size="40"
                rounded="lg"
              >
                <v-icon color="warning">
                  mdi-calendar-outline
                </v-icon>
              </v-avatar>
              <span class="text-body-2 text-medium-emphasis">Prochain prélèvement</span>
            </div>
            <div class="text-h4 font-weight-bold mb-1">
              15 juin 2025
            </div>
            <div class="text-caption text-medium-emphasis mb-3">
              120,00 € HT
            </div>
            <a class="text-primary text-body-2 text-decoration-none">Voir le mode de paiement</a>
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
                  <span class="text-h6 font-weight-bold">Offre Essentielle</span>
                  <v-chip
                    size="x-small"
                    color="primary"
                    variant="tonal"
                  >
                    Offre de base
                  </v-chip>
                </div>
                <div class="text-body-2 text-medium-emphasis">
                  Toutes les fonctionnalités essentielles pour gérer<br>vos devis, factures et garages.
                </div>
              </div>
            </div>
            <v-btn
              variant="outlined"
              color="default"
              size="small"
            >
              Changer d'offre
            </v-btn>
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
              15,00 €
            </div>
            <div class="text-caption text-medium-emphasis mb-1">
              par utilisateur / mois
            </div>
            <div class="text-caption text-medium-emphasis">
              Facturation mensuelle
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

      <!-- HISTORIQUE + MODE DE PAIEMENT + AIDE -->
      <v-row>
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
      <div class="text-caption text-center text-medium-emphasis mt-6 d-flex align-center justify-center ga-1">
        <v-icon size="14">
          mdi-shield-check-outline
        </v-icon>
        Paiement 100% sécurisé. Vos données sont protégées.
      </div>
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue'
import { ref } from 'vue'

const factures = ref([
  { id: 1, date: '15 mai 2025',  numero: 'FAC-2025-0005', periode: '15 avr. – 14 mai 2025',  montant: '120,00 €' },
  { id: 2, date: '15 avr. 2025', numero: 'FAC-2025-0004', periode: '15 mars – 14 avr. 2025', montant: '120,00 €' },
  { id: 3, date: '15 mars 2025', numero: 'FAC-2025-0003', periode: '15 févr. – 14 mars 2025', montant: '120,00 €' },
  { id: 4, date: '15 févr. 2025',numero: 'FAC-2025-0002', periode: '15 janv. – 14 févr. 2025',montant: '120,00 €' },
  { id: 5, date: '15 janv. 2025',numero: 'FAC-2025-0001', periode: '15 déc. – 14 janv. 2025', montant: '120,00 €' },
])

const offerDetails = ref([
  { icon: 'mdi-calendar-outline',       label: 'Type d\'abonnement', value: 'Mensuel'       },
  { icon: 'mdi-calendar-start-outline', label: 'Date de début',      value: '15 mars 2025'  },
  { icon: 'mdi-calendar-end-outline',   label: 'Date de fin',        value: '14 juin 2025'  },
  { icon: 'mdi-clock-outline',          label: 'Prochain prélèvement',value: '15 juin 2025' },
])
</script>