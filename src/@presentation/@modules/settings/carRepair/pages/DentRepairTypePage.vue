<template>
  <MainLayout>
    <v-container fluid>
      <v-row>
        <v-data-table
          :headers="headers"
          :items="dentRepairTypes"
          :sort-by="[{ key: 'name', order: 'asc' }]"
        >
          <!-- #REGION -> TOP BAR -->
          <template #top>
            <v-toolbar flat>
              <v-toolbar-title>Manage Dent Repair Types</v-toolbar-title>
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
                            v-model="selectedDentRepairType.name"
                            label="Name"
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          md="4"
                          sm="6"
                        >
                          <v-text-field
                            v-model="selectedDentRepairType.code"
                            label="Code"
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
                      @click="onCancelDentRepairBtnClick"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      color="blue-darken-1"
                      variant="text"
                      @click="onValidEditBtnClick"
                    >
                      Valider
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
              @click="onEditDentRepairBtnClick(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              size="small"
              @click="onDeleteDentRepairBtnClick(item)"
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
import { IDentRepairTypeState } from '@/@presentation/types/composables/IDentRepairTypeState';
import { DentRepairTypeViewModel } from '@/@presentation/types/models/carRepair/DentRepairTypeViewModel';
import { container } from '@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@infrastructure/ioc/symbols';
import { computed, onMounted, ref } from 'vue';

const useDentRepairTypeState  = container.get<IDentRepairTypeState>(SYMBOLS.States.CarRepair.DentRepairTypeState);

const {
  dentRepairTypes,
  selectedDentRepairType,
  init,
  selectDentRepairType,
  addDentRepairType,
  updateDentRepairType,
  deleteDentRepairType,
  resetSelectedDentRepairType
} = useDentRepairTypeState;

const dialog = ref<boolean>(false);

const headers = [
  { title: 'Name', align: 'start', key: 'name' },
  { title: 'Code', key: 'code' },
  { title: 'Actions', sortable: false, key: 'actions' }
] as const;

const formTitle = computed(() => selectedDentRepairType.value === null ? 'New Item' : 'Edit Item');

const onEditDentRepairBtnClick = (item: DentRepairTypeViewModel) => {
  selectDentRepairType(item);
  dialog.value = true;
}

// TODO: Use a confirmation delete dialog
const onDeleteDentRepairBtnClick = (item: DentRepairTypeViewModel) => {
  if (!item.id)
    return;

  deleteDentRepairType(item.id);
}

const onCancelDentRepairBtnClick = () => {
  resetSelectedDentRepairType();
  dialog.value = false;
}

const onValidEditBtnClick = async () => {
  if (selectedDentRepairType.value?.id) {
    await updateDentRepairType(selectedDentRepairType.value);
  } else {
    await addDentRepairType(selectedDentRepairType.value);
  }
  dialog.value = false;
};

onMounted(async () => {
  await init();
});
</script>
  