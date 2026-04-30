import { SubscriptionPlanDto } from './SubscriptionPlanDto';

export interface SubscriptionDto {
  id: string;
  planId: string;
  stripeSubscriptionId?: string;
  status: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  subscriptionPlan: SubscriptionPlanDto;
  organizationId: string;
}
