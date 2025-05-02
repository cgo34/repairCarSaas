// TODO: (GCE) -> NOT USE FOR THE MOMENT
import { IInvoiceRepository } from "@/@domain/repositories/IInvoiceRepository";
import { SYMBOLS } from "@/@infrastructure/ioc/symbols";
import { inject, injectable } from "inversify";

@injectable()
export class SaveInvoiceUseCase implements ISaveInvoiceUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.InvoiceRepository)
    private readonly invoiceRepository: IInvoiceRepository
  ) {}

  async execute(invoiceId: string): Promise<void> {
    await this.invoiceRepository.updateStatus(invoiceId, 'saved');
  }
}
