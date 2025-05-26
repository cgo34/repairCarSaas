// 📌 Application: InsertQuoteUseCase.ts
import { IQuoteRepository } from '@/@domain/repositories/IQuoteRepository';
import { IGetDocumentStatuseUseCase } from '@/@domain/useCases/IGetDocumentStatuseUseCase';
import { QuoteDto } from '@/@infrastructure/dtos/QuoteDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class InsertQuoteUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.QuoteRepository) private quoteRepository: IQuoteRepository,
    @inject(SYMBOLS.UseCases.GetDocumentStatuse) private getDocumentStatuseUseCase: IGetDocumentStatuseUseCase
  ) {}

  async execute(quote: QuoteDto): Promise<QuoteDto> {
    const processingStatus = (await this.getDocumentStatuseUseCase.execute()).find(s => s.code === 'processing')

    quote.status_id = processingStatus.id
    
    return await this.quoteRepository.create(quote);
  }
}
