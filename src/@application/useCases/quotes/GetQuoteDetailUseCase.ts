// 📌 Application: GetQuoteUseCase.ts
import { IQuoteDetailRepository } from '@/@domain/repositories/IQuoteDetailRepository';
import { LineItemDto } from '@/@infrastructure/dtos/LineItemDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class GetQuoteDetailUseCase {
  constructor(@inject(SYMBOLS.Repositories.QuoteDetailRepository) private quoteDetailRepository: IQuoteDetailRepository) {}

  async execute(id: string): Promise<LineItemDto[] | null> {
    const result =  await this.quoteDetailRepository.get(id)
    console.log('GetQuoteDetailUseCase:', id, result);
    
    return result;
  }
}
