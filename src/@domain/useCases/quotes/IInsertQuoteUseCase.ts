import { QuoteDto } from '@/@infrastructure/dtos/QuoteDto';

export interface IInsertQuoteUseCase {
  execute(quoteDto: QuoteDto): Promise<QuoteDto>;
}
