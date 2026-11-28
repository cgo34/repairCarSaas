<template>
  <div>
    <v-alert
      class="mb-4"
      type="info"
      icon="$info"
      variant="tonal"
      :text="t('priceSettings.impact.info')"
    />
    <v-form>
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <div
            v-for="(line, index) in settings.slice(0,13)"
            :key="index"
          >
            <span v-if="line.impactCountMin === line.impactCountMax">
              {{ t('priceSettings.impact.count', line.impactCountMin) }}
            </span>
            <span v-else>
              {{ t('priceSettings.impact.range', { min: line.impactCountMin, max: line.impactCountMax }) }}
            </span>
            <v-text-field
              v-model="line.unitTime"
              :label="t('priceSettings.fields.unitTime')"
              required
            />
          </div>
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <div
            v-for="(line, index) in settings.slice(13, -1)"
            :key="index"
          >
            <span v-if="line.impactCountMin === line.impactCountMax">
              {{ t('priceSettings.impact.count', line.impactCountMin) }}
            </span>
            <span v-else>
              {{ t('priceSettings.impact.range', { min: line.impactCountMin, max: line.impactCountMax }) }}
            </span>
            <v-text-field
              v-model="line.unitTime"
              :label="t('priceSettings.fields.unitTime')"
              required
            />
          </div>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { usePriceSettingsDependencies } from '@/features/priceSettings/composition/usePriceSettingsDependencies';
import { useI18n } from 'vue-i18n';
import { usePriceTabForm } from '@/features/priceSettings/presentation/composables/usePriceTabForm';
import { onMounted } from 'vue';

const { t } = useI18n();

const { useSettingPriceImpactCountToUtState } = usePriceSettingsDependencies();

const {
  settings,
  init,
  saveSettingUnitTime
} = useSettingPriceImpactCountToUtState;

const form = usePriceTabForm(settings, init, saveSettingUnitTime);

onMounted(form.load);

defineExpose({ isDirty: form.isDirty, save: form.save, reset: form.reset });
</script>
