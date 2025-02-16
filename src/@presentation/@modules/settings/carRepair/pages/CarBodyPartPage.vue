<template>
  <MainLayout>
    <v-container fluid>
      <v-row>
        <v-data-table
          :headers="headers"
          :items="bodyParts"
          :sort-by="[{ key: 'name', order: 'asc' }]"
        >
          <!-- #REGION -> TOP BAR -->
          <template #top>
            <v-toolbar flat>
              <v-toolbar-title>Manage Body Part Element</v-toolbar-title>
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
                            v-model="selectedBodyPart.name"
                            label="Name"
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          md="4"
                          sm="6"
                        >
                          <v-text-field
                            v-model="selectedBodyPart.code"
                            label="Code"
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          md="4"
                          sm="6"
                        >
                          <v-text-field
                            v-model="selectedBodyPart.color"
                            label="Color"
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
                      Cancel
                    </v-btn>
                    <v-btn
                      color="blue-darken-1"
                      variant="text"
                      @click="onSaveEditDialogBtnClick"
                    >
                      Save
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
            <Icon
              class="icon-tabler icon-tabler-key iconClass me-2"
              size="small"
              @click="onEditBtnClick(item)"
            />
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
import { BodyPart } from '@/@domain/entities/carRepair/BodyPart';
import { IBodyPartState } from '@/@domain/states/carRepair/IBodyPartState';
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';
import { container } from '@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@infrastructure/ioc/symbols';
import { computed, onMounted, ref } from 'vue';

const useBodyPartState  = container.get<IBodyPartState>(SYMBOLS.States.CarRepair.BodyPartState);

const { bodyParts, selectedBodyPart, init, selectBodyPart, addBodyPart, deleteBodyPart } = useBodyPartState;

const dialog = ref<boolean>(false);

const headers = [
  { title: 'Name', align: 'start', key: 'name' },
  { title: 'Code', key: 'code' },
  { title: 'Color', sortable: false, key: 'color' },
  { title: 'Actions', sortable: false, key: 'actions' }
] as const;

const formTitle = computed(() => selectedBodyPart.value === null ? 'New Item' : 'Edit Item');

const onEditBtnClick = (item: BodyPart) => {
  selectBodyPart(item);
  dialog.value = true;
}

const onDeleteBtnClick = (item: BodyPart) => {
  if (!item.id)
    return;

  // TODO: Use a confirmation delete dialog
  deleteBodyPart(item.id);
}

const onCloseEditDialogBtnClick = () => {
  selectBodyPart(null);
  dialog.value = false;
}

const onSaveEditDialogBtnClick = () => {
  addBodyPart(selectedBodyPart.value)
  dialog.value = false;
}

onMounted(async () => {
  await init();
});
</script>
  