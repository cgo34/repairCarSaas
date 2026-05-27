<template>
  <div class="mb-4">
    <h1 class="text-h4 font-weight-bold mb-1">
      {{ title }}
    </h1>

    <div
      v-if="subtitle"
      class="text-body-1 text-medium-emphasis mb-4"
    >
      {{ subtitle }}
    </div>

    <v-breadcrumbs
      :items="breadcrumbs"
      class="pa-0"
    >
      <template #prepend>
        <v-icon
          icon="mdi-home"
          size="small"
          class="mr-2 text-primary"
        />
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script setup lang="ts">
import { ChevronRightIcon } from 'vue-tabler-icons';

type Breadcrumb = {
  title: string;
  disabled: boolean;
  href: string;
};

const props = defineProps({
  title: String,
  subtitle: String,
  breadcrumbs: Array as () => Breadcrumb[],
});
</script>