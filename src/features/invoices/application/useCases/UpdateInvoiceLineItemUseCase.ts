import { IInvoiceDetailRepository } from '@/features/invoices/application/ports/repositories/IInvoiceDetailRepository';
import { LineItemDto } from '@/features/lineItems/application/dtos/LineItemDto';

export interface IUpdateInvoiceLineItemUseCase {
  execute(lineItems: LineItemDto[]): Promise<LineItemDto[]>;
}

export class UpdateInvoiceLineItemUseCase implements IUpdateInvoiceLineItemUseCase {
  constructor(
    private invoiceDetailRepository: IInvoiceDetailRepository
  ) {}

  async execute(lineItems: LineItemDto[]): Promise<LineItemDto[]> {
    
    const updatedInvoiceDto = await this.invoiceDetailRepository.update(lineItems);

    return updatedInvoiceDto;
  }
}
