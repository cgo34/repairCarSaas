// 📌 Application: DeleteInvoiceUseCase.ts
import { IInvoiceRepository } from '@/features/invoices/application/ports/repositories/IInvoiceRepository';
import { IQuoteRepository } from '@/features/quotes/application/ports/repositories/IQuoteRepository';
export interface IDeleteInvoiceUseCase {
  execute(invoiceId: string): Promise<void>;
}

export class DeleteInvoiceUseCase implements IDeleteInvoiceUseCase {
  constructor(
    private invoiceRepository: IInvoiceRepository,
    private quoteRepository: IQuoteRepository
  ) {}

  async execute(id: string): Promise<void> {
    const invoice = await this.invoiceRepository.getById(id);

    await this.invoiceRepository.delete(id);

    // Facture issue d'un devis : on libère le devis pour qu'il puisse être reconverti
    if (invoice?.quote_id) {
      await this.quoteRepository.unmarkAsConverted(invoice.quote_id);
    }
  }
}
