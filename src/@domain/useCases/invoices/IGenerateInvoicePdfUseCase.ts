// @domain/useCases/invoices/IGenerateInvoicePdfUseCase.ts

import { LineItemDto } from "@/@application/dtos/LineItemDto";
import { InvoiceDto } from "@/@application/dtos/InvoiceDto";

export interface IGenerateInvoicePdfUseCase {
  execute(invoice: InvoiceDto, lines: LineItemDto[]): Promise<string>; // PDF blob
  
}
