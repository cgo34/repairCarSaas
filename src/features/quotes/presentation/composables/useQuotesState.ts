import { IAuthState } from "@/features/auth/presentation/state/IAuthState";
import { IDeleteQuoteUseCase } from '@/features/quotes/application/useCases/DeleteQuoteUseCase';
import { ISendQuoteUseCase } from '@/features/quotes/application/useCases/SendQuoteUseCase';
import { IQuotesUseCase } from '@/features/quotes/application/useCases/GetQuotesUseCase';
import { IGetQuoteUseCase } from '@/features/quotes/application/useCases/GetQuoteUseCase';
import { IGetQuoteDetailUseCase } from '@/features/quotes/application/useCases/GetQuoteDetailUseCase';
import { IDuplicateQuoteToInvoiceUseCase } from '@/features/quotes/application/useCases/DuplicateQuoteToInvoiceUseCase';
import { IUpdateStatusQuoteUseCase } from '@/features/quotes/application/useCases/UpdateStatusQuoteUseCase';
import { QuoteMapper } from "@/features/quotes/presentation/mappers/QuoteMapper";
import { QuoteViewModel } from "@/features/quotes/presentation/models/QuoteViewModel";
import { computed, ref } from "vue";

export interface UseQuotesStateDependencies {
  authState: IAuthState;
  getQuotesUseCase: IQuotesUseCase;
  deleteQuoteUseCase: IDeleteQuoteUseCase;
  sendQuoteUseCase: ISendQuoteUseCase;
  getQuoteUseCase: IGetQuoteUseCase;
  getQuoteDetailUseCase: IGetQuoteDetailUseCase;
  duplicateQuoteToInvoiceUseCase: IDuplicateQuoteToInvoiceUseCase;
  updateStatusQuoteUseCase: IUpdateStatusQuoteUseCase;
}

export function createUseQuotesState(deps: UseQuotesStateDependencies) {
  // #region -> DEPENDENCIES
  const { authState, getQuotesUseCase, deleteQuoteUseCase, sendQuoteUseCase, getQuoteUseCase, getQuoteDetailUseCase, duplicateQuoteToInvoiceUseCase, updateStatusQuoteUseCase } = deps;
  // #endregion

  // #region -> REFS
  const _quotes = ref<QuoteViewModel[]>([]);
  const loading = ref(false);
  const error = ref<unknown>(null);
  // #endregion

  // #region -> METHODS
  const init = async () => {
    if (authState.isAuthenticated && authState.userContext.value) {
      const quotesDto = await getQuotesUseCase.execute(
        authState.userContext.value?.organization.id,
        authState.userContext.value?.membership.id,
        authState.userContext.value?.membership.role
      );
      _quotes.value = quotesDto.map(quote => QuoteMapper.dtoToView(quote));
    }
  }

  const deleteQuote = async (quoteId: string) => {
    deleteQuoteUseCase.execute(quoteId);
    _quotes.value = _quotes.value.filter(quote => quote.id !== quoteId);
  }

  const sendQuote = async (quoteId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const status = await sendQuoteUseCase.execute(quoteId);
      const quote = _quotes.value.find(q => q.id === quoteId);
      if (quote) {
        quote.isSent = true;
        quote.sentAt = new Date();
        quote.status_id = status.id;
        quote.status = { ...(quote.status ?? {}), ...status } as QuoteViewModel['status'];
      }
    } catch (e) {
      error.value = e;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  const setStatus = async (quoteId: string, statusCode: 'accepted' | 'refused') => {
    const status = await updateStatusQuoteUseCase.execute(quoteId, statusCode);
    const idx = _quotes.value.findIndex(q => q.id === quoteId);
    if (idx !== -1) {
      _quotes.value[idx] = {
        ..._quotes.value[idx],
        status_id: status.id,
        status: { ...(_quotes.value[idx].status ?? {}), ...status } as QuoteViewModel['status'],
      };
    }
  }

  const convertToInvoice = async (quoteId: string): Promise<string> => {
    loading.value = true;
    error.value = null;
    try {
      const quote = await getQuoteUseCase.execute(quoteId);
      if (!quote) throw new Error('Devis introuvable');
      const lines = await getQuoteDetailUseCase.execute(quoteId) ?? [];
      const invoice = await duplicateQuoteToInvoiceUseCase.execute(quote, lines);
      const idx = _quotes.value.findIndex(q => q.id === quoteId);
      if (idx !== -1) _quotes.value[idx] = { ..._quotes.value[idx], convertToInvoice: true };
      return invoice.id!;
    } catch (e) {
      error.value = e;
      throw e;
    } finally {
      loading.value = false;
    }
  }
  // #endregion

  return {
    init,
    deleteQuote,
    sendQuote,
    setStatus,
    convertToInvoice,
    loading,
    error,

    quotes: computed(() => _quotes.value)
  }
}