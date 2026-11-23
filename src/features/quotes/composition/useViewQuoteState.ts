import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { IViewQuoteUseCase } from '@/features/quotes/application/useCases/ViewQuoteUseCase';
import { IGenerateQuotePdfUseCase } from '@/features/quotes/application/useCases/GenerateQuotePdfUseCase';
import { IOrganizationProfileUseCase } from '@/features/organizations/application/useCases/OrganizationProfileUseCase';
import { IDownloadService } from '@/shared/application/ports/IDownloadService';
import { ISendQuoteUseCase } from '@/features/quotes/application/useCases/SendQuoteUseCase';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { createUseViewQuoteState } from '@/features/quotes/presentation/composables/useViewQuoteState';

export function useViewQuoteState() {
  return createUseViewQuoteState({
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
    viewQuoteUseCase: container.get<IViewQuoteUseCase>(SYMBOLS.UseCases.Quote.ViewQuoteUseCase),
    generatePdfUseCase: container.get<IGenerateQuotePdfUseCase>(SYMBOLS.UseCases.Quote.GenerateQuotePdfUseCase),
    organizationProfileUseCase: container.get<IOrganizationProfileUseCase>(SYMBOLS.UseCases.OrganizationProfileUseCase),
    downloadService: container.get<IDownloadService>(SYMBOLS.Services.DownloadService),
    sendQuoteUseCase: container.get<ISendQuoteUseCase>(SYMBOLS.UseCases.Quote.SendQuoteUseCase),
  });
}
