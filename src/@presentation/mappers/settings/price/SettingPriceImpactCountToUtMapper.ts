import { SettingPriceImpactCountToUtViewDto } from '@/@application/dtos/settings/SettingPriceImpactCountToUtViewDto';
import { SettingPriceImpactCountToUtViewModel } from '@/@presentation/types/models/settings/price/SettingPriceImpactCountToUtViewModel';

export class SettingPriceImpactCountToUtMapper {
  static viewToDto(viewModel: SettingPriceImpactCountToUtViewModel): SettingPriceImpactCountToUtViewDto {
    return {
      id: viewModel.id ?? '',
      userId: viewModel.userId,
      impactCountMin: viewModel.impactCountMin,
      impactCountMax: viewModel.impactCountMax,
      unitTime: viewModel.unitTime
    };
  }

  static dtoToView(dto: SettingPriceImpactCountToUtViewDto): SettingPriceImpactCountToUtViewModel {
    return {
      id: dto.id,
      userId: dto.userId,
      impactCountMin: dto.impactCountMin,
      impactCountMax: dto.impactCountMax,
      unitTime: dto.unitTime
    };
  }
}
