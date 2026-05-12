export type OrganizationMemberViewModel = {
  id?: string;
  user_id?: string;
  organization_id: string;
  role: string;
  first_name: string;
  last_name: string;
  email: string;
  percentage_commission: number;
};