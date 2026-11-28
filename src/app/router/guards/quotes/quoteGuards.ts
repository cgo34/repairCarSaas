import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { buildPreviewBreadcrumb } from '@/app/router/guards/documentBreadcrumb';
import { IGetQuoteUseCase } from '@/features/quotes/application/useCases/GetQuoteUseCase';
import { getSelectedQuoteGuid } from '@/features/quotes/presentation/utils/quoteSelection';
import { NavigationGuard } from 'vue-router';

const LOCKED_STATUS_CODES = ['accepted', 'refused', 'signed', 'validated', 'invoiced'];

// Returns whether the selected quote is locked, or undefined when it cannot be read.
const isSelectedQuoteLocked = async (quoteId: string): Promise<boolean | undefined> => {
  try {
    const getQuoteUseCase = container.get<IGetQuoteUseCase>(SYMBOLS.UseCases.Quote.GetQuoteUseCase);
    const quote = await getQuoteUseCase.execute(quoteId);
    if (!quote) return undefined;
    return Boolean(quote.convertToInvoice) || LOCKED_STATUS_CODES.includes(quote.status?.code ?? '');
  } catch {
    // On lookup failure, let the page handle its own loading error.
    return undefined;
  }
};

// The selected quote lives in localStorage. Without one, go back to the list.
// A locked quote can no longer be edited: /quotes/edit redirects to /quotes/view.
export const quoteEditGuard: NavigationGuard = async () => {
  const quoteId = getSelectedQuoteGuid();
  if (!quoteId) return { path: '/quotes', replace: true };

  if ((await isSelectedQuoteLocked(quoteId)) === true) return { path: '/quotes/view', replace: true };
  return true;
};

// The read-only view only makes sense for a locked quote; an editable one goes to /quotes/edit.
export const quoteViewGuard: NavigationGuard = async () => {
  const quoteId = getSelectedQuoteGuid();
  if (!quoteId) return { path: '/quotes', replace: true };

  if ((await isSelectedQuoteLocked(quoteId)) === false) return { path: '/quotes/edit', replace: true };
  return true;
};

// Items can no longer be changed once the quote is locked: redirect to the read-only view.
export const quoteItemsGuard: NavigationGuard = async () => {
  const quoteId = getSelectedQuoteGuid();
  if (!quoteId) return { path: '/quotes', replace: true };

  if ((await isSelectedQuoteLocked(quoteId)) === true) return { path: '/quotes/view', replace: true };
  return true;
};

// PDF preview: the breadcrumb parent depends on the quote state.
// to.meta is rebuilt on every navigation, so assigning here does not leak between visits.
export const quotePreviewGuard: NavigationGuard = async (to) => {
  const quoteId = getSelectedQuoteGuid();
  if (!quoteId) return { path: '/quotes', replace: true };

  const locked = await isSelectedQuoteLocked(quoteId);
  if (locked !== undefined) to.meta.breadcrumb = buildPreviewBreadcrumb('quotes', locked);
  return true;
};
