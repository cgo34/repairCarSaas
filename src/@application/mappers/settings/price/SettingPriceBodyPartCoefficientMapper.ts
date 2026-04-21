import { SettingPriceBodyPartCoefficientDto } from '@/@infrastructure/dtos/settings/price/SettingPriceBodyPartCoefficientDto';
import { SettingPriceBodyPartCoefficientViewModel } from '@/@presentation/types/models/settings/price/SettingPriceBodyPartCoefficientViewModel';
import { BodyPartViewModel } from '@/@presentation/types/models/carRepair/BodyPartViewModel';

export class SettingPriceBodyPartCoefficientMapper {
  static dtoToViewModel(dto: SettingPriceBodyPartCoefficientDto): SettingPriceBodyPartCoefficientViewModel {
    return {
      userId: dto.userId,
      coefficient: dto.coefficient,
      bodyPartId: dto.bodyPartId ?? '',
      bodyParts: {
        id: dto.bodyParts?.id,
        name: dto.bodyParts?.name ?? '',
        code: dto.bodyParts?.code ?? '',
        color: dto.bodyParts?.color
      }
    };
  }

  static viewModelToDto(viewModel: SettingPriceBodyPartCoefficientViewModel): SettingPriceBodyPartCoefficientDto {
    return {
      userId: viewModel.userId,
      coefficient: viewModel.coefficient,
      bodyPartId: viewModel.bodyPartId,
      bodyParts: {
        id: viewModel.bodyParts.id ?? '',
        name: viewModel.bodyParts.name,
        code: viewModel.bodyParts.code,
        color: viewModel.bodyParts.color
      }
    };
  }
}
