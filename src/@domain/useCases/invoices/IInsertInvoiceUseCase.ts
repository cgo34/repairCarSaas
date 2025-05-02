import { InvoiceDto } from '@/@infrastructure/dtos/InvoiceDto';

export interface IInsertInvoiceUseCase {
  execute(invoiceDto: InvoiceDto): Promise<InvoiceDto>;
}
