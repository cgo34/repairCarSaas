<template>
  <AuthLayout>
    <AuthForm
      v-model:form-data="form"
      :email-rules="emailRules"
      :password-rules="passwordRules"
      @submit="handleLogin"
    />
  </AuthLayout>
</template>

<script setup lang="ts">
import { useAuthState } from '@/@presentation/@modules/auth/composables/useAuthState';
import AuthForm from '@modules/auth/components/AuthForm.vue';
import AuthLayout from '@modules/auth/layouts/AuthLayout.vue';

const { login, form } = useAuthState();

const emailRules = [
  (v: string) => !!v || "L'e-mail est requis",
  (v: string) => /.+@.+\..+/.test(v) || "L'e-mail n'est pas valide"
];

const passwordRules = [
  (v: string) => !!v || 'Le mot de passe est requis',
  (v: string) => (v && v.length >= 8) || 'Le mot de passe doit contenir au moins 8 caractères'
];

const handleLogin = async () => {
  try {
    await login();
    window.location.href = '/dashboard';
  } catch (error: unknown) {
    alert((error as Error).message);
  }
};
</script>