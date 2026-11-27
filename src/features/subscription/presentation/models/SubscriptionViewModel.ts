import { SubscriptionPlanViewModel } from './SubscriptionPlanViewModel';

export type SubscriptionViewModel = {
  id: string;
  organizationId: string;
  planId: string;
  stripeSubscriptionId?: string;
  status: string;
  features: Record<string, number | boolean | null>;
  seatsLimit: number;
  startDate: string;
  endDate: string | null;
  createdAt: string | null;
  subscriptionPlan: SubscriptionPlanViewModel;
};
