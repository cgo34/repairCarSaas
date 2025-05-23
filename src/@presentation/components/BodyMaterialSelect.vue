<template>
  <GenericSelect
    :model-value="model"
    :items="bodyMaterials"
    :item-title="itemTitle"
    label="Matériau"
    @update:model-value="onSelectBodyMaterial"
    @select="onSelectBodyMaterial"
  />
</template>

<script setup lang="ts">
import GenericSelect from '@/@presentation/components/GenericSelect.vue';
import { BodyMaterialViewModel } from '@/@presentation/types/models/carRepair/BodyMaterialViewModel';
import { defineEmits, defineProps, ref, watch } from 'vue';

const props = defineProps<{
  modelValue?: BodyMaterialViewModel;
  bodyMaterials: BodyMaterialViewModel[];
}>();

const model = ref<BodyMaterialViewModel | undefined>(props.modelValue);
const itemTitle = 'name'
const emit = defineEmits<{
  (e: 'update:modelValue', value: BodyMaterialViewModel | undefined): void;
  (e: 'select', value: BodyMaterialViewModel | undefined): void;
}>();

const onSelectBodyMaterial = (selected: BodyMaterialViewModel | undefined) => {
  model.value = selected;
  emit('update:modelValue', selected);
  emit('select', selected);
};

watch(() => props.modelValue, (newValue) => {
  model.value = newValue;
});
</script>
