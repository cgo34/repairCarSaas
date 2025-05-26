// TODO: (GCE) -> NOT USE FOR THE MOMENT
import { IInvoiceRepository } from '@/@domain/repositories/IInvoiceRepository';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class GetInvoicesUseCase {
  constructor(@inject(SYMBOLS.Repositories.InvoiceRepository) private invoiceRepository: IInvoiceRepository) {}


  async execute(userId: string) {
    return await this.invoiceRepository.getAllByUserId(userId);
  }
}
