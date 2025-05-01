import { LineItemDto } from '@/@infrastructure/dtos/LineItemDto';

export interface IUpdateQuoteLineItemUseCase {
  execute(quoteId: string, lineItem: LineItemDto[]): Promise<LineItemDto[]>;
}
