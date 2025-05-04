export interface SubscriptionInsertDto {
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'incomplete';
  startDate: Date;
}

export interface ISubscriptionRepository {
  getPlanByName(name: 'free' | 'silver' | 'gold'): Promise<{ id: string } | null>;
  createSubscription(data: SubscriptionInsertDto): Promise<void>;
}
