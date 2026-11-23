import { SubscriptionApiModel } from '@/features/subscription/infrastructure/api/SubscriptionApiModel';

export interface User {
  id: string;
  email: string;
  fullName?: string;
  createdAt: Date;
  subscription?: SubscriptionApiModel;
}