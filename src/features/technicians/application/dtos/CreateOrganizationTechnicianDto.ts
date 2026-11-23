export type CreateOrganizationTechnicianDto = {
  organization_id: string;
  role: 'technician' | 'manager' | 'admin';
  first_name: string;
  last_name: string;
  email: string;
  percentage_commission: number;
};