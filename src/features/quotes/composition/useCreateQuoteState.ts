import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { ICreateQuoteUseCase } from '@/features/quotes/application/useCases/CreateQuoteUseCase';
import { IInsertQuoteUseCase } from '@/features/quotes/application/useCases/InsertQuoteUseCase';
import { IGetDocumentStatusUseCase } from '@/features/documentStatuses/application/useCases/GetDocumentStatusUseCase';
import { IGarageUseCase } from '@/features/garages/application/useCases/GarageUseCase';
import { IOrganizationMemberUseCase } from '@/features/organizations/application/useCases/OrganizationMemberUseCase';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { createUseCreateQuoteState } from '@/features/quotes/presentation/composables/useCreateQuoteState';

export function useCreateQuoteState() {
  return createUseCreateQuoteState({
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
    createQuoteUseCase: container.get<ICreateQuoteUseCase>(SYMBOLS.UseCases.Quote.CreateQuoteUseCase),
    insertQuoteUseCase: container.get<IInsertQuoteUseCase>(SYMBOLS.UseCases.Quote.InsertQuoteUseCase),
    getDocumentStatusUseCase: container.get<IGetDocumentStatusUseCase>(SYMBOLS.UseCases.GetDocumentStatus),
    garageUseCase: container.get<IGarageUseCase>(SYMBOLS.UseCases.Garage),
    technicianUseCase: container.get<IOrganizationMemberUseCase>(SYMBOLS.UseCases.OrganizationMemberUseCase),
  });
}
