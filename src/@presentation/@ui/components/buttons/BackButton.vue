<!-- 📁 @presentation/@ui/components/buttons/BackButton.vue -->
<template>
  <GenericButton
    class="me-2 text-none"
    color="black"
    prepend-icon="mdi-arrow-left"
    variant="flat"
    @click="goBack"
  >
    <slot>Back</slot>
  </GenericButton>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import GenericButton from './GenericButton.vue';

const props = defineProps<{
  fallbackPath?: string
}>()

const router = useRouter()

const goBack = () => {
  if (props.fallbackPath) {
    router.push(props.fallbackPath)
  } else {
    router.back()
  }
}
</script>
