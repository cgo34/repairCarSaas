import { QuoteDto } from '@/@application/dtos/QuoteDto';

export interface ICreateQuoteUseCase {
  execute(quoteDto: QuoteDto, userId: string): Promise<QuoteDto>;
}
