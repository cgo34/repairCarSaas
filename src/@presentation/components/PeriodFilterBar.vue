<template>
  <v-card
    flat
    rounded="lg"
    border
    class="mb-3"
  >
    <div class="px-3 pt-3 pb-2">
      <!-- Presets scroll horizontal sur mobile -->
      <div class="preset-scroll mb-2">
        <v-btn
          v-for="preset in datePresets"
          :key="preset.key"
          size="small"
          :variant="activePreset === preset.key ? 'flat' : 'tonal'"
          :color="activePreset === preset.key ? 'primary' : 'default'"
          rounded="lg"
          class="mr-1 flex-shrink-0"
          @click="onPresetClick(preset.key)"
        >
          {{ preset.label }}
        </v-btn>
      </div>

      <!-- Date pickers + actions -->
      <div class="d-flex align-center flex-wrap gap-2">
        <v-text-field
          :model-value="dateFrom"
          label="Du"
          type="date"
          density="compact"
          variant="outlined"
          hide-details
          :style="mobile ? 'flex:1;min-width:130px' : 'max-width:160px'"
          @update:model-value="onDateFromChange"
        />
        <v-text-field
          :model-value="dateTo"
          label="Au"
          type="date"
          density="compact"
          variant="outlined"
          hide-details
          :style="mobile ? 'flex:1;min-width:130px' : 'max-width:160px'"
          @update:model-value="onDateToChange"
        />
        <v-btn
          v-if="hasActiveFilter"
          icon="mdi-close"
          size="small"
          variant="text"
          @click="$emit('clear')"
        />
        <v-spacer v-if="!mobile" />
        
        <!-- Slot pour contenu additionnel (ex: actions de sélection) -->
        <slot name="actions" />
      </div>
    </div>

    <!-- Slot pour barre additionnelle (ex: sélection mobile) -->
    <slot name="bottom-bar" />
  </v-card>
</template>

<script setup lang="ts">
import { PeriodPreset, PeriodPresetOption } from '@/@presentation/composables/usePeriodFilter';
import { useDisplay } from 'vuetify';

interface Props {
  dateFrom: string;
  dateTo: string;
  activePreset: PeriodPreset;
  datePresets: PeriodPresetOption[];
  hasActiveFilter: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:dateFrom': [value: string];
  'update:dateTo': [value: string];
  'update:activePreset': [value: PeriodPreset];
  'preset-change': [key: PeriodPreset];
  'clear': [];
}>();

const { mobile } = useDisplay();

const onPresetClick = (key: PeriodPreset) => {
  emit('update:activePreset', key);
  emit('preset-change', key);
};

const onDateFromChange = (value: string) => {
  emit('update:dateFrom', value);
  emit('update:activePreset', 'custom');
};

const onDateToChange = (value: string) => {
  emit('update:dateTo', value);
  emit('update:activePreset', 'custom');
};
</script>

<style scoped>
.preset-scroll {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 4px;
  padding-bottom: 4px;
  scrollbar-width: none;
}
.preset-scroll::-webkit-scrollbar {
  display: none;
}
</style>
