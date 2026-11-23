<template>
  <AuthLayout>
    <RegisterForm
      v-model:form-data="form"
      :email-rules="emailRules"
      :password-rules="passwordRules"
      @submit="handleRegister"
    />
  </AuthLayout>
</template>

<script setup lang="ts">
import { useAuthState } from '@/features/auth/composition/useAuthState';
import RegisterForm from '@/features/auth/presentation/components/RegisterForm.vue';
import AuthLayout from '@/features/auth/presentation/layouts/AuthLayout.vue';

const { register, form } = useAuthState();

const emailRules = [
  (v: string) => !!v || "L'e-mail est requis",
  (v: string) => /.+@.+\..+/.test(v) || "L'e-mail n'est pas valide"
];

const passwordRules = [
  (v: string) => !!v || 'Le mot de passe est requis',
  (v: string) => (v && v.length >= 8) || 'Le mot de passe doit contenir au moins 8 caractères'
];

const handleRegister = async () => {
  try {
    await register();
    window.location.href = '/dashboard';
  } catch (error: unknown) {
    console.error(error);
  }
};
</script>