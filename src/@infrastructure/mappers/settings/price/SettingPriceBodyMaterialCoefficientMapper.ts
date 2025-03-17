import { SettingPriceBodyMaterialCoefficientApiModel } from '@/@infrastructure/database/api/settings/price/SettingPriceBodyMaterialCoefficientApiModel';
import { SettingPriceBodyMaterialCoefficientDto } from '@/@infrastructure/dtos/settings/price/SettingPriceBodyMaterialCoefficientDto';

export class SettingPriceBodyMaterialCoefficientMapper {
  static apiToDto(apiModel: SettingPriceBodyMaterialCoefficientApiModel): SettingPriceBodyMaterialCoefficientDto {
    return {
      userId: apiModel.user_id,
      bodyMaterialId: apiModel.body_material_id,
      coefficient: apiModel.material_coefficient,
      bodyMaterials: apiModel.body_materials,
    };
  }

  static dtoToApi(dto: SettingPriceBodyMaterialCoefficientDto): SettingPriceBodyMaterialCoefficientApiModel {
    return {
      user_id: dto.userId,
      body_material_id: dto.bodyMaterialId,
      material_coefficient: dto.coefficient,
      body_materials: dto.bodyMaterials
    };
  }
}
