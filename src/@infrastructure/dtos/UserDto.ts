import { SubscriptionApiModel } from "../database/api/SubscriptionApiModel";

export interface UserDto {
  id?: string;
  email: string;
  fullName: string;
  role: 'technician' | 'garage' | 'admin'; // mise à jour ici
  subscription: SubscriptionApiModel
}