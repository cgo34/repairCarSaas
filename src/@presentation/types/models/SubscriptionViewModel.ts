import { SubscriptionPlanViewModel } from './SubscriptionPlanViewModel';

export type SubscriptionViewModel = {
  id: string;
  userId: string;
  planId: string;
  stripeSubscriptionId?: string;
  status: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  subscriptionPlan: SubscriptionPlanViewModel;
};
