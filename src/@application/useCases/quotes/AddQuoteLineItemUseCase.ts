import { IQuoteDetailRepository } from '@/@domain/repositories/IQuoteDetailRepository';
import { IQuoteRepository } from '@/@domain/repositories/IQuoteRepository';
import { IAddQuoteLineItemUseCase } from '@/@domain/useCases/quotes/IAddQuoteLineItemUseCase';
import { LineItemDto } from '@/@application/dtos/LineItemDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class AddQuoteLineItemUseCase implements IAddQuoteLineItemUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.QuoteRepository) private quoteRepository: IQuoteRepository,
    @inject(SYMBOLS.Repositories.QuoteDetailRepository) private quoteDetailRepository: IQuoteDetailRepository
  ) {}

  async executeQuote(lineItem: LineItemDto): Promise<LineItemDto> {
    console.log('Adding line item to quote:', lineItem);
    return this.quoteDetailRepository.insert(lineItem);
  }
}
