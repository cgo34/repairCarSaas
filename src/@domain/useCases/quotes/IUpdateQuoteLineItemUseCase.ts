import { LineItemDto } from '@/@application/dtos/LineItemDto';

export interface IUpdateQuoteLineItemUseCase {
  execute(quoteId: string, lineItem: LineItemDto[]): Promise<LineItemDto[]>;
}
