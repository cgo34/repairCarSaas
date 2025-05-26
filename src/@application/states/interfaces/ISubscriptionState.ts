import { SubscriptionDto } from '@/@application/dtos/SubscriptionDto'
import { Ref } from 'vue'

export interface ISubscriptionState {
  subscription: Ref<SubscriptionDto>
  isLoading: Ref<boolean>
  load(userId: string): Promise<SubscriptionDto>
}
