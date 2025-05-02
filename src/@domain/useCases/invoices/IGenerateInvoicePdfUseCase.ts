// @domain/useCases/invoices/IGenerateInvoicePdfUseCase.ts

import { LineItemDto } from "@/@infrastructure/dtos/LineItemDto";
import { InvoiceDto } from "@/@infrastructure/dtos/InvoiceDto";

export interface IGenerateInvoicePdfUseCase {
  execute(invoice: InvoiceDto, lines: LineItemDto[]): Promise<string>; // PDF blob
}
