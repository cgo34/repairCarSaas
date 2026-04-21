import { InvoiceDto } from '@/@application/dtos/InvoiceDto';
import { LineItemDto } from '@/@application/dtos/LineItemDto';

export interface IViewInvoiceUseCase {
  execute(id: string): Promise<{ invoice: InvoiceDto | null; lines: LineItemDto[] }>;
}
