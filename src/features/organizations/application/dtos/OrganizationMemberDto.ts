import { UserDto } from "@/features/users/application/dtos/UserDto";

export type OrganizationMemberDto = {
  id?: string;
  user_id: string;
  organization_id: string;
  role: 'technician' | 'manager' | 'admin';
  percentage_commission: number;
  status: 'active' | 'pending' | 'blocked' | 'archived';
  created_at: string;
  users: UserDto;
};
