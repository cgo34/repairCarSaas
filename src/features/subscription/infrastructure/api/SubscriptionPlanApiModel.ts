export type SubscriptionPlanApiModel = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  price_cents: number;
  stripe_price_id?: string | null;
  created_at: string | null;
}