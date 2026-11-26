<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import MainLayout from '@/app/layouts/MainLayout.vue';

const { t } = useI18n();
const route = useRoute();
const title = computed(() => t(String(route.meta.titleKey ?? 'platformAdmin.comingSoon.title')));
</script>

<template>
  <MainLayout>
    <div class="mb-4">
      <h2 class="text-h3">
        {{ title }}
      </h2>
    </div>
    <v-card elevation="0">
      <v-card-text class="pa-8 text-center">
        <h3 class="mb-2">
          {{ t('platformAdmin.comingSoon.title') }}
        </h3>
        <p class="text-medium-emphasis">
          {{ t('platformAdmin.comingSoon.message') }}
        </p>
      </v-card-text>
    </v-card>
  </MainLayout>
</template>
