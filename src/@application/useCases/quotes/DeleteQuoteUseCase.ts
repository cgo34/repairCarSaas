// 📌 Application: DeleteQuoteUseCase.ts
import { QuoteRepository } from '@/@infrastructure/repositories/QuoteRepository';

export class DeleteQuoteUseCase {
  constructor(private quoteRepository: QuoteRepository) {}

  async execute(id: string): Promise<void> {
    await this.quoteRepository.delete(id);
  }
}
