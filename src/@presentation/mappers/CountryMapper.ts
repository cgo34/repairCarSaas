import { CountryDtoOrString } from "@/@application/dtos/CountryDto";
import { CountryViewModelOrString } from "@/@presentation/types/models/CountryViewModel";

export class CountryMapper {
  static viewToDto(viewModel: CountryViewModelOrString): CountryDtoOrString {
    if (typeof viewModel === 'string') {
      return viewModel;
    }
    return {
      id: viewModel.id,
      name: viewModel.name,
      code: viewModel.code,
      currency: viewModel.currency,
      currencySymbol: viewModel.currencySymbol,
      flagUrl: viewModel.flagUrl,
      phoneCode: viewModel.phoneCode,
      taxRate: viewModel.taxRate,
    };
  }

  static dtoToView(dto: CountryDtoOrString): CountryViewModelOrString {
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
      taxRate: dto.taxRate,
    };
  }
}
