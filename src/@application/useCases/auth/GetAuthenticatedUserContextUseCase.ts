import { inject, injectable } from 'inversify';

import { SYMBOLS } from '@/@infrastructure/ioc/symbols';

import { IAuthRepository } from '@/@domain/repositories/IAuthRepository';
import { IOrganizationRepository } from '@/@domain/repositories/IOrganizationRepository';
import { IOrganizationMemberRepository } from '@/@domain/repositories/IOrganizationMemberRepository';
import { ISubscriptionRepository } from '@/@domain/repositories/ISubscriptionRepository';
import { IAuthenticatedUserContextUseCase } from '@/@domain/useCases/auth/IAuthenticatedUserContextUseCase';
import { AuthenticatedUserDto } from '@/@application/dtos/AuthenticatedUserDto';

@injectable()
export class GetAuthenticatedUserContextUseCase implements IAuthenticatedUserContextUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.AuthRepository)
    private authRepository: IAuthRepository,

    @inject(SYMBOLS.Repositories.OrganizationRepository)
    private organizationRepository: IOrganizationRepository,

    @inject(SYMBOLS.Repositories.OrganizationMemberRepository)
    private organizationMemberRepository: IOrganizationMemberRepository,

    @inject(SYMBOLS.Repositories.SubscriptionRepository)
    private subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(): Promise<AuthenticatedUserDto> {
    // ───────────────────────────────────────────────────────
    // Get authenticated user session
    // ───────────────────────────────────────────────────────
    const session = await this.authRepository.getUserSession();

    const authUser = session.data.session?.user;

    if (!authUser) {
      throw new Error('Authenticated user not found');
    }

    console.log('IN USE CASE : Authenticated user session:', session);
    // ───────────────────────────────────────────────────────
    // Get organization membership
    // ───────────────────────────────────────────────────────
    const membership =
      await this.organizationMemberRepository.getByMemberId(authUser.id);

    if (!membership) {
      throw new Error('Organization membership not found');
    }

    console.log('IN USE CASE : Organization id membership for user', membership, membership.organizationId);

    // ───────────────────────────────────────────────────────
    // Get organization
    // ───────────────────────────────────────────────────────
    const organization =
      await this.organizationRepository.getById(
        membership[0].organization_id
      );

    if (!organization) {
      throw new Error('Organization not found');
    }

    console.log('IN USE CASE : Organization for user', organization);
    // ───────────────────────────────────────────────────────
    // Get subscription
    // ───────────────────────────────────────────────────────
    const subscription =
      await this.subscriptionRepository.getSubscriptionByOrganizationId(
        membership[0].organization_id
      );

      console.log('IN USE CASE : Subscription for organization', subscription);
      
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    // ───────────────────────────────────────────────────────
    // Return authenticated user context
    // ───────────────────────────────────────────────────────
    return {
      id: authUser.id,
      email: authUser.email ?? '',

      organization: {
        id: organization.id,
        name: organization.name,
      },

      membership: {
        role: membership[0].role,
      },

      subscription: {
        id: subscription.id,
        plan: subscription.subscriptionPlan.name,
        status: subscription.status,
      },
    };
  }
}
