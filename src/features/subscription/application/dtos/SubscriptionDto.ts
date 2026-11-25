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
  /** Effective feature values (plan + grants). number = limit, null = unlimited, boolean = flag. */
  features: Record<string, number | boolean | null>;
  /** Effective seat limit from `max_seats` feature; 0 = unlimited. */
  seatsLimit: number;
  startDate: string;
  endDate: string | null;
  createdAt: string | null;
  subscriptionPlan: SubscriptionPlanDto;
  organizationId: string;
}
