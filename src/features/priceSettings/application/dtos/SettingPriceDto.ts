import { SettingPriceBodyPartCoefficientDto } from "@/features/priceSettings/application/dtos/SettingPriceBodyPartCoefficientDto";
import {
  SettingPriceGeneralDto,
} from "@/features/priceSettings/application/dtos/SettingPriceGeneralDto";
import {
  SettingPriceImpactCountToUtDto
} from "@/features/priceSettings/application/dtos/SettingPriceImpactCountToUtDto";
import {
  SettingPriceTechnicityCoefficientDto
} from "@/features/priceSettings/application/dtos/SettingPriceTechnicityCoefficientDto";

export interface SettingPriceDto {
  general: SettingPriceGeneralDto;
  bodyParts: SettingPriceBodyPartCoefficientDto[];
  technicity: SettingPriceTechnicityCoefficientDto;
  impactsCount: SettingPriceImpactCountToUtDto[];
}
