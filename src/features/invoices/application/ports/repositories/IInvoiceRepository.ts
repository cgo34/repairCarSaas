import { InvoiceDto } from '@/features/invoices/application/dtos/InvoiceDto';

export interface IInvoiceRepository {
  generateInvoiceNumber(organizationId: string): Promise<string>;
  
  getAllByOrganizationMemberId(organizationId: string, memberId: string, role: 'admin' | 'manager' | 'technician'): Promise<InvoiceDto[]>;
  getById(id: string): Promise<InvoiceDto | null>;
  // getDetails(quoteId: string): Promise<LineItemDto[]>;
  create(quote: InvoiceDto): Promise<InvoiceDto>;
  update(quote: InvoiceDto): Promise<InvoiceDto>;
  delete(id: string): Promise<void>;
  // addLineItem(quoteId: string, lineItem: InvoiceLineItemDto): Promise<void>;
  // updateLineItem(quoteId: string, lineItem: InvoiceLineItemDto): Promise<void>;
  updateStatus(invoiceId: string, statusId: string): Promise<void>;
  markAsSent(invoiceId: string): Promise<void>;
  getByTechnicianId(technicianId: string): Promise<InvoiceDto[]>;
  updateCommission(invoiceId: string, commissionRate: number | null, commissionPaid: boolean): Promise<void>;
}
