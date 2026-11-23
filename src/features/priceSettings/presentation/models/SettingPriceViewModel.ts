import { SettingPriceBodyPartCoefficientViewModel } from "./SettingPriceBodyPartCoefficientViewModel";
import { SettingPriceGeneralViewModel } from "./SettingPriceGeneralViewModel";
import { SettingPriceImpactCountToUtViewModel } from "./SettingPriceImpactCountToUtViewModel";
import { SettingPriceTechnicityCoefficientViewModel } from "./SettingPriceTechnicityCoefficientViewModel";

export interface SettingPriceViewModel {
  general: SettingPriceGeneralViewModel;
  technicity: SettingPriceTechnicityCoefficientViewModel;
  bodyParts: SettingPriceBodyPartCoefficientViewModel[];
  impactsCount: SettingPriceImpactCountToUtViewModel[];
}
