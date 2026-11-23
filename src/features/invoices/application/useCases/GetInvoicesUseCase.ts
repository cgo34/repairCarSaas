// TODO: (GCE) -> NOT USE FOR THE MOMENT
import { IInvoiceRepository } from '@/features/invoices/application/ports/repositories/IInvoiceRepository';
import { InvoiceDto } from '@/features/invoices/application/dtos/InvoiceDto';

export interface IInvoicesUseCase {
  execute(organizationId: string, memberId: string, role: 'admin' | 'manager' | 'technician'): Promise<InvoiceDto[]>;
}

export class GetInvoicesUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}


  async execute(organizationId: string, memberId: string, role: 'admin' | 'manager' | 'technician') {
    return await this.invoiceRepository.getAllByOrganizationMemberId(organizationId, memberId, role);
  }
}
