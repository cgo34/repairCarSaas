import { SettingPriceBodyMaterialCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceBodyMaterialCoefficientDto';
import { SettingPriceBodyMaterialCoefficientApiModel } from '@/@infrastructure/database/api/settings/price/SettingPriceBodyMaterialCoefficientApiModel';

export class SettingPriceBodyMaterialCoefficientMapper {
  static apiToDto(apiModel: SettingPriceBodyMaterialCoefficientApiModel): SettingPriceBodyMaterialCoefficientDto {
    return {
      id: apiModel.id,
      userId: apiModel.user_id,
      bodyMaterialId: apiModel.body_material_id,
      coefficient: apiModel.material_coefficient,
    };
  }

  static dtoToApi(dto: SettingPriceBodyMaterialCoefficientDto): SettingPriceBodyMaterialCoefficientApiModel {
    return {
      id: dto.id,
      user_id: dto.userId,
      body_material_id: dto.bodyMaterialId,
      material_coefficient: dto.coefficient,
    };
  }
}
