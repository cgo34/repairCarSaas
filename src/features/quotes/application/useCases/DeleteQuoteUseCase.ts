// 📌 Application: DeleteQuoteUseCase.ts
import { IQuoteRepository } from '@/features/quotes/application/ports/repositories/IQuoteRepository';

export interface IDeleteQuoteUseCase {
  execute(quoteId: string): Promise<void>;
}

export class DeleteQuoteUseCase {
  constructor(private quoteRepository: IQuoteRepository) {}

  async execute(id: string): Promise<void> {
    await this.quoteRepository.delete(id);
  }
}
