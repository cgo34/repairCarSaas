import { CreateSubscriptionDto } from "@/features/subscription/application/dtos/CreateSubscriptionDto";
import { SubscriptionDto } from "@/features/subscription/application/dtos/SubscriptionDto";

export interface ISubscriptionRepository {
  getPlanByCode(name: string): Promise<{ id: string } | null>;
  createSubscription(data: CreateSubscriptionDto): Promise<void>;
  getSubscriptionByUserId(userId: string): Promise<SubscriptionDto>;
  getSubscriptionByOrganizationId(organizationId: string): Promise<SubscriptionDto | null>;
}
