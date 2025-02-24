import { SettingPriceGeneralDto } from '@/@application/dtos/settings/price/SettingPriceGeneralDto';
import { SettingPriceGeneralApiModel } from '@/@infrastructure/database/api/settings/price/SettingPriceGeneralApiModel';

export class SettingPriceGeneralMapper {
  static apiToDto(apiModel: SettingPriceGeneralApiModel): SettingPriceGeneralDto {
    return {
      id: apiModel.id ?? undefined,
      userId: apiModel.user_id,
      hourlyRate: apiModel.hourly_rate,
      unitTime: apiModel.unit_time,
    };
  }

  static dtoToApi(dto: SettingPriceGeneralDto): SettingPriceGeneralApiModel {
    return {
      id: dto.id ?? undefined,
      user_id: dto.userId,
      hourly_rate: dto.hourlyRate,
      unit_time: dto.unitTime,
    };
  }
}
