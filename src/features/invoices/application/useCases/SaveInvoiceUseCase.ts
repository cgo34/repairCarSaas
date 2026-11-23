// TODO: (GCE) -> NOT USE FOR THE MOMENT
import { IInvoiceRepository } from "@/features/invoices/application/ports/repositories/IInvoiceRepository";

export interface ISaveInvoiceUseCase {
  execute(invoiceId: string): Promise<void>;
}

export class SaveInvoiceUseCase implements ISaveInvoiceUseCase {
  constructor(
    private readonly invoiceRepository: IInvoiceRepository
  ) {}

  async execute(invoiceId: string): Promise<void> {
    await this.invoiceRepository.updateStatus(invoiceId, 'saved');
  }
}
