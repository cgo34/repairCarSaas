import { SubscriptionStatus } from "@/@domain/types/SubscriptionStatus";

export type CreateSubscriptionDto = {
  organizationId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: Date;
}