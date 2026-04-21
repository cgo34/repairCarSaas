import { LineItemDto } from '@/@application/dtos/LineItemDto';

export interface IAddQuoteLineItemUseCase {
  executeQuote(lineItem: LineItemDto): Promise<LineItemDto>;
}
