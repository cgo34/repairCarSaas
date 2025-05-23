import { LineItemDto } from '@/@infrastructure/dtos/LineItemDto';

export interface IUpdateInvoiceLineItemUseCase {
  execute(invoiceId: string, lineItem: LineItemDto[]): Promise<LineItemDto[]>;
}
