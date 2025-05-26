import { GetCurrentSubscriptionUseCase } from '@application/useCases/subscription/GetCurrentSubscriptionUseCase'
import { SYMBOLS } from '@infrastructure/ioc/symbols'
import { inject, injectable } from 'inversify'
import { ref, Ref } from 'vue'
import { SubscriptionDto } from '../dtos/SubscriptionDto'
import { ISubscriptionState } from './interfaces/ISubscriptionState'

@injectable()
export class SubscriptionState implements ISubscriptionState {
  public subscription: Ref<SubscriptionDto> = ref()
  public isLoading: Ref<boolean> = ref(false)

  constructor(
    @inject(SYMBOLS.UseCases.Subscription.GetCurrentSubscriptionUseCase)
    private readonly getCurrentSubscription: GetCurrentSubscriptionUseCase
  ) {}

  async load(userId: string): Promise<SubscriptionDto> {
    this.isLoading.value = true
    this.subscription.value = await this.getCurrentSubscription.execute(userId)
    console.log('subscription', this.subscription.value);
    
    this.isLoading.value = false

    return this.subscription.value
  }
}
