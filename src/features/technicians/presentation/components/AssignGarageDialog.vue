<template>
  <v-dialog
    v-model="dialog"
    max-width="520"
  >
    <v-card>
      <v-card-title class="text-subtitle-1 font-weight-bold pa-4 pb-2">
        Assigner des garages
      </v-card-title>
      <v-card-subtitle class="px-4 pb-3 text-medium-emphasis">
        {{ technicianName }}
      </v-card-subtitle>
      <v-divider />

      <v-card-text class="pa-4">
        <v-autocomplete
          v-model="selectedGarageIds"
          :items="availableGarages"
          item-title="name"
          item-value="id"
          label="Sélectionner des garages"
          variant="outlined"
          density="comfortable"
          multiple
          chips
          closable-chips
          clearable
        />
      </v-card-text>

      <v-divider />
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          variant="text"
          @click="dialog = false"
        >
          Annuler
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :disabled="!selectedGarageIds.length"
          @click="onAssign"
        >
          Assigner<template v-if="selectedGarageIds.length > 1"> ({{ selectedGarageIds.length }})</template>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { GarageDto } from '@/features/garages/application/dtos/GarageDto';

const props = defineProps<{
  modelValue: boolean;
  technicianName: string;
  allGarages: GarageDto[];
  assignedGarages: GarageDto[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void;
  (e: 'assign-garages', garageIds: string[]): void;
}>();

const dialog = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const selectedGarageIds = ref<string[]>([]);

const availableGarages = computed(() => {
  const assignedIds = new Set(props.assignedGarages.map(g => g.id));
  return props.allGarages.filter(g => !assignedIds.has(g.id));
});

function onAssign() {
  if (!selectedGarageIds.value.length) return;
  emit('assign-garages', [...selectedGarageIds.value]);
  selectedGarageIds.value = [];
  dialog.value = false;
}
</script>
