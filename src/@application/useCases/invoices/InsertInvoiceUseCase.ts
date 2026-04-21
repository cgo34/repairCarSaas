// 📌 Application: InsertInvoiceUseCase.ts
import { IInvoiceRepository } from '@/@domain/repositories/IInvoiceRepository';
import { InvoiceDto } from '@/@application/dtos/InvoiceDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class InsertInvoiceUseCase {
  constructor(@inject(SYMBOLS.Repositories.InvoiceRepository) private invoiceRepository: IInvoiceRepository) {}

  async execute(invoice: InvoiceDto): Promise<InvoiceDto> {
    return await this.invoiceRepository.create(invoice);
  }
}
