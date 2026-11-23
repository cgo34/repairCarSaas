// application/useCases/subscription/SubscribeToFreePlanUseCase.ts
import { ISubscriptionRepository } from '@/features/subscription/application/ports/repositories/ISubscriptionRepository';

export interface ISubscribeToFreePlanUseCase {
  execute(organizationId: string): Promise<void>;
}

export class SubscribeToFreePlanUseCase implements ISubscribeToFreePlanUseCase {
  constructor(
    private readonly subscriptionRepository: ISubscriptionRepository
  ) {}

  async execute(organizationId: string): Promise<void> {
    
    const freePlan = await this.subscriptionRepository.getPlanByCode('FREE')
    
    if (!freePlan)
      throw new Error('Free plan not found')

    await this.subscriptionRepository.createSubscription({
      organizationId,
      planId: freePlan.id,
      status: 'active',
      startDate: new Date()
    })
  }
}
