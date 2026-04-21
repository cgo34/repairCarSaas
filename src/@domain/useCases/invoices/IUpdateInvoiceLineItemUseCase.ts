import { LineItemDto } from '@/@application/dtos/LineItemDto';

export interface IUpdateInvoiceLineItemUseCase {
  execute(invoiceId: string, lineItem: LineItemDto[]): Promise<LineItemDto[]>;
}
