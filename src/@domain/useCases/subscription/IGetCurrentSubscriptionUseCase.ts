import { SubscriptionDto } from "@/@application/dtos/SubscriptionDto";

export interface IGetCurrentSubscriptionUseCase {
  execute(userId: string): Promise<SubscriptionDto>;
}
