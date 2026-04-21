import { QuoteDto } from '@/@application/dtos/QuoteDto';

export interface IQuotesUseCase {
  execute(userId: string): Promise<QuoteDto[]>;
}
