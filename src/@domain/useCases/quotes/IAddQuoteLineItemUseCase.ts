import { LineItemDto } from '@/@infrastructure/dtos/LineItemDto';

export interface IAddQuoteLineItemUseCase {
  executeQuote(quoteId: string, lineItem: LineItemDto[]): Promise<LineItemDto[]>;
}
