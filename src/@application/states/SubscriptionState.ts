import { GetCurrentSubscriptionUseCase } from '@application/useCases/subscription/GetCurrentSubscriptionUseCase'
import { SubscriptionDto } from '@domain/models/SubscriptionDto'
import { ISubscriptionState } from '@domain/states/ISubscriptionState'
import { SYMBOLS } from '@infrastructure/ioc/symbols'
import { inject, injectable } from 'inversify'
import { ref, Ref } from 'vue'

@injectable()
export class SubscriptionState implements ISubscriptionState {
  public subscription: Ref<SubscriptionDto | null> = ref(null)
  public isLoading: Ref<boolean> = ref(false)

  constructor(
    @inject(SYMBOLS.UseCases.Subscription.GetCurrentSubscriptionUseCase)
    private readonly getCurrentSubscription: GetCurrentSubscriptionUseCase
  ) {}

  async load(userId: string): Promise<void> {
    this.isLoading.value = true
    this.subscription.value = await this.getCurrentSubscription.execute(userId)
    this.isLoading.value = false
  }
}
