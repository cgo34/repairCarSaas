export type OrganizationMemberForm = {
  id?: string;

  first_name: string;
  last_name: string;
  email: string;

  role: 'technician' | 'manager' | 'admin';

  percentage_commission: number;
};