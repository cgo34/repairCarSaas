import { ISubscriptionRepository } from "@/@domain/repositories/ISubscriptionRepository";
import { ISubscriptionService } from "./ISubscriptionService";
import { inject, injectable } from "inversify";
import { SYMBOLS } from "@/@infrastructure/ioc/symbols";

@injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @inject(SYMBOLS.Repositories.SubscriptionRepository)
    private subscriptionRepository: ISubscriptionRepository,
  ) {}

  async activateFreePlanForOrganization(
    organizationId: string,
  ): Promise<void> {

    const freePlan = await this.subscriptionRepository.getPlanByCode('FREE');

    if (!freePlan) {
      throw new Error('FREE plan not found');
    }

    await this.subscriptionRepository.createSubscription({
      organizationId,
      planId: freePlan.id,
      status: 'active',
      startDate: new Date(),
    });
  }
}