<template>
  <GenericDialog
    ref="genericDialogRef"
    title="Ajouter un élément"
    persistent
    :maxWidth="600"
  >
    <template #default>
      <v-form ref="form">
        <v-container>
          <!-- Ligne 1 : Élément de carrosserie -->
          <v-row>
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
      <v-btn @click="onCancelBtnClick()">Annuler</v-btn>
      <v-btn color="primary" @click="onAddBtnClick()">Valider</v-btn>
    </template>
  </GenericDialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

import BodyMaterialSelect from '@/@presentation/components/BodyMaterialSelect.vue'
import BodyPartSelect from '@/@presentation/components/BodyPartSelect.vue'
import GenericDialog from '@/@presentation/components/GenericDialog.vue'
import RepairTypeSelect from '@/@presentation/components/RepairTypeSelect.vue'
import { useLineItemState } from '@/@presentation/composables/useLineItemState'
import type { GenericDialogExposed } from '@/@presentation/types/components'
import { LineItemViewModel } from '../types/models/LineItemViewModel'
import { AddLineItemDialogEmits, AddLineItemDialogProps } from './AddLineItemDialog'

const {
  init,
  bodyMaterials,
  repairTypes,
} = useLineItemState();

//#region -> DEFINES
const props = defineProps<AddLineItemDialogProps>()
const emit = defineEmits<AddLineItemDialogEmits>()
//#endregion

//#region -> REFS
const genericDialogRef = ref<GenericDialogExposed>()
const form = ref()
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
  emit('add', line)
}
//#endregion

//#region -> METHODS
const open = (): void => {
  resetForm()
  genericDialogRef.value?.open()
}

const close = (): void => {
  genericDialogRef.value?.close()
}

const resetForm = () => {
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
