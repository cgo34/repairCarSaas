import { SettingPriceBodyPartCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceBodyPartCoefficientDto';
import { SettingPriceBodyPartCoefficientViewModel } from '@/@presentation/types/models/settings/price/SettingPriceBodyPartCoefficientViewModel';

export class SettingPriceBodyPartCoefficientMapper {
  static viewToDto(viewModel: SettingPriceBodyPartCoefficientViewModel): SettingPriceBodyPartCoefficientDto {
    return {
      id: viewModel.id,
      userId: viewModel.userId,
      bodyPartId: viewModel.bodyPartId,
      coefficient: viewModel.coefficient
    };
  }

  static dtoToView(dto: SettingPriceBodyPartCoefficientDto): SettingPriceBodyPartCoefficientViewModel {
    return {
      id: dto.id,
      userId: dto.userId,
      bodyPartId: dto.bodyPartId,
      coefficient: dto.coefficient
    };
  }
}
