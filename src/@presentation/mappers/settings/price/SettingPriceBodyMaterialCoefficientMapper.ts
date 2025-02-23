import { SettingPriceBodyMaterialCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceBodyMaterialCoefficientDto';
import { SettingPriceBodyMaterialCoefficientViewModel } from '@/@presentation/types/models/settings/price/SettingPriceBodyMaterialCoefficientViewModel';

export class SettingPriceBodyMaterialCoefficientMapper {
  static viewToDto(viewModel: SettingPriceBodyMaterialCoefficientViewModel): SettingPriceBodyMaterialCoefficientDto {
    return {
      id: viewModel.id,
      userId: viewModel.userId,
      bodyMaterialId: viewModel.bodyMaterialId,
      coefficient: viewModel.coefficient
    };
  }

  static dtoToView(dto: SettingPriceBodyMaterialCoefficientDto): SettingPriceBodyMaterialCoefficientViewModel {
    return {
      id: dto.id,
      userId: dto.userId,
      bodyMaterialId: dto.bodyMaterialId,
      coefficient: dto.coefficient
    };
  }
}
