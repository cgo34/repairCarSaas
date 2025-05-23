// presentation/modules/subscription/composables/useSubscriptionState.ts
import { ISubscriptionState } from '@domain/states/ISubscriptionState'
import { container } from '@infrastructure/ioc/inversify.config'
import { SYMBOLS } from '@infrastructure/ioc/symbols'

const subscriptionState = container.get<ISubscriptionState>(SYMBOLS.States.SubscriptionState)

export function useSubscriptionState() {
  return {
    subscription: subscriptionState.subscription,
    isLoading: subscriptionState.isLoading,
    load: subscriptionState.load
  }
}
