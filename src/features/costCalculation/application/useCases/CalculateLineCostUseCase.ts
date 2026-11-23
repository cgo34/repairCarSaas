import { LineItemDto } from '@/features/lineItems/application/dtos/LineItemDto';
import { SettingPriceDto } from '@/features/priceSettings/application/dtos/SettingPriceDto';
import { ICostCalculatorService } from '@/features/costCalculation/application/ports/services/ICostCalculatorService';

export interface ICalculateLineCostUseCase {
  execute(lineItem: LineItemDto, priceParams: SettingPriceDto): number;
}

export class CalculateLineCostUseCase implements ICalculateLineCostUseCase {
  constructor(
    private costCalculatorService: ICostCalculatorService
  ) {}

  execute(lineItem: LineItemDto, priceParams: SettingPriceDto): number {
    return this.costCalculatorService.calculateLinePrice(lineItem, priceParams);
  }
}
