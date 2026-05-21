<template>
  <MainLayout>
    <SubscriptionOverlay
      v-if="isFreePlan"
    />

    <v-container fluid>
      <v-row>
        <v-data-table
          :headers="headers"
          :items="garages"
          :sort-by="[
            {
              key: 'name',
              order: 'asc',
            },
          ]"
        >
          <!-- ===================================================== -->
          <!-- TOP BAR -->
          <!-- ===================================================== -->

          <template #top>
            <v-toolbar flat>
              <v-toolbar-title>
                Gestion des Garages
              </v-toolbar-title>

              <v-divider
                class="mx-4"
                inset
                vertical
              />

              <v-spacer />

              <!-- ===================================================== -->
              <!-- DIALOG -->
              <!-- ===================================================== -->

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
                    <span class="text-h5">
                      {{ formTitle }}
                    </span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            v-model="selectedGarageForm.name"
                            label="Nom du garage"
                          />
                        </v-col>

                        <v-col
                          cols="12"
                          md="6"
                        >
                          <v-text-field
                            v-model="selectedGarageForm.phone"
                            label="Téléphone"
                          />
                        </v-col>

                        <v-col
                          cols="12"
                          md="6"
                        >
                          <v-text-field
                            v-model="selectedGarageForm.email"
                            label="Email"
                          />
                        </v-col>

                        <v-col cols="12">
                          <v-text-field
                            v-model="selectedGarageForm.address"
                            label="Adresse"
                          />
                        </v-col>

                        <v-col
                          cols="12"
                          md="6"
                        >
                          <v-text-field
                            v-model="selectedGarageForm.zip_code"
                            label="Code Postal"
                          />
                        </v-col>

                        <v-col
                          cols="12"
                          md="6"
                        >
                          <v-text-field
                            v-model="selectedGarageForm.city"
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
                      @click="
                        onCloseEditDialogBtnClick
                      "
                    >
                      Annuler
                    </v-btn>

                    <v-btn
                      color="blue-darken-1"
                      variant="text"
                      @click="
                        onSaveEditDialogBtnClick
                      "
                    >
                      Sauvegarder
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>

          <template #item.archived_at="{ item }">
            <v-chip
              :color="getStatusColor(getGarageStatus(item))"
              size="small"
              label
            >
              {{ getGarageStatus(item) }}
            </v-chip>
          </template>
          <!-- ===================================================== -->
          <!-- ACTIONS -->
          <!-- ===================================================== -->

          <template #item.actions="{ item }">
            <v-icon
              class="me-2"
              size="small"
              @click="
                onEditBtnClick(item)
              "
            >
              mdi-pencil
            </v-icon>

            <v-icon
              size="small"
              @click="
                onDeleteBtnClick(item)
              "
            >
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-row>
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { IAuthState } from '@/@application/states/interfaces/IAuthState';

import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';

import SubscriptionOverlay from '@/@presentation/@ui/components/SubscriptionOverlay.vue';
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';

import { IUseGarageState } from '@/@presentation/types/composables/IUseGarageState';

import { GarageViewModel } from '@/@presentation/types/models/GarageViewModel';

/**
 * ============================================================
 * STATE
 * ============================================================
 */
const useGarageState =
  container.get<IUseGarageState>(
    SYMBOLS.States.GarageState
  );

const authState =
  container.get<IAuthState>(
    SYMBOLS.States.AuthState
  );

const { isFreePlan } = authState;

const {
  garages,

  selectedGarageForm,

  init,

  selectGarage,

  addGarage,

  updateGarage,

  archiveGarage,

  resetSelectedGarageForm,
} = useGarageState;

/**
 * ============================================================
 * UI
 * ============================================================
 */

const dialog = ref<boolean>(false);

/**
 * ============================================================
 * TABLE
 * ============================================================
 */

const headers = computed(() => {
  const baseHeaders = [
    {
      title: 'Nom',
      align: 'start',
      key: 'name',
    },

    {
      title: 'Téléphone',
      key: 'phone',
    },

    {
      title: 'Email',
      key: 'email',
    },

    {
      title: 'Ville',
      key: 'city',
    },

    {
      title: 'Code postal',
      key: 'zip_code',
    },

    {
      title: 'Adresse',
      key: 'address',
    },

    {
      title: 'Statut',
      key: 'archived_at',
    },
  ];

  const isAdmin =
    authState.userContext?.membership?.role === 'admin';

  // if (isAdmin) {
    baseHeaders.push({
      title: 'Actions',
      key: 'actions',
    });
  // }

  return baseHeaders;
});

/**
 * ============================================================
 * FORM
 * ============================================================
 */

const formTitle = computed(() =>
  selectedGarageForm.value?.id
    ? 'Modifier le Garage'
    : 'Nouveau Garage'
);

const getGarageStatus = (
  garage: GarageViewModel
): 'active' | 'archived' => {
  return garage.archived_at
    ? 'archived'
    : 'active';
};

const getStatusColor = (
  status: string
) => {
  switch (status) {
    case 'active':
      return 'green';

    case 'archived':
      return 'grey';

    default:
      return 'grey';
  }
};

/**
 * ============================================================
 * ACTIONS
 * ============================================================
 */

const onEditBtnClick = (
  item: GarageViewModel
) => {
  selectGarage(item);

  dialog.value = true;
};

const onCloseEditDialogBtnClick =
  () => {
    resetSelectedGarageForm();

    dialog.value = false;
  };

const onSaveEditDialogBtnClick =
  async () => {
    if (
      selectedGarageForm.value?.id
    ) {
      await updateGarage(
        selectedGarageForm.value
      );
    } else {
      await addGarage(
        selectedGarageForm.value
      );
    }

    dialog.value = false;
  };

const onDeleteBtnClick = async (
  item: GarageViewModel
) => {
  if (!item.id) return;

  const confirmed = confirm(
    `Êtes-vous sûr de vouloir supprimer le garage "${item.name}" ?`
  );

  if (!confirmed) return;

  await archiveGarage(item.id);
};

/**
 * ============================================================
 * LIFECYCLE
 * ============================================================
 */

onMounted(async () => {
  await init();
});
</script>
