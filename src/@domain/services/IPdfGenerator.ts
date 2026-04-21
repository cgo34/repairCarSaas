// @domain/services/IPdfGenerator.ts
import { InvoiceDto } from '@/@application/dtos/InvoiceDto';
import { LineItemDto } from '@/@application/dtos/LineItemDto';
import { QuoteDto } from '@/@application/dtos/QuoteDto';

export interface IPdfGenerator {
  generate(quote: QuoteDto, lines: LineItemDto[]): Promise<string>;
  generateInvoice(quote: InvoiceDto, lines: LineItemDto[]): Promise<string>;
}
