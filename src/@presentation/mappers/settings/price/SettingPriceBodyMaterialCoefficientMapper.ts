import { SettingPriceBodyMaterialCoefficientDto } from '@/@infrastructure/dtos/settings/price/SettingPriceBodyMaterialCoefficientDto';
import { SettingPriceBodyMaterialCoefficientViewModel } from '@/@presentation/types/models/settings/price/SettingPriceBodyMaterialCoefficientViewModel';

export class SettingPriceBodyMaterialCoefficientMapper {
  static viewToDto(viewModel: SettingPriceBodyMaterialCoefficientViewModel): SettingPriceBodyMaterialCoefficientDto {
    return {
      userId: viewModel.userId,
      bodyMaterialId: viewModel.bodyMaterialId,
      bodyMaterials: {
        id: viewModel.bodyMaterials.id ?? '',
        name: viewModel.bodyMaterials.name,
        code: viewModel.bodyMaterials.code,
      },
      coefficient: viewModel.coefficient
    };
  }

  static dtoToView(dto: SettingPriceBodyMaterialCoefficientDto): SettingPriceBodyMaterialCoefficientViewModel {
    return {
      userId: dto.userId,
      bodyMaterialId: dto.bodyMaterialId,
      coefficient: dto.coefficient,
      bodyMaterials: {
        id: dto.bodyMaterials?.id ?? '',
        name: dto.bodyMaterials?.name ?? '',
        code: dto.bodyMaterials?.code ?? '',
      }
    };
  }
}
