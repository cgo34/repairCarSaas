<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-0"
      style="max-width: 600px;"
    >
      <!-- Header -->
      <div class="d-flex align-center gap-3 mb-6">
        <div>
          <h1 class="text-h5 font-weight-bold mb-1">
            {{ t('account.profile.title') }}
          </h1>
          <p class="text-body-2 text-medium-emphasis mb-0">
            {{ t('account.profile.subtitle') }}
          </p>
        </div>
        <v-spacer />
        <v-chip
          v-if="saved"
          color="success"
          variant="tonal"
          prepend-icon="mdi-check"
        >
          {{ t('common.saved') }}
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
            {{ t('account.profile.identity') }}
          </v-card-title>
          <v-card-text class="pa-4 pt-2">
            <v-row dense>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="form.firstName"
                  :label="t('account.profile.firstName')"
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
                  :label="t('account.profile.lastName')"
                  variant="outlined"
                  density="comfortable"
                  clearable
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.email"
                  :label="t('account.profile.email')"
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
            {{ t('common.cancel') }}
          </v-btn>
          <v-btn
            type="submit"
            color="primary"
            variant="flat"
            :loading="profileState.loading.value"
          >
            {{ t('common.save') }}
          </v-btn>
        </div>
      </v-form>
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { useUserSettingsPageDependencies } from '@/features/account/composition/useUserSettingsPageDependencies';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import MainLayout from '@/app/layouts/MainLayout.vue';

const { t } = useI18n();
const { authState, profileState } = useUserSettingsPageDependencies();

const formRef = ref();
const saved = ref(false);

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
});

const rules = {
  email: (v: string) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || t('common.invalidEmail'),
};

function syncForm() {
  const p = profileState.profile.value;
  if (!p) return;
  form.firstName = p.first_name ?? '';
  form.lastName = p.last_name ?? '';
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
    first_name: form.firstName,
    last_name: form.lastName,
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
