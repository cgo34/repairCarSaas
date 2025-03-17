import {
    SettingPriceBodyMaterialCoefficientDto
} from "@/@infrastructure/dtos/settings/price/SettingPriceBodyMaterialCoefficientDto";
import { SettingPriceBodyPartCoefficientDto } from "@/@infrastructure/dtos/settings/price/SettingPriceBodyPartCoefficientDto";
import {
    SettingPriceDiameterCoefficientDto,
} from "@/@infrastructure/dtos/settings/price/SettingPriceDiameterCoefficientDto";
import {
    SettingPriceGeneralDto,
} from "@/@infrastructure/dtos/settings/price/SettingPriceGeneralDto";
import {
    SettingPriceImpactCountToUtDto
} from "@/@infrastructure/dtos/settings/price/SettingPriceImpactCountToUtDto";

export interface SettingPriceDto {
  general: SettingPriceGeneralDto;
  bodyMaterials: SettingPriceBodyMaterialCoefficientDto[];
  bodyParts: SettingPriceBodyPartCoefficientDto[];
  diameters: SettingPriceDiameterCoefficientDto[];
  impactsCount: SettingPriceImpactCountToUtDto[];
}
