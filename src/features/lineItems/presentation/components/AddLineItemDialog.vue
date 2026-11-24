<template>
  <GenericDialog
    ref="genericDialogRef"
    persistent
    :max-width="560"
  >
    <template #default>
      <div class="dialog-header">
        <div class="dialog-icon">
          <v-icon
            color="primary"
            size="22"
          >
            {{ editingId ? 'mdi-pencil-outline' : 'mdi-car-wrench' }}
          </v-icon>
        </div>
        <div>
          <div class="dialog-title">
            {{ dialogTitle }}
          </div>
          <div class="dialog-subtitle">
            Renseigne les détails de la réparation
          </div>
        </div>
      </div>
      <v-form
        ref="form"
        class="add-dialog-form"
      >
        <v-container class="pa-0">
          <!-- Ligne 1 : Élément de carrosserie (masqué si l'élément est déjà choisi) -->
          <v-row v-if="!lockedBodyPart">
            <v-col cols="12">
              <BodyPartSelect
                :model-value="line.bodyPart"
                :body-parts="availableBodyParts"
                @select="(value) => line.bodyPart = value"
              />
            </v-col>
          </v-row>

          <!-- Ligne 2 : Nombre d'impacts -->
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="line.impactCount25"
                label="Nombre d'impacts Ø25"
                type="number"
                outlined
                dense
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="line.impactCount35"
                label="Nombre d'impacts Ø35"
                type="number"
                outlined
                dense
              />
            </v-col>
          </v-row>

          <!-- Ligne 3 : Type de matériau -->
          <v-row>
            <v-col cols="12">
              <BodyMaterialSelect
                :model-value="line.bodyMaterial"
                :body-materials="bodyMaterials"
                @select="(value) => line.bodyMaterial = value"
              />
            </v-col>
          </v-row>

          <!-- Ligne 4 : Type de réparation -->
          <v-row>
            <v-col cols="12">
              <RepairTypeSelect
                :model-value="line.repairType"
                :repair-types="repairTypes"
                @select="(value) => line.repairType = value"
              />
            </v-col>
          </v-row>

          <!-- Ligne 5 : Dégarnissage / Commission -->
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="line.dentRemovalPrice"
                label="Montant dégarnissage (€)"
                type="number"
                outlined
                dense
              />
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </template>

    <template #actions>
      <v-spacer />
      <v-btn
        variant="outlined"
        height="40"
        class="px-5"
        @click="onCancelBtnClick()"
      >
        Annuler
      </v-btn>
      <v-btn
        color="primary"
        variant="flat"
        height="40"
        class="px-6"
        prepend-icon="mdi-check"
        @click="onAddBtnClick()"
      >
        Valider
      </v-btn>
    </template>
  </GenericDialog>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import type { BodyPartViewModel } from '@/features/carRepairSettings/presentation/models/BodyPartViewModel'

import BodyMaterialSelect from '@/features/carRepairSettings/presentation/components/BodyMaterialSelect.vue'
import BodyPartSelect from '@/features/carRepairSettings/presentation/components/BodyPartSelect.vue'
import GenericDialog from '@/shared/presentation/ui/components/GenericDialog.vue'
import RepairTypeSelect from '@/features/carRepairSettings/presentation/components/RepairTypeSelect.vue'
import { useLineItemState } from '@/features/lineItems/composition/useLineItemState'
import type { GenericDialogExposed } from '@/shared/presentation/ui/components/components'
import { LineItemViewModel } from '@/features/lineItems/presentation/models/LineItemViewModel'
import { AddLineItemDialogEmits, AddLineItemDialogProps } from './AddLineItemDialog'

const {
  init,
  bodyMaterials,
  repairTypes,
} = useLineItemState();

//#region -> DEFINES
defineProps<AddLineItemDialogProps>()
const emit = defineEmits<AddLineItemDialogEmits>()
//#endregion

//#region -> REFS
const genericDialogRef = ref<GenericDialogExposed>()
const form = ref()
const editingId = ref<string | undefined>()
const lockedBodyPart = ref<BodyPartViewModel | undefined>()
const dialogTitle = computed(() => {
  const action = editingId.value ? 'Modifier' : 'Ajouter'
  return lockedBodyPart.value ? `${action} : ${lockedBodyPart.value.name}` : `${action} un élément`
})
//#endregion

//#region -> DATA
const line = reactive<LineItemViewModel>({
  bodyPart: undefined,
  impactCount25: undefined,
  impactCount35: undefined,
  bodyMaterial: undefined,
  repairType: undefined,
  dentRemovalPrice: undefined,
  price: 0,
  lineItemType: 'quote'
})
//#endregion

//#region -> EVENTS
const onCancelBtnClick = (): void => {
  close()
}

const onAddBtnClick = (): void => {
  // TODO: (GCE) -> COMPUTE PRICE HERE WITH computePrice METHOD
  close()
  if (editingId.value) {
    emit('update', {
      ...line,
      id: editingId.value,
      impactCount25: Number(line.impactCount25 ?? 0),
      impactCount35: Number(line.impactCount35 ?? 0),
      dentRemovalPrice: Number(line.dentRemovalPrice ?? 0),
    })
    return
  }
  emit('add', line)
}
//#endregion

//#region -> METHODS
const open = (item?: LineItemViewModel, bodyPart?: BodyPartViewModel): void => {
  resetForm()
  if (bodyPart) {
    lockedBodyPart.value = bodyPart
    line.bodyPart = bodyPart
  }
  if (item) {
    editingId.value = item.id
    line.bodyPart = item.bodyPart
    line.impactCount25 = item.impactCount25
    line.impactCount35 = item.impactCount35
    line.bodyMaterial = item.bodyMaterial
    line.repairType = item.repairType
    line.dentRemovalPrice = item.dentRemovalPrice
    line.price = item.price
  }
  genericDialogRef.value?.open()
}

const close = (): void => {
  genericDialogRef.value?.close()
}

const resetForm = () => {
  editingId.value = undefined
  lockedBodyPart.value = undefined
  line.bodyPart = undefined
  line.impactCount25 = undefined
  line.impactCount35 = undefined
  line.bodyMaterial = undefined
  line.repairType = undefined
  line.dentRemovalPrice = undefined
}
//#endregion

onMounted(async () => {
  await init()
})

//#region -> EXPOSE
defineExpose({
  open,
  close,
})
//#endregion
</script>

<style scoped>
.dialog-header {
display: flex;
align-items: center;
gap: 14px;
padding-bottom: 16px;
margin-bottom: 20px;
border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.1);
}

.dialog-icon {
width: 44px;
height: 44px;
border-radius: 12px;
background: rgba(var(--v-theme-primary), 0.1);
display: flex;
align-items: center;
justify-content: center;
flex-shrink: 0;
}

.dialog-title {
font-size: 18px;
font-weight: 700;
line-height: 1.2;
}

.dialog-subtitle {
font-size: 13px;
color: rgba(var(--v-theme-on-surface), 0.6);
margin-top: 2px;
}

.add-dialog-form :deep(.v-field) {
border-radius: 12px;
background: rgba(var(--v-theme-on-surface), 0.05);
}

.add-dialog-form :deep(.v-field--focused) {
background: rgb(var(--v-theme-surface));
}
</style>
