import { ComputedRef, Ref } from 'vue';
import { QuoteViewModel } from '@/features/quotes/presentation/models/QuoteViewModel';

export interface IUseQuotesState {
  loading: Ref<boolean>;
  error: Ref<unknown>;

  init(): Promise<void>;
  quotes: ComputedRef<QuoteViewModel[]>;
  deleteQuote(quoteId: string): Promise<void>;
  sendQuote(quoteId: string): Promise<void>;
  setStatus(quoteId: string, statusCode: 'accepted' | 'refused'): Promise<void>;
  convertToInvoice(quoteId: string): Promise<string>;
}
