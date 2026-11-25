import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { buildPreviewBreadcrumb } from '@/app/router/guards/documentBreadcrumb';
import { IGetInvoiceUseCase } from '@/features/invoices/application/useCases/GetInvoiceUseCase';
import { getSelectedInvoiceGuid } from '@/features/invoices/presentation/utils/invoiceSelection';
import { NavigationGuard } from 'vue-router';

// An invoice is locked as soon as it leaves the draft status.
// Returns undefined when the invoice cannot be read.
const isSelectedInvoiceLocked = async (id: string): Promise<boolean | undefined> => {
  try {
    const getInvoiceUseCase = container.get<IGetInvoiceUseCase>(SYMBOLS.UseCases.Invoice.GetInvoiceUseCase);
    const invoice = await getInvoiceUseCase.execute(id);
    if (!invoice) return undefined;
    const code = invoice.status?.code ?? '';
    return code !== '' && code !== 'draft';
  } catch {
    // On lookup failure, let the page handle its own loading error.
    return undefined;
  }
};

// The selected invoice lives in localStorage. Without one, go back to the list.
// A locked invoice can no longer be edited: /invoices/edit redirects to /invoices/view.
export const invoiceEditGuard: NavigationGuard = async () => {
  const id = getSelectedInvoiceGuid();
  if (!id) return { path: '/invoices', replace: true };

  if ((await isSelectedInvoiceLocked(id)) === true) return { path: '/invoices/view', replace: true };
  return true;
};

// The read-only view only makes sense for a locked invoice; a draft goes to /invoices/edit.
export const invoiceViewGuard: NavigationGuard = async () => {
  const id = getSelectedInvoiceGuid();
  if (!id) return { path: '/invoices', replace: true };

  if ((await isSelectedInvoiceLocked(id)) === false) return { path: '/invoices/edit', replace: true };
  return true;
};

// Items can only be changed on a draft: a locked invoice goes to the read-only view.
export const invoiceItemsGuard: NavigationGuard = async () => {
  const id = getSelectedInvoiceGuid();
  if (!id) return { path: '/invoices', replace: true };

  if ((await isSelectedInvoiceLocked(id)) === true) return { path: '/invoices/view', replace: true };
  return true;
};

// PDF preview: the breadcrumb parent depends on the invoice state.
// to.meta is rebuilt on every navigation, so assigning here does not leak between visits.
export const invoicePreviewGuard: NavigationGuard = async (to) => {
  const id = getSelectedInvoiceGuid();
  if (!id) return { path: '/invoices', replace: true };

  const locked = await isSelectedInvoiceLocked(id);
  if (locked !== undefined) to.meta.breadcrumb = buildPreviewBreadcrumb('invoices', locked);
  return true;
};
