<template>
  <div>
    <v-alert
      class="mb-4"
      type="info"
      icon="$info"
      variant="tonal"
      text="L'indice de difficulté 1 est une bosse sur un pavillon. Vous pouvez décider qu'une bosse sur un autre élément de carrosserie est X fois plus difficile à réparer."
    />
    <v-form>
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <div
            v-for="(elm, index) in settings.slice(0,7)"
            :key="index"
          >
            <span>{{ elm.bodyParts.name }}</span>
            <v-text-field
              v-model="elm.coefficient"
              label="Difficulty coefficient"
              required
            />
          </div>
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <div
            v-for="(elm, index) in settings.slice(7, -1)"
            :key="index"
          >
            <span>{{ elm.bodyParts.name }}</span>
            <v-text-field
              v-model="elm.coefficient"
              label="Difficulty coefficient"
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

const { useSettingPriceBodyPartCoefficientState } = usePriceSettingsDependencies();

const {
  settings,
  init,
  saveSettingBodyPartCoefficient,
} = useSettingPriceBodyPartCoefficientState;

const form = usePriceTabForm(settings, init, saveSettingBodyPartCoefficient);

onMounted(form.load);

defineExpose({ isDirty: form.isDirty, save: form.save, reset: form.reset });
</script>
