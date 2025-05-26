import { LineItemDto } from '@/@infrastructure/dtos/LineItemDto';

export interface IAddInvoiceLineItemUseCase {
  executeInvoice(lineItem: LineItemDto): Promise<LineItemDto>;
}
