export type CountryDto = {
  id: string;
  name: string;
  code: string;
  currency: string;
  currencySymbol: string;
  flagUrl: string;
  phoneCode: string;
  taxRate: number;
};

export type CountryDtoOrString = CountryDto | string;