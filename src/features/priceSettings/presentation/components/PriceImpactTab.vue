<template>
  <div>
    <v-alert
      class="mb-4"
      type="info"
      icon="$info"
      variant="tonal"
      text="Le nombre de bosses est traduit en Unités de temps (UT) paramétrables 1UT = 6 minutes"
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
              {{ line.impactCountMin }} impacts
            </span>
            <span v-else>
              {{ line.impactCountMin }} - {{ line.impactCountMax }} impacts
            </span>
            <v-text-field
              v-model="line.unitTime"
              label="Unit time"
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
              {{ line.impactCountMin }} impacts
            </span>
            <span v-else>
              {{ line.impactCountMin }} - {{ line.impactCountMax }} impacts
            </span>
            <v-text-field
              v-model="line.unitTime"
              label="Unit time"
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
import { usePriceTabForm } from '@/features/priceSettings/presentation/composables/usePriceTabForm';
import { onMounted } from 'vue';

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
