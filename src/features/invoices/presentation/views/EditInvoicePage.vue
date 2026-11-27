<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-0 mt-4 edit-invoice-container"
      :class="{ 'is-dark': isDark }"
    >
      <!-- ═══════════════════════════════════════════════════
            HEADER
        ════════════════════════════════════════════════════ -->
      <div class="page-header mx-3 mb-3 px-4 py-3 d-flex align-center justify-space-between flex-wrap gap-2">
        <div class="d-flex align-center gap-3 min-w-0">
          <v-btn
            icon
            variant="outlined"
            size="small"
            class="header-back"
            @click="$router.back()"
          >
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <div class="ml-3">
            <div class="text-h6 font-weight-bold">
              {{ t('invoices.view.title', { number: invoiceInformations.number || '' }) }}
            </div>
            <div
              v-if="invoiceInformations.date"
              class="text-caption text-medium-emphasis"
            >
              {{ t('invoices.view.createdOn', { date: formatDate(invoiceInformations.date) }) }}
              <template v-if="invoiceInformations.quoteNumber">
                · {{ t('invoices.view.fromQuote', { number: invoiceInformations.quoteNumber }) }}
              </template>
            </div>
          </div>
          <v-chip
            v-if="invoiceStatus"
            class="ml-3"
            :color="statusColor(invoiceStatus)"
            size="small"
            variant="tonal"
          >
            {{ statusLabel(invoiceStatus) }}
          </v-chip>
        </div>

        <div class="d-flex align-center ga-3 flex-shrink-0">
          <v-btn
            variant="outlined"
            height="40"
            class="px-5 header-btn"
            prepend-icon="mdi-file-pdf-box"
            @click="onViewPdfBtnClick"
          >
            {{ t('invoices.actions.viewPdf') }}
          </v-btn>
        </div>
      </div>

      <!-- Bandeau : facture verrouillée dès qu'elle n'est plus un brouillon -->
      <v-alert
        v-if="isReadOnly"
        class="mx-3 mb-3"
        type="info"
        variant="tonal"
        density="comfortable"
        icon="mdi-lock-outline"
      >
        {{ t('invoices.edit.final') }}
      </v-alert>

      <!-- ═══════════════════════════════════════════════════
            FORM
        ════════════════════════════════════════════════════ -->
      <v-form
        ref="form"
        class="px-3 pt-3 pb-28"
      >
        <v-row>
          <v-col
            cols="12"
            md="8"
          >
            <!-- ── Dates ── -->
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
                <span class="text-subtitle-1 font-weight-bold">{{ t('invoices.form.dates') }}</span>
              </div>
              <v-row dense>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="invoiceInformations.date"
                    :label="t('invoices.form.invoiceDate')"
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
                    :label="t('invoices.form.dueDate')"
                    type="date"
                    variant="outlined"
                    density="comfortable"
                    readonly
                    hide-details="auto"
                  />
                </v-col>
              </v-row>
            </div>

            <v-row class="equal-height-row">
              <v-col
                cols="12"
                md="6"
                class="d-flex"
              >
                <!-- ── Technicien ── -->
                <div class="section-card mb-4 flex-grow-1">
                  <div class="section-header mb-3">
                    <div class="section-icon">
                      <v-icon
                        size="18"
                        color="primary"
                      >
                        mdi-account-wrench-outline
                      </v-icon>
                    </div>
                    <span class="text-subtitle-1 font-weight-bold">{{ t('invoices.form.technician') }}</span>
                  </div>
                  <v-autocomplete
                    :model-value="selectedTechnician"
                    :items="technicians"
                    :item-title="item => `${item.users.first_name} ${item.users.last_name}`"
                    item-value="id"
                    return-object
                    :label="t('invoices.form.selectTechnician')"
                    variant="outlined"
                    density="comfortable"
                    :readonly="isReadOnly"
                    :clearable="!isReadOnly"
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
              </v-col>
              <v-col
                cols="12"
                md="6"
                class="d-flex"
              >
                <!-- ── Client / Garage (même rendu que la page devis) ── -->
                <div class="section-card mb-4 flex-grow-1">
                  <div class="section-header mb-3">
                    <div class="section-icon">
                      <v-icon
                        size="18"
                        color="primary"
                      >
                        mdi-garage
                      </v-icon>
                    </div>
                    <span class="text-subtitle-1 font-weight-bold">{{ t('invoices.edit.clientGarage') }}</span>
                  </div>

                  <v-autocomplete
                    :model-value="selectedGarage"
                    :items="garages"
                    item-title="name"
                    item-value="id"
                    return-object
                    :label="t('invoices.form.selectGarage')"
                    variant="outlined"
                    density="comfortable"
                    :clearable="!isReadOnly"
                    :readonly="isReadOnly"
                    hide-details="auto"
                    prepend-inner-icon="mdi-garage"
                    @update:model-value="onSelectGarage"
                  >
                    <template #item="{ props: itemProps, item }">
                      <v-list-item
                        v-bind="itemProps"
                        :subtitle="[item.raw.address, item.raw.zip_code, item.raw.city].filter(Boolean).join(' ')"
                      >
                        <template #prepend>
                          <v-icon color="primary">
                            mdi-garage
                          </v-icon>
                        </template>
                      </v-list-item>
                    </template>
                    <template #selection="{ item }">
                      <span>{{ item.raw.name }}</span>
                      <span
                        v-if="item.raw.city"
                        class="text-medium-emphasis ml-1"
                      >· {{ item.raw.city }}</span>
                    </template>
                  </v-autocomplete>

                  <div
                    v-if="selectedGarage?.percentageCommission"
                    class="text-caption text-medium-emphasis mt-2"
                  >
                    {{ t('invoices.form.commission', { rate: selectedGarage.percentageCommission }) }}
                  </div>
                </div>
              </v-col>
            </v-row>

            <!-- ── Véhicule ── -->
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
                <span class="text-subtitle-1 font-weight-bold">{{ t('invoices.form.vehicleInfo') }}</span>
              </div>

              <v-row dense>
                <v-col
                  cols="12"
                  sm="4"
                >
                  <v-text-field
                    v-model="carInformations.immatriculation"
                    :label="t('invoices.form.plate')"
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
                    :label="t('invoices.form.brand')"
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
                    :label="t('invoices.form.year')"
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

            <!-- ── Éléments de la facture ── -->
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
                <span class="text-subtitle-1 font-weight-bold">{{ t('invoices.form.items') }}</span>
                <v-chip
                  size="x-small"
                  variant="tonal"
                  color="primary"
                >
                  {{ invoiceLines.length }}
                </v-chip>
                <v-spacer />
                <v-btn
                  v-if="!isReadOnly"
                  variant="tonal"
                  color="primary"
                  size="small"
                  prepend-icon="mdi-format-list-bulleted-square"
                  @click="onManageItemsBtnClick"
                >
                  {{ t('invoices.edit.manageItems') }}
                </v-btn>
              </div>

              <div
                v-if="invoiceLines.length > 0"
                class="line-items-list"
              >
                <div
                  v-for="line in invoiceLines"
                  :key="line.id"
                  class="d-flex justify-space-between align-center py-2 line-summary"
                >
                  <span class="text-body-2">
                    {{ line.bodyPart ? bodyPartLabel(line.bodyPart) : '—' }}
                    <span class="text-medium-emphasis">
                      · {{ line.bodyMaterial ? bodyMaterialLabel(line.bodyMaterial) : '' }} · {{ line.repairType ? repairTypeLabel(line.repairType) : '' }}
                    </span>
                  </span>
                  <span class="text-body-2 font-weight-bold flex-shrink-0 ml-2">
                    {{ regionManager.formatNumber(line.price ?? 0) }} {{ selectedCountry?.currencySymbol || '€' }}
                  </span>
                </div>
              </div>

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
                  {{ t('invoices.edit.noItems') }}
                </div>
              </div>
            </div>
          </v-col>

          <!-- ═════════════ Colonne droite ═════════════ -->
          <v-col
            cols="12"
            md="4"
          >
            <div class="side-sticky">
              <!-- ── Statut ── -->
              <div class="section-card mb-4">
                <div class="section-header mb-3">
                  <div class="section-icon">
                    <v-icon
                      size="18"
                      color="primary"
                    >
                      mdi-flag-outline
                    </v-icon>
                  </div>
                  <span class="text-subtitle-1 font-weight-bold">{{ t('invoices.form.invoiceStatus') }}</span>
                </div>

                <v-chip
                  v-if="invoiceStatus"
                  :color="statusColor(invoiceStatus)"
                  size="small"
                  variant="tonal"
                  class="mb-3"
                >
                  {{ statusLabel(invoiceStatus) }}
                </v-chip>

                <div
                  v-if="isSent"
                  class="sent-info text-caption mb-3"
                >
                  {{ t('invoices.edit.sentOn', { date: sentAt ? formatSentAt(sentAt) : '' }) }}
                  <span v-if="selectedGarage"> {{ t('invoices.edit.sentTo', { name: selectedGarage.name }) }}</span>
                </div>

                <div class="d-flex flex-column ga-2">
                  <!-- Brouillon : envoi définitif (au moins un élément requis) -->
                  <FeatureGate
                    v-if="!isReadOnly"
                    v-slot="{ locked }"
                    feature="invoice_email_sending"
                  >
                    <v-btn
                      color="blue"
                      variant="tonal"
                      block
                      prepend-icon="mdi-send-outline"
                      :disabled="locked || !hasItems"
                      :loading="sending"
                      @click="onAskSend"
                    >
                      {{ t('invoices.form.sendToClient') }}
                    </v-btn>
                  </FeatureGate>
                  <v-btn
                    v-if="!isReadOnly && !can('invoice_email_sending')"
                    color="primary"
                    variant="flat"
                    block
                    prepend-icon="mdi-check-circle-outline"
                    :disabled="!hasItems"
                    :loading="sending"
                    @click="onAskFinalize"
                  >
                    {{ t('invoices.edit.finalize') }}
                  </v-btn>
                  <div
                    v-if="!isReadOnly && !hasItems"
                    class="text-caption text-medium-emphasis"
                  >
                    {{ t('invoices.edit.addAtLeastOne') }}
                  </div>
                  <!-- Facture verrouillée : seul le paiement peut évoluer -->
                  <v-btn
                    v-if="canMarkPaid"
                    color="success"
                    variant="tonal"
                    prepend-icon="mdi-check-circle-outline"
                    :loading="statusLoading"
                    @click="onMarkPaid"
                  >
                    {{ t('invoices.actions.markPaid') }}
                  </v-btn>
                  <!-- Suppression : brouillon uniquement (une facture émise ne se supprime pas) -->
                  <v-btn
                    v-if="canDelete"
                    color="error"
                    variant="tonal"
                    prepend-icon="mdi-delete-outline"
                    @click="onDeleteBtnClick"
                  >
                    {{ t('invoices.edit.deleteDraft') }}
                  </v-btn>
                </div>
              </div>

              <!-- ── Options ── -->
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
                  <span class="text-subtitle-1 font-weight-bold">{{ t('invoices.form.options') }}</span>
                </div>

                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis mb-1 font-weight-medium">
                    {{ t('invoices.form.countryVat') }}
                  </div>
                  <CountrySelect
                    :model-value="selectedCountry"
                    :readonly="isReadOnly"
                    @select="onSelectCountry"
                  />
                </div>

                <v-divider class="my-3" />

                <div class="d-flex align-center justify-space-between py-2">
                  <div>
                    <div class="text-body-2 font-weight-medium">
                      {{ t('invoices.form.flatRate') }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ t('invoices.form.flatRateHint') }}
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
                      :label="t('invoices.form.flatRateAmount')"
                      type="number"
                      variant="outlined"
                      density="comfortable"
                      :readonly="isReadOnly"
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
                        {{ t('invoices.form.unitPrices') }}
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        {{ t('invoices.form.unitPricesHint') }}
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
                        {{ t('invoices.form.commissionExclStripping') }}
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        {{ t('invoices.form.commissionExclStrippingHint') }}
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

              <!-- ── Récapitulatif ── -->
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
                  <span class="text-subtitle-1 font-weight-bold">{{ t('common.totals.summary') }}</span>
                </div>

                <div class="recap-total text-primary mb-2">
                  {{ regionManager.formatNumber(total) }} {{ selectedCountry?.currencySymbol || '€' }}
                </div>

                <div class="totals-list">
                  <div class="total-row">
                    <span class="text-body-2 text-medium-emphasis">{{ t('common.totals.exclTax') }}</span>
                    <span class="text-body-2 font-weight-medium">
                      {{ regionManager.formatNumber(subtotal) }} {{ selectedCountry?.currencySymbol || '€' }}
                    </span>
                  </div>
                  <template v-if="!isForfait">
                    <div class="total-row">
                      <span class="text-body-2 text-medium-emphasis">{{ t('common.totals.totalStripping') }}</span>
                      <span class="text-body-2 font-weight-medium">
                        {{ regionManager.formatNumber(totalDegarnissage) }} {{ selectedCountry?.currencySymbol || '€' }}
                      </span>
                    </div>
                    <div class="total-row">
                      <span class="text-body-2 text-medium-emphasis">{{ t('common.totals.exclTaxPlusStripping') }}</span>
                      <span class="text-body-2 font-weight-medium">
                        {{ regionManager.formatNumber(subTotalWithDegarnissage) }} {{ selectedCountry?.currencySymbol || '€' }}
                      </span>
                    </div>
                  </template>
                  <div class="total-row">
                    <span class="text-body-2 text-medium-emphasis">{{ t('common.totals.vat', { rate: selectedCountry?.taxRate || 0 }) }}</span>
                    <span class="text-body-2 font-weight-medium">
                      {{ regionManager.formatNumber(totalTaxRate) }} {{ selectedCountry?.currencySymbol || '€' }}
                    </span>
                  </div>
                  <div
                    v-if="selectedGarage?.percentageCommission"
                    class="total-row text-orange"
                  >
                    <span class="text-body-2">{{ t('invoices.form.technicianNetRate', { rate: selectedGarage.percentageCommission }) }}</span>
                    <span class="text-body-2 font-weight-medium">
                      {{ regionManager.formatNumber(totalCommission) }} {{ selectedCountry?.currencySymbol || '€' }}
                    </span>
                  </div>
                </div>

                <!-- Actions : masquées quand la facture est verrouillée -->
                <div
                  v-if="!isReadOnly"
                  class="d-none d-md-flex flex-column ga-2 mt-3"
                >
                  <v-btn
                    color="primary"
                    prepend-icon="mdi-content-save-outline"
                    @click="onUpdateBtnClick"
                  >
                    {{ t('invoices.form.saveDraft') }}
                  </v-btn>
                  <v-btn
                    variant="text"
                    @click="$router.back()"
                  >
                    {{ t('common.cancel') }}
                  </v-btn>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-form>

      <!-- Barre d'action mobile -->
      <div
        v-if="!isReadOnly"
        class="sticky-bottom-bar d-md-none"
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
          {{ t('invoices.form.saveDraft') }}
        </v-btn>
      </div>
    </v-container>
  </MainLayout>

  <!-- ── Dialogs ── -->
  <ConfirmDialog
    ref="deleteInvoiceConfirmDialogRef"
    :title="t('invoices.edit.deleteDraft')"
    :message="t('invoices.edit.deleteConfirm')"
    :confirm-label="t('common.delete')"
    :cancel-label="t('common.cancel')"
    type="warning"
    @confirm="onConfirmDeleteInvoice"
  />

  <!-- Confirmation avant envoi : l'envoi rend la facture définitive -->
  <ConfirmDialog
    ref="sendInvoiceConfirmDialogRef"
    :title="t('invoices.edit.sendFinal')"
    :message="t('invoices.edit.sendFinalMessage')"
    :confirm-label="t('invoices.edit.sendFinal')"
    :cancel-label="t('common.cancel')"
    type="warning"
    @confirm="onSendBtnClick"
  />

  <ConfirmDialog
    ref="finalizeInvoiceConfirmDialogRef"
    :title="t('invoices.edit.finalize')"
    :message="t('invoices.edit.finalizeMessage')"
    :confirm-label="t('invoices.edit.finalize')"
    :cancel-label="t('common.cancel')"
    type="warning"
    @confirm="onFinalizeBtnClick"
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
import { getSelectedInvoiceGuid } from '@/features/invoices/presentation/utils/invoiceSelection';
import { useEditInvoicePageDependencies } from '@/features/invoices/composition/useEditInvoicePageDependencies';
import MainLayout from '@/app/layouts/MainLayout.vue';
import { ConfirmDialogExposed } from '@/shared/presentation/ui/components/ConfirmDialog';
import ConfirmDialog from '@/shared/presentation/ui/components/ConfirmDialog.vue';
import CountrySelect from '@/features/countries/presentation/components/CountrySelect.vue';
import { CountryViewModel } from '@/features/countries/presentation/models/CountryViewModel';
import { GarageViewModel } from '@/features/garages/presentation/models/GarageViewModel';
import { OrganizationMemberViewModel } from '@/features/organizations/presentation/models/OrganizationMemberViewmodel';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatDate as formatIntlDate, intlLocale } from '@/app/i18n/formatters';
import { bodyMaterialLabel, bodyPartLabel, repairTypeLabel } from '@/features/carRepairSettings/presentation/utils/carRepairLabels';
import { useRouter } from 'vue-router';
import { useTheme } from 'vuetify';
import { EMPTY_INVOICE_ERROR } from '@/features/invoices/application/useCases/SendInvoiceUseCase';
import { useFeatureAccess } from '@/features/featureAccess/composition/useFeatureAccess';
import FeatureGate from '@/features/featureAccess/presentation/components/FeatureGate.vue';

// ── Services ──────────────────────────────────────────────────────────────────
const { regionManager, useEditInvoiceState } = useEditInvoicePageDependencies();
const isDark = computed(() => useTheme().current.value.dark);

// ── Refs dialogs ──────────────────────────────────────────────────────────────
const deleteInvoiceConfirmDialogRef = ref<ConfirmDialogExposed>();
const sendInvoiceConfirmDialogRef = ref<ConfirmDialogExposed>();
const finalizeInvoiceConfirmDialogRef = ref<ConfirmDialogExposed>();

// ── State ─────────────────────────────────────────────────────────────────────
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
  carInformations,
  setCarImmatriculation,
  setCarBrand,
  setCarDateEntryCirculation,
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
  subtotal,
  totalDegarnissage,
  subTotalWithDegarnissage,
  totalTaxRate,
  totalCommission,
  total,
  invoiceStatus,
  isReadOnly,
  canDelete,
  isSent,
  sentAt,
  hasItems,
  updateInvoice,
  updateInvoiceStatus,
  deleteInvoice,
  sendInvoice,
  finalizeInvoice,
} = useEditInvoiceState;
const { can } = useFeatureAccess();

const router = useRouter();
const { t } = useI18n();
const statusLoading = ref(false);
const sending = ref(false);
const snackbar = reactive({ show: false, message: '', color: 'success' });
const showSnack = (message: string, color = 'success') => { snackbar.message = message; snackbar.color = color; snackbar.show = true; };

// Paiement : possible uniquement sur une facture envoyée, non payée
const canMarkPaid = computed(() => isReadOnly.value && invoiceStatus.value === 'pending');

// ── Helpers ───────────────────────────────────────────────────────────────────
const initials = (name: string) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
};
const formatDate = (d: string | Date) => formatIntlDate(d);
const formatSentAt = (d: Date) =>
  new Date(d).toLocaleString(intlLocale(), { dateStyle: 'short', timeStyle: 'short' });

const statusColor = (status?: string) => ({
  pending: 'orange',
  validated: 'success',
  accepted: 'success',
  signed: 'success',
  sent: 'blue',
  draft: 'grey',
  cancel: 'error',
} as Record<string, string>)[status ?? ''] ?? 'default';

const statusLabel = (status?: string) => ({
  pending: t('invoices.status.awaitingPayment'),
  validated: t('invoices.status.paid'),
  accepted: t('invoices.status.accepted'),
  signed: t('invoices.status.signed'),
  sent: t('invoices.status.sent'),
  draft: t('invoices.status.draft'),
  cancel: t('invoices.status.cancelled'),
} as Record<string, string>)[status ?? ''] ?? (status ?? '');

// ── Handlers form ─────────────────────────────────────────────────────────────
const onSelectTechnician = (t: OrganizationMemberViewModel) => selectTechnician(t);
const onSelectGarage = (g: GarageViewModel) => selectGarage(g);
const onCarImmatriculationUpdated = (v: string) => setCarImmatriculation(v);
const onCarBrandUpdated = (v: string) => setCarBrand(v);
const onCarYearUpdated = (v: string) => setCarDateEntryCirculation(v);
const onUpdateIsForfait = (v: boolean | null) => setIsForfait(v ?? false);
const onUpdateForfaitAmount = (v: string) => setForfaitAmount(Number(v));
const onUpdateIsDisplayUnitPrice = (v: boolean | null) => setIsDisplayUnitPrice(v ?? true);
const onUpdateIsComputeCommissionWithoutDentRemoval = (v: boolean | null) => setIsComputeCommissionWithoutDentRemoval(v ?? true);
const onSelectCountry = (c: CountryViewModel | undefined) => { if (c) selectCountry(c); };

// ── Handlers lignes ───────────────────────────────────────────────────────────
// La gestion des éléments se fait sur une page dédiée (mêmes écrans que pour un devis)
const onManageItemsBtnClick = () => router.push('/invoices/edit/items');

// ── Handlers actions ──────────────────────────────────────────────────────────
const getInvoiceId = () => getSelectedInvoiceGuid() ?? '';

const onMarkPaid = async () => {
  statusLoading.value = true;
  try {
    await updateInvoiceStatus('validated');
    showSnack(t('invoices.messages.markedPaid'));
  } catch (e) {
    showSnack(e instanceof Error ? e.message : t('invoices.edit.updateStatusError'), 'error');
  } finally {
    statusLoading.value = false;
  }
};

const onAskSend = () => sendInvoiceConfirmDialogRef.value?.open();
const onAskFinalize = () => finalizeInvoiceConfirmDialogRef.value?.open();

// Sauvegarde le brouillon, finalise sans email, puis recharge en lecture seule
const onFinalizeBtnClick = async () => {
  sending.value = true;
  try {
    await updateInvoice();
    await finalizeInvoice();
    await init(getInvoiceId());
    showSnack(t('invoices.messages.finalized'));
  } catch (e) {
    showSnack(e instanceof Error ? (e.message === EMPTY_INVOICE_ERROR ? t('invoices.messages.emptyInvoice') : e.message) : t('invoices.edit.finalizeError'), 'error');
  } finally {
    sending.value = false;
  }
};

// Sauvegarde le brouillon, envoie, puis recharge pour passer en lecture seule
const onSendBtnClick = async () => {
  sending.value = true;
  try {
    await updateInvoice();
    await sendInvoice();
    await init(getInvoiceId());
    showSnack(t('invoices.messages.sent'));
  } catch (e) {
    showSnack(e instanceof Error ? (e.message === EMPTY_INVOICE_ERROR ? t('invoices.messages.emptyInvoice') : e.message) : t('invoices.edit.sendError'), 'error');
  } finally {
    sending.value = false;
  }
};

const onViewPdfBtnClick = () => router.push('/invoices/preview');
const onDeleteBtnClick = () => deleteInvoiceConfirmDialogRef.value?.open();
const onConfirmDeleteInvoice = () => {
  deleteInvoice();
  router.push('/invoices/');
};
const onUpdateBtnClick = async () => {
  try {
    await updateInvoice();
    showSnack(t('invoices.messages.saved'));
  } catch (e) {
    // validation errors — stay on page
    showSnack(e instanceof Error ? e.message : t('invoices.edit.saveError'), 'error');
  }
};

onMounted(async () => {
  await init(getInvoiceId());
});
</script>

<style scoped>
.edit-invoice-container {
  --q-bg: #f4f5fa;
  --q-card: #fff;
  --q-border: #e6e8f0;
  --q-border-strong: #d5d8e3;
  --q-soft: #eef0f4;
  --q-text: #1f2330;
  --q-muted: #4b5563;
  min-height: 100dvh;
  background: var(--q-bg);
}

.edit-invoice-container.is-dark {
  --q-bg: transparent;
  --q-card: rgb(var(--v-theme-surface));
  --q-border: rgba(255, 255, 255, 0.06);
  --q-border-strong: rgba(255, 255, 255, 0.2);
  --q-soft: rgba(255, 255, 255, 0.1);
  --q-text: rgba(255, 255, 255, 0.92);
  --q-muted: rgba(255, 255, 255, 0.7);
}

.sent-info {
  padding: 8px 12px;
  border: 1px solid var(--q-border-strong);
  border-radius: 10px;
  background: var(--q-soft);
}

.header-btn {
  border-radius: 10px;
  border: 1px solid var(--q-border-strong);
  background: var(--q-card);
  color: var(--q-text);
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
}

.header-btn:hover {
  background: var(--q-soft);
}

.header-back {
  background: var(--q-soft) !important;
  border-color: var(--q-border) !important;
  color: var(--q-muted);
}

.page-header {
  background: var(--q-card);
  border: 1px solid var(--q-border);
  border-radius: 14px;
  position: sticky;
  top: 8px;
  z-index: 10;
}

.section-card {
  background: var(--q-card);
  border-radius: 14px;
  padding: 16px;
  border: 1px solid var(--q-border);
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

.line-summary + .line-summary {
  border-top: 1px solid rgba(var(--v-border-color), 0.08);
}

.line-items-list {
  display: flex;
  flex-direction: column;
}

.line-item-card {
  border-radius: 12px;
  padding: 12px;
  background: rgba(var(--v-theme-surface-variant), 0.1);
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

.recap-total {
  font-size: 30px;
  font-weight: 800;
  line-height: 1.2;
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

.equal-height-row > .v-col {
  display: flex;
}

.equal-height-row > .v-col > .section-card {
  flex: 1;
}

.side-sticky {
  position: sticky;
  top: 88px;
}

.pb-28 {
  padding-bottom: 16px;
}

.min-w-0 {
  min-width: 0;
}
</style>
