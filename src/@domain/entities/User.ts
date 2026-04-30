import { SubscriptionApiModel } from '@/@infrastructure/database/api/SubscriptionApiModel';

export interface User {
  id: string;
  email: string;
  fullName?: string;
  createdAt: Date;
  subscription?: SubscriptionApiModel;
}