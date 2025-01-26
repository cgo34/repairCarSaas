import { Invoice } from '@/@domain/entities/Invoice';

export interface IInvoiceRepository {
  getAll(): Promise<Invoice[]>;
  getById(id: string): Promise<Invoice | null>;
  create(invoice: Invoice): Promise<void>;
  update(invoice: Invoice): Promise<void>;
  delete(id: string): Promise<void>;
}
