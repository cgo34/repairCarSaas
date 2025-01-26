<template>
    <v-form @submit.prevent="$emit('submit')" class="mt-7 registerForm">
      <v-text-field
        v-model="formData.fullName"
        label="Full Name"
        :rules="fullNameRules"
        required
        density="comfortable"
        hide-details="auto"
        variant="outlined"
        color="primary"
      ></v-text-field>
  
      <v-text-field
        v-model="formData.email"
        label="Email"
        :rules="emailRules"
        required
        density="comfortable"
        hide-details="auto"
        variant="outlined"
        color="primary"
      ></v-text-field>
  
      <v-text-field
        v-model="formData.password"
        label="Password"
        type="password"
        :rules="passwordRules"
        required
        density="comfortable"
        hide-details="auto"
        variant="outlined"
        color="primary"
      ></v-text-field>
  
      <v-btn color="secondary" :loading="loading" block class="mt-2" variant="flat" size="large" type="submit">
        Sign Up
      </v-btn>
  
      <div v-if="errorMessage" class="mt-2">
        <v-alert color="error">{{ errorMessage }}</v-alert>
      </div>
    </v-form>
  
    <div class="mt-5 text-right">
      <v-divider />
      <v-btn variant="plain" to="/login" class="mt-2 text-capitalize mr-n2">Already have an account?</v-btn>
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
  
  <style lang="scss">
  .registerForm {
    .v-text-field .v-field--active input {
      font-weight: 500;
    }
  }
  </style>
  