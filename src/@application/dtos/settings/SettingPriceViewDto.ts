import { SettingPriceBodyMaterialCoefficientViewDto } from "./SettingPriceBodyMaterialCoefficientViewDto";
import { SettingPriceBodyPartCoefficientViewDto } from "./SettingPriceBodyPartCoefficientViewType";
import { SettingPriceDiameterCoefficientViewDto } from "./SettingPriceDiameterCoefficientViewType";
import { SettingPriceGeneralViewDto } from "./SettingPriceGeneralViewDto";
import { SettingPriceImpactCountToUtViewDto } from "./SettingPriceImpactCountToUtViewDto";
import { SettingPriceRepairTypeCoefficientViewDto } from "./SettingPriceRepairTypeCoefficientViewDto";

export interface SettingPriceViewDto {
  general: SettingPriceGeneralViewDto,
  bodyMaterials: SettingPriceBodyMaterialCoefficientViewDto[],
  bodyParts: SettingPriceBodyPartCoefficientViewDto[],
  diameters: SettingPriceDiameterCoefficientViewDto[],
  impactsCount: SettingPriceImpactCountToUtViewDto[],
  repairTypes: SettingPriceRepairTypeCoefficientViewDto[]
}
