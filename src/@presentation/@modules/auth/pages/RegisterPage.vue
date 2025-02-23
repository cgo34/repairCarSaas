<template>
  <AuthLayout>
    <RegisterForm
      v-model:form-data="user"
      :email-rules="emailRules"
      :password-rules="passwordRules"
      @submit="handleRegister"
    />
  </AuthLayout>
</template>
  
  <script setup lang="ts">
//   import Logo from '@/@ui/components/Logo.vue';
  import { useAuthState } from '@/@presentation/@modules/auth/composables/useAuthState';
import RegisterForm from '@modules/auth/components/RegisterForm.vue';
import AuthLayout from '@modules/auth/layouts/AuthLayout.vue';

const { register, user } = useAuthState();

const emailRules = [
  (v: string) => !!v || 'E-mail is required',
  (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
];

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => (v && v.length >= 8) || 'Password must be at least 8 characters'
];

const handleRegister = async () => {
  try {
    await register();
    window.location.href = '/dashboard';
  } catch (error: unknown) {
    alert(error.message);
  }
};
  </script>
  
<style lang="scss">
  .registerBox {
    max-width: 475px;
    margin: 0 auto;
  }
</style>
  