import { SubscriptionApiModel } from "./SubscriptionApiModel";

export interface UserApiModel {
  id?: string;
  email: string;
  full_name: string;
  role: 'technician' | 'garage' | 'admin' | 'independant_technician' | 'user';
  subscription?: SubscriptionApiModel;
  percentage_commission?: number;
}