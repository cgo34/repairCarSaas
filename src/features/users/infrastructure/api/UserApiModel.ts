import { SubscriptionApiModel } from "@/features/subscription/infrastructure/api/SubscriptionApiModel";
import { PlatformRole } from "@/features/users/domain/enums/PlatformRole";

export interface UserApiModel {
  id: string;
  subscription?: SubscriptionApiModel;
  email: string;
  full_name: string;
  phone?: string | null;
  first_name?: string;
  last_name?: string;
  is_blocked?: boolean;
  platform_role?: PlatformRole;
  percentage_commission?: number;
}