import { ComputedRef, Ref } from "vue";
import { InvoiceViewModel } from "../models/InvoiceViewModel";

export interface IUseViewInvoiceState {
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  
  init: (quoteId: string) => void;
  downloadPdf: () => void;
  
  pdfUrl: ComputedRef<string>;
  filename: ComputedRef<string>;
  quote: ComputedRef<InvoiceViewModel | undefined>;
}
