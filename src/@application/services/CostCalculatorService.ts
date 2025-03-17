import { PriceParams } from '@/@domain/models/PriceParams';
import { QuoteLineItem } from '@/@domain/models/Quote';
import { ICostCalculatorService } from '@/@domain/services/ICostCalculatorService';
import { injectable } from 'inversify';

@injectable()
export class CostCalculatorService implements ICostCalculatorService {
  calculateLinePrice(lineItem: QuoteLineItem, priceParams: PriceParams): number {
    if (!lineItem.bodyPart || !lineItem.bodyMaterial || !lineItem.repairType) {
      throw new Error("Missing required attributes to calculate cost.");
    }

    const unitTime = this.getUnitTime(lineItem.impactCount, priceParams);
    const hourlyRate = priceParams.general.hourlyRate ?? 50;
    const unitTimeValue = priceParams.general.unitTime ?? 6;

    const timeInMinutes = unitTime * unitTimeValue;
    const baseCost = (timeInMinutes * hourlyRate) / 60;

    const bodyPartCoefficient = priceParams.bodyParts[lineItem.bodyPart.id] ?? 1;
    const materialCoefficient = priceParams.bodyMaterials[lineItem.bodyMaterial.id] ?? 1;
    const repairTypeCoefficient = priceParams.repairTypes[lineItem.repairType.id] ?? 1;
    const diameterCoefficient = priceParams.diameters[lineItem.impactSize] ?? 1;
    const impactCoefficient = priceParams.impactsCount[lineItem.impactCount] ?? 1;

    let finalCost = baseCost 
      * bodyPartCoefficient 
      * materialCoefficient 
      * repairTypeCoefficient
      * diameterCoefficient 
      * impactCoefficient;

    const strippingCost = (lineItem.strippingPercentage ?? 0) / 100;
    finalCost += finalCost * strippingCost;

    return Math.round(finalCost * 100) / 100;
  }

  private getUnitTime(impactCount: number, priceParams: PriceParams): number {
    const setting = priceParams.impactToUt.find(sp => 
      impactCount >= sp.impactCountMin && impactCount <= sp.impactCountMax
    );
    return setting?.unitTime ?? 1;
  }
}
