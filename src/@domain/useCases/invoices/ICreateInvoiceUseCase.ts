import { InvoiceDto } from '@/@infrastructure/dtos/InvoiceDto';

export interface ICreateInvoiceUseCase {
  execute(invoiceDto: InvoiceDto, userId: string): Promise<InvoiceDto>;
}
