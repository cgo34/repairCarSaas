import { OrganizationMemberStatusApiTypes } from "./OrganizationMemberStatusApiTypes";
import { UserApiModel } from "@/features/users/infrastructure/api/UserApiModel";

export type OrganizationMemberApiModel = {
  id?: string;
  user_id: string;
  organization_id: string;
  role: 'technician' | 'manager' | 'admin';
  percentage_commission: number;
  created_at: string;
  status: OrganizationMemberStatusApiTypes;
  users: UserApiModel;
};
