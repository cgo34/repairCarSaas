import { CreateSubscriptionDto } from "@/@application/dtos/CreateSubscriptionDto";
import { SubscriptionDto } from "@/@application/dtos/SubscriptionDto";

export interface ISubscriptionRepository {
  getPlanByCode(name: string): Promise<{ id: string } | null>;
  createSubscription(data: CreateSubscriptionDto): Promise<void>;
  getSubscriptionByUserId(userId: string): Promise<SubscriptionDto>
}
