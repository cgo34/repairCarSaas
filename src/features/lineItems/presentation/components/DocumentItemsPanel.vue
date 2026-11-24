<template>
  <div class="section-card">
    <div class="section-header mb-4">
      <div class="section-icon">
        <v-icon
          size="18"
          color="primary"
        >
          mdi-format-list-bulleted
        </v-icon>
      </div>
      <span class="text-subtitle-1 font-weight-bold">{{ title }}</span>
      <v-chip
        size="x-small"
        variant="tonal"
        color="primary"
        rounded="pill"
      >
        {{ lines.length }}
      </v-chip>
      <v-spacer />
      <v-btn-toggle
        v-model="viewMode"
        mandatory
        density="comfortable"
        color="primary"
        variant="outlined"
        divided
        rounded="lg"
      >
        <v-btn
          value="list"
          prepend-icon="mdi-format-list-bulleted"
        >
          Vue éléments
        </v-btn>
        <v-btn
          value="car"
          prepend-icon="mdi-car-side"
        >
          Vue voiture
        </v-btn>
      </v-btn-toggle>
    </div>

    <v-alert
      v-if="isForfait"
      type="info"
      variant="tonal"
      density="compact"
    >
      {{ forfaitMessage }}
    </v-alert>

    <!-- Mode 1 : vue éléments -->
    <template v-else-if="viewMode === 'list'">
      <div class="parts-grid">
        <div
          v-for="row in partRows"
          :key="row.bodyPart.id"
          class="part"
          :class="{ added: !!row.line, disabled: !canEdit }"
          @click="onPartClick(row)"
        >
          <div class="min-w-0">
            <div class="part-name">
              {{ row.bodyPart.name }}
            </div>
            <div class="part-sub">
              {{ row.line ? lineSubtitle(row.line) : 'Non ajouté' }}
            </div>
          </div>
          <template v-if="row.line">
            <span class="part-price ml-auto">{{ formatPrice(row.line.price) }}</span>
            <div
              v-if="canEdit"
              class="part-actions"
            >
              <v-btn
                icon
                size="x-small"
                variant="flat"
                class="part-action"
                :disabled="saving"
                @click.stop="onPartClick(row)"
              >
                <v-icon size="14">
                  mdi-pencil
                </v-icon>
              </v-btn>
              <v-btn
                icon
                size="x-small"
                variant="flat"
                class="part-action"
                :disabled="saving"
                @click.stop="onRemoveItemBtnClick(row.line)"
              >
                <v-icon size="14">
                  mdi-delete-outline
                </v-icon>
              </v-btn>
            </div>
          </template>
          <span
            v-else-if="canEdit"
            class="part-plus ml-auto"
          >+</span>
        </div>
      </div>
      <div
        v-if="partRows.length === 0"
        class="text-center py-6 text-medium-emphasis text-body-2"
      >
        Aucun élément de carrosserie n'est configuré.
      </div>
      <div class="text-caption text-medium-emphasis mt-3">
        Clique sur un élément pour l'ajouter. Les éléments déjà ajoutés sont en bleu ; clique dessus pour les modifier.
      </div>
    </template>

    <!-- Mode 2 : vue voiture -->
    <div
      v-else
      class="car-wrap"
    >
      <div class="car">
        <img
          :src="carImage"
          alt="Voiture vue de dessus"
        >
        <div
          v-for="row in positionedRows"
          :key="row.bodyPart.id"
          class="dot"
          :class="{ on: !!row.line, disabled: !canEdit }"
          :style="{ left: row.position!.x + '%', top: row.position!.y + '%' }"
          :title="row.bodyPart.name"
          @click="onPartClick(row)"
        >
          <template v-if="row.line">
            {{ Math.round(row.line.price ?? 0) }}
            <small v-if="row.line.repairType">{{ row.line.repairType.code || row.line.repairType.name }}</small>
          </template>
          <template v-else>
            +
          </template>
        </div>
      </div>
      <div class="car-side">
        <div class="text-subtitle-2 font-weight-bold mb-2">
          Éléments ajoutés
        </div>
        <div
          v-for="line in lines"
          :key="line.id"
          class="part added mb-2"
        >
          <div class="min-w-0">
            <div class="part-name">
              {{ line.bodyPart?.name ?? '—' }}
            </div>
            <div class="part-sub">
              {{ lineSubtitle(line) }}
            </div>
          </div>
          <span class="part-price ml-auto">{{ formatPrice(line.price) }}</span>
          <div
            v-if="canEdit"
            class="part-actions"
          >
            <v-btn
              icon
              size="x-small"
              variant="flat"
              class="part-action"
              :disabled="saving"
              @click.stop="onEditLineBtnClick(line)"
            >
              <v-icon size="14">
                mdi-pencil
              </v-icon>
            </v-btn>
            <v-btn
              icon
              size="x-small"
              variant="flat"
              class="part-action"
              :disabled="saving"
              @click.stop="onRemoveItemBtnClick(line)"
            >
              <v-icon size="14">
                mdi-delete-outline
              </v-icon>
            </v-btn>
          </div>
        </div>
        <div
          v-if="lines.length === 0"
          class="text-caption text-medium-emphasis"
        >
          Aucun élément pour l'instant.
        </div>
        <template v-if="unpositionedRows.length > 0">
          <div class="text-subtitle-2 font-weight-bold mt-4 mb-2">
            Autres éléments
          </div>
          <div class="d-flex flex-wrap ga-2">
            <v-chip
              v-for="row in unpositionedRows"
              :key="row.bodyPart.id"
              :color="row.line ? 'primary' : undefined"
              :variant="row.line ? 'flat' : 'tonal'"
              :disabled="!canEdit"
              @click="onPartClick(row)"
            >
              {{ row.bodyPart.name }}
            </v-chip>
          </div>
        </template>
        <div class="text-caption text-medium-emphasis mt-3">
          Clique sur une pastille grise pour ajouter un élément, ou sur une pastille bleue pour le modifier.
        </div>
      </div>
    </div>

    <AddLineItemDialog
      ref="addLineItemDialogRef"
      :available-body-parts="dialogBodyParts"
      @add="onAddLineItem"
      @update="onUpdateLineItem"
    />

    <v-snackbar
      v-model="snackbar.show"
      color="error"
      timeout="4000"
      location="bottom right"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
// Panneau « Éléments » partagé entre les devis et les factures :
// vue éléments / vue voiture + dialogue d'ajout/modification.
// Il ne connaît ni le devis ni la facture : la persistance passe par les callbacks `onAdd`, `onUpdate` et `onRemove`.
import { computed, reactive, ref } from 'vue';
import carImage from '@/assets/images/car-top.png';
import type { BodyPartViewModel } from '@/features/carRepairSettings/presentation/models/BodyPartViewModel';
import AddLineItemDialog from '@/features/lineItems/presentation/components/AddLineItemDialog.vue';
import { LineItemViewModel } from '@/features/lineItems/presentation/models/LineItemViewModel';
import { getCarPosition } from '@/features/lineItems/presentation/utils/carBodyPartPositions';
import type { AddLineItemDialogExposed } from '@/shared/presentation/ui/components/components';

interface PartRow {
  bodyPart: BodyPartViewModel;
  line?: LineItemViewModel;
  position?: { x: number; y: number };
}

const props = defineProps<{
  title: string;
  forfaitMessage: string;
  lines: LineItemViewModel[];
  bodyParts: BodyPartViewModel[];
  availableBodyParts: BodyPartViewModel[];
  isForfait: boolean;
  isReadOnly: boolean;
  currency: string;
  onAdd: (line: LineItemViewModel) => Promise<void>;
  onUpdate: (line: LineItemViewModel) => Promise<void>;
  onRemove: (lineId: string | undefined) => Promise<void>;
}>();

const addLineItemDialogRef = ref<AddLineItemDialogExposed>();
const editedLine = ref<LineItemViewModel>();
const saving = ref(false);
const viewMode = ref<'list' | 'car'>('list');
const snackbar = reactive({ show: false, message: '' });

const canEdit = computed(() => !props.isReadOnly && !props.isForfait);

const partRows = computed<PartRow[]>(() =>
  props.bodyParts.map(bodyPart => ({
    bodyPart,
    line: props.lines.find(l => l.bodyPart?.id === bodyPart.id),
    position: getCarPosition(bodyPart.name),
  })),
);
const positionedRows = computed(() => partRows.value.filter(r => r.position));
const unpositionedRows = computed(() => partRows.value.filter(r => !r.position));

// En modification, la pièce de la ligne éditée doit rester sélectionnable
const dialogBodyParts = computed(() => {
  const current = editedLine.value?.bodyPart;
  if (!current) return props.availableBodyParts;
  return props.bodyParts.filter(
    bp => bp.id === current.id || props.availableBodyParts.some(a => a.id === bp.id),
  );
});

const formatPrice = (value?: number) => `${(value ?? 0).toFixed(2).replace('.', ',')} ${props.currency}`;

const lineSubtitle = (line: LineItemViewModel) =>
  [line.bodyMaterial?.name, line.repairType?.code || line.repairType?.name].filter(Boolean).join(' · ') || 'Ajouté';

const run = async (action: () => Promise<void>) => {
  saving.value = true;
  try {
    await action();
  } catch {
    snackbar.message = 'Une erreur est survenue lors de la sauvegarde.';
    snackbar.show = true;
  } finally {
    saving.value = false;
  }
};

const onPartClick = (row: PartRow) => {
  if (!canEdit.value || saving.value) return;
  editedLine.value = row.line;
  addLineItemDialogRef.value?.open(row.line, row.bodyPart);
};
const onEditLineBtnClick = (line: LineItemViewModel) => {
  const row = partRows.value.find(r => r.bodyPart.id === line.bodyPart?.id);
  if (row) onPartClick(row);
};
const onAddLineItem = (line: LineItemViewModel) => run(() => props.onAdd({ ...line }));
const onUpdateLineItem = (line: LineItemViewModel) => run(() => props.onUpdate(line));
const onRemoveItemBtnClick = (line: LineItemViewModel) => run(() => props.onRemove(line.id));
</script>

<style scoped>
.section-card {
  background: var(--q-card);
  border-radius: 14px;
  padding: 20px;
  border: 1px solid var(--q-border);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(var(--v-theme-primary), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.parts-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

@media (max-width: 700px) {
  .parts-grid {
    grid-template-columns: 1fr;
  }
}

.part {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--q-part);
  cursor: pointer;
  transition: background 0.15s;
}

.part:hover {
  background: rgba(59, 79, 216, 0.12);
}

.part.disabled {
  cursor: default;
}

.part-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--q-muted);
}

.part-sub {
  font-size: 12px;
  color: var(--q-faint);
}

.part-plus {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--q-soft);
  color: var(--q-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.part.added {
  background: #3b4fd8;
}

.part.added:hover {
  background: #3345c4;
}

.part.added .part-name,
.part.added .part-price {
  color: #fff;
  font-weight: 700;
}

.part.added .part-sub {
  color: rgba(255, 255, 255, 0.8);
}

.part-actions {
  display: flex;
  gap: 6px;
}

.part-action {
  background: rgba(255, 255, 255, 0.2) !important;
  color: #fff !important;
}

.car-wrap {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  align-items: start;
}

@media (max-width: 700px) {
  .car-wrap {
    grid-template-columns: 1fr;
  }
}

.car {
  position: relative;
  width: 100%;
  max-width: 340px;
  margin: 0 auto;
}

.car img {
  width: 100%;
  display: block;
}

.car-side {
  min-width: 0;
}

.dot {
  position: absolute;
  width: 15%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: rgba(160, 165, 180, 0.45);
  color: #fff;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 15px;
  cursor: pointer;
  line-height: 1;
  transition: 0.15s;
}

.dot:hover:not(.disabled) {
  background: rgba(59, 79, 216, 0.6);
  transform: translate(-50%, -50%) scale(1.08);
}

.dot.disabled {
  cursor: default;
}

.dot small {
  font-size: 8px;
  font-weight: 700;
  margin-top: 2px;
}

.dot.on {
  background: #3b4fd8;
  box-shadow: 0 2px 8px rgba(59, 79, 216, 0.4);
}
</style>
