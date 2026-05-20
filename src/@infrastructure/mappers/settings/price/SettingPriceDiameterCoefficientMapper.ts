import { SettingPriceDiameterCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceDiameterCoefficientDto';

import { SettingPriceDiameterCoefficientApiModel } from '@/@infrastructure/database/api/settings/price/SettingPriceDiameterCoefficientApiModel';

export class SettingPriceDiameterCoefficientMapper {
  /**
   * ============================================================
   * API -> DTO
   * ============================================================
   */

  static apiToDto(
    api: SettingPriceDiameterCoefficientApiModel
  ): SettingPriceDiameterCoefficientDto {
    return {
      id: api.id,

      organization_id:
        api.organization_id,

      diameter:
        Number(api.diameter),

      coefficient:
        Number(api.coefficient),
    };
  }

  /**
   * ============================================================
   * DTO -> API
   * ============================================================
   */

  static dtoToApi(
    dto: SettingPriceDiameterCoefficientDto
  ): SettingPriceDiameterCoefficientApiModel {
    return {
      id: dto.id,

      organization_id:
        dto.organization_id,

      diameter:
        dto.diameter,

      coefficient:
        dto.coefficient,
    };
  }
}