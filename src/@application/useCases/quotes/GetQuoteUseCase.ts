// 📌 Application: GetQuoteUseCase.ts
// TODO: (GCE) -> NOT USE FOR THE MOMENT
import { IQuoteRepository } from '@/@domain/repositories/IQuoteRepository';
import { IGetQuoteUseCase } from '@/@domain/useCases/quotes/IGetQuoteUseCase';
import { QuoteDto } from '@/@application/dtos/QuoteDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class GetQuoteUseCase implements IGetQuoteUseCase {
  constructor(@inject(SYMBOLS.Repositories.QuoteRepository) private quoteRepository: IQuoteRepository) {}

  async execute(id: string): Promise<QuoteDto | null> {
    return this.quoteRepository.getById(id);
  }
}
