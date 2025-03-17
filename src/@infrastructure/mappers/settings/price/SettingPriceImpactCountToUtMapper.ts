import { SettingPriceImpactCountToUtApiModel } from '@/@infrastructure/database/api/settings/price/SettingPriceImpactCountToUtApiModel';
import { SettingPriceImpactCountToUtDto } from '@/@infrastructure/dtos/settings/price/SettingPriceImpactCountToUtDto';

export class SettingPriceImpactCountToUtMapper {
  static apiToDto(apiModel: SettingPriceImpactCountToUtApiModel): SettingPriceImpactCountToUtDto {
    return {
      id: apiModel.id,
      impactCountMin: apiModel.impact_count_min,
      impactCountMax: apiModel.impact_count_max,
      unitTime: apiModel.unit_time,
      userId: apiModel.user_id,
    };
  }

  static dtoToApi(dto: SettingPriceImpactCountToUtDto): SettingPriceImpactCountToUtApiModel {
    return {
      id: dto.id,
      impact_count_min: dto.impactCountMin,
      impact_count_max: dto.impactCountMax,
      unit_time: dto.unitTime,
      user_id: dto.userId,
    };
  }
}
