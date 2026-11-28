<template>
  <AuthLayout
    title="Nouveau mot de passe"
    subtitle="Choisissez un nouveau mot de passe pour votre compte"
  >
    <v-form @submit.prevent="handleResetPassword">
      <v-alert
        v-if="errorMessage"
        type="error"
        variant="tonal"
        density="comfortable"
        class="mb-4"
      >
        {{ errorMessage }}
      </v-alert>
      <v-alert
        v-if="successMessage"
        type="success"
        variant="tonal"
        density="comfortable"
        class="mb-4"
      >
        {{ successMessage }}
      </v-alert>

      <v-text-field
        v-model="newPassword"
        label="Nouveau mot de passe"
        required
        :rules="[passwordRule]"
        density="comfortable"
        variant="outlined"
        color="primary"
        hide-details="auto"
        prepend-inner-icon="mdi-lock-outline"
        :append-inner-icon="showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
        :type="showPassword ? 'text' : 'password'"
        class="mb-5"
        @click:append-inner="showPassword = !showPassword"
      />

      <v-btn
        color="primary"
        block
        variant="flat"
        size="large"
        type="submit"
        rounded="lg"
        :loading="loading"
        style="font-family:Manrope,sans-serif; font-weight:600; letter-spacing:0.01em;"
      >
        Réinitialiser le mot de passe
      </v-btn>
    </v-form>

    <div class="mt-5">
      <v-divider class="mb-4" />
      <div class="d-flex justify-center">
        <v-btn
          variant="text"
          color="primary"
          size="small"
          to="/login"
          prepend-icon="mdi-arrow-left"
        >
          Retour à la connexion
        </v-btn>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { useResetPasswordPageDependencies } from '@/features/auth/composition/useResetPasswordPageDependencies';
import AuthLayout from '@/features/auth/presentation/layouts/AuthLayout.vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

  const { clientProvider } = useResetPasswordPageDependencies();
  const supabase = clientProvider.getClient();

const router = useRouter();

const hasRecoverySession = ref(false);
const newPassword = ref('');
const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const loading = ref(false);
const showPassword = ref(false);

const passwordRule = (v: string) => v.length >= 8 || 'Le mot de passe doit contenir au moins 8 caractères';

// The email link carries the recovery session in the URL; the Supabase client
// (detectSessionInUrl) turns it into a session, which authorizes updateUser.
onMounted(async () => {
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const linkError = hashParams.get('error_description');
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    errorMessage.value = linkError
      ? `Lien invalide ou expiré (${linkError.replace(/\+/g, ' ')}).`
      : "Lien invalide ou expiré.";
    return;
  }
  hasRecoverySession.value = true;
});

const handleResetPassword = async () => {
  if (!hasRecoverySession.value || !newPassword.value) {
    errorMessage.value = "Veuillez fournir un mot de passe valide.";
    return;
  }

  loading.value = true;
  errorMessage.value = null;
  successMessage.value = null;

  const { error } = await supabase.auth.updateUser({ password: newPassword.value });

  if (error) {
    errorMessage.value = error.message;
  } else {
    successMessage.value = "Mot de passe mis à jour avec succès. Redirection en cours...";
    setTimeout(() => router.push('/login'), 3000);
  }

  loading.value = false;
};
</script>
