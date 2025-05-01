// 📌 Application: UpdateQuoteUseCase.ts
import { IQuoteRepository } from '@/@domain/repositories/IQuoteRepository';
import { QuoteDto } from '@/@infrastructure/dtos/QuoteDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class UpdateQuoteUseCase {
  constructor(@inject(SYMBOLS.Repositories.QuoteRepository) private quoteRepository: IQuoteRepository) {}

  async execute(quote: QuoteDto): Promise<QuoteDto> {
    return await this.quoteRepository.update(quote);
  }
}
