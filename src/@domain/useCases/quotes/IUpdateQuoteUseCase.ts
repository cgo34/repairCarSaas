import { QuoteDto } from '@/@application/dtos/QuoteDto';

export interface IUpdateQuoteUseCase {
  execute(quoteDto: QuoteDto): Promise<QuoteDto>;
}
