import { IViewInvoiceUseCase } from '@/features/invoices/application/useCases/ViewInvoiceUseCase';
import { IInvoiceRepository } from '@/features/invoices/application/ports/repositories/IInvoiceRepository';
import { IGetDocumentStatusUseCase } from '@/features/documentStatuses/application/useCases/GetDocumentStatusUseCase';
import { EMPTY_INVOICE_ERROR } from '@/features/invoices/application/useCases/SendInvoiceUseCase';

export interface IFinalizeInvoiceUseCase {
  execute(invoiceId: string): Promise<void>;
}

/** Rend une facture brouillon définitive (« En attente ») sans l'envoyer par email. */
export class FinalizeInvoiceUseCase implements IFinalizeInvoiceUseCase {
  constructor(
    private readonly viewInvoiceUseCase: IViewInvoiceUseCase,
    private readonly invoiceRepository: IInvoiceRepository,
    private readonly getDocumentStatusUseCase: IGetDocumentStatusUseCase,
  ) {}

  async execute(invoiceId: string): Promise<void> {
    const { invoice, lines } = await this.viewInvoiceUseCase.execute(invoiceId);

    if (!invoice || !lines) {
      throw new Error('Invoice or invoice details not found');
    }

    const hasItems = invoice.isForfait ? Number(invoice.forfaitAmount ?? 0) > 0 : lines.length > 0;
    if (!hasItems) {
      throw new Error(EMPTY_INVOICE_ERROR);
    }

    if (invoice.status?.code !== 'draft') {
      return;
    }

    const pendingStatus = await this.getDocumentStatusUseCase.getByCode('pending');
    if (!pendingStatus?.id) throw new Error('Statut introuvable : pending');
    await this.invoiceRepository.updateStatus(invoiceId, pendingStatus.id);
  }
}
