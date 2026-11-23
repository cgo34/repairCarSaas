import { ISubscriptionState } from '@/features/subscription/presentation/state/ISubscriptionState'
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { createUseSubscriptionState } from '@/features/subscription/presentation/composables/useSubscriptionState';

export function useSubscriptionState() {
  return createUseSubscriptionState({
    subscriptionState: container.get<ISubscriptionState>(SYMBOLS.States.SubscriptionState),
  });
}
