// @domain/services/IPdfGenerator.ts
import { LineItemDto } from '@/@infrastructure/dtos/LineItemDto';
import { QuoteDto } from '@/@infrastructure/dtos/QuoteDto';

export interface IPdfGenerator {
  generate(quote: QuoteDto, lines: LineItemDto[]): Promise<string>;
}
