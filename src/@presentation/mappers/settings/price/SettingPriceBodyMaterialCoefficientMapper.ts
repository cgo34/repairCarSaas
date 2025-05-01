import { SettingPriceBodyMaterialCoefficientViewDto } from '@/@application/dtos/settings/SettingPriceBodyMaterialCoefficientViewDto';
import { SettingPriceBodyMaterialCoefficientViewModel } from '@/@presentation/types/models/settings/price/SettingPriceBodyMaterialCoefficientViewModel';

export class SettingPriceBodyMaterialCoefficientMapper {
  static viewToDto(viewModel: SettingPriceBodyMaterialCoefficientViewModel): SettingPriceBodyMaterialCoefficientViewDto {
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

  static dtoToView(dto: SettingPriceBodyMaterialCoefficientViewDto): SettingPriceBodyMaterialCoefficientViewModel {
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
