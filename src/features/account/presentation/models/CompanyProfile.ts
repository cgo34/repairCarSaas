export interface CompanyProfile {
  // Identité légale
  companyName: string;
  legalForm: string;         // SARL, SAS, EI, Auto-entrepreneur…
  capital?: string;          // Ex: "10 000 €"

  // Numéros officiels
  siren: string;             // 9 chiffres
  siret: string;             // 14 chiffres
  tvaNumber?: string;        // FR + 2 chiffres + SIREN

  // Coordonnées
  address: string;
  zipCode: string;
  city: string;
  country: string;
  phone?: string;
  email?: string;
  website?: string;

  // Bancaire
  iban?: string;
  bic?: string;

  // Facturation
  paymentDelay: number;       // en jours (ex: 30)
  latePaymentPenalty?: string; // ex: "3x le taux légal"
  recoveryFee?: string;        // ex: "40 €"
}

export const defaultCompanyProfile: CompanyProfile = {
  companyName: '',
  legalForm: 'EI',
  capital: '',
  siren: '',
  siret: '',
  tvaNumber: '',
  address: '',
  zipCode: '',
  city: '',
  country: 'FR',
  phone: '',
  email: '',
  website: '',
  iban: '',
  bic: '',
  paymentDelay: 30,
  latePaymentPenalty: '3 fois le taux légal en vigueur',
  recoveryFee: '40 €',
};
