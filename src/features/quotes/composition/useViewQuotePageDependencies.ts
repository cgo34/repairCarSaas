import { IUseViewQuoteState } from '@/features/quotes/presentation/types/IUseViewQuoteState';
import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';

export function useViewQuotePageDependencies() {
  return {
    useViewQuoteState: container.get<IUseViewQuoteState>(SYMBOLS.States.Quote.ViewQuoteState),
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
  };
}
