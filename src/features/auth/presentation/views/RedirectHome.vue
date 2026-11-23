<script setup lang="ts">
import { useRedirectHomeDependencies } from '@/features/auth/composition/useRedirectHomeDependencies';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

onMounted(() => {
  const router = useRouter();
  const { authState } = useRedirectHomeDependencies();
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
