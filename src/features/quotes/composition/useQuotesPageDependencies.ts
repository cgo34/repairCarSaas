import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { IUseQuotesState } from '@/features/quotes/presentation/types/IUseQuotesState';
import { IGenerateQuotePdfUseCase } from '@/features/quotes/application/useCases/GenerateQuotePdfUseCase';
import { IOrganizationProfileUseCase } from '@/features/organizations/application/useCases/OrganizationProfileUseCase';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';

export function useQuotesPageDependencies() {
  return {
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
    useQuoteState: container.get<IUseQuotesState>(SYMBOLS.States.Quote.GetQuotesUseCase),
    generatePdfUseCase: container.get<IGenerateQuotePdfUseCase>(SYMBOLS.UseCases.Quote.GenerateQuotePdfUseCase),
    organizationProfileUseCase: container.get<IOrganizationProfileUseCase>(SYMBOLS.UseCases.OrganizationProfileUseCase),
  };
}
