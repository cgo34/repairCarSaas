export type SubscriptionPlanViewModel = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  priceCents: number;
  stripePriceId?: string;
  createdAt: string | null;
};
