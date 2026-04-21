import { InvoiceDto } from '@/@application/dtos/InvoiceDto';

export interface IUpdateInvoiceUseCase {
  execute(invoiceDto: InvoiceDto): Promise<InvoiceDto>;
}
