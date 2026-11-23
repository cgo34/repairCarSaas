// application/useCases/subscription/GetCurrentSubscriptionUseCase.ts

import { SubscriptionDto } from '@/features/subscription/application/dtos/SubscriptionDto'
import { ISubscriptionRepository } from '@/features/subscription/application/ports/repositories/ISubscriptionRepository'

export interface ISubscriptionUseCase {
  execute(userId: string): Promise<SubscriptionDto>;
}

export interface IGetCurrentSubscriptionUseCase {
  execute(userId: string): Promise<SubscriptionDto>;
  executeForOrganization(organizationId: string): Promise<SubscriptionDto | null>;
}

export class GetCurrentSubscriptionUseCase implements ISubscriptionUseCase, IGetCurrentSubscriptionUseCase {
  constructor(
    private readonly repository: ISubscriptionRepository
  ) {}

  async execute(userId: string): Promise<SubscriptionDto> {
    return this.repository.getSubscriptionByUserId(userId);
  }

  async executeForOrganization(organizationId: string): Promise<SubscriptionDto | null> {
    return this.repository.getSubscriptionByOrganizationId(organizationId);
  }
}
