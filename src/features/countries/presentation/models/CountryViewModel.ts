export interface CountryViewModel {
  id: string;
  name: string;
  code: string;
  currency: string;
  currencySymbol: string;
  flagUrl: string;
  phoneCode: string;
  taxRate: number;
};

export type CountryViewModelOrString = CountryViewModel | string;