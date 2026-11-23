import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { ISubscriptionState } from '@/features/subscription/presentation/state/ISubscriptionState';
import { IGarageUseCase } from '@/features/garages/application/useCases/GarageUseCase';
import { IOrganizationMemberUseCase } from '@/features/organizations/application/useCases/OrganizationMemberUseCase';
import { IQuotesUseCase } from '@/features/quotes/application/useCases/GetQuotesUseCase';
import { IInvoicesUseCase } from '@/features/invoices/application/useCases/GetInvoicesUseCase';
import { ITechnicianGarageAccessRepository } from '@/features/technicians/application/ports/repositories/ITechnicianGarageAccessRepository';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { createUseAdminDashboardState } from '@/features/dashboard/presentation/composables/useAdminDashboardState';
import { IUseOrganizationProfileState } from '@/features/organizations/presentation/types/IUseOrganizationProfile';

export function useAdminDashboardState() {
  return createUseAdminDashboardState({
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
    subscriptionState: container.get<ISubscriptionState>(SYMBOLS.States.SubscriptionState),
    garageUseCase: container.get<IGarageUseCase>(SYMBOLS.UseCases.Garage),
    memberUseCase: container.get<IOrganizationMemberUseCase>(SYMBOLS.UseCases.OrganizationMemberUseCase),
    quotesUseCase: container.get<IQuotesUseCase>(SYMBOLS.UseCases.Quote.GetQuotesUseCase),
    invoicesUseCase: container.get<IInvoicesUseCase>(SYMBOLS.UseCases.Invoice.GetInvoicesUseCase),
    garageAccessRepo: container.get<ITechnicianGarageAccessRepository>(SYMBOLS.Repositories.TechnicianGarageAccessRepository),
    profileState: container.get<IUseOrganizationProfileState>(SYMBOLS.States.OrganizationProfileState),
  });
}
