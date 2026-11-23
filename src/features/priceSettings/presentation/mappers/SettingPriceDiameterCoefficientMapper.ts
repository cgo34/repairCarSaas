import { SettingPriceDiameterCoefficientDto } from '@/features/priceSettings/application/dtos/SettingPriceDiameterCoefficientDto';

import { SettingPriceDiameterCoefficientViewModel } from '@/features/priceSettings/presentation/models/SettingPriceDiameterCoefficientViewModel';

export class SettingPriceDiameterCoefficientMapper {
  /**
   * ============================================================
   * DTO -> VIEW
   * ============================================================
   */

  static dtoToView(
    dto: SettingPriceDiameterCoefficientDto
  ): SettingPriceDiameterCoefficientViewModel {
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

  /**
   * ============================================================
   * VIEW -> DTO
   * ============================================================
   */

  static viewToDto(
    view: SettingPriceDiameterCoefficientViewModel
  ): SettingPriceDiameterCoefficientDto {
    return {
      id: view.id,

      organization_id:
        view.organization_id,

      diameter:
        view.diameter,

      coefficient:
        view.coefficient,
    };
  }
}