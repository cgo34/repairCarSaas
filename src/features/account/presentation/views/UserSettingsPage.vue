<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-0"
      style="max-width: 1100px;"
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

      <v-row v-else>
        <v-col
          cols="12"
          md="6"
        >
          <v-form
            ref="formRef"
            class="h-100"
            @submit.prevent="onSave"
          >
            <!-- Identité -->
            <v-card
              flat
              border
              class="pa-5 h-100 d-flex flex-column"
            >
              <div class="text-subtitle-1 font-weight-bold mb-4 d-flex align-center ga-2">
                <v-icon
                  size="20"
                  color="primary"
                >
                  mdi-account-outline
                </v-icon>
                {{ t('account.profile.identity') }}
              </div>
              <v-card-text class="pa-0">
                <v-row dense>
                  <v-col
                    cols="12"
                    class="mb-3"
                  >
                    <v-text-field
                      v-model="form.email"
                      :label="t('account.profile.email')"
                      :hint="t('account.profile.emailReadonly')"
                      persistent-hint
                      type="email"
                      variant="outlined"
                      density="comfortable"
                      readonly
                      disabled
                    />
                  </v-col>
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
                      v-model="form.fullName"
                      :label="t('account.profile.fullName')"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="form.phone"
                      :label="t('account.profile.phone')"
                      type="tel"
                      variant="outlined"
                      density="comfortable"
                      clearable
                    />
                  </v-col>
                </v-row>
              </v-card-text>

              <v-spacer />
              <v-divider class="my-4" />
              <div class="d-flex justify-end ga-3">
                <v-btn
                  variant="text"
                  class="text-none"
                  @click="resetForm"
                >
                  {{ t('common.cancel') }}
                </v-btn>
                <v-btn
                  type="submit"
                  color="primary"
                  variant="flat"
                  class="text-none"
                  :loading="profileState.loading.value"
                >
                  {{ t('common.save') }}
                </v-btn>
              </div>
            </v-card>
          </v-form>
        </v-col>

        <!-- Sécurité -->
        <v-col
          cols="12"
          md="6"
        >
          <v-card
            flat
            border
            class="pa-5 h-100 d-flex flex-column"
          >
            <div class="text-subtitle-1 font-weight-bold mb-4 d-flex align-center ga-2">
              <v-icon
                size="20"
                color="primary"
              >
                mdi-shield-lock-outline
              </v-icon>
              {{ t('account.security.title') }}
            </div>
            <v-card-text class="pa-0">
              <v-form
                ref="pwdFormRef"
                @submit.prevent="onChangePassword"
              >
                <v-text-field
                  v-model="pwd.current"
                  :label="t('account.security.currentPassword')"
                  :type="showPwd.current ? 'text' : 'password'"
                  :append-inner-icon="showPwd.current ? 'mdi-eye-off' : 'mdi-eye'"
                  variant="outlined"
                  density="comfortable"
                  autocomplete="current-password"
                  :rules="[pwdRules.required]"
                  :error-messages="pwdError"
                  @click:append-inner="showPwd.current = !showPwd.current"
                />
                <v-text-field
                  v-model="pwd.next"
                  :label="t('account.security.newPassword')"
                  :type="showPwd.next ? 'text' : 'password'"
                  :append-inner-icon="showPwd.next ? 'mdi-eye-off' : 'mdi-eye'"
                  variant="outlined"
                  density="comfortable"
                  autocomplete="new-password"
                  :rules="[pwdRules.required, pwdRules.min]"
                  hide-details
                  @click:append-inner="showPwd.next = !showPwd.next"
                />
                <div class="d-flex ga-1 mt-2">
                  <div
                    v-for="i in 4"
                    :key="i"
                    class="flex-1-1 rounded"
                    style="height: 4px;"
                    :class="i <= strength.segments ? `bg-${strength.color}` : 'bg-grey-lighten-2'"
                  />
                </div>
                <div
                  class="text-caption mt-1 mb-4"
                  :class="pwd.next && !pwdRules.valid(pwd.next) ? 'text-error' : 'text-medium-emphasis'"
                >
                  {{ t('account.security.tooShort') }}
                </div>
                <v-text-field
                  v-model="pwd.confirm"
                  :label="t('account.security.confirmPassword')"
                  :type="showPwd.confirm ? 'text' : 'password'"
                  :append-inner-icon="showPwd.confirm ? 'mdi-eye-off' : 'mdi-eye'"
                  variant="outlined"
                  density="comfortable"
                  autocomplete="new-password"
                  :rules="[pwdRules.required, pwdRules.match]"
                  @click:append-inner="showPwd.confirm = !showPwd.confirm"
                />
                <router-link
                  to="/forgot-password"
                  class="text-caption text-decoration-none text-primary d-inline-block mb-2"
                >
                  {{ t('account.security.forgot') }}
                </router-link>
                <v-divider class="mb-4" />
                <div class="d-flex justify-end">
                  <v-btn
                    type="submit"
                    color="primary"
                    variant="flat"
                    class="text-none"
                    :loading="pwdLoading"
                  >
                    {{ t('account.security.submit') }}
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { useUserSettingsPageDependencies } from '@/features/account/composition/useUserSettingsPageDependencies';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import MainLayout from '@/app/layouts/MainLayout.vue';

const { t } = useI18n();
const { authState, profileState } = useUserSettingsPageDependencies();

const formRef = ref();
const pwdFormRef = ref();
const saved = ref(false);
const pwdLoading = ref(false);
const pwdError = ref('');

const form = reactive({
  firstName: '',
  lastName: '',
  fullName: '',
  phone: '',
  email: '',
});

const pwd = reactive({ current: '', next: '', confirm: '' });
const showPwd = reactive({ current: false, next: false, confirm: false });

const pwdRules = {
  required: (v: string) => !!v || t('account.security.required'),
  valid: (v: string) => /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(v ?? ''),
  min: (v: string) => pwdRules.valid(v) || t('account.security.tooShort'),
  match: (v: string) => v === pwd.next || t('account.security.mismatch'),
};

const strength = computed(() => {
  const p = pwd.next;
  let score = 0;
  if (p.length >= 8) score++;
  if (p.length >= 12) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/\d/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  score = Math.min(score, 4);
  const color = score <= 1 ? 'error' : score === 2 ? 'warning' : 'success';
  return { segments: score, color };
});

function syncForm() {
  const p = profileState.profile.value;
  if (!p) return;
  form.firstName = p.first_name ?? '';
  form.lastName = p.last_name ?? '';
  form.fullName = p.full_name ?? '';
  form.phone = p.phone ?? '';
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
    full_name: form.fullName,
    phone: form.phone || null,
  });

  saved.value = true;
  setTimeout(() => { saved.value = false; }, 3000);
}

async function onChangePassword() {
  pwdError.value = '';
  const { valid } = await pwdFormRef.value?.validate();
  if (!valid) return;

  pwdLoading.value = true;
  try {
    await profileState.changePassword(pwd.current, pwd.next);
    pwd.current = pwd.next = pwd.confirm = '';
    pwdFormRef.value?.resetValidation();
    saved.value = true;
    setTimeout(() => { saved.value = false; }, 3000);
  } catch (e) {
    pwdError.value = (e as Error).message === 'INVALID_CURRENT_PASSWORD'
      ? t('account.security.invalidCurrent')
      : (e as Error).message;
  } finally {
    pwdLoading.value = false;
  }
}

onMounted(async () => {
  const userId = authState.userContext?.value?.id;
  if (!userId) return;
  await profileState.init(userId);
  syncForm();
});
</script>
