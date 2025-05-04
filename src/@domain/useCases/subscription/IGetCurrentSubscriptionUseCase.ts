import { SubscriptionInsertDto } from "@/@domain/repositories/ISubscriptionRepository";

export interface IGetCurrentSubscriptionUseCase {
  execute(userId: string): Promise<SubscriptionInsertDto>;
}
