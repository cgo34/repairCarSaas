<template>
  <v-form @submit.prevent="$emit('submit')">
    <v-text-field
      v-model="formData.fullName"
      label="Nom complet"
      :rules="[(v) => !!v || 'Le nom est requis']"
      required
      density="comfortable"
      hide-details="auto"
      variant="outlined"
      color="primary"
      prepend-inner-icon="mdi-account-outline"
      class="mb-4"
    />

    <v-text-field
      v-model="formData.email"
      label="Adresse e-mail"
      :rules="emailRules"
      required
      density="comfortable"
      hide-details="auto"
      variant="outlined"
      color="primary"
      prepend-inner-icon="mdi-email-outline"
      class="mb-4"
    />

    <v-text-field
      v-model="formData.password"
      label="Mot de passe"
      :rules="passwordRules"
      required
      density="comfortable"
      hide-details="auto"
      variant="outlined"
      color="primary"
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
      style="font-family:'Manrope',sans-serif; font-weight:600; letter-spacing:0.01em;"
    >
      Créer mon compte
    </v-btn>
  </v-form>

  <div class="mt-5">
    <v-divider class="mb-4" />
    <div class="text-center">
      <v-btn
        variant="text"
        color="primary"
        size="small"
        to="/login"
      >
        Déjà un compte ? Se connecter
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