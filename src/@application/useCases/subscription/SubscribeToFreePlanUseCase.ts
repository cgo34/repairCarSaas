// application/useCases/subscription/SubscribeToFreePlanUseCase.ts
import { ISubscriptionRepository } from '@domain/repositories/ISubscriptionRepository';
import { SYMBOLS } from '@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SubscribeToFreePlanUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.SubscriptionRepository)
    private readonly subscriptionRepository: ISubscriptionRepository
  ) {}

  async execute(userId: string): Promise<void> {
    
    const freePlan = await this.subscriptionRepository.getPlanByName('free')
    
    if (!freePlan)
      throw new Error('Free plan not found')

    await this.subscriptionRepository.createSubscription({
      userId,
      planId: freePlan.id,
      status: 'active',
      startDate: new Date()
    })
  }
}
