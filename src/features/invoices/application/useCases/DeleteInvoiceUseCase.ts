// 📌 Application: DeleteInvoiceUseCase.ts
import { IInvoiceRepository } from '@/features/invoices/application/ports/repositories/IInvoiceRepository';

export interface IDeleteInvoiceUseCase {
  execute(invoiceId: string): Promise<void>;
}

export class DeleteInvoiceUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async execute(id: string): Promise<void> {
    await this.invoiceRepository.delete(id);
  }
}
