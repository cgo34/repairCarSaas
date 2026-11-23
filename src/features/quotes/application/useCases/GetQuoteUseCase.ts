// 📌 Application: GetQuoteUseCase.ts
// TODO: (GCE) -> NOT USE FOR THE MOMENT
import { IQuoteRepository } from '@/features/quotes/application/ports/repositories/IQuoteRepository';
import { QuoteDto } from '@/features/quotes/application/dtos/QuoteDto';

export interface IGetQuoteUseCase {
  execute(quoteId: string): Promise<QuoteDto | null>;
}

export class GetQuoteUseCase implements IGetQuoteUseCase {
  constructor(private quoteRepository: IQuoteRepository) {}

  async execute(id: string): Promise<QuoteDto | null> {
    return this.quoteRepository.getById(id);
  }
}
