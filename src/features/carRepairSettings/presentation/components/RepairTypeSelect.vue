<template>
  <GenericSelect
    :model-value="modelValue"
    :items="repairTypes"
    label="Réparation"
    :item-title="itemTitle"
    @update:model-value="onSelectRepairType"
    @select="onSelectRepairType"
  />
</template>

<script setup lang="ts">
import GenericSelect from '@/shared/presentation/ui/components/GenericSelect.vue';
import { DentRepairTypeViewModel as RepairTypeViewModel } from '@/features/carRepairSettings/presentation/models/DentRepairTypeViewModel';
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue?: RepairTypeViewModel;
  repairTypes: RepairTypeViewModel[];
}>();

const model = ref<RepairTypeViewModel | undefined>(props.modelValue);
const itemTitle = 'name'

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
