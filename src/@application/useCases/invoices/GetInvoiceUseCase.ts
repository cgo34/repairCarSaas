// 📌 Application: GetInvoiceUseCase.ts
// TODO: (GCE) -> NOT USE FOR THE MOMENT
import { IInvoiceRepository } from '@/@domain/repositories/IInvoiceRepository';
import { InvoiceDto } from '@/@infrastructure/dtos/InvoiceDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class GetInvoiceUseCase {
  constructor(@inject(SYMBOLS.Repositories.InvoiceRepository) private invoiceRepository: IInvoiceRepository) {}

  async execute(id: string): Promise<InvoiceDto | null> {
    return await this.invoiceRepository.getById(id);
  }
}
