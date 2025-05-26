export type SubscriptionPlanApiModel = {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  stripe_price_id?: string;
  createdAt: string;
}