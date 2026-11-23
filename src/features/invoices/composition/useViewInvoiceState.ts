import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { IViewInvoiceUseCase } from '@/features/invoices/application/useCases/ViewInvoiceUseCase';
import { IGenerateInvoicePdfUseCase } from '@/features/invoices/application/useCases/GenerateInvoicePdfUseCase';
import { IOrganizationProfileUseCase } from '@/features/organizations/application/useCases/OrganizationProfileUseCase';
import { IDownloadService } from '@/shared/application/ports/IDownloadService';
import { ISendInvoiceUseCase } from '@/features/invoices/application/useCases/SendInvoiceUseCase';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { createUseViewInvoiceState } from '@/features/invoices/presentation/composables/useViewInvoiceState';

export function useViewInvoiceState() {
  return createUseViewInvoiceState({
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
    viewInvoiceUseCase: container.get<IViewInvoiceUseCase>(SYMBOLS.UseCases.Invoice.ViewInvoiceUseCase),
    generatePdfUseCase: container.get<IGenerateInvoicePdfUseCase>(SYMBOLS.UseCases.Invoice.GenerateInvoicePdfUseCase),
    organizationProfileUseCase: container.get<IOrganizationProfileUseCase>(SYMBOLS.UseCases.OrganizationProfileUseCase),
    downloadService: container.get<IDownloadService>(SYMBOLS.Services.DownloadService),
    sendInvoiceUseCase: container.get<ISendInvoiceUseCase>(SYMBOLS.UseCases.Invoice.SendInvoiceUseCase),
  });
}
