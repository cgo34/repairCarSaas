<template>
  <v-form @submit.prevent="$emit('submit')">
    <v-text-field
      v-model="formData.email"
      :rules="emailRules"
      label="Adresse e-mail"
      class="mb-4"
      required
      density="comfortable"
      hide-details="auto"
      variant="outlined"
      color="primary"
      prepend-inner-icon="mdi-email-outline"
    />

    <v-text-field
      v-model="formData.password"
      :rules="passwordRules"
      label="Mot de passe"
      required
      density="comfortable"
      variant="outlined"
      color="primary"
      hide-details="auto"
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
      style="font-family:'Manrope',sans-serif; font-weight:600; letter-spacing:0.01em;"
    >
      Se connecter
    </v-btn>
  </v-form>

  <div class="mt-5">
    <v-divider class="mb-4" />
    <div class="d-flex align-center justify-space-between">
      <v-btn
        variant="text"
        color="primary"
        size="small"
        @click="$router.push('/forgot-password')"
      >
        Mot de passe oublié ?
      </v-btn>
      <v-btn
        variant="text"
        color="default"
        size="small"
        to="/register"
        style="color:#9AA2B1;"
      >
        Pas encore de compte ?
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineModel, defineProps, ref } from 'vue';

defineProps({
  emailRules: Array,
  passwordRules: Array
});

defineEmits(['submit']);

const formData = defineModel('formData', { required: true });

const showPassword = ref(false);
</script>