<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn
        class="me-2 text-none"
        color="success"
        prepend-icon="mdi-check-bold"
        variant="flat"
        v-bind="props"
      >
        Finalize
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="(item, index) in items"
        :key="index"
        :value="index"
        @click="onItemClick(item)"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

  
<script setup lang="ts" generic="TModel">
import { defineEmits, defineProps } from 'vue';

// Définition des props
const props = defineProps<{}>();

const items = [
  {
    title: 'Accepted'
  },
  {
    title: 'Refused'
  },
]

// Définition des événements
const emit = defineEmits<{
  (e: 'accepted'): void;
  (e: 'refused'): void;
}>();

// Émet un événement de recherche
const onItemClick = (item) => {
  if (item.title === 'Accepted') {
    emit('accepted')
  } else {
    emit('refused')
  }
};
</script>
