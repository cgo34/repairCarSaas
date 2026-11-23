// 📌 Application: InsertQuoteUseCase.ts
import { IQuoteRepository } from '@/features/quotes/application/ports/repositories/IQuoteRepository';
import { IGetDocumentStatusUseCase } from '@/features/documentStatuses/application/useCases/GetDocumentStatusUseCase';
import { QuoteDto } from '@/features/quotes/application/dtos/QuoteDto';

export interface IInsertQuoteUseCase {
  execute(quoteDto: QuoteDto): Promise<QuoteDto>;
}

export class InsertQuoteUseCase {
  constructor(
    private quoteRepository: IQuoteRepository,
    private getDocumentStatusUseCase: IGetDocumentStatusUseCase
  ) {}

  async execute(quote: QuoteDto): Promise<QuoteDto> {
    return await this.quoteRepository.create(quote);
  }
}
