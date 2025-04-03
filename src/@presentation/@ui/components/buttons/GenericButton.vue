<template>
  <v-btn
    v-bind="props"
    @click="emit('click')"
  >
    <slot />
  </v-btn>
</template>

<script setup lang="ts">
const props = defineProps<{
  color?: string
  variant?: 'flat' | 'outlined' | 'text' | 'tonal' | 'elevated' | 'plain'
  icon?: string
  prependIcon?: string
  appendIcon?: string
  disabled?: boolean
  class?: string
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>
