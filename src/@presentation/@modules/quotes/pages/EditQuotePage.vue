<template>
  <MainLayout>
    <v-container fluid class="px-0 py-0">
      
      <!-- Actions du devis -->
      <v-toolbar title="" color="transparent">
        <template v-slot:prepend>
          
          <BackButton fallbackPath="/quotes" />
        </template>
        <template v-slot:append>

          <GenericButton
            v-if="!isFreePlan"
            class="me-2 text-none"
            color="primary"
            prepend-icon="mdi-send"
            variant="flat"
            @click="onSendBtnClick"
          >
            Send
          </GenericButton>

          <!-- <GenericButton
            v-if="!isReadOnly"
            class="me-2 text-none"
            color="success"
            prepend-icon="mdi-check-bold"
            variant="flat"
            @click="onFinalizeBtnClick"
          >
            Finalize
          </GenericButton> -->
          <GenericMenu
            v-if="!isReadOnly"
            @accepted="onAcceptedBtnClick"
            @refused="onRefusedBtnClick"
          ></GenericMenu>

          

          <GenericButton
            class="me-2 text-none"
            color="secondary"
            prepend-icon="mdi-file-pdf-box"
            variant="flat"
            @click="onViewPdfBtnClick"
          >
            Preview
          </GenericButton>

          <GenericButton
            v-if="quoteInformations.status?.code === 'accepted'"
            class="me-2 text-none"
            color="success"
            prepend-icon="mdi-file-plus"
            variant="flat"
            :readonly="quoteInformations.status?.code !== 'accepted'"
            @click="onDuplicateQuoteToInvoiceBtnClick"
          >
            Convert to invoice
          </GenericButton>

          <GenericButton
            v-if="!isReadOnly"
            class="me-2 text-none"
            color="error"
            prepend-icon="mdi-delete"
            variant="flat"
            @click="onDeleteBtnClick"
          >
            Delete
          </GenericButton>
        </template>

      </v-toolbar>
      
      <v-form ref="form">
        <v-card
          class="rounded-lg"
          outlined
        >
          <v-card-title class="text-h3">
            Modifier un Devis
          </v-card-title>
          <v-card-subtitle v-if="isReadOnly">
            <span
            :class="[quoteInformations.status?.code === 'accepted' ? 'text-green' : quoteInformations.status?.code === 'refused' ? 'text-red' : '']"
            >
              {{ quoteInformations.status?.code }}
            </span>
          </v-card-subtitle>

          <v-card-text>
            <!-- Informations du devis -->
            <h4 class="text-h4 my-4">
              Informations générales
            </h4>
            <v-row>
              <v-col
                cols="12"
                md="3"
              >
                <v-text-field
                  v-model="quoteInformations.number"
                  label="Numéro de devis"
                  readonly
                  disabled
                  outlined
                />
              </v-col>
              <v-col
                cols="12"
                md="3"
              >
                <GenericSelect
                  :model-value="quoteInformations.status"
                  :items="statuses"
                  label="Status"
                  item-title="label"
                  readonly
                  disabled
                />
              </v-col>
              <v-col
                cols="12"
                md="3"
              >
                <v-text-field
                  v-model="quoteInformations.date"
                  label="Date"
                  type="date"
                  outlined
                  :readonly="isReadOnly"
                />
              </v-col>
              <v-col
                cols="12"
                md="3"
              >
                <v-text-field
                  v-model="expirationDate"
                  label="Validité jusqu'à"
                  type="date"
                  outlined
                  required
                  :readonly="isReadOnly"
                />
              </v-col>
            </v-row>

            <!-- Informations du Technicien et du Garage -->
            <v-row>
              <v-col md="6">
                <v-card
                  elevation="0"
                  class="pa-4"
                >
                  <div class="d-flex flex-column justify-space-between">
                    <div>
                      <h4 class="text-h4">
                        Technicien :
                      </h4>
                    </div>

                    <v-flex
                      xs12
                      sm12
                      md12
                    >
                      <v-select
                        :model-value="selectedTechnician"
                        label="Select Technician"
                        :items="techniciansList"
                        :item-props="true"
                        item-title="fullName"
                        item-value
                        return-object
                        :clearable="!isReadOnly"
                        @update:model-value="onSelectTechnician"
                        :readonly="isReadOnly"
                      >
                        <template #prepend-item>
                          <v-list-tile>
                            <v-text-field
                              label="Search"
                              @input="onSearchTechnician"
                            />
                          </v-list-tile>
                        </template>
                      </v-select>
                    </v-flex>
                  </div>
                </v-card>
              </v-col>

              <v-col md="6">
                <v-card
                  outlined
                  elevation="0"
                  class="pa-4"
                >
                  <div class="d-flex flex-column justify-space-between">
                    <div class="d-flex align-center justify-space-between mb-2">
                      <h5 class="text-h6">
                        Garage :
                      </h5>

                      <!-- TODO: (GCE) -> ADD IMPLEMENTATION TO FREE USER -->
                      <v-btn
                        v-if="!isReadOnly"
                        color="primary"
                        variant="text"
                        @click="onEditCustomerBtnClick"
                      >
                        Edit customer
                      </v-btn>

                    </div>
                    

                    <v-flex
                      xs12
                      sm12
                      md12
                    >
                      <v-select
                        :model-value="selectedGarage"
                        label="Select Garage"
                        :items="garagesList"
                        item-title="name"
                        :item-props="true"
                        item-value
                        return-object
                        :clearable="!isReadOnly"
                        @update:model-value="onSelectGarage"
                        :readonly="isReadOnly"
                      >
                        <template #prepend-item>
                          <v-list-tile>
                            <v-text-field
                              label="Search"
                              @input="onSearchGarage"
                            />
                          </v-list-tile>
                        </template>
                      </v-select>
                    </v-flex>

                    <!-- <v-btn
                      variant="outlined"
                      color="primary"
                      @click="selectGarage"
                    >
                      {{ quote.garage ? 'Changer' : 'Ajouter' }}
                    </v-btn> -->
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider class="my-4" />

          <!-- Informations du véhicule -->
          
          <v-card-text>
            <v-row>
              <v-col md="12">
                <h4 class="text-h4 my-4">
                  Informations du véhicule
                </h4>
                <v-card
                  outlined
                  elevation="0"
                  class="pa-4"
                >
                <v-card-text>
                  <v-row>
                    <v-col
                      cols="12"
                      md="4"
                    >
                      <v-text-field
                        v-model="carInformations.immatriculation"
                        label="Immatriculation"
                        outlined
                        @update:model-value="(value) => onCarImmatriculationUpdated(value)"
                        :readonly="isReadOnly"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                    >
                      <v-text-field
                        v-model="carInformations.brand"
                        label="Marque"
                        outlined
                        @update:model-value="(value) => onCarBrandUpdated(value)"
                        :readonly="isReadOnly"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                    >
                      <v-text-field
                        v-model="carInformations.dateEntryCirculation"
                        label="Année"
                        outlined
                        @update:model-value="(value) => onCarYearUpdated(value)"
                        :readonly="isReadOnly"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        
          <v-divider class="my-4" />

          <!-- Tableau des éléments du devis -->
          <v-card-text>
            <div>
              <h4 class="text-h4">
                Options du devis
              </h4>
              <div class="d-flex justify-space-between">
                <div>
                  <v-switch
                    label="Appliquer un forfait ?" :modelValue="isForfait"
                    @update:modelValue="onUpdateIsForfait"
                    color="primary"
                    inset
                    :readonly="isReadOnly">
                  </v-switch>
                  </div>
                <div v-if="!isForfait">
                    <v-switch
                    label="Afficher les prix unitaires ?" :modelValue="isDisplayUnitPrice"
                    @update:modelValue="onUpdateIsDisplayUnitPrice"
                    color="primary"
                    inset
                    :readonly="isReadOnly">
                  </v-switch>
                </div>
                <div v-if="!isForfait">
                  <v-switch
                    label="Calculer la commission sans le dégarnissage ?"
                    :modelValue="isComputeCommissionWithoutDentRemoval"
                    @update:modelValue="onUpdateIsComputeCommissionWithoutDentRemoval"
                    color="primary"
                    inset
                    :readonly="isReadOnly">
                  </v-switch>
                </div>
              </div>
            </div>
            
            <div v-if="isForfait">
              <h4 class="text-h4">
                Montant du forfait
              </h4>
              <v-text-field
                :modelValue="forfaitAmount"
                placeholder="Montant du forfait"
                type="number"
                dense
                outlined
                @update:modelValue="onUpdateForfaitAmount"
                :readonly="isReadOnly"
              />
            </div>
            <CountrySelect :modelValue="selectedCountry" @select="onSelectCountry" :readonly="isReadOnly"/>
          </v-card-text>

          
          <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                v-if="quoteInformations.status?.code !== 'accepted'"
                variant="flat"
                class="mt-3"
                color="primary"
                @click="onUpdateBtnClick"
                :readonly="isReadOnly"
              >
                Update
              </v-btn>
          </v-card-actions>
        </v-card>
          
        <v-card v-if="!isForfait"
          class="rounded-lg mt-5"
          outlined
        >

          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <h4 class="text-h4">
                Liste des éléments
              </h4>
            </div>
            <v-data-table
              :headers="headers"
              :items="quoteLines"
              class="elevation-1"
              density="comfortable"
            >
              <!-- <template #[`item.bodyPart`]="{ item }">
                  {{ item.bodyPart?.name }}
              </template> -->
              <!-- <template #[`item.impactCount25`]="{ item }">
                  <v-text-field
                    v-model="item.impactCount25"
                    placeholder="Nb."
                    dense
                    outlined
                  />
              </template> -->
              <!-- <template #[`item.impactCount35`]="{ item }">
                <v-text-field
                  v-model="item.impactCount35"
                  placeholder="Nb."
                  dense
                  outlined
                />
              </template> -->
              <!-- <template #[`item.repairType`]="{ item }">
                <RepairTypeSelect
                  :model-value="item.repairType"
                  :repair-types="repairTypes"
                  @select="onSelectRepairType($event, item.lineId)"
                />
              </template> -->
              <!-- <template #[`item.dentRemovalPrice`]="{ item }">
                <v-text-field
                  :modelValue="item.dentRemovalPrice"
                  placeholder="Montant"
                  dense
                  outlined
                />
              </template> -->
              <template #[`item.price`]="{ item }">
                <div class="text-right">
                  {{ item.price.toFixed(2) }} €
                </div>
              </template>
              <template #[`item.actions`]="{ item }">
                <v-icon
                  class="me-2"
                  size="small"
                  @click="onRemoveItemBtnClick(item)"
                  :disabled="isReadOnly"
                >
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
            <v-btn
              v-if="!isReadOnly"
              class="mt-3"
              color="primary"
              @click="onAddItemBtnClick"
              :disabled="isReadOnly"
            >
              + Ajouter un élément
            </v-btn>
          </v-card-text>
        </v-card>

          <!-- Bloc des Totaux -->
           
        <v-card
          class="rounded-lg mt-5"
          outlined
        >

          <!-- <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <h4 class="text-h4">
                Totaux
              </h4>
            </div>
          </v-card-text>   -->
          <v-sheet class="rounded-sm pa-2 pa-sm-6">
            <v-row justify="end">
              <v-col
                cols="6"
                sm="3"
                md="3"
                class="text-end"
              >
                <h5 class="py-2 text-subtitle-1">
                  Total H.T :
                </h5>
                <h5 v-if="!isForfait" class="py-2 text-subtitle-1 text-no-wrap">
                  Total dégarnissage :
                </h5>
                <h5 v-if="!isForfait" class="py-2 text-subtitle-1 text-no-wrap">
                  Total H.T + Total Dégarnissage :
                </h5>
                <h5 class="py-2 text-subtitle-1 text-no-wrap">
                  TVA ({{ selectedCountry?.taxRate || 0 }}%) :
                </h5>
                <h5 class="py-2 text-subtitle-1 text-primary mt-7">
                  Total H.T
                </h5>
              </v-col>
              <v-col
                cols="6"
                sm="3"
                md="2"
                class="text-end"
              >
                <h5 class="py-2 text-subtitle-1 text-disabled">
                  {{ regionManager.formatNumber(subtotal) ?? 0 }} {{ selectedCountry?.currencySymbol || '€' }}
                </h5>
                <h5 v-if="!isForfait" class="py-2 text-subtitle-1 text-disabled">
                  {{ regionManager.formatNumber(totalDegarnissage) }} {{ selectedCountry?.currencySymbol || '€' }}
                  <!-- {{ totalDegarnissage.toFixed(2) || '0.00' }} {{ selectedCountry?.currencySymbol || '€' }} -->
                </h5>
                <h5 v-if="!isForfait" class="py-2 text-subtitle-1 text-disabled">
                  {{ regionManager.formatNumber(subTotalWithDegarnissage) }} {{ selectedCountry?.currencySymbol || '€' }}
                </h5>
                <h5 class="py-2 text-subtitle-1 text-disabled">
                  {{ regionManager.formatNumber(totalTaxRate) }} {{ selectedCountry?.currencySymbol || '€' }}
                </h5>
                <h5 class="py-2 text-subtitle-1 text-primary mt-7">
                  {{ regionManager.formatNumber(total) }} {{ selectedCountry?.currencySymbol || '€' }}
                </h5>
              </v-col>
            </v-row>
          </v-sheet>
        </v-card>
      </v-form>
    </v-container>
  </MainLayout>
  
  <GarageDialog
    ref="garageDialogRef"
    title="Edit customer"
    persistent
    :maxWidth="500"
    @validated="onGarageValidated"
  >
  </GarageDialog>

  <AddLineItemDialog
    ref="addLineItemDialogRef"
    title="Ajouter un élément"
    :availableBodyParts="availableBodyParts"
    @add="onAddLineItem"
  >
  </AddLineItemDialog>  

  <ConfirmDialog
    ref="deleteQuoteConfirmDialogRef"
    title="Delete quote"
    message="You will delete this quote, are you sure ?"
    confirmLabel="Confirmer"
    cancelLabel="Annuler"
    type="warning"
    @confirm="onConfirmDeleteQuote"
  >
  </ConfirmDialog>
</template>

<script setup lang="ts">
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { IRegionManager } from '@/@core/managers/interfaces/IRegionManager';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import BackButton from '@/@presentation/@ui/components/buttons/BackButton.vue';
import GenericButton from '@/@presentation/@ui/components/buttons/GenericButton.vue';
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';
import AddLineItemDialog from '@/@presentation/components/AddLineItemDialog.vue';
import { ConfirmDialogExposed } from '@/@presentation/components/ConfirmDialog';
import ConfirmDialog from '@/@presentation/components/ConfirmDialog.vue';
import CountrySelect from '@/@presentation/components/CountrySelect.vue';
import { GarageDialogExposed } from '@/@presentation/components/GarageDialog';
import GarageDialog from '@/@presentation/components/GarageDialog.vue';
import GenericMenu from '@/@presentation/components/GenericMenu.vue';
import GenericSelect from '@/@presentation/components/GenericSelect.vue';
import type { AddLineItemDialogExposed } from '@/@presentation/types/components';
import { IUseEditQuoteState } from '@/@presentation/types/composables/IUseEditQuoteState';
import { CountryViewModel } from '@/@presentation/types/models/CountryViewModel';
import { GarageViewModel } from '@/@presentation/types/models/GarageViewModel';
import { LineItemViewModel } from '@/@presentation/types/models/LineItemViewModel';
import { UserViewModel } from '@/@presentation/types/models/UserViewModel';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';


const regionManager = container.get<IRegionManager>(SYMBOLS.Managers.regionManager);
const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
const { isFreePlan } = authState


const garageDialogRef = ref<GarageDialogExposed>()
const addLineItemDialogRef = ref<AddLineItemDialogExposed>()
const deleteQuoteConfirmDialogRef = ref<ConfirmDialogExposed>()


// Injection du state depuis Inversify
const useEditQuoteState = container.get<IUseEditQuoteState>(SYMBOLS.States.Quote.EditQuoteState);

const {
  init,

  statuses,
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
  total,

  updateQuote,
  deleteQuote,
  duplicateQuoteToInvoice,
  isReadOnly,
  isAccepted,
  isRefused,

  updateQuoteStatus
} = useEditQuoteState;

const router = useRouter();
const route = useRoute();

const quoteId = route.params.id as string;
const techniciansList = ref<UserViewModel[]>(technicians.value);
const garagesList = ref<GarageViewModel[]>(garages.value);

const headers = [
    { title: 'Element de carrosserie', key: 'bodyPart.name', width: '25%', minWidth: '25%', align: 'start' },
    { title: 'Nombre d\'impacts',  width: '20%', minWidth: '20%', align: 'end',
        children: [
          { title: 'Ø 25', value: 'impactCount25' },
          { title: 'Ø 35', value: 'impactCount35' },
        ],  },
    { title: 'Type de matériau', key: 'bodyMaterial.name', width: '20%', align: 'start' },
    { title: 'Type de réparation', key: 'repairType.name', width: '20%', align: 'start' },
    { title: 'Dégarnissage', key: 'dentRemovalPrice', align: 'start'},
    { title: `Prix HT (${selectedCountry.value?.currencySymbol || '€'})`, key: 'price', align: 'end', width: '15%', minWidth: '15%' },
    { title: 'Actions', key: 'actions', align: 'end', sortable: false }
  ];


// #region -> METHODS

const onSearchTechnician = (event: InputEvent) => {
  const search = (event.target as HTMLInputElement).value;
  if (search) {
    techniciansList.value = techniciansList.value.filter(t => t.fullName.toLowerCase().includes(search));
  } else {
    techniciansList.value = technicians.value;
  }
};

const onSelectTechnician = (technician: UserViewModel) => {
  selectTechnician(technician);
};

const onSearchGarage = (event: InputEvent) => {
  const search = (event.target as HTMLInputElement).value;
  if (search) {
    garagesList.value = garagesList.value.filter(g => g.name.toLowerCase().includes(search));
  } else {
    garagesList.value = garages.value;
  }
};

const onSelectGarage = (garage: GarageViewModel) => {
  selectGarage(garage);
};

const onEditCustomerBtnClick = () => {
  garageDialogRef.value?.open()
}

const onGarageValidated = (garage: GarageViewModel) => {
  setGarage(garage)
}

const onCarImmatriculationUpdated = (value: string) => {
  setCarImmatriculation(value);
};

const onCarBrandUpdated = (value: string) => {
  setCarBrand(value);
};

const onCarYearUpdated = (value: string) => {
  setCarDateEntryCirculation(value);
};

const onUpdateIsForfait = (value: boolean) => {
  setIsForfait(value);
};

const onUpdateForfaitAmount = (value: number) => {
  setForfaitAmount(Number(value));
};

const onUpdateIsDisplayUnitPrice = (value: boolean) => {
  setIsDisplayUnitPrice(value);
};

const onUpdateIsComputeCommissionWithoutDentRemoval = (value: boolean) => {
  setIsComputeCommissionWithoutDentRemoval(value);
};

const onSelectCountry = (country: CountryViewModel | undefined) => {
  selectCountry(country);
};

const onAddItemBtnClick = () => {
  addLineItemDialogRef.value?.open()
};

const onRemoveItemBtnClick = (item: LineItemViewModel) => {
  removeLine(item.id);
};

const onAddLineItem = (item: LineItemViewModel) =>  {
  addLine(item)
}
// #endregion

// #REGION -> ACTION METHODS
const onAcceptedBtnClick = () => {
  updateQuoteStatus('accepted')
};

const onRefusedBtnClick = () => {
  updateQuoteStatus('refused')
};

const onSendBtnClick = () => {
  console.log('onSendBtnClick -> send quote');
};

const onDuplicateQuoteToInvoiceBtnClick = () => {
  duplicateQuoteToInvoice()
}

const onViewPdfBtnClick = () => {
  router.push(`/quotes/${route.params.id}/view`);
};

const onDeleteBtnClick = () => {
  deleteQuoteConfirmDialogRef.value?.open()
};

const onConfirmDeleteQuote = () => {
  deleteQuote(quoteInformations.value.number)
  router.push(`/quotes/`)
}

const onUpdateBtnClick = () => {
  updateQuote();
};
// #endregion
  
onMounted(async () => {
  await init(route.params.id);
  techniciansList.value = technicians.value;
  garagesList.value = garages.value;
});
</script>
