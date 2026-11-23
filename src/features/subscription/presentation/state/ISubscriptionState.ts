import { SubscriptionDto } from '@/features/subscription/application/dtos/SubscriptionDto'
import { Ref } from 'vue'

export interface ISubscriptionState {
  subscription: Ref<SubscriptionDto | undefined>
  isLoading: Ref<boolean>
  load(userId: string): Promise<SubscriptionDto>
  loadForOrganization(organizationId: string): Promise<SubscriptionDto | null>
}
