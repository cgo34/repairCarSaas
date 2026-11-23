import { IInvoiceRepository } from '@/features/invoices/application/ports/repositories/IInvoiceRepository';

export interface ICreateInvoiceUseCase {
  execute(organizationId: string): Promise<string>; // Retourne uniquement l'invoiceNumber
}

export class CreateInvoiceUseCase implements ICreateInvoiceUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async execute(organizationId: string): Promise<string> {
    return this.invoiceRepository.generateInvoiceNumber(organizationId);
  }
}
