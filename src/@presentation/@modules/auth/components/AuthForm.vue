<template>
  <v-form @submit.prevent="$emit('submit')" class="mt-7 loginForm">
    <v-text-field
      v-model="formData.email"
      :rules="emailRules"
      label="Email Address"
      class="mt-4 mb-8"
      required
      density="comfortable"
      hide-details="auto"
      variant="outlined"
      color="primary"
    ></v-text-field>

    <v-text-field
      v-model="formData.password"
      :rules="passwordRules"
      label="Password"
      required
      density="comfortable"
      variant="outlined"
      color="primary"
      hide-details="auto"
      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :type="showPassword ? 'text' : 'password'"
      @click:append="showPassword = !showPassword"
      class="pwdInput"
    ></v-text-field>

    <v-btn color="secondary" block class="mt-2" variant="flat" size="large" type="submit">
      Sign In
    </v-btn>
  </v-form>

  <div class="mt-5 text-right">
    <v-divider />
    <v-btn variant="plain" to="/register" class="mt-2 text-capitalize mr-n2">Don't have an account?</v-btn>
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
