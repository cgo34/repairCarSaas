import { QuoteLineItem } from '@/@domain/entities/QuoteLineItem';
import { QuoteDto } from '@/@infrastructure/dtos/QuoteDto';

export interface IAddQuoteLineItemUseCase {
  execute(quoteId: string, lineItem: QuoteLineItem): Promise<QuoteDto>;
}
