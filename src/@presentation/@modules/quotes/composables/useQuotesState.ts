import { IAuthState } from "@/@application/states/interfaces/IAuthState";
import { ISendQuoteUseCase } from "@/@domain/useCases/quotes/ISendQuoteUseCase";
import { IQuotesUseCase } from "@/@domain/useCases/quotes/IQuotesUseCase";
import { IGetQuoteUseCase } from "@/@domain/useCases/quotes/IGetQuoteUseCase";
import { IGetQuoteDetailUseCase } from "@/@domain/useCases/quotes/IGetQuoteDetailUseCase";
import { IDuplicateQuoteToInvoiceUseCase } from "@/@domain/useCases/quotes/IDuplicateQuoteToInvoiceUseCase";
import { container } from "@/@infrastructure/ioc/inversify.config";
import { SYMBOLS } from "@/@infrastructure/ioc/symbols";
import { QuoteMapper } from "@/@presentation/mappers/QuoteMapper";
import { QuoteViewModel } from "@/@presentation/types/models/QuoteViewModel";
import { computed, ref } from "vue";

export function useQuotesState() {
  // #region -> DEPENDENCIES
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
  const getQuotesUseCase = container.get<IQuotesUseCase>(SYMBOLS.UseCases.Quote.GetQuotesUseCase);
  const deleteQuoteUseCase = container.get<IQuotesUseCase>(SYMBOLS.UseCases.Quote.DeleteQuoteUseCase);
  const sendQuoteUseCase = container.get<ISendQuoteUseCase>(SYMBOLS.UseCases.Quote.SendQuoteUseCase);
  const getQuoteUseCase = container.get<IGetQuoteUseCase>(SYMBOLS.UseCases.Quote.GetQuoteUseCase);
  const getQuoteDetailUseCase = container.get<IGetQuoteDetailUseCase>(SYMBOLS.UseCases.Quote.GetQuoteDetailsUseCase);
  const duplicateQuoteToInvoiceUseCase = container.get<IDuplicateQuoteToInvoiceUseCase>(SYMBOLS.UseCases.Quote.DuplicateQuoteToInvoiceUseCase);
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
      await sendQuoteUseCase.execute(quoteId);
      const quote = _quotes.value.find(q => q.id === quoteId);
      if (quote) {
        quote.isSent = true;
        quote.sentAt = new Date().toISOString();
      }
    } catch (e) {
      error.value = e;
      throw e;
    } finally {
      loading.value = false;
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
      if (idx !== -1) _quotes.value[idx] = { ..._quotes.value[idx], status: { code: 'invoiced', label: 'Facturé' } as any };
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
    convertToInvoice,
    loading,
    error,

    quotes: computed(() => _quotes.value)
  }
}