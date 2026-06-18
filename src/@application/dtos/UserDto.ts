import { SubscriptionApiModel } from '../../@infrastructure/database/api/SubscriptionApiModel';

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
  subscription?: SubscriptionApiModel;
}