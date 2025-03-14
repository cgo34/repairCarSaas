<template>
  <AuthLayout>
    <v-container class="reset-password-container">
      <v-card class="reset-password-card">
        <v-card-title class="text-h5">
          Réinitialisation du mot de passe
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
            v-model="newPassword"
            label="Nouveau mot de passe"
            type="password"
            required
            :rules="[passwordRule]"
          />
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="primary"
            :loading="loading"
            @click="handleResetPassword"
          >
            Réinitialiser le mot de passe
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
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

  const clientProvider = container.get<IClientProvider<SupabaseClient>>(SYMBOLS.Providers.ClientProvider);
  const supabase = clientProvider.getClient();

const route = useRoute();
const router = useRouter();

const token = ref<string | null>(null);
const newPassword = ref('');
const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const loading = ref(false);

const passwordRule = (v: string) => v.length >= 8 || 'Le mot de passe doit contenir au moins 8 caractères';

onMounted(() => {
  const queryToken = route.query.token as string | undefined;
  if (!queryToken) {
    errorMessage.value = "Lien invalide ou expiré.";
    return;
  }
  token.value = queryToken;
});

const handleResetPassword = async () => {
  if (!token.value || !newPassword.value) {
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

<style scoped>
.reset-password-container {
  max-width: 400px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.reset-password-card {
  padding: 20px;
  width: 100%;
}
</style>
