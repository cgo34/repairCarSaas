import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { IUseInvoicesState } from '@/features/invoices/presentation/types/IUseInvoicesStates';
import { IGenerateInvoicePdfUseCase } from '@/features/invoices/application/useCases/GenerateInvoicePdfUseCase';
import { IOrganizationProfileUseCase } from '@/features/organizations/application/useCases/OrganizationProfileUseCase';
import { ISendInvoiceUseCase } from '@/features/invoices/application/useCases/SendInvoiceUseCase';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';

export function useInvoicesPageDependencies() {
  return {
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
    useInvoiceState: container.get<IUseInvoicesState>(SYMBOLS.States.Invoice.GetInvoicesUseCase),
    generatePdfUseCase: container.get<IGenerateInvoicePdfUseCase>(SYMBOLS.UseCases.Invoice.GenerateInvoicePdfUseCase),
    organizationProfileUseCase: container.get<IOrganizationProfileUseCase>(SYMBOLS.UseCases.OrganizationProfileUseCase),
    sendInvoiceUseCase: container.get<ISendInvoiceUseCase>(SYMBOLS.UseCases.Invoice.SendInvoiceUseCase),
  };
}
