// 📌 Application: DeleteQuoteUseCase.ts
import { IQuoteRepository } from '@/@domain/repositories/IQuoteRepository';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class DeleteQuoteUseCase {
  constructor(@inject(SYMBOLS.Repositories.QuoteRepository) private quoteRepository: IQuoteRepository) {}

  async execute(id: string): Promise<void> {
    await this.quoteRepository.delete(id);
  }
}
