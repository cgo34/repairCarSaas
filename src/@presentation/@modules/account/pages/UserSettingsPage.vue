<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-4"
      style="max-width: 600px;"
    >
      <!-- Header -->
      <div class="d-flex align-center gap-3 mb-6">
        <div>
          <h1 class="text-h5 font-weight-bold mb-1">
            Mon profil
          </h1>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Vos informations personnelles.
          </p>
        </div>
        <v-spacer />
        <v-chip
          v-if="saved"
          color="success"
          variant="tonal"
          prepend-icon="mdi-check"
        >
          Enregistré
        </v-chip>
      </div>

      <!-- Loading -->
      <div
        v-if="profileState.loading.value"
        class="d-flex justify-center align-center"
        style="height: 200px;"
      >
        <v-progress-circular
          indeterminate
          color="primary"
        />
      </div>

      <v-form
        v-else
        ref="formRef"
        @submit.prevent="onSave"
      >
        <!-- Identité -->
        <v-card
          class="mb-4"
          variant="outlined"
        >
          <v-card-title class="text-subtitle-1 font-weight-semibold pa-4 pb-2">
            Identité
          </v-card-title>
          <v-card-text class="pa-4 pt-2">
            <v-row dense>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="form.firstName"
                  label="Prénom"
                  variant="outlined"
                  density="comfortable"
                  clearable
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="form.lastName"
                  label="Nom"
                  variant="outlined"
                  density="comfortable"
                  clearable
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.email"
                  label="Adresse e-mail"
                  type="email"
                  variant="outlined"
                  density="comfortable"
                  :rules="[rules.email]"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Actions -->
        <div class="d-flex justify-end gap-3 mt-4">
          <v-btn
            variant="text"
            @click="resetForm"
          >
            Annuler
          </v-btn>
          <v-btn
            type="submit"
            color="primary"
            variant="flat"
            :loading="profileState.loading.value"
          >
            Enregistrer
          </v-btn>
        </div>
      </v-form>
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { IUseProfileState } from '@/@presentation/types/composables/IUseProfileState';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';

const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
const profileState = container.get<IUseProfileState>(SYMBOLS.States.ProfileState);

const formRef = ref();
const saved = ref(false);

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
});

const rules = {
  email: (v: string) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email invalide',
};

function syncForm() {
  const p = profileState.profile.value;
  if (!p) return;
  form.firstName = p.firstName ?? '';
  form.lastName = p.lastName ?? '';
  form.email = p.email ?? '';
}

function resetForm() {
  syncForm();
  saved.value = false;
}

async function onSave() {
  const { valid } = await formRef.value?.validate();
  if (!valid) return;

  await profileState.save({
    firstName: form.firstName,
    lastName: form.lastName,
    email: form.email,
  });

  saved.value = true;
  setTimeout(() => { saved.value = false; }, 3000);
}

onMounted(async () => {
  const userId = authState.userContext?.value?.id;
  if (!userId) return;
  await profileState.init(userId);
  syncForm();
});
</script>
