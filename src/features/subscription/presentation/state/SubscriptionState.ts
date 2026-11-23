import { GetCurrentSubscriptionUseCase } from '@/features/subscription/application/useCases/GetCurrentSubscriptionUseCase'
import { ref, Ref } from 'vue'
import { SubscriptionDto } from '@/features/subscription/application/dtos/SubscriptionDto'
import { ISubscriptionState } from './ISubscriptionState'

export class SubscriptionState implements ISubscriptionState {
  public subscription: Ref<SubscriptionDto | undefined> = ref()
  public isLoading: Ref<boolean> = ref(false)

  constructor(
    private readonly getCurrentSubscription: GetCurrentSubscriptionUseCase
  ) {}

  async load(userId: string): Promise<SubscriptionDto> {
    this.isLoading.value = true
    const subscription = await this.getCurrentSubscription.execute(userId)
    this.subscription.value = subscription
    this.isLoading.value = false

    return subscription
  }

  async loadForOrganization(organizationId: string): Promise<SubscriptionDto | null> {
    this.isLoading.value = true
    try {
      const subscription = await this.getCurrentSubscription.executeForOrganization(organizationId)
      this.subscription.value = subscription ?? undefined
      return subscription
    } finally {
      this.isLoading.value = false
    }
  }
}
