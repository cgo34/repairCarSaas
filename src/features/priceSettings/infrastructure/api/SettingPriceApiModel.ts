import {
  SettingPriceBodyMaterialCoefficientApiModel
} from "@/features/priceSettings/infrastructure/api/SettingPriceBodyMaterialCoefficientApiModel";
import { SettingPriceBodyPartCoefficientApiModel } from "@/features/priceSettings/infrastructure/api/SettingPriceBodyPartCoefficientApiModel";
import {
  SettingPriceDiameterCoefficientApiModel,
} from "@/features/priceSettings/infrastructure/api/SettingPriceDiameterCoefficientApiModel";
import {
  SettingPriceGeneralApiModel,
} from "@/features/priceSettings/infrastructure/api/SettingPriceGeneralApiModel";
import {
  SettingPriceImpactCountToUtApiModel
} from "@/features/priceSettings/infrastructure/api/SettingPriceImpactCountToUtApiModel";

export interface SettingPriceApiModel {
  general: SettingPriceGeneralApiModel;
  bodyMaterials: SettingPriceBodyMaterialCoefficientApiModel[];
  bodyParts: SettingPriceBodyPartCoefficientApiModel[];
  diameters: SettingPriceDiameterCoefficientApiModel[];
  impactsCount: SettingPriceImpactCountToUtApiModel[];
}
