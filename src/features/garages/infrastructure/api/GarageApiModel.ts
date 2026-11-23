export interface GarageApiModel {
  id?: string;
  organization_id: string;
  name: string;
  code: string;
  address: string;
  zip_code: string;
  city: string;
  phone: string;
  email: string;
  archived_at?: string | null;
  percentage_commission?: number | null;
}
