<template>
  <div>
    <v-alert
      class="mb-4"
      type="info"
      icon="$info"
      variant="tonal"
      text="L'indice de difficulté 1 est un DSP sur de la tôle. L'aluminium est ici majoré d'un multiplicateur et le travail de DAP est, lui, minoré Le diammètre 2 est le diamètre de référence, le diamètre 1 permet de minorer le prix de référence, quelle que soit la méthode de chiffrage."
    />
    <v-form>
      <v-row>
        <v-col
          v-for="field in fields"
          :key="field.key"
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="settings[field.key]"
            :label="field.label"
            required
          />
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { usePriceSettingsDependencies } from '@/features/priceSettings/composition/usePriceSettingsDependencies';
import { usePriceTabForm } from '@/features/priceSettings/presentation/composables/usePriceTabForm';
import { onMounted } from 'vue';

const { useSettingPriceTechnicityCoefficientState } = usePriceSettingsDependencies();

const {
  settings,
  init,
  saveSettingTechnicityCoefficient
} = useSettingPriceTechnicityCoefficientState;

const fields = [
  { key: 'dapCoefficient', label: 'DAP coefficient' },
  { key: 'dspCoefficient', label: 'DSP coefficient' },
  { key: 'diameter25Coefficient', label: 'Diameter 25 coefficient' },
  { key: 'diameter35Coefficient', label: 'Diameter 35 coefficient' },
  { key: 'aluminiumCoefficient', label: 'Aluminium coefficient' },
] as const;

const form = usePriceTabForm(settings, init, saveSettingTechnicityCoefficient);

onMounted(form.load);

defineExpose({ isDirty: form.isDirty, save: form.save, reset: form.reset });
</script>
