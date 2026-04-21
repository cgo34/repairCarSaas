<template>
  <v-dialog
    v-bind="dialogAttrs"
    v-model="visible"
  >
    <template #default="{ isActive }">
      <v-card>
        <v-card-title v-if="title">
          {{ title }}
        </v-card-title>

        <v-card-text>
          <slot :is-active="isActive" />
        </v-card-text>

        <v-card-actions v-if="$slots.actions">
          <slot
            name="actions"
            :is-active="isActive"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, defineExpose, ref } from 'vue';

const props = defineProps<{
  title?: string
  maxWidth?: string | number
  activator?: string | Element
  persistent?: boolean
}>()

const visible = ref(false)

const dialogAttrs = computed(() => ({
  persistent: props.persistent ?? false,
  activator: props.activator,
  'max-width': props.maxWidth ?? 600,
}))

function open(): void {
  visible.value = true
}

function close(): void {
  visible.value = false
}

defineExpose({ open, close })
</script>
