import { QuoteLineItem } from "@domain/entities/QuoteLineItem";


export interface ICostCalculatorService {
  calculateLinePrice(lineItem: QuoteLineItem, priceParams: PriceParams): number;
  // calculateTotalPrice(lineItems: QuoteLineItem[], priceParams: PriceParams): number;
}
