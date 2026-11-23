import { ComputedRef } from 'vue';
import { InvoiceViewModel } from '@/features/invoices/presentation/models/InvoiceViewModel';

export interface IUseInvoicesState {
  init(): Promise<void>;
  invoices: ComputedRef<InvoiceViewModel[]>;
  deleteInvoice(invoiceId: string): Promise<void>;
  markAsPaid(invoiceId: string): Promise<void>;
}
