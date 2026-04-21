import { LineItemDto } from '@/@application/dtos/LineItemDto';
import { QuoteDto } from '@/@application/dtos/QuoteDto';

export interface IViewQuoteUseCase {
  execute(id: string): Promise<{ quote: QuoteDto | null; lines: LineItemDto[] }>;
}
