import { LineItemDto } from '@/features/lineItems/application/dtos/LineItemDto';
import { SettingPriceDto } from '@/features/priceSettings/application/dtos/SettingPriceDto';
import { ICostCalculatorService } from '@/features/costCalculation/application/ports/services/ICostCalculatorService';

export interface ICalculateTotalCostUseCase {
  execute(lineItems: LineItemDto[], priceParams: SettingPriceDto): number;
}

export class CalculateTotalCostUseCase implements ICalculateTotalCostUseCase {
  constructor(
    private costCalculatorService: ICostCalculatorService
  ) {}

  execute(lineItems: LineItemDto[], priceParams: SettingPriceDto): number {
    return lineItems.reduce((total, line) => total + this.costCalculatorService.calculateLinePrice(line, priceParams), 0);
  }
}
