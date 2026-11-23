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
import { inject } from 'vue';
import { DOWNLOAD_SERVICE_KEY } from '@/shared/presentation/injectionKeys';
import GenericButton from './GenericButton.vue';

const props = defineProps<{
  url: string
  filename: string
}>()

const downloadService = inject(DOWNLOAD_SERVICE_KEY)
if (!downloadService) throw new Error('DownloadService non fourni (voir app/main.ts)')

const handleClick = () => {
  if (!props.url || !props.filename) return
  downloadService.download(props.url, props.filename)
}
</script>
