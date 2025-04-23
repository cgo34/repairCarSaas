import { IQuoteDetailRepository } from '@/@domain/repositories/IQuoteDetailRepository';
import { LineItemDto } from '@/@infrastructure/dtos/LineItemDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class UpdateQuoteLineItemUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.QuoteDetailRepository) private quoteDetailRepository: IQuoteDetailRepository
  ) {}

  async execute(lineItems: LineItemDto[]): Promise<LineItemDto[]> {
    
    const updatedQuoteDto = await this.quoteDetailRepository.update(lineItems);

    return updatedQuoteDto;
  }
}
