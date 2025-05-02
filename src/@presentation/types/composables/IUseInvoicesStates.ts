import { ComputedRef, Ref } from 'vue';
import { InvoiceViewModel } from '../models/InvoiceViewModel';

export interface IUseInvoicesState {
  loading: Ref<boolean>;
  error: Ref<unknown>;

  init(): Promise<void>;
  quotes: ComputedRef<InvoiceViewModel[]>;
  deleteInvoice(quoteId: string): Promise<void>;
}
