import { IInvoiceRepository } from '@/features/invoices/application/ports/repositories/IInvoiceRepository';

export interface ICountConversionsThisMonthUseCase {
  execute(organizationId: string): Promise<number>;
}

export class CountConversionsThisMonthUseCase implements ICountConversionsThisMonthUseCase {
  constructor(private readonly invoiceRepository: IInvoiceRepository) {}

  async execute(organizationId: string): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return this.invoiceRepository.countConversionsSince(organizationId, startOfMonth.toISOString());
  }
}
