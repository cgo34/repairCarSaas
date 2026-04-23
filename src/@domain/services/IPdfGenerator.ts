// @domain/services/IPdfGenerator.ts
import { CompanySettingsDto } from '@/@application/dtos/CompanySettingsDto';
import { InvoiceDto } from '@/@application/dtos/InvoiceDto';
import { LineItemDto } from '@/@application/dtos/LineItemDto';
import { QuoteDto } from '@/@application/dtos/QuoteDto';

export interface IPdfGenerator {
  generate(quote: QuoteDto, lines: LineItemDto[], company: CompanySettingsDto | null): Promise<string>;
  generateInvoice(invoice: InvoiceDto, lines: LineItemDto[], company: CompanySettingsDto | null): Promise<string>;
}
