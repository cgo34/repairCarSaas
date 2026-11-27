<template>
  <v-tooltip
    :disabled="!locked"
    location="top"
  >
    <template #activator="{ props: tooltipProps }">
      <span
        v-bind="tooltipProps"
        class="feature-gate"
      >
        <slot :locked="locked" />
      </span>
    </template>
    <div class="font-weight-medium">
      <v-icon
        size="small"
        icon="mdi-crown-outline"
        class="mr-1"
      />{{ t('common.featureGate.premiumTitle') }}
    </div>
    <div class="text-caption">
      {{ t('common.featureGate.premiumHint') }}
    </div>
  </v-tooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useFeatureAccess } from '@/features/featureAccess/composition/useFeatureAccess';
import type { FeatureKey } from '@/features/featureAccess/domain/types/FeatureKey';

const props = defineProps<{ feature: FeatureKey }>();

const { t } = useI18n();
const { can } = useFeatureAccess();

// Le contenu reste visible mais doit se désactiver lorsque `locked` est vrai
const locked = computed(() => !can(props.feature));
</script>

<style scoped>
.feature-gate {
  display: block;
}
</style>
