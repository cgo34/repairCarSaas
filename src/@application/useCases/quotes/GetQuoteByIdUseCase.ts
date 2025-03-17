// 📌 Application: GetQuoteByIdUseCase.ts
import { Quote } from '@/@domain/entities/Quote';
import { QuoteRepository } from '@/@infrastructure/repositories/QuoteRepository';

export class GetQuoteByIdUseCase {
  constructor(private quoteRepository: QuoteRepository) {}

  async execute(id: string): Promise<Quote | null> {
    return await this.quoteRepository.getById(id);
  }
}
