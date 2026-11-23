// 📌 Application: ViewQuoteUseCase.ts
import { IGetQuoteDetailUseCase } from '@/features/quotes/application/useCases/GetQuoteDetailUseCase';
import { IGetQuoteUseCase } from '@/features/quotes/application/useCases/GetQuoteUseCase';
import { LineItemDto } from '@/features/lineItems/application/dtos/LineItemDto';
import { QuoteDto } from '@/features/quotes/application/dtos/QuoteDto';

export interface IViewQuoteUseCase {
  execute(id: string): Promise<{ quote: QuoteDto | null; lines: LineItemDto[] }>;
}

export class ViewQuoteUseCase {
  constructor(
    private getQuoteUseCase: IGetQuoteUseCase,
    private GetQuoteDetailsUseCase: IGetQuoteDetailUseCase
  ) {}

  async execute(id: string): Promise<{ quote: QuoteDto | null; lines: LineItemDto[] }> {
    const quote = await this.getQuoteUseCase.execute(id);
    const lines = await this.GetQuoteDetailsUseCase.execute(id) ?? [];
    
    return { quote, lines };
  }
}
