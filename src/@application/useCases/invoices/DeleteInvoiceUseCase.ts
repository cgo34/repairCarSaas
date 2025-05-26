// 📌 Application: DeleteInvoiceUseCase.ts
import { IInvoiceRepository } from '@/@domain/repositories/IInvoiceRepository';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class DeleteInvoiceUseCase {
  constructor(@inject(SYMBOLS.Repositories.InvoiceRepository) private invoiceRepository: IInvoiceRepository) {}

  async execute(id: string): Promise<void> {
    await this.invoiceRepository.delete(id);
  }
}
