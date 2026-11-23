import { IUseCreateInvoiceState } from '@/features/invoices/presentation/types/IUseCreateInvoiceState';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';

export function useCreateInvoicePageDependencies() {
  return {
    useCreateInvoiceState: container.get<IUseCreateInvoiceState>(SYMBOLS.States.Invoice.CreateInvoiceState),
  };
}
