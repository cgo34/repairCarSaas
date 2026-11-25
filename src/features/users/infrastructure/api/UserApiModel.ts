import { SubscriptionApiModel } from "@/features/subscription/infrastructure/api/SubscriptionApiModel";

export interface UserApiModel {
  id: string;
  subscription?: SubscriptionApiModel;
  email: string;
  full_name: string;
  phone?: string | null;
  first_name?: string;
  last_name?: string;
  is_blocked?: boolean;
  percentage_commission?: number;
}