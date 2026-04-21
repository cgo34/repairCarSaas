// 📌 Application: UpdateInvoiceUseCase.ts
import { IInvoiceRepository } from '@/@domain/repositories/IInvoiceRepository';
import { InvoiceDto } from '@/@application/dtos/InvoiceDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class UpdateInvoiceUseCase {
  constructor(@inject(SYMBOLS.Repositories.InvoiceRepository) private invoiceRepository: IInvoiceRepository) {}

  async execute(invoice: InvoiceDto): Promise<InvoiceDto> {
    return await this.invoiceRepository.update(invoice);
  }
}
