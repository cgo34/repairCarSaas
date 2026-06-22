import { ComputedRef, Ref } from "vue";
import { QuoteViewModel } from "../models/QuoteViewModel";

export interface IUseViewQuoteState {
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  
  init: (quoteId: string) => void;
  downloadPdf: () => void;
  sendQuote: () => Promise<void>;

  pdfUrl: ComputedRef<string>;
  filename: ComputedRef<string>;
  quote: ComputedRef<QuoteViewModel | undefined>;
}
