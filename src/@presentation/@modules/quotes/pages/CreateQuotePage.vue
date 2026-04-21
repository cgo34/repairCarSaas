<template>
  <MainLayout>
    <v-container
      fluid
      class="px-0 py-0"
    >
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
                  v-model="expirationDate"
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
                    <div class="d-flex align-center justify-space-between mb-2">
                      <h5 class="text-h6">
                        Garage :
                      </h5>
                      
                      <!-- TODO: (GCE) -> ADD IMPLEMENTATION TO FREE USER -->
                      <v-btn
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
                      <!-- INFO -> IMPLEMENTATION TO PAID USER -->
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
                        md="12"
                      >
                        <v-select
                          :model-value="selectedVehicle"
                          label="Véhicule existant (optionnel)"
                          :items="vehiclesList"
                          :item-title="v => v.immatriculation + ' — ' + v.marque + (v.annee ? ' ' + v.annee : '')"
                          item-value="id"
                          return-object
                          clearable
                          :disabled="!selectedGarage"
                          @update:model-value="onSelectVehicle"
                        />
                      </v-col>
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
                <div>
                  <v-switch
                    label="Appliquer un forfait ?"
                    :model-value="isForfait"
                    color="primary"
                    inset
                    @update:model-value="onUpdateIsForfait"
                  />
                </div>
                <div v-if="!isForfait">
                  <v-switch
                    label="Afficher les prix unitaires ?"
                    :model-value="isDisplayUnitPrice"
                    color="primary"
                    inset
                    @update:model-value="onUpdateIsDisplayUnitPrice"
                  />
                </div>
                <div v-if="!isForfait">
                  <v-switch
                    label="Calculer la commission sans le dégarnissage ?"
                    :model-value="isComputeCommissionWithoutDentRemoval"
                    color="primary"
                    inset
                    @update:model-value="onUpdateIsComputeCommissionWithoutDentRemoval"
                  />
                </div>
              </div>
            </div>
            <div v-if="isForfait">
              <h4 class="text-h4">
                Montant du forfait
              </h4>
              <v-text-field
                :model-value="forfaitAmount"
                placeholder="Montant du forfait"
                type="number"
                dense
                outlined
                @update:model-value="onUpdateForfaitAmount"
              />
            </div>
            <CountrySelect
              :model-value="selectedCountry"
              @select="onSelectCountry"
            />
          </v-card-text>
        </v-card>
        <div class="d-flex justify-end">
          <v-btn
            class="mt-3"
            color="primary"
            @click="onSaveBtnClick"
          >
            Créer
          </v-btn>
        </div>
      </v-form>
    </v-container>
  </MainLayout>
  
  <GarageDialog
    ref="garageDialogRef"
    title="Edit customer"
    persistent
    :max-width="500"
    @validated="onGarageValidated"
  />
</template>

<script setup lang="ts">
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';
import CountrySelect from '@/@presentation/components/CountrySelect.vue';
import { GarageDialogExposed } from '@/@presentation/components/GarageDialog';
import GarageDialog from '@/@presentation/components/GarageDialog.vue';
import { IUseCreateQuoteState } from '@/@presentation/types/composables/IUseCreateQuoteState';
import { CountryViewModel } from '@/@presentation/types/models/CountryViewModel';
import { GarageViewModel } from '@/@presentation/types/models/GarageViewModel';
import { UserViewModel } from '@/@presentation/types/models/UserViewModel';
import router from '@/router';
import { computed, onMounted, ref } from 'vue';
import { VehicleViewModel } from '@/@presentation/types/models/VehicleViewModel';

// Injection du state depuis Inversify
const useCreateQuoteState = container.get<IUseCreateQuoteState>(SYMBOLS.States.Quote.CreateQuoteState);
const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
const { isFreePlan } = authState

const {
  init,

  quote,
  quoteInformations,
  expirationDate,

  technicians,
  garages,
  selectedTechnician,
  selectedGarage,
  selectGarage,
  vehicles,
  selectedVehicle,
  selectVehicle,
  selectTechnician,
  setGarage,

  carInformations,
  setCarImmatriculation,
  setCarBrand,
  setCarDateEntryCirculation,

  isForfait,
  isDisplayUnitPrice,
  isComputeCommissionWithoutDentRemoval,
  setForfaitAmount,
  forfaitAmount,
  setIsForfait,
  setIsDisplayUnitPrice,
  setIsComputeCommissionWithoutDentRemoval,
  selectCountry,
  selectedCountry,

  save
} = useCreateQuoteState;


const garageDialogRef = ref<GarageDialogExposed>()

const techniciansList = ref<UserViewModel[]>(technicians.value);
const garagesList = ref<GarageViewModel[]>(garages.value);
const vehiclesList = computed(() => vehicles.value);

// #region -> METHODS
const onSearchTechnician = (event: InputEvent) => {
  const search = (event.target as HTMLInputElement).value;
  if (search) {
    techniciansList.value = techniciansList.value.filter(t => t.fullName.toLowerCase().includes(search));
  } else {
    techniciansList.value = technicians.value;
  }
};

const onSearchGarage = (event: InputEvent) => {
  const search = (event.target as HTMLInputElement).value;
  if (search) {
    garagesList.value = garagesList.value.filter(g => g.name.toLowerCase().includes(search));
  } else {
    garagesList.value = garages.value;
  }
};

const onSelectTechnician = (technician: UserViewModel) => {
  selectTechnician(technician);
};

const onSelectGarage = (garage: GarageViewModel) => {
  selectGarage(garage);
};

const onSelectVehicle = (vehicle: VehicleViewModel | undefined) => {
  selectVehicle(vehicle);
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
  if (!country)
    return;

  selectCountry(country);
};

const onSaveBtnClick = () => {
  save().then(() => {
    router.push(`/quotes/${quote.value.id}/edit`);
  });
};
// #endregion
  
onMounted(async () => {
  await init();
  techniciansList.value = technicians.value;
  garagesList.value = garages.value;
  // vehiclesList is reactive via computed
});
</script>
