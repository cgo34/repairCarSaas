import { SettingPriceBodyPartCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceBodyPartCoefficientDto';
import { SettingPriceBodyPartCoefficientApiModel } from '@/@infrastructure/database/api/settings/price/SettingPriceBodyPartCoefficientApiModel';

export class SettingPriceBodyPartCoefficientMapper {
  static apiToDto(apiModel: SettingPriceBodyPartCoefficientApiModel): SettingPriceBodyPartCoefficientDto {
    return {
      id: apiModel.id,
      userId: apiModel.user_id,
      bodyPartId: apiModel.body_part_id,
      coefficient: apiModel.difficulty_coefficient,
    };
  }

  static dtoToApi(dto: SettingPriceBodyPartCoefficientDto): SettingPriceBodyPartCoefficientApiModel {
    return {
      id: dto.id,
      user_id: dto.userId,
      body_part_id: dto.bodyPartId,
      difficulty_coefficient: dto.coefficient,
    };
  }
}
