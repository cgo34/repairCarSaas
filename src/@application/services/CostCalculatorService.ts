import { QuoteLineItem } from '@/@domain/models/Quote';
import { ICostCalculatorService } from '@/@domain/services/ICostCalculatorService';
import { SettingPriceTechnicityCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceTechnicityCoefficientDto';
import { injectable } from 'inversify';
import { LineItemViewDto } from '../dtos/LineItemViewDto';
import { SettingPriceBodyMaterialCoefficientViewDto } from '../dtos/settings/SettingPriceBodyMaterialCoefficientViewDto';
import { SettingPriceBodyPartCoefficientViewDto } from '../dtos/settings/SettingPriceBodyPartCoefficientViewType';
import { SettingPriceImpactCountToUtViewDto } from '../dtos/settings/SettingPriceImpactCountToUtViewDto';
import { SettingPriceDiameterCoefficientViewDto } from '../dtos/settings/SettingPriceTechnicityCoefficientDto';
import { SettingPriceViewDto } from '../dtos/settings/SettingPriceViewDto';

@injectable()
export class CostCalculatorService implements ICostCalculatorService {
  calculateLinePrice(lineItem: LineItemViewDto, priceParams: SettingPriceViewDto): number {
    if (!lineItem.bodyPartId || !lineItem.bodyMaterialId || !lineItem.repairTypeId) {
      throw new Error("Missing required attributes to calculate cost.");
    }

    const bodyPartCoefficient = this.getBodyPartCoefficient(lineItem.bodyPartId, priceParams.bodyParts);
    const materialCoefficient = priceParams.technicity.aluminiumCoefficient;
    const repairTypeCoefficient = this.getRepairTypeCoefficient(lineItem.repairTypeCode ?? '', priceParams.technicity);
    const diameter25Coefficient = priceParams.technicity.diameter25Coefficient;
    const diameter35Coefficient = priceParams.technicity.diameter35Coefficient;
    
    const hourlyRate = priceParams.general.hourlyRate ?? 180;
    const unitTimeValue = priceParams.general.unitTime ?? 6;

    const unitTime = this.getUnitTimeImpact(lineItem, priceParams.impactsCount);

    // compute price for each diameter
    const basePriceDiameter25 = (((unitTime.diameter25 * unitTimeValue) * hourlyRate) / 60)
      * bodyPartCoefficient 
      * materialCoefficient 
      * repairTypeCoefficient
      * diameter25Coefficient 
    
    const basePriceDiameter35 = (((unitTime.diameter35 * unitTimeValue) * hourlyRate) / 60)
      * bodyPartCoefficient 
      * materialCoefficient 
      * repairTypeCoefficient
      * diameter35Coefficient 
    
    const finalCost = basePriceDiameter25 + basePriceDiameter35

    return Math.round(finalCost * 100) / 100;
  }

  private getUnitTimeImpact(lineItem: QuoteLineItem, impactsCountPrice: SettingPriceImpactCountToUtViewDto[]): { diameter25: number, diameter35: number } {
    
    const unitTimeImpact25 = impactsCountPrice.find(ic => ic.impactCountMin <= lineItem.impactCount25 && ic.impactCountMax >= lineItem.impactCount25);
    const unitTimeImpact35 = impactsCountPrice.find(ic => ic.impactCountMin <= lineItem.impactCount35 && ic.impactCountMax >= lineItem.impactCount35);
    
    return {
      diameter25: unitTimeImpact25?.unitTime,
      diameter35: unitTimeImpact35?.unitTime
    }
  }

  private getBodyPartCoefficient(bodyPartId: string, bodyPartsPrice: SettingPriceBodyPartCoefficientViewDto[]): number {
    const setting = bodyPartsPrice.find(sp => sp.bodyPartId === bodyPartId);
    return setting?.coefficient ?? 1;
  }

  private getMaterialCoefficient(materialId: string, bodyMaterialsPrice: SettingPriceBodyMaterialCoefficientViewDto[]): number {
    const setting = bodyMaterialsPrice.find(sp => sp.bodyMaterialId === materialId);
    return setting?.coefficient ?? 1;
  }

  private getRepairTypeCoefficient(repairTypeCode: string, technicitySetting: SettingPriceTechnicityCoefficientDto): number {

    if (repairTypeCode === 'DAP') {
      return technicitySetting.dapCoefficient ?? 1;
    }
     
    if (repairTypeCode === 'DSP') {
      return technicitySetting.dspCoefficient ?? 1;
    }

    return 1;
  }

  private getDiameterCoefficient(diameter: number, diametersPrice: SettingPriceDiameterCoefficientViewDto[]): number {
    const setting = diametersPrice.find(sp => sp.diameter === diameter);
    return setting?.coefficient ?? 1;
  }

}
