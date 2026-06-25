import { SettingPriceImpactCountToUtApiModel } from '@/@infrastructure/database/api/settings/price/SettingPriceImpactCountToUtApiModel';
import { SettingPriceImpactCountToUtDto } from '@/@application/dtos/settings/price/SettingPriceImpactCountToUtDto';

export class SettingPriceImpactCountToUtMapper {
  static apiToDto(apiModel: SettingPriceImpactCountToUtApiModel): SettingPriceImpactCountToUtDto {
    return {
      id: apiModel.id,
      impactCountMin: apiModel.impact_count_min,
      impactCountMax: apiModel.impact_count_max,
      unitTime: apiModel.unit_time,
      userId: apiModel.organization_id,
    };
  }

  static dtoToApi(dto: SettingPriceImpactCountToUtDto): SettingPriceImpactCountToUtApiModel {
    const result: SettingPriceImpactCountToUtApiModel = {
      impact_count_min: dto.impactCountMin,
      impact_count_max: dto.impactCountMax,
      unit_time: dto.unitTime,
      organization_id: dto.userId,
    };
    if (dto.id) {
      result.id = dto.id;
    }
    return result;
  }
}
