// 📌 Application: ViewInvoiceUseCase.ts
import { IGetInvoiceDetailUseCase } from '@/features/invoices/application/useCases/GetInvoiceDetailUseCase';
import { IGetInvoiceUseCase } from '@/features/invoices/application/useCases/GetInvoiceUseCase';
import { LineItemDto } from '@/features/lineItems/application/dtos/LineItemDto';
import { InvoiceDto } from '@/features/invoices/application/dtos/InvoiceDto';

export interface IViewInvoiceUseCase {
  execute(id: string): Promise<{ invoice: InvoiceDto | null; lines: LineItemDto[] }>;
}

export class ViewInvoiceUseCase {
  constructor(
    private getInvoiceUseCase: IGetInvoiceUseCase,
    private GetInvoiceDetailsUseCase: IGetInvoiceDetailUseCase
  ) {}

  async execute(id: string): Promise<{ invoice: InvoiceDto | null; lines: LineItemDto[] }> {
    const invoice = await this.getInvoiceUseCase.execute(id);
    const lines = await this.GetInvoiceDetailsUseCase.execute(id) ?? [];
    return { invoice, lines };
  }
}
