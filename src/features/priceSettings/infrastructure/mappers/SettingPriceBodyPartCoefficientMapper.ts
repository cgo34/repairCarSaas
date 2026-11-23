import { SettingPriceBodyPartCoefficientApiModel } from '@/features/priceSettings/infrastructure/api/SettingPriceBodyPartCoefficientApiModel';
import { SettingPriceBodyPartCoefficientDto } from '@/features/priceSettings/application/dtos/SettingPriceBodyPartCoefficientDto';

export class SettingPriceBodyPartCoefficientMapper {
  static apiToDto(apiModel: SettingPriceBodyPartCoefficientApiModel): SettingPriceBodyPartCoefficientDto {
    return {
      userId: apiModel.organization_id,
      bodyPartId: apiModel.body_part_id,
      coefficient: apiModel.difficulty_coefficient,
      bodyParts: apiModel.body_parts,
    };
  }

  static dtoToApi(dto: SettingPriceBodyPartCoefficientDto): SettingPriceBodyPartCoefficientApiModel {
    return {
      organization_id: dto.userId,
      body_part_id: dto.bodyPartId,
      difficulty_coefficient: dto.coefficient,
      // body_parts: dto.bodyParts
    };
  }
}
