import { InvoiceDto } from '@/@infrastructure/dtos/InvoiceDto';
import { LineItemDto } from '@/@infrastructure/dtos/LineItemDto';

export interface IViewInvoiceUseCase {
  execute(id: string): Promise<{ invoice: InvoiceDto | null; lines: LineItemDto[] }>;
}
