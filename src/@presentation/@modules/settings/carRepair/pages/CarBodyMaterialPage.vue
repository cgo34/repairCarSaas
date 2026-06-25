<template>
  <MainLayout>
    <v-container fluid class="pa-0">
      <v-row>
        <v-data-table
          :headers="headers"
          :items="bodyMaterials"
          :sort-by="[{ key: 'name', order: 'asc' }]"
        >
          <!-- #REGION -> TOP BAR -->
          <template #top>
            <v-toolbar flat>
              <v-toolbar-title>Manage Body Materials</v-toolbar-title>
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
                    New Item
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
                          md="4"
                          sm="6"
                        >
                          <v-text-field
                            v-model="selectedBodyMaterial.name"
                            label="Name"
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          md="4"
                          sm="6"
                        >
                          <v-text-field
                            :model-value="slugify(selectedBodyMaterial.name)"
                            label="Code"
                            disabled
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
                      @click="onCancelBodyMaterialBtnClick"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      color="blue-darken-1"
                      variant="text"
                      @click="onValidEditBtnClick"
                    >
                      valider
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
              @click="onEditBodyMaterialBtnClick(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              size="small"
              @click="onDeleteBodyMaterialBtnClick(item)"
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
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';
import { IBodyMaterialState } from '@/@presentation/types/composables/IBodyMaterialState';
import { BodyMaterialViewModel } from '@/@presentation/types/models/carRepair/BodyMaterialViewModel';
import { slugify } from '@/shared/utils/slugify';
import { container } from '@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@infrastructure/ioc/symbols';
import { computed, onMounted, ref } from 'vue';

const useBodyMaterialState = container.get<IBodyMaterialState>(SYMBOLS.States.CarRepair.BodyMaterialState);

const {
  bodyMaterials,
  selectedBodyMaterial,
  init,
  selectBodyMaterial,
  addBodyMaterial,
  updateBodyMaterial,
  deleteBodyMaterial,
  resetSelectedBodyMaterial
} = useBodyMaterialState;

const dialog = ref<boolean>(false);

const headers = [
  { title: 'Name', align: 'start', key: 'name' },
  { title: 'Code', key: 'code' },
  { title: 'Actions', sortable: false, key: 'actions' }
] as const;

const formTitle = computed(() => selectedBodyMaterial.value.id === undefined ? 'New Item' : 'Edit Item');

const onEditBodyMaterialBtnClick = (item: BodyMaterialViewModel) => {
  selectBodyMaterial(item);
  dialog.value = true;
}

const onDeleteBodyMaterialBtnClick = (item: BodyMaterialViewModel) => {
  if (!item.id) return;
  deleteBodyMaterial(item.id);
}

const onCancelBodyMaterialBtnClick = () => {
  resetSelectedBodyMaterial();
  dialog.value = false;
}

const onValidEditBtnClick = async () => {
  if (selectedBodyMaterial.value?.id) {
    await updateBodyMaterial(selectedBodyMaterial.value);
  } else {
    await addBodyMaterial(selectedBodyMaterial.value);
  }
  dialog.value = false;
};

onMounted(async () => {
  await init();
});
</script>
