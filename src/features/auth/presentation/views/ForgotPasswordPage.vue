<template>
  <AuthLayout
    title="Mot de passe oublié"
    subtitle="Recevez un lien pour réinitialiser votre mot de passe"
  >
    <v-form @submit.prevent="handleForgotPassword">
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
        v-model="email"
        label="Adresse e-mail"
        type="email"
        required
        :rules="[emailRule]"
        class="mb-5"
        density="comfortable"
        hide-details="auto"
        variant="outlined"
        color="primary"
        prepend-inner-icon="mdi-email-outline"
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
        Envoyer le lien
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
import { useForgotPasswordPageDependencies } from '@/features/auth/composition/useForgotPasswordPageDependencies';
import AuthLayout from '@/features/auth/presentation/layouts/AuthLayout.vue';
import { ref } from 'vue';


  const { clientProvider } = useForgotPasswordPageDependencies();
  const supabase = clientProvider.getClient();
  
const email = ref('');
const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const loading = ref(false);

const emailRule = (v: string) => /.+@.+\..+/.test(v) || 'Adresse e-mail invalide';

const handleForgotPassword = async () => {
  if (!email.value) {
    errorMessage.value = "Veuillez entrer votre email.";
    return;
  }

  loading.value = true;
  errorMessage.value = null;
  successMessage.value = null;

  const { error } = await supabase.auth.resetPasswordForEmail(
    email.value,
    { redirectTo: `${window.location.origin}/reset-password` }
  );


  if (error) {
    errorMessage.value = error.message;
  } else {
    successMessage.value = "Un email de réinitialisation vous a été envoyé.";
  }

  loading.value = false;
};
</script>
