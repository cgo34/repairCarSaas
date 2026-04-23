export interface CompanySettingsApiModel {
  id?: string;
  user_id: string;
  company_name?: string;
  legal_form?: string;
  siren?: string;
  siret?: string;
  tva_number?: string;
  capital?: string;
  address?: string;
  zip_code?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  iban?: string;
  bic?: string;
  payment_delay?: number;
  late_payment_penalty?: string;
  recovery_fee?: string;
  created_at?: string;
  updated_at?: string;
}
