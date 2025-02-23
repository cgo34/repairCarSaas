import { SettingPriceDiameterCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceDiameterCoefficientDto';
import { SettingPriceDiameterCoefficientApiModel } from '@/@infrastructure/database/api/settings/price/SettingPriceDiameterCoefficientApiModel';

export class SettingPriceDiameterCoefficientMapper {
  static apiToDto(apiModel: SettingPriceDiameterCoefficientApiModel): SettingPriceDiameterCoefficientDto {
    return {
      id: apiModel.id,
      userId: apiModel.user_id,
      diameter: apiModel.diameter,
      coefficient: apiModel.coefficient,
    };
  }

  static dtoToApi(dto: SettingPriceDiameterCoefficientDto): SettingPriceDiameterCoefficientApiModel {
    return {
      id: dto.id,
      user_id: dto.userId,
      diameter: dto.diameter,
      coefficient: dto.coefficient,
    };
  }
}
