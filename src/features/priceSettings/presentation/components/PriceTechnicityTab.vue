<template>
  <div>
    <v-alert
      class="mb-4"
      type="info"
      icon="$info"
      variant="tonal"
      :text="t('priceSettings.technicity.info')"
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
import { useI18n } from 'vue-i18n';
import { usePriceTabForm } from '@/features/priceSettings/presentation/composables/usePriceTabForm';
import { computed, onMounted } from 'vue';

const { t } = useI18n();

const { useSettingPriceTechnicityCoefficientState } = usePriceSettingsDependencies();

const {
  settings,
  init,
  saveSettingTechnicityCoefficient
} = useSettingPriceTechnicityCoefficientState;

const fields = computed(() => [
  { key: 'dapCoefficient', label: t('priceSettings.technicity.dap') },
  { key: 'dspCoefficient', label: t('priceSettings.technicity.dsp') },
  { key: 'diameter25Coefficient', label: t('priceSettings.technicity.diameter25') },
  { key: 'diameter35Coefficient', label: t('priceSettings.technicity.diameter35') },
  { key: 'aluminiumCoefficient', label: t('priceSettings.technicity.aluminium') },
] as const);

const form = usePriceTabForm(settings, init, saveSettingTechnicityCoefficient);

onMounted(form.load);

defineExpose({ isDirty: form.isDirty, save: form.save, reset: form.reset });
</script>
