// @domain/services/IPdfGenerator.ts
import { OrganizationProfileDto } from '@/features/organizations/application/dtos/OrganizationProfileDto';
import { InvoiceDto } from '@/features/invoices/application/dtos/InvoiceDto';
import { LineItemDto } from '@/features/lineItems/application/dtos/LineItemDto';
import { QuoteDto } from '@/features/quotes/application/dtos/QuoteDto';

export interface IPdfGenerator {
  generate(quote: QuoteDto, lines: LineItemDto[], company: OrganizationProfileDto | null): Promise<string>;
  generateInvoice(invoice: InvoiceDto, lines: LineItemDto[], company: OrganizationProfileDto | null): Promise<string>;
}
