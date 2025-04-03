import { SettingPriceDiameterCoefficientViewDto } from '@/@application/dtos/settings/SettingPriceDiameterCoefficientViewType';
import { SettingPriceDiameterCoefficientViewModel } from '@/@presentation/types/models/settings/price/SettingPriceDiameterCoefficientViewModel';

export class SettingPriceDiameterCoefficientMapper {
  static viewToDto(viewModel: SettingPriceDiameterCoefficientViewModel): SettingPriceDiameterCoefficientViewDto {
    return {
      id: viewModel.id ?? '',
      userId: viewModel.userId,
      diameter: viewModel.diameter,
      coefficient: viewModel.coefficient
    };
  }

  static dtoToView(dto: SettingPriceDiameterCoefficientViewDto): SettingPriceDiameterCoefficientViewModel {
    return {
      id: dto.id,
      userId: dto.userId,
      diameter: dto.diameter,
      coefficient: dto.coefficient
    };
  }
}
