// 📌 Application: InsertInvoiceUseCase.ts
import { IInvoiceRepository } from '@/features/invoices/application/ports/repositories/IInvoiceRepository';
import { InvoiceDto } from '@/features/invoices/application/dtos/InvoiceDto';

export interface IInsertInvoiceUseCase {
  execute(invoiceDto: InvoiceDto): Promise<InvoiceDto>;
}

export class InsertInvoiceUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async execute(invoice: InvoiceDto): Promise<InvoiceDto> {
    return await this.invoiceRepository.create(invoice);
  }
}
