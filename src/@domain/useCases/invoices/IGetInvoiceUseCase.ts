import { InvoiceDto } from "@/@application/dtos/InvoiceDto";

export interface IGetInvoiceUseCase {
  execute(userId: string): Promise<InvoiceDto | null>;
}