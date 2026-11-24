import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { IGetQuoteUseCase } from '@/features/quotes/application/useCases/GetQuoteUseCase';
import { getSelectedQuoteGuid } from '@/features/quotes/presentation/utils/quoteSelection';
import { NavigationGuard } from 'vue-router';

const LOCKED_STATUS_CODES = ['accepted', 'signed', 'validated', 'invoiced'];

// The selected quote lives in localStorage. Without one, go back to the list.
// The edit page stays reachable for locked quotes: it renders read-only.
export const quoteEditGuard: NavigationGuard = () => {
  if (!getSelectedQuoteGuid()) return { path: '/quotes', replace: true };
  return true;
};

// Items can no longer be changed once the quote is accepted or converted:
// redirect to the (read-only) edit page.
export const quoteItemsGuard: NavigationGuard = async () => {
  const quoteId = getSelectedQuoteGuid();
  if (!quoteId) return { path: '/quotes', replace: true };

  try {
    const getQuoteUseCase = container.get<IGetQuoteUseCase>(SYMBOLS.UseCases.Quote.GetQuoteUseCase);
    const quote = await getQuoteUseCase.execute(quoteId);

    const code = quote?.status?.code ?? '';
    if (quote?.convertToInvoice || LOCKED_STATUS_CODES.includes(code)) {
      return { path: '/quotes/edit', replace: true };
    }
  } catch {
    // On lookup failure, let the page handle its own loading error.
  }

  return true;
};

export const quoteViewGuard: NavigationGuard = () => {
  if (!getSelectedQuoteGuid()) return { path: '/quotes', replace: true };
  return true;
};