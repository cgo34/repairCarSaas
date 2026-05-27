<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';

onMounted(() => {
  const router = useRouter();
  const authState = container.get<any>(SYMBOLS.States.AuthState);
  if (authState.isAuthenticatedValue) {
    router.replace('/dashboard');
  } else {
    router.replace('/login');
  }
});
</script>

<template>
  <div />
</template>
