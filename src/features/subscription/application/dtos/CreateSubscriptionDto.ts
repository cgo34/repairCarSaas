import { SubscriptionStatus } from "@/features/subscription/domain/types/SubscriptionStatus";

export type CreateSubscriptionDto = {
  organizationId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: Date;
}