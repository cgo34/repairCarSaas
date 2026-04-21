import { InvoiceDto } from '@/@application/dtos/InvoiceDto';

export interface ICreateInvoiceUseCase {
  execute(invoiceDto: InvoiceDto, userId: string): Promise<InvoiceDto>;
}
