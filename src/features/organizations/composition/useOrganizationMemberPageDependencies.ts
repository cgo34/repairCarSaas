import { IUseOrganizationMember } from '@/features/organizations/presentation/types/IUseOrganizationMember';
import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { ISubscriptionState } from '@/features/subscription/presentation/state/ISubscriptionState';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';

export function useOrganizationMemberPageDependencies() {
  return {
    useOrganizationMember: container.get<IUseOrganizationMember>(SYMBOLS.States.OrganizationMemberState),
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
    subscriptionState: container.get<ISubscriptionState>(SYMBOLS.States.SubscriptionState),
  };
}
