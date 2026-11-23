import { IUseCreateQuoteState } from '@/features/quotes/presentation/types/IUseCreateQuoteState';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';

export function useCreateQuotePageDependencies() {
  return {
    useCreateQuoteState: container.get<IUseCreateQuoteState>(SYMBOLS.States.Quote.CreateQuoteState),
  };
}
