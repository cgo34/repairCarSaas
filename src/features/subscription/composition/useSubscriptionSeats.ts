import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { ISubscriptionState } from '@/features/subscription/presentation/state/ISubscriptionState';
import { IOrganizationMemberUseCase } from '@/features/organizations/application/useCases/OrganizationMemberUseCase';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { createUseSubscriptionSeats } from '@/features/subscription/presentation/composables/useSubscriptionSeats';

export function useSubscriptionSeats() {
  return createUseSubscriptionSeats({
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
    subscriptionState: container.get<ISubscriptionState>(SYMBOLS.States.SubscriptionState),
    memberUseCase: container.get<IOrganizationMemberUseCase>(SYMBOLS.UseCases.OrganizationMemberUseCase),
  });
}
