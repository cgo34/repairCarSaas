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
  <v-alert
    title="Information TVA"
    type="info"
    icon="$info"
    variant="tonal"
    :text="countrySelectionInformation"
  />
</template>

<script setup lang="ts">
import GenericSelect from '@/@presentation/components/GenericSelect.vue';
import { CountryViewModel } from '@/@presentation/types/models/CountryViewModel';
import { defineEmits, defineProps, ref } from 'vue';

const props = defineProps<{
  modelValue?: CountryViewModel;
  readonly?: boolean;
}>();

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
const model = ref<CountryViewModel | undefined>(props.modelValue ?? countries.value[0]);
const countrySelectionInformation = ref<string>(`Si le pays sélectionné est France : La devise est EUR et il n'y a pas de TVA. Mention sur le devis : TVA non applicable - Autoliquidation de la TVA par le client (Article 196 de la directive 2006/112/CE) et Suisse : La devise est CHF et la TVA est de 8%.`);

const emit = defineEmits<{
  (e: 'update:modelValue', value: CountryViewModel | undefined): void;
  (e: 'select', value: CountryViewModel | undefined): void;
}>();

const onClearCountry = () => {
  model.value = undefined;
  countrySelectionInformation.value = `Si le pays sélectionné est France : La devise est EUR et il n'y a pas de TVA. Mention sur le devis : TVA non applicable - Autoliquidation de la TVA par le client (Article 196 de la directive 2006/112/CE) et Suisse : La devise est CHF et la TVA est de 8%.`;
  emit('update:modelValue', undefined);
};

const onSelectCountry = (selected: CountryViewModel | undefined) => {
  if (!selected) {
    return '';
  }

  model.value = selected;

  countrySelectionInformation.value = selected?.name === 'France'
  ? `La devise est ${selected.currency} et il n'y a pas de TVA. Mention sur le devis : TVA non applicable - Autoliquidation de la TVA par le client (Article 196 de la directive 2006/112/CE)`
  : `La devise est ${selected.currency} et la TVA est de 8%.`;

  emit('update:modelValue', selected);
  emit('select', selected);
};

// watch(() => props.modelValue, (newValue) => {
//   model.value = newValue;
// });
</script>
