// 📌 Application: UpdateInvoiceUseCase.ts
import { IInvoiceRepository } from '@/features/invoices/application/ports/repositories/IInvoiceRepository';
import { InvoiceDto } from '@/features/invoices/application/dtos/InvoiceDto';

export interface IUpdateInvoiceUseCase {
  execute(invoiceDto: InvoiceDto): Promise<InvoiceDto>;
}

export class UpdateInvoiceUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async execute(invoice: InvoiceDto): Promise<InvoiceDto> {
    return await this.invoiceRepository.update(invoice);
  }
}
