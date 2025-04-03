<template>
  <GenericButton
    color="secondary"
    variant="flat"
    prepend-icon="mdi-download-box"
    class="me-2 text-none"
    @click="handleClick"
  >
    <slot>Download</slot>
  </GenericButton>
</template>

<script setup lang="ts">
import { IDownloadService } from '@/@domain/services/IDownloadService';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import GenericButton from './GenericButton.vue';

const props = defineProps<{
  url: string
  filename: string
}>()

const downloadService = container.get<IDownloadService>(SYMBOLS.Services.DownloadService)

const handleClick = () => {
  if (!props.url || !props.filename) return
  downloadService.download(props.url, props.filename)
}
</script>
