import { SettingPriceImpactCountToUtDto } from '@/features/priceSettings/application/dtos/SettingPriceImpactCountToUtDto';
import { SettingPriceImpactCountToUtViewModel } from '@/features/priceSettings/presentation/models/SettingPriceImpactCountToUtViewModel';

export class SettingPriceImpactCountToUtMapper {
  static viewToDto(viewModel: SettingPriceImpactCountToUtViewModel): SettingPriceImpactCountToUtDto {
    return {
      id: viewModel.id ?? '',
      userId: viewModel.userId,
      impactCountMin: viewModel.impactCountMin,
      impactCountMax: viewModel.impactCountMax,
      unitTime: viewModel.unitTime
    };
  }

  static dtoToView(dto: SettingPriceImpactCountToUtDto): SettingPriceImpactCountToUtViewModel {
    return {
      id: dto.id,
      userId: dto.userId,
      impactCountMin: dto.impactCountMin,
      impactCountMax: dto.impactCountMax,
      unitTime: dto.unitTime
    };
  }
}
