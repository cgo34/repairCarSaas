import { SubscriptionApiModel } from '../database/api/SubscriptionApiModel';

export interface UserDto {
  id?: string;
  email: string;
  fullName: string;
  role: 'admin' | 'garage' | 'technician' | 'independant_technician' | 'user';
  subscription?: SubscriptionApiModel;
  percentageCommission?: number;
}