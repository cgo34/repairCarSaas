<template>
  <AuthLayout>
    <v-container class="forgot-password-container">
      <v-card class="forgot-password-card">
        <v-card-title class="text-h5">
          Mot de passe oublié
        </v-card-title>

        <v-card-text>
          <v-alert
            v-if="errorMessage"
            type="error"
          >
            {{ errorMessage }}
          </v-alert>
          <v-alert
            v-if="successMessage"
            type="success"
          >
            {{ successMessage }}
          </v-alert>

          <v-text-field
            v-model="email"
            label="Adresse e-mail"
            type="email"
            required
            :rules="[emailRule]"
          />
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="primary"
            :loading="loading"
            @click="handleForgotPassword"
          >
            Envoyer le lien de réinitialisation
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </AuthLayout>
</template>

<script setup lang="ts">
import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import AuthLayout from '@modules/auth/layouts/AuthLayout.vue';
import { ref } from 'vue';


const clientProvider = container.get<IClientProvider<SupabaseClient>>(SYMBOLS.Providers.ClientProvider);
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
    'http://localhost:3000/reset-password'
  );


  if (error) {
    errorMessage.value = error.message;
  } else {
    successMessage.value = "Un email de réinitialisation vous a été envoyé.";
  }

  loading.value = false;
};
</script>

<style scoped>
.forgot-password-container {
  max-width: 400px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.forgot-password-card {
  padding: 20px;
  width: 100%;
}
</style>
