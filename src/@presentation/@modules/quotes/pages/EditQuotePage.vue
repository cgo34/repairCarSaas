<template>
  <MainLayout>
    <BackButton fallback-path="/quotes" />
    <v-container
      fluid
      class="pa-0 mt-4 edit-quote-container"
    >
      <!-- ═══════════════════════════════════════════════════
           HEADER sticky
      ════════════════════════════════════════════════════ -->
      <div class="page-header px-3 py-2">
        <div class="d-flex align-center justify-space-between">
          <!-- Gauche : retour + titre -->
          <div class="d-flex flex-column align-center gap-2 min-w-0">
            <div class="min-w-0">
              <div class="d-flex flex-column  align-center gap-2 flex-wrap">
                <span class="text-subtitle-1 font-weight-bold text-truncate my-2">
                  {{ quoteInformations.number || 'Devis' }}
                </span>
                <v-chip
                  v-if="quoteInformations.status"
                  :color="statusColor(quoteInformations.status?.code)"
                  size="small"
                  variant="tonal"
                  label
                >
                  {{ statusLabel(quoteInformations.status?.code) }}
                </v-chip>
              </div>
            </div>
          </div>

          <!-- Droite : actions rapides + menu overflow -->
          <div class="d-flex align-center gap-1 flex-shrink-0">
            <!-- PDF toujours visible -->
            <v-btn
              icon
              variant="text"
              size="small"
              title="Aperçu PDF"
              @click="onViewPdfBtnClick"
            >
              <v-icon>mdi-file-pdf-box</v-icon>
            </v-btn>

            <!-- Menu overflow -->
            <v-menu location="bottom end">
              <template #activator="{ props: menuProps }">
                <v-btn
                  icon
                  variant="text"
                  size="small"
                  v-bind="menuProps"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list
                density="compact"
                rounded="lg"
                min-width="200"
              >
                <v-list-item
                  v-if="!isFreePlan"
                  prepend-icon="mdi-send-outline"
                  title="Envoyer"
                  @click="onSendBtnClick"
                />
                <v-list-item
                  v-if="!isReadOnly"
                  prepend-icon="mdi-check-circle-outline"
                  title="Marquer accepté"
                  @click="onAcceptedBtnClick"
                />
                <v-list-item
                  v-if="!isReadOnly"
                  prepend-icon="mdi-close-circle-outline"
                  title="Marquer refusé"
                  @click="onRefusedBtnClick"
                />
                <v-list-item
                  v-if="isAccepted"
                  prepend-icon="mdi-file-plus-outline"
                  title="Convertir en facture"
                  @click="onDuplicateQuoteToInvoiceBtnClick"
                />
                <v-divider v-if="!isReadOnly" />
                <v-list-item
                  v-if="!isReadOnly"
                  prepend-icon="mdi-delete-outline"
                  title="Supprimer"
                  class="text-error"
                  base-color="error"
                  @click="onDeleteBtnClick"
                />
              </v-list>
            </v-menu>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════
           FORM
      ════════════════════════════════════════════════════ -->
      <v-form
        ref="form"
        class="px-3 pt-3 pb-28"
      >
        <!-- ── Section 1 : Dates ── -->
        <div class="section-card mb-4">
          <div class="section-header mb-3">
            <div class="section-icon">
              <v-icon
                size="18"
                color="primary"
              >
                mdi-calendar-outline
              </v-icon>
            </div>
            <span class="text-subtitle-2 font-weight-semibold">Dates</span>
          </div>
          <v-row dense>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="quoteInformations.date"
                label="Date de création"
                type="date"
                variant="outlined"
                density="comfortable"
                :readonly="isReadOnly"
                hide-details="auto"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                :model-value="expirationDate"
                label="Valide jusqu'au"
                type="date"
                variant="outlined"
                density="comfortable"
                readonly
                hide-details="auto"
              />
            </v-col>
          </v-row>
        </div>

        <!-- ── Section 2 : Technicien ── -->
        <div class="section-card mb-4">
          <div class="section-header mb-3">
            <div class="section-icon">
              <v-icon
                size="18"
                color="primary"
              >
                mdi-account-wrench-outline
              </v-icon>
            </div>
            <span class="text-subtitle-2 font-weight-semibold">Technicien</span>
          </div>
          <v-autocomplete
            :model-value="selectedTechnician"
            :items="technicians"
            item-title="fullName"
            item-value="id"
            return-object
            label="Sélectionner un technicien"
            variant="outlined"
            density="comfortable"
            :clearable="!isReadOnly"
            :readonly="isReadOnly"
            hide-details="auto"
            prepend-inner-icon="mdi-account-search-outline"
            @update:model-value="onSelectTechnician"
          >
            <template #item="{ props: itemProps, item }">
              <v-list-item v-bind="itemProps">
                <template #prepend>
                  <v-avatar
                    color="primary"
                    size="36"
                  >
                    <span class="text-caption font-weight-bold text-white">
                      {{ initials(item.raw.fullName) }}
                    </span>
                  </v-avatar>
                </template>
              </v-list-item>
            </template>
            <template #selection="{ item }">
              <div class="d-flex align-center gap-2">
                <v-avatar
                  color="primary"
                  size="24"
                >
                  <span
                    style="font-size:10px"
                    class="text-white"
                  >{{ initials(item.raw.fullName) }}</span>
                </v-avatar>
                <span>{{ item.raw.fullName }}</span>
              </div>
            </template>
          </v-autocomplete>
        </div>

        <!-- ── Section 3 : Client / Garage ── -->
        <div class="section-card mb-4">
          <div class="section-header mb-3">
            <div class="section-icon">
              <v-icon
                size="18"
                color="primary"
              >
                mdi-garage-open-variant
              </v-icon>
            </div>
            <span class="text-subtitle-2 font-weight-semibold">Client / Garage</span>
          </div>

          <v-autocomplete
            :model-value="selectedGarage"
            :items="garages"
            item-title="name"
            item-value="id"
            return-object
            label="Sélectionner un garage"
            variant="outlined"
            density="comfortable"
            :clearable="!isReadOnly"
            :readonly="isReadOnly"
            hide-details="auto"
            prepend-inner-icon="mdi-store-search-outline"
            @update:model-value="onSelectGarage"
          >
            <template #item="{ props: itemProps, item }">
              <v-list-item
                v-bind="itemProps"
                :subtitle="item.raw.city ?? ''"
              >
                <template #prepend>
                  <v-icon color="primary">
                    mdi-garage-variant
                  </v-icon>
                </template>
              </v-list-item>
            </template>
          </v-autocomplete>

          <v-btn
            v-if="!isReadOnly"
            variant="tonal"
            color="primary"
            size="small"
            class="mt-2"
            prepend-icon="mdi-pencil-outline"
            @click="onEditCustomerBtnClick"
          >
            Modifier le client
          </v-btn>

          <v-expand-transition>
            <div
              v-if="selectedGarage"
              class="mt-3"
            >
              <v-card
                variant="tonal"
                color="primary"
                rounded="lg"
                class="pa-3"
              >
                <div class="d-flex align-center gap-2 mb-1">
                  <v-icon
                    size="18"
                    color="primary"
                  >
                    mdi-map-marker-outline
                  </v-icon>
                  <span class="text-body-2 font-weight-medium">{{ selectedGarage.name }}</span>
                </div>
                <div
                  v-if="selectedGarage.address"
                  class="text-caption text-medium-emphasis"
                >
                  {{ selectedGarage.address }}<span v-if="selectedGarage.zipCode">, {{ selectedGarage.zipCode }}</span><span v-if="selectedGarage.city"> {{ selectedGarage.city }}</span>
                </div>
                <div
                  v-if="selectedGarage.percentageCommission"
                  class="mt-1"
                >
                  <v-chip
                    size="x-small"
                    color="orange"
                    variant="tonal"
                  >
                    Commission {{ selectedGarage.percentageCommission }}%
                  </v-chip>
                </div>
              </v-card>
            </div>
          </v-expand-transition>
        </div>

        <!-- ── Section 4 : Véhicule ── -->
        <div class="section-card mb-4">
          <div class="section-header mb-3">
            <div class="section-icon">
              <v-icon
                size="18"
                color="primary"
              >
                mdi-car-outline
              </v-icon>
            </div>
            <span class="text-subtitle-2 font-weight-semibold">Véhicule</span>
          </div>

          <v-autocomplete
            :model-value="selectedVehicle"
            :items="vehiclesList"
            :item-title="v => v.immatriculation + ' — ' + v.marque + (v.annee ? ' ' + v.annee : '')"
            item-value="id"
            return-object
            label="Véhicule existant (optionnel)"
            variant="outlined"
            density="comfortable"
            clearable
            :disabled="!selectedGarage || isReadOnly"
            :no-data-text="selectedGarage ? 'Aucun véhicule trouvé' : 'Sélectionnez d\'abord un garage'"
            hide-details="auto"
            prepend-inner-icon="mdi-car-search-outline"
            class="mb-3"
            @update:model-value="onSelectVehicle"
          />

          <div class="text-caption text-medium-emphasis mb-3 d-flex align-center gap-1">
            <v-icon size="14">
              mdi-information-outline
            </v-icon>
            Informations manuelles :
          </div>

          <v-row dense>
            <v-col
              cols="12"
              sm="4"
            >
              <v-text-field
                v-model="carInformations.immatriculation"
                label="Immatriculation"
                variant="outlined"
                density="comfortable"
                :readonly="isReadOnly"
                hide-details="auto"
                prepend-inner-icon="mdi-card-text-outline"
                @update:model-value="onCarImmatriculationUpdated"
              />
            </v-col>
            <v-col
              cols="12"
              sm="4"
            >
              <v-text-field
                v-model="carInformations.brand"
                label="Marque"
                variant="outlined"
                density="comfortable"
                :readonly="isReadOnly"
                hide-details="auto"
                prepend-inner-icon="mdi-car-info"
                @update:model-value="onCarBrandUpdated"
              />
            </v-col>
            <v-col
              cols="12"
              sm="4"
            >
              <v-text-field
                v-model="carInformations.dateEntryCirculation"
                label="Année"
                variant="outlined"
                density="comfortable"
                :readonly="isReadOnly"
                hide-details="auto"
                prepend-inner-icon="mdi-calendar-range-outline"
                @update:model-value="onCarYearUpdated"
              />
            </v-col>
          </v-row>
        </div>

        <!-- ── Section 5 : Options ── -->
        <div class="section-card mb-4">
          <div class="section-header mb-3">
            <div class="section-icon">
              <v-icon
                size="18"
                color="primary"
              >
                mdi-tune-variant
              </v-icon>
            </div>
            <span class="text-subtitle-2 font-weight-semibold">Options</span>
          </div>

          <div class="mb-3">
            <div class="text-caption text-medium-emphasis mb-1 font-weight-medium">
              Pays &amp; TVA
            </div>
            <CountrySelect
              :model-value="selectedCountry"
              :readonly="isReadOnly"
              @update:model-value="onSelectCountry"
              @select="onSelectCountry"
            />
          </div>

          <v-divider class="my-3" />

          <div class="d-flex align-center justify-space-between py-2">
            <div>
              <div class="text-body-2 font-weight-medium">
                Mode forfait
              </div>
              <div class="text-caption text-medium-emphasis">
                Remplacer les lignes par un montant fixe
              </div>
            </div>
            <v-switch
              :model-value="isForfait"
              color="primary"
              inset
              hide-details
              :readonly="isReadOnly"
              @update:model-value="onUpdateIsForfait"
            />
          </div>

          <v-expand-transition>
            <div
              v-if="isForfait"
              class="pb-2"
            >
              <v-text-field
                :model-value="forfaitAmount"
                label="Montant du forfait (€)"
                type="number"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                prepend-inner-icon="mdi-currency-eur"
                :readonly="isReadOnly"
                @update:model-value="onUpdateForfaitAmount"
              />
            </div>
          </v-expand-transition>

          <template v-if="!isForfait">
            <v-divider class="my-1" />
            <div class="d-flex align-center justify-space-between py-2">
              <div>
                <div class="text-body-2 font-weight-medium">
                  Prix unitaires visibles
                </div>
                <div class="text-caption text-medium-emphasis">
                  Afficher le détail sur le devis
                </div>
              </div>
              <v-switch
                :model-value="isDisplayUnitPrice"
                color="primary"
                inset
                hide-details
                :readonly="isReadOnly"
                @update:model-value="onUpdateIsDisplayUnitPrice"
              />
            </div>

            <v-divider class="my-1" />
            <div class="d-flex align-center justify-space-between py-2">
              <div>
                <div class="text-body-2 font-weight-medium">
                  Commission hors dégarnissage
                </div>
                <div class="text-caption text-medium-emphasis">
                  Exclure le dégarnissage de la base de commission
                </div>
              </div>
              <v-switch
                :model-value="isComputeCommissionWithoutDentRemoval"
                color="primary"
                inset
                hide-details
                :readonly="isReadOnly"
                @update:model-value="onUpdateIsComputeCommissionWithoutDentRemoval"
              />
            </div>
          </template>
        </div>

        <!-- ── Section 6 : Lignes du devis ── -->
        <div
          v-if="!isForfait"
          class="section-card mb-4"
        >
          <div class="section-header mb-3">
            <div class="section-icon">
              <v-icon
                size="18"
                color="primary"
              >
                mdi-format-list-bulleted
              </v-icon>
            </div>
            <span class="text-subtitle-2 font-weight-semibold">Éléments du devis</span>
            <v-spacer />
            <v-chip
              size="x-small"
              variant="tonal"
              color="primary"
            >
              {{ quoteLines.length }}
            </v-chip>
          </div>

          <!-- Liste mobile des lignes -->
          <div
            v-if="quoteLines.length > 0"
            class="line-items-list"
          >
            <div
              v-for="line in quoteLines"
              :key="line.id"
              class="line-item-card"
            >
              <div class="d-flex align-start justify-space-between">
                <div class="flex-grow-1 min-w-0">
                  <!-- Pièce + matériau -->
                  <div class="d-flex align-center gap-2 mb-1 flex-wrap">
                    <span class="text-body-2 font-weight-medium">
                      {{ line.bodyPart?.name ?? '—' }}
                    </span>
                    <v-chip
                      v-if="line.bodyMaterial"
                      size="x-small"
                      variant="tonal"
                      color="blue-grey"
                    >
                      {{ line.bodyMaterial.name }}
                    </v-chip>
                    <v-chip
                      v-if="line.repairType"
                      size="x-small"
                      variant="tonal"
                      color="indigo"
                    >
                      {{ line.repairType.name }}
                    </v-chip>
                  </div>
                  <!-- Impacts -->
                  <div class="d-flex gap-3 text-caption text-medium-emphasis">
                    <span>Ø 25 : <strong>{{ line.impactCount25 ?? 0 }}</strong></span>
                    <span>Ø 35 : <strong>{{ line.impactCount35 ?? 0 }}</strong></span>
                    <span v-if="line.dentRemovalPrice">
                      Dégarn. : <strong>{{ line.dentRemovalPrice.toFixed(2) }} {{ selectedCountry?.currencySymbol || '€' }}</strong>
                    </span>
                  </div>
                </div>
                <!-- Prix + supprimer -->
                <div class="d-flex flex-column align-end gap-1 ml-2 flex-shrink-0">
                  <span class="text-body-2 font-weight-bold text-primary">
                    {{ line.price?.toFixed(2) ?? '0.00' }} {{ selectedCountry?.currencySymbol || '€' }}
                  </span>
                  <v-btn
                    v-if="!isReadOnly"
                    icon
                    variant="text"
                    size="x-small"
                    color="error"
                    @click="onRemoveItemBtnClick(line)"
                  >
                    <v-icon size="16">
                      mdi-delete-outline
                    </v-icon>
                  </v-btn>
                </div>
              </div>
            </div>
          </div>

          <!-- État vide -->
          <div
            v-else
            class="text-center py-6 text-medium-emphasis"
          >
            <v-icon
              size="40"
              class="mb-2 opacity-40"
            >
              mdi-playlist-plus
            </v-icon>
            <div class="text-body-2">
              Aucun élément pour l'instant
            </div>
          </div>

          <!-- Bouton ajouter -->
          <v-btn
            v-if="!isReadOnly"
            variant="tonal"
            color="primary"
            block
            class="mt-3"
            prepend-icon="mdi-plus"
            @click="onAddItemBtnClick"
          >
            Ajouter un élément
          </v-btn>
        </div>

        <!-- ── Section 7 : Totaux ── -->
        <div class="section-card mb-4">
          <div class="section-header mb-3">
            <div class="section-icon">
              <v-icon
                size="18"
                color="primary"
              >
                mdi-calculator-variant-outline
              </v-icon>
            </div>
            <span class="text-subtitle-2 font-weight-semibold">Récapitulatif</span>
          </div>

          <div class="totals-list">
            <div class="total-row">
              <span class="text-body-2 text-medium-emphasis">Total H.T</span>
              <span class="text-body-2 font-weight-medium">
                {{ regionManager.formatNumber(subtotal) }} {{ selectedCountry?.currencySymbol || '€' }}
              </span>
            </div>
            <template v-if="!isForfait">
              <div class="total-row">
                <span class="text-body-2 text-medium-emphasis">Total dégarnissage</span>
                <span class="text-body-2 font-weight-medium">
                  {{ regionManager.formatNumber(totalDegarnissage) }} {{ selectedCountry?.currencySymbol || '€' }}
                </span>
              </div>
              <div class="total-row">
                <span class="text-body-2 text-medium-emphasis">H.T + Dégarnissage</span>
                <span class="text-body-2 font-weight-medium">
                  {{ regionManager.formatNumber(subTotalWithDegarnissage) }} {{ selectedCountry?.currencySymbol || '€' }}
                </span>
              </div>
            </template>
            <div class="total-row">
              <span class="text-body-2 text-medium-emphasis">TVA ({{ selectedCountry?.taxRate || 0 }}%)</span>
              <span class="text-body-2 font-weight-medium">
                {{ regionManager.formatNumber(totalTaxRate) }} {{ selectedCountry?.currencySymbol || '€' }}
              </span>
            </div>
            <div
              v-if="selectedGarage?.percentageCommission"
              class="total-row text-orange"
            >
              <span class="text-body-2">Commission ({{ selectedGarage.percentageCommission }}%)</span>
              <span class="text-body-2 font-weight-medium">
                {{ regionManager.formatNumber(totalCommission) }} {{ selectedCountry?.currencySymbol || '€' }}
              </span>
            </div>
            <v-divider class="my-2" />
            <div class="total-row total-row--final">
              <span class="text-subtitle-2 font-weight-bold">Total TTC</span>
              <span class="text-subtitle-2 font-weight-bold text-primary">
                {{ regionManager.formatNumber(total) }} {{ selectedCountry?.currencySymbol || '€' }}
              </span>
            </div>
          </div>
        </div>
      </v-form>

      <!-- ═══════════════════════════════════════════════════
           STICKY BOTTOM — Sauvegarder
      ════════════════════════════════════════════════════ -->
      <div
        v-if="!isReadOnly && quoteInformations.status?.code !== 'accepted'"
        class="sticky-bottom-bar"
      >
        <v-btn
          color="primary"
          size="large"
          block
          rounded="lg"
          elevation="0"
          prepend-icon="mdi-content-save-outline"
          @click="onUpdateBtnClick"
        >
          Sauvegarder
        </v-btn>
      </div>
    </v-container>
  </MainLayout>

  <!-- ── Dialogs ── -->
  <GarageDialog
    ref="garageDialogRef"
    title="Modifier le client"
    persistent
    :max-width="500"
    @validated="onGarageValidated"
  />

  <AddLineItemDialog
    ref="addLineItemDialogRef"
    title="Ajouter un élément"
    :available-body-parts="availableBodyParts"
    @add="onAddLineItem"
  />

  <ConfirmDialog
    ref="deleteQuoteConfirmDialogRef"
    title="Supprimer le devis"
    message="Cette action est irréversible. Confirmer la suppression ?"
    confirm-label="Supprimer"
    cancel-label="Annuler"
    type="warning"
    @confirm="onConfirmDeleteQuote"
  />
</template>

<script setup lang="ts">
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { IRegionManager } from '@/@core/managers/interfaces/IRegionManager';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import BackButton from '@/@presentation/@ui/components/buttons/BackButton.vue';
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';
import AddLineItemDialog from '@/@presentation/components/AddLineItemDialog.vue';
import { ConfirmDialogExposed } from '@/@presentation/components/ConfirmDialog';
import ConfirmDialog from '@/@presentation/components/ConfirmDialog.vue';
import CountrySelect from '@/@presentation/components/CountrySelect.vue';
import { GarageDialogExposed } from '@/@presentation/components/GarageDialog';
import GarageDialog from '@/@presentation/components/GarageDialog.vue';
import type { AddLineItemDialogExposed } from '@/@presentation/types/components';
import { IUseEditQuoteState } from '@/@presentation/types/composables/IUseEditQuoteState';
import { CountryViewModel } from '@/@presentation/types/models/CountryViewModel';
import { GarageViewModel } from '@/@presentation/types/models/GarageViewModel';
import { LineItemViewModel } from '@/@presentation/types/models/LineItemViewModel';
import { UserViewModel } from '@/@presentation/types/models/UserViewModel';
import { VehicleViewModel } from '@/@presentation/types/models/VehicleViewModel';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// ── Services ─────────────────────────────────────────────────────────────────
const regionManager = container.get<IRegionManager>(SYMBOLS.Managers.regionManager);
const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
const { isFreePlan } = authState;

// ── Refs dialogs ─────────────────────────────────────────────────────────────
const garageDialogRef = ref<GarageDialogExposed>();
const addLineItemDialogRef = ref<AddLineItemDialogExposed>();
const deleteQuoteConfirmDialogRef = ref<ConfirmDialogExposed>();

// ── State ─────────────────────────────────────────────────────────────────────
const useEditQuoteState = container.get<IUseEditQuoteState>(SYMBOLS.States.Quote.EditQuoteState);

const {
  init,
  quoteInformations,
  expirationDate,
  technicians,
  garages,
  selectedTechnician,
  selectedGarage,
  selectGarage,
  selectTechnician,
  setGarage,
  vehicles,
  selectedVehicle,
  selectVehicle,
  carInformations,
  setCarImmatriculation,
  setCarBrand,
  setCarDateEntryCirculation,
  availableBodyParts,
  isForfait,
  isDisplayUnitPrice,
  isComputeCommissionWithoutDentRemoval,
  setIsForfait,
  setForfaitAmount,
  setIsDisplayUnitPrice,
  setIsComputeCommissionWithoutDentRemoval,
  forfaitAmount,
  selectCountry,
  selectedCountry,
  quoteLines,
  addLine,
  removeLine,
  subtotal,
  totalDegarnissage,
  subTotalWithDegarnissage,
  totalTaxRate,
  totalCommission,
  total,
  updateQuote,
  deleteQuote,
  duplicateQuoteToInvoice,
  isReadOnly,
  isAccepted,
  // isRefused,
  updateQuoteStatus,
} = useEditQuoteState;

const router = useRouter();
const route = useRoute();
const vehiclesList = computed(() => vehicles.value);

// ── Helpers ───────────────────────────────────────────────────────────────────
const initials = (name: string) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

const statusColor = (code?: string) => {
  switch (code) {
    case 'processing': return 'blue';
    case 'accepted':   return 'success';
    case 'refused':    return 'error';
    case 'cancelled':  return 'error';
    case 'invoiced':   return 'blue';
    case 'pending':    return 'warning';
    default:           return 'default';
  }
};

const statusLabel = (code?: string) => {
  switch (code) {
    case 'accepted':   return 'Accepté';
    case 'refused':    return 'Refusé';
    case 'cancelled':  return 'Annulé';
    case 'invoiced':   return 'Facturé';
    case 'pending':    return 'En attente';
    case 'draft':      return 'Brouillon';
    case 'processing': return 'En cours';
    default:           return code ?? '';
  }
};

// ── Handlers form ─────────────────────────────────────────────────────────────
const onSelectTechnician = (t: UserViewModel) => selectTechnician(t);
const onSelectGarage = (g: GarageViewModel) => selectGarage(g);
const onSelectVehicle = (v: VehicleViewModel | undefined) => selectVehicle(v);
const onEditCustomerBtnClick = () => garageDialogRef.value?.open();
const onGarageValidated = (g: GarageViewModel) => setGarage(g);
const onCarImmatriculationUpdated = (v: string) => setCarImmatriculation(v);
const onCarBrandUpdated = (v: string) => setCarBrand(v);
const onCarYearUpdated = (v: string) => setCarDateEntryCirculation(v);
const onUpdateIsForfait = (v: boolean | null) => setIsForfait(v ?? false);
const onUpdateForfaitAmount = (v: number) => setForfaitAmount(Number(v));
const onUpdateIsDisplayUnitPrice = (v: boolean | null) => setIsDisplayUnitPrice(v ?? true);
const onUpdateIsComputeCommissionWithoutDentRemoval = (v: boolean | null) => setIsComputeCommissionWithoutDentRemoval(v ?? true);
const onSelectCountry = (c: CountryViewModel | undefined) => {
  if (c) {
    selectCountry(c);
  }
 };

// ── Handlers lignes ───────────────────────────────────────────────────────────
const onAddItemBtnClick = () => addLineItemDialogRef.value?.open();
const onRemoveItemBtnClick = (item: LineItemViewModel) => removeLine(item.id);
const onAddLineItem = (item: LineItemViewModel) => addLine(item);

// ── Handlers actions ──────────────────────────────────────────────────────────
const onAcceptedBtnClick = () => updateQuoteStatus({ code: 'accepted'});
const onRefusedBtnClick = () => updateQuoteStatus({ code: 'refused'});
const onSendBtnClick = () => console.log('send quote');
const onDuplicateQuoteToInvoiceBtnClick = () => duplicateQuoteToInvoice();
const onViewPdfBtnClick = () => router.push(`/quotes/${route.params.id}/view`);
const onDeleteBtnClick = () => deleteQuoteConfirmDialogRef.value?.open();
const onConfirmDeleteQuote = () => {
  deleteQuote();
  router.push('/quotes/');
};
const onUpdateBtnClick = () => updateQuote();

onMounted(async () => {
  await init(route.params.id);
});
</script>

<style scoped>
.edit-quote-container {
  min-height: 100dvh;
  background: rgb(var(--v-theme-background));
}

/* Header sticky */
.page-header {
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
  position: sticky;
  top: 0;
  z-index: 10;
}

/* Section cards */
.section-card {
  background: rgb(var(--v-theme-surface));
  border-radius: 16px;
  padding: 16px;
  border: 1px solid rgba(var(--v-border-color), 0.08);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(var(--v-theme-primary), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Line items */
.line-items-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.line-item-card {
  border: 1px solid rgba(var(--v-border-color), 0.15);
  border-radius: 12px;
  padding: 12px;
  background: rgba(var(--v-theme-surface-variant), 0.3);
}

/* Totaux */
.totals-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}

.total-row--final {
  padding-top: 8px;
}

/* Sticky bottom */
.sticky-bottom-bar {
  position: sticky;
  bottom: 0;
  z-index: 10;
  padding: 12px 16px;
  padding-bottom: max(12px, env(safe-area-inset-bottom));
  background: rgb(var(--v-theme-surface));
  border-top: 1px solid rgba(var(--v-border-color), 0.12);
}

.pb-28 {
  padding-bottom: 80px;
}

.min-w-0 {
  min-width: 0;
}
</style>
