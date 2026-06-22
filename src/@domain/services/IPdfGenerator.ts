// @domain/services/IPdfGenerator.ts
import { OrganizationProfileDto } from '@/@application/dtos/organizations/OrganizationProfileDto';
import { InvoiceDto } from '@/@application/dtos/InvoiceDto';
import { LineItemDto } from '@/@application/dtos/LineItemDto';
import { QuoteDto } from '@/@application/dtos/QuoteDto';

export interface IPdfGenerator {
  generate(quote: QuoteDto, lines: LineItemDto[], company: OrganizationProfileDto | null): Promise<string>;
  generateInvoice(invoice: InvoiceDto, lines: LineItemDto[], company: OrganizationProfileDto | null): Promise<string>;
}
