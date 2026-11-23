<template>
  <div class="mb-4">
    <h1 class="text-h4 font-weight-bold mb-1">
      {{ title }}
    </h1>

    <div
      v-if="subtitle"
      class="text-body-1 text-medium-emphasis"
    >
      {{ subtitle }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, default: undefined },
  subtitle: { type: String, default: undefined },
});
</script>