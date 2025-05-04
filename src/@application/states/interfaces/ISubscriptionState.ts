import { Ref } from 'vue'
import { SubscriptionDto } from '../models/SubscriptionDto'

export interface ISubscriptionState {
  subscription: Ref<SubscriptionDto | null>
  isLoading: Ref<boolean>
  load(userId: string): Promise<void>
}
