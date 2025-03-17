import { QuoteLineItem } from '@/@domain/entities/QuoteLineItem';
import { SettingPrice } from '@/@domain/models/settings/price/SettingPrice';
import { ICostCalculatorService } from '@/@domain/services/ICostCalculatorService';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class CalculateLineCostUseCase {
  constructor(
    @inject(SYMBOLS.Services.CostCalculatorService) private costCalculatorService: ICostCalculatorService
  ) {}

  execute(lineItem: QuoteLineItem, priceParams: SettingPrice): number {
    return this.costCalculatorService.calculateLinePrice(lineItem, priceParams);
  }
}
