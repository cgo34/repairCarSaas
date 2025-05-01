// TODO: (GCE) -> NOT USE FOR THE MOMENT
import { IQuoteRepository } from '@/@domain/repositories/IQuoteRepository';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class GetQuotesUseCase {
  constructor(@inject(SYMBOLS.Repositories.QuoteRepository) private quoteRepository: IQuoteRepository) {}


  async execute(userId: string) {
    return await this.quoteRepository.getAllByUserId(userId);
  }
}
