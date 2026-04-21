import { SettingPriceTechnicityCoefficientApiModel } from '@/@infrastructure/database/api/settings/price/SettingPriceTechnicityCoefficientApiModel';
import { SettingPriceTechnicityCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceTechnicityCoefficientDto';

export class SettingPriceTechnicityCoefficientMapper {
  static apiToDto(apiModel: SettingPriceTechnicityCoefficientApiModel): SettingPriceTechnicityCoefficientDto {
    return {
      id: apiModel.id,
      userId: apiModel.user_id,
      diameter25Coefficient: apiModel.diameter_25_coefficient,
      diameter35Coefficient: apiModel.diameter_35_coefficient,
      aluminiumCoefficient: apiModel.aluminium_coefficient,
      dapCoefficient: apiModel.dap_coefficient,
      dspCoefficient: apiModel.dsp_coefficient,
    };
  }

  static dtoToApi(dto: SettingPriceTechnicityCoefficientDto): SettingPriceTechnicityCoefficientApiModel {
    return {
      id: dto.id,
      user_id: dto.userId,
      diameter_25_coefficient: dto.diameter25Coefficient,
      diameter_35_coefficient: dto.diameter35Coefficient,
      aluminium_coefficient: dto.aluminiumCoefficient,
      dap_coefficient: dto.dapCoefficient,
      dsp_coefficient: dto.dspCoefficient,
    };
  }
}
