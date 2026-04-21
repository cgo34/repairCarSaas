// 📌 Application: GetQuoteDetailUseCase.ts

import { IQuoteDetailRepository } from '@/@domain/repositories/IQuoteDetailRepository';
import { IGetQuoteDetailUseCase } from '@/@domain/useCases/quotes/IGetQuoteDetailUseCase';
import { LineItemDto } from '@/@application/dtos/LineItemDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class GetQuoteDetailUseCase implements IGetQuoteDetailUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.QuoteDetailRepository) private quoteDetailRepository: IQuoteDetailRepository
  ) {}

  async execute(id: string): Promise<LineItemDto[] | null> {
    return this.quoteDetailRepository.get(id);
  }
}
