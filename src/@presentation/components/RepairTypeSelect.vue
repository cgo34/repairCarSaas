<template>
  <GenericSelect
    :model-value="model"
    :items="repairTypes"
    label="Sélectionner un type de réparation"
    @update:model-value="onSelectRepairType"
    @select="onSelectRepairType"
  />
</template>

<script setup lang="ts">
import GenericSelect from '@/@presentation/components/GenericSelect.vue';
import { RepairTypeViewModel } from '@/@presentation/types/models/RepairTypeViewModel';
import { defineEmits, defineProps, ref, watch } from 'vue';

const props = defineProps<{
  modelValue?: RepairTypeViewModel;
  repairTypes: RepairTypeViewModel[];
}>();

const model = ref<RepairTypeViewModel | undefined>(props.modelValue);

const emit = defineEmits<{
  (e: 'update:modelValue', value: RepairTypeViewModel | undefined): void;
  (e: 'select', value: RepairTypeViewModel | undefined): void;
}>();

const onSelectRepairType = (selected: RepairTypeViewModel | undefined) => {
  model.value = selected;
  emit('update:modelValue', selected);
  emit('select', selected);
};

watch(() => props.modelValue, (newValue) => {
  model.value = newValue;
});
</script>
