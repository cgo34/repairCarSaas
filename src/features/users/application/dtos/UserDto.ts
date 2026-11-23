import { SubscriptionApiModel } from '@/features/subscription/infrastructure/api/SubscriptionApiModel';
import { UserRole } from '@/features/users/domain/enums/UserRole';

export type UserDto = {
  id: string;
  email: string;
  full_name?: string;
  fullName?: string;
  first_name?: string;
  firstName?: string;
  last_name?: string;
  lastName?: string;
  isBlocked?: boolean;
  percentageCommission?: number;
  role?: UserRole;
  subscription?: SubscriptionApiModel;
}