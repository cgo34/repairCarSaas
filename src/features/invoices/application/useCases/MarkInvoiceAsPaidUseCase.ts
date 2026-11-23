import { IGetDocumentStatusUseCase } from '@/features/documentStatuses/application/useCases/GetDocumentStatusUseCase';
import { DocumentStatusDto } from '@/features/documentStatuses/application/dtos/DocumentStatusDto';
import { IInvoiceRepository } from '@/features/invoices/application/ports/repositories/IInvoiceRepository';

export const PAID_INVOICE_STATUS_CODE = 'validated';

export interface IMarkInvoiceAsPaidUseCase {
  execute(invoiceId: string): Promise<DocumentStatusDto>;
}

export class MarkInvoiceAsPaidUseCase implements IMarkInvoiceAsPaidUseCase {
  constructor(
    private readonly invoiceRepository: IInvoiceRepository,
    private readonly getDocumentStatusUseCase: IGetDocumentStatusUseCase
  ) {}

  async execute(invoiceId: string): Promise<DocumentStatusDto> {
    const status = await this.getDocumentStatusUseCase.getByCode(PAID_INVOICE_STATUS_CODE);
    if (!status?.id) throw new Error(`Statut introuvable : ${PAID_INVOICE_STATUS_CODE}`);
    await this.invoiceRepository.updateStatus(invoiceId, status.id);
    return status;
  }
}
