import { LineItemDto } from "@/@application/dtos/LineItemDto";
import { SettingPriceDto } from "@/@application/dtos/settings/price/SettingPriceDto";

export interface ICalculateLineCostUseCase {
  execute(lineItem: LineItemDto, priceParams: SettingPriceDto): number;
}
