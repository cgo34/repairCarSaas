import { SettingPriceBodyPartCoefficientViewDto } from '@/@application/dtos/settings/SettingPriceBodyPartCoefficientViewType';
import { SettingPriceBodyPartCoefficientViewModel } from '@/@presentation/types/models/settings/price/SettingPriceBodyPartCoefficientViewModel';

export class SettingPriceBodyPartCoefficientMapper {
  static viewToDto(viewModel: SettingPriceBodyPartCoefficientViewModel): SettingPriceBodyPartCoefficientViewDto {
    return {
      userId: viewModel.userId,
      bodyPartId: viewModel.bodyPartId ?? '',
      coefficient: viewModel.coefficient,
      bodyParts: {
        id: viewModel.bodyParts.id ?? '',
        name: viewModel.bodyParts.name,
        code: viewModel.bodyParts.code,
        color: viewModel.bodyParts.color
      }
    };
  }

  static dtoToView(dto: SettingPriceBodyPartCoefficientViewDto): SettingPriceBodyPartCoefficientViewModel {
    return {
      userId: dto.userId,
      bodyPartId: dto.bodyPartId,
      coefficient: dto.coefficient,
      bodyParts: {
        id: dto.bodyParts?.id ?? '',
        name: dto.bodyParts?.name ?? '',
        code: dto.bodyParts?.code ?? '',
        color: dto.bodyParts?.color ?? ''
      }
    };
  }
}
