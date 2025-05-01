<template>
  <GenericDialog
    ref="genericDialogRef"
    :title="props.title"
    persistent
    :maxWidth="600"
  >
    <template #default>
      {{  props.message }}
    </template>

    <template #actions>
      <v-btn @click="onCancelBtnClick()">Annuler</v-btn>
      <v-btn color="primary" @click="onConfirmBtnClick()">Confirmer</v-btn>
    </template>
  </GenericDialog>
</template>

<script setup lang="ts">
import GenericDialog from '@/@presentation/components/GenericDialog.vue';
import type { GenericDialogExposed } from '@/@presentation/types/components';
import { onMounted, ref } from 'vue';
import { ConfirmDialogEmits, ConfirmDialogProps } from './ConfirmDialog';

const props = defineProps<ConfirmDialogProps>()

//#region -> DEFINES
const emit = defineEmits<ConfirmDialogEmits>()
//#endregion

//#region -> REFS
const genericDialogRef = ref<GenericDialogExposed>()
//#endregion


const onCancelBtnClick = (): void => {
  close()
  emit('cancel')
}

const onConfirmBtnClick = (): void => {
  close()
  emit('confirm') 
}

const open = (): void => {
  genericDialogRef.value?.open()
}

const close = (): void => {
  genericDialogRef.value?.close()
}
//#endregion

//#region -> EXPOSE
defineExpose({
  open,
  close,
})
//#endregion
</script>
