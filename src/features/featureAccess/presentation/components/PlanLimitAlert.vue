<template>
  <v-alert
    v-if="state !== 'ok'"
    :type="state === 'reached' ? 'warning' : 'info'"
    variant="tonal"
    density="comfortable"
    class="plan-limit-alert"
    :icon="state === 'reached' ? 'mdi-alert-outline' : 'mdi-information-outline'"
  >
    <div class="font-weight-medium">
      {{ state === 'reached' ? t(`common.planLimit.${kind}`, { limit }) : t('common.planLimit.usage', { used, limit, label: t(`common.planLimit.label.${kind}`) }) }}
    </div>
    <div class="text-caption">
      {{ t('common.planLimit.upgradeHint') }}
    </div>
    <template #append>
      <v-btn
        size="small"
        variant="text"
        to="/subscription"
      >
        {{ t('common.planLimit.upgrade') }}
      </v-btn>
    </template>
  </v-alert>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useFeatureAccess } from '@/features/featureAccess/composition/useFeatureAccess';
import type { FeatureKey } from '@/features/featureAccess/domain/types/FeatureKey';
import type { PlanLimitKind } from '@/features/featureAccess/domain/errors/PlanLimitError';

const props = defineProps<{ limitKey?: FeatureKey; kind: PlanLimitKind; used: number; limitOverride?: number }>();

const NEAR_LIMIT_RATIO = 0.8;

const { t } = useI18n();
const { limitOf, isLoading } = useFeatureAccess();

const limit = computed(() => props.limitOverride ?? (props.limitKey ? limitOf(props.limitKey) : null));

// Nothing is shown for unlimited plans, while features load, or when the quota is far from being used
const state = computed<'ok' | 'near' | 'reached'>(() => {
  const max = limit.value;
  if (max === null || (props.limitOverride === undefined && isLoading.value)) return 'ok';
  if (props.used >= max) return 'reached';
  return props.kind !== 'members' && props.used >= max * NEAR_LIMIT_RATIO ? 'near' : 'ok';
});
</script>

<style scoped>
.plan-limit-alert {
  grid-template-areas: "prepend content append close" "prepend content append close";
  align-items: center;
}

.plan-limit-alert :deep(.v-alert__prepend),
.plan-limit-alert :deep(.v-alert__append) {
  align-self: center !important;
  align-items: center;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.plan-limit-alert :deep(.v-alert__content) {
  align-self: center;
}
</style>
