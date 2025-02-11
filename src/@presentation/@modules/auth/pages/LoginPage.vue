<template>
  <AuthLayout>
    <AuthForm
      v-model:form-data="user"
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

const { login, user } = useAuthState();  // Accès direct au user state
console.log('user:', user.value);

const emailRules = [
  (v: string) => !!v || 'E-mail is required',
  (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
];

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => (v && v.length >= 8) || 'Password must be at least 8 characters'
];

const handleLogin = async () => {
  try {
    console.log('Attempting to login:', user.value?.email, user.value?.password);
    await login();
    window.location.href = '/dashboard';
  } catch (error: unknown) {
    alert(error.message);
  }
};
</script>
