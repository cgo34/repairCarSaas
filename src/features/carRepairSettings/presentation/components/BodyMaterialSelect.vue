<template>
  <GenericSelect
    :model-value="model"
    :items="bodyMaterials"
    :item-title="itemTitle"
    :label="t('carRepairSettings.material')"
    @update:model-value="onSelectBodyMaterial"
    @select="onSelectBodyMaterial"
  />
</template>

<script setup lang="ts">
import GenericSelect from '@/shared/presentation/ui/components/GenericSelect.vue';
import { BodyMaterialViewModel } from '@/features/carRepairSettings/presentation/models/BodyMaterialViewModel';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { bodyMaterialLabel } from '@/features/carRepairSettings/presentation/utils/carRepairLabels';

const props = defineProps<{
  modelValue?: BodyMaterialViewModel;
  bodyMaterials: BodyMaterialViewModel[];
}>();

const model = ref<BodyMaterialViewModel | undefined>(props.modelValue);
const itemTitle = bodyMaterialLabel;
const { t } = useI18n();
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
