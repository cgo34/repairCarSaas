import { OrganizationMemberStatusDtoTypes } from '@/@application/dtos/organizations/OrganizationMemberStatusDtoType';

export type OrganizationMemberUserViewModel = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};

export type OrganizationMemberViewModel = {
  id: string;

  organization_id: string;
  user_id: string;

  role: 'technician' | 'manager' | 'admin';

  percentage_commission: number;

  status: OrganizationMemberStatusDtoTypes;

  users: OrganizationMemberUserViewModel;
};