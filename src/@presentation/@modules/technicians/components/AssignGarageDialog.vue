<template>
  <v-dialog v-model="dialog" max-width="520">
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
          v-model="selectedGarageId"
          :items="availableGarages"
          item-title="name"
          item-value="id"
          label="Sélectionner un garage"
          variant="outlined"
          density="comfortable"
          clearable
        />

        <div v-if="assignedGarages.length" class="mt-2">
          <p class="text-body-2 font-weight-medium mb-2">Garages assignés :</p>
          <v-chip
            v-for="garage in assignedGarages"
            :key="garage.id"
            closable
            class="mr-2 mb-2"
            color="primary"
            variant="tonal"
            @click:close="$emit('remove-garage', garage.id)"
          >
            {{ garage.name }}
          </v-chip>
        </div>
        <p v-else class="text-body-2 text-medium-emphasis">Aucun garage assigné.</p>
      </v-card-text>

      <v-divider />
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="dialog = false">Annuler</v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :disabled="!selectedGarageId"
          @click="onAssign"
        >
          Assigner
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { GarageDto } from '@/@application/dtos/GarageDto';

const props = defineProps<{
  modelValue: boolean;
  technicianName: string;
  allGarages: GarageDto[];
  assignedGarages: GarageDto[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void;
  (e: 'assign-garage', garageId: string): void;
  (e: 'remove-garage', garageId: string): void;
}>();

const dialog = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const selectedGarageId = ref<string | null>(null);

const availableGarages = computed(() => {
  const assignedIds = new Set(props.assignedGarages.map(g => g.id));
  return props.allGarages.filter(g => !assignedIds.has(g.id));
});

function onAssign() {
  if (!selectedGarageId.value) return;
  emit('assign-garage', selectedGarageId.value);
  selectedGarageId.value = null;
}
</script>
