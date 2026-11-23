import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { ICreateInvoiceUseCase } from '@/features/invoices/application/useCases/CreateInvoiceUseCase';
import { IInsertInvoiceUseCase } from '@/features/invoices/application/useCases/InsertInvoiceUseCase';
import { IGetDocumentStatusUseCase } from '@/features/documentStatuses/application/useCases/GetDocumentStatusUseCase';
import { IGarageUseCase } from '@/features/garages/application/useCases/GarageUseCase';
import { IOrganizationMemberUseCase } from '@/features/organizations/application/useCases/OrganizationMemberUseCase';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { createUseCreateInvoiceState } from '@/features/invoices/presentation/composables/useCreateInvoiceState';

export function useCreateInvoiceState() {
  return createUseCreateInvoiceState({
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
    createInvoiceUseCase: container.get<ICreateInvoiceUseCase>(SYMBOLS.UseCases.Invoice.CreateInvoiceUseCase),
    insertInvoiceUseCase: container.get<IInsertInvoiceUseCase>(SYMBOLS.UseCases.Invoice.InsertInvoiceUseCase),
    getDocumentStatusUseCase: container.get<IGetDocumentStatusUseCase>(SYMBOLS.UseCases.GetDocumentStatus),
    garageUseCase: container.get<IGarageUseCase>(SYMBOLS.UseCases.Garage),
    technicianUseCase: container.get<IOrganizationMemberUseCase>(SYMBOLS.UseCases.OrganizationMemberUseCase),
  });
}
