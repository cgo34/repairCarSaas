import { SubscriptionPlanViewModel } from './SubscriptionPlanViewModel';

export type SubscriptionViewModel = {
  id: string;
  organizationId: string;
  planId: string;
  stripeSubscriptionId?: string;
  status: string;
  includedSeats: number;
  extraSeats: number;
  extraSeatPrice: number;
  maxSeats: number | null;
  startDate: string;
  endDate: string | null;
  createdAt: string | null;
  subscriptionPlan: SubscriptionPlanViewModel;
};
