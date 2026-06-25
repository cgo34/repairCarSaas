<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  title: string;
  value: number | string;
  amount?: string;
  icon: any;
  color: string;
}>();
</script>

<template>
  <v-card
    elevation="0"
    class="overflow-hidden bubble-shape-sm mb-3"
    :class="`bubble-${color}`"
  >
    <v-card-text class="pa-5">
      <div class="d-flex align-center ga-4">
        <v-btn
          :color="`light${color}`"
          icon
          rounded="sm"
          variant="flat"
        >
          <component
            :is="icon"
            stroke-width="1.5"
            width="25"
            :class="`text-${color}`"
          />
        </v-btn>
        <div>
          <h4 class="text-h4 font-weight-medium">
            {{ value }}
          </h4>
          <span
            v-if="amount"
            class="text-subtitle-1 font-weight-medium"
            :class="`text-${color}`"
          >
            {{ amount }}
          </span>
          <span class="text-subtitle-2 text-disabled font-weight-medium d-block">
            {{ title }}
          </span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>
