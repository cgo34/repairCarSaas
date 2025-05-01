import { LineItemViewDto } from "@/@application/dtos/LineItemViewDto";
import { SettingPriceViewDto } from "@/@application/dtos/settings/SettingPriceViewDto";


export interface ICostCalculatorService {
  calculateLinePrice(lineItem: LineItemViewDto, priceParams: SettingPriceViewDto): number;
  // calculateTotalPrice(lineItems: QuoteLineItem[], priceParams: PriceParams): number;
}
