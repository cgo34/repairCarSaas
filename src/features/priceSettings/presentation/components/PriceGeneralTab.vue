<template>
  <div>
    <v-alert
      class="mb-4"
      type="info"
      icon="$info"
      variant="tonal"
      text="Le montant du taux horaire est appliqué aux calculs des éléments"
    />
    <v-form>
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="settings.hourlyRate"
            label="Hourly rate"
            required
          />
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="settings.unitTime"
            label="Unit time"
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

const { useSettingPriceGeneralState } = usePriceSettingsDependencies();

const {
  settings,
  init,
  saveSettingPriceGeneral
} = useSettingPriceGeneralState;

const form = usePriceTabForm(settings, init, saveSettingPriceGeneral);

onMounted(form.load);

defineExpose({ isDirty: form.isDirty, save: form.save, reset: form.reset });
</script>
