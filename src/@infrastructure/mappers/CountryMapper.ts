import { CountryDtoOrString } from "../../@application/dtos/CountryDto";
import { CountryApiModelOrString } from "../database/api/CountryApiModel";

export class CountryMapper {
  static dtoToApi(dto: CountryDtoOrString): CountryApiModelOrString {
    if (typeof dto === 'string') {
      return dto;
    }
    return {
      id: dto.id,
      name: dto.name,
      code: dto.code,
      currency: dto.currency,
      currencySymbol: dto.currencySymbol,
      flagUrl: dto.flagUrl,
      phoneCode: dto.phoneCode,
      taxRate: dto.taxRate
    };
  }

  static apiToDto(api: CountryApiModelOrString): CountryDtoOrString {
    if (typeof api === 'string') {
      return api;
    }
    return {
      id: api.id,
      name: api.name,
      code: api.code,
      currency: api.currency,
      currencySymbol: api.currencySymbol,
      flagUrl: api.flagUrl,
      phoneCode: api.phoneCode,
      taxRate: api.taxRate
    };
  }
}