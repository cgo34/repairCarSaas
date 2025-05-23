import { InvoiceDto } from "@/@infrastructure/dtos/InvoiceDto";

export interface IGetInvoiceUseCase {
  execute(userId: string): Promise<InvoiceDto | null>;
}