import { IAuthState } from "@/features/auth/presentation/state/IAuthState";
import { IInvoicesUseCase } from '@/features/invoices/application/useCases/GetInvoicesUseCase';
import { IDeleteInvoiceUseCase } from '@/features/invoices/application/useCases/DeleteInvoiceUseCase';
import { IMarkInvoiceAsPaidUseCase } from '@/features/invoices/application/useCases/MarkInvoiceAsPaidUseCase';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { createUseInvoicesState } from '@/features/invoices/presentation/composables/useInvoicesState';

export function useInvoicesState() {
  return createUseInvoicesState({
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
    getInvoicesUseCase: container.get<IInvoicesUseCase>(SYMBOLS.UseCases.Invoice.GetInvoicesUseCase),
    deleteInvoiceUseCase: container.get<IDeleteInvoiceUseCase>(SYMBOLS.UseCases.Invoice.DeleteInvoiceUseCase),
    markInvoiceAsPaidUseCase: container.get<IMarkInvoiceAsPaidUseCase>(SYMBOLS.UseCases.Invoice.MarkInvoiceAsPaidUseCase),
  });
}
