import { IRegionManager } from '@/shared/application/ports/IRegionManager';
import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { IUseEditQuoteState } from '@/features/quotes/presentation/types/IUseEditQuoteState';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';

export function useEditQuotePageDependencies() {
  return {
    regionManager: container.get<IRegionManager>(SYMBOLS.Managers.regionManager),
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
    useEditQuoteState: container.get<IUseEditQuoteState>(SYMBOLS.States.Quote.EditQuoteState),
  };
}
