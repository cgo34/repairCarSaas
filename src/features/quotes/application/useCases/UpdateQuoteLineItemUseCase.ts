import { IQuoteDetailRepository } from '@/features/quotes/application/ports/repositories/IQuoteDetailRepository';
import { LineItemDto } from '@/features/lineItems/application/dtos/LineItemDto';

export interface IUpdateQuoteLineItemUseCase {
  execute(lineItem: LineItemDto): Promise<LineItemDto>;
}

export class UpdateQuoteLineItemUseCase implements IUpdateQuoteLineItemUseCase {
  constructor(
    private quoteDetailRepository: IQuoteDetailRepository
  ) {}

  async execute(lineItem: LineItemDto): Promise<LineItemDto> {
    return this.quoteDetailRepository.updateOne(lineItem);
  }
}