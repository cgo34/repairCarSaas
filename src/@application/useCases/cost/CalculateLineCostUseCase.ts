import { LineItemViewModel } from '@/@presentation/types/models/LineItemViewModel';
import { LineItemViewMapper } from '@/@presentation/mappers/LineItemViewMapper';
import { SettingPrice } from '@/@domain/models/settings/price/SettingPrice';
import { SettingPriceViewModel } from '@/@presentation/types/models/settings/price/SettingPriceViewModel';
import { SettingPriceMapper } from '@/@presentation/mappers/settings/price/SettingPriceMapper';
import { ICostCalculatorService } from '@/@domain/services/ICostCalculatorService';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';
import { ICalculateLineCostUseCase } from '@/@domain/useCases/ICalculateLineCostUseCase';

@injectable()
export class CalculateLineCostUseCase implements ICalculateLineCostUseCase {
  constructor(
    @inject(SYMBOLS.Services.CostCalculatorService) private costCalculatorService: ICostCalculatorService
  ) {}

  execute(lineItem: LineItemViewModel, priceParams: SettingPriceViewModel): number {
    const dto = LineItemViewMapper.viewToDto(lineItem);
    const params = SettingPriceMapper.viewToDto(priceParams);
    return this.costCalculatorService.calculateLinePrice(dto, params);
  }
}
