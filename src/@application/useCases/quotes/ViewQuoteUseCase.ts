// 📌 Application: ViewQuoteUseCase.ts
import { IGetQuoteDetailUseCase } from '@/@domain/useCases/quotes/IGetQuoteDetailUseCase';
import { IGetQuoteUseCase } from '@/@domain/useCases/quotes/IGetQuoteUseCase';
import { LineItemDto } from '@/@application/dtos/LineItemDto';
import { QuoteDto } from '@/@application/dtos/QuoteDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class ViewQuoteUseCase {
  constructor(
    @inject(SYMBOLS.UseCases.Quote.GetQuoteUseCase) private getQuoteUseCase: IGetQuoteUseCase,
    @inject(SYMBOLS.UseCases.Quote.GetQuoteDetailsUseCase) private GetQuoteDetailsUseCase: IGetQuoteDetailUseCase
  ) {}

  async execute(id: string): Promise<{ quote: QuoteDto | null; lines: LineItemDto[] }> {
    const quote = await this.getQuoteUseCase.execute(id);
    const lines = await this.GetQuoteDetailsUseCase.execute(id) ?? [];
    
    return { quote, lines };
  }
}
