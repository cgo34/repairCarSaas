<template>
  <MainLayout>
    <v-container>
      <v-card
        class="rounded-lg"
        outlined
      >
        <v-card-title class="text-h5">
          Créer un Devis
        </v-card-title>

        <v-card-text>
          <!-- Informations du devis -->
          <v-row>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="quote.quoteNumber"
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
                v-model="quote.date"
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
                v-model="quote.validUntil"
                label="Validité jusqu'à"
                type="date"
                outlined
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
                      From:
                    </h5>
                    <p class="mb-0">
                      <strong>{{ selectedTechnician?.fullName || 'Sélectionner un technicien' }}</strong>
                    </p>
                    <p
                      v-if="selectedTechnician"
                      class="mb-0"
                    >
                      {{ selectedTechnician.email }}
                    </p>
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

                  <!-- <v-btn
                    variant="outlined"
                    color="primary"
                    @click="selectTechnician"
                  >
                    Changer
                  </v-btn> -->
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
                      To:
                    </h5>
                    <p class="mb-0">
                      <strong>{{ selectedGarage?.name || 'Ajouter un garage' }}</strong>
                    </p>
                    <p
                      v-if="selectedGarage"
                      class="mb-0"
                    >
                      {{ selectedGarage.address }}, {{ selectedGarage.zipCode }} {{ selectedGarage.city }}
                    </p>
                    <p
                      v-if="selectedGarage"
                      class="mb-0"
                    >
                      {{ selectedGarage.phone }}
                    </p>
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
              <v-card
                outlined
                class="pa-4"
              >
                <v-row>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-text-field
                      label="Immatriculation"
                      outlined
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-text-field
                      label="Marque"
                      outlined
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-text-field
                      label="Année"
                      outlined
                    />
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      
        <v-divider class="my-4" />

        <!-- Tableau des éléments du devis -->
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="quoteLines"
            class="elevation-1"
          >
            <template #[`item.bodyPart`]="{ item }">
              <BodyPartSelect
                :model-value="item.bodyPart"
                :body-parts="availableBodyParts"
                @select="onSelectBodyPart($event, item.id)"
              />
              <!-- <v-text-field
                v-model="item.bodyPart.name"
                placeholder="Nom de l'élément"
                dense
                outlined
              /> -->
            </template>
            <template #[`item.impactSize`]="{ item }">
              <!-- <v-text-field
                v-model="item.impactSize"
                placeholder="Taille impact"
                dense
                outlined
              /> -->
            </template>
            <template #[`item.impactCount`]="{ item }">
              <!-- <v-text-field
                v-model="item.impactCount"
                type="number"
                placeholder="Nombre impact"
                dense
                outlined
              /> -->
            </template>
            <template #[`item.bodyMaterial.name`]="{ item }">
              <BodyMaterialSelect
                :model-value="item.bodyMaterial"
                :body-parts="bodyMaterials"
                @select="onSelectBodyMaterial($event, item.id)"
              />
              <!-- <v-text-field
                v-model="item.bodyMaterial.name"
                placeholder="Matériau"
                dense
                outlined
              /> -->
            </template>
            <template #[`item.repairType.name`]="{ item }">
              <RepairTypeSelect
                :model-value="item.repairType"
                :repair-types="repairTypes"
                @update:model-value="onSelectRepairType"
                @select="onSelectRepairType"
              />

              <!-- <v-text-field
                v-model="item.repairType.name"
                placeholder="Type de réparation"
                dense
                outlined
              /> -->
            </template>
            <template #[`item.price`]="{ item }">
              <!-- <div class="text-right">
                {{ item.price.toFixed(2) }} €
              </div> -->
            </template>
            <template #[`item.actions`]="{ item }">
              <v-icon
                class="me-2"
                size="small"
                @click="removeItem(item)"
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
              md="2"
              class="text-end"
            >
              <h5 class="py-2 text-subtitle-1">
                Sub Total :
              </h5>
              <h5 class="py-2 text-subtitle-1 text-no-wrap">
                Taxes (10%) :
              </h5>
              <h5 class="py-2 text-subtitle-1 text-no-wrap">
                Discount (5%) :
              </h5>
              <h5 class="py-2 text-subtitle-1 text-primary mt-7">
                Total
              </h5>
            </v-col>
            <v-col
              cols="6"
              sm="3"
              md="2"
              class="text-end"
            >
              <h5 class="py-2 text-subtitle-1 text-disabled">
                {{ subtotal.toFixed(2) }} €
              </h5>
              <h5 class="py-2 text-subtitle-1 text-disabled">
                {{ tax.toFixed(2) }} €
              </h5>
              <h5 class="py-2 text-subtitle-1 text-disabled">
                {{ discount.toFixed(2) }} €
              </h5>
              <h5 class="py-2 text-subtitle-1 text-primary mt-7">
                {{ total.toFixed(2) }} €
              </h5>
            </v-col>
          </v-row>
        </v-sheet>
      </v-card>
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';
import BodyPartSelect from '@/@presentation/components/BodyPartSelect.vue';
import { IUseCreateQuoteState } from '@/@presentation/types/composables/IUseCreateQuoteState';
import { BodyMaterialViewModel } from '@/@presentation/types/models/carRepair/BodyMaterialViewModel';
import { BodyPartViewModel } from '@/@presentation/types/models/carRepair/BodyPartViewModel';
import { DentRepairTypeViewModel } from '@/@presentation/types/models/carRepair/DentRepairTypeViewModel';
import { GarageViewModel } from '@/@presentation/types/models/GarageViewModel';
import { UserViewModel } from '@/@presentation/types/models/UserViewModel';
import { computed, onMounted, ref } from 'vue';

// Injection du state depuis Inversify
const useCreateQuoteState = container.get<IUseCreateQuoteState>(SYMBOLS.States.Quote.CreateQuoteState);

const {
  init,
  technicians,
  garages,
  selectedTechnician,
  selectedGarage,
  selectGarage,
  selectTechnician,
  availableBodyParts,
  bodyParts,
  bodyMaterials,
  repairTypes,
  quoteLines,
  addLine,

  selectBodyPart,
} = useCreateQuoteState;

// type QuoteItem = {
//   id: number;
//   bodyPart: { name: string };
//   impactSize: string;
//   impactCount: number;
//   bodyMaterial: { name: string };
//   repairType: { name: string };
//   price: number;
//   qty: number;
// };

const techniciansList = ref<UserViewModel[]>(technicians.value);
const garagesList = ref<GarageViewModel[]>(garages.value);

const quote = ref({
  quoteNumber: `Q-${Date.now()}`,
  date: new Date().toISOString().split('T')[0],
  validUntil: '',
  technician: null,
  garage: null,
  items: [] as QuoteItem[],
});

const headers = [
  { title: 'Element', key: 'bodyPart' },
  { title: 'Taille impact', key: 'impactSize' },
  { title: 'Nombre impact', key: 'impactCount' },
  { title: 'Matériau', key: 'bodyMaterial.name' },
  { title: 'Type de réparation', key: 'repairType.name' },
  { title: 'Prix HT (€)', key: 'price', align: 'end' },
  { title: 'Actions', key: 'actions', sortable: false }
];

const subtotal = computed(() => quote.value.items.reduce((sum, item) => sum + item.price, 0));
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

const onAddItemBtnClick = () => {
//   quote.value.items.push({ 
//   id: Date.now(), 
//   bodyPart: { name: '' }, 
//   impactSize: '', 
//   impactCount: 0, 
//   bodyMaterial: { name: '' }, 
//   repairType: { name: '' }, 
//   price: Math.floor(Math.random() * (800 - 100 + 1)) + 100, 
//   qty: 1 
// });
console.log('onAddItemBtnClick');

  addLine()
  
};

const removeItem = (item: QuoteItem) => {
  quote.value.items = quote.value.items.filter(i => i.id !== item.id);
};


const onSelectBodyPart = (bodyPart: BodyPartViewModel, lineId: number) => {
  console.log('onSelectBodyPart', lineId, bodyPart);
  selectBodyPart(lineId, bodyPart);
  // selectBodyPart(lineId, bodyPart);
};

const onSelectBodyMaterial = (bodyMaterial: BodyMaterialViewModel, lineId: number) => {
  console.log('onSelectBodyMaterial', lineId, bodyMaterial);
  // selectBodyMaterial(lineId, bodyMaterial);
};

const onSelectRepairType = (repairType: DentRepairTypeViewModel) => {
  console.log('onSelectRepairType', repairType);
  // selectRepairType(repairType);
};
// #endregion
  
onMounted(async () => {
  await init();
});
</script>
