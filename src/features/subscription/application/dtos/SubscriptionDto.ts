import { SubscriptionPlanDto } from './SubscriptionPlanDto';

export interface SubscriptionDto {
  id: string;
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
  subscriptionPlan: SubscriptionPlanDto;
  organizationId: string;
}
