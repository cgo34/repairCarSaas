import { SubscriptionDto } from "@/@application/dtos/SubscriptionDto";

export interface ISubscriptionUseCase {
  execute(userId: string): Promise<SubscriptionDto>;
}
