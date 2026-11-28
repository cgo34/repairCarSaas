import { ComputedRef, Ref } from "vue";
import { InvoiceViewModel } from "@/features/invoices/presentation/models/InvoiceViewModel";

export interface IUseViewInvoiceState {
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  
  init: (invoiceId: string) => void;
  downloadPdf: () => void;
  sendInvoice: () => Promise<void>;

  pdfUrl: ComputedRef<string>;
  filename: ComputedRef<string>;
  subtotal: ComputedRef<number>;
  totalDegarnissage: ComputedRef<number>;
  taxRate: ComputedRef<number>;
  totalTax: ComputedRef<number>;
  total: ComputedRef<number>;
  invoice: ComputedRef<InvoiceViewModel | undefined>;
}
