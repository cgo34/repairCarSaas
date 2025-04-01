import { LineItemViewDto } from '@/@application/dtos/LineItemViewDto';
import { QuoteDto } from '@/@infrastructure/dtos/QuoteDto';

export interface IAddQuoteLineItemUseCase {
  execute(quoteId: string, lineItem: LineItemViewDto): Promise<QuoteDto>;
}
