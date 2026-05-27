import { SubscriptionApiModel } from "./SubscriptionApiModel";

export interface UserApiModel {
  id?: string;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
}