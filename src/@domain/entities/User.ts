import { SubscriptionApiModel } from '@/@infrastructure/database/api/SubscriptionApiModel';
import { UserRole } from '@domain/enums/UserRole';

export interface User {
  id: string;
  email: string;
  fullName?: string;
  role: UserRole;
  createdAt: Date;
  subscription?: SubscriptionApiModel;
}