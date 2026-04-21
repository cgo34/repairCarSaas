import { SettingPriceRepairTypeCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceRepairTypeCoefficientDto';
import { SettingPriceBodyMaterialCoefficient } from './SettingPriceBodyMaterialCoefficient';
import { SettingPriceBodyPartCoefficient } from './SettingPriceBodyPartCoefficient';
import { SettingPriceDiameterCoefficient } from './SettingPriceDiameterCoefficient';
import { SettingPriceGeneral } from './SettingPriceGeneral';
import { SettingPriceImpactCountToUt } from './SettingPriceImpactCountToUt';

export class SettingPrice {
  constructor(
    public general: SettingPriceGeneral,
    public bodyMaterials: SettingPriceBodyMaterialCoefficient[],
    public bodyParts: SettingPriceBodyPartCoefficient[],
    public diameters: SettingPriceDiameterCoefficient[],
    public impactsCount: SettingPriceImpactCountToUt[],
    public repairTypes: SettingPriceRepairTypeCoefficientDto[]
  ) {}
}
