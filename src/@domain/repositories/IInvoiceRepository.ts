import { InvoiceDto } from '@/@application/dtos/InvoiceDto';
import { InvoiceStatusDto } from '@/@infrastructure/dtos/InvoiceStatusDto';

export interface IInvoiceRepository {
  generateInvoiceNumber(userId: string): Promise<string>;
  
  getAll(): Promise<InvoiceDto[]>;
  getAllByUserId(userId: string): Promise<InvoiceDto[]>;
  getById(id: string): Promise<InvoiceDto | null>;
  // getDetails(quoteId: string): Promise<LineItemDto[]>;
  create(quote: InvoiceDto): Promise<InvoiceDto>;
  update(quote: InvoiceDto): Promise<InvoiceDto>;
  delete(id: string): Promise<void>;
  // addLineItem(quoteId: string, lineItem: InvoiceLineItemDto): Promise<void>;
  // updateLineItem(quoteId: string, lineItem: InvoiceLineItemDto): Promise<void>;
  updateStatus(quoteId: string, status: InvoiceStatusDto): Promise<void>;
}
