import { QuoteDto } from '@/@infrastructure/dtos/QuoteDto';

export interface IUpdateQuoteUseCase {
  execute(quoteDto: QuoteDto): Promise<QuoteDto>;
}
