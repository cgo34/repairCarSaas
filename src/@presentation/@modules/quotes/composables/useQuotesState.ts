import { IAuthState } from "@/@application/states/interfaces/IAuthState";
import { IQuotesUseCase } from "@/@domain/useCases/quotes/IQuotesUseCase";
import { QuoteDto } from "@/@infrastructure/dtos/QuoteDto";
import { container } from "@/@infrastructure/ioc/inversify.config";
import { SYMBOLS } from "@/@infrastructure/ioc/symbols";
import { computed, ref } from "vue";

export function useQuotesState() {
  // #region -> DEPENDENCIES
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
  const getQuotesUseCase = container.get<IQuotesUseCase>(SYMBOLS.UseCases.Quote.GetQuotesUseCase);
  const _quotes = ref<QuoteDto[]>([]);
  // #endregion

  const init = async () => {
    console.log('useQuotesState.init');
    
    if (authState.isAuthenticated && authState.user.value) {
      _quotes.value = await getQuotesUseCase.execute(authState.user.value?.id);
    }
  }

  return {
    init,

    quotes: computed(() => _quotes.value)
  }
}