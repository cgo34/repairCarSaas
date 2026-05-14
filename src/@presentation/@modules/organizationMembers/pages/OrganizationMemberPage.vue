<template>
  <MainLayout>
    <!-- Superposition si l'utilisateur est en plan 'free' -->
    <SubscriptionOverlay v-if="isFreePlan" />
    <v-container fluid>
      <v-row>
        <v-data-table
          :headers="headers"
          :items="members"
          :sort-by="[{ key: 'fullName', order: 'asc' }]"
        >
          <!-- #REGION -> TOP BAR -->
          <template #top>
            <v-toolbar flat>
              <v-toolbar-title>Gestion des membres</v-toolbar-title>
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
                    Ajouter un Membre
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="6">
                          <v-text-field
                            v-model="selectedMemberForm.first_name"
                            label="Prénom"
                          />
                        </v-col>
                        <v-col cols="6">
                          <v-text-field
                            v-model="selectedMemberForm.last_name"
                            label="Nom"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="selectedMemberForm.email"
                            label="Email"
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                        >
                          <v-select
                            v-model="selectedMemberForm.role"
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
                            v-model.number="selectedMemberForm.percentage_commission"
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
          <template #item.percentage_commission="{ item }">
            {{ item.percentage_commission ? `${item.percentage_commission} %` : '—' }}
          </template>
          <!-- #ENDREGION -->

          <!-- #REGION -> STATUS -->
          <template #item.status="{ item }">
            <v-chip
              :color="getStatusColor(item.status)"
              size="small"
              label
            >
              {{ item.status }}
            </v-chip>
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
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import SubscriptionOverlay from '@/@presentation/@ui/components/SubscriptionOverlay.vue';
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';
import { IUseOrganizationMember } from '@/@presentation/types/composables/IUseOrganizationMember';
import { OrganizationMemberViewModel } from '@/@presentation/types/models/organizations/OrganizationMemberViewmodel';
import { computed, onMounted, ref } from 'vue';

// Injection du state depuis Inversify
const useOrganizationMember = container.get<IUseOrganizationMember>(SYMBOLS.States.OrganizationMemberState);
const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
const { isFreePlan } = authState


const {
  members,
  selectedMemberForm,

  init,

  selectMember,

  addMember,
  updateMember,
  archiveMember,

  resetSelectedMemberForm,
} = useOrganizationMember;

const dialog = ref<boolean>(false);

const headers = [
  { title: 'Prénom', align: 'start', key: 'users.first_name' },
  { title: 'Nom', align: 'start', key: 'users.last_name' },
  { title: 'Email', key: 'users.email' },
  { title: 'Rôle', key: 'role', sortable: false },
  { title: 'Commission', key: 'percentage_commission', align: 'end', sortable: false },
  { title: 'Statut', key: 'status', sortable: false },
  { title: 'Actions', sortable: false, key: 'actions' },
] as const;

const roleOptions = [
  { label: 'Technicien', value: 'technician' }
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

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'pending': return 'orange';
    case 'active': return 'green';
    case 'archived': return 'grey';
    case 'blocked': return 'red';
    default: return 'grey';
  }
};

const formTitle = computed(() =>
  selectedMemberForm.value?.id
    ? 'Modifier le membre'
    : 'Nouveau membre'
);

const onEditBtnClick = (item: OrganizationMemberViewModel) => {
  console.log('edit user with id:', item);
  selectMember(item);
  dialog.value = true;
};

const onCloseEditDialogBtnClick = () => {
  resetSelectedMemberForm();
  dialog.value = false;
};

const onSaveEditDialogBtnClick = async () => {
  if (selectedMemberForm.value?.id) await updateMember(selectedMemberForm.value);
  else await addMember(selectedMemberForm.value);
  dialog.value = false;
};

const onDeleteBtnClick = async (item: OrganizationMemberViewModel) => {
  if (!item.id) return;

  console.log('delete member with id:', item.id);

  const confirmed = confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${item.users.first_name} ${item.users.last_name}" ?`);
  if (!confirmed) return;

  await archiveMember(item.id);
};

onMounted(async () => {
  await init();
});
</script>
