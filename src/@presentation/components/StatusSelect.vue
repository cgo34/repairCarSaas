<template>
  <GenericSelect
    :model-value="model"
    :items="status"
    label="Pays"
    @select="onSelectStatus"
    @clear="onClearStatus"
  />
</template>

<script setup lang="ts">
import GenericSelect from '@/@presentation/components/GenericSelect.vue';
import { StatusViewModel } from '@/@presentation/types/models/StatusViewModel';
import { defineEmits, defineProps, ref } from 'vue';

const props = defineProps<{
  modelValue?: StatusViewModel;
}>();

const status = ref<StatusViewModel[]>([
  {
    id: 1,
    name: 'Processing',
    code: 'processing',
  },
  {
    id: 2,
    name: 'Finalize',
    code: 'processing',
  },
]);
const model = ref<StatusViewModel | undefined>(props.modelValue ?? status.value[0]);

const emit = defineEmits<{
  (e: 'update:modelValue', value: StatusViewModel | undefined): void;
  (e: 'select', value: StatusViewModel | undefined): void;
}>();

const onClearStatus = () => {
  model.value = undefined;
  emit('update:modelValue', undefined);
};

const onSelectStatus = (selected: StatusViewModel | undefined) => {
  if (!selected) {
    return '';
  }

  model.value = selected;

  emit('update:modelValue', selected);
  emit('select', selected);
};
</script>
