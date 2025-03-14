import {
  SettingPriceBodyMaterialCoefficientApiModel
} from "@infrastructure/database/api/settings/price/SettingPriceBodyMaterialCoefficientApiModel";
import { SettingPriceBodyPartCoefficientApiModel } from "@infrastructure/database/api/settings/price/SettingPriceBodyPartCoefficientApiModel";
import {
  SettingPriceDiameterCoefficientApiModel,
} from "@infrastructure/database/api/settings/price/SettingPriceDiameterCoefficientApiModel";
import {
  SettingPriceGeneralApiModel,
} from "@infrastructure/database/api/settings/price/SettingPriceGeneralApiModel";
import {
  SettingPriceImpactCountToUtApiModel
} from "@infrastructure/database/api/settings/price/SettingPriceImpactCountToUtApiModel";

export interface SettingPriceApiModel {
  general: SettingPriceGeneralApiModel;
  bodyMaterials: SettingPriceBodyMaterialCoefficientApiModel[];
  bodyParts: SettingPriceBodyPartCoefficientApiModel[];
  diameters: SettingPriceDiameterCoefficientApiModel[];
  impactsCount: SettingPriceImpactCountToUtApiModel[];
}
