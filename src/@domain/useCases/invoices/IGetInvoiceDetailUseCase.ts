import { LineItemDto } from "@/@infrastructure/dtos/LineItemDto";

export interface IGetInvoiceDetailUseCase {
  execute(invoiceId: string): Promise<LineItemDto[] | null>;
}