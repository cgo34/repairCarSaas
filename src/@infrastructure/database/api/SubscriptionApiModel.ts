import { SubscriptionPlanApiModel } from "./SubscriptionPlanApiModel";

export type SubscriptionApiModel = {
  id: string;
  organization_id: string;
  plan_id: string;
  stripe_subscription_id?: string | null;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
  subscriptionPlan: SubscriptionPlanApiModel;
}