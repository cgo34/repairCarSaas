export type CountryApiModel = {
  id: string;
  name: string;
  code: string;
  currency: string;
  currencySymbol: string;
  flagUrl: string;
  phoneCode: string;
  taxRate: number;
};

export type CountryApiModelOrString = CountryApiModel | string;