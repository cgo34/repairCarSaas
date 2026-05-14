import { SubscriptionApiModel } from '../../@infrastructure/database/api/SubscriptionApiModel';

export type UserDto = {
  id: string;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  subscription?: SubscriptionApiModel;
}