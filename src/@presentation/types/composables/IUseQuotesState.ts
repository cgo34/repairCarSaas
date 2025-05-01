import { ComputedRef, Ref } from 'vue';
import { QuoteViewModel } from '../models/QuoteViewModel';

export interface IUseQuotesState {
  loading: Ref<boolean>;
  error: Ref<unknown>;

  init(): Promise<void>;
  quotes: ComputedRef<QuoteViewModel[]>;
  deleteQuote(quoteId: string): Promise<void>;
}
