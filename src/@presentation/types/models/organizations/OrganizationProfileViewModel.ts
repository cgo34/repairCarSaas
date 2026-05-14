export type OrganizationProfileViewModel = {
  id?: string;

  organization_id: string;

  company_name: string;

  legal_form: string;

  siren: string;

  siret: string;

  tva_number: string;

  capital: string;

  address: string;

  zip_code: string;

  city: string;

  country: string;

  phone: string;

  email: string;

  website: string;

  iban: string;

  bic: string;

  payment_delay: number;

  late_payment_penalty: string;

  recovery_fee: string;
};