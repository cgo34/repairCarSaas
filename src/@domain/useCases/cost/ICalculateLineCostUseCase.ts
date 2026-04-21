import { LineItemViewModel } from "@/@presentation/types/models/LineItemViewModel";
import { SettingPriceViewModel } from "@/@presentation/types/models/settings/price/SettingPriceViewModel";

export interface ICalculateLineCostUseCase {
  execute(lineItem: LineItemViewModel, priceParams: SettingPriceViewModel): number;
}