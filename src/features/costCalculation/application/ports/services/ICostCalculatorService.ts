import { LineItemDto } from "@/features/lineItems/application/dtos/LineItemDto";
import { SettingPriceDto } from "@/features/priceSettings/application/dtos/SettingPriceDto";


export interface ICostCalculatorService {
  calculateLinePrice(lineItem: LineItemDto, priceParams: SettingPriceDto): number;
  // calculateTotalPrice(lineItems: QuoteLineItem[], priceParams: PriceParams): number;
}
