<template>
  <MainLayout>
    <v-container fluid>
      <v-row>
        <v-alert
          class="mb-2"
          type="info"
          icon="$info"
          variant="tonal"
          text="L'indice de difficulté 1 est une bosse sur un pavillon. Vous pouvez décider qu'une bosse sur un autre élément de carrosserie est X fois plus difficile à réparer."
        ></v-alert>
        <v-data-table
          :headers="headers"
          :items="settings"
          :sort-by="[{ key: 'coefficient', order: 'asc' }]"
        >
          <!-- #REGION -> TOP BAR -->
          <template #top>
            <v-toolbar flat>
              <v-toolbar-title>Paramètres des Coefficients des Éléments de Carrosserie</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              />
              <v-spacer />

              <!-- #REGION -> ADD/EDIT ITEM DIALOG -->
              <v-dialog
                v-model="dialog"
                max-width="500px"
              >
                <template #activator="{ props }">
                  <v-btn
                    class="mb-2"
                    color="primary"
                    v-bind="props"
                  >
                    Ajouter un Paramètre
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col
                          cols="12"
                          md="6"
                          sm="6"
                        >
                          <!-- <v-text-field
                            v-model="selectedSetting.bodyPartName"
                            label="Nom de l'Élément"
                          /> -->
                          <v-select
                            v-model="selectedSetting.bodyParts"
                            label="Select body part"
                            :items="bodyParts"
                            item-title="name"
                            item-value="id"
                            :item-props="true"
                            return-object
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                          sm="6"
                        >
                          <v-text-field
                            v-model="selectedSetting.coefficient"
                            label="Coefficient"
                            type="number"
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
import { IUseSettingPriceBodyPartCoefficientState } from '@/@presentation/types/composables/settings/price/IUseSettingPriceBodyPartCoefficientState';
import { SettingPriceBodyPartCoefficientViewModel } from '@/@presentation/types/models/settings/price/SettingPriceBodyPartCoefficientViewModel';
import { computed, onMounted, ref } from 'vue';

// Injection du state depuis Inversify
const useSettingPriceBodyPartCoefficientState = container.get<IUseSettingPriceBodyPartCoefficientState>(
  SYMBOLS.States.Setting.Price.BodyPartCoefficientState
);

const {
  settings,
  selectedSetting,
  init,
  selectSetting,
  addSetting,
  updateSetting,
  deleteSetting,
  resetSelectedSetting,
  bodyParts
} = useSettingPriceBodyPartCoefficientState;

const dialog = ref<boolean>(false);

const headers = [
  { title: 'Élément de Carrosserie', align: 'start', key: 'bodyParts.name' },
  { title: 'Coefficient de difficulté', key: 'coefficient' },
  { title: 'Actions', sortable: false, key: 'actions' }
] as const;

const formTitle = computed(() =>
  selectedSetting.value?.bodyPartId ? 'Modifier le paramètre' : 'Nouveau paramètre'
);

const onEditBtnClick = (item: SettingPriceBodyPartCoefficientViewModel) => {
  selectSetting(item);
  dialog.value = true;
};

const onDeleteBtnClick = (item: SettingPriceBodyPartCoefficientViewModel) => {
  if (!item.bodyPartId) return;

  // TODO: Ajouter un dialogue de confirmation avant suppression
  deleteSetting(item.bodyPartId);
};

const onCloseEditDialogBtnClick = () => {
  resetSelectedSetting();
  dialog.value = false;
};

const onSaveEditDialogBtnClick = async () => {
  if (selectedSetting.value?.bodyPartId) {
    await updateSetting(selectedSetting.value);
  } else {
    await addSetting(selectedSetting.value);
  }
  dialog.value = false;
};

onMounted(async () => {
  await init();
});
</script>
