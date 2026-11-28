import { IInvoiceDetailRepository } from '@/features/invoices/application/ports/repositories/IInvoiceDetailRepository';
import { LineItemDto } from '@/features/lineItems/application/dtos/LineItemDto';

export interface IUpdateInvoiceLineItemUseCase {
  execute(lineItem: LineItemDto): Promise<LineItemDto>;
}

export class UpdateInvoiceLineItemUseCase implements IUpdateInvoiceLineItemUseCase {
  constructor(private invoiceDetailRepository: IInvoiceDetailRepository) {}

  async execute(lineItem: LineItemDto): Promise<LineItemDto> {
    return this.invoiceDetailRepository.updateOne(lineItem);
  }
}
