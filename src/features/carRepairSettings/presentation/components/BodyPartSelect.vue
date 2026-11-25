<template>
  <GenericSelect
    :model-value="model"
    :items="bodyParts"
    :label="t('carRepairSettings.bodyPart')"
    :item-title="itemTitle"
    @select="onSelectBodyPart"
  />
</template>

<script setup lang="ts">
import GenericSelect from '@/shared/presentation/ui/components/GenericSelect.vue';
import { BodyPartViewModel } from '@/features/carRepairSettings/presentation/models/BodyPartViewModel';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { bodyPartLabel } from '@/features/carRepairSettings/presentation/utils/carRepairLabels';

const props = defineProps<{
  modelValue?: BodyPartViewModel;
  bodyParts: BodyPartViewModel[];
}>();

const model = ref<BodyPartViewModel | undefined>(props.modelValue);
const itemTitle = bodyPartLabel;
const { t } = useI18n();

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
