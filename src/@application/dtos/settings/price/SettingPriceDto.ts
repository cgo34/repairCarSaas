import {
  SettingPriceBodyMaterialCoefficientDto
} from "@application/dtos/settings/price/SettingPriceBodyMaterialCoefficientDto";
import { SettingPriceBodyPartCoefficientDto } from "@application/dtos/settings/price/SettingPriceBodyPartCoefficientDto";
import {
  SettingPriceDiameterCoefficientDto,
} from "@application/dtos/settings/price/SettingPriceDiameterCoefficientDto";
import {
  SettingPriceGeneralDto,
} from "@application/dtos/settings/price/SettingPriceGeneralDto";
import {
  SettingPriceImpactCountToUtDto
} from "@application/dtos/settings/price/SettingPriceImpactCountToUtDto";

export interface SettingPriceDto {
  general: SettingPriceGeneralDto;
  bodyMaterials: SettingPriceBodyMaterialCoefficientDto[];
  bodyParts: SettingPriceBodyPartCoefficientDto[];
  diameters: SettingPriceDiameterCoefficientDto[];
  impactsCount: SettingPriceImpactCountToUtDto[];
}
