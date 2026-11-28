import { SubscriptionApiModel } from '@/features/subscription/infrastructure/api/SubscriptionApiModel';
import { UserRole } from '@/features/users/domain/enums/UserRole';
import { PlatformRole } from '@/features/users/domain/enums/PlatformRole';

export type UserDto = {
  id: string;
  email: string;
  full_name?: string;
  fullName?: string;
  phone?: string | null;
  first_name?: string;
  firstName?: string;
  last_name?: string;
  lastName?: string;
  isBlocked?: boolean;
  platformRole?: PlatformRole;
  percentageCommission?: number;
  role?: UserRole;
  subscription?: SubscriptionApiModel;
}