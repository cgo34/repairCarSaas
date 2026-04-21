import { LineItemDto } from "@/@application/dtos/LineItemDto";

export interface IGetInvoiceDetailUseCase {
  execute(invoiceId: string): Promise<LineItemDto[] | null>;
}