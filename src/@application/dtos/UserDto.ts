import { SubscriptionApiModel } from '../../@infrastructure/database/api/SubscriptionApiModel';

export interface UserDto {
  id?: string;
  email: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'garage' | 'technician' | 'independant_technician' | 'user';
  subscription?: SubscriptionApiModel;
  percentageCommission?: number;
  isBlocked?: boolean;
}