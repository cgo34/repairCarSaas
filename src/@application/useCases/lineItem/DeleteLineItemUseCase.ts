import { IQuoteDetailRepository } from '@/@domain/repositories/IQuoteDetailRepository';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class DeleteLineItemUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.QuoteDetailRepository) private quoteDetailRepository: IQuoteDetailRepository
  ) {}

  async execute(lineId: string): Promise<void> {
    return await this.quoteDetailRepository.delete(lineId);
  }
}
