<template>
  <GenericSelect
    :model-value="model"
    :items="countries"
    label="Pays"
    item-title="name"
    :readonly="readonly"
    :clearable="!readonly"
    @select="onSelectCountry"
    @clear="onClearCountry"
  />
  <div v-if="taxSummary" class="tax-summary mt-2">
    <v-icon size="14" color="primary" class="mr-1">mdi-information-outline</v-icon>
    <span>{{ taxSummary }}</span>
  </div>
</template>

<script setup lang="ts">
import GenericSelect from '@/@presentation/components/GenericSelect.vue';
import { CountryViewModel } from '@/@presentation/types/models/CountryViewModel';
import { computed, onUpdated, ref } from 'vue';


const props = withDefaults(defineProps<{
  modelValue?: CountryViewModel | string;
  readonly?: boolean;
}>(), {
  modelValue: 'FR',
  readonly: false,
});

const countries = ref<CountryViewModel[]>([
  {
    id: 1,
    name: 'France',
    code: 'FR',
    currency: 'Euro',
    currencySymbol: '€',
    flagUrl: 'https://restcountries.com/data/fra.svg',
    phoneCode: '+33',
    taxRate: 0,
  },
  {
    id: 2,
    name: 'Suisse',
    code: 'CH',
    currency: 'Franc suisse',
    currencySymbol: 'CHF',
    flagUrl: 'https://restcountries.com/data/che.svg',
    phoneCode: '+41',
    taxRate: 8,
  },
]);
const model = ref<CountryViewModel | undefined>(countries.value.find(c => c.code === props.modelValue));

const taxSummary = computed(() => {
  if (!model.value) return '';
  const flag = model.value.code === 'FR' ? '🇫🇷' : model.value.code === 'CH' ? '🇨🇭' : '🌍';
  const tva = model.value.taxRate === 0
    ? 'TVA non applicable (autoliquidation)'
    : `TVA ${model.value.taxRate}%`;
  return `${flag} ${model.value.name} — ${model.value.currencySymbol} · ${tva}`;
});

const defaultCountrySelected = computed(() => {
  return countries.value.find(c => c.code === props.modelValue);
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: CountryViewModel | undefined): void;
  (e: 'select', value: CountryViewModel | undefined): void;
}>();

const onClearCountry = () => {
  model.value = undefined;
  emit('update:modelValue', undefined);
};

const onSelectCountry = (selected: CountryViewModel | undefined) => {
  if (!selected) return;
  model.value = selected;
  emit('update:modelValue', selected);
  emit('select', selected);
};

onUpdated(() => {
  emit('update:modelValue', defaultCountrySelected.value);
});
</script>

<style scoped>
.tax-summary {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: rgb(var(--v-theme-lightText));
  font-family: 'Manrope', sans-serif;
}
</style>
