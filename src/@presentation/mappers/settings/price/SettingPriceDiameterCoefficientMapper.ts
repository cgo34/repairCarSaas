import { SettingPriceDiameterCoefficientDto } from '@/@infrastructure/dtos/settings/price/SettingPriceDiameterCoefficientDto';
import { SettingPriceDiameterCoefficientViewModel } from '@/@presentation/types/models/settings/price/SettingPriceDiameterCoefficientViewModel';

export class SettingPriceDiameterCoefficientMapper {
  static viewToDto(viewModel: SettingPriceDiameterCoefficientViewModel): SettingPriceDiameterCoefficientDto {
    return {
      id: viewModel.id,
      userId: viewModel.userId,
      diameter: viewModel.diameter,
      coefficient: viewModel.coefficient
    };
  }

  static dtoToView(dto: SettingPriceDiameterCoefficientDto): SettingPriceDiameterCoefficientViewModel {
    return {
      id: dto.id,
      userId: dto.userId,
      diameter: dto.diameter,
      coefficient: dto.coefficient
    };
  }
}
