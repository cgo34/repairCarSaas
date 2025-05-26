// @domain/services/IPdfGenerator.ts
import { InvoiceDto } from '@/@infrastructure/dtos/InvoiceDto';
import { LineItemDto } from '@/@infrastructure/dtos/LineItemDto';
import { QuoteDto } from '@/@infrastructure/dtos/QuoteDto';

export interface IPdfGenerator {
  generate(quote: QuoteDto, lines: LineItemDto[]): Promise<string>;
  generateInvoice(quote: InvoiceDto, lines: LineItemDto[]): Promise<string>;
}
