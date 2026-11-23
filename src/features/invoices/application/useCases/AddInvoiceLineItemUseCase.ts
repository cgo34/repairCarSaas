import { IInvoiceDetailRepository } from '@/features/invoices/application/ports/repositories/IInvoiceDetailRepository';
import { IInvoiceRepository } from '@/features/invoices/application/ports/repositories/IInvoiceRepository';
import { LineItemDto } from '@/features/lineItems/application/dtos/LineItemDto';

export interface IAddInvoiceLineItemUseCase {
  executeInvoice(lineItem: LineItemDto): Promise<LineItemDto>;
}

export class AddInvoiceLineItemUseCase {
  constructor(
    private invoiceRepository: IInvoiceRepository,
    private invoiceDetailRepository: IInvoiceDetailRepository
  ) {}

  async executeInvoice(lineItem: LineItemDto): Promise<LineItemDto> {
    const updatedInvoiceDto = await this.invoiceDetailRepository.insert(lineItem);

    // 🔹 6. Retourner l’entité en DTO pour la présentation
    return updatedInvoiceDto;
  }
}
