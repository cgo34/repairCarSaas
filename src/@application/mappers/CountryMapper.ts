import { CountryViewModel } from "@/@presentation/types/models/CountryViewModel";
import { CountryDto } from "../dtos/CountryDto";

export class CountryMapper {
  static dtoToView(dto: CountryDto): CountryViewModel {
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

  static viewToDto(view: CountryViewModel): CountryDto {
    return {
      id: view.id,
      name: view.name,
      code: view.code,
      currency: view.currency,
      currencySymbol: view.currencySymbol,
      flagUrl: view.flagUrl,
      phoneCode: view.phoneCode,
      taxRate: view.taxRate
    };
  }
}