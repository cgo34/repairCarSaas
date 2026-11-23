import { IUseViewInvoiceState } from '@/features/invoices/presentation/types/IUseViewInvoiceState';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';

export function useViewInvoicePageDependencies() {
  return {
    useViewInvoiceState: container.get<IUseViewInvoiceState>(SYMBOLS.States.Invoice.ViewInvoiceState),
  };
}
