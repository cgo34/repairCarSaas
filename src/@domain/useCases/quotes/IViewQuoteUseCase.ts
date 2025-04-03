import { LineItemDto } from '@/@infrastructure/dtos/LineItemDto';
import { QuoteDto } from '@/@infrastructure/dtos/QuoteDto';

export interface IViewQuoteUseCase {
  execute(id: string): Promise<{ quote: QuoteDto | null; lines: LineItemDto[] }>;
}
