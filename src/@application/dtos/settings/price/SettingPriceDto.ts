import { SettingPriceBodyPartCoefficientDto } from "@/@application/dtos/settings/price/SettingPriceBodyPartCoefficientDto";
import {
  SettingPriceGeneralDto,
} from "@/@application/dtos/settings/price/SettingPriceGeneralDto";
import {
  SettingPriceImpactCountToUtDto
} from "@/@application/dtos/settings/price/SettingPriceImpactCountToUtDto";
import {
  SettingPriceTechnicityCoefficientDto
} from "@/@application/dtos/settings/price/SettingPriceTechnicityCoefficientDto";

export interface SettingPriceDto {
  general: SettingPriceGeneralDto;
  bodyParts: SettingPriceBodyPartCoefficientDto[];
  technicity: SettingPriceTechnicityCoefficientDto;
  impactsCount: SettingPriceImpactCountToUtDto[];
}
