import { InvoiceDto } from '@/@application/dtos/InvoiceDto';

export interface IInvoicesUseCase {
  execute(userId: string): Promise<InvoiceDto[]>;
}
