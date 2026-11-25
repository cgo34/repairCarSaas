import { IInvoiceRepository } from '@/features/invoices/application/ports/repositories/IInvoiceRepository';

export interface ICountInvoicesThisMonthUseCase {
  execute(organizationId: string): Promise<number>;
}

export class CountInvoicesThisMonthUseCase implements ICountInvoicesThisMonthUseCase {
  constructor(private readonly invoiceRepository: IInvoiceRepository) {}

  async execute(organizationId: string): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return this.invoiceRepository.countCreatedSince(organizationId, startOfMonth.toISOString());
  }
}
