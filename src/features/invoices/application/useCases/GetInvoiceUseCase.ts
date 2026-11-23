// 📌 Application: GetInvoiceUseCase.ts
// TODO: (GCE) -> NOT USE FOR THE MOMENT
import { IInvoiceRepository } from '@/features/invoices/application/ports/repositories/IInvoiceRepository';
import { InvoiceDto } from '@/features/invoices/application/dtos/InvoiceDto';

export interface IGetInvoiceUseCase {
  execute(userId: string): Promise<InvoiceDto | null>;
}

export class GetInvoiceUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async execute(id: string): Promise<InvoiceDto | null> {
    return await this.invoiceRepository.getById(id);
  }
}
