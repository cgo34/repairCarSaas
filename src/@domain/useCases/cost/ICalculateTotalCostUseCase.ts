import { QuoteLineItem } from "@/@domain/entities/QuoteLineItem";
import { SettingPrice } from "@/@domain/models/settings/price/SettingPrice";

export interface ICalculateTotalCostUseCase {
  execute(lineItems: QuoteLineItem[], priceParams: SettingPrice): void;
}