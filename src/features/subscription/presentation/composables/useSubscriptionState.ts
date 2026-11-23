// presentation/modules/subscription/composables/useSubscriptionState.ts
import { ISubscriptionState } from '@/features/subscription/presentation/state/ISubscriptionState'

export interface UseSubscriptionStateDependencies {
  subscriptionState: ISubscriptionState;
}

export function createUseSubscriptionState(deps: UseSubscriptionStateDependencies) {
  const { subscriptionState } = deps;
  return {
    subscription: subscriptionState.subscription,
    isLoading: subscriptionState.isLoading,
    load: subscriptionState.load
  }
}
