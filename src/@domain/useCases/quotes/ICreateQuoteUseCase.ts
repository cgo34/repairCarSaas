import { QuoteDto } from '@/@infrastructure/dtos/QuoteDto';

export interface ICreateQuoteUseCase {
  execute(quoteDto: QuoteDto, userId: string): Promise<QuoteDto>;
}
