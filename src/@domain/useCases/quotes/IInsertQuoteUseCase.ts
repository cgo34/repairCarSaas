import { QuoteDto } from '@/@application/dtos/QuoteDto';

export interface IInsertQuoteUseCase {
  execute(quoteDto: QuoteDto): Promise<QuoteDto>;
}
