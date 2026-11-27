<template>
  <v-alert
    v-if="state !== 'ok'"
    :type="state === 'reached' ? 'warning' : 'info'"
    variant="tonal"
    density="comfortable"
    class="plan-limit-alert"
    icon="mdi-crown-outline"
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
        variant="flat"
        color="primary"
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

const props = defineProps<{ limitKey: FeatureKey; kind: PlanLimitKind; used: number }>();

const NEAR_LIMIT_RATIO = 0.8;

const { t } = useI18n();
const { limitOf, isLoading } = useFeatureAccess();

const limit = computed(() => limitOf(props.limitKey));

// Nothing is shown for unlimited plans, while features load, or when the quota is far from being used
const state = computed<'ok' | 'near' | 'reached'>(() => {
  const max = limit.value;
  if (max === null || isLoading.value) return 'ok';
  if (props.used >= max) return 'reached';
  return props.used >= max * NEAR_LIMIT_RATIO ? 'near' : 'ok';
});
</script>
