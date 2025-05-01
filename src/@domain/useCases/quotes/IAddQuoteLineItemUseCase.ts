import { LineItemDto } from '@/@infrastructure/dtos/LineItemDto';

export interface IAddQuoteLineItemUseCase {
  executeQuote(lineItem: LineItemDto): Promise<LineItemDto>;
}
