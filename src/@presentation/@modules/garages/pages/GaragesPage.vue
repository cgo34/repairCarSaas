<template>
  <MainLayout>
    <v-container fluid>
      <v-row>
        <v-data-table
          :headers="headers"
          :items="garages"
          :sort-by="[{ key: 'name', order: 'asc' }]"
        >
          <!-- #REGION -> TOP BAR -->
          <template #top>
            <v-toolbar flat>
              <v-toolbar-title>Gestion des Garages</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              />
              <v-spacer />

              <!-- #REGION -> ADD/EDIT ITEM DIALOG -->
              <v-dialog
                v-model="dialog"
                max-width="600px"
              >
                <template #activator="{ props }">
                  <v-btn
                    class="mb-2"
                    color="primary"
                    v-bind="props"
                  >
                    Ajouter un Garage
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            v-model="selectedGarage.name"
                            label="Nom du garage"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="selectedGarage.code"
                            label="Code du garage"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="selectedGarage.percentageCommission"
                            label="Commission (%)"
                            type="number"
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                        >
                          <v-text-field
                            v-model="selectedGarage.phone"
                            label="Téléphone"
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                        >
                          <v-text-field
                            v-model="selectedGarage.email"
                            label="Email"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="selectedGarage.address"
                            label="Adresse"
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                        >
                          <v-text-field
                            v-model="selectedGarage.zipCode"
                            label="Code Postal"
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                        >
                          <v-text-field
                            v-model="selectedGarage.city"
                            label="Ville"
                          />
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      color="blue-darken-1"
                      variant="text"
                      @click="onCloseEditDialogBtnClick"
                    >
                      Annuler
                    </v-btn>
                    <v-btn
                      color="blue-darken-1"
                      variant="text"
                      @click="onSaveEditDialogBtnClick"
                    >
                      Sauvegarder
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <!-- #ENDREGION -->
            </v-toolbar>
          </template>
          <!-- #ENDREGION -->

          <!-- #REGION -> ITEM ACTIONS -->
          <template #item.actions="{ item }">
            <v-icon
              class="me-2"
              size="small"
              @click="onEditBtnClick(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              size="small"
              @click="onDeleteBtnClick(item)"
            >
              mdi-delete
            </v-icon>
          </template>
          <!-- #ENDREGION -->
        </v-data-table>
      </v-row>
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';
import { IUseGarageState } from '@/@presentation/types/composables/IUseGarageState';
import { GarageViewModel } from '@/@presentation/types/models/GarageViewModel';
import { computed, onMounted, ref } from 'vue';

// Injection du state depuis Inversify
const useGarageState = container.get<IUseGarageState>(SYMBOLS.States.GarageState);

const {
    garages,
    selectedGarage,
    init,
    selectGarage,
    addGarage,
    updateGarage,
    deleteGarage,
    resetSelectedGarage
} = useGarageState;

const dialog = ref<boolean>(false);

const headers = [
  { title: 'Nom', align: 'start', key: 'name' },
  { title: 'Code', align: 'start', key: 'code' },
  { title: 'Commission (%)', key: 'percentageCommission' },
  { title: 'Téléphone', key: 'phone' },
  { title: 'Email', key: 'email' },
  { title: 'Adresse', key: 'address' },
  { title: 'Code postal', key: 'zipCode' },
  { title: 'Ville', key: 'city' },
  { title: 'Actions', sortable: false, key: 'actions' }
] as const;

const formTitle = computed(() => (selectedGarage.value?.id ? 'Modifier le Garage' : 'Nouveau Garage'));

const onEditBtnClick = (item: GarageViewModel) => {
  selectGarage(item);
  dialog.value = true;
};

const onCloseEditDialogBtnClick = () => {
  resetSelectedGarage();
  dialog.value = false;
};

const onSaveEditDialogBtnClick = async () => {
  if (selectedGarage.value?.id) await updateGarage(selectedGarage.value);
  else await addGarage(selectedGarage.value);
  dialog.value = false;
};

const onDeleteBtnClick = async (item: GarageViewModel) => {
  if (!item.id) return;

  const confirmed = confirm(`Êtes-vous sûr de vouloir supprimer le garage "${item.name}" ?`);
  if (!confirmed) return;

  await deleteGarage(item.id);
};
  
onMounted(async () => {
  await init();
});
</script>
