<template>
  <MainLayout>
    <!-- Superposition si l'utilisateur est en plan 'free' -->
    <SubscriptionOverlay v-if="isFreePlan" />
    <v-container
      fluid
      class="pa-0"
    >
      <v-row>
        {{ selectedUser }}
        <v-data-table
          :headers="headers"
          :items="users"
          :sort-by="[{ key: 'full_name', order: 'asc' }]"
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
                            v-model="selectedUser.full_name"
                            label="Nom Complet"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="selectedUser.email"
                            label="Email"
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                        >
                          <v-select
                            v-model="selectedUser.role"
                            :items="roleOptions"
                            item-title="label"
                            item-value="value"
                            label="Rôle"
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                        >
                          <v-text-field
                            v-model.number="selectedUser.percentageCommission"
                            label="Commission (%)"
                            type="number"
                            min="0"
                            max="100"
                            suffix="%"
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

          <!-- #REGION -> ROLE CHIP -->
          <template #item.role="{ item }">
            <v-chip
              :color="roleColor(item.role)"
              size="small"
              label
            >
              {{ roleLabel(item.role) }}
            </v-chip>
          </template>
          <!-- #ENDREGION -->

          <!-- #REGION -> COMMISSION -->
          <template #item.percentageCommission="{ item }">
            {{ item.percentageCommission ? `${item.percentageCommission} %` : '—' }}
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
import { useUsersPageDependencies } from '@/features/users/composition/useUsersPageDependencies';
import SubscriptionOverlay from '@/features/subscription/presentation/components/SubscriptionOverlay.vue';
import MainLayout from '@/app/layouts/MainLayout.vue';
import { UserViewModel } from '@/features/users/presentation/models/UserViewModel';
import { computed, onMounted, ref } from 'vue';

// Injection du state depuis Inversify
  const { useUserState, authState } = useUsersPageDependencies();
const { isFreePlan } = authState


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
  { title: 'Nom Complet', align: 'start', key: 'full_name' },
  { title: 'Email', key: 'email' },
  { title: 'Rôle', key: 'role', sortable: false },
  { title: 'Commission', key: 'percentageCommission', sortable: false },
  { title: 'Actions', sortable: false, key: 'actions' },
] as const;

const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'Garage', value: 'garage' },
  { label: 'Technicien', value: 'technician' },
  { label: 'Technicien indépendant', value: 'independant_technician' },
  { label: 'Utilisateur', value: 'user' },
];

const roleLabel = (role?: string) => roleOptions.find(r => r.value === role)?.label ?? role ?? '—';

const roleColor = (role?: string) => {
  switch (role) {
    case 'admin': return 'red';
    case 'garage': return 'blue';
    case 'technician': return 'green';
    case 'independant_technician': return 'orange';
    default: return 'grey';
  }
};

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

  const confirmed = confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${item.full_name}" ?`);
  if (!confirmed) return;

  await deleteUser(item.id);
};

onMounted(async () => {
  await init();
});
</script>
