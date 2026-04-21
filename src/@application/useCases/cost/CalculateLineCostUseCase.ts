import { LineItemDto } from '@/@application/dtos/LineItemDto';
import { SettingPriceDto } from '@/@application/dtos/settings/price/SettingPriceDto';
import { ICostCalculatorService } from '@/@domain/services/ICostCalculatorService';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';
import { ICalculateLineCostUseCase } from '@/@domain/useCases/ICalculateLineCostUseCase';

@injectable()
export class CalculateLineCostUseCase implements ICalculateLineCostUseCase {
  constructor(
    @inject(SYMBOLS.Services.CostCalculatorService) private costCalculatorService: ICostCalculatorService
  ) {}

  execute(lineItem: LineItemDto, priceParams: SettingPriceDto): number {
    return this.costCalculatorService.calculateLinePrice(lineItem, priceParams);
  }
}
