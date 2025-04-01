import { QuoteDto } from '@/@infrastructure/dtos/QuoteDto';

export interface IQuotesUseCase {
  execute(userId: string): Promise<QuoteDto[]>;
}
