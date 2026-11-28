import { computed, watch } from 'vue'
import type { IAuthState } from '@/features/auth/presentation/state/IAuthState'
import type { IFeatureAccessState } from '@/features/featureAccess/presentation/state/IFeatureAccessState'
import type { FeatureKey } from '@/features/featureAccess/domain/types/FeatureKey'

export interface UseFeatureAccessDependencies {
  featureAccessState: IFeatureAccessState
  authState: IAuthState
}

const REFRESH_MIN_INTERVAL_MS = 30_000
let visibilityListenerRegistered = false
let lastRefreshAt = 0

export function createUseFeatureAccess(deps: UseFeatureAccessDependencies) {
  const { featureAccessState, authState } = deps

  const organizationId = computed(() => authState.userContext.value?.organization?.id ?? null)

  watch(
    organizationId,
    (orgId) => {
      if (orgId) void featureAccessState.ensureLoaded(orgId)
      else featureAccessState.reset()
    },
    { immediate: true },
  )

  // Gifts and plans expire: reload when the user comes back to the tab
  if (!visibilityListenerRegistered && typeof document !== 'undefined') {
    visibilityListenerRegistered = true
    document.addEventListener('visibilitychange', () => {
      const orgId = organizationId.value
      if (document.visibilityState !== 'visible' || !orgId) return
      if (Date.now() - lastRefreshAt < REFRESH_MIN_INTERVAL_MS) return
      lastRefreshAt = Date.now()
      void featureAccessState.refresh(orgId)
    })
  }

  const can = (key: FeatureKey): boolean => featureAccessState.features.value.can(key)
  const limitOf = (key: FeatureKey): number | null => featureAccessState.features.value.limitOf(key)
  const isLimitReached = (key: FeatureKey, usage: number): boolean =>
    featureAccessState.features.value.isLimitReached(key, usage)
  const remaining = (key: FeatureKey, usage: number): number | null =>
    featureAccessState.features.value.remaining(key, usage)

  const refresh = async (): Promise<void> => {
    if (organizationId.value) await featureAccessState.refresh(organizationId.value)
  }

  return {
    can,
    limitOf,
    isLimitReached,
    remaining,
    refresh,
    isLoading: featureAccessState.isLoading,
  }
}
