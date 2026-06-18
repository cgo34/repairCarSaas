import { ICostCalculatorService } from '@/@domain/services/ICostCalculatorService';
import { SettingPriceTechnicityCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceTechnicityCoefficientDto';
import { injectable } from 'inversify';
import { LineItemDto } from '../dtos/LineItemDto';
import { SettingPriceBodyMaterialCoefficientDto } from '../dtos/settings/price/SettingPriceBodyMaterialCoefficientDto';
import { SettingPriceBodyPartCoefficientDto } from '../dtos/settings/price/SettingPriceBodyPartCoefficientDto';
import { SettingPriceImpactCountToUtDto } from '../dtos/settings/price/SettingPriceImpactCountToUtDto';
import { SettingPriceDto } from '../dtos/settings/price/SettingPriceDto';

@injectable()
export class CostCalculatorService implements ICostCalculatorService {
  calculateLinePrice(lineItem: LineItemDto, priceParams: SettingPriceDto): number {
    if (!lineItem.bodyPartId || !lineItem.bodyMaterialId || !lineItem.repairTypeId) {
      throw new Error("Missing required attributes to calculate cost.");
    }

    const bodyPartCoefficient = this.getBodyPartCoefficient(lineItem.bodyPartId, priceParams.bodyParts);
    const isAluminium = lineItem.bodyMaterial?.code === 'aluminium';
    const materialCoefficient = isAluminium ? priceParams.technicity.aluminiumCoefficient : 1;
    const repairTypeCoefficient = this.getRepairTypeCoefficient(lineItem.repairType?.code ?? '', priceParams.technicity);
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

  private getUnitTimeImpact(lineItem: LineItemDto, impactsCountPrice: SettingPriceImpactCountToUtDto[]): { diameter25: number, diameter35: number } {
    
    const unitTimeImpact25 = impactsCountPrice.find(ic => ic.impactCountMin <= lineItem.impactCount25 && ic.impactCountMax >= lineItem.impactCount25);
    const unitTimeImpact35 = impactsCountPrice.find(ic => ic.impactCountMin <= lineItem.impactCount35 && ic.impactCountMax >= lineItem.impactCount35);
    
    return {
      diameter25: unitTimeImpact25?.unitTime ?? 1,
      diameter35: unitTimeImpact35?.unitTime ?? 1
    }
  }

  private getBodyPartCoefficient(bodyPartId: string, bodyPartsPrice: SettingPriceBodyPartCoefficientDto[]): number {
    const setting = bodyPartsPrice.find(sp => sp.bodyPartId === bodyPartId);
    return setting?.coefficient ?? 1;
  }

  private getMaterialCoefficient(materialId: string, bodyMaterialsPrice: SettingPriceBodyMaterialCoefficientDto[]): number {
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

}
