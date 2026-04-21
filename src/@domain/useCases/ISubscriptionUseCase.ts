import { SubscriptionViewModel } from "@/@presentation/types/models/SubscriptionViewModel";

export interface ISubscriptionUseCase {
  execute(userId: string): Promise<SubscriptionViewModel>;
}
