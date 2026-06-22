// @domain/useCases/invoices/IGenerateInvoicePdfUseCase.ts

import { OrganizationProfileDto } from "@/@application/dtos/organizations/OrganizationProfileDto";
import { LineItemDto } from "@/@application/dtos/LineItemDto";
import { InvoiceDto } from "@/@application/dtos/InvoiceDto";

export interface IGenerateInvoicePdfUseCase {
  execute(invoice: InvoiceDto, lines: LineItemDto[], company: OrganizationProfileDto | null): Promise<string>;
}
