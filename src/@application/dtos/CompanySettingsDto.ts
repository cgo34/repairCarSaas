export interface CompanySettingsDto {
  id?: string;
  userId: string;
  companyName?: string;
  legalForm?: string;
  siren?: string;
  siret?: string;
  tvaNumber?: string;
  capital?: string;
  address?: string;
  zipCode?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  iban?: string;
  bic?: string;
  paymentDelay?: number;
  latePaymentPenalty?: string;
  recoveryFee?: string;
  logoUrl?: string;
}
