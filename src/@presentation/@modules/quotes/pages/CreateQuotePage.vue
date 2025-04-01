<template>
  <MainLayout>
    <v-container fluid class="px-0 py-0">
      <v-form ref="form">
        <v-card
          class="rounded-lg"
          outlined
        >
          <v-card-title class="text-h5">
            Créer un Devis
          </v-card-title>

          <v-card-text>
            <!-- Informations du devis -->
            <h5 class="text-h6 my-4">
              Informations générales
            </h5>
            <v-row>
              <v-col
                cols="12"
                md="4"
              >
                <v-text-field
                  v-model="quoteInformations.number"
                  label="Numéro de devis"
                  readonly
                  outlined
                />
              </v-col>
              <v-col
                cols="12"
                md="4"
              >
                <v-text-field
                  v-model="quoteInformations.date"
                  label="Date"
                  type="date"
                  outlined
                />
              </v-col>
              <v-col
                cols="12"
                md="4"
              >
                <v-text-field
                  v-model="quoteInformations.expirationDate"
                  label="Validité jusqu'à"
                  type="date"
                  outlined
                  required
                />
              </v-col>
            </v-row>

            <!-- Informations du Technicien et du Garage -->
            <v-row>
              <v-col md="6">
                <v-card
                  outlined
                  class="pa-4"
                >
                  <div class="d-flex flex-column justify-space-between">
                    <div>
                      <h5 class="text-h6">
                        Technicien :
                      </h5>
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
                        clearable
                        @update:model-value="onSelectTechnician"
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
                  class="pa-4"
                >
                  <div class="d-flex flex-column justify-space-between">
                    <div>
                      <h5 class="text-h6">
                        Garage :
                      </h5>
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
                        :item-props="true"
                        item-title="name"
                        item-value
                        return-object
                        clearable
                        @update:model-value="onSelectGarage"
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
                <h5 class="text-h6 my-4">
                  Informations du véhicule
                </h5>
                <v-card
                  outlined
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
              <h5 class="text-h6">
                Options du devis
              </h5>
              <div class="d-flex justify-space-between">
                <div><v-switch label="Appliquer un forfait ?" :modelValue="isForfait" @update:modelValue="onUpdateIsForfait" color="primary" inset></v-switch></div>
                <div v-if="!isForfait"><v-switch label="Afficher les prix unitaires ?" :modelValue="isDisplayUnitPrice" @update:modelValue="onUpdateIsDisplayUnitPrice" color="primary" inset></v-switch></div>
                <div v-if="!isForfait"><v-switch label="Calculer la commission sans le dégarnissage ?" :modelValue="isComputeCommissionWithoutDentRemoval" @update:modelValue="onUpdateIsComputeCommissionWithoutDentRemoval" color="primary" inset></v-switch></div>
              </div>
            </div>
            <CountrySelect :modelValue="selectedCountry" @select="onSelectCountry"/>
          </v-card-text>
          <v-card-text v-if="isForfait">
            <v-text-field
              :modelValue="forfaitAmount"
              placeholder="Montant du forfait"
              dense
              outlined
              @update:modelValue="onUpdateForfaitAmount"
            />
          </v-card-text>
          <v-card-text v-if="!isForfait">
            <h5 class="text-h6">
              Liste des éléments
            </h5>
            <v-data-table
              :headers="headers"
              :items="quoteLines"
              class="elevation-1"
              density="comfortable"
            >
              <template #[`item.bodyPart`]="{ item }">
                  <BodyPartSelect
                  :model-value="item.bodyPart"
                  :body-parts="availableBodyParts"
                  @select="(value) => onSelectBodyPart(value, item.id)"
                />
              </template>
              <template #[`item.impactCount25`]="{ item }">
                  <v-text-field
                    v-model="item.impactCount25"
                    placeholder="Nb."
                    dense
                    outlined
                  />
              </template>
              <template #[`item.impactCount35`]="{ item }">
                <v-text-field
                  v-model="item.impactCount35"
                  placeholder="Nb."
                  dense
                  outlined
                />
              </template>
              <template #[`item.bodyMaterial`]="{ item }">
                <BodyMaterialSelect
                  :model-value="item.bodyMaterial"
                  :body-materials="bodyMaterials"
                  @select="onSelectBodyMaterial($event, item.id)"
                />
              </template>
              <template #[`item.repairType`]="{ item }">
                <RepairTypeSelect
                  :model-value="item.repairType"
                  :repair-types="repairTypes"
                  @select="onSelectRepairType($event, item.id)"
                />
              </template>
              <template #[`item.dentRemovalPrice`]="{ item }">
                <v-text-field
                  v-model="item.dentRemovalPrice"
                  placeholder="Montant"
                  dense
                  outlined
                />
              </template>
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
                >
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
            <v-btn
              class="mt-3"
              color="primary"
              @click="onAddItemBtnClick"
            >
              + Ajouter un élément
            </v-btn>
          </v-card-text>

          <v-divider class="my-4" />

          <!-- Bloc des Totaux -->
          <v-sheet class="rounded-sm bg-lightprimary pa-2 pa-sm-6">
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
                  {{ subtotal.toFixed(2) }} {{ selectedCountry?.currencySymbol || '€' }}
                </h5>
                <h5 v-if="!isForfait" class="py-2 text-subtitle-1 text-disabled">
                  {{ tax.toFixed(2) }} {{ selectedCountry?.currencySymbol || '€' }}
                </h5>
                <h5 v-if="!isForfait" class="py-2 text-subtitle-1 text-disabled">
                  {{ tax.toFixed(2) }} {{ selectedCountry?.currencySymbol || '€' }}
                </h5>
                <h5 class="py-2 text-subtitle-1 text-disabled">
                  {{ tax.toFixed(2) }} {{ selectedCountry?.currencySymbol || '€' }}
                </h5>
                <h5 class="py-2 text-subtitle-1 text-primary mt-7">
                  {{ total.toFixed(2) }} {{ selectedCountry?.currencySymbol || '€' }}
                </h5>
              </v-col>
            </v-row>
          </v-sheet>
          
          <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                v-if="quoteInformations.status === 'draft'"
                class="mt-3"
                color="primary"
                @click="onSaveBtnClick"
              >
                Sauvegarder
              </v-btn>
              <v-btn
                v-else
                class="mt-3"
                color="primary"
                @click="onUpdateBtnClick"
              >
                Mettre à jour
              </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';
import BodyMaterialSelect from '@/@presentation/components/BodyMaterialSelect.vue';
import BodyPartSelect from '@/@presentation/components/BodyPartSelect.vue';
import CountrySelect from '@/@presentation/components/CountrySelect.vue';
import RepairTypeSelect from '@/@presentation/components/RepairTypeSelect.vue';
import { IUseCreateQuoteState } from '@/@presentation/types/composables/IUseCreateQuoteState';
import { BodyMaterialViewModel } from '@/@presentation/types/models/carRepair/BodyMaterialViewModel';
import { BodyPartViewModel } from '@/@presentation/types/models/carRepair/BodyPartViewModel';
import { DentRepairTypeViewModel } from '@/@presentation/types/models/carRepair/DentRepairTypeViewModel';
import { CountryViewModel } from '@/@presentation/types/models/CountryViewModel';
import { GarageViewModel } from '@/@presentation/types/models/GarageViewModel';
import { LineItemViewModel } from '@/@presentation/types/models/LineItemViewModel';
import { UserViewModel } from '@/@presentation/types/models/UserViewModel';
import { computed, onMounted, ref } from 'vue';

// Injection du state depuis Inversify
const useCreateQuoteState = container.get<IUseCreateQuoteState>(SYMBOLS.States.Quote.CreateQuoteState);

const {
  init,

  quoteInformations,

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

  availableBodyParts,
  bodyMaterials,

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

  repairTypes,
  quoteLines,
  addLine,
  removeLine,

  selectBodyPart,
  selectBodyMaterial,
  selectRepairType,

  saveQuote
} = useCreateQuoteState;

const techniciansList = ref<UserViewModel[]>(technicians.value);
const garagesList = ref<GarageViewModel[]>(garages.value);

const headers = computed(()=> {
  return [
    { title: 'Element de carrosserie', key: 'bodyPart', width: '25%', minWidth: '25%' },
    { title: 'Nombre d\'impacts',  width: '20%', minWidth: '20%', 
        children: [
          { title: 'Ø 25', value: 'impactCount25' },
          { title: 'Ø 35', value: 'impactCount35' },
        ],  },
    { title: 'Type de matériau', key: 'bodyMaterial', width: '20%' },
    { title: 'Type de réparation', key: 'repairType', width: '20%' },
    { title: 'Dégarnissage', key: 'dentRemovalPrice', },
    { title: `Prix HT (${selectedCountry.value?.currencySymbol || '€'})`, key: 'price', align: 'end', width: '15%', minWidth: '15%' },
    { title: 'Actions', key: 'actions', align: 'end', sortable: false }
  ];
})

const subtotal = computed(() => 
  quoteLines.value.reduce((sum, item) => {
    console.log('subtotal -> item', item);
    return sum + item.price; // 👈 Évite undefined en mettant `?? 0`
  }, 0) // 👈 Ajoute la valeur initiale ici
);

const tax = computed(() => subtotal.value * 0.10);
const discount = computed(() => subtotal.value * 0.05);
const total = computed(() => subtotal.value + tax.value - discount.value);

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
  setForfaitAmount(value);
};

const onUpdateIsDisplayUnitPrice = (value: boolean) => {
  setIsDisplayUnitPrice(value);
};

const onUpdateIsComputeCommissionWithoutDentRemoval = (value: boolean) => {
  setIsComputeCommissionWithoutDentRemoval(value);
};

const onSelectCountry = (country: CountryViewModel | undefined) => {
  console.log('onSelectCountry -> country', country);
  selectCountry(country);
};

const onAddItemBtnClick = () => {
  addLine()  
};

const onRemoveItemBtnClick = (item: LineItemViewModel) => {
  removeLine(item.id);
};


const onSelectBodyPart = (bodyPart: BodyPartViewModel | undefined, lineId: number) => {
  if (!bodyPart)
    return;

  selectBodyPart(lineId, bodyPart);
};

const onSelectBodyMaterial = (bodyMaterial: BodyMaterialViewModel | undefined, lineId: number) => {
  if (!bodyMaterial)
    return;

  selectBodyMaterial(lineId, bodyMaterial);
};

const onSelectRepairType = (repairType: DentRepairTypeViewModel | undefined, lineId: number) => {
  if (!repairType)
    return;

  selectRepairType(lineId, repairType);
};

const onSaveBtnClick = () => {
  console.log('onSaveBtnClick -> quoteInformations', quoteInformations.value);
  saveQuote();
};

const onUpdateBtnClick = () => {
  console.log('onUpdateBtnClick -> quoteInformations', quoteInformations.value);
};
// #endregion
  
onMounted(async () => {
  await init();
  techniciansList.value = technicians.value;
  garagesList.value = garages.value;
});
</script>
