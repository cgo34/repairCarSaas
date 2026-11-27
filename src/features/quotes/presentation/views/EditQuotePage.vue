<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-0 mt-4 edit-quote-container"
      :class="{ 'is-dark': isDark }"
    >
      <!-- ═══════════════════════════════════════════════════
            HEADER sticky
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
              {{ t('quotes.view.title', { number: quoteInformations.number || '' }) }}
            </div>
            <div
              v-if="quoteInformations.date"
              class="text-caption text-medium-emphasis"
            >
              {{ t('quotes.view.createdOn', { date: formatDate(quoteInformations.date) }) }}
            </div>
          </div>
          <v-chip
            v-if="quoteInformations.status"
            class="ml-3"
            :color="statusColor(quoteInformations.status?.code, quoteInformations.isSent)"
            size="small"
            variant="tonal"
          >
            {{ statusLabel(quoteInformations.status?.code, quoteInformations.isSent) }}
          </v-chip>
          <v-chip
            v-if="quote?.convertToInvoice"
            class="ml-2"
            color="success"
            size="small"
            variant="tonal"
            prepend-icon="mdi-receipt-text-check-outline"
          >
            {{ t('quotes.list.converted') }}
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
            {{ t('quotes.items.viewPdf') }}
          </v-btn>
          <v-btn
            v-if="!isReadOnly"
            variant="outlined"
            height="40"
            class="px-5 header-btn"
            prepend-icon="mdi-format-list-bulleted-square"
            @click="onManageItemsBtnClick"
          >
            {{ t('quotes.edit.manageItems') }}
          </v-btn>
        </div>
      </div>

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
                <span class="text-subtitle-1 font-weight-bold">{{ t('quotes.edit.dates') }}</span>
              </div>
              <v-row dense>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="quoteInformations.date"
                    :label="t('quotes.edit.creationDate')"
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
                    :label="t('quotes.edit.validUntil')"
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
                <!-- ── Section 2 : Technicien ── -->
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
                    <span class="text-subtitle-1 font-weight-bold">{{ t('quotes.view.technician') }}</span>
                  </div>
                  <v-autocomplete
                    :model-value="selectedTechnician"
                    :items="technicians"
                    :item-title="item => `${item.users.first_name} ${item.users.last_name}`"
                    item-value="id"
                    return-object
                    :label="t('quotes.edit.selectTechnician')"
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
                <!-- ── Section 3 : Client / Garage ── -->
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
                    <span class="text-subtitle-1 font-weight-bold">{{ t('quotes.edit.clientGarage') }}</span>
                  </div>

                  <v-autocomplete
                    :model-value="selectedGarage"
                    :items="garages"
                    item-title="name"
                    item-value="id"
                    return-object
                    :label="t('quotes.edit.selectGarage')"
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
                    {{ t('quotes.edit.commission', { rate: selectedGarage.percentageCommission }) }}
                  </div>
                </div>
              </v-col>
            </v-row>

            <!-- ── Section 4 : Véhicule ── -->
            <div class="section-card mb-4">
              <!-- <div class="section-header mb-3">
              <div class="section-icon">
                <v-icon
                  size="18"
                  color="primary"
                >
                  mdi-car-outline
                </v-icon>
              </div>
              <span class="text-subtitle-1 font-weight-bold">{{ t('quotes.view.vehicle') }}</span>
            </div> -->

              <!-- <v-autocomplete
              :model-value="selectedVehicle"
              :items="vehiclesList"
              :item-title="v => v.immatriculation + ' — ' + v.marque + (v.annee ? ' ' + v.annee : '')"
              item-value="id"
              return-object
              :label="t('quotes.edit.existingVehicle')"
              variant="outlined"
              density="comfortable"
              clearable
              :disabled="!selectedGarage || isReadOnly"
              :no-data-text="selectedGarage ? 'Aucun véhicule trouvé' : 'Sélectionnez d\'abord un garage'"
              hide-details="auto"
              prepend-inner-icon="mdi-car-search-outline"
              class="mb-3"
              @update:model-value="onSelectVehicle"
            /> -->

              <div class="section-header mb-3">
                <div class="section-icon">
                  <v-icon
                    size="18"
                    color="primary"
                  >
                    mdi-car
                  </v-icon>
                </div>
                <span class="text-subtitle-1 font-weight-bold">{{ t('quotes.edit.vehicleInfo') }}</span>
              </div>

              <v-row dense>
                <v-col
                  cols="12"
                  sm="4"
                >
                  <v-text-field
                    v-model="carInformations.immatriculation"
                    :label="t('quotes.edit.plate')"
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
                    :label="t('quotes.edit.brand')"
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
                    v-model="carInformations.carYear"
                    :label="t('quotes.edit.year')"
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

            <!-- ── Section 6 : Éléments du devis (page dédiée) ── -->
            <div
              v-if="!isForfait"
              class="section-card mb-4"
            >
              <div class="section-header">
                <div class="section-icon">
                  <v-icon
                    size="18"
                    color="primary"
                  >
                    mdi-format-list-bulleted
                  </v-icon>
                </div>
                <span class="text-subtitle-1 font-weight-bold">{{ t('quotes.items.title') }}</span>
                <v-chip
                  size="x-small"
                  variant="tonal"
                  color="primary"
                >
                  {{ quoteLines.length }}
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
                  {{ t('quotes.edit.manageItems') }}
                </v-btn>
              </div>
              <div
                v-if="!isForfait && quoteLines.length > 0"
                class="mt-3"
              >
                <div
                  v-for="line in quoteLines"
                  :key="line.id"
                  class="d-flex justify-space-between align-center py-2 line-summary"
                >
                  <span class="text-body-2">
                    {{ line.bodyPart?.name ?? '—' }}
                    <span class="text-medium-emphasis">
                      · {{ line.bodyMaterial?.name }} · {{ line.repairType?.name }}
                    </span>
                  </span>
                  <span class="text-body-2 font-weight-bold">
                    {{ regionManager.formatNumber(line.price ?? 0) }} {{ selectedCountry?.currencySymbol || '€' }}
                  </span>
                </div>
              </div>
            </div>
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <div class="side-sticky">
              <div class="section-card mb-4">
                <div class="section-header mb-3">
                  <div class="section-icon">
                    <v-icon
                      size="18"
                      color="primary"
                    >
                      mdi-traffic-light-outline
                    </v-icon>
                  </div>
                  <span class="text-subtitle-1 font-weight-bold">{{ t('quotes.edit.quoteStatus') }}</span>
                  <v-spacer />
                  <v-chip
                    v-if="quoteInformations.status"
                    :color="statusColor(quoteInformations.status?.code, quoteInformations.isSent)"
                    size="small"
                    variant="tonal"
                    rounded="pill"
                  >
                    {{ statusLabel(quoteInformations.status?.code, quoteInformations.isSent) }}
                  </v-chip>
                </div>

                <div
                  v-if="sentAt"
                  class="sent-info d-flex align-center ga-2 mb-3"
                >
                  <v-icon
                    size="20"
                    color="primary"
                  >
                    mdi-email-check-outline
                  </v-icon>
                  <div>
                    <div class="text-body-2 font-weight-bold">
                      {{ t('quotes.edit.sentOn', { date: formatSentAt(sentAt) }) }}
                    </div>
                    <div
                      v-if="selectedGarage?.name"
                      class="text-caption text-medium-emphasis"
                    >
                      {{ t('quotes.edit.sentTo', { name: selectedGarage.name }) }}
                    </div>
                  </div>
                </div>

                <div class="d-flex flex-column ga-2">
                  <v-btn
                    v-if="canDecide"
                    color="success"
                    variant="tonal"
                    prepend-icon="mdi-check-circle-outline"
                    @click="onAcceptedBtnClick"
                  >
                    {{ t('quotes.actions.markAccepted') }}
                  </v-btn>
                  <v-btn
                    v-if="canDecide"
                    color="error"
                    variant="tonal"
                    prepend-icon="mdi-close-circle-outline"
                    @click="onRefusedBtnClick"
                  >
                    {{ t('quotes.actions.markRefused') }}
                  </v-btn>
                  <v-btn
                    v-if="!isReadOnly && !isSent && !can('quote_email_sending')"
                    color="primary"
                    variant="flat"
                    block
                    prepend-icon="mdi-check-circle-outline"
                    :disabled="!hasItems"
                    :loading="sending"
                    @click="onAskValidate"
                  >
                    {{ t('quotes.edit.validate') }}
                  </v-btn>
                  <FeatureGate
                    v-if="!isReadOnly"
                    v-slot="{ locked }"
                    feature="quote_email_sending"
                  >
                    <v-btn
                      color="blue"
                      variant="tonal"
                      block
                      prepend-icon="mdi-send-outline"
                      :disabled="locked || !hasItems"
                      :loading="sending"
                      @click="onSendBtnClick"
                    >
                      {{ t(isSent ? 'quotes.edit.resendToGarage' : 'quotes.edit.sendToGarage') }}
                    </v-btn>
                  </FeatureGate>
                  <v-btn
                    v-if="isAccepted && !quote?.convertToInvoice"
                    color="primary"
                    variant="flat"
                    prepend-icon="mdi-file-plus-outline"
                    @click="onDuplicateQuoteToInvoiceBtnClick"
                  >
                    {{ t('quotes.actions.convertToInvoice') }}
                  </v-btn>
                  <v-btn
                    v-if="canDelete"
                    color="error"
                    variant="tonal"
                    prepend-icon="mdi-delete-outline"
                    @click="onDeleteBtnClick"
                  >
                    {{ t('quotes.delete.title') }}
                  </v-btn>
                </div>
                <div
                  v-if="!isReadOnly && !hasItems"
                  class="text-caption text-medium-emphasis mt-2"
                >
                  {{ t('quotes.edit.addAtLeastOne') }}
                </div>
                <div
                  v-else-if="isSent && !isReadOnly"
                  class="text-caption text-medium-emphasis mt-2"
                >
                  {{ t('quotes.edit.sentNoDelete') }}
                </div>
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
                  <span class="text-subtitle-1 font-weight-bold">{{ t('quotes.edit.options') }}</span>
                </div>

                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis mb-1 font-weight-medium">
                    {{ t('quotes.edit.countryVat') }}
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
                      {{ t('quotes.edit.flatRate') }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ t('quotes.edit.flatRateHint') }}
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
                      :label="t('quotes.edit.flatRateAmount')"
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
                        {{ t('quotes.edit.unitPrices') }}
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        {{ t('quotes.edit.unitPricesHint') }}
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
                        {{ t('quotes.edit.commissionExclStripping') }}
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        {{ t('quotes.edit.commissionExclStrippingHint') }}
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
                  <span class="text-subtitle-1 font-weight-bold">{{ t('common.totals.summary') }}</span>
                </div>

                <div class="text-caption text-medium-emphasis">
                  {{ t('common.totals.inclTax') }}
                </div>
                <div class="recap-total text-primary">
                  {{ regionManager.formatNumber(total) }} {{ selectedCountry?.currencySymbol || '€' }}
                </div>
                <v-divider class="my-3" />

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
                  <template v-if="selectedGarage?.percentageCommission">
                    <v-divider class="my-2" />
                    <div class="total-row">
                      <span class="text-body-2 font-weight-bold">{{ t('quotes.edit.technicianNet') }}</span>
                      <span class="text-body-2 font-weight-bold">
                        {{ regionManager.formatNumber(total - totalCommission) }}
                        {{ selectedCountry?.currencySymbol || '€' }}
                      </span>
                    </div>
                  </template>
                </div>

                <template v-if="!isReadOnly && quoteInformations.status?.code !== 'accepted'">
                  <v-btn
                    class="d-none d-md-flex mt-4"
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
                  <v-btn
                    class="d-none d-md-flex mt-2"
                    variant="outlined"
                    block
                    rounded="lg"
                    @click="router.push('/quotes')"
                  >
                    Annuler
                  </v-btn>
                </template>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-form>

      <!-- ═══════════════════════════════════════════════════
            STICKY BOTTOM — Sauvegarder
        ════════════════════════════════════════════════════ -->
      <div
        v-if="!isReadOnly && quoteInformations.status?.code !== 'accepted'"
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
          {{ t('common.save') }}
        </v-btn>
      </div>
    </v-container>
  </MainLayout>

  <!-- ── Dialogs ── -->
  <GarageDialog
    ref="garageDialogRef"
    :title="t('quotes.edit.editClient')"
    persistent
    :max-width="500"
    @validated="onGarageValidated"
  />

  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    location="bottom right"
  >
    {{ snackbar.message }}
  </v-snackbar>

  <ConfirmDialog
    ref="deleteQuoteConfirmDialogRef"
    :title="t('quotes.delete.title')"
    :message="t('quotes.edit.deleteConfirm')"
    :confirm-label="t('common.delete')"
    :cancel-label="t('common.cancel')"
    type="warning"
    @confirm="onConfirmDeleteQuote"
  />

  <ConfirmDialog
    ref="validateQuoteConfirmDialogRef"
    :title="t('quotes.edit.validate')"
    :message="t('quotes.edit.validateMessage')"
    :confirm-label="t('quotes.edit.validate')"
    :cancel-label="t('common.cancel')"
    type="warning"
    @confirm="onValidateBtnClick"
  />
</template>

  <script setup lang="ts">
import { setSelectedInvoiceGuid } from '@/features/invoices/presentation/utils/invoiceSelection';
  import { useEditQuotePageDependencies } from '@/features/quotes/composition/useEditQuotePageDependencies';
  import { useFeatureAccess } from '@/features/featureAccess/composition/useFeatureAccess';
  import FeatureGate from '@/features/featureAccess/presentation/components/FeatureGate.vue';
  import MainLayout from '@/app/layouts/MainLayout.vue';
  import { ConfirmDialogExposed } from '@/shared/presentation/ui/components/ConfirmDialog';
  import ConfirmDialog from '@/shared/presentation/ui/components/ConfirmDialog.vue';
  import CountrySelect from '@/features/countries/presentation/components/CountrySelect.vue';
  import { GarageDialogExposed } from '@/features/garages/presentation/components/GarageDialog';
  import GarageDialog from '@/features/garages/presentation/components/GarageDialog.vue';
  import { CountryViewModel } from '@/features/countries/presentation/models/CountryViewModel';
  import { GarageViewModel } from '@/features/garages/presentation/models/GarageViewModel';
  import { getSelectedQuoteGuid } from '@/features/quotes/presentation/utils/quoteSelection';
  import { OrganizationMemberViewModel } from '@/features/organizations/presentation/models/OrganizationMemberViewmodel';
  import { computed, onMounted, reactive, ref } from 'vue';
  import { useTheme } from 'vuetify';
import { EMPTY_QUOTE_ERROR } from '@/features/quotes/application/useCases/SendQuoteUseCase';
  import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { formatDate as formatIntlDate, intlLocale } from '@/app/i18n/formatters';

  // ── Services ─────────────────────────────────────────────────────────────────
  const { regionManager, useEditQuoteState } = useEditQuotePageDependencies();
  const { can } = useFeatureAccess();

  // ── Refs dialogs ─────────────────────────────────────────────────────────────
  const garageDialogRef = ref<GarageDialogExposed>();
  const deleteQuoteConfirmDialogRef = ref<ConfirmDialogExposed>();
  const validateQuoteConfirmDialogRef = ref<ConfirmDialogExposed>();

  // ── State ─────────────────────────────────────────────────────────────────────

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
    carInformations,
    setCarImmatriculation,
    setCarBrand,
    setCarYear,
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
    isSent,
    sentAt,
    hasItems,
    canDecide,
    canDelete,
    sendQuote,
    finalizeQuote,
    quote,
    // isRefused,
    updateQuoteStatus,
  } = useEditQuoteState;

  const router = useRouter();
const { t } = useI18n();
  const theme = useTheme();
  const isDark = computed(() => theme.current.value.dark);
  const sending = ref(false);
  const snackbar = reactive({ show: false, message: '', color: 'error' });

  // ── Helpers ───────────────────────────────────────────────────────────────────
  const initials = (name: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const OPEN_STATUS_CODES = ['draft', 'pending', ''];

  const statusColor = (code?: string, isSent?: boolean) => {
    if (OPEN_STATUS_CODES.includes(code ?? '')) return isSent ? 'warning' : 'default';
    switch (code) {
      case 'accepted':   return 'success';
      case 'refused':    return 'error';
      case 'cancelled':  return 'error';
      case 'invoiced':   return 'blue';
      default:           return 'default';
    }
  };

  const statusLabel = (code?: string, isSent?: boolean) => {
    if (OPEN_STATUS_CODES.includes(code ?? '')) return isSent ? t('quotes.status.pending') : t('quotes.status.draft');
    switch (code) {
      case 'accepted':   return t('quotes.status.accepted');
      case 'refused':    return t('quotes.status.refused');
      case 'cancelled':  return t('quotes.status.cancelled');
      case 'invoiced':   return t('quotes.status.invoiced');
      default:           return code ?? '';
    }
  };

  // ── Handlers form ─────────────────────────────────────────────────────────────
  const onSelectTechnician = (t: OrganizationMemberViewModel) => selectTechnician(t);
  const onSelectGarage = (g: GarageViewModel) => selectGarage(g);
  const onGarageValidated = (g: GarageViewModel) => setGarage(g);
  const onCarImmatriculationUpdated = (v: string) => setCarImmatriculation(v);
  const onCarBrandUpdated = (v: string) => setCarBrand(v);
  const onCarYearUpdated = (v: string) => setCarYear(v);
  const onUpdateIsForfait = (v: boolean | null) => setIsForfait(v ?? false);
  const onUpdateForfaitAmount = (v: string) => setForfaitAmount(Number(v));
  const onUpdateIsDisplayUnitPrice = (v: boolean | null) => setIsDisplayUnitPrice(v ?? true);
  const onUpdateIsComputeCommissionWithoutDentRemoval = (v: boolean | null) => setIsComputeCommissionWithoutDentRemoval(v ?? true);
  const onSelectCountry = (c: CountryViewModel | undefined) => {
    if (c) {
      selectCountry(c);
    }
  };

  // ── Handlers lignes ───────────────────────────────────────────────────────────
  const onManageItemsBtnClick = () => router.push('/quotes/edit/items');
  const formatDate = (d: string | Date) => formatIntlDate(d);

  // ── Handlers actions ──────────────────────────────────────────────────────────
  const onAcceptedBtnClick = () => updateQuoteStatus({ code: 'accepted'});
  const onRefusedBtnClick = () => updateQuoteStatus({ code: 'refused'});
  const onSendBtnClick = async () => {
    sending.value = true;
    try {
      await updateQuote();
      await sendQuote();
    } catch (e) {
      snackbar.message = e instanceof Error && e.message !== EMPTY_QUOTE_ERROR ? e.message : t('quotes.messages.emptyQuote');
      snackbar.color = 'error';
      snackbar.show = true;
    } finally {
      sending.value = false;
    }
  };
  const onAskValidate = () => validateQuoteConfirmDialogRef.value?.open();
  const onValidateBtnClick = async () => {
    sending.value = true;
    try {
      await updateQuote();
      await finalizeQuote();
      snackbar.message = t('quotes.messages.validated');
      snackbar.color = 'success';
    } catch (e) {
      snackbar.message = e instanceof Error && e.message === EMPTY_QUOTE_ERROR ? t('quotes.messages.emptyQuote') : t('quotes.messages.validateError');
      snackbar.color = 'error';
    } finally {
      snackbar.show = true;
      sending.value = false;
    }
  };
  const formatSentAt = (d: Date) =>
    new Date(d).toLocaleString(intlLocale(), { dateStyle: 'short', timeStyle: 'short' });
  const onDuplicateQuoteToInvoiceBtnClick = async () => {
    const invoiceId = await duplicateQuoteToInvoice();
    if (invoiceId) {
      setSelectedInvoiceGuid(invoiceId);
      router.push('/invoices/edit');
    }
  };
  const onViewPdfBtnClick = () => router.push('/quotes/preview');
  const onDeleteBtnClick = () => deleteQuoteConfirmDialogRef.value?.open();
  const onConfirmDeleteQuote = () => {
    deleteQuote();
    router.push('/quotes/');
  };
  const onUpdateBtnClick = async () => {
    try {
      await updateQuote();
      snackbar.message = t('quotes.messages.saved');
      snackbar.color = 'success';
      snackbar.show = true;
    } catch {
      // validation errors — stay on page
    }
  };

  onMounted(async () => {
    const quoteId = getSelectedQuoteGuid();
    if (quoteId) await init(quoteId);
  });
  </script>

  <style scoped>
  .edit-quote-container {
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

  .edit-quote-container.is-dark {
    --q-bg: transparent;
    --q-card: rgb(var(--v-theme-surface));
    --q-border: rgba(255, 255, 255, 0.06);
    --q-border-strong: rgba(255, 255, 255, 0.2);
    --q-soft: rgba(255, 255, 255, 0.1);
    --q-text: rgba(255, 255, 255, 0.92);
    --q-muted: rgba(255, 255, 255, 0.7);
  }

  /* Header sticky */
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

  /* Section cards */
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

  /* Line items */
  .line-items-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .line-item-card {
    /* border: 1px solid rgba(var(--v-border-color), 0.15); */
    border-radius: 12px;
    padding: 12px;
    background: rgba(var(--v-theme-surface-variant), 0.1);
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

  .recap-total {
    font-size: 30px;
    font-weight: 800;
    line-height: 1.2;
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

  .line-summary + .line-summary {
    border-top: 1px solid rgba(var(--v-border-color), 0.08);
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
