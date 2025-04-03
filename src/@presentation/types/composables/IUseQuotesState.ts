import { QuoteDto } from '@/@infrastructure/dtos/QuoteDto';
import { ComputedRef, Ref } from 'vue';

export interface IUseQuotesState {
  loading: Ref<boolean>;
  error: Ref<unknown>;

  init(): Promise<void>;
  quotes: ComputedRef<QuoteDto[]>;
  deleteQuote(quoteId: string): Promise<void>;
}
