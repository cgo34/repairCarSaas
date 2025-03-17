// 📌 Application: UpdateQuoteUseCase.ts
import { Quote } from '@/@domain/entities/Quote';
import { QuoteRepository } from '@/@infrastructure/repositories/QuoteRepository';

export class UpdateQuoteUseCase {
  constructor(private quoteRepository: QuoteRepository) {}

  async execute(quote: Quote): Promise<Quote> {
    return await this.quoteRepository.update(quote);
  }
}
