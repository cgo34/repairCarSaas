import { SettingPriceGeneralApiModel } from '@/@infrastructure/database/api/settings/price/SettingPriceGeneralApiModel';
import { SettingPriceGeneralDto } from '@/@application/dtos/settings/price/SettingPriceGeneralDto';

export class SettingPriceGeneralMapper {
  static apiToDto(apiModel: SettingPriceGeneralApiModel): SettingPriceGeneralDto {
    return {
      id: apiModel.id,
      userId: apiModel.organization_id,
      hourlyRate: apiModel.hourly_rate,
      unitTime: apiModel.unit_time,
    };
  }

  static dtoToApi(dto: SettingPriceGeneralDto): SettingPriceGeneralApiModel {
    return {
      id: dto.id ?? undefined,
      organization_id: dto.userId,
      hourly_rate: dto.hourlyRate,
      unit_time: dto.unitTime,
    };
  }
}
