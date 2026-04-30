import { SubscriptionApiModel } from '../../@infrastructure/database/api/SubscriptionApiModel';

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  subscription?: SubscriptionApiModel;
  percentageCommission?: number;
}