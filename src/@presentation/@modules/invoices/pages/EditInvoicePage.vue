<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-0 edit-invoice-container"
    >
      <!-- ═══════════════════════════════════════════════════
           HEADER sticky
      ════════════════════════════════════════════════════ -->
      <div class="page-header px-3 py-2">
        <div class="d-flex align-center justify-space-between">
          <!-- Gauche : retour + titre -->
          <div class="d-flex flex-column align-center gap-2 min-w-0">
            <div class="d-flex min-w-0">
              <v-btn
                icon
                variant="text"
                size="small"
                @click="$router.back()"
              >
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
              <div class="d-flex flex-column  align-left gap-2 flex-wrap ml-5">
                <div>
                  <span class="text-subtitle-1 font-weight-bold text-truncate my-2">
                    Facture numéro :
                  </span>
                  {{ invoiceInformations.number || 'Facture' }}
                </div>
                <div>
                  <span class="text-subtitle-1 font-weight-bold text-truncate my-2">
                    Statut :
                  </span>
                  <v-chip
                    v-if="invoiceStatus"
                    size="x-small"
                    :color="paymentStatusColor(invoiceStatus)"
                    variant="tonal"
                    class="mt-0"
                  >
                    {{ paymentStatusLabel(invoiceStatus) }}
                  </v-chip>
                </div>
              </div>
            </div>
          </div>

          <!-- Droite : actions -->
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
                  prepend-icon="mdi-send-outline"
                  title="Envoyer"
                  @click="onSendBtnClick"
                />
                <v-list-item
                  prepend-icon="mdi-check-bold"
                  title="Finaliser"
                  @click="onFinalizeBtnClick"
                />
                <v-divider />
                <v-list-item
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
        <!-- ── Section : Statut de paiement ── -->
        <div class="section-card mb-4">
          <div class="section-header mb-3">
            <div class="section-icon">
              <v-icon
                size="18"
                color="primary"
              >
                mdi-cash-check
              </v-icon>
            </div>
            <span class="text-subtitle-2 font-weight-semibold">Statut de paiement</span>
          </div>

          <div class="d-flex gap-3">
            <v-btn
              :variant="invoiceStatus === 'pending' ? 'flat' : 'tonal'"
              :color="invoiceStatus === 'pending' ? 'orange' : undefined"
              class="flex-grow-1 status-btn"
              :prepend-icon="invoiceStatus === 'pending' ? 'mdi-clock' : 'mdi-clock-outline'"
              :loading="statusLoading && invoiceStatus !== 'pending'"
              rounded="lg"
              @click="onUpdateStatus('pending')"
            >
              En attente
            </v-btn>
            <v-btn
              :variant="invoiceStatus === 'validated' ? 'flat' : 'tonal'"
              :color="invoiceStatus === 'validated' ? 'success' : undefined"
              class="flex-grow-1 status-btn"
              :prepend-icon="invoiceStatus === 'validated' ? 'mdi-check-circle' : 'mdi-check-circle-outline'"
              :loading="statusLoading && invoiceStatus !== 'validated'"
              rounded="lg"
              @click="onUpdateStatus('validated')"
            >
              Payé
            </v-btn>
          </div>

          <div class="mt-2 text-caption text-medium-emphasis d-flex align-center gap-1">
            <v-icon size="13">
              mdi-information-outline
            </v-icon>
            Le statut est mis à jour immédiatement et reflété dans le tableau de bord.
          </div>
        </div>
        
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
                v-model="invoiceInformations.date"
                label="Date de facturation"
                type="date"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                :model-value="expirationDate"
                label="Échéance"
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
            :item-title="item => `${item.users.first_name} ${item.users.last_name}`"
            item-value="id"
            return-object
            label="Sélectionner un technicien"
            variant="outlined"
            density="comfortable"
            clearable
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
                      {{ initials(item.raw.users.first_name + ' ' + item.raw.users.last_name) }}
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
                  >{{ initials(item.raw.users.first_name + ' ' + item.raw.users.last_name) }}</span>
                </v-avatar>
                <span>{{ item.raw.users.first_name }} {{ item.raw.users.last_name }}</span>
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
                mdi-garage
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
            clearable
            hide-details="auto"
            prepend-inner-icon="mdi-garage"
            @update:model-value="onSelectGarage"
          >
            <template #item="{ props: itemProps, item }">
              <v-list-item
                v-bind="itemProps"
                :subtitle="item.raw.city ?? ''"
              >
                <template #prepend>
                  <v-icon color="primary">
                    mdi-garage
                  </v-icon>
                </template>
              </v-list-item>
            </template>
          </v-autocomplete>

          <v-btn
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
                    mdi-garage
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
                mdi-car
              </v-icon>
            </div>
            <span class="text-subtitle-2 font-weight-semibold">Véhicule</span>
          </div>

          <!-- <v-autocomplete
            :model-value="selectedVehicle"
            :items="vehiclesList"
            :item-title="v => v.immatriculation + ' — ' + v.marque + (v.annee ? ' ' + v.annee : '')"
            item-value="id"
            return-object
            label="Véhicule existant (optionnel)"
            variant="outlined"
            density="comfortable"
            clearable
            :disabled="!selectedGarage"
            :no-data-text="selectedGarage ? 'Aucun véhicule trouvé' : 'Sélectionnez d\'abord un garage'"
            hide-details="auto"
            prepend-inner-icon="mdi-car-search-outline"
            class="mb-3"
            @update:model-value="onSelectVehicle"
          /> -->

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
                  Afficher le détail sur la facture
                </div>
              </div>
              <v-switch
                :model-value="isDisplayUnitPrice"
                color="primary"
                inset
                hide-details
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
                @update:model-value="onUpdateIsComputeCommissionWithoutDentRemoval"
              />
            </div>
          </template>
        </div>

        <!-- ── Section 6 : Lignes de la facture ── -->
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
            <span class="text-subtitle-2 font-weight-semibold">Éléments de la facture</span>
            <v-spacer />
            <v-chip
              size="x-small"
              variant="tonal"
              color="primary"
            >
              {{ invoiceLines.length }}
            </v-chip>
          </div>

          <!-- Liste mobile des lignes -->
          <div
            v-if="invoiceLines.length > 0"
            class="line-items-list"
          >
            <div
              v-for="line in invoiceLines"
              :key="line.id"
              class="line-item-card"
            >
              <div class="d-flex align-center justify-space-between">
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
                      color="primary"
                      class="ml-2"
                    >
                      {{ line.bodyMaterial.name }}
                    </v-chip>
                    <v-chip
                      v-if="line.repairType"
                      size="x-small"
                      variant="tonal"
                      color="primary"
                      class="ml-2"
                    >
                      {{ line.repairType.name }}
                    </v-chip>
                  </div>
                  <!-- Impacts -->
                  <div class="d-flex gap-3 text-caption text-medium-emphasis">
                    <span>Ø 25 : <strong>{{ line.impactCount25 ?? 0 }}</strong></span>
                    <span class="ml-2">Ø 35 : <strong>{{ line.impactCount35 ?? 0 }}</strong></span>
                    <span
                      v-if="line.dentRemovalPrice"
                      class="ml-2"
                    >
                      Dégarnissage : <strong>{{ line.dentRemovalPrice.toFixed(2) }} {{ selectedCountry?.currencySymbol || '€' }}</strong>
                    </span>
                  </div>
                </div>
                <!-- Prix + supprimer -->
                <div class="d-flex align-center gap-1 ml-2 flex-shrink-0">
                  <span class="text-body-1 font-weight-bold text-primary">
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

          <v-btn
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

        <!-- ── Section 7 : Récapitulatif ── -->
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
      <div class="sticky-bottom-bar">
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
    ref="deleteInvoiceConfirmDialogRef"
    title="Supprimer la facture"
    message="Cette action est irréversible. Confirmer la suppression ?"
    confirm-label="Supprimer"
    cancel-label="Annuler"
    type="warning"
    @confirm="onConfirmDeleteInvoice"
  />

  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    timeout="4000"
    location="bottom right"
  >
    {{ snackbar.message }}
  </v-snackbar>
</template>

<script setup lang="ts">
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
import { IUseEditInvoiceState } from '@/@presentation/types/composables/IUseEditInvoiceState';
import type { InvoiceStatusViewType } from '@/@presentation/types/models/InvoiceStatusViewType';
import { CountryViewModel } from '@/@presentation/types/models/CountryViewModel';
import { GarageViewModel } from '@/@presentation/types/models/GarageViewModel';
import { LineItemViewModel } from '@/@presentation/types/models/LineItemViewModel';
import { UserViewModel } from '@/@presentation/types/models/UserViewModel';
import { VehicleViewModel } from '@/@presentation/types/models/VehicleViewModel';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// ── Services ──────────────────────────────────────────────────────────────────
const regionManager = container.get<IRegionManager>(SYMBOLS.Managers.regionManager);

// ── Refs dialogs ──────────────────────────────────────────────────────────────
const garageDialogRef = ref<GarageDialogExposed>();
const addLineItemDialogRef = ref<AddLineItemDialogExposed>();
const deleteInvoiceConfirmDialogRef = ref<ConfirmDialogExposed>();

// ── State ─────────────────────────────────────────────────────────────────────
const useEditInvoiceState = container.get<IUseEditInvoiceState>(SYMBOLS.States.Invoice.EditInvoiceState);

const {
  init,
  invoiceInformations,
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
  invoiceLines,
  addLine,
  removeLine,
  subtotal,
  totalDegarnissage,
  subTotalWithDegarnissage,
  totalTaxRate,
  totalCommission,
  total,
  invoiceStatus,
  updateInvoice,
  updateInvoiceStatus,
  deleteInvoice,
  sendInvoice,
} = useEditInvoiceState;

const router = useRouter();
const route = useRoute();
const vehiclesList = computed(() => vehicles.value);
const statusLoading = ref(false);
const snackbar = reactive({ show: false, message: '', color: 'success' });
const showSnack = (message: string, color = 'success') => { snackbar.message = message; snackbar.color = color; snackbar.show = true; };

// ── Helpers ───────────────────────────────────────────────────────────────────
const initials = (name: string) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

const paymentStatusColor = (status?: string) => ({
  pending: 'orange',
  validated: 'success',
  accepted: 'success',
  signed: 'success',
  sent: 'blue',
  draft: 'grey',
  cancel: 'error',
} as Record<string, string>)[status ?? ''] ?? 'default';

const paymentStatusLabel = (status?: string) => ({
  pending: 'En attente',
  validated: 'Payé',
  accepted: 'Accepté',
  signed: 'Signé',
  sent: 'Envoyé',
  draft: 'Brouillon',
  cancel: 'Annulé',
} as Record<string, string>)[status ?? ''] ?? (status ?? '');

// ── Handlers form ─────────────────────────────────────────────────────────────
const onSelectTechnician = (t: UserViewModel) => selectTechnician(t);
const onSelectGarage = (g: GarageViewModel) => selectGarage(g);
const onSelectVehicle = (v: VehicleViewModel | undefined) => selectVehicle(v);
const onEditCustomerBtnClick = () => garageDialogRef.value?.open();
const onGarageValidated = (g: GarageViewModel) => setGarage(g);
const onCarImmatriculationUpdated = (v: string) => setCarImmatriculation(v);
const onCarBrandUpdated = (v: string) => setCarBrand(v);
const onCarYearUpdated = (v: string) => setCarDateEntryCirculation(v);
const onUpdateIsForfait = (v: boolean) => setIsForfait(v);
const onUpdateForfaitAmount = (v: number) => setForfaitAmount(Number(v));
const onUpdateIsDisplayUnitPrice = (v: boolean) => setIsDisplayUnitPrice(v);
const onUpdateIsComputeCommissionWithoutDentRemoval = (v: boolean) => setIsComputeCommissionWithoutDentRemoval(v);
const onSelectCountry = (c: CountryViewModel | undefined) => { if (c) selectCountry(c); };

// ── Handlers lignes ───────────────────────────────────────────────────────────
const onAddItemBtnClick = () => addLineItemDialogRef.value?.open();
const onRemoveItemBtnClick = (item: LineItemViewModel) => removeLine(item.id);
const onAddLineItem = (item: LineItemViewModel) => addLine(item);

// ── Handlers statut ──────────────────────────────────────────────────────────
const onUpdateStatus = async (status: InvoiceStatusViewType) => {
  statusLoading.value = true;
  try {
    await updateInvoiceStatus(status);
  } catch (e) {
    console.error('Error updating invoice status:', e);
  } finally {
    statusLoading.value = false;
  }
};

// ── Handlers actions ──────────────────────────────────────────────────────────
const onFinalizeBtnClick = () => console.log('finalize invoice');
const onSendBtnClick = async () => {
  try {
    await sendInvoice();
    showSnack('Facture envoyée avec succès.');
  } catch {
    showSnack("Erreur lors de l'envoi de la facture.", 'error');
  }
};
const onViewPdfBtnClick = () => router.push(`/invoices/view/${route.params.id}`);
const onDeleteBtnClick = () => deleteInvoiceConfirmDialogRef.value?.open();
const onConfirmDeleteInvoice = () => {
  deleteInvoice(invoiceInformations.value.number);
  router.push('/invoices/');
};
const onUpdateBtnClick = async () => {
  try {
    await updateInvoice();
    router.push('/invoices/');
  } catch {
    // validation errors — stay on page
  }
};

onMounted(async () => {
  await init(route.params.id);
});
</script>

<style scoped>
.edit-invoice-container {
  min-height: 100dvh;
  background: rgb(var(--v-theme-background));
}

.page-header {
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
  position: sticky;
  top: 0;
  z-index: 10;
}

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
  padding-bottom: 16px;
}

.min-w-0 {
  min-width: 0;
}

.status-btn {
  height: 48px !important;
  font-weight: 600;
  letter-spacing: 0.01em;
}
</style>
