import { QuoteLineItem } from '@/@domain/models/Quote';
import { ICostCalculatorService } from '@/@domain/services/ICostCalculatorService';
import { injectable } from 'inversify';
import { LineItemViewDto } from '../dtos/LineItemViewDto';
import { SettingPriceBodyMaterialCoefficientViewDto } from '../dtos/settings/SettingPriceBodyMaterialCoefficientViewDto';
import { SettingPriceBodyPartCoefficientViewDto } from '../dtos/settings/SettingPriceBodyPartCoefficientViewType';
import { SettingPriceImpactCountToUtViewDto } from '../dtos/settings/SettingPriceImpactCountToUtViewDto';
import { SettingPriceRepairTypeCoefficientViewDto } from '../dtos/settings/SettingPriceRepairTypeCoefficientViewDto';
import { SettingPriceDiameterCoefficientViewDto } from '../dtos/settings/SettingPriceTechnicityCoefficientDto';
import { SettingPriceViewDto } from '../dtos/settings/SettingPriceViewDto';

@injectable()
export class CostCalculatorService implements ICostCalculatorService {
  calculateLinePrice(lineItem: LineItemViewDto, priceParams: SettingPriceViewDto): number {
    if (!lineItem.bodyPartId || !lineItem.bodyMaterialId || !lineItem.repairTypeId) {
      throw new Error("Missing required attributes to calculate cost.");
    }

    const bodyPartCoefficient = this.getBodyPartCoefficient(lineItem.bodyPartId, priceParams.bodyParts);
    const materialCoefficient = this.getMaterialCoefficient(lineItem.bodyMaterialId, priceParams.bodyMaterials);
    const repairTypeCoefficient = this.getRepairTypeCoefficient(lineItem.repairTypeId, priceParams.repairTypes);
    const diameter25Coefficient = this.getDiameterCoefficient(lineItem.impactCount25, priceParams.diameters);
    const diameter35Coefficient = this.getDiameterCoefficient(lineItem.impactCount35, priceParams.diameters);
    const unitTime = this.getUnitTimeImpact(lineItem, priceParams.impactsCount);
    
    const hourlyRate = priceParams.general.hourlyRate ?? 50;
    const unitTimeValue = priceParams.general.unitTime ?? 6;

    const timeInMinutes = unitTime * unitTimeValue;
    const baseCost = (timeInMinutes * hourlyRate) / 60;

    let finalCost = baseCost 
      * bodyPartCoefficient 
      * materialCoefficient 
      * repairTypeCoefficient
      * diameter25Coefficient 
      * diameter35Coefficient

    const strippingCost = (lineItem.strippingPercentage ?? 0) / 100;
    finalCost += finalCost * strippingCost;

    return Math.round(finalCost * 100) / 100;
  }

  private getUnitTimeImpact(lineItem: QuoteLineItem, impactsCountPrice: SettingPriceImpactCountToUtViewDto[]): number {
    const unitTimeImpact25 = impactsCountPrice.find(ic => ic.impactCountMin <= lineItem.impactCount25 && ic.impactCountMax >= lineItem.impactCount25);
    const unitTimeImpact35 = impactsCountPrice.find(ic => ic.impactCountMin <= lineItem.impactCount35 && ic.impactCountMax >= lineItem.impactCount35);
    
    return (unitTimeImpact25?.unitTime ?? 0) + (unitTimeImpact35?.unitTime ?? 0);
  }

  private getBodyPartCoefficient(bodyPartId: string, bodyPartsPrice: SettingPriceBodyPartCoefficientViewDto[]): number {
    const setting = bodyPartsPrice.find(sp => sp.bodyPartId === bodyPartId);
    return setting?.coefficient ?? 1;
  }

  private getMaterialCoefficient(materialId: string, bodyMaterialsPrice: SettingPriceBodyMaterialCoefficientViewDto[]): number {
    const setting = bodyMaterialsPrice.find(sp => sp.bodyMaterialId === materialId);
    return setting?.coefficient ?? 1;
  }

  private getRepairTypeCoefficient(repairTypeId: string, repairTypesPrice: SettingPriceRepairTypeCoefficientViewDto[]): number {
    const setting = repairTypesPrice.find(sp => sp.repairTypeId === repairTypeId);
    return setting?.coefficient ?? 1;
  }

  private getDiameterCoefficient(diameter: number, diametersPrice: SettingPriceDiameterCoefficientViewDto[]): number {
    const setting = diametersPrice.find(sp => sp.diameter === diameter);
    return setting?.coefficient ?? 1;
  }

}
