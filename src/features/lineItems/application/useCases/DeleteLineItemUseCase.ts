import { IQuoteDetailRepository } from '@/features/quotes/application/ports/repositories/IQuoteDetailRepository';

export interface IDeleteLineItemUseCase {
  execute(lineId: string): Promise<void>;
}

export class DeleteLineItemUseCase {
  constructor(
    private quoteDetailRepository: IQuoteDetailRepository
  ) {}

  async execute(lineId: string): Promise<void> {
    return await this.quoteDetailRepository.delete(lineId);
  }
}
