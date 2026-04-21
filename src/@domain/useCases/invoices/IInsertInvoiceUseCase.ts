import { InvoiceDto } from '@/@application/dtos/InvoiceDto';

export interface IInsertInvoiceUseCase {
  execute(invoiceDto: InvoiceDto): Promise<InvoiceDto>;
}
