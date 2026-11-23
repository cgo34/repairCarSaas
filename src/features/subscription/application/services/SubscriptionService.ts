import { ISubscriptionRepository } from "@/features/subscription/application/ports/repositories/ISubscriptionRepository";
import { ISubscriptionService } from "./ISubscriptionService";

export class SubscriptionService implements ISubscriptionService {
  constructor(
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