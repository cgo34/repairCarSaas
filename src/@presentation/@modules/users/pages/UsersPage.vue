<template>
  <MainLayout>
    <v-container fluid>
      <v-row>
        <v-data-table
          :headers="headers"
          :items="users"
          :sort-by="[{ key: 'fullName', order: 'asc' }]"
        >
          <!-- #REGION -> TOP BAR -->
          <template #top>
            <v-toolbar flat>
              <v-toolbar-title>Gestion des Utilisateurs</v-toolbar-title>
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
                    Ajouter un Utilisateur
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
                            v-model="selectedUser.fullName"
                            label="Nom Complet"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="selectedUser.email"
                            label="Email"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="selectedUser.password"
                            label="Mot de passe"
                            type="password"
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
import { IUseUserState } from '@/@presentation/types/composables/IUseUserState';
import { UserViewModel } from '@/@presentation/types/models/UserViewModel';
import { computed, onMounted, ref } from 'vue';

// Injection du state depuis Inversify
const useUserState = container.get<IUseUserState>(SYMBOLS.States.UserState);

const {
  users,
  selectedUser,
  init,
  selectUser,
  addUser,
  updateUser,
  deleteUser,
  resetSelectedUser
} = useUserState;

const dialog = ref<boolean>(false);

const headers = [
  { title: 'Nom Complet', align: 'start', key: 'fullName' },
  { title: 'Email', key: 'email' },
  { title: 'Actions', sortable: false, key: 'actions' }
] as const;

const formTitle = computed(() => (selectedUser.value?.id ? "Modifier l'Utilisateur" : 'Nouvel Utilisateur'));

const onEditBtnClick = (item: UserViewModel) => {
  selectUser(item);
  dialog.value = true;
};

const onCloseEditDialogBtnClick = () => {
  resetSelectedUser();
  dialog.value = false;
};

const onSaveEditDialogBtnClick = async () => {
  if (selectedUser.value?.id) await updateUser(selectedUser.value);
  else await addUser(selectedUser.value);
  dialog.value = false;
};

const onDeleteBtnClick = async (item: UserViewModel) => {
  if (!item.id) return;

  const confirmed = confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${item.fullName}" ?`);
  if (!confirmed) return;

  await deleteUser(item.id);
};

onMounted(async () => {
  await init();
});
</script>
