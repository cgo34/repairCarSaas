// 📌 Application: UpdateQuoteUseCase.ts
import { IQuoteRepository } from '@/features/quotes/application/ports/repositories/IQuoteRepository';
import { QuoteDto } from '@/features/quotes/application/dtos/QuoteDto';

export interface IUpdateQuoteUseCase {
  execute(quoteDto: QuoteDto): Promise<QuoteDto>;
}

export class UpdateQuoteUseCase {
  constructor(private quoteRepository: IQuoteRepository) {}

  async execute(quote: QuoteDto): Promise<QuoteDto> {
    return await this.quoteRepository.update(quote);
  }
}
