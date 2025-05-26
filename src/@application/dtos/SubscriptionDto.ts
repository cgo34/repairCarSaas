import { SubscriptionPlanDto } from "./SubscriptionPlanDto";

export type SubscriptionDto = {
  id: string;
  userId: string;
  planId: string;
  stripeSubscriptionId?: string;
  status: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  subscriptionPlan: SubscriptionPlanDto;
}