import { QuoteLineItem } from "@/@domain/entities/QuoteLineItem";
import { SettingPrice } from "@/@domain/models/settings/price/SettingPrice";

export interface ICalculateLineCostUseCase {
  execute(lineItem: QuoteLineItem, priceParams: SettingPrice): void;
}