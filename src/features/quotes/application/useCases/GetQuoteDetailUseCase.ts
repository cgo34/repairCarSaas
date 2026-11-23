// 📌 Application: GetQuoteDetailUseCase.ts

import { IQuoteDetailRepository } from '@/features/quotes/application/ports/repositories/IQuoteDetailRepository';
import { LineItemDto } from '@/features/lineItems/application/dtos/LineItemDto';

export interface IGetQuoteDetailUseCase {
  execute(quoteId: string): Promise<LineItemDto[] | null>;
}

export class GetQuoteDetailUseCase implements IGetQuoteDetailUseCase {
  constructor(
    private quoteDetailRepository: IQuoteDetailRepository
  ) {}

  async execute(id: string): Promise<LineItemDto[] | null> {
    return this.quoteDetailRepository.get(id);
  }
}
