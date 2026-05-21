import { IAuthState } from "@/@application/states/interfaces/IAuthState";
import { IQuotesUseCase } from "@/@domain/useCases/quotes/IQuotesUseCase";
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
  // #endregion

  // #region -> REFS
  const _quotes = ref<QuoteViewModel[]>([]);
  // #endregion

  // #region -> METHODS
  const init = async () => {
    
    if (authState.isAuthenticated && authState.userContext.value) {
      const quotesDto = await getQuotesUseCase.execute(
        authState.userContext.value?.organization.id,
        authState.userContext.value?.membership.id,
        authState.userContext.value?.membership.role
      );
      console.log('Quotes DTO:', quotesDto);
      _quotes.value = quotesDto.map(quote => QuoteMapper.dtoToView(quote));
      console.log('Mapped Quotes:', _quotes.value);
    }
  }

  const deleteQuote = async (quoteId: string) => {
    deleteQuoteUseCase.execute(quoteId);
    _quotes.value = _quotes.value.filter(quote => quote.id !== quoteId);
  }
  // #endregion

  return {
    init,
    deleteQuote,

    quotes: computed(() => _quotes.value)
  }
}