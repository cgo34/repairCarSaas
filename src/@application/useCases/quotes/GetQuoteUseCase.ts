// 📌 Application: GetQuoteUseCase.ts
// TODO: (GCE) -> NOT USE FOR THE MOMENT
import { IQuoteRepository } from '@/@domain/repositories/IQuoteRepository';
import { QuoteDto } from '@/@infrastructure/dtos/QuoteDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class GetQuoteUseCase {
  constructor(@inject(SYMBOLS.Repositories.QuoteRepository) private quoteRepository: IQuoteRepository) {}

  async execute(id: string): Promise<QuoteDto | null> {
    return await this.quoteRepository.getById(id);
  }
}
