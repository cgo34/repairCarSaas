

import { IAuthRepository } from '@/features/auth/application/ports/repositories/IAuthRepository';
import { IOrganizationRepository } from '@/features/organizations/application/ports/repositories/IOrganizationRepository';
import { IOrganizationMemberRepository } from '@/features/organizations/application/ports/repositories/IOrganizationMemberRepository';
import { ISubscriptionRepository } from '@/features/subscription/application/ports/repositories/ISubscriptionRepository';
import { AuthenticatedUserDto } from '@/features/auth/application/dtos/AuthenticatedUserDto';

export interface IAuthenticatedUserContextUseCase {
  execute(): Promise<AuthenticatedUserDto>;
  hasActiveSession(): Promise<boolean>;
}

export class GetAuthenticatedUserContextUseCase implements IAuthenticatedUserContextUseCase {
  constructor(
    private authRepository: IAuthRepository,

    private organizationRepository: IOrganizationRepository,

    private organizationMemberRepository: IOrganizationMemberRepository,

    private subscriptionRepository: ISubscriptionRepository,
  ) {}

  async hasActiveSession(): Promise<boolean> {
    const session = await this.authRepository.getUserSession();
    return !!session?.data?.session;
  }

  async execute(): Promise<AuthenticatedUserDto> {
    // ───────────────────────────────────────────────────────
    // Get authenticated user session
    // ───────────────────────────────────────────────────────
    const session = await this.authRepository.getUserSession();

    const authUser = session.data.session?.user;

    if (!authUser) {
      throw new Error('Authenticated user not found');
    }


  const userProfile = await this.authRepository.getCurrentUser();

    if (userProfile?.isBlocked) {
      await this.authRepository.logout();
      throw new Error("ACCOUNT_BLOCKED");
    }

    // ───────────────────────────────────────────────────────
    // Get organization membership
    // ───────────────────────────────────────────────────────
    const membership =
      await this.organizationMemberRepository.getByMemberId(authUser.id);

    const member = membership[0];

    if (!member?.id) {
      throw new Error('Organization membership not found');
    }

    // ───────────────────────────────────────────────────────
    // Get organization
    // ───────────────────────────────────────────────────────
    const organization =
      await this.organizationRepository.getById(
        member.organization_id
      );

    if (!organization) {
      throw new Error('Organization not found');
    }

    // ───────────────────────────────────────────────────────
    // Get subscription
    // ───────────────────────────────────────────────────────
    const subscription =
      await this.subscriptionRepository.getSubscriptionByOrganizationId(
        member.organization_id
      );
      
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    // ───────────────────────────────────────────────────────
    // Return authenticated user context
    // ───────────────────────────────────────────────────────
    return {
      id: authUser.id,
      email: authUser.email ?? '',
      fullName: authUser?.user_metadata?.fullName ?? '',
      firstName: userProfile?.firstName ?? '',
      lastName: userProfile?.lastName ?? '',

      organization: {
        id: member.organization_id,
        name: organization.name,
        ownerUserId: organization.owner_user_id,
      },

      membership: { ...member, id: member.id },

      subscription: {
        id: subscription.id,
        plan: subscription.subscriptionPlan.name,
        status: subscription.status,
      },
    };
  }
}
