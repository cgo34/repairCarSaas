import { LineItemViewDto } from "@/@application/dtos/LineItemViewDto";
import { SettingPriceViewDto } from "@/@application/dtos/settings/SettingPriceViewDto";

export interface ICalculateLineCostUseCase {
  execute(lineItem: LineItemViewDto, priceParams: SettingPriceViewDto): number;
}