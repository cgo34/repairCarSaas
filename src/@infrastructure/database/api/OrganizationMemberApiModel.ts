export type OrganizationMemberApiModel = {
  id?: string;
  user_id: string;
  organization_id: string;
  role: string;
  percentage_commission: number;
  created_at: string;
};
