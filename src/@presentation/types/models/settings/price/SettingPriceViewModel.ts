import { SettingPriceBodyMaterialCoefficientViewModel } from "./SettingPriceBodyMaterialCoefficientViewModel";
import { SettingPriceBodyPartCoefficientViewModel } from "./SettingPriceBodyPartCoefficientViewModel";
import { SettingPriceGeneralViewModel } from "./SettingPriceGeneralViewModel";
import { SettingPriceImpactCountToUtViewModel } from "./SettingPriceImpactCountToUtViewModel";
import { SettingPriceRepairTypeCoefficientViewModel } from "./SettingPriceRepairTypeCoefficientViewModel";
import { SettingPriceDiameterCoefficientViewModel } from "./SettingPriceTechnicityCoefficientViewModel";

export interface SettingPriceViewModel {
  general: SettingPriceGeneralViewModel;
  bodyMaterials: SettingPriceBodyMaterialCoefficientViewModel[];
  bodyParts: SettingPriceBodyPartCoefficientViewModel[];
  diameters: SettingPriceDiameterCoefficientViewModel[];
  impactsCount: SettingPriceImpactCountToUtViewModel[];
  repairTypes: SettingPriceRepairTypeCoefficientViewModel[];
}
