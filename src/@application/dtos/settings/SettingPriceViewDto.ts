import { SettingPriceTechnicityCoefficientDto } from "@/@infrastructure/dtos/settings/price/SettingPriceTechnicityCoefficientDto";
import { SettingPriceBodyPartCoefficientViewDto } from "./SettingPriceBodyPartCoefficientViewType";
import { SettingPriceGeneralViewDto } from "./SettingPriceGeneralViewDto";
import { SettingPriceImpactCountToUtViewDto } from "./SettingPriceImpactCountToUtViewDto";

export interface SettingPriceViewDto {
  general: SettingPriceGeneralViewDto,
  bodyParts: SettingPriceBodyPartCoefficientViewDto[],
  technicity: SettingPriceTechnicityCoefficientDto,
  impactsCount: SettingPriceImpactCountToUtViewDto[],
}
