import { SubscriptionPlanApiModel } from "./SubscriptionPlanApiModel";

export type SubscriptionApiModel = {
  id: string;
  organization_id: string;
  plan_id: string;
  stripe_subscription_id?: string | null;
  status: string;
  included_seats: number;
  extra_seats: number;
  extra_seat_price: number;
  max_seats: number | null;
  start_date: string;
  end_date: string | null;
  created_at: string | null;
  subscriptionPlan: SubscriptionPlanApiModel;
}