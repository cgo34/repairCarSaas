import { IQuoteDetailRepository } from '@/features/quotes/application/ports/repositories/IQuoteDetailRepository';
import { LineItemDto } from '@/features/lineItems/application/dtos/LineItemDto';

export interface IUpdateQuoteLineItemUseCase {
  execute(quoteId: string, lineItem: LineItemDto[]): Promise<LineItemDto[]>;
}

export class UpdateQuoteLineItemUseCase {
  constructor(
    private quoteDetailRepository: IQuoteDetailRepository
  ) {}

  async execute(lineItems: LineItemDto[]): Promise<LineItemDto[]> {
    
    const updatedQuoteDto = await this.quoteDetailRepository.update(lineItems);

    return updatedQuoteDto;
  }
}
