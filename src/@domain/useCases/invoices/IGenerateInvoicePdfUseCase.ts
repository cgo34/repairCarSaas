// @domain/useCases/invoices/IGenerateInvoicePdfUseCase.ts

import { CompanySettingsDto } from "@/@application/dtos/CompanySettingsDto";
import { LineItemDto } from "@/@application/dtos/LineItemDto";
import { InvoiceDto } from "@/@application/dtos/InvoiceDto";

export interface IGenerateInvoicePdfUseCase {
  execute(invoice: InvoiceDto, lines: LineItemDto[], company: CompanySettingsDto | null): Promise<string>;
}
