<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-0"
    >
      <div class="d-flex align-center flex-wrap ga-3 mb-4">
        <div>
          <h1 class="text-h5 font-weight-bold">
            {{ t('priceSettings.title') }}
          </h1>
          <div class="text-body-2 text-medium-emphasis">
            {{ t('priceSettings.subtitle') }}
          </div>
        </div>

        <v-spacer />

        <v-chip
          v-if="saved"
          color="success"
          variant="tonal"
          prepend-icon="mdi-check"
        >
          {{ t('priceSettings.saved') }}
        </v-chip>

        <v-btn
          variant="text"
          :disabled="saving || !hasChanges"
          @click="onReset"
        >
          {{ t('common.cancel') }}
        </v-btn>

        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-content-save-outline"
          :loading="saving"
          :disabled="!hasChanges"
          @click="onSave"
        >
          {{ t('common.save') }}
        </v-btn>
      </div>

      <v-card
        variant="flat"
        class="bg-surface border"
      >
        <v-tabs
          v-model="tab"
          color="primary"
        >
          <v-tab
            v-for="item in tabs"
            :key="item.value"
            :value="item.value"
            :prepend-icon="item.icon"
          >
            {{ t('priceSettings.tabs.' + item.value) }}
            <v-icon
              v-if="isTabDirty(item.value)"
              size="8"
              color="warning"
              class="ml-2"
              icon="mdi-circle"
            />
          </v-tab>
        </v-tabs>

        <v-divider />

        <v-window
          v-model="tab"
          class="pa-5"
        >
          <v-window-item
            value="general"
            eager
          >
            <PriceGeneralTab ref="general" />
          </v-window-item>
          <v-window-item
            value="impact-unit-time"
            eager
          >
            <PriceImpactTab ref="impact-unit-time" />
          </v-window-item>
          <v-window-item
            value="technicity-coefficients"
            eager
          >
            <PriceTechnicityTab ref="technicity-coefficients" />
          </v-window-item>
          <v-window-item
            value="variation-coefficients"
            eager
          >
            <PriceVariationTab ref="variation-coefficients" />
          </v-window-item>
        </v-window>
      </v-card>
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '@/app/layouts/MainLayout.vue';
import PriceGeneralTab from '@/features/priceSettings/presentation/components/PriceGeneralTab.vue';
import PriceImpactTab from '@/features/priceSettings/presentation/components/PriceImpactTab.vue';
import PriceTechnicityTab from '@/features/priceSettings/presentation/components/PriceTechnicityTab.vue';
import PriceVariationTab from '@/features/priceSettings/presentation/components/PriceVariationTab.vue';
import type { PriceTabHandle } from '@/features/priceSettings/presentation/composables/usePriceTabForm';
import { computed, ref, useTemplateRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

const { t } = useI18n();

const tabs = [
  { value: 'general', icon: 'mdi-cash' },
  { value: 'impact-unit-time', icon: 'mdi-timer-outline' },
  { value: 'technicity-coefficients', icon: 'mdi-wrench-outline' },
  { value: 'variation-coefficients', icon: 'mdi-car-door' },
] as const;

type TabKey = (typeof tabs)[number]['value'];

const route = useRoute();
const router = useRouter();

const isTabKey = (value: unknown): value is TabKey => tabs.some(item => item.value === value);

const tab = ref<TabKey>(isTabKey(route.params.tab) ? route.params.tab : 'general');

const general = useTemplateRef<PriceTabHandle>('general');
const impact = useTemplateRef<PriceTabHandle>('impact-unit-time');
const technicity = useTemplateRef<PriceTabHandle>('technicity-coefficients');
const variation = useTemplateRef<PriceTabHandle>('variation-coefficients');

const handles = computed<Record<TabKey, PriceTabHandle | null>>(() => ({
  'general': general.value,
  'impact-unit-time': impact.value,
  'technicity-coefficients': technicity.value,
  'variation-coefficients': variation.value,
}));

const isTabDirty = (key: TabKey) => !!handles.value[key]?.isDirty;
const hasChanges = computed(() => tabs.some(item => isTabDirty(item.value)));

const saving = ref(false);
const saved = ref(false);

const dirtyHandles = () => tabs.map(item => handles.value[item.value]).filter((h): h is PriceTabHandle => !!h?.isDirty);

const onSave = async () => {
  saving.value = true;
  try {
    await Promise.all(dirtyHandles().map(h => h.save()));
    saved.value = true;
    setTimeout(() => (saved.value = false), 2500);
  } finally {
    saving.value = false;
  }
};

const onReset = async () => {
  await Promise.all(dirtyHandles().map(h => h.reset()));
};

watch(tab, value => {
  if ((route.params.tab || 'general') !== value) {
    // The general tab is the base URL: /organization/pricing
    router.replace({ name: 'PricingSettings', params: { tab: value === 'general' ? undefined : value } });
  }
});
</script>
