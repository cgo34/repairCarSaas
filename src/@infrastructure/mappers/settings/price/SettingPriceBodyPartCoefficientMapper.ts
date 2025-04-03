import { SettingPriceBodyPartCoefficientApiModel } from '@/@infrastructure/database/api/settings/price/SettingPriceBodyPartCoefficientApiModel';
import { SettingPriceBodyPartCoefficientDto } from '@/@infrastructure/dtos/settings/price/SettingPriceBodyPartCoefficientDto';

export class SettingPriceBodyPartCoefficientMapper {
  static apiToDto(apiModel: SettingPriceBodyPartCoefficientApiModel): SettingPriceBodyPartCoefficientDto {
    return {
      userId: apiModel.user_id,
      bodyPartId: apiModel.body_part_id,
      coefficient: apiModel.difficulty_coefficient,
      bodyParts: apiModel.body_parts,
    };
  }

  static dtoToApi(dto: SettingPriceBodyPartCoefficientDto): SettingPriceBodyPartCoefficientApiModel {
    console.log('dto to api body part', dto);
    
    return {
      user_id: dto.userId,
      body_part_id: dto.bodyPartId,
      difficulty_coefficient: dto.coefficient,
      body_parts: dto.bodyParts
    };
  }
}
