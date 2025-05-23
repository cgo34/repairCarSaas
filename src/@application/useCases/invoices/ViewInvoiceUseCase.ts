// 📌 Application: ViewInvoiceUseCase.ts
import { IGetInvoiceDetailUseCase } from '@/@domain/useCases/invoices/IGetInvoiceDetailUseCase';
import { IGetInvoiceUseCase } from '@/@domain/useCases/invoices/IGetInvoiceUseCase';
import { LineItemDto } from '@/@infrastructure/dtos/LineItemDto';
import { InvoiceDto } from '@/@infrastructure/dtos/InvoiceDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class ViewInvoiceUseCase {
  constructor(
    @inject(SYMBOLS.UseCases.Invoice.GetInvoiceUseCase) private getInvoiceUseCase: IGetInvoiceUseCase,
    @inject(SYMBOLS.UseCases.Invoice.GetInvoiceDetailsUseCase) private GetInvoiceDetailsUseCase: IGetInvoiceDetailUseCase
  ) {}

  async execute(id: string): Promise<{ invoice: InvoiceDto | null; lines: LineItemDto[] }> {
    const invoice = await this.getInvoiceUseCase.execute(id);
    const lines = await this.GetInvoiceDetailsUseCase.execute(id) ?? [];
    
    return { invoice, lines };
  }
}
