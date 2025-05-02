import { InvoiceDto } from '@/@infrastructure/dtos/InvoiceDto';

export interface IInvoicesUseCase {
  execute(userId: string): Promise<InvoiceDto[]>;
}
