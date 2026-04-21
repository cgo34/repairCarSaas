export interface SubscriptionPlanDto {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  stripePriceId?: string;
  createdAt: string;
}
