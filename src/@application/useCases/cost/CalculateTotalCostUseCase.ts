import { QuoteLineItem } from '@/@domain/entities/QuoteLineItem';
import { SettingPrice } from '@/@domain/models/settings/price/SettingPrice';
import { ICostCalculatorService } from '@/@domain/services/ICostCalculatorService';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class CalculateTotalCostUseCase {
  constructor(
    @inject(SYMBOLS.Services.CostCalculatorService) private costCalculatorService: ICostCalculatorService
  ) {}

  execute(lineItems: QuoteLineItem[], priceParams: SettingPrice): number {
    return lineItems.reduce((total, line) => total + this.costCalculatorService.calculateLinePrice(line, priceParams), 0);
  }
}
