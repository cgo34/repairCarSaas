<template>
  <v-select
    :model-value="model"
    :items="filteredItems"
    :label="label"
    item-title="name"
    return-object
    clearable
    @update:model-value="onSelectItem"
    @click:clear="onClearItem"
    @focus="emit('focus')"
    @blur="emit('blur')"
  >
    <template #prepend-item>
      <v-list-item>
        <v-text-field
          v-model="searchQuery"
          label="Rechercher"
          clearable
          @input="onSearch"
        />
      </v-list-item>
    </template>
  </v-select>
</template>

<script setup lang="ts" generic="TModel">
import { computed, defineEmits, defineProps, ref } from 'vue';

// Définition des props
const props = defineProps<{
  modelValue?: TModel | undefined;
  items: TModel[];
  label: string;
}>();

// Stocke la valeur sélectionnée localement
const model = ref<TModel | undefined>(props.modelValue);

// Définition des événements
const emit = defineEmits<{
  (e: 'update:modelValue', value: TModel | undefined): void;
  (e: 'select', value: TModel | undefined): void;
  (e: 'search', value: string): void;
  (e: 'clear'): void;
  (e: 'focus'): void;
  (e: 'blur'): void;
}>();

// Gestion de la recherche
const searchQuery = ref('');
const filteredItems = computed(() => {
  if (!searchQuery.value) return props.items;
  return props.items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const onClearItem = () => {
  model.value = undefined;
  emit('update:modelValue', undefined);
  emit('clear');
};

// Met à jour la valeur sélectionnée
const onSelectItem = (selected: TModel | undefined) => {
  model.value = selected;
  emit('update:modelValue', selected);
  emit('select', selected);
};

// Émet un événement de recherche
const onSearch = () => {
  emit('search', searchQuery.value);
};

// Met à jour le modèle local si `modelValue` change depuis l'extérieur
// watch(() => props.modelValue, (newValue) => {
//   model.value = newValue;
// });
</script>
