

import { IAuthRepository } from '@/features/auth/application/ports/repositories/IAuthRepository';
import { IOrganizationRepository } from '@/features/organizations/application/ports/repositories/IOrganizationRepository';
import { IOrganizationMemberRepository } from '@/features/organizations/application/ports/repositories/IOrganizationMemberRepository';
import { ISubscriptionRepository } from '@/features/subscription/application/ports/repositories/ISubscriptionRepository';
import { AuthenticatedUserDto } from '@/features/auth/application/dtos/AuthenticatedUserDto';
import { IProvisionOrganizationUseCase } from '@/features/auth/application/useCases/ProvisionOrganizationUseCase';
import { PlatformRole } from '@/features/users/domain/enums/PlatformRole';
import { UserDto } from '@/features/users/application/dtos/UserDto';
import { IDemoProfileRepository } from '@/features/profileSwitcher/application/ports/repositories/IDemoProfileRepository';
import { OrganizationMemberDto } from '@/features/organizations/application/dtos/OrganizationMemberDto';

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

    private provisionOrganizationUseCase: IProvisionOrganizationUseCase,

    private demoProfileRepository: IDemoProfileRepository,
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
    const platformRole: PlatformRole = userProfile?.platformRole ?? 'user';
    const isSuperAdmin = platformRole === 'super_admin';

    let memberships =
      await this.organizationMemberRepository.getByMemberId(authUser.id);

    // Self-registered account whose provisioning did not complete at sign-up
    // (email confirmation, transient failure): idempotent server-side retry.
    if (memberships.length === 0 && !isSuperAdmin) {
      await this.provisionOrganizationUseCase.execute(
        userProfile?.fullName ?? authUser.user_metadata?.fullName ?? ''
      );
      memberships = await this.organizationMemberRepository.getByMemberId(authUser.id);
    }

    // A super_admin acts through the chosen demo profile. Without one,
    // the context is global (no organization scope).
    let member: OrganizationMemberDto | undefined = memberships[0];
    if (isSuperAdmin) {
      const demoContext = await this.demoProfileRepository.getContext();
      member = demoContext
        ? memberships.find(m => m.status === 'active' && m.organization_id === demoContext.organizationId)
        : undefined;
    }

    if (!member?.id) {
      if (isSuperAdmin) {
        return this.buildGlobalContext(authUser.id, authUser.email ?? '', userProfile);
      }
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
      platformRole,
      isGlobalContext: false,

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

  private buildGlobalContext(id: string, email: string, profile: UserDto | null): AuthenticatedUserDto {
    return {
      id,
      email,
      fullName: profile?.fullName ?? '',
      firstName: profile?.firstName ?? '',
      lastName: profile?.lastName ?? '',
      platformRole: 'super_admin',
      isGlobalContext: true,
      // Placeholders: no organization scope. Lowest business role, no data access
      // is granted server-side without an active membership.
      organization: { id: '', name: '' },
      membership: { id: '', percentage_commission: 0, status: 'active', role: 'technician' },
      subscription: { id: '', plan: '', status: 'none' },
    };
  }
}
