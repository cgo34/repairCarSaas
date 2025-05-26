import { InvoiceDto } from '@/@infrastructure/dtos/InvoiceDto';

export interface IUpdateInvoiceUseCase {
  execute(invoiceDto: InvoiceDto): Promise<InvoiceDto>;
}
