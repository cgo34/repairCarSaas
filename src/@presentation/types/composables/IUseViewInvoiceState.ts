import { ComputedRef, Ref } from "vue";
import { InvoiceViewModel } from "../models/InvoiceViewModel";

export interface IUseViewInvoiceState {
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  
  init: (invoiceId: string) => void;
  downloadPdf: () => void;
  sendInvoice: () => Promise<void>;

  pdfUrl: ComputedRef<string>;
  filename: ComputedRef<string>;
  invoice: ComputedRef<InvoiceViewModel | undefined>;
}
