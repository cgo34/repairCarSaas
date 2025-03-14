import { QuoteLineItem } from '@/@domain/models/Quote';
import { PriceParams } from '@/@domain/models/PriceParams';

export class CostCalculatorService {
  calculateLinePrice(lineItem: QuoteLineItem, priceParams: PriceParams): number {
    const bodyPartCoefficient = priceParams.bodyParts[lineItem.bodyPart.id] ?? 1;
    const materialCoefficient = priceParams.bodyMaterials[lineItem.bodyMaterial.id] ?? 1;
    const diameterCoefficient = priceParams.diameters[lineItem.impactSize] ?? 1;
    const impactCoefficient = priceParams.impactsCount[lineItem.impactCount] ?? 1;
    
    return (
      priceParams.general.basePrice *
      bodyPartCoefficient *
      materialCoefficient *
      diameterCoefficient *
      impactCoefficient
    );
  }
}
