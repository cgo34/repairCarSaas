import { LineItemDto } from '@/@application/dtos/LineItemDto';

export interface IAddInvoiceLineItemUseCase {
  executeInvoice(lineItem: LineItemDto): Promise<LineItemDto>;
}
