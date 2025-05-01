<template>
  <GenericSelect
    :model-value="model"
    :items="bodyParts"
    label="Elément"
    @select="onSelectBodyPart"
  />
</template>

<script setup lang="ts">
import GenericSelect from '@/@presentation/components/GenericSelect.vue';
import { BodyPartViewModel } from '@/@presentation/types/models/carRepair/BodyPartViewModel';
import { defineEmits, defineProps, ref } from 'vue';

const props = defineProps<{
  modelValue?: BodyPartViewModel;
  bodyParts: BodyPartViewModel[];
}>();

const model = ref<BodyPartViewModel | undefined>(props.modelValue);

const emit = defineEmits<{
  (e: 'update:modelValue', value: BodyPartViewModel | undefined): void;
  (e: 'select', value: BodyPartViewModel | undefined): void;
}>();

const onSelectBodyPart = (selected: BodyPartViewModel | undefined) => {
  model.value = selected;
  emit('update:modelValue', selected);
  emit('select', selected);
};

// watch(() => props.modelValue, (newValue) => {
//   model.value = newValue;
// });
</script>
