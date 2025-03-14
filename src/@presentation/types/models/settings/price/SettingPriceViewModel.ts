import { SettingPriceBodyMaterialCoefficientViewModel } from "./SettingPriceBodyMaterialCoefficientViewModel";
import { SettingPriceBodyPartCoefficientViewModel } from "./SettingPriceBodyPartCoefficientViewModel";
import { SettingPriceDiameterCoefficientViewModel } from "./SettingPriceDiameterCoefficientViewModel";
import { SettingPriceGeneralViewModel } from "./SettingPriceGeneralViewModel";
import { SettingPriceImpactCountToUtViewModel } from "./SettingPriceImpactCountToUtViewModel";

export interface SettingPriceViewModel {
  general: SettingPriceGeneralViewModel;
  bodyMaterials: SettingPriceBodyMaterialCoefficientViewModel[];
  bodyParts: SettingPriceBodyPartCoefficientViewModel[];
  diameters: SettingPriceDiameterCoefficientViewModel[];
  impactsCount: SettingPriceImpactCountToUtViewModel[];
}
