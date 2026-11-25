<template>
  <GenericDialog
    ref="genericDialogRef"
    :title="props.title"
    persistent
    :max-width="600"
  >
    <template #default>
      {{ props.message }}
    </template>

    <template #actions>
      <v-btn @click="onCancelBtnClick()">
        {{ t('common.cancel') }}
      </v-btn>
      <v-btn
        color="primary"
        @click="onConfirmBtnClick()"
      >
        {{ t('common.confirm') }}
      </v-btn>
    </template>
  </GenericDialog>
</template>

<script setup lang="ts">
import GenericDialog from '@/shared/presentation/ui/components/GenericDialog.vue';
import type { GenericDialogExposed } from '@/shared/presentation/ui/components/components';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ConfirmDialogEmits, ConfirmDialogProps } from './ConfirmDialog';

const props = defineProps<ConfirmDialogProps>()
const { t } = useI18n()

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
