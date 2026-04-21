// 📌 Application: InsertQuoteUseCase.ts
import { IQuoteRepository } from '@/@domain/repositories/IQuoteRepository';
import { IGetDocumentStatusUseCase } from '@/@domain/useCases/IGetDocumentStatusUseCase';
import { QuoteDto } from '@/@application/dtos/QuoteDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class InsertQuoteUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.QuoteRepository) private quoteRepository: IQuoteRepository,
    @inject(SYMBOLS.UseCases.GetDocumentStatus) private getDocumentStatusUseCase: IGetDocumentStatusUseCase
  ) {}

  async execute(quote: QuoteDto): Promise<QuoteDto> {
    return await this.quoteRepository.create(quote);
  }
}
