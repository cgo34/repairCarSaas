import { InvoiceDto } from '@/@application/dtos/InvoiceDto';

export interface IInvoicesUseCase {
  execute(organizationId: string, memberId: string, role: 'admin' | 'manager' | 'technician'): Promise<InvoiceDto[]>;
}
