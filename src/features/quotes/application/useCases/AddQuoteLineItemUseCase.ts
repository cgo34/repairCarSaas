import { IQuoteDetailRepository } from '@/features/quotes/application/ports/repositories/IQuoteDetailRepository';
import { IQuoteRepository } from '@/features/quotes/application/ports/repositories/IQuoteRepository';
import { LineItemDto } from '@/features/lineItems/application/dtos/LineItemDto';

export interface IAddQuoteLineItemUseCase {
  executeQuote(lineItem: LineItemDto): Promise<LineItemDto>;
}

export class AddQuoteLineItemUseCase implements IAddQuoteLineItemUseCase {
  constructor(
    private quoteRepository: IQuoteRepository,
    private quoteDetailRepository: IQuoteDetailRepository
  ) {}

  async executeQuote(lineItem: LineItemDto): Promise<LineItemDto> {
    return this.quoteDetailRepository.insert(lineItem);
  }
}
