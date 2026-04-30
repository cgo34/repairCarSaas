import { SubscriptionPlanViewModel } from './SubscriptionPlanViewModel';

export type SubscriptionViewModel = {
  id: string;
  organization_id: string;
  planId: string;
  stripeSubscriptionId?: string;
  status: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  subscriptionPlan: SubscriptionPlanViewModel;
};
