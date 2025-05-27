import { SettingPriceBodyPartCoefficientDto } from "@/@infrastructure/dtos/settings/price/SettingPriceBodyPartCoefficientDto";
import {
  SettingPriceGeneralDto,
} from "@/@infrastructure/dtos/settings/price/SettingPriceGeneralDto";
import {
  SettingPriceImpactCountToUtDto
} from "@/@infrastructure/dtos/settings/price/SettingPriceImpactCountToUtDto";
import {
  SettingPriceTechnicityCoefficientDto
} from "@/@infrastructure/dtos/settings/price/SettingPriceTechnicityCoefficientDto";

export interface SettingPriceDto {
  general: SettingPriceGeneralDto;
  bodyParts: SettingPriceBodyPartCoefficientDto[];
  technicity: SettingPriceTechnicityCoefficientDto;
  impactsCount: SettingPriceImpactCountToUtDto[];
}
